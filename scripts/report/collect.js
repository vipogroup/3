const fs = require('fs');
const path = require('path');

function ensureDir(p) { try { fs.mkdirSync(p, { recursive: true }); } catch {} }
function exists(p) { try { return fs.existsSync(p); } catch { return false; } }
function readJSON(p, fallback = null) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; } }

function collectStage(n) {
  const f = path.join(process.cwd(), 'reports', 'tests', `stage${n}.json`);
  return exists(f) ? readJSON(f, { stage: n, checks: [] }) : { stage: n, checks: [] };
}

function summarize(checks) {
  const total = checks.length;
  const passed = checks.filter(c => c.passed).length;
  const failed = total - passed;
  const status = total === 0 ? 'MISSING' : failed === 0 ? 'PASSED' : 'FAILED';
  return { total, passed, failed, status };
}

function actionItems(checks) {
  if (checks.length === 0) return ['- No checks found: endpoints likely missing'];
  return checks.filter(c => !c.passed).map(c => `- ${c.name}: ${c.hint || 'Fix required'}`);
}

function mdHeader() {
  return `# Verification Report\n\nGenerated: ${new Date().toISOString()}\n`;
}

function mdStage(stage) {
  const res = summarize(stage.checks);
  const lines = [];
  lines.push(`\n## Stage ${stage.stage}`);
  lines.push(`- **Status**: ${res.status}`);
  lines.push(`- **Summary**: ${res.passed}/${res.total} passed`);
  lines.push(`- **Checks**:`);
  if (stage.checks.length === 0) {
    lines.push('  - No checks recorded');
  } else {
    for (const c of stage.checks) {
      lines.push(`  - ${c.passed ? '✅' : '❌'} ${c.name} — ${c.evidence || ''}`);
    }
  }
  lines.push(`- **Action Items**:`);
  lines.push(actionItems(stage.checks).join('\n'));
  return lines.join('\n');
}

function main() {
  const outDir = path.join(process.cwd(), 'reports');
  ensureDir(outDir);

  const smoke = readJSON(path.join(outDir, 'smoke.json'), { checks: [] });
  const stages = Array.from({ length: 8 }, (_, i) => collectStage(i + 1));

  const mdParts = [mdHeader()];
  const json = { generatedAt: new Date().toISOString(), stages: [], smoke };

  for (const st of stages) {
    mdParts.push(mdStage(st));
    json.stages.push({ stage: st.stage, summary: summarize(st.checks), checks: st.checks });
  }

  fs.writeFileSync(path.join(outDir, 'verification-report.md'), mdParts.join('\n'));
  fs.writeFileSync(path.join(outDir, 'verification-report.json'), JSON.stringify(json, null, 2));
  console.log('Report written to reports/verification-report.{md,json}');
}

main();
