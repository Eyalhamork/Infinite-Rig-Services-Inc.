-- Create job_status enum (safely)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
        CREATE TYPE public.job_status AS ENUM ('draft', 'published', 'closed', 'filled');
    END IF;
END
$$;

-- Create job_postings table (safely)
CREATE TABLE IF NOT EXISTS public.job_postings (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    title character varying(255) NOT NULL,
    department character varying(100) NOT NULL,
    location character varying(255) NOT NULL,
    employment_type character varying(50) NOT NULL,
    experience_level character varying(50) NULL,
    salary_range character varying(100) NULL,
    description text NOT NULL,
    requirements text NOT NULL, -- Stored as newline-separated text
    responsibilities text NULL, -- Stored as newline-separated text
    benefits text NULL, -- Stored as newline-separated text
    qualifications text NULL, -- Added to support UI, stored as newline-separated text
    status public.job_status NULL DEFAULT 'draft'::job_status,
    closing_date date NULL,
    positions_available integer NULL DEFAULT 1,
    created_by uuid NULL,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT job_postings_pkey PRIMARY KEY (id),
    CONSTRAINT job_postings_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles (id)
) TABLESPACE pg_default;

-- Add qualifications column if it doesn't exist (Handling "Patch" scenario)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_postings' AND column_name = 'qualifications') THEN
        ALTER TABLE public.job_postings ADD COLUMN qualifications text NULL;
    END IF;
END $$;

-- Create indexes (safely)
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_job_postings_department ON public.job_postings USING btree (department) TABLESPACE pg_default;

-- Create trigger for updated_at (safely)
DROP TRIGGER IF EXISTS update_job_postings_updated_at ON job_postings;
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Create policies (drop first to ensure idempotency)

-- 1. Public View Policy
DROP POLICY IF EXISTS "Public can view published jobs" ON public.job_postings;
CREATE POLICY "Public can view published jobs" ON public.job_postings
    FOR SELECT
    USING (status = 'published');

-- 2. Admin Management Policy
-- Uses 'super_admin' and 'management' roles based on 20241228000000_fix_admin_rls_policies.sql
DROP POLICY IF EXISTS "Admins and Staff can manage all jobs" ON public.job_postings;
CREATE POLICY "Admins and Staff can manage all jobs" ON public.job_postings
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM profiles
            WHERE role IN ('super_admin', 'management')
        )
    );
