#!/usr/bin/env node

/**
 * Stage 15.1 - Build Audit & Dependencies Cleanup
 * This script helps clean up duplicate dependencies and prepare for build
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Stage 15.1 - Build Audit & Dependencies Cleanup\n');

// Step 1: Check for duplicate dependencies
console.log('📦 Step 1: Checking for duplicate dependencies...\n');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const duplicates = [];

// Check for bcrypt + bcryptjs
if (packageJson.dependencies.bcrypt && packageJson.dependencies.bcryptjs) {
  duplicates.push({
    name: 'bcrypt + bcryptjs',
    recommendation: 'Keep bcryptjs only (pure JS, cross-platform)',
    action: 'npm uninstall bcrypt',
  });
}

// Check for jose + jsonwebtoken
if (packageJson.dependencies.jose && packageJson.dependencies.jsonwebtoken) {
  duplicates.push({
    name: 'jose + jsonwebtoken',
    recommendation: 'Keep one JWT library (jose is more modern)',
    action: 'npm uninstall jsonwebtoken (or jose if using jsonwebtoken in code)',
  });
}

if (duplicates.length > 0) {
  console.log('⚠️  Found duplicate dependencies:\n');
  duplicates.forEach((dup, i) => {
    console.log(`${i + 1}. ${dup.name}`);
    console.log(`   Recommendation: ${dup.recommendation}`);
    console.log(`   Action: ${dup.action}\n`);
  });
} else {
  console.log('✅ No duplicate dependencies found\n');
}

// Step 2: Check outdated packages
console.log('📊 Step 2: Checking for outdated packages...\n');
try {
  execSync('npm outdated', { stdio: 'inherit' });
} catch (err) {
  // npm outdated exits with code 1 if there are outdated packages
  console.log('\n⚠️  Some packages are outdated (see above)\n');
}

// Step 3: Security audit
console.log('🔒 Step 3: Running security audit...\n');
try {
  execSync('npm audit --production', { stdio: 'inherit' });
  console.log('\n✅ No security vulnerabilities found\n');
} catch (err) {
  console.log('\n⚠️  Security vulnerabilities found (see above)\n');
  console.log('Run "npm audit fix" to attempt automatic fixes\n');
}

// Step 4: Recommendations
console.log('📋 Step 4: Recommendations\n');
console.log('To clean up dependencies:');
console.log('1. Remove bcrypt: npm uninstall bcrypt');
console.log('2. Choose one JWT library (jose or jsonwebtoken)');
console.log('3. Update packages: npm update');
console.log('4. Fix security issues: npm audit fix');
console.log('5. Rebuild: npm run build');
console.log('\n');

// Step 5: Generate report
const report = {
  timestamp: new Date().toISOString(),
  duplicates: duplicates.length,
  duplicatesList: duplicates,
  packageCount: {
    dependencies: Object.keys(packageJson.dependencies || {}).length,
    devDependencies: Object.keys(packageJson.devDependencies || {}).length,
  },
};

const reportPath = path.join(process.cwd(), 'stage-15-1-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📄 Report saved to: ${reportPath}\n`);

console.log('✅ Audit complete!\n');
console.log('Next steps:');
console.log('1. Review the recommendations above');
console.log('2. Make necessary changes to package.json');
console.log('3. Run: npm ci');
console.log('4. Run: npm run build');
console.log('5. Fix any build errors/warnings');
console.log('6. Create PR: "15.1 – Build & Security Dependencies Cleanup"');
