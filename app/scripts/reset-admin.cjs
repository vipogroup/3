// app/scripts/reset-admin.cjs
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI missing in .env.local');
  process.exit(1);
}

const ADMIN_EMAIL = 'admin@vipo.local';
const ADMIN_PHONE = '0501234567';
const ADMIN_PASSWORD = '12345678A';

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(); 
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
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    console.log('✅ admin upserted:', res.upsertedId || '(updated)');
  } catch (err) {
    console.error('❌ reset-admin failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
})();

