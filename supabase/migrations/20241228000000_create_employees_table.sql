-- Create employees table for ID verification
-- Run this migration in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    photo_url TEXT,
    employment_status TEXT NOT NULL DEFAULT 'active' CHECK (employment_status IN ('active', 'inactive', 'terminated')),
    card_issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    card_expiry_date DATE,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on employee_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON public.employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(employment_status);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Public read policy for verification (anyone can verify an employee)
CREATE POLICY "Allow public read for verification"
    ON public.employees
    FOR SELECT
    USING (true);

-- Only authenticated admins can insert/update/delete
CREATE POLICY "Only admins can modify employees"
    ON public.employees
    FOR ALL
    USING (
        auth.jwt() ->> 'role' IN ('super_admin', 'management')
    );

-- Function to update last_verified_at timestamp
CREATE OR REPLACE FUNCTION public.update_employee_verification(emp_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.employees
    SET last_verified_at = NOW()
    WHERE employee_id = emp_id;
END;
$$;

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.handle_employees_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Drop trigger if exists to avoid conflicts
DROP TRIGGER IF EXISTS set_employees_updated_at ON public.employees;

CREATE TRIGGER set_employees_updated_at
    BEFORE UPDATE ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_employees_updated_at();
