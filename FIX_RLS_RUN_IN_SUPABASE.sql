-- =====================================================
-- QUICK FIX: RUN THIS IN SUPABASE SQL EDITOR
-- Go to: Supabase Dashboard > SQL Editor > New Query
-- Paste this entire script and run it
-- =====================================================

-- 1. Drop problematic policies on profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins and management can view all profiles" ON profiles;

-- 2. Recreate the helper function (with SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role::text FROM profiles WHERE id = user_id LIMIT 1;
$$;

-- 3. Grant execute to all users
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO anon;

-- 4. Create simple working policies for profiles
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id
    OR
    public.get_user_role(auth.uid()) IN ('super_admin', 'management')
  );

-- 5. Fix clients table policies
DROP POLICY IF EXISTS "Clients can view own company" ON clients;
DROP POLICY IF EXISTS "Admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Admins can manage clients" ON clients;

CREATE POLICY "Clients can view own company" ON clients
  FOR SELECT USING (primary_contact_id = auth.uid());

CREATE POLICY "Admins can view all clients" ON clients
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management', 'editor', 'support')
  );

CREATE POLICY "Admins can manage clients" ON clients
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management')
  );

-- 6. Fix projects table policies
DROP POLICY IF EXISTS "Clients can view own projects" ON projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON projects;

CREATE POLICY "Clients can view own projects" ON projects
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE primary_contact_id = auth.uid())
  );

CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management', 'editor', 'support')
  );

CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management')
  );

-- 7. Ensure test users have correct roles
UPDATE profiles SET role = 'super_admin' WHERE email = 'moh.admin@test.irs.com';
UPDATE profiles SET role = 'management' WHERE email = 'moh.staff@test.irs.com';
UPDATE profiles SET role = 'client' WHERE email = 'moh.client@test.irs.com';

-- 8. Verify the fix
SELECT email, role, full_name FROM profiles WHERE email LIKE '%@test.irs.com';
SELECT public.get_user_role(id) as role_check, email FROM profiles WHERE email LIKE '%@test.irs.com';
