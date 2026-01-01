-- =====================================================
-- TRACKING SYSTEM MIGRATION
-- Adds: tracking_code, metadata to projects
-- Adds: get_tracking_details secure RPC function
-- =====================================================

-- 1. ADD COLUMNS TO PROJECTS
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS tracking_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN projects.tracking_code IS 'Unique code for public tracking (e.g. IRS-8842-WX)';
COMMENT ON COLUMN projects.metadata IS 'Flexible metadata for project specifics (e.g. Origin, Destination, Vessel Name)';

-- 2. INDEX FOR FAST LOOKUP
CREATE INDEX IF NOT EXISTS idx_projects_tracking_code ON projects(tracking_code);

-- 3. SECURE RPC FUNCTION FOR PUBLIC TRACKING
-- This function allows unauthenticated access (public) but ONLY via this specific function
-- It returns a limited set of data to protect privacy.

CREATE OR REPLACE FUNCTION get_tracking_details(p_tracking_code TEXT)
RETURNS JSONB AS $$
DECLARE
  v_project projects%ROWTYPE;
  v_milestones JSONB;
BEGIN
  -- 1. Fetch Project
  SELECT * INTO v_project 
  FROM projects 
  WHERE tracking_code = p_tracking_code 
  LIMIT 1;
  
  IF v_project IS NULL THEN
    RETURN NULL;
  END IF;

  -- 2. Fetch Milestones
  SELECT jsonb_agg(
    jsonb_build_object(
      'milestone_name', milestone_name,
      'description', description,
      'status', CASE WHEN is_completed THEN 'Completed' ELSE 'Pending' END,
      'is_completed', is_completed,
      'due_date', due_date,
      'completed_at', updated_at, -- Approximation, ideally we'd have a completed_at column, but updated_at works for now if triggered
      'sort_order', sort_order
    ) ORDER BY sort_order ASC
  ) INTO v_milestones
  FROM project_milestones
  WHERE project_id = v_project.id;

  -- 3. Return Combined Data
  RETURN jsonb_build_object(
    'project_id', v_project.id,
    'tracking_code', v_project.tracking_code,
    'service_type', v_project.service_type,
    'status', v_project.status,
    'start_date', v_project.start_date,
    'end_date', v_project.end_date,
    'metadata', v_project.metadata,
    'milestones', COALESCE(v_milestones, '[]'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. GRANT EXECUTE TO PUBLIC
-- Ensure the function is accessible to anon users (public)
GRANT EXECUTE ON FUNCTION get_tracking_details(TEXT) TO anon, authenticated, service_role;
