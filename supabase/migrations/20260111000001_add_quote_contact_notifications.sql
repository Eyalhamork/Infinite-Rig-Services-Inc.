-- =====================================================
-- 5. QUOTE & CONTACT FORM NOTIFICATIONS
-- =====================================================

-- When new quote is submitted -> Notify admins
CREATE OR REPLACE FUNCTION notify_new_quote_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify all admins/management
  INSERT INTO notifications (user_id, type, title, message, link)
  SELECT 
    p.id,
    'quote',
    'New Quote Request',
    'New quote request from ' || NEW.full_name || ' (' || NEW.service_area || ')',
    '/dashboard/quotes'
  FROM profiles p
  WHERE p.role IN ('super_admin', 'management');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_quote_submission ON quote_submissions;
CREATE TRIGGER on_new_quote_submission
  AFTER INSERT ON quote_submissions
  FOR EACH ROW EXECUTE FUNCTION notify_new_quote_submission();


-- When new contact form is submitted -> Notify admins
CREATE OR REPLACE FUNCTION notify_new_contact_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify all admins/management
  INSERT INTO notifications (user_id, type, title, message, link)
  SELECT 
    p.id,
    'contact',
    'New Contact Submission',
    'New contact message from ' || NEW.full_name || ': ' || NEW.subject,
    '/dashboard/contacts'
  FROM profiles p
  WHERE p.role IN ('super_admin', 'management');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_contact_submission ON contact_submissions;
CREATE TRIGGER on_new_contact_submission
  AFTER INSERT ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION notify_new_contact_submission();
