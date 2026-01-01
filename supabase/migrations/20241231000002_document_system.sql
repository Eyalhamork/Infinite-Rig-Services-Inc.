-- =====================================================
-- DOCUMENT SYSTEM ARCHITECTURE MIGRATION
-- Implements the "Two-Zone" security model:
-- 1. Vault (Internal/Admin-Only)
-- 2. Project Workspace (Client-Admin Shared)
-- =====================================================

-- 1. SETUP STORAGE BUCKETS
-- We insert directly into storage.buckets to ensure they exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('vault', 'vault', false, 10485760, NULL), -- 10MB limit, Private
  ('projects', 'projects', false, 10485760, NULL) -- 10MB limit, Private
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 10485760;

-- 2. REFACTOR TABLES
-- We are replacing the old 'company_documents' with a more robust structure.
-- Dropping old table (assuming no critical production data yet per user conversation)
DROP TABLE IF EXISTS company_documents CASCADE;
DROP TABLE IF EXISTS document_shares CASCADE;
DROP TABLE IF EXISTS document_access_logs CASCADE;

-- -------------------------------------------------------------------------
-- TABLE: INTERNAL_DOCUMENTS (The Vault)
-- -------------------------------------------------------------------------
CREATE TABLE internal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  storage_path TEXT NOT NULL, -- Path in 'vault' bucket
  file_type TEXT,
  file_size INTEGER,
  category TEXT NOT NULL, -- 'Legal', 'Insurance', 'HR', 'Templates'
  is_confidential BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- TABLE: PROJECT_DOCUMENTS (The Workspace)
-- -------------------------------------------------------------------------
CREATE TABLE project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  storage_path TEXT NOT NULL, -- Path in 'projects' bucket
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES profiles(id),
  is_client_visible BOOLEAN DEFAULT TRUE, -- Admin can draft/hide files
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- TABLE: SHARED_DOCUMENT_LINKS (External Sharing)
-- -------------------------------------------------------------------------
CREATE TABLE shared_document_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_doc_id UUID REFERENCES internal_documents(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  access_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE internal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_document_links ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- ==========================
-- INTERNAL_DOCUMENTS POLICIES
-- ==========================
-- Only Admins/Staff can see/edit the Vault. Clients get NOTHING.
CREATE POLICY "Staff can view vault" ON internal_documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management', 'editor', 'support'))
  );

CREATE POLICY "Admin/Manager can edit vault" ON internal_documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management'))
  );

-- ==========================
-- PROJECT_DOCUMENTS POLICIES
-- ==========================
-- Staff can view/edit ALL project documents
CREATE POLICY "Staff can manage project docs" ON project_documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management', 'editor', 'support'))
  );

-- Clients can VIEW documents for their OWN projects if they are visible
CREATE POLICY "Clients can view own project docs" ON project_documents
  FOR SELECT USING (
    is_client_visible = true AND
    EXISTS (SELECT 1 FROM clients WHERE id = project_documents.client_id AND primary_contact_id = auth.uid())
  );

-- Clients can UPLOAD documents to their OWN projects
CREATE POLICY "Clients can upload to own project" ON project_documents
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM clients WHERE id = project_documents.client_id AND primary_contact_id = auth.uid())
  );

-- ==========================
-- STORAGE POLICIES (The Real Security)
-- ==========================

-- VAULT BUCKET: Strict Admin Only
CREATE POLICY "Staff Access Vault Bucket" ON storage.objects
  FOR ALL USING (
    bucket_id = 'vault' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management', 'editor', 'support'))
  );

-- PROJECTS BUCKET: Shared Access
-- Staff can do everything
CREATE POLICY "Staff Access Projects Bucket" ON storage.objects
  FOR ALL USING (
    bucket_id = 'projects' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management', 'editor', 'support'))
  );

-- Clients can VIEW files in 'projects' bucket if they belong to their client_id folder structure
-- *Assumption: We will store files as `projects/{client_id}/{project_id}/{filename}`*
CREATE POLICY "Client View Project Files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'projects' AND
    (storage.foldername(name))[1]::uuid IN (
      SELECT id FROM clients WHERE primary_contact_id = auth.uid()
    )
  );

-- Clients can UPLOAD files to 'projects' bucket
CREATE POLICY "Client Upload Project Files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'projects' AND
    (storage.foldername(name))[1]::uuid IN (
      SELECT id FROM clients WHERE primary_contact_id = auth.uid()
    )
  );
