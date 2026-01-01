-- 1. Create SERVICE_REQUESTS Table
CREATE TYPE service_request_status AS ENUM ('pending', 'approved', 'rejected', 'in_progress', 'info_requested', 'cancelled');
CREATE TYPE service_type_enum AS ENUM ('manning', 'offshore', 'hse', 'supply');

CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_type service_type_enum NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  status service_request_status DEFAULT 'pending',
  admin_notes TEXT,
  client_response TEXT,
  client_responded_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Update PROJECTS Table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS service_request_id UUID REFERENCES service_requests(id),
ADD COLUMN IF NOT EXISTS contract_value DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS expected_completion_date DATE,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'; 

-- 3. Create PROJECT_VAULT_ACCESS Table
CREATE TABLE project_vault_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  internal_doc_id UUID REFERENCES internal_documents(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, internal_doc_id)
);

-- 4. Enable RLS
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_vault_access ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- SERVICE REQUESTS
-- Clients can CRUD their own requests (except DELETE usually, but let's allow Insert/Select/Update for response)
CREATE POLICY "Clients can view own requests" ON service_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM clients WHERE id = service_requests.client_id AND primary_contact_id = auth.uid())
  );

CREATE POLICY "Clients can create requests" ON service_requests
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM clients WHERE id = service_requests.client_id AND primary_contact_id = auth.uid())
  );

CREATE POLICY "Clients can update own requests (cancel/response)" ON service_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM clients WHERE id = service_requests.client_id AND primary_contact_id = auth.uid())
  );

CREATE POLICY "Admins have full access to requests" ON service_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management', 'editor', 'support'))
  );

-- PROJECTS (Update existing policies or ensure they exist)
-- Ensure Clients CANNOT Insert into projects (Already handled if no policy allows it, but let's be safe: Revoke if needed, or ensuring only Select is allowed)
-- Assuming existing policy "Clients can view own projects" covers SELECT.
-- We must ensure NO policy allows Client INSERT. 
-- (Migration 20241227000000 might have set some defaults, but let's be explicit if needed. Policies are restrictive by default).

-- PROJECT VAULT ACCESS & INTERNAL DOCS
-- Clients can see the link
CREATE POLICY "Clients view vault access for own projects" ON project_vault_access
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_vault_access.project_id AND client_id IN (
      SELECT id FROM clients WHERE primary_contact_id = auth.uid()
    ))
  );

-- Admins manage vault access
CREATE POLICY "Admins manage vault access" ON project_vault_access
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management'))
  );

-- UPDATE INTERNAL_DOCUMENTS POLICY
-- Allow clients to SEE internal docs IF they are linked to their project
CREATE POLICY "Clients view shared vault docs" ON internal_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_vault_access pva
      JOIN projects p ON p.id = pva.project_id
      WHERE pva.internal_doc_id = internal_documents.id
      AND p.client_id IN (SELECT id FROM clients WHERE primary_contact_id = auth.uid())
    )
  );

-- 6. Triggers for timestamps
CREATE TRIGGER update_service_requests_updated_at 
  BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
