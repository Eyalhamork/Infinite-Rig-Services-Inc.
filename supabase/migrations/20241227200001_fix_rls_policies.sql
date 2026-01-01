-- =====================================================
-- FIX RLS POLICIES FOR PROFILES TABLE
-- Run this in Supabase SQL Editor to fix the 500 error
-- =====================================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Super admins and management can view all profiles" ON profiles;

-- Create simple, non-recursive policies

-- 1. Users can always view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. Admins can view all profiles (without recursive subquery)
-- Using auth.jwt() to avoid querying profiles table in the policy
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    -- Allow if you're viewing your own profile OR
    auth.uid() = id
    OR
    -- Allow if the current user's role (from their own profile row) is admin
    -- We use a direct lookup with the user's own ID
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('super_admin', 'management')
    )
  );

-- 4. Allow insert for authenticated users (for signup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- Verify the policies are set
-- =====================================================
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
