-- =====================================================
-- EMERGENCY RLS FIX - RESTORE PROPER ACCESS
-- This script resets problematic RLS policies and ensures
-- proper access for admins, staff, and clients
-- =====================================================

-- =====================================================
-- STEP 1: FIX PROFILES TABLE RLS
-- =====================================================

-- Drop all existing profile policies to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins and management can view all profiles" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Ensure the helper function exists and works
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role::text FROM profiles WHERE id = user_id LIMIT 1;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO anon;

-- 1. Users can ALWAYS view their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Admins can view all profiles (using helper function to avoid recursion)
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id
    OR
    public.get_user_role(auth.uid()) IN ('super_admin', 'management')
  );

-- =====================================================
-- STEP 2: FIX CLIENTS TABLE RLS
-- =====================================================

DROP POLICY IF EXISTS "Clients can view own company" ON clients;
DROP POLICY IF EXISTS "Admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Admins can manage clients" ON clients;

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Clients can view their own company
CREATE POLICY "Clients can view own company" ON clients
  FOR SELECT USING (primary_contact_id = auth.uid());

-- Admins can view all clients
CREATE POLICY "Admins can view all clients" ON clients
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management', 'editor', 'support')
  );

-- Admins can manage (insert/update/delete) clients
CREATE POLICY "Admins can manage clients" ON clients
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management')
  );

-- =====================================================
-- STEP 3: FIX PROJECTS TABLE RLS
-- =====================================================

DROP POLICY IF EXISTS "Clients can view own projects" ON projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON projects;

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Clients can view their own projects
CREATE POLICY "Clients can view own projects" ON projects
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE primary_contact_id = auth.uid())
  );

-- Admins/Staff can view all projects
CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management', 'editor', 'support')
  );

-- Admins can manage projects
CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management')
  );

-- =====================================================
-- STEP 4: FIX PROJECT_DOCUMENTS TABLE RLS
-- =====================================================

DROP POLICY IF EXISTS "Clients view project docs" ON project_documents;
DROP POLICY IF EXISTS "Clients upload project docs" ON project_documents;
DROP POLICY IF EXISTS "Admins view all project docs" ON project_documents;
DROP POLICY IF EXISTS "Admins manage project docs" ON project_documents;

ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

-- Clients can view visible project documents
CREATE POLICY "Clients view project docs" ON project_documents
  FOR SELECT USING (
    is_client_visible = true
    AND EXISTS (
      SELECT 1 FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE p.id = project_documents.project_id
      AND c.primary_contact_id = auth.uid()
    )
  );

-- Clients can upload documents to their projects
CREATE POLICY "Clients upload project docs" ON project_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE p.id = project_documents.project_id
      AND c.primary_contact_id = auth.uid()
    )
    AND is_client_visible = true
  );

-- Admins/Staff can view all project documents
CREATE POLICY "Admins view all project docs" ON project_documents
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management', 'editor', 'support')
  );

-- Admins can manage project documents
CREATE POLICY "Admins manage project docs" ON project_documents
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('super_admin', 'management')
  );

-- =====================================================
-- STEP 5: FIX NOTIFICATIONS TABLE RLS
-- =====================================================

DROP POLICY IF EXISTS "Users view own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins view all notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- Only proceed if notifications table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    
    EXECUTE 'CREATE POLICY "Users view own notifications" ON notifications
      FOR SELECT USING (user_id = auth.uid())';
    
    EXECUTE 'CREATE POLICY "Users can update own notifications" ON notifications
      FOR UPDATE USING (user_id = auth.uid())';
      
    EXECUTE 'CREATE POLICY "Admins view all notifications" ON notifications
      FOR SELECT USING (
        public.get_user_role(auth.uid()) IN (''super_admin'', ''management'')
      )';
  END IF;
END $$;

-- =====================================================
-- STEP 6: FIX MILESTONES TABLE RLS
-- =====================================================

DROP POLICY IF EXISTS "Clients view project milestones" ON milestones;
DROP POLICY IF EXISTS "Admins view all milestones" ON milestones;
DROP POLICY IF EXISTS "Admins manage milestones" ON milestones;

-- Only proceed if milestones table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'milestones') THEN
    ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
    
    EXECUTE 'CREATE POLICY "Clients view project milestones" ON milestones
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM projects p
          JOIN clients c ON c.id = p.client_id
          WHERE p.id = milestones.project_id
          AND c.primary_contact_id = auth.uid()
        )
      )';
    
    EXECUTE 'CREATE POLICY "Admins view all milestones" ON milestones
      FOR SELECT USING (
        public.get_user_role(auth.uid()) IN (''super_admin'', ''management'', ''editor'', ''support'')
      )';
      
    EXECUTE 'CREATE POLICY "Admins manage milestones" ON milestones
      FOR ALL USING (
        public.get_user_role(auth.uid()) IN (''super_admin'', ''management'')
      )';
  END IF;
END $$;

-- =====================================================
-- STEP 7: VERIFY ADMIN USER HAS CORRECT ROLE
-- =====================================================

-- Update admin profile to ensure correct role
UPDATE profiles 
SET role = 'super_admin'
WHERE email = 'moh.admin@test.irs.com';

-- Update staff profile to ensure correct role
UPDATE profiles 
SET role = 'management'
WHERE email = 'moh.staff@test.irs.com';

-- Update client profile to ensure correct role
UPDATE profiles 
SET role = 'client'
WHERE email = 'moh.client@test.irs.com';

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check profiles
SELECT id, email, role, full_name FROM profiles 
WHERE email LIKE '%@test.irs.com';

-- Check the helper function works
SELECT public.get_user_role(id) as role_from_function, role as direct_role, email
FROM profiles 
WHERE email LIKE '%@test.irs.com';

-- Check policies are set
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('profiles', 'clients', 'projects')
ORDER BY tablename, policyname;
