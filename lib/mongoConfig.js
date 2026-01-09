const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || '';

// Only throw during runtime, not during build
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

if (!isBuildTime) {
  if (!uri) {
    throw new Error('❌ Missing MONGODB_URI environment variable');
  }

  if (!dbName) {
    throw new Error('❌ Missing MONGODB_DB environment variable');
  }
}

if (process.env.NODE_ENV === 'development' && uri.startsWith('mongodb://127.0.0.1')) {
  console.warn('ℹ️  Using local MongoDB instance (127.0.0.1). Make sure this is intended.');
}

export const mongoConfig = {
  uri,
  dbName,
};
