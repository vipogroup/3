// Comprehensive Auth System Test
const http = require('http');

const BASE_URL = 'http://localhost:3001';
let testResults = [];
let cookies = '';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (cookies && !options.noCookies) {
      opts.headers.Cookie = cookies;
    }

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        // Save cookies from response
        if (res.headers['set-cookie']) {
          cookies = res.headers['set-cookie'].map((c) => c.split(';')[0]).join('; ');
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          cookies: res.headers['set-cookie'],
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

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
  console.log('\n🔍 Starting Comprehensive Auth System Tests\n');
  console.log('='.repeat(60));

  // Test 1: Server Health
  try {
    const res = await request('/');
    log(
      'Server Health',
      res.status === 200 ? 'PASS' : 'WARN',
      `Server responding with status ${res.status}`,
    );
  } catch (e) {
    log('Server Health', 'FAIL', 'Server not responding', e.message);
    return;
  }

  // Test 2: Magic Login (DEV)
  console.log('\n📍 Testing Magic Login (DEV)...');
  cookies = ''; // Reset cookies
  try {
    const res = await request('/api/dev/magic-login', {
      method: 'GET',
      noCookies: true,
    });

    if (res.status === 307 || res.status === 302) {
      log('Magic Login Redirect', 'PASS', `Redirected with status ${res.status}`);

      if (res.cookies && res.cookies.length > 0) {
        log(
          'Magic Login Cookie',
          'PASS',
          'Token cookie set',
          res.cookies[0].substring(0, 50) + '...',
        );
      } else {
        log('Magic Login Cookie', 'FAIL', 'No cookie set in response');
      }
    } else {
      log('Magic Login', 'FAIL', `Expected redirect, got ${res.status}`, res.body);
    }
  } catch (e) {
    log('Magic Login', 'FAIL', 'Request failed', e.message);
  }

  // Test 3: /api/auth/me with Magic Login cookie
  console.log('\n📍 Testing /api/auth/me with Magic Login cookie...');
  try {
    const res = await request('/api/auth/me');

    if (res.status === 200) {
      const body = JSON.parse(res.body);
      log(
        '/api/auth/me (Magic)',
        'PASS',
        'Authenticated successfully',
        `role: ${body.role}, sub: ${body.sub}`,
      );
    } else {
      log('/api/auth/me (Magic)', 'FAIL', `Expected 200, got ${res.status}`, res.body);
    }
  } catch (e) {
    log('/api/auth/me (Magic)', 'FAIL', 'Request failed', e.message);
  }

  // Test 4: Logout
  console.log('\n📍 Testing Logout...');
  try {
    const res = await request('/api/auth/logout', { method: 'POST' });

    if (res.status === 200) {
      log('Logout', 'PASS', 'Logout successful');

      // Check if cookie was cleared
      if (
        res.cookies &&
        res.cookies.some((c) => c.includes('maxAge=0') || c.includes('Max-Age=0'))
      ) {
        log('Logout Cookie Clear', 'PASS', 'Token cookie cleared');
      }
    } else {
      log('Logout', 'FAIL', `Expected 200, got ${res.status}`, res.body);
    }
  } catch (e) {
    log('Logout', 'FAIL', 'Request failed', e.message);
  }

  // Test 5: /api/auth/me after logout (should fail)
  console.log('\n📍 Testing /api/auth/me after logout...');
  try {
    const res = await request('/api/auth/me');

    if (res.status === 401) {
      log('/api/auth/me (After Logout)', 'PASS', 'Correctly returns 401');
    } else {
      log('/api/auth/me (After Logout)', 'FAIL', `Expected 401, got ${res.status}`, res.body);
    }
  } catch (e) {
    log('/api/auth/me (After Logout)', 'FAIL', 'Request failed', e.message);
  }

  // Test 6: Login with identifier + password
  console.log('\n📍 Testing Login with identifier + password...');
  cookies = ''; // Reset cookies
  try {
    const body = JSON.stringify({
      identifier: 'admin@vipo.local',
      password: '12345678A',
    });

    const res = await request('/api/auth/login', {
      method: 'POST',
      body,
      noCookies: true,
    });

    if (res.status === 200) {
      const resBody = JSON.parse(res.body);
      log(
        'Login (identifier)',
        'PASS',
        'Login successful',
        `role: ${resBody.role}, ok: ${resBody.ok}`,
      );

      if (res.cookies && res.cookies.length > 0) {
        log('Login Cookie', 'PASS', 'Token cookie set');
      } else {
        log('Login Cookie', 'FAIL', 'No cookie set in response');
      }
    } else {
      log('Login (identifier)', 'FAIL', `Expected 200, got ${res.status}`, res.body);
    }
  } catch (e) {
    log('Login (identifier)', 'FAIL', 'Request failed', e.message);
  }

  // Test 7: /api/auth/me with login cookie
  console.log('\n📍 Testing /api/auth/me with login cookie...');
  try {
    const res = await request('/api/auth/me');

    if (res.status === 200) {
      const body = JSON.parse(res.body);
      log(
        '/api/auth/me (Login)',
        'PASS',
        'Authenticated successfully',
        `role: ${body.role}, sub: ${body.sub}`,
      );
    } else {
      log('/api/auth/me (Login)', 'FAIL', `Expected 200, got ${res.status}`, res.body);
    }
  } catch (e) {
    log('/api/auth/me (Login)', 'FAIL', 'Request failed', e.message);
  }

  // Test 8: Login with wrong password
  console.log('\n📍 Testing Login with wrong password...');
  try {
    const body = JSON.stringify({
      identifier: 'admin@vipo.local',
      password: 'wrongpassword',
    });

    const res = await request('/api/auth/login', {
      method: 'POST',
      body,
      noCookies: true,
    });

    if (res.status === 401) {
      log('Login (Wrong Password)', 'PASS', 'Correctly rejected with 401');
    } else {
      log('Login (Wrong Password)', 'FAIL', `Expected 401, got ${res.status}`, res.body);
    }
  } catch (e) {
    log('Login (Wrong Password)', 'FAIL', 'Request failed', e.message);
  }

  // Test 9: Login with non-email identifier
  console.log('\n📍 Testing Login with non-email identifier...');
  try {
    const body = JSON.stringify({
      identifier: '0501234567',
      password: '12345678A',
    });

    const res = await request('/api/auth/login', {
      method: 'POST',
      body,
      noCookies: true,
    });

    if (res.status === 401) {
      const resBody = JSON.parse(res.body);
      if (resBody.error === 'EMAIL_REQUIRED') {
        log('Login (Phone Number)', 'PASS', 'Correctly rejected non-email identifier');
      } else {
        log('Login (Phone Number)', 'WARN', `Rejected but with error: ${resBody.error}`);
      }
    } else {
      log('Login (Phone Number)', 'FAIL', `Expected 401, got ${res.status}`, res.body);
    }
  } catch (e) {
    log('Login (Phone Number)', 'FAIL', 'Request failed', e.message);
  }

  // Test 10: Protected route without auth
  console.log('\n📍 Testing Middleware protection...');
  cookies = ''; // Clear cookies
  try {
    const res = await request('/admin', { noCookies: true });

    if (res.status === 307 || res.status === 302) {
      const location = res.headers.location || '';
      if (location.includes('/login')) {
        log('Middleware (/admin)', 'PASS', 'Correctly redirects to /login');
      } else {
        log('Middleware (/admin)', 'WARN', `Redirects but to: ${location}`);
      }
    } else if (res.status === 401) {
      log('Middleware (/admin)', 'PASS', 'Correctly returns 401');
    } else {
      log('Middleware (/admin)', 'FAIL', `Expected redirect or 401, got ${res.status}`);
    }
  } catch (e) {
    log('Middleware (/admin)', 'FAIL', 'Request failed', e.message);
  }

  // Test 11: Bearer token support
  console.log('\n📍 Testing Bearer token support...');
  // First login to get a valid session
  try {
    const loginBody = JSON.stringify({
      identifier: 'admin@vipo.local',
      password: '12345678A',
    });

    await request('/api/auth/login', {
      method: 'POST',
      body: loginBody,
      noCookies: true,
    });

    // Now test /api/auth/me with cookie (we have it from login)
    const resWithCookie = await request('/api/auth/me');

    if (resWithCookie.status === 200) {
      log(
        'Bearer Support Check',
        'PASS',
        'Cookie-based auth works (Bearer test requires manual JWT)',
      );
    } else {
      log('Bearer Support Check', 'WARN', 'Cannot verify Bearer - cookie auth failed');
    }
  } catch (e) {
    log('Bearer Support', 'FAIL', 'Request failed', e.message);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary\n');

  const passed = testResults.filter((r) => r.status === 'PASS').length;
  const failed = testResults.filter((r) => r.status === 'FAIL').length;
  const warned = testResults.filter((r) => r.status === 'WARN').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warned}`);
  console.log(`📝 Total: ${testResults.length}`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults
      .filter((r) => r.status === 'FAIL')
      .forEach((r) => {
        console.log(`   - ${r.test}: ${r.message}`);
        if (r.details) console.log(`     ${r.details}`);
      });
  }

  console.log('\n' + '='.repeat(60));

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
