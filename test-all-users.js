// Test all seeded users
const http = require('http');

const USERS = [
  // Admins
  { email: 'admin@vipo.local', password: '12345678A', role: 'admin', name: 'מנהל ראשי' },
  { email: 'admin2@vipo.local', password: 'Admin123!', role: 'admin', name: 'מנהל משנה' },
  
  // Agents
  { email: 'danny@vipo.local', password: 'Agent123!', role: 'agent', name: 'דני כהן' },
  { email: 'sara@vipo.local', password: 'Agent123!', role: 'agent', name: 'שרה לוי' },
  { email: 'yossi@vipo.local', password: 'Agent123!', role: 'agent', name: 'יוסי מזרחי' },
  
  // Customers
  { email: 'moshe@example.com', password: 'Customer1!', role: 'customer', name: 'משה ישראלי' },
  { email: 'rachel@example.com', password: 'Customer1!', role: 'customer', name: 'רחל אברהם' },
  { email: 'david@example.com', password: 'Customer1!', role: 'customer', name: 'דוד כהן' },
  { email: 'michal@example.com', password: 'Customer1!', role: 'customer', name: 'מיכל לוי' },
  { email: 'avi@example.com', password: 'Customer1!', role: 'customer', name: 'אבי מזרחי' },
];

function login(email, password) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ identifier: email, password });
    const opts = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: body,
        });
      });
    });

    req.on('error', (e) => resolve({ status: 0, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function testAllUsers() {
  console.log('\n🧪 בודק את כל משתמשי הבדיקה\n');
  console.log('='.repeat(70));
  
  let passed = 0;
  let failed = 0;
  
  for (const user of USERS) {
    const result = await login(user.email, user.password);
    
    if (result.status === 200) {
      const data = JSON.parse(result.body);
      if (data.ok && data.role === user.role) {
        console.log(`✅ ${user.name.padEnd(25)} | ${user.email.padEnd(25)} | ${user.role}`);
        passed++;
      } else {
        console.log(`❌ ${user.name.padEnd(25)} | ${user.email.padEnd(25)} | תפקיד שגוי`);
        failed++;
      }
    } else {
      console.log(`❌ ${user.name.padEnd(25)} | ${user.email.padEnd(25)} | התחברות נכשלה (${result.status})`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 תוצאות:\n');
  console.log(`✅ הצליחו: ${passed}/${USERS.length}`);
  console.log(`❌ נכשלו: ${failed}/${USERS.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 כל המשתמשים עובדים בהצלחה!\n');
  } else {
    console.log('\n⚠️  יש משתמשים שלא עובדים - בדוק את הלוגים\n');
  }
}

testAllUsers();
