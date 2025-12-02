// Seed test users for Mock DB
import bcrypt from 'bcryptjs';

export async function seedMockUsers(mockUsers) {
  console.log('🌱 מוסיף משתמשי בדיקה ל-Mock DB...');

  mockUsers.clear();

  const testUsers = [
    // מנהל יחיד
    {
      fullName: 'מנהל ראשי',
      email: 'admin@vipo.local',
      phone: '0501234567',
      password: '12345678',
      role: 'admin',
    },

    // משתמשי בדיקה להשלמת זרימה
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

    // סוכנים פעילים
    {
      fullName: 'דני כהן - סוכן בכיר',
      email: 'danny@vipo.local',
      phone: '0521234567',
      password: 'Agent123!',
      role: 'agent',
    },
    {
      fullName: 'שרה לוי - סוכנת',
      email: 'sara@vipo.local',
      phone: '0521234568',
      password: 'Agent123!',
      role: 'agent',
    },
    {
      fullName: 'יוסי מזרחי - סוכן',
      email: 'yossi@vipo.local',
      phone: '0521234569',
      password: 'Agent123!',
      role: 'agent',
    },

    // לקוחות
    {
      fullName: 'משה ישראלי',
      email: 'moshe@example.com',
      phone: '0541234567',
      password: 'Customer1!',
      role: 'customer',
    },
    {
      fullName: 'רחל אברהם',
      email: 'rachel@example.com',
      phone: '0541234568',
      password: 'Customer1!',
      role: 'customer',
    },
    {
      fullName: 'דוד כהן',
      email: 'david@example.com',
      phone: '0541234569',
      password: 'Customer1!',
      role: 'customer',
    },
    {
      fullName: 'מיכל לוי',
      email: 'michal@example.com',
      phone: '0541234570',
      password: 'Customer1!',
      role: 'customer',
    },
    {
      fullName: 'אבי מזרחי',
      email: 'avi@example.com',
      phone: '0541234571',
      password: 'Customer1!',
      role: 'customer',
    },
  ];

  for (const user of testUsers) {
    const hash = await bcrypt.hash(user.password, 10);
    mockUsers.set(user.email, {
      _id: `mock-${user.email}`,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      passwordHash: hash, // Changed from 'password' to 'passwordHash'
      role: user.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`✅ נוספו ${testUsers.length} משתמשי בדיקה ל-Mock DB`);
  return testUsers.length;
}
