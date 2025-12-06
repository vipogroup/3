import { MongoClient } from 'mongodb';
import { mongoConfig } from './mongoConfig';

let cached = global._mongoCache;
if (!cached) {
  cached = global._mongoCache = { client: null, db: null, promise: null };
}

let hasLoggedConnectAttempt = false;
let hasLoggedConnectSuccess = false;
let hasLoggedConnectError = false;

function obfuscateUri(connectionUri) {
  return connectionUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
}

async function initClient() {
  if (!cached.promise) {
    if (!hasLoggedConnectAttempt) {
      hasLoggedConnectAttempt = true;
      console.log('🔵 MONGO CONNECTING:', process.env.MONGODB_URI);
      console.log('📍 URI:', obfuscateUri(mongoConfig.uri));
    }
    const client = new MongoClient(mongoConfig.uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    cached.promise = client
      .connect()
      .then((connectedClient) => {
        if (!hasLoggedConnectSuccess) {
          hasLoggedConnectSuccess = true;
          console.log('🟢 MONGO CONNECTED OK');
        }
        cached.client = connectedClient;
        cached.db = connectedClient.db(mongoConfig.dbName);
        return cached;
      })
      .catch((err) => {
        cached.promise = null;
        if (!hasLoggedConnectError) {
          hasLoggedConnectError = true;
          console.error('🔴 MONGO CONNECTION ERROR:', err?.message || err);
        }
        throw err;
      });
  }

  if (!cached.client || !cached.db) {
    await cached.promise;
  }

  return cached;
}

export async function connectToDatabase() {
  const { client, db } = await initClient();
  return { client, db };
}

export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

export async function connectDB() {
  const { client } = await connectToDatabase();
  return client;
}
