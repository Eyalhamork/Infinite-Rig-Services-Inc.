import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sendPushNotification,
  sendBulkNotifications,
  NotificationPayload,
  PushSubscription,
} from '@/lib/push-notifications';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userIds, payload, broadcast } = body;

    if (!payload || !payload.title || !payload.body) {
      return NextResponse.json(
        { error: 'Invalid notification payload' },
        { status: 400 }
      );
    }

    // Verify API key for server-to-server calls
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.INTERNAL_API_KEY;

    // Only allow internal calls or authenticated admin users
    if (apiKey !== expectedKey) {
      // Check if user is admin
      const authHeader = request.headers.get('authorization');
      if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.replace('Bearer ', '');
      const {
        data: { user },
      } = await supabase.auth.getUser(token);

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Verify admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || !['super_admin', 'management'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    let subscriptions: PushSubscription[] = [];

    if (broadcast) {
      // Send to all subscriptions
      const { data } = await supabase
        .from('push_subscriptions')
        .select('endpoint, keys');

      subscriptions =
        data?.map((sub) => ({
          endpoint: sub.endpoint,
          keys: sub.keys as { p256dh: string; auth: string },
        })) || [];
    } else if (userIds && Array.isArray(userIds)) {
      // Send to multiple specific users
      const { data } = await supabase
        .from('push_subscriptions')
        .select('endpoint, keys')
        .in('user_id', userIds);

      subscriptions =
        data?.map((sub) => ({
          endpoint: sub.endpoint,
          keys: sub.keys as { p256dh: string; auth: string },
        })) || [];
    } else if (userId) {
      // Send to single user
      const { data } = await supabase
        .from('push_subscriptions')
        .select('endpoint, keys')
        .eq('user_id', userId);

      subscriptions =
        data?.map((sub) => ({
          endpoint: sub.endpoint,
          keys: sub.keys as { p256dh: string; auth: string },
        })) || [];
    }

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscriptions found',
        sent: 0,
      });
    }

    // Send notifications
    const results = await sendBulkNotifications(
      subscriptions,
      payload as NotificationPayload
    );

    // Clean up expired subscriptions
    if (results.expired.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', results.expired);
    }

    return NextResponse.json({
      success: true,
      sent: results.sent,
      failed: results.failed,
      expiredRemoved: results.expired.length,
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
