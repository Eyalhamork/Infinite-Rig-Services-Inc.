-- =====================================================
-- FIX DOCUMENT SHARING RLS
-- 1. Ensure clients can view the internal_documents rows they are shared
-- 2. Allow clients to download files from the 'vault' storage bucket
-- =====================================================

-- 1. FIX INTERNAL_DOCUMENTS RLS
-- Drop existing potential conflicting policies to ensure clean slate for client access
DROP POLICY IF EXISTS "Clients view docs shared via client_document_shares" ON internal_documents;
DROP POLICY IF EXISTS "Clients view shared vault docs" ON internal_documents;

-- Re-create the comprehensive client view policy
CREATE POLICY "Clients can view shared internal documents" ON internal_documents
  FOR SELECT USING (
    -- 1. Direct Shares
    EXISTS (
      SELECT 1 FROM client_document_shares cds
      JOIN clients c ON c.id = cds.client_id
      WHERE cds.internal_doc_id = internal_documents.id
      AND c.primary_contact_id = auth.uid()
      AND (cds.expires_at IS NULL OR cds.expires_at > NOW())
    )
    OR
    -- 2. Project Access
    EXISTS (
      SELECT 1 FROM project_vault_access pva
      JOIN projects p ON p.id = pva.project_id
      WHERE pva.internal_doc_id = internal_documents.id
      AND p.client_id IN (SELECT id FROM clients WHERE primary_contact_id = auth.uid())
    )
  );

-- 2. FIX STORAGE RLS FOR VAULT
-- Allow clients to download/view the actual files if they have database access
DROP POLICY IF EXISTS "Client View Shared Vault Files" ON storage.objects;

CREATE POLICY "Client View Shared Vault Files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'vault' AND
    EXISTS (
      SELECT 1 FROM internal_documents doc
      WHERE doc.storage_path = storage.objects.name
      AND (
        -- Check if user has access to this document row
        -- (Duplicating logic is safer than recursion, but checking table access is better if possible. 
        -- However, storage RLS runs independently. We must verify trust.)
        
        -- 1. Direct Shares
        EXISTS (
          SELECT 1 FROM client_document_shares cds
          JOIN clients c ON c.id = cds.client_id
          WHERE cds.internal_doc_id = doc.id
          AND c.primary_contact_id = auth.uid()
        )
        OR
        -- 2. Project Access
        EXISTS (
          SELECT 1 FROM project_vault_access pva
          JOIN projects p ON p.id = pva.project_id
          WHERE pva.internal_doc_id = doc.id
          AND p.client_id IN (SELECT id FROM clients WHERE primary_contact_id = auth.uid())
        )
      )
    )
  );

-- 3. Verify client_document_shares RLS for redundancy
-- (Ensure clients can actually read the share record itself to render the UI list)
DROP POLICY IF EXISTS "Clients can view own doc shares" ON client_document_shares;

CREATE POLICY "Clients can view own doc shares" ON client_document_shares
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM clients WHERE id = client_document_shares.client_id AND primary_contact_id = auth.uid())
  );
