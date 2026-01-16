import { MongoClient } from 'mongodb';
import { mongoConfig } from './mongoConfig.js';

let cached = global._mongoCache;
if (!cached) {
  cached = global._mongoCache = { client: null, db: null, promise: null };
}

const DEV_TENANT_WARN = process.env.NODE_ENV === 'development';

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
}

function getCallerLocation() {
  const stack = new Error().stack || '';
  const lines = stack.split('\n').map((l) => l.trim());
  for (const line of lines) {
    if (!line.includes('at ')) continue;
    if (line.includes('node_modules')) continue;
    if (line.includes('lib/db.js')) continue;
    return line.replace(/^at\s+/, '');
  }
  return 'unknown';
}

function containsTenantId(filter, depth = 0) {
  if (!filter || typeof filter !== 'object') return false;
  if (depth > 5) return false;
  if (Object.prototype.hasOwnProperty.call(filter, 'tenantId')) return true;
  for (const key of ['$and', '$or']) {
    const arr = filter[key];
    if (Array.isArray(arr) && arr.some((item) => containsTenantId(item, depth + 1))) {
      return true;
    }
  }
  return false;
}

function pipelineHasTenantMatch(pipeline) {
  if (!Array.isArray(pipeline)) return false;
  return pipeline.some((stage) => stage && typeof stage === 'object' && stage.$match && containsTenantId(stage.$match));
}

function warnMissingTenant({ collectionName, operation, details }) {
  if (!DEV_TENANT_WARN) return;
  const caller = getCallerLocation();
  const preview = safeStringify(details);
  console.warn(
    `[DEV][TENANT] Missing tenantId in DB query: ${collectionName}.${operation} (caller: ${caller}) details=${preview.slice(0, 500)}`,
  );
}

function wrapCollectionForDev(collectionName, col) {
  const METHODS = new Set([
    'find',
    'findOne',
    'countDocuments',
    'updateOne',
    'updateMany',
    'deleteOne',
    'deleteMany',
    'replaceOne',
    'findOneAndUpdate',
    'findOneAndReplace',
    'findOneAndDelete',
    'aggregate',
    'bulkWrite',
  ]);

  return new Proxy(col, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (!DEV_TENANT_WARN) return value;
      if (typeof prop !== 'string' || !METHODS.has(prop)) return value;
      if (typeof value !== 'function') return value;

      return function (...args) {
        try {
          if (prop === 'aggregate') {
            const pipeline = args[0];
            if (!pipelineHasTenantMatch(pipeline)) {
              warnMissingTenant({ collectionName, operation: prop, details: pipeline });
            }
          } else if (prop === 'bulkWrite') {
            const ops = Array.isArray(args[0]) ? args[0] : [];
            const hasAnyMissing = ops.some((op) => {
              if (!op || typeof op !== 'object') return false;
              const opName = Object.keys(op)[0];
              const payload = opName ? op[opName] : null;
              const filter = payload?.filter || payload?.q || null;
              if (!filter) return false;
              return !containsTenantId(filter);
            });
            if (hasAnyMissing) {
              warnMissingTenant({ collectionName, operation: prop, details: ops });
            }
          } else {
            const filter = args[0];
            if (!containsTenantId(filter)) {
              warnMissingTenant({ collectionName, operation: prop, details: filter });
            }
          }
        } catch {}

        return value.apply(target, args);
      };
    },
  });
}

function wrapDbForDev(db) {
  if (!DEV_TENANT_WARN || !db) return db;
  return new Proxy(db, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (!DEV_TENANT_WARN) return value;
      if (prop !== 'collection') return value;
      if (typeof value !== 'function') return value;
      return function (...args) {
        const name = args[0];
        const col = value.apply(target, args);
        return wrapCollectionForDev(String(name || 'unknown'), col);
      };
    },
  });
}

let hasLoggedConnectAttempt = false;
let hasLoggedConnectSuccess = false;
let hasLoggedConnectError = false;

function obfuscateUri(connectionUri) {
  return connectionUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
}

async function initClient() {
  // Skip MongoDB connection during build
  if (!mongoConfig.uri || mongoConfig.uri === '') {
    console.log('⏭️ Skipping MongoDB connection - no URI configured');
    return { client: null, db: null };
  }

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
        cached.db = wrapDbForDev(connectedClient.db(mongoConfig.dbName));
        return cached;
      })
      .catch((err) => {
        cached.promise = null;
        if (!hasLoggedConnectError) {
          hasLoggedConnectError = true;
          console.error('🔴 MONGO CONNECTION ERROR:', err?.message || err);
          // Don't throw during build, return null
          if (err.message?.includes('authentication failed') || err.code === 18) {
            console.warn('⚠️ MongoDB auth failed - continuing without DB');
            cached.client = null;
            cached.db = null;
            return cached;
          }
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
