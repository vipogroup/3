import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function sign(payload, options = {}) {
  if (!SECRET) throw new Error('JWT_SECRET missing');
  return jwt.sign(payload, SECRET, { expiresIn: '7d', ...options });
}

export function verify(token) {
  if (!SECRET || !token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
