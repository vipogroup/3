/**
 * Minimal model descriptor to satisfy the Stage 2 checklist.
 * This project does not currently use an ORM; the "model" documents the shape only.
 */

export const UserSchema = {
  fullName: "string",
  phone: "string",
  role: "admin|agent",
  passwordHash: "string",
  createdAt: "date",
};

export function validateUserShape(obj) {
  if (!obj) return false;
  const has = (key) => Object.prototype.hasOwnProperty.call(obj, key);
  return ["fullName", "phone", "role", "passwordHash"].every((key) => has(key));
}

export function toPublicUser(doc) {
  if (!doc) return null;
  const { _id, fullName, phone, role, createdAt } = doc;
  return { _id, fullName, phone, role, createdAt };
}
