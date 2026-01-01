-- =====================================================
-- PROJECT FEATURES EXPANSION MIGRATION
-- Adds: project_templates, project_updates, client_document_shares
-- Updates: project_milestones with custom milestone support
-- =====================================================

-- =====================================================
-- 1. PROJECT TEMPLATES (Milestone presets by service type)
-- =====================================================
CREATE TABLE project_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type service_type_enum UNIQUE NOT NULL,
  default_milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Format: [{"name": "...", "description": "...", "order": 1, "days_offset": 0}, ...]
  required_documents JSONB DEFAULT '[]'::jsonb,
  -- Format: [{"name": "...", "category": "..."}, ...]
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE project_templates IS 'Defines default milestones and required documents for each service type';
COMMENT ON COLUMN project_templates.default_milestones IS 'JSON array of milestone definitions with name, description, order, and days_offset from project start';
COMMENT ON COLUMN project_templates.required_documents IS 'JSON array of document types expected for this service type';

-- =====================================================
-- 2. PROJECT UPDATES (Activity Feed)
-- =====================================================
CREATE TABLE project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  update_type VARCHAR(50) NOT NULL CHECK (update_type IN (
    'project_created',
    'status_change',
    'milestone_complete',
    'milestone_added',
    'document_added',
    'document_removed',
    'note',
    'team_assigned'
  )),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  -- Flexible data: {milestone_id, document_id, old_status, new_status, etc.}
  created_by UUID REFERENCES profiles(id),
  is_client_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_updates_project ON project_updates(project_id);
CREATE INDEX idx_project_updates_project_visible ON project_updates(project_id, is_client_visible) 
  WHERE is_client_visible = true;
CREATE INDEX idx_project_updates_created ON project_updates(created_at DESC);

COMMENT ON TABLE project_updates IS 'Activity feed for projects, visible to clients based on is_client_visible flag';

-- =====================================================
-- 3. CLIENT DOCUMENT SHARES (Vault → Client, no project needed)
-- =====================================================
CREATE TABLE client_document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  internal_doc_id UUID REFERENCES internal_documents(id) ON DELETE CASCADE NOT NULL,
  note TEXT,
  -- Admin can add context: "Your requested insurance certificate"
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  -- Optional expiration for temporary shares
  UNIQUE(client_id, internal_doc_id)
);

CREATE INDEX idx_client_document_shares_client ON client_document_shares(client_id);
CREATE INDEX idx_client_document_shares_doc ON client_document_shares(internal_doc_id);

COMMENT ON TABLE client_document_shares IS 'Allows sharing vault documents with specific clients without requiring a project';

-- =====================================================
-- 4. ALTER PROJECT_MILESTONES (Custom milestone support)
-- =====================================================
ALTER TABLE project_milestones
  ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

COMMENT ON COLUMN project_milestones.is_custom IS 'True if milestone was manually added (not from template)';
COMMENT ON COLUMN project_milestones.sort_order IS 'Display order for milestones';

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_document_shares ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. RLS POLICIES
-- =====================================================

-- PROJECT TEMPLATES: Admin/Management can manage, Staff can view
CREATE POLICY "Staff can view templates" ON project_templates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management', 'editor', 'support'))
  );

CREATE POLICY "Admin can manage templates" ON project_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management'))
  );

-- PROJECT UPDATES: Staff see all, Clients see own projects (if visible)
CREATE POLICY "Staff can view all updates" ON project_updates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management', 'editor', 'support'))
  );

CREATE POLICY "Staff can create updates" ON project_updates
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management', 'editor', 'support'))
  );

CREATE POLICY "Clients can view own project updates" ON project_updates
  FOR SELECT USING (
    is_client_visible = true AND
    EXISTS (
      SELECT 1 FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE p.id = project_updates.project_id
      AND c.primary_contact_id = auth.uid()
    )
  );

-- CLIENT DOCUMENT SHARES: Admin manages, Clients view own shares
CREATE POLICY "Admin can manage client doc shares" ON client_document_shares
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'management'))
  );

CREATE POLICY "Clients can view own doc shares" ON client_document_shares
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM clients WHERE id = client_document_shares.client_id AND primary_contact_id = auth.uid())
  );

-- UPDATE INTERNAL_DOCUMENTS: Allow clients to see docs shared via client_document_shares
CREATE POLICY "Clients view docs shared via client_document_shares" ON internal_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM client_document_shares cds
      JOIN clients c ON c.id = cds.client_id
      WHERE cds.internal_doc_id = internal_documents.id
      AND c.primary_contact_id = auth.uid()
      AND (cds.expires_at IS NULL OR cds.expires_at > NOW())
    )
  );

-- =====================================================
-- 7. TRIGGERS & FUNCTIONS
-- =====================================================

-- Trigger: Update timestamps on project_templates
CREATE TRIGGER update_project_templates_updated_at
  BEFORE UPDATE ON project_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Create project update entry
CREATE OR REPLACE FUNCTION create_project_update(
  p_project_id UUID,
  p_update_type VARCHAR(50),
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_is_client_visible BOOLEAN DEFAULT true
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO project_updates (
    project_id, update_type, title, description, metadata, created_by, is_client_visible
  )
  VALUES (
    p_project_id, p_update_type, p_title, p_description, p_metadata, auth.uid(), p_is_client_visible
  )
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Auto-generate milestones from template
CREATE OR REPLACE FUNCTION generate_milestones_from_template(
  p_project_id UUID,
  p_service_type service_type_enum,
  p_start_date DATE DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_template project_templates%ROWTYPE;
  v_milestone JSONB;
  v_count INTEGER := 0;
  v_base_date DATE;
BEGIN
  -- Get template for this service type
  SELECT * INTO v_template FROM project_templates WHERE service_type = p_service_type;
  
  IF v_template IS NULL THEN
    RETURN 0; -- No template found
  END IF;
  
  -- Use provided start date or current date
  v_base_date := COALESCE(p_start_date, CURRENT_DATE);
  
  -- Insert each milestone from template
  FOR v_milestone IN SELECT * FROM jsonb_array_elements(v_template.default_milestones)
  LOOP
    INSERT INTO project_milestones (
      project_id,
      milestone_name,
      description,
      due_date,
      is_completed,
      is_custom,
      created_by,
      sort_order
    )
    VALUES (
      p_project_id,
      v_milestone->>'name',
      v_milestone->>'description',
      v_base_date + (COALESCE((v_milestone->>'days_offset')::INTEGER, 0))::INTEGER,
      false,
      false,
      auth.uid(),
      COALESCE((v_milestone->>'order')::INTEGER, v_count + 1)
    );
    
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Notify on milestone completion
CREATE OR REPLACE FUNCTION notify_milestone_complete()
RETURNS TRIGGER AS $$
DECLARE
  v_project projects%ROWTYPE;
  v_client_user_id UUID;
BEGIN
  -- Only fire when milestone transitions from incomplete to complete
  IF OLD.is_completed = false AND NEW.is_completed = true THEN
    -- Get project and client info
    SELECT * INTO v_project FROM projects WHERE id = NEW.project_id;
    
    IF v_project IS NOT NULL THEN
      -- Get client user ID
      SELECT c.primary_contact_id INTO v_client_user_id
      FROM clients c WHERE c.id = v_project.client_id;
      
      IF v_client_user_id IS NOT NULL THEN
        -- Create notification for client
        INSERT INTO notifications (user_id, type, title, message, link)
        VALUES (
          v_client_user_id,
          'project',
          'Milestone Completed',
          'Milestone "' || NEW.milestone_name || '" has been completed for project ' || v_project.project_name,
          '/portal/projects/' || NEW.project_id
        );
      END IF;
      
      -- Create project update entry
      INSERT INTO project_updates (
        project_id, update_type, title, description, metadata, created_by, is_client_visible
      )
      VALUES (
        NEW.project_id,
        'milestone_complete',
        'Milestone Completed: ' || NEW.milestone_name,
        NEW.description,
        jsonb_build_object('milestone_id', NEW.id, 'milestone_name', NEW.milestone_name),
        NEW.completed_by,
        true
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_milestone_complete
  AFTER UPDATE ON project_milestones
  FOR EACH ROW
  WHEN (OLD.is_completed = false AND NEW.is_completed = true)
  EXECUTE FUNCTION notify_milestone_complete();

-- =====================================================
-- 8. SEED DEFAULT TEMPLATES
-- =====================================================
INSERT INTO project_templates (service_type, default_milestones, required_documents) VALUES
(
  'manning',
  '[
    {"name": "Requirements Gathering", "description": "Collect crew specifications and certifications needed", "order": 1, "days_offset": 0},
    {"name": "Candidate Screening", "description": "Review and shortlist qualified candidates", "order": 2, "days_offset": 7},
    {"name": "Client Review", "description": "Present shortlisted candidates for client approval", "order": 3, "days_offset": 14},
    {"name": "Documentation & Contracts", "description": "Complete employment paperwork and contracts", "order": 4, "days_offset": 21},
    {"name": "Mobilization", "description": "Crew deployment and handover", "order": 5, "days_offset": 28}
  ]'::jsonb,
  '[
    {"name": "Crew Manifest", "category": "Operations"},
    {"name": "Certification Copies", "category": "Compliance"},
    {"name": "Employment Contracts", "category": "Legal"}
  ]'::jsonb
),
(
  'offshore',
  '[
    {"name": "Scope Definition", "description": "Define project scope and vessel requirements", "order": 1, "days_offset": 0},
    {"name": "Vessel Assignment", "description": "Allocate appropriate vessel and equipment", "order": 2, "days_offset": 7},
    {"name": "Safety Briefing", "description": "Conduct safety orientation and HSE review", "order": 3, "days_offset": 10},
    {"name": "Operations Commence", "description": "Begin offshore operations", "order": 4, "days_offset": 14},
    {"name": "Progress Report", "description": "Mid-project status and progress update", "order": 5, "days_offset": 30},
    {"name": "Demobilization", "description": "Complete operations and demobilize", "order": 6, "days_offset": 60}
  ]'::jsonb,
  '[
    {"name": "Operations Plan", "category": "Operations"},
    {"name": "Safety Documentation", "category": "HSE"},
    {"name": "Daily Reports", "category": "Reports"}
  ]'::jsonb
),
(
  'hse',
  '[
    {"name": "Initial Assessment", "description": "Conduct baseline HSE assessment", "order": 1, "days_offset": 0},
    {"name": "Gap Analysis", "description": "Identify compliance gaps and areas for improvement", "order": 2, "days_offset": 14},
    {"name": "Implementation Plan", "description": "Develop corrective action plan", "order": 3, "days_offset": 21},
    {"name": "Training Delivery", "description": "Conduct required HSE training sessions", "order": 4, "days_offset": 35},
    {"name": "Audit & Verification", "description": "Final audit and compliance verification", "order": 5, "days_offset": 60}
  ]'::jsonb,
  '[
    {"name": "Assessment Report", "category": "Reports"},
    {"name": "Training Certificates", "category": "Compliance"},
    {"name": "Audit Findings", "category": "Audit"}
  ]'::jsonb
),
(
  'supply',
  '[
    {"name": "Order Confirmation", "description": "Confirm order specifications and quantities", "order": 1, "days_offset": 0},
    {"name": "Procurement", "description": "Source and procure materials/equipment", "order": 2, "days_offset": 7},
    {"name": "Quality Check", "description": "Inspect items before shipment", "order": 3, "days_offset": 14},
    {"name": "Shipping", "description": "Dispatch items to destination", "order": 4, "days_offset": 17},
    {"name": "Delivery Confirmation", "description": "Confirm receipt and complete handover", "order": 5, "days_offset": 21}
  ]'::jsonb,
  '[
    {"name": "Purchase Order", "category": "Procurement"},
    {"name": "Delivery Note", "category": "Logistics"},
    {"name": "Invoice", "category": "Finance"}
  ]'::jsonb
)
ON CONFLICT (service_type) DO UPDATE SET
  default_milestones = EXCLUDED.default_milestones,
  required_documents = EXCLUDED.required_documents,
  updated_at = NOW();
