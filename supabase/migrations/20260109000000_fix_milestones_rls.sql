-- =====================================================
-- FIX RLS POLICIES FOR PROJECT MILESTONES
-- Run this in Supabase SQL Editor to resolve "new row violates row-level security policy"
-- and ensure clients can view their milestones.
-- =====================================================

-- Ensure RLS is enabled
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Staff can view all milestones" ON project_milestones;
DROP POLICY IF EXISTS "Admins can manage milestones" ON project_milestones;
DROP POLICY IF EXISTS "Staff can manage milestones" ON project_milestones;
DROP POLICY IF EXISTS "Clients can view own project milestones" ON project_milestones;

-- 1. Staff can view all milestones (for reading)
CREATE POLICY "Staff can view all milestones" ON project_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'management', 'editor', 'support')
    )
  );

-- 2. Admins and Management can manage milestones (Insert, Update, Delete)
CREATE POLICY "Admins can manage milestones" ON project_milestones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'management', 'editor')
    )
  );

-- 3. Clients can view milestones for their own projects
CREATE POLICY "Clients can view own project milestones" ON project_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE p.id = project_milestones.project_id
      AND c.primary_contact_id = auth.uid()
    )
  );

-- Verify policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'project_milestones';
