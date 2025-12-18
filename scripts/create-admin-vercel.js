// scripts/create-admin-vercel.js
// Create admin user in production MongoDB (Vercel)
require('dotenv').config({ path: '.env.production.upload' });

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI missing in .env.production.upload');
  process.exit(1);
}

const dbName = process.env.MONGODB_DB || 'vipo';

// Admin credentials from environment
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'm0587009938@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345678';
const ADMIN_PHONE = '0587009938';

console.log('🔄 Creating admin user in production MongoDB...');
console.log('📧 Email:', ADMIN_EMAIL);
console.log('🔗 Database:', dbName);

(async () => {
  const client = new MongoClient(uri);
  let exitCode = 0;

  try {
    await client.connect();
    console.log('🟢 Connected to MongoDB Atlas');
    const db = client.db(dbName);
    const users = db.collection('users');

    // Check if admin already exists
    const existing = await users.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('⚠️  Admin user already exists');
      console.log('🔄 Updating password...');
    }

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const res = await users.updateOne(
      { email: ADMIN_EMAIL },
      {
        $set: {
          email: ADMIN_EMAIL,
          phone: ADMIN_PHONE,
          fullName: 'System Admin',
          passwordHash: hash,
          role: 'admin',
          isActive: true,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
          referralsCount: 0,
          commissionBalance: 0,
          totalSales: 0,
        },
      },
      { upsert: true },
    );

    console.log('');
    console.log('✅ Admin user created/updated successfully!');
    console.log('');
    console.log('📋 Login Details:');
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('');
    console.log('🌐 Login at: https://vipo-agents-test.vercel.app/login');
    console.log('');
    
    if (res.upsertedId) {
      console.log('🆕 New admin created with ID:', res.upsertedId);
    } else {
      console.log('🔄 Existing admin updated');
    }
  } catch (e) {
    exitCode = 1;
    console.error('❌ Error creating admin:', e.message);
    console.error('');
    console.error('💡 Make sure:');
    console.error('   1. MONGODB_URI is correct in .env.production.upload');
    console.error('   2. MongoDB Atlas allows connections from anywhere (0.0.0.0/0)');
    console.error('   3. Database user has write permissions');
  } finally {
    try {
      await client.close();
      console.log('🔌 Disconnected from MongoDB');
    } catch {}
    process.exit(exitCode);
  }
})();
