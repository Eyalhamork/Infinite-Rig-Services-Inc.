-- =====================================================
-- DATABASE REFACTOR: REMOVE APPLICANT ROLE & CREATE TEST ACCOUNTS
-- Run this script in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: CREATE TEST ACCOUNTS IN AUTH.USERS
-- Using conditional inserts to avoid duplicates
-- =====================================================

-- Create Admin Test User (only if not exists)
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO admin_id FROM auth.users WHERE email = 'moh.admin@test.irs.com';
  
  IF admin_id IS NULL THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      raw_app_meta_data,
      aud,
      role,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    )
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'moh.admin@test.irs.com',
      crypt('TestPass123!', gen_salt('bf')),
      NOW(),
      '{"full_name": "Moh Hamork", "company_name": "Infinite Rig Services"}',
      '{"provider": "email", "providers": ["email"]}',
      'authenticated',
      'authenticated',
      NOW(),
      NOW(),
      '',
      ''
    );
    RAISE NOTICE 'Created admin user: moh.admin@test.irs.com';
  ELSE
    RAISE NOTICE 'Admin user already exists: moh.admin@test.irs.com';
  END IF;
END $$;

-- Create Staff Test User (only if not exists)
DO $$
DECLARE
  staff_id UUID;
BEGIN
  SELECT id INTO staff_id FROM auth.users WHERE email = 'moh.staff@test.irs.com';
  
  IF staff_id IS NULL THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      raw_app_meta_data,
      aud,
      role,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    )
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'moh.staff@test.irs.com',
      crypt('TestPass123!', gen_salt('bf')),
      NOW(),
      '{"full_name": "Hamork Moh", "department": "Operations"}',
      '{"provider": "email", "providers": ["email"]}',
      'authenticated',
      'authenticated',
      NOW(),
      NOW(),
      '',
      ''
    );
    RAISE NOTICE 'Created staff user: moh.staff@test.irs.com';
  ELSE
    RAISE NOTICE 'Staff user already exists: moh.staff@test.irs.com';
  END IF;
END $$;

-- Create Client Test User (only if not exists)
DO $$
DECLARE
  client_id UUID;
BEGIN
  SELECT id INTO client_id FROM auth.users WHERE email = 'moh.client@test.irs.com';
  
  IF client_id IS NULL THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      raw_app_meta_data,
      aud,
      role,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    )
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'moh.client@test.irs.com',
      crypt('TestPass123!', gen_salt('bf')),
      NOW(),
      '{"full_name": "Moh Client", "company_name": "Test Oil & Gas Ltd"}',
      '{"provider": "email", "providers": ["email"]}',
      'authenticated',
      'authenticated',
      NOW(),
      NOW(),
      '',
      ''
    );
    RAISE NOTICE 'Created client user: moh.client@test.irs.com';
  ELSE
    RAISE NOTICE 'Client user already exists: moh.client@test.irs.com';
  END IF;
END $$;

-- =====================================================
-- STEP 2: CREATE PROFILES FOR TEST USERS
-- =====================================================

-- Admin Profile
DO $$
DECLARE
  user_id UUID;
  profile_exists BOOLEAN;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'moh.admin@test.irs.com';
  
  IF user_id IS NOT NULL THEN
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = user_id) INTO profile_exists;
    
    IF NOT profile_exists THEN
      INSERT INTO profiles (id, email, full_name, role, department, phone, company_name, is_active)
      VALUES (
        user_id,
        'moh.admin@test.irs.com',
        'Moh Hamork',
        'super_admin',
        'Executive',
        '+231 88 191 5322',
        'Infinite Rig Services',
        true
      );
      RAISE NOTICE 'Created admin profile';
    ELSE
      UPDATE profiles SET
        role = 'super_admin',
        full_name = 'Moh Hamork',
        department = 'Executive',
        phone = '+231 88 191 5322'
      WHERE id = user_id;
      RAISE NOTICE 'Updated existing admin profile';
    END IF;
  END IF;
END $$;

-- Staff Profile
DO $$
DECLARE
  user_id UUID;
  profile_exists BOOLEAN;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'moh.staff@test.irs.com';
  
  IF user_id IS NOT NULL THEN
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = user_id) INTO profile_exists;
    
    IF NOT profile_exists THEN
      INSERT INTO profiles (id, email, full_name, role, department, phone, is_active)
      VALUES (
        user_id,
        'moh.staff@test.irs.com',
        'Hamork Moh',
        'management',
        'Operations',
        '+231 77 000 1234',
        true
      );
      RAISE NOTICE 'Created staff profile';
    ELSE
      UPDATE profiles SET
        role = 'management',
        full_name = 'Hamork Moh',
        department = 'Operations',
        phone = '+231 77 000 1234'
      WHERE id = user_id;
      RAISE NOTICE 'Updated existing staff profile';
    END IF;
  END IF;
END $$;

-- Client Profile
DO $$
DECLARE
  user_id UUID;
  profile_exists BOOLEAN;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'moh.client@test.irs.com';
  
  IF user_id IS NOT NULL THEN
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = user_id) INTO profile_exists;
    
    IF NOT profile_exists THEN
      INSERT INTO profiles (id, email, full_name, role, phone, company_name, is_active)
      VALUES (
        user_id,
        'moh.client@test.irs.com',
        'Moh Client',
        'client',
        '+1 555 123 4567',
        'Test Oil & Gas Ltd',
        true
      );
      RAISE NOTICE 'Created client profile';
    ELSE
      UPDATE profiles SET
        role = 'client',
        full_name = 'Moh Client',
        company_name = 'Test Oil & Gas Ltd',
        phone = '+1 555 123 4567'
      WHERE id = user_id;
      RAISE NOTICE 'Updated existing client profile';
    END IF;
  END IF;
END $$;

-- =====================================================
-- STEP 3: CREATE CLIENT COMPANY RECORD
-- =====================================================

DO $$
DECLARE
  user_id UUID;
  client_exists BOOLEAN;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'moh.client@test.irs.com';
  
  IF user_id IS NOT NULL THEN
    SELECT EXISTS(SELECT 1 FROM clients WHERE email = 'moh.client@test.irs.com') INTO client_exists;
    
    IF NOT client_exists THEN
      INSERT INTO clients (
        id,
        company_name,
        industry,
        primary_contact_id,
        address,
        country,
        phone,
        email,
        website,
        is_active,
        notes
      )
      VALUES (
        gen_random_uuid(),
        'Test Oil & Gas Ltd',
        'Oil & Gas Exploration',
        user_id,
        '123 Energy Drive, Houston, TX 77001',
        'United States',
        '+1 555 123 4567',
        'moh.client@test.irs.com',
        'https://testoilgas.example.com',
        true,
        'Test client account for dashboard testing - DELETE BEFORE LAUNCH'
      );
      RAISE NOTICE 'Created client company: Test Oil & Gas Ltd';
    ELSE
      RAISE NOTICE 'Client company already exists';
    END IF;
  END IF;
END $$;

-- =====================================================
-- STEP 4: CREATE SAMPLE PROJECT FOR CLIENT
-- =====================================================

DO $$
DECLARE
  client_id UUID;
  project_exists BOOLEAN;
BEGIN
  SELECT id INTO client_id FROM clients WHERE company_name = 'Test Oil & Gas Ltd';
  
  IF client_id IS NOT NULL THEN
    SELECT EXISTS(SELECT 1 FROM projects WHERE project_code = 'IRS-TEST-001') INTO project_exists;
    
    IF NOT project_exists THEN
      INSERT INTO projects (
        id,
        client_id,
        project_name,
        project_code,
        description,
        status,
        start_date,
        end_date,
        location,
        vessel_name,
        service_type,
        notes
      )
      VALUES (
        gen_random_uuid(),
        client_id,
        'Offshore Support - Test Project Alpha',
        'IRS-TEST-001',
        'Sample offshore drilling support project for testing the client portal dashboard.',
        'in_progress',
        CURRENT_DATE - INTERVAL '30 days',
        CURRENT_DATE + INTERVAL '60 days',
        'Gulf of Guinea, West Africa',
        'MV Ocean Pioneer',
        'Offshore',
        'Test project for portal demonstration - DELETE BEFORE LAUNCH'
      );
      RAISE NOTICE 'Created sample project: IRS-TEST-001';
    ELSE
      RAISE NOTICE 'Sample project already exists';
    END IF;
  END IF;
END $$;

-- =====================================================
-- STEP 5: MIGRATE EXISTING APPLICANT ROLES TO CLIENT
-- =====================================================

DO $$
DECLARE
  applicant_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO applicant_count FROM profiles WHERE role = 'applicant';
  IF applicant_count > 0 THEN
    RAISE NOTICE 'Found % profiles with applicant role. Updating to client role...', applicant_count;
    UPDATE profiles SET role = 'client' WHERE role = 'applicant';
    RAISE NOTICE 'Successfully updated % profiles from applicant to client role.', applicant_count;
  ELSE
    RAISE NOTICE 'No applicant profiles found. No migration needed.';
  END IF;
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify test users were created
SELECT 
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  created_at
FROM auth.users 
WHERE email LIKE '%@test.irs.com'
ORDER BY email;

-- Verify profiles were created with correct roles
SELECT 
  email,
  full_name,
  role,
  department,
  company_name,
  is_active
FROM profiles 
WHERE email LIKE '%@test.irs.com'
ORDER BY role;

-- Verify client company was created
SELECT 
  company_name,
  industry,
  email,
  is_active,
  notes
FROM clients 
WHERE email = 'moh.client@test.irs.com';

-- Verify no more applicant roles exist
SELECT COUNT(*) as applicant_count FROM profiles WHERE role = 'applicant';

-- =====================================================
-- CLEANUP SCRIPT (RUN BEFORE LAUNCH)
-- =====================================================

-- To delete all test accounts before launch, run:
/*
DELETE FROM projects WHERE project_code = 'IRS-TEST-001';
DELETE FROM clients WHERE email = 'moh.client@test.irs.com';
DELETE FROM profiles WHERE email LIKE '%@test.irs.com';
DELETE FROM auth.users WHERE email LIKE '%@test.irs.com';
*/

-- =====================================================
-- END OF MIGRATION
-- =====================================================
