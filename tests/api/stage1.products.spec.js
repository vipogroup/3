import request from 'supertest';
import { describe, it, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

const base = process.env.PUBLIC_URL || 'http://localhost:3001';
const results = { stage: 1, checks: [] };

function record(name, passed, evidence, hint) {
  results.checks.push({ name, passed, evidence, hint });
}

function writeReport() {
  try {
    const outDir = path.join(process.cwd(), 'reports', 'tests');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'stage1.json'), JSON.stringify(results, null, 2));
  } catch {}
}

describe('Stage 1 - Base: Products', () => {
  it('GET /api/products returns 200 and array', async () => {
    const res = await request(base).get('/api/products');
    const ok = res.status === 200 && Array.isArray(res.body);
    record(
      'api.products.list',
      ok,
      `status=${res.status}; length=${Array.isArray(res.body) ? res.body.length : 'n/a'}`,
      'Implement GET /api/products to return an array',
    );
  });

  it('GET /products page loads', async () => {
    const res = await request(base).get('/products');
    const ok = res.status === 200;
    record(
      'ui.products.page',
      ok,
      `status=${res.status}`,
      'Ensure /products route renders without auth',
    );
  });
});

afterAll(writeReport);
