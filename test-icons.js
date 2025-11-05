// Test if icons are accessible
const http = require('http');

async function testIcon(path) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3001${path}`, (res) => {
      console.log(`${path}: ${res.statusCode} (${res.headers['content-type']})`);
      resolve(res.statusCode);
    });
    req.on('error', (e) => {
      console.log(`${path}: ERROR - ${e.message}`);
      resolve(null);
    });
  });
}

async function test() {
  console.log('\n🔍 Testing Icon Accessibility\n');
  await testIcon('/icons/192.png');
  await testIcon('/icons/512.png');
  await testIcon('/manifest.webmanifest');
  console.log('\n');
}

test();
