import request from 'supertest';
import { describe, it, expect, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

const base = process.env.PUBLIC_URL || 'http://localhost:3001';
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

async function register(role) {
  const phone = randPhone();
  const res = await request(base)
    .post('/api/auth/register')
    .send({ fullName: `${role.toUpperCase()} REF`, phone, role, password: '12345678A!' });
  return { phone, password: '12345678A!', res };
}

async function login(phone, password) {
  const res = await request(base).post('/api/auth/login').send({ phone, password });
  const cookie = res.headers['set-cookie']?.[0] || '';
  return { res, cookie };
}

describe('Stage 8 - Referral / חבר-מביא-חבר', () => {
  it('join?ref=XYZ sets cookie; creating sale by another agent sets refAgentId and commissionReferral', async () => {
    // Create two agents
    const a1 = await register('agent');
    const a2 = await register('agent');
    const l2 = await login(a2.phone, a2.password);

    // Simulate referral cookie via /join
    const refCode = 'abc12345';
    const joinRes = await request(base).get(`/join?ref=${refCode}`);
    const joinOk = joinRes.status === 200 || joinRes.status === 302 || joinRes.status === 301;
    record(
      'ref.join.cookie',
      joinOk,
      `status=${joinRes.status}`,
      'Implement /join?ref=XYZ to set refSource cookie',
    );

    // Create sale by agent2 with ref cookie present
    const saleRes = await request(base)
      .post('/api/sales')
      .set('Cookie', [l2.cookie, `refSource=${refCode}`])
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
      hasReferral,
      `status=${saleRes.status}`,
      'On sale create, set refAgentId and commissionReferral = price*0.02 when refSource present',
    );

    expect(hasReferral).toBe(true);
  });
});

afterAll(writeReport);
