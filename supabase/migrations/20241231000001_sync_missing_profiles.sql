-- =====================================================
-- SYNC MISSING PROFILES SCRIPT
-- Run this in Supabase SQL Editor to fix users who have
-- an Auth account but no Profile record.
-- =====================================================

DO $$
DECLARE
  missing_user RECORD;
  count_fixed INTEGER := 0;
BEGIN
  -- Loop through all auth users who do NOT have a profile
  FOR missing_user IN
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE p.id IS NULL
  LOOP
    -- Insert a profile for them
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      role,
      phone,
      company_name,
      is_active
    )
    VALUES (
      missing_user.id,
      missing_user.email,
      COALESCE(missing_user.raw_user_meta_data->>'full_name', 'Unknown User'),
      'client', -- Default to client to be safe
      COALESCE(missing_user.raw_user_meta_data->>'phone', ''),
      COALESCE(missing_user.raw_user_meta_data->>'company_name', ''),
      true
    );
    
    count_fixed := count_fixed + 1;
  END LOOP;
  
  RAISE NOTICE 'Fixed % missing profiles.', count_fixed;
END $$;
