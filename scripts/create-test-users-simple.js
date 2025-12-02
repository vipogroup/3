// Simple script to create test users via API
// Run this after starting the server: npm run dev

const testUsers = [
  {
    fullName: 'Admin Test',
    email: 'admin@test.com',
    phone: '050-1234567',
    password: 'admin',
    role: 'admin',
  },
  {
    fullName: 'Agent Test',
    email: 'agent@test.com',
    phone: '050-1234568',
    password: 'admin',
    role: 'agent',
  },
  {
    fullName: 'Customer Test',
    email: 'customer@test.com',
    phone: '050-1234569',
    password: 'admin',
    role: 'customer',
  },
];

async function createTestUsers() {
  console.log('🔧 Creating test users via API...\n');

  for (const user of testUsers) {
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        console.log(`✅ Created ${user.role}: ${user.email} | Password: ${user.password}`);
      } else if (result.error === 'user exists') {
        console.log(`⚠️  User ${user.email} already exists (${user.role})`);
      } else {
        console.log(`❌ Failed to create ${user.email}: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ Network error for ${user.email}: ${error.message}`);
    }
  }

  console.log('\n📋 Login credentials:');
  console.log('┌─────────────────────────────────────────────────┐');
  console.log('│ ADMIN Dashboard (/admin or /dashboard)         │');
  console.log('│ Email: admin@test.com                           │');
  console.log('│ Password: admin                                 │');
  console.log('├─────────────────────────────────────────────────┤');
  console.log('│ AGENT Dashboard (/agent)                       │');
  console.log('│ Email: agent@test.com                           │');
  console.log('│ Password: admin                                 │');
  console.log('├─────────────────────────────────────────────────┤');
  console.log('│ CUSTOMER Dashboard (/customer)                 │');
  console.log('│ Email: customer@test.com                        │');
  console.log('│ Password: admin                                 │');
  console.log('└─────────────────────────────────────────────────┘');
  console.log('\n🚀 Ready to test all dashboards!');
  console.log('\n💡 Instructions:');
  console.log('1. Make sure server is running: npm run dev');
  console.log('2. Go to: http://localhost:3001/login');
  console.log('3. Login with any of the above credentials');
  console.log('4. You will be redirected to the appropriate dashboard');
}

// Check if we're running in Node.js
if (typeof window === 'undefined') {
  // Node.js environment - use node-fetch
  const fetch = require('node-fetch');
  createTestUsers().catch(console.error);
} else {
  // Browser environment
  createTestUsers().catch(console.error);
}
