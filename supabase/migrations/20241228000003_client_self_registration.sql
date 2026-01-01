-- =====================================================
-- RLS POLICIES FOR CLIENT SELF-REGISTRATION
-- Run this to allow clients to create their own records during signup
-- =====================================================

-- Allow authenticated users to insert their own client company record
DROP POLICY IF EXISTS "Users can insert own client" ON clients;

CREATE POLICY "Users can insert own client" ON clients
  FOR INSERT WITH CHECK (
    -- Allow insert if the primary_contact_id matches the authenticated user
    primary_contact_id = auth.uid()
  );

-- Also allow clients to update their own company record
DROP POLICY IF EXISTS "Clients can update own company" ON clients;

CREATE POLICY "Clients can update own company" ON clients
  FOR UPDATE USING (
    primary_contact_id = auth.uid()
  );

-- Verify client policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'clients'
ORDER BY policyname;
