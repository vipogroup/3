// Mock DB for development when MongoDB connection fails
import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';
import { seedMockUsers } from './db-mock-seed.js';

const mockUsers = new Map();

const MOCK_DB_DIR = path.join(process.cwd(), '.mock-db');
const USERS_FILE = path.join(MOCK_DB_DIR, 'users.json');

async function ensureDir() {
  await fs.mkdir(MOCK_DB_DIR, { recursive: true });
}

async function persistToDisk() {
  try {
    await ensureDir();
    const data = JSON.stringify(Array.from(mockUsers.values()), null, 2);
    await fs.writeFile(USERS_FILE, data, 'utf8');
  } catch (err) {
    console.error('MOCK_DB_SAVE_FAILED', err);
  }
}

async function loadFromDisk() {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return false;
    }

    mockUsers.clear();
    for (const user of parsed) {
      const normalized = {
        ...user,
        createdAt: user?.createdAt ? new Date(user.createdAt) : new Date(),
        updatedAt: user?.updatedAt ? new Date(user.updatedAt) : new Date(),
        passwordResetExpires: user?.passwordResetExpires
          ? new Date(user.passwordResetExpires)
          : null,
      };

      const key = normalized.email || normalized.phone || normalized._id;
      mockUsers.set(key, normalized);
    }

    console.log(`💾 Mock DB loaded ${mockUsers.size} users from disk`);
    return mockUsers.size > 0;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('MOCK_DB_LOAD_FAILED', err);
    }
    return false;
  }
}

// Initialize with test users
const initMockDb = async () => {
  if (mockUsers.size === 0) {
    const loaded = await loadFromDisk();
    if (!loaded || mockUsers.size === 0) {
      await seedMockUsers(mockUsers);
      console.log('🔧 Mock DB initialized with test users');
      await persistToDisk();
    }
  }
};

class MockCollection {
  constructor(name, data) {
    this.name = name;
    this.data = data;
  }

  async findOne(query) {
    if (this.name === 'users') {
      // Handle $or operator for login
      if (query.$or && Array.isArray(query.$or)) {
        for (const condition of query.$or) {
          if (condition.email) {
            const user = mockUsers.get(condition.email);
            if (user) return user;
          }
          if (condition.phone) {
            // Search by phone
            for (const user of mockUsers.values()) {
              if (user.phone === condition.phone) return user;
            }
          }
        }
        return null;
      }
      
      // Handle simple email query
      if (query.email) {
        return mockUsers.get(query.email) || null;
      }
      
      // Handle phone query
      if (query.phone) {
        for (const user of mockUsers.values()) {
          if (user.phone === query.phone) return user;
        }
      }

      // Handle password reset token lookup
      if (query.passwordResetToken) {
        for (const user of mockUsers.values()) {
          if (user.passwordResetToken === query.passwordResetToken) {
            return user;
          }
        }
      }

      // Handle _id query
      if (query._id) {
        for (const user of mockUsers.values()) {
          if (user._id === query._id || user._id === String(query._id)) {
            return user;
          }
        }
      }
    }
    return null;
  }

  async find(query) {
    return {
      project: (fields) => {
        return {
          toArray: async () => {
            if (this.name === 'users') {
              return Array.from(mockUsers.values()).map(user => {
                if (!fields) return user;
                const projected = {};
                Object.keys(fields).forEach(key => {
                  if (fields[key]) projected[key] = user[key];
                });
                return projected;
              });
            }
            if (this.name === 'products') {
              // Return empty array for products in mock
              return [];
            }
            return [];
          }
        };
      },
      toArray: async () => {
        if (this.name === 'users') {
          return Array.from(mockUsers.values());
        }
        if (this.name === 'products') {
          return [];
        }
        return [];
      }
    };
  }

  async countDocuments() {
    if (this.name === 'users') return mockUsers.size;
    return 0;
  }

  async insertOne(doc) {
    if (this.name === 'users') {
      const id = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newDoc = { ...doc, _id: id };
      const key = doc.email || doc.phone || id;
      mockUsers.set(key, newDoc);
      await persistToDisk();
      return { insertedId: id };
    }
    return { insertedId: null };
  }

  async updateOne(filter, update, options = {}) {
    if (this.name !== 'users') {
      return { matchedCount: 0, modifiedCount: 0 };
    }

    let matchedKey = null;
    let existing = null;

    if (filter.email) {
      matchedKey = filter.email;
      existing = mockUsers.get(filter.email) || null;
    }

    if (!existing && filter._id) {
      const targetId = String(filter._id);
      for (const [key, user] of mockUsers.entries()) {
        if (String(user._id) === targetId) {
          matchedKey = key;
          existing = user;
          break;
        }
      }
    }

    if (!existing && !options?.upsert) {
      return { matchedCount: 0, modifiedCount: 0 };
    }

    const updated = {
      ...(existing || {}),
      ...(update?.$set || {}),
    };

    if (!updated._id) {
      updated._id = existing?._id || `mock-${Date.now()}`;
    }

    if (update?.$setOnInsert && !existing) {
      Object.assign(updated, update.$setOnInsert);
    }

    if (update?.$unset) {
      for (const key of Object.keys(update.$unset)) {
        delete updated[key];
      }
    }

    if (!updated.createdAt) {
      updated.createdAt = existing?.createdAt || new Date();
    }
    updated.updatedAt = new Date();

    const newKey = updated.email || updated.phone || updated._id;
    if (matchedKey && newKey !== matchedKey) {
      mockUsers.delete(matchedKey);
    }

    mockUsers.set(newKey, updated);
    await persistToDisk();

    return {
      matchedCount: existing ? 1 : 0,
      modifiedCount: existing ? 1 : 0,
      upsertedId: existing ? null : updated._id,
    };
  }
}

class MockDb {
  constructor() {
    this.databaseName = 'vipo-mock';
  }

  collection(name) {
    return new MockCollection(name, mockUsers);
  }
}

let mockDbInstance = null;

export async function getDb() {
  if (!mockDbInstance) {
    await initMockDb();
    mockDbInstance = new MockDb();
    console.log('⚠️  Using MOCK database (MongoDB connection unavailable)');
  }
  return mockDbInstance;
}
