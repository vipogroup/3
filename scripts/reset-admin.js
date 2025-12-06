// scripts/reset-admin.js
// CommonJS for maximum compatibility when "type" is not "module"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI missing in .env.local');
  process.exit(1);
}

const dbName = process.env.MONGODB_DB || 'vipo';

// hard-code admin credentials per latest request
const ADMIN_EMAIL = 'm0587009938@gmail.com';
const ADMIN_PHONE = '0587009938';
const ADMIN_PASSWORD = '12345678';

console.log('🔄 Resetting admin user...');
console.log('📧 Email:', ADMIN_EMAIL);

(async () => {
  const client = new MongoClient(uri);
  let exitCode = 0;

  try {
    await client.connect();
    console.log('🟢 Connected to MongoDB');
    const db = client.db(dbName);
    const users = db.collection('users');

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const res = await users.updateOne(
      { email: ADMIN_EMAIL },
      {
        $set: {
          email: ADMIN_EMAIL,
          phone: ADMIN_PHONE,
          passwordHash: hash,
          role: 'admin',
          isActive: true,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    console.log(
      '✅ Admin user reset successfully:',
      res.upsertedId ? `created (${res.upsertedId})` : 'updated',
    );
    console.log('➡️  Login with email/password:', ADMIN_EMAIL, ADMIN_PASSWORD);
  } catch (e) {
    exitCode = 1;
    console.error('❌ Error resetting admin:', e);
  } finally {
    try {
      await client.close();
    } catch {}
    process.exit(exitCode);
  }
})();
