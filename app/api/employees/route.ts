import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { EmployeeInsert } from '@/types/database';

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const department = searchParams.get('department');

    let query = supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

    if (status && ['active', 'inactive', 'terminated'].includes(status)) {
        query = query.eq('employment_status', status);
    }

    if (department) {
        query = query.eq('department', department);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json(
            { error: 'Failed to fetch employees' },
            { status: 500 }
        );
    }

    return NextResponse.json({ employees: data });
}

export async function POST(request: NextRequest) {
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
        const body: EmployeeInsert = await request.json();

        // Validate required fields
        const requiredFields = [
            'employee_id',
            'full_name',
            'position',
            'department',
        ];
        for (const field of requiredFields) {
            if (!body[field as keyof EmployeeInsert]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        const { data, error } = await supabase
            .from('employees')
            .insert([body])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                // Unique violation
                return NextResponse.json(
                    { error: 'Employee ID already exists' },
                    { status: 409 }
                );
            }
            throw error;
        }

        return NextResponse.json(
            { message: 'Employee created successfully', employee: data },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating employee:', error);
        return NextResponse.json(
            { error: 'Failed to create employee' },
            { status: 500 }
        );
    }
}
