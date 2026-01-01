-- =====================================================
-- NOTIFICATION TRIGGERS MIGRATION
-- Adds triggers for all key actions to create notifications
-- =====================================================

-- =====================================================
-- 1. SERVICE REQUEST NOTIFICATIONS
-- =====================================================

-- When client submits a service request -> Notify admins
CREATE OR REPLACE FUNCTION notify_new_service_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify all admins/management
  INSERT INTO notifications (user_id, type, title, message, link)
  SELECT 
    p.id,
    'request',
    'New Service Request',
    'A client has submitted a new ' || NEW.service_type || ' service request',
    '/dashboard/requests'
  FROM profiles p
  WHERE p.role IN ('super_admin', 'management');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_service_request ON service_requests;
CREATE TRIGGER on_new_service_request
  AFTER INSERT ON service_requests
  FOR EACH ROW EXECUTE FUNCTION notify_new_service_request();

-- When service request status changes -> Notify client
CREATE OR REPLACE FUNCTION notify_service_request_update()
RETURNS TRIGGER AS $$
DECLARE
  v_client_user_id UUID;
  v_notification_type VARCHAR(50);
  v_title VARCHAR(255);
  v_message TEXT;
  v_link TEXT;
BEGIN
  -- Only trigger on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get the client's user ID
  SELECT c.primary_contact_id INTO v_client_user_id
  FROM clients c
  WHERE c.id = NEW.client_id;

  IF v_client_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Set notification content based on new status
  CASE NEW.status
    WHEN 'approved' THEN
      v_notification_type := 'request_approved';
      v_title := 'Service Request Approved';
      v_message := 'Your ' || NEW.service_type || ' service request has been approved! A project has been created.';
      v_link := '/portal/projects';
    WHEN 'rejected' THEN
      v_notification_type := 'request_rejected';
      v_title := 'Service Request Update';
      v_message := 'Your ' || NEW.service_type || ' service request status has been updated.';
      v_link := '/portal/requests';
    WHEN 'info_requested' THEN
      v_notification_type := 'request_info';
      v_title := 'More Information Needed';
      v_message := 'Please provide additional information for your ' || NEW.service_type || ' request.';
      v_link := '/portal/requests';
    WHEN 'in_progress' THEN
      v_notification_type := 'request';
      v_title := 'Request In Progress';
      v_message := 'Your ' || NEW.service_type || ' service request is now being reviewed.';
      v_link := '/portal/requests';
    ELSE
      RETURN NEW;
  END CASE;

  -- Create notification for client
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (v_client_user_id, v_notification_type, v_title, v_message, v_link);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_service_request_update ON service_requests;
CREATE TRIGGER on_service_request_update
  AFTER UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION notify_service_request_update();

-- When client responds to info request -> Notify admins
CREATE OR REPLACE FUNCTION notify_client_response()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when client_response is added/changed
  IF OLD.client_response IS NOT DISTINCT FROM NEW.client_response THEN
    RETURN NEW;
  END IF;

  IF NEW.client_response IS NOT NULL AND NEW.status = 'info_requested' THEN
    -- Notify all admins/management
    INSERT INTO notifications (user_id, type, title, message, link)
    SELECT 
      p.id,
      'request_response',
      'Client Response Received',
      'A client has responded to an information request',
      '/dashboard/requests'
    FROM profiles p
    WHERE p.role IN ('super_admin', 'management');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_client_response ON service_requests;
CREATE TRIGGER on_client_response
  AFTER UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION notify_client_response();

-- =====================================================
-- 2. PROJECT NOTIFICATIONS
-- =====================================================

-- When new project is created -> Notify client
CREATE OR REPLACE FUNCTION notify_new_project()
RETURNS TRIGGER AS $$
DECLARE
  v_client_user_id UUID;
BEGIN
  -- Get the client's user ID
  SELECT c.primary_contact_id INTO v_client_user_id
  FROM clients c
  WHERE c.id = NEW.client_id;

  IF v_client_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      v_client_user_id,
      'project',
      'New Project Created',
      'A new project "' || NEW.project_name || '" has been created for you.',
      '/portal/projects/' || NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_project ON projects;
CREATE TRIGGER on_new_project
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION notify_new_project();

-- When milestone is completed -> Notify client
CREATE OR REPLACE FUNCTION notify_milestone_completed()
RETURNS TRIGGER AS $$
DECLARE
  v_client_user_id UUID;
  v_project_name VARCHAR(255);
BEGIN
  -- Only trigger when milestone is marked complete
  IF OLD.is_completed = true OR NEW.is_completed = false THEN
    RETURN NEW;
  END IF;

  -- Get project info and client
  SELECT p.project_name, c.primary_contact_id 
  INTO v_project_name, v_client_user_id
  FROM projects p
  JOIN clients c ON c.id = p.client_id
  WHERE p.id = NEW.project_id;

  IF v_client_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      v_client_user_id,
      'project_update',
      'Milestone Completed',
      'Milestone "' || NEW.milestone_name || '" has been completed for project "' || v_project_name || '"',
      '/portal/projects/' || NEW.project_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_milestone_completed ON project_milestones;
CREATE TRIGGER on_milestone_completed
  AFTER UPDATE ON project_milestones
  FOR EACH ROW EXECUTE FUNCTION notify_milestone_completed();

-- =====================================================
-- 3. MESSAGE NOTIFICATIONS (Update existing)
-- =====================================================

-- Updated function to also notify client when staff sends message
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  v_client_user_id UUID;
BEGIN
  -- If client sends, notify all staff with management/admin role
  IF NEW.sender_type = 'client' THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    SELECT id, 'message', 'New Client Message', 
           'New message from client', '/dashboard/messages/' || NEW.client_id
    FROM profiles 
    WHERE role IN ('super_admin', 'management');
  
  -- If staff sends, notify the client
  ELSIF NEW.sender_type = 'staff' THEN
    SELECT c.primary_contact_id INTO v_client_user_id
    FROM clients c
    WHERE c.id = NEW.client_id;

    IF v_client_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        v_client_user_id,
        'message',
        'New Message',
        'You have received a new message from the team',
        '/portal/messages'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. RLS POLICY FOR DELETE (if not exists)
-- =====================================================

-- Allow users to delete their own notifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' 
    AND policyname = 'Users can delete own notifications'
  ) THEN
    CREATE POLICY "Users can delete own notifications" ON notifications
      FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;

-- Allow system to insert notifications for any user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' 
    AND policyname = 'System can insert notifications'
  ) THEN
    CREATE POLICY "System can insert notifications" ON notifications
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;
