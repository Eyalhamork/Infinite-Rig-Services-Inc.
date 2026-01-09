-- =====================================================
-- ENHANCE MILESTONE STATUS & LOGIC
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add STATUS column to project_milestones if not exists
ALTER TABLE project_milestones 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- 2. Migrate existing data (sync boolean is_completed to status)
UPDATE project_milestones 
SET status = 'completed' 
WHERE is_completed = true AND status = 'pending';

-- 3. Update generate function to ONLY add the FIRST milestone (Order 1)
-- and set it to 'in_progress' by default
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
  
  -- Insert ONLY the first milestone (Order 1)
  FOR v_milestone IN SELECT * FROM jsonb_array_elements(v_template.default_milestones)
  LOOP
    -- Check if it is the first order (assuming 1-based index in JSON data)
    IF (v_milestone->>'order')::INTEGER = 1 THEN
        INSERT INTO project_milestones (
          project_id,
          milestone_name,
          description,
          due_date,
          status,         -- New column
          is_completed,   -- Keep strictly for backward compatibility logic if needed (set to false)
          is_custom,
          created_by,
          sort_order
        )
        VALUES (
          p_project_id,
          v_milestone->>'name',
          v_milestone->>'description',
          v_base_date + (COALESCE((v_milestone->>'days_offset')::INTEGER, 0))::INTEGER,
          'in_progress',   -- Auto set to In Progress as requested
          false,
          false,
          auth.uid(),
          COALESCE((v_milestone->>'order')::INTEGER, 1)
        );
        
        v_count := v_count + 1;
    END IF;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
