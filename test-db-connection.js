// Test database connection and admin user
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

const envPaths = [
  path.join(process.cwd(), '.env.local'),
  path.join(process.cwd(), 'app', '.env.local'),
];

for (const envPath of envPaths) {
  dotenv.config({ path: envPath, override: true });
}

async function testDb() {
  console.log('\n🔍 Testing Database Connection\n');
  console.log('='.repeat(60));

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('❌ MONGODB_URI not found in environment');
    process.exit(1);
  }

  console.log('✅ MONGODB_URI found');
  console.log(`   URI: ${uri.substring(0, 30)}...`);

  const client = new MongoClient(uri);

  try {
    console.log('\n📍 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    console.log(`✅ Database: ${db.databaseName}`);

    console.log('\n📍 Checking admin user...');
    const users = db.collection('users');
    const admin = await users.findOne({ email: 'admin@vipo.local' });

    if (admin) {
      console.log('✅ Admin user found');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Has password: ${!!admin.password}`);
      console.log(
        `   Password hash: ${admin.password ? admin.password.substring(0, 20) + '...' : 'N/A'}`,
      );
      console.log(`   isActive: ${admin.isActive}`);
    } else {
      console.log('❌ Admin user not found');
    }

    console.log('\n📍 Testing bcrypt comparison...');
    const bcrypt = require('bcryptjs');
    if (admin && admin.password) {
      const testPassword = process.env.ADMIN_PASSWORD || '12345678A!';
      const match = await bcrypt.compare(testPassword, admin.password);
      console.log(`✅ Password test: ${match ? 'MATCH' : 'NO MATCH'}`);

      if (!match) {
        console.log('⚠️  Password does not match - may need to reset admin');
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Database check complete\n');
  } catch (err) {
    console.log('❌ Database error:', err.message);
    console.log('   Stack:', err.stack);
  } finally {
    await client.close();
  }
}

testDb().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
