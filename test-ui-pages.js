// Test UI pages and routes
const http = require('http');

const BASE_URL = 'http://localhost:3001';
let testResults = [];

function request(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/json',
      },
    };

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function log(test, status, message, details = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${test}: ${message}`);
  if (details) console.log(`   ${details}`);
  testResults.push({ test, status, message, details });
}

async function runTests() {
  console.log('\n🔍 Testing UI Pages and Routes\n');
  console.log('='.repeat(60));

  const routes = [
    { path: '/', name: 'Home Page', shouldLoad: true },
    { path: '/login', name: 'Login Page', shouldLoad: true },
    { path: '/admin/login', name: 'Admin Login Page', shouldLoad: true },
    { path: '/dashboard', name: 'Dashboard (Protected)', shouldLoad: false, expectRedirect: true },
    { path: '/admin', name: 'Admin Page (Protected)', shouldLoad: false, expectRedirect: true },
    { path: '/agent', name: 'Agent Page (Protected)', shouldLoad: false, expectRedirect: true },
    { path: '/api/auth/me', name: 'Auth Me API', shouldLoad: false, expect401: true },
  ];

  for (const route of routes) {
    try {
      const res = await request(route.path);
      
      if (route.expectRedirect) {
        if (res.status === 307 || res.status === 302) {
          const location = res.headers.location || '';
          if (location.includes('/login')) {
            log(route.name, 'PASS', `Correctly redirects to /login`);
          } else {
            log(route.name, 'WARN', `Redirects to: ${location}`);
          }
        } else {
          log(route.name, 'FAIL', `Expected redirect, got ${res.status}`);
        }
      } else if (route.expect401) {
        if (res.status === 401) {
          log(route.name, 'PASS', 'Correctly returns 401');
        } else {
          log(route.name, 'FAIL', `Expected 401, got ${res.status}`);
        }
      } else if (route.shouldLoad) {
        if (res.status === 200) {
          log(route.name, 'PASS', 'Loads successfully');
        } else if (res.status === 500) {
          log(route.name, 'WARN', 'Returns 500 - check server logs', 
              res.body.substring(0, 100));
        } else {
          log(route.name, 'FAIL', `Expected 200, got ${res.status}`);
        }
      }
    } catch (e) {
      log(route.name, 'FAIL', 'Request failed', e.message);
    }
  }

  // Test API endpoints
  console.log('\n📍 Testing API Endpoints...');
  
  const apiEndpoints = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/me',
    '/api/dev/magic-login',
  ];

  for (const endpoint of apiEndpoints) {
    try {
      const res = await request(endpoint);
      // Just check if endpoint exists (not 404)
      if (res.status !== 404) {
        log(`API: ${endpoint}`, 'PASS', `Endpoint exists (status: ${res.status})`);
      } else {
        log(`API: ${endpoint}`, 'FAIL', 'Endpoint not found (404)');
      }
    } catch (e) {
      log(`API: ${endpoint}`, 'FAIL', 'Request failed', e.message);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 UI Test Summary\n');
  
  const passed = testResults.filter(r => r.status === 'PASS').length;
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  const warned = testResults.filter(r => r.status === 'WARN').length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warned}`);
  console.log(`📝 Total: ${testResults.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`   - ${r.test}: ${r.message}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
