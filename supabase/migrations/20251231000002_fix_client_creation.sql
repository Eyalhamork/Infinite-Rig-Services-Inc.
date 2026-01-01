-- =====================================================
-- FIX CLIENT CREATION & BACKFILL
-- 1. Update the Trigger to be more robust
-- 2. Backfill missing client records for existing profiles
-- =====================================================

-- 1. Redefine the function to be safer and more verbose with defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_company_name text;
  v_phone text;
  v_full_name text;
BEGIN
  -- Extract metadata with defaults
  v_company_name := COALESCE(new.raw_user_meta_data->>'company_name', 'Pending Company Setup');
  v_phone := COALESCE(new.raw_user_meta_data->>'phone', '');
  v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', 'New User');

  -- Insert Profile (Always force role='client' for public signups if not specified/admin)
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
    new.id,
    new.email,
    v_full_name,
    'client', -- Enforce client role for auth.users created via this path
    v_phone,
    v_company_name,
    true
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent errors if profile exists

  -- Insert Client Company Record
  -- Logic: Every 'client' user represents a potential Client Company in this context.
  IF v_company_name IS NOT NULL THEN
    INSERT INTO public.clients (
      company_name,
      email,
      phone,
      primary_contact_id,
      is_active,
      industry,
      country
    )
    VALUES (
      v_company_name,
      new.email,
      v_phone,
      new.id,
      true,
      'Other', -- Default industry
      'Liberia' -- Default country
    )
    ON CONFLICT DO NOTHING; -- Avoid duplicates if company exists (though usually 1:1 for signup)
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Backfill Script (Run once immediately)
DO $$
DECLARE
  missing_client RECORD;
BEGIN
  -- Find profiles with role 'client' that definitely DO NOT have a matching client record (by primary_contact_id)
  FOR missing_client IN
    SELECT p.id, p.email, p.company_name, p.phone, p.full_name
    FROM public.profiles p
    LEFT JOIN public.clients c ON p.id = c.primary_contact_id
    WHERE p.role = 'client' AND c.id IS NULL
  LOOP
    -- Insert the missing client record
    INSERT INTO public.clients (
      company_name,
      email,
      phone,
      primary_contact_id,
      is_active,
      industry,
      country
    )
    VALUES (
      COALESCE(missing_client.company_name, 'Company for ' || missing_client.full_name),
      missing_client.email,
      missing_client.phone,
      missing_client.id,
      true,
      'Other',
      'Liberia'
    );
  END LOOP;
END $$;
