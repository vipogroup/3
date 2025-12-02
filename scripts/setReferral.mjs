import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import User from '../models/User.js';

function loadEnvFiles() {
  const candidates = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
  ];
  for (const file of candidates) {
    try {
      if (!fs.existsSync(file)) continue;
      const txt = fs.readFileSync(file, 'utf8');
      for (const line of txt.split(/\r?\n/)) {
        if (!line || /^\s*#/.test(line)) continue;
        const m = line.match(/^\s*([^=\s]+)\s*=\s*(.*)\s*$/);
        if (!m) continue;
        const key = m[1];
        const val = m[2];
        process.env[key] = val;
      }
    } catch {}
  }
}

loadEnvFiles();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'vipo';

(async () => {
  try {
    if (!MONGODB_URI) throw new Error('MONGODB_URI missing');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });

    const ref = 'q3k9f2m8z1';
    const doc = await User.findOneAndUpdate(
      { role: 'agent' },
      { $set: { referralId: ref } },
      { new: true },
    ).lean();

    if (!doc) {
      console.log('❌ לא נמצא משתמש עם role=agent. צור סוכן ואז נסה שוב.');
    } else {
      console.log('✅ עודכן referralId:', ref, 'ל־User:', String(doc._id));
    }
  } catch (e) {
    console.error('Update referralId error:', e);
  } finally {
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(0);
  }
})();
