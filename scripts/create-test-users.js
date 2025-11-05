const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vipo';

async function createTestUsers() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    // Hash password "admin"
    const hashedPassword = await bcrypt.hash('admin', 12);
    
    // Test users to create
    const testUsers = [
      {
        fullName: 'Admin Test',
        email: 'admin@test.com',
        phone: '050-1234567',
        password: hashedPassword,
        role: 'admin',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Agent Test',
        email: 'agent@test.com',
        phone: '050-1234568',
        password: hashedPassword,
        role: 'agent',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Customer Test',
        email: 'customer@test.com',
        phone: '050-1234569',
        password: hashedPassword,
        role: 'customer',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    console.log('\n🔧 Creating test users...\n');
    
    for (const user of testUsers) {
      // Check if user already exists
      const existingUser = await users.findOne({ email: user.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${user.email} already exists - updating password...`);
        
        // Update existing user with new password
        await users.updateOne(
          { email: user.email },
          { 
            $set: { 
              password: hashedPassword,
              active: true,
              updatedAt: new Date()
            }
          }
        );
        
        console.log(`✅ Updated ${user.role}: ${user.email} | Password: admin`);
      } else {
        // Create new user
        const result = await users.insertOne(user);
        console.log(`✅ Created ${user.role}: ${user.email} | Password: admin`);
      }
    }
    
    console.log('\n🎉 Test users created successfully!\n');
    console.log('📋 Login credentials:');
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
    console.log('\n🚀 Ready to test all dashboards!\n');
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createTestUsers().catch(console.error);
