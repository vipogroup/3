import mongoose from 'mongoose';

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/vipo_dev';

function resolveMongoUri() {
  const explicitUri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();
  if (explicitUri) {
    return explicitUri;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn('ℹ️  MONGODB_URI missing; defaulting to local MongoDB at 127.0.0.1:27017/vipo_dev');
    return DEFAULT_LOCAL_URI;
  }

  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const MONGODB_URI = resolveMongoUri();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
