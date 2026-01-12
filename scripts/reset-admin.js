// scripts/reset-admin.js
// Deterministic & Idempotent bootstrap script — do not convert to upsert
// CommonJS for maximum compatibility when "type" is not "module"

const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI is missing (not set via environment or .env.local)");
  process.exit(1);
}

// SAFETY GUARD: block production unless explicitly allowed
const nodeEnv = process.env.NODE_ENV || "development";
const allowReset = String(process.env.ALLOW_ADMIN_RESET || "").toLowerCase() === "true";

if (nodeEnv === "production" && !allowReset) {
  console.error("🛑 reset-admin blocked in production. Set ALLOW_ADMIN_RESET=true to override.");
  process.exit(1);
}

/* SAFETY GUARD: allow reset-admin only on approved DB names */
const allowedDbNames = new Set(["vipo", "vipo_dev"]);

const dbNameForGuard = process.env.MONGODB_DB || "vipo";

if (!allowedDbNames.has(dbNameForGuard)) {
  console.error(
    `🛑 reset-admin blocked: DB name "${dbNameForGuard}" is not in allowed list (${Array.from(allowedDbNames).join(", ")})`
  );
  process.exit(1);
}

// Prefer explicit DB name, fallback to "vipo"
const dbName = process.env.MONGODB_DB || "vipo";

// hard-code admin credentials per latest request
const ADMIN_EMAIL = "m0587009938@gmail.com";
const ADMIN_PHONE = "0587009938";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "12345678";

// Only delete conflicts based on these identity fields (safety guard)
const IDENTITY_FIELDS = new Set(["email", "phone"]);

(async () => {
  const client = new MongoClient(uri);
  let exitCode = 0;

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");

    // Normalize values exactly as stored/expected in DB
    const email = String(ADMIN_EMAIL || "").trim().toLowerCase() || null;

    const phoneRaw = String(ADMIN_PHONE || "").trim();
    const phoneDigits = phoneRaw.replace(/\D/g, "");
    const phone = phoneDigits || phoneRaw || null;

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const now = new Date();

    const adminDoc = {
      email,
      phone,
      passwordHash,
      role: "admin",
      isActive: true,
      tenantId: null,
      createdAt: now,
      updatedAt: now,
    };

    // Read indexes (safe even if collection doesn't exist yet)
    let indexes = [];
    try {
      indexes = await users.indexes();
    } catch (err) {
      const codeName = err?.codeName || "";
      const msg = String(err?.message || "").toLowerCase();
      if (codeName !== "NamespaceNotFound" && !msg.includes("ns does not exist")) {
        throw err;
      }
      indexes = [];
    }

    // Keep only UNIQUE indexes (excluding _id) AND only those involving identity fields
    const uniqueIndexes = (Array.isArray(indexes) ? indexes : []).filter((idx) => {
      if (!idx || !idx.unique) return false;
      const key = idx.key || {};
      const fields = Object.keys(key);
      if (!fields.length) return false;
      if (fields.includes("_id")) return false;

      // SAFETY: do not delete based on unrelated unique indexes
      // Only consider indexes that include at least one identity field (email/phone)
      const hasIdentityField = fields.some((f) => IDENTITY_FIELDS.has(f));
      return hasIdentityField;
    });

    const deletionGroups = {};

    for (const idx of uniqueIndexes) {
      const key = idx.key || {};
      const fields = Object.keys(key);
      if (!fields.length) continue;

      const andParts = [];

      // Respect partialFilterExpression only if adminDoc definitely matches it
      if (idx.partialFilterExpression && typeof idx.partialFilterExpression === "object") {
        const pfe = idx.partialFilterExpression;
        let definitelyNotMatching = false;

        for (const k of Object.keys(pfe)) {
          const v = pfe[k];

          // If it's an operator object ($exists, $type, etc) we cannot confidently validate; skip validation
          if (v && typeof v === "object") continue;

          if (!Object.prototype.hasOwnProperty.call(adminDoc, k) || adminDoc[k] !== v) {
            definitelyNotMatching = true;
            break;
          }
        }

        if (definitelyNotMatching) continue;
        andParts.push(pfe);
      }

      // Build exact equality constraints only for fields we actually have values for
      // IMPORTANT: We DO NOT "fill" missing fields with null/exists false for safety
      // We only delete conflicts tied to identity fields present in adminDoc.
      let includedAnyIdentity = false;

      for (const field of fields) {
        if (!Object.prototype.hasOwnProperty.call(adminDoc, field)) continue;

        const val = adminDoc[field];

        // Only identity fields should trigger deletions
        if (IDENTITY_FIELDS.has(field)) {
          includedAnyIdentity = true;
        }

        andParts.push({ [field]: val });
      }

      // If we couldn't anchor the delete by email/phone, skip this index (safety)
      if (!includedAnyIdentity) continue;

      const filter = andParts.length === 1 ? andParts[0] : { $and: andParts };

      const collation = idx.collation && typeof idx.collation === "object" ? idx.collation : null;
      const groupKey = collation ? JSON.stringify(collation) : "default";

      if (!deletionGroups[groupKey]) {
        deletionGroups[groupKey] = { collation, filters: [] };
      }
      deletionGroups[groupKey].filters.push(filter);
    }

    // If we didn't build any index-based deletions, fallback ONLY to email/phone direct match
    let deletedCount = 0;
    const groupKeys = Object.keys(deletionGroups);

    if (groupKeys.length) {
      for (const groupKey of groupKeys) {
        const group = deletionGroups[groupKey];
        const groupFilter =
          group.filters.length === 1 ? group.filters[0] : { $or: group.filters };

        const res = group.collation
          ? await users.deleteMany(groupFilter, { collation: group.collation })
          : await users.deleteMany(groupFilter);

        deletedCount += res?.deletedCount || 0;
      }
    } else {
      const fallbackOr = [];
      if (adminDoc.phone) fallbackOr.push({ phone: adminDoc.phone });
      if (adminDoc.email) fallbackOr.push({ email: adminDoc.email });

      const fallbackFilter = fallbackOr.length === 1 ? fallbackOr[0] : { $or: fallbackOr };
      const res = fallbackOr.length ? await users.deleteMany(fallbackFilter) : { deletedCount: 0 };
      deletedCount += res?.deletedCount || 0;
    }

    // Insert fresh admin
    const insertResult = await users.insertOne(adminDoc);

    console.log(JSON.stringify({ deletedCount }));
    console.log(JSON.stringify({ insertedId: String(insertResult.insertedId) }));
  } catch (e) {
    exitCode = 1;
    console.error("❌ Error resetting admin:", e?.message || e);
  } finally {
    try {
      await client.close();
    } catch {}
    process.exit(exitCode);
  }
})();
