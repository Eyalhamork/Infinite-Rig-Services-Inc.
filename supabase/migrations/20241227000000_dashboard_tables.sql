-- =====================================================
-- DASHBOARD TABLES MIGRATION
-- Project messages, documents hub, staff metrics, notifications
-- =====================================================

-- =====================================================
-- PROJECT MESSAGES (Client-Staff Communication)
-- =====================================================

CREATE TABLE IF NOT EXISTS project_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('client', 'staff')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_by UUID REFERENCES profiles(id),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_messages_project ON project_messages(project_id);
CREATE INDEX idx_project_messages_client ON project_messages(client_id);
CREATE INDEX idx_project_messages_unread ON project_messages(is_read) WHERE is_read = false;

-- =====================================================
-- COMPANY DOCUMENTS HUB
-- =====================================================

CREATE TABLE IF NOT EXISTS company_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  category VARCHAR(100) NOT NULL, -- License, Certificate, Policy, Contract, Insurance, etc.
  tags TEXT[],
  version INTEGER DEFAULT 1,
  previous_version_id UUID REFERENCES company_documents(id),
  is_confidential BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_documents_category ON company_documents(category);
CREATE INDEX idx_company_documents_confidential ON company_documents(is_confidential);

-- =====================================================
-- DOCUMENT SHARES (Track shared links)
-- =====================================================

CREATE TABLE IF NOT EXISTS document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES company_documents(id) ON DELETE CASCADE,
  share_token VARCHAR(64) UNIQUE NOT NULL,
  shared_by UUID REFERENCES profiles(id),
  shared_via VARCHAR(50), -- whatsapp, email, link, facebook
  recipient_info TEXT, -- Optional: who it was shared with
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_document_shares_token ON document_shares(share_token);
CREATE INDEX idx_document_shares_document ON document_shares(document_id);

-- =====================================================
-- DOCUMENT ACCESS LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS document_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES company_documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  share_id UUID REFERENCES document_shares(id),
  action VARCHAR(50) NOT NULL, -- view, download, share
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_document_access_logs_document ON document_access_logs(document_id);

-- =====================================================
-- STAFF METRICS
-- =====================================================

CREATE TABLE IF NOT EXISTS staff_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  messages_handled INTEGER DEFAULT 0,
  total_response_time_minutes INTEGER DEFAULT 0, -- Cumulative for calculating average
  applications_reviewed INTEGER DEFAULT 0,
  contacts_handled INTEGER DEFAULT 0,
  quotes_processed INTEGER DEFAULT 0,
  documents_uploaded INTEGER DEFAULT 0,
  news_published INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_staff_metrics_staff ON staff_metrics(staff_id);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- application, contact, quote, message, document, system
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link TEXT, -- URL to navigate to
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- =====================================================
-- EMPLOYEE DIRECTORY (extends profiles)
-- =====================================================

CREATE TABLE IF NOT EXISTS employee_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  employee_id VARCHAR(50) UNIQUE, -- e.g., IRS-001
  position VARCHAR(255),
  department VARCHAR(100),
  date_joined DATE,
  employment_type VARCHAR(50), -- Full-time, Part-time, Contract
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  address TEXT,
  date_of_birth DATE,
  is_public BOOLEAN DEFAULT true, -- Show on public team page
  bio TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employee_details_profile ON employee_details(profile_id);
CREATE INDEX idx_employee_details_department ON employee_details(department);

-- =====================================================
-- UPDATE NEWS_POSTS TABLE (add approval workflow)
-- =====================================================

ALTER TABLE news_posts 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_details ENABLE ROW LEVEL SECURITY;

-- Project Messages Policies
CREATE POLICY "Staff can view all messages" ON project_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'management', 'editor', 'support')
    )
  );

CREATE POLICY "Clients can view own messages" ON project_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clients c
      WHERE c.id = project_messages.client_id
      AND c.primary_contact_id = auth.uid()
    )
  );

CREATE POLICY "Staff can send messages" ON project_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'management', 'editor', 'support')
    )
  );

CREATE POLICY "Clients can send messages" ON project_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients c
      WHERE c.id = project_messages.client_id
      AND c.primary_contact_id = auth.uid()
    )
  );

-- Company Documents Policies
CREATE POLICY "Staff can view non-confidential documents" ON company_documents
  FOR SELECT USING (
    (is_confidential = false AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'management', 'editor', 'support')
    ))
    OR
    (EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'management')
    ))
  );

CREATE POLICY "Admin can manage documents" ON company_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'management')
    )
  );

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Staff Metrics Policies
CREATE POLICY "Staff can view own metrics" ON staff_metrics
  FOR SELECT USING (staff_id = auth.uid());

CREATE POLICY "Admin can view all metrics" ON staff_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'management')
    )
  );

-- Employee Details Policies
CREATE POLICY "Public employee details" ON employee_details
  FOR SELECT USING (is_public = true);

CREATE POLICY "Staff can view all employees" ON employee_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'management', 'editor', 'support')
    )
  );

CREATE POLICY "Admin can manage employees" ON employee_details
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'management')
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to increment staff metrics
CREATE OR REPLACE FUNCTION increment_staff_metric(
  p_staff_id UUID,
  p_metric VARCHAR(50),
  p_value INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO staff_metrics (staff_id)
  VALUES (p_staff_id)
  ON CONFLICT (staff_id) DO NOTHING;

  EXECUTE format(
    'UPDATE staff_metrics SET %I = %I + $1, last_activity_at = NOW(), updated_at = NOW() WHERE staff_id = $2',
    p_metric, p_metric
  ) USING p_value, p_staff_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type VARCHAR(50),
  p_title VARCHAR(255),
  p_message TEXT DEFAULT NULL,
  p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (p_user_id, p_type, p_title, p_message, p_link)
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS VARCHAR(64) AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update timestamps
CREATE TRIGGER update_company_documents_updated_at 
  BEFORE UPDATE ON company_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_metrics_updated_at 
  BEFORE UPDATE ON staff_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_details_updated_at 
  BEFORE UPDATE ON employee_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Notify on new message
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- If client sends, notify all staff with management/admin role
  IF NEW.sender_type = 'client' THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    SELECT id, 'message', 'New Client Message', 
           'New message from client', '/dashboard/messages/' || NEW.client_id
    FROM profiles 
    WHERE role IN ('super_admin', 'management');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_project_message
  AFTER INSERT ON project_messages
  FOR EACH ROW EXECUTE FUNCTION notify_new_message();
