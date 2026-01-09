-- =====================================================
-- FIX MESSAGING AND NOTIFICATIONS
-- 1. Fix broken notification link for admin
-- 2. Ensure general team messages are visible to clients
-- =====================================================

-- 1. Update notification trigger with correct URL
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  v_client_user_id UUID;
BEGIN
  -- If client sends, notify all staff with management/admin role
  IF NEW.sender_type = 'client' THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    SELECT id, 'message', 'New Client Message', 
           'New message from client', '/dashboard/messages?client_id=' || NEW.client_id
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

-- 2. Ensure clients can view messages with NULL project_id (General messages)
-- The existing policy "Clients can view own messages" checks client_id, which is correct.
-- No RLS change needed, just frontend logic update.
