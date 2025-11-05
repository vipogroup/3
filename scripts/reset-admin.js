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

// allow overrides via env, with safe defaults for local dev
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vipo.local';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '0501234567';
const ADMIN_PASSWORD = process.env.ADMIN_PASS || '12345678A!';

(async () => {
  const client = new MongoClient(uri);
  let exitCode = 0;

  try {
    await client.connect();
    const db = client.db(); // default DB from your URI
    const users = db.collection('users');

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const res = await users.updateOne(
      { email: ADMIN_EMAIL },
      {
        $set: {
          email: ADMIN_EMAIL,
          phone: ADMIN_PHONE,
          password: hash,
          role: 'admin',
          isActive: true,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(
      '✅ Admin user reset successfully:',
      res.upsertedId ? `created (${res.upsertedId})` : 'updated'
    );
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
