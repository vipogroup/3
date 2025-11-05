#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const base = process.env.PUBLIC_URL || 'http://localhost:3001';

async function ping(method, url, body, headers={}) {
  const res = await fetch(base + url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'manual'
  }).catch(err => ({ error: String(err) }));
  if (!res || res.error) return { ok: false, status: 0, error: res?.error || 'fetch failed' };
  let json = null; let text = '';
  try { json = await res.json(); } catch { try { text = await res.text(); } catch {} }
  return { ok: res.ok, status: res.status, json, text, headers: Object.fromEntries(res.headers.entries()) };
}

function outFile() {
  const outDir = path.join(process.cwd(), 'reports');
  fs.mkdirSync(outDir, { recursive: true });
  return path.join(outDir, 'smoke.json');
}

function status(passed, missing=false) { return passed ? 'passed' : (missing ? 'missing' : 'failed'); }

(async () => {
  const report = { base, ts: new Date().toISOString(), checks: [] };

  // Stage 1
  const p1 = await ping('GET', '/api/products');
  report.checks.push({ key: 'api.products', result: status(p1.ok && Array.isArray(p1.json)), evidence: `status=${p1.status}` });
  const p1b = await ping('GET', '/products');
  report.checks.push({ key: 'ui.products', result: status(p1b.status === 200), evidence: `status=${p1b.status}` });

  // Stage 2 basic
  const phone = '05' + Math.floor(10000000 + Math.random()*89999999).toString();
  const reg = await ping('POST', '/api/auth/register', { fullName: 'SMOKE Admin', phone, role: 'admin', password: '12345678A!' });
  report.checks.push({ key: 'auth.register', result: status(reg.status === 201), evidence: `status=${reg.status}` });
  const login = await ping('POST', '/api/auth/login', { phone, password: '12345678A!' });
  const cookie = (login.headers?.['set-cookie'] || '')
  report.checks.push({ key: 'auth.login', result: status(login.status === 200 && cookie.includes('token=')), evidence: `status=${login.status}` });

  // Stage 6 stats
  const s6 = await ping('GET', '/api/stats');
  const s6ok = s6.status === 200 && s6.json && typeof s6.json === 'object';
  report.checks.push({ key: 'stats.endpoint', result: status(s6ok, s6.status === 404), evidence: `status=${s6.status}` });

  // Write
  fs.writeFileSync(outFile(), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ok: true, file: 'reports/smoke.json' }));
})();
