import request from 'supertest';
import { describe, it, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

const base = process.env.PUBLIC_URL || 'http://localhost:3001';
const results = { stage: 6, checks: [] };
function record(name, passed, evidence, hint) {
  results.checks.push({ name, passed, evidence, hint });
}
function writeReport() {
  try {
    const outDir = path.join(process.cwd(), 'reports', 'tests');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'stage6.json'), JSON.stringify(results, null, 2));
  } catch {}
}

describe('Stage 6 - Stats API', () => {
  it('GET /api/stats returns dashboard metrics', async () => {
    const res = await request(base).get('/api/stats');
    const ok = res.status === 200 && res.body && typeof res.body === 'object';
    const hasKeys =
      ok &&
      [
        'totalSales',
        'totalRevenue',
        'totalCommission',
        'topAgents',
        'salesByDate',
        'bestProducts',
      ].every((k) => k in res.body);
    record(
      'stats.endpoint',
      ok && hasKeys,
      `status=${res.status}`,
      'Implement GET /api/stats with all required keys',
    );
  });
});

afterAll(writeReport);
