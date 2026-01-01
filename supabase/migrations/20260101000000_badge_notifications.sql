-- Migration: Create Notification Triggers

-- 1. Helper function to notify admins
CREATE OR REPLACE FUNCTION notify_admins(
  p_type VARCHAR,
  p_title VARCHAR,
  p_message VARCHAR,
  p_link VARCHAR
) RETURNS VOID AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  SELECT id, p_type, p_title, p_message, p_link
  FROM profiles 
  WHERE role IN ('super_admin', 'management', 'editor', 'support');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger for New Applications
CREATE OR REPLACE FUNCTION on_new_application()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_admins(
    'application',
    'New Job Application',
    'New application received from ' || (SELECT full_name FROM profiles WHERE id = NEW.applicant_id),
    '/dashboard/applications/' || NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_new_application ON applications;
CREATE TRIGGER trigger_new_application
  AFTER INSERT ON applications
  FOR EACH ROW EXECUTE FUNCTION on_new_application();

-- 3. Trigger for New Service Requests
CREATE OR REPLACE FUNCTION on_new_service_request()
RETURNS TRIGGER AS $$
DECLARE
  v_client_name TEXT;
BEGIN
  SELECT company_name INTO v_client_name FROM clients WHERE id = NEW.client_id;
  
  PERFORM notify_admins(
    'service_request',
    'New Service Request',
    'New ' || NEW.service_type || ' request from ' || v_client_name,
    '/dashboard/requests'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_new_service_request ON service_requests;
CREATE TRIGGER trigger_new_service_request
  AFTER INSERT ON service_requests
  FOR EACH ROW EXECUTE FUNCTION on_new_service_request();

-- 4. Update Message Trigger (Handle Admin -> Client)
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  v_client_user_id UUID;
BEGIN
  -- If client sends, notify admins
  IF NEW.sender_type = 'client' THEN
    PERFORM notify_admins(
      'message',
      'New Client Message',
      'New message regarding project',
      '/dashboard/messages/' || NEW.client_id
    );
  
  -- If staff sends, notify client
  ELSIF NEW.sender_type = 'staff' THEN
    SELECT primary_contact_id INTO v_client_user_id FROM clients WHERE id = NEW.client_id;
    
    IF v_client_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        v_client_user_id, 
        'message', 
        'New Message from Staff',
        'You have a new message from the team.',
        '/portal/messages'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger already exists on project_messages, this updates the function it uses.

-- 5. Trigger for Service Request Status Updates (Notify Client)
CREATE OR REPLACE FUNCTION on_service_request_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_client_user_id UUID;
  v_title TEXT;
BEGIN
  IF OLD.status <> NEW.status THEN
    SELECT primary_contact_id INTO v_client_user_id FROM clients WHERE id = NEW.client_id;
    
    IF v_client_user_id IS NOT NULL THEN
      v_title := 'Service Request ' || INITCAP(REPLACE(NEW.status::text, '_', ' '));
      
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        v_client_user_id,
        'service_request',
        v_title,
        'Your request status has been updated to ' || NEW.status,
        '/portal/requests'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_service_request_status ON service_requests;
CREATE TRIGGER trigger_service_request_status
  AFTER UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION on_service_request_status_change();
