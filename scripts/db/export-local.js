// scripts/db/export-local.js
// Export all collections from the configured MongoDB into JSON files

const fs = require('fs/promises');
const path = require('path');
const { MongoClient } = require('mongodb');
const { EJSON } = require('bson');
const dotenv = require('dotenv');

const envFiles = [
  path.join(process.cwd(), '.env.local'),
  path.join(process.cwd(), 'app', '.env.local'),
];

for (const envFile of envFiles) {
  dotenv.config({ path: envFile, override: true });
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'vipo';
const backupRoot = path.join(process.cwd(), 'backups');

if (!uri) {
  console.error('❌ MONGODB_URI missing. Aborting export.');
  process.exit(1);
}

async function exportDb() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const exportDir = path.join(backupRoot, `mongo-${timestamp}`);
  await fs.mkdir(exportDir, { recursive: true });

  const client = new MongoClient(uri);
  try {
    console.log('📦 Connecting to MongoDB...');
    await client.connect();
    console.log(`✅ Connected. Database: ${dbName}`);

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    if (!collections.length) {
      console.warn('⚠️  No collections found to export.');
      return;
    }

    for (const coll of collections) {
      const colName = coll.name;
      console.log(`➡️  Exporting collection: ${colName}`);
      const docs = await db.collection(colName).find({}).toArray();
      const filePath = path.join(exportDir, `${colName}.json`);
      const json = EJSON.stringify(docs, null, 2);
      await fs.writeFile(filePath, json, 'utf8');
      console.log(`   ↳ Saved ${docs.length} documents to ${path.relative(process.cwd(), filePath)}`);
    }

    console.log(`✅ Export complete. Files saved to ${path.relative(process.cwd(), exportDir)}`);
  } catch (err) {
    console.error('❌ Export failed:', err);
    process.exitCode = 1;
  } finally {
    await client.close().catch(() => {});
  }
}

exportDb();
