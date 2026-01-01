import webPush from 'web-push';

// Configure VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
let subject = process.env.VAPID_SUBJECT || 'mailto:info@infiniterigservices.com';
if (!subject.startsWith('mailto:') && !subject.startsWith('http')) {
  subject = `mailto:${subject}`;
}
const VAPID_SUBJECT = subject;

// Initialize web-push if keys are available
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
  data?: Record<string, any>;
}

/**
 * Send a push notification to a subscription
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  payload: NotificationPayload
): Promise<{ success: boolean; error?: string }> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return { success: false, error: 'VAPID keys not configured' };
  }

  try {
    const pushPayload = JSON.stringify({
      ...payload,
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: payload.badge || '/icons/badge-72x72.png',
    });

    await webPush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      pushPayload,
      {
        TTL: 60 * 60, // 1 hour
        urgency: 'normal',
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error('Push notification error:', error);

    // Handle expired/invalid subscriptions
    if (error.statusCode === 410 || error.statusCode === 404) {
      return { success: false, error: 'subscription_expired' };
    }

    return { success: false, error: error.message };
  }
}

/**
 * Send notification to multiple subscriptions
 */
export async function sendBulkNotifications(
  subscriptions: PushSubscription[],
  payload: NotificationPayload
): Promise<{ sent: number; failed: number; expired: string[] }> {
  const results = await Promise.allSettled(
    subscriptions.map((sub) => sendPushNotification(sub, payload))
  );

  const expired: string[] = [];
  let sent = 0;
  let failed = 0;

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      if (result.value.success) {
        sent++;
      } else {
        failed++;
        if (result.value.error === 'subscription_expired') {
          expired.push(subscriptions[index].endpoint);
        }
      }
    } else {
      failed++;
    }
  });

  return { sent, failed, expired };
}

/**
 * Notification templates for common scenarios
 */
export const notificationTemplates = {
  newMessage: (projectName: string, senderName: string): NotificationPayload => ({
    title: 'New Message',
    body: `${senderName} sent a message in ${projectName}`,
    icon: '/icons/icon-192x192.png',
    url: '/portal/messages',
    tag: 'new-message',
  }),

  applicationUpdate: (jobTitle: string, status: string): NotificationPayload => ({
    title: 'Application Status Update',
    body: `Your application for ${jobTitle} has been updated to: ${status}`,
    icon: '/icons/icon-192x192.png',
    url: '/dashboard/applications',
    tag: 'application-update',
  }),

  projectUpdate: (projectName: string, update: string): NotificationPayload => ({
    title: 'Project Update',
    body: `${projectName}: ${update}`,
    icon: '/icons/icon-192x192.png',
    url: '/portal/projects',
    tag: 'project-update',
  }),

  newApplication: (jobTitle: string, applicantName: string): NotificationPayload => ({
    title: 'New Job Application',
    body: `${applicantName} applied for ${jobTitle}`,
    icon: '/icons/icon-192x192.png',
    url: '/dashboard/applications',
    tag: 'new-application',
  }),

  newQuote: (serviceName: string, clientName: string): NotificationPayload => ({
    title: 'New Quote Request',
    body: `${clientName} requested a quote for ${serviceName}`,
    icon: '/icons/icon-192x192.png',
    url: '/dashboard/quotes',
    tag: 'new-quote',
  }),

  newContact: (subject: string): NotificationPayload => ({
    title: 'New Contact Submission',
    body: `New contact form submission: ${subject}`,
    icon: '/icons/icon-192x192.png',
    url: '/dashboard/contacts',
    tag: 'new-contact',
  }),
};

/**
 * Client-side: Check if push notifications are supported
 */
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Client-side: Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    throw new Error('Push notifications not supported');
  }

  return await Notification.requestPermission();
}

/**
 * Client-side: Subscribe to push notifications
 */
export async function subscribeToPush(): Promise<PushSubscriptionJSON | null> {
  if (!isPushSupported()) {
    throw new Error('Push notifications not supported');
  }

  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as any,
  });

  return subscription.toJSON();
}

/**
 * Client-side: Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) return false;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    return await subscription.unsubscribe();
  }

  return false;
}

/**
 * Convert VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
