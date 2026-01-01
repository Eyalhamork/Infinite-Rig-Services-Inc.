import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { EmployeeUpdate } from '@/types/database';

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
    const { id } = await context.params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return NextResponse.json(
                { error: 'Employee not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to fetch employee' },
            { status: 500 }
        );
    }

    // Update last_verified_at timestamp
    await supabase.rpc('update_employee_verification', { emp_id: id });

    return NextResponse.json({ employee: data });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    const { id } = await context.params;
    const supabase = await createClient();

    // Check if user is authenticated and has admin role
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || !['super_admin', 'management'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body: EmployeeUpdate = await request.json();

        const { data, error } = await supabase
            .from('employees')
            .update(body)
            .eq('employee_id', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Employee not found' },
                    { status: 404 }
                );
            }
            throw error;
        }

        return NextResponse.json({
            message: 'Employee updated successfully',
            employee: data,
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        return NextResponse.json(
            { error: 'Failed to update employee' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    const { id } = await context.params;
    const supabase = await createClient();

    // Check if user is authenticated and has admin role
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || !['super_admin', 'management'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await supabase
        .from('employees')
        .delete()
        .eq('employee_id', id);

    if (error) {
        return NextResponse.json(
            { error: 'Failed to delete employee' },
            { status: 500 }
        );
    }

    return NextResponse.json({ message: 'Employee deleted successfully' });
}
