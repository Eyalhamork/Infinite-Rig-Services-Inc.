// Script to create test admin and staff accounts
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const testUsers = [
  {
    email: 'moh.admin@infiniterigservices.com',
    password: 'TestAdmin123!',
    full_name: 'Moh Administrator',
    role: 'super_admin',
    department: 'Management',
    phone: '+231 88 100 0001'
  },
  {
    email: 'hamork.staff@infiniterigservices.com',
    password: 'TestStaff123!',
    full_name: 'Hamork Staff',
    role: 'support',
    department: 'Customer Support',
    phone: '+231 88 100 0002'
  }
];

async function createTestUsers() {
  console.log('Creating test users...\n');

  for (const user of testUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: user.full_name
        }
      });

      if (authError) {
        if (authError.message.includes('already been registered')) {
          console.log(`User ${user.email} already exists, updating profile...`);

          // Get existing user
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existingUser = existingUsers.users.find(u => u.email === user.email);

          if (existingUser) {
            // Update profile
            const { error: updateError } = await supabase
              .from('profiles')
              .upsert({
                id: existingUser.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                department: user.department,
                phone: user.phone,
                is_active: true
              });

            if (updateError) {
              console.error(`  Error updating profile: ${updateError.message}`);
            } else {
              console.log(`  Updated: ${user.email} (${user.role})`);
            }
          }
          continue;
        }
        console.error(`  Error creating ${user.email}: ${authError.message}`);
        continue;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          department: user.department,
          phone: user.phone,
          is_active: true
        });

      if (profileError) {
        console.error(`  Error creating profile for ${user.email}: ${profileError.message}`);
      } else {
        console.log(`Created: ${user.email}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Password: ${user.password}`);
        console.log('');
      }

    } catch (err) {
      console.error(`  Unexpected error for ${user.email}:`, err.message);
    }
  }

  console.log('\n=== Test Accounts Summary ===');
  console.log('\nAdmin Account:');
  console.log('  Email: moh.admin@infiniterigservices.com');
  console.log('  Password: TestAdmin123!');
  console.log('  Role: super_admin');
  console.log('\nStaff Account:');
  console.log('  Email: hamork.staff@infiniterigservices.com');
  console.log('  Password: TestStaff123!');
  console.log('  Role: support');
  console.log('\n==============================');
}

createTestUsers().catch(console.error);
