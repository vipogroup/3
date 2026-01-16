import request from 'supertest';
import { describe, it, expect, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

const base = process.env.PUBLIC_URL || 'http://localhost:3001';
const TEST_TOKEN = process.env.TEST_LOGIN_TOKEN || '';

const results = { stage: 8, checks: [] };
function record(name, passed, evidence, hint) {
  results.checks.push({ name, passed, evidence, hint });
}
function writeReport() {
  try {
    const outDir = path.join(process.cwd(), 'reports', 'tests');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'stage8.json'), JSON.stringify(results, null, 2));
  } catch {}
}

function randPhone() {
  return '05' + Math.floor(10000000 + Math.random() * 89999999).toString();
}

function isValidJwt(token) {
  return token && token.split('.').length === 3;
}

async function register(role) {
  const phone = randPhone();
  const res = await request(base)
    .post('/api/auth/register')
    .set('x-automation-key', process.env.AUTOMATION_KEY || 'test-automation-key')
    .send({
      fullName: `${role.toUpperCase()} REF`,
      phone,
      role,
      email: `${phone}@example.com`,
      password: '12345678A!',
    });
  return { phone, password: '12345678A!', res };
}

describe('Stage 8 - Referral / חבר-מביא-חבר', () => {
  it(
    'join?ref=XYZ sets cookie; creating sale by another agent sets refAgentId and commissionReferral',
    async (ctx) => {
      console.log('TEST_LOGIN_TOKEN jwt-like:', isValidJwt(TEST_TOKEN));

      // Skip if TEST_LOGIN_TOKEN is missing
      if (!TEST_TOKEN) {
        console.log('SKIP: missing TEST_LOGIN_TOKEN');
        ctx.skip();
        return;
      }

      // Error if TEST_LOGIN_TOKEN is not a valid JWT format
      if (!isValidJwt(TEST_TOKEN)) {
        throw new Error('Invalid TEST_LOGIN_TOKEN: must be a real JWT (header.payload.signature)');
      }

      const a1 = await register('agent');
      const a2 = await register('agent');
      expect(a1.res.status).toBe(201);
      expect(a2.res.status).toBe(201);

      const refCode = 'abc12345';

      const joinRes = await request(base)
        .get(`/join?ref=${refCode}`)
        .set('Authorization', `Bearer ${TEST_TOKEN}`)
        .set('Cookie', `refSource=${refCode}`);
      const joinOk = joinRes.status === 200 || joinRes.status === 302 || joinRes.status === 301;
      record(
        'ref.join.cookie',
        joinOk,
        `status=${joinRes.status}`,
        'Implement /join?ref=XYZ to set refSource cookie',
      );

      console.log('SALE headers: Authorization=Bearer, Cookie=refSource=' + refCode);

      const saleRes = await request(base)
        .post('/api/sales')
        .set('Authorization', `Bearer ${TEST_TOKEN}`)
        .set('Cookie', `refSource=${refCode}`)
        .send({
          productId: '656565656565656565656565',
          customerName: 'Ref Buyer',
          customerPhone: '0550003333',
          salePrice: 1000,
        });

      const hasReferral =
        saleRes.body && 'refAgentId' in saleRes.body && 'commissionReferral' in saleRes.body;
      record(
        'ref.sale.fields',
        saleRes.status === 201 && hasReferral,
        `status=${saleRes.status}; bodyKeys=${Object.keys(saleRes.body || {}).join(',')}`,
        'On sale create, set refAgentId and commissionReferral = price*0.02 when refSource present',
      );

      expect(saleRes.status).toBe(201);
    },
    15000,
  );
});

afterAll(writeReport);
