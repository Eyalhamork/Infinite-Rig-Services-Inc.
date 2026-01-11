-- =====================================================
-- FIX ADMIN RLS POLICIES FOR CLIENTS TABLE
-- Run this SQL in Supabase SQL Editor to fix data visibility
-- =====================================================

-- =====================================================
-- STEP 1: FIX CLIENTS TABLE RLS POLICIES
-- Issue: Admin cannot see all clients in the dashboard
-- =====================================================

-- First, check existing policies
DO $$
BEGIN
  RAISE NOTICE 'Checking and fixing RLS policies for clients table...';
END $$;

-- Drop existing clients policies if they exist
DROP POLICY IF EXISTS "Clients can view own company" ON clients;
DROP POLICY IF EXISTS "Admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Admins can manage clients" ON clients;

-- Create comprehensive policies for clients table

-- 1. Clients can view their own company
CREATE POLICY "Clients can view own company" ON clients
  FOR SELECT USING (
    primary_contact_id = auth.uid()
  );

-- 2. Admins and management can view all clients
CREATE POLICY "Admins can view all clients" ON clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('super_admin', 'management')
    )
  );

-- 3. Admins and management can insert, update, delete clients
CREATE POLICY "Admins can manage clients" ON clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('super_admin', 'management')
    )
  );

-- =====================================================
-- STEP 2: VERIFY PROFILES TABLE RLS POLICIES
-- Make sure admins can see all profiles
-- =====================================================

-- Drop and recreate profiles policies to ensure they work
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins and management can view all profiles" ON profiles;

-- 1. Users can always view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Admins and management can view all profiles
-- Using direct lookup to avoid recursive issues
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id
    OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('super_admin', 'management')
    )
  );

-- =====================================================
-- STEP 3: FIX PROJECTS TABLE RLS POLICIES
-- Ensure clients can see their projects
-- =====================================================

DROP POLICY IF EXISTS "Clients can view own projects" ON projects;
DROP POLICY IF EXISTS "Staff can view all projects" ON projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON projects;

-- Clients can view projects linked to their client company
CREATE POLICY "Clients can view own projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clients c
      WHERE c.id = projects.client_id
      AND c.primary_contact_id = auth.uid()
    )
  );

-- Staff (editors, support) can view all projects
CREATE POLICY "Staff can view all projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('super_admin', 'management', 'editor', 'support')
    )
  );

-- Admins can manage projects
CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('super_admin', 'management')
    )
  );

-- =====================================================
-- VERIFICATION QUERIES
-- Run these to verify the fix worked
-- =====================================================

-- Check all policies on clients table
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'clients';

-- Check all policies on profiles table
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Count users by role (should show admin, management, editor, support, client)
SELECT role, COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY role;

-- List all clients
SELECT id, company_name, email, is_active
FROM clients;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
