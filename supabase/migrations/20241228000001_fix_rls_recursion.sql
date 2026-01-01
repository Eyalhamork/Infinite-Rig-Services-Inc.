-- =====================================================
-- EMERGENCY FIX: PROFILES TABLE RLS INFINITE RECURSION
-- Run this FIRST to fix the immediate login issue
-- =====================================================

-- The problem: The "Admins can view all profiles" policy queries
-- the profiles table to check if user is admin, which triggers
-- the same policy, causing infinite recursion.

-- STEP 1: Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins and management can view all profiles" ON profiles;

-- STEP 2: Create SIMPLE non-recursive policies

-- Policy 1: Everyone can view their OWN profile (no recursion)
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Everyone can update their OWN profile (no recursion)  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy 3: Allow insert for new profiles (signup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- STEP 3: Create a HELPER FUNCTION that can be marked SECURITY DEFINER
-- This allows us to check roles without triggering RLS recursion

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role::text FROM profiles WHERE id = user_id LIMIT 1;
$$;

-- STEP 4: Now create admin policy using the helper function
-- The SECURITY DEFINER function bypasses RLS, avoiding recursion

CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    -- Always allow viewing own profile
    auth.uid() = id
    OR
    -- Allow admins to view all profiles using the helper function
    public.get_user_role(auth.uid()) IN ('super_admin', 'management')
  );

-- =====================================================
-- FIX CLIENTS TABLE RLS AS WELL
-- =====================================================

DROP POLICY IF EXISTS "Clients can view own company" ON clients;
DROP POLICY IF EXISTS "Admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Admins can manage clients" ON clients;

-- Clients can view their own company
CREATE POLICY "Clients can view own company" ON clients
  FOR SELECT USING (primary_contact_id = auth.uid());

-- Admins can view all clients (using helper function)
CREATE POLICY "Admins can view all clients" ON clients
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management')
  );

-- Admins can manage (insert/update/delete) clients
CREATE POLICY "Admins can manage clients" ON clients
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management')
  );

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify the helper function works
SELECT public.get_user_role(auth.uid()) as current_user_role;

-- Check policies are set correctly
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('profiles', 'clients')
ORDER BY tablename, policyname;

-- =====================================================
-- TEST: This should now work without recursion
-- =====================================================
SELECT id, email, role FROM profiles LIMIT 5;
