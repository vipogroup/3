// lib/mongoose.js
import mongoose from 'mongoose';
import { mongoConfig } from './mongoConfig';
import '@/models/Message';

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

let hasLoggedConnectAttempt = false;
let hasLoggedConnectSuccess = false;
let hasLoggedConnectError = false;

function logConnectAttempt() {
  if (hasLoggedConnectAttempt) return;
  hasLoggedConnectAttempt = true;
  console.log('🔵 MONGO CONNECTING:', process.env.MONGODB_URI);
}

function logConnectSuccess() {
  if (hasLoggedConnectSuccess) return;
  hasLoggedConnectSuccess = true;
  console.log('🟢 MONGO CONNECTED OK');
}

function logConnectError(err) {
  if (hasLoggedConnectError) return;
  hasLoggedConnectError = true;
  console.error('🔴 MONGO CONNECTION ERROR:', err?.message || err);
}

export async function connectMongo() {
  // Skip MongoDB connection during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('⏭️ Skipping MongoDB connection during build');
    return null;
  }

  // Also skip if no URI is configured
  if (!mongoConfig.uri) {
    console.log('⏭️ Skipping MongoDB connection - no URI configured');
    return null;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    logConnectAttempt();
    cached.promise = mongoose
      .connect(mongoConfig.uri, {
        dbName: mongoConfig.dbName,
        maxPoolSize: 10,
      })
      .then((m) => {
        logConnectSuccess();
        return m;
      })
      .catch((err) => {
        logConnectError(err);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Alias to maintain compatibility with code expecting connectToDB
export async function connectToDB() {
  return connectMongo();
}
