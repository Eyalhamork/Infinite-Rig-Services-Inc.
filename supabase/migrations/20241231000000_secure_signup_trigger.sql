-- =====================================================
-- SECURE SIGNUP FLOW
-- 1. Create a Trigger to handle new user creation securely
-- 2. Lock down RLS policies to prevent role manipulation
-- =====================================================

-- 1. Create Function to Handle New Users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_company_name text;
BEGIN
  -- Insert Profile (Always force role='client' for public signups)
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
    new.raw_user_meta_data->>'full_name',
    'client', -- SECURITY: Hardcoded enforcement
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'company_name',
    true
  );

  -- Insert Client Company Record (if company_name is provided)
  v_company_name := new.raw_user_meta_data->>'company_name';
  
  IF v_company_name IS NOT NULL AND v_company_name != '' THEN
    INSERT INTO public.clients (
      company_name,
      email,
      phone,
      primary_contact_id,
      is_active
    )
    VALUES (
      v_company_name,
      new.email, -- Use user's email as company email initially
      new.raw_user_meta_data->>'phone',
      new.id,
      true
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Lock down Profiles RLS
-- Remove the policy that allows users to insert their own profile
-- This forces all creation to go through the secure trigger
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 4. Lock down Clients RLS
-- Remove the policy that allows users to insert their own client record
DROP POLICY IF EXISTS "Users can insert own client" ON clients;
