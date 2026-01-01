-- =====================================================
-- INSERT MISSING CLIENT COMPANY RECORD
-- Run this to add the test client company to the clients table
-- =====================================================

-- First check if the client already exists
DO $$
DECLARE
  user_id UUID;
  client_exists BOOLEAN;
BEGIN
  -- Get the client user's ID
  SELECT id INTO user_id FROM auth.users WHERE email = 'moh.client@test.irs.com';
  
  IF user_id IS NULL THEN
    RAISE NOTICE 'Client user not found. Please ensure the user exists first.';
    RETURN;
  END IF;

  -- Check if client company already exists
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
      'Test client account for dashboard testing'
    );
    RAISE NOTICE 'Created client company: Test Oil & Gas Ltd';
  ELSE
    RAISE NOTICE 'Client company already exists';
  END IF;
END $$;

-- Verify the client was created
SELECT id, company_name, email, is_active FROM clients;
