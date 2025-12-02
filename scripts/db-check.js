const fs = require('fs');
const path = require('path');

function loadEnv(filePath) {
  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Missing env file at ${absPath}`);
  }

  const content = fs.readFileSync(absPath, 'utf8');
  content
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith('#'))
    .forEach((line) => {
      const [key, ...rest] = line.split('=');
      if (!key) return;
      if (process.env[key] !== undefined) return;
      const value = rest.join('=');
      process.env[key] = value;
    });
}

loadEnv('.env.local');
const { MongoClient } = require('mongodb');

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI missing');

    const client = new MongoClient(uri);
    await client.connect();

    const dbName = process.env.MONGODB_DB || 'vipo';
    const db = client.db(dbName);

    const collections = await db.listCollections().toArray();
    console.log(
      'collections:',
      collections.map((c) => c.name),
    );

    const count = await db.collection('products').countDocuments();
    console.log('products count:', count);

    const sample = await db
      .collection('products')
      .find({}, { projection: { _id: 0, title: 1, price: 1 } })
      .limit(3)
      .toArray();
    console.log('sample products:', sample);

    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('db-check error:', err);
    process.exit(1);
  }
})();
