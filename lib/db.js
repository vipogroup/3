import { MongoClient } from 'mongodb';
import { logOperationalEvent } from './observability';

const uri = process.env.MONGODB_URI;
const USE_MOCK = process.env.USE_MOCK_DB === 'true';

let client;
let clientPromise;
let useMock = USE_MOCK;
let warnedAboutMock = false;

function enableMock(reason) {
  useMock = true;
  if (!warnedAboutMock) {
    console.warn(`⚠️  Using MOCK database${reason ? ` (${reason})` : ''}`);
    warnedAboutMock = true;
  }
  logOperationalEvent('db.mock_enabled', { reason });
}

if (USE_MOCK) {
  enableMock('USE_MOCK_DB flag enabled');
}

if (!uri && !USE_MOCK) {
  enableMock('MONGODB_URI missing');
}

if (!useMock && !global._mongoClientPromise) {
  console.log('🔄 Connecting to MongoDB...');
  console.log('📍 URI:', uri ? uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') : 'MISSING');

  client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    retryWrites: true,
    retryReads: true,
  });

  global._mongoClientPromise = client
    .connect()
    .then((connectedClient) => {
      console.log('✅ MongoDB connected successfully!');
      console.log('📦 Database:', process.env.MONGODB_DB || 'vipo');
      return connectedClient;
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed!');
      console.error('📛 Error name:', err.name);
      console.error('📛 Error message:', err.message);
      console.error('📛 Error code:', err.code);
      enableMock('connection failed');
      return null;
    });
}

if (!useMock) {
  clientPromise = global._mongoClientPromise;
}

export async function connectDB() {
  // Alias for compatibility - ensures connection is initialized
  if (useMock) {
    return;
  }

  try {
    const c = await clientPromise;
    if (!c) {
      throw new Error('MongoDB connection failed');
    }
    return c;
  } catch (err) {
    console.error('❌ MongoDB connectDB error:', err.message);
    throw err;
  }
}

export async function getDb() {
  if (useMock) {
    const { getDb: getMockDb } = await import('./db-mock.js');
    return getMockDb();
  }

  try {
    const c = await clientPromise;
    if (!c) {
      enableMock('client unavailable');
      const { getDb: getMockDb } = await import('./db-mock.js');
      return getMockDb();
    }
    const dbName = process.env.MONGODB_DB || 'vipo';
    return c.db(dbName);
  } catch (err) {
    console.error('❌ MongoDB error:', err.message);
    enableMock('runtime error');
    const { getDb: getMockDb } = await import('./db-mock.js');
    return getMockDb();
  }
}
