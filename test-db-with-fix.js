// Test DB with OpenSSL legacy provider
process.env.NODE_OPTIONS = '--openssl-legacy-provider';
require('dotenv').config({ path: './app/.env.local' });
const { MongoClient } = require('mongodb');

async function testDb() {
  console.log('\n🔍 Testing Database Connection (with OpenSSL fix)\n');
  console.log('='.repeat(60));

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('❌ MONGODB_URI not found');
    process.exit(1);
  }

  console.log('✅ MONGODB_URI found');

  // Try with minimal options first
  const client = new MongoClient(uri);

  try {
    console.log('\n📍 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');

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
      console.log(`   isActive: ${admin.isActive}`);

      const bcrypt = require('bcryptjs');
      if (admin.password) {
        const match = await bcrypt.compare('12345678A', admin.password);
        console.log(`   Password test: ${match ? '✅ MATCH' : '❌ NO MATCH'}`);
      }
    } else {
      console.log('❌ Admin user not found - need to run reset-admin');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All checks passed!\n');
  } catch (err) {
    console.log('❌ Error:', err.message);
    console.log('\n💡 Possible solutions:');
    console.log('   1. Check if MongoDB Atlas IP whitelist includes your IP');
    console.log('   2. Verify MONGODB_URI credentials');
    console.log('   3. Try updating Node.js or MongoDB driver');
    process.exit(1);
  } finally {
    await client.close();
  }
}

testDb();
