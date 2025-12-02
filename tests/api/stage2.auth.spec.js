import request from 'supertest';
import { describe, it, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

const base = process.env.PUBLIC_URL || 'http://localhost:3001';
const results = { stage: 2, checks: [] };
function record(name, passed, evidence, hint) {
  results.checks.push({ name, passed, evidence, hint });
}
function writeReport() {
  try {
    const outDir = path.join(process.cwd(), 'reports', 'tests');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'stage2.json'), JSON.stringify(results, null, 2));
  } catch {}
}

function randPhone() {
  return '05' + Math.floor(10000000 + Math.random() * 89999999).toString();
}

async function registerUser(role) {
  const phone = randPhone();
  const payload = { fullName: `${role.toUpperCase()} User`, phone, role, password: '12345678A!' };
  const res = await request(base).post('/api/auth/register').send(payload);
  return { res, phone, password: payload.password };
}

describe('Stage 2 - Auth + Roles', () => {
  it('register admin and agent (201)', async () => {
    const a = await registerUser('admin');
    const g = await registerUser('agent');
    const ok = a.res.status === 201 && g.res.status === 201;
    record(
      'auth.register',
      ok,
      `admin=${a.res.status}; agent=${g.res.status}`,
      'POST /api/auth/register should accept fullName, phone, role, password',
    );
  });

  it('login sets httpOnly JWT cookie; wrong password => 401', async () => {
    const { phone, password } = await registerUser('agent');

    const ok = await request(base).post('/api/auth/login').send({ phone, password });
    const bad = await request(base).post('/api/auth/login').send({ phone, password: 'WRONG!' });

    const setCookie = ok.headers['set-cookie']?.join('; ') || '';
    const pass =
      ok.status === 200 &&
      setCookie.includes('token=') &&
      setCookie.toLowerCase().includes('httponly') &&
      bad.status === 401;
    record(
      'auth.login.cookie',
      pass,
      `ok=${ok.status}; bad=${bad.status}; cookie=${setCookie}`,
      "Login must set httpOnly cookie 'token' and reject wrong password",
    );
  });
});

afterAll(writeReport);
