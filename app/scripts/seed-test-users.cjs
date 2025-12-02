// app/scripts/seed-test-users.cjs
// יצירת משתמשי בדיקה קבועים למערכת
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI missing in .env.local');
  process.exit(1);
}

// משתמשי בדיקה
const TEST_USERS = [
  // מנהלים
  {
    fullName: 'מנהל ראשי',
    email: 'admin@vipo.local',
    phone: '0501234567',
    password: '12345678A',
    role: 'admin',
    isActive: true,
  },
  {
    fullName: 'מנהל משנה',
    email: 'admin2@vipo.local',
    phone: '0501234568',
    password: 'Admin123!',
    role: 'admin',
    isActive: true,
  },

  // סוכנים
  {
    fullName: 'דני כהן - סוכן בכיר',
    email: 'danny@vipo.local',
    phone: '0521234567',
    password: 'Agent123!',
    role: 'agent',
    isActive: true,
  },
  {
    fullName: 'שרה לוי - סוכנת',
    email: 'sara@vipo.local',
    phone: '0521234568',
    password: 'Agent123!',
    role: 'agent',
    isActive: true,
  },
  {
    fullName: 'יוסי מזרחי - סוכן',
    email: 'yossi@vipo.local',
    phone: '0521234569',
    password: 'Agent123!',
    role: 'agent',
    isActive: true,
  },

  // לקוחות
  {
    fullName: 'משה ישראלי',
    email: 'moshe@example.com',
    phone: '0541234567',
    password: 'Customer1!',
    role: 'customer',
    isActive: true,
  },
  {
    fullName: 'רחל אברהם',
    email: 'rachel@example.com',
    phone: '0541234568',
    password: 'Customer1!',
    role: 'customer',
    isActive: true,
  },
  {
    fullName: 'דוד כהן',
    email: 'david@example.com',
    phone: '0541234569',
    password: 'Customer1!',
    role: 'customer',
    isActive: true,
  },
  {
    fullName: 'מיכל לוי',
    email: 'michal@example.com',
    phone: '0541234570',
    password: 'Customer1!',
    role: 'customer',
    isActive: true,
  },
  {
    fullName: 'אבי מזרחי',
    email: 'avi@example.com',
    phone: '0541234571',
    password: 'Customer1!',
    role: 'customer',
    isActive: true,
  },
];

async function seedUsers() {
  const client = new MongoClient(uri);

  try {
    console.log('\n🌱 מתחיל יצירת משתמשי בדיקה...\n');
    console.log('='.repeat(60));

    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const user of TEST_USERS) {
      const { password, ...userData } = user;
      const passwordHash = await bcrypt.hash(password, 10);

      const result = await users.updateOne(
        { email: user.email },
        {
          $set: {
            ...userData,
            password: passwordHash,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true },
      );

      if (result.upsertedId) {
        created++;
        console.log(`✅ נוצר: ${user.fullName} (${user.role}) - ${user.email}`);
      } else if (result.modifiedCount > 0) {
        updated++;
        console.log(`🔄 עודכן: ${user.fullName} (${user.role}) - ${user.email}`);
      } else {
        skipped++;
        console.log(`⏭️  קיים: ${user.fullName} (${user.role}) - ${user.email}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 סיכום:\n');
    console.log(`✅ נוצרו: ${created} משתמשים חדשים`);
    console.log(`🔄 עודכנו: ${updated} משתמשים קיימים`);
    console.log(`⏭️  דילגו: ${skipped} משתמשים (ללא שינוי)`);
    console.log(`📝 סה"כ: ${TEST_USERS.length} משתמשים במערכת`);

    console.log('\n' + '='.repeat(60));
    console.log('\n🔐 פרטי התחברות:\n');

    console.log('👨‍💼 מנהלים:');
    TEST_USERS.filter((u) => u.role === 'admin').forEach((u) => {
      console.log(`   📧 ${u.email} / 🔑 ${u.password}`);
    });

    console.log('\n👔 סוכנים:');
    TEST_USERS.filter((u) => u.role === 'agent').forEach((u) => {
      console.log(`   📧 ${u.email} / 🔑 ${u.password}`);
    });

    console.log('\n👥 לקוחות:');
    TEST_USERS.filter((u) => u.role === 'customer').forEach((u) => {
      console.log(`   📧 ${u.email} / 🔑 ${u.password}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ הושלם בהצלחה!\n');
  } catch (err) {
    console.error('\n❌ שגיאה:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedUsers();
