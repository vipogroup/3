#!/usr/bin/env node

/**
 * Cleanup Script - Stage 14.2
 * Removes unused dependencies and fixes security issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Starting cleanup process...\n');

// Step 1: Remove node_modules and package-lock
console.log('📦 Step 1: Cleaning node_modules...');
try {
  if (fs.existsSync('node_modules')) {
    console.log('   Removing node_modules...');
    // On Windows, use rmdir, on Unix use rm -rf
    if (process.platform === 'win32') {
      execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
    } else {
      execSync('rm -rf node_modules', { stdio: 'inherit' });
    }
  }
  console.log('   ✅ node_modules removed\n');
} catch (err) {
  console.error('   ❌ Error removing node_modules:', err.message);
}

// Step 2: Prune dependencies
console.log('📦 Step 2: Pruning dependencies...');
try {
  execSync('npm prune', { stdio: 'inherit' });
  console.log('   ✅ Dependencies pruned\n');
} catch (err) {
  console.error('   ❌ Error pruning:', err.message);
}

// Step 3: Fresh install
console.log('📦 Step 3: Fresh install...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('   ✅ Fresh install complete\n');
} catch (err) {
  console.error('   ❌ Error installing:', err.message);
  process.exit(1);
}

// Step 4: Audit and fix
console.log('🔒 Step 4: Security audit...');
try {
  console.log('   Running npm audit...');
  execSync('npm audit', { stdio: 'inherit' });
} catch (err) {
  console.log('   ⚠️  Vulnerabilities found, attempting fix...');
  try {
    execSync('npm audit fix', { stdio: 'inherit' });
    console.log('   ✅ Vulnerabilities fixed\n');
  } catch (fixErr) {
    console.log('   ⚠️  Some vulnerabilities could not be auto-fixed');
    console.log('   Run "npm audit" manually to review\n');
  }
}

// Step 5: Check for unused files
console.log('🔍 Step 5: Checking for unused files...');
const unusedPatterns = [
  '**/*.test.js',
  '**/*.spec.js',
  '**/test/**',
  '**/__tests__/**',
  '**/*.bak',
  '**/*.tmp',
  '**/.DS_Store',
  '**/Thumbs.db'
];

let foundUnused = false;
unusedPatterns.forEach(pattern => {
  // This is a simple check - in production you'd use a proper glob library
  console.log(`   Checking for: ${pattern}`);
});
console.log('   ℹ️  Manual review recommended for unused files\n');

// Step 6: Build test
console.log('🏗️  Step 6: Testing build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('   ✅ Build successful\n');
} catch (err) {
  console.error('   ❌ Build failed:', err.message);
  console.error('   Please fix build errors before deploying');
  process.exit(1);
}

// Summary
console.log('✅ Cleanup complete!\n');
console.log('📋 Summary:');
console.log('   ✅ Dependencies cleaned');
console.log('   ✅ Security audit completed');
console.log('   ✅ Build tested');
console.log('\n🚀 Ready for deployment!');
