/**
 * Simple in-memory rate limiter for API routes
 *
 * Usage:
 *   import { checkRateLimit } from '@/lib/rateLimit';
 *
 *   export async function POST(req) {
 *     const rateLimitResult = checkRateLimit(req, 'login', { maxRequests: 5, windowMs: 60000 });
 *     if (!rateLimitResult.allowed) {
 *       return NextResponse.json({ error: rateLimitResult.message }, { status: 429 });
 *     }
 *     // ... rest of handler
 *   }
 */

// In-memory store: Map<key, { count: number, resetAt: number }>
const store = new Map();

// Cleanup old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, value] of store.entries()) {
    if (value.resetAt < now) {
      store.delete(key);
    }
  }
}

/**
 * Get client IP from request
 * @param {Request} req
 * @returns {string}
 */
function getClientIp(req) {
  // Try various headers used by proxies/load balancers
  const forwarded = req.headers?.get?.('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = req.headers?.get?.('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback
  return 'unknown';
}

/**
 * Check rate limit for a request
 * @param {Request} req - The incoming request
 * @param {string} routeKey - Unique identifier for the route (e.g., 'login', 'register')
 * @param {Object} options - Rate limit options
 * @param {number} options.maxRequests - Maximum requests allowed in window (default: 10)
 * @param {number} options.windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns {{ allowed: boolean, remaining: number, resetAt: number, message?: string }}
 */
export function checkRateLimit(req, routeKey, options = {}) {
  const { maxRequests = 10, windowMs = 60 * 1000 } = options;

  cleanup();

  const ip = getClientIp(req);
  const key = `${routeKey}:${ip}`;
  const now = Date.now();

  let entry = store.get(key);

  // If no entry or window expired, create new entry
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, entry);

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count += 1;

  // Check if over limit
  if (entry.count > maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      message: `Too many requests. Please try again in ${retryAfterSeconds} seconds.`,
      retryAfter: retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
  // Auth endpoints: 5 requests per minute
  auth: (req) => checkRateLimit(req, 'auth', { maxRequests: 5, windowMs: 60 * 1000 }),

  // OTP: 3 requests per 5 minutes
  otp: (req) => checkRateLimit(req, 'otp', { maxRequests: 3, windowMs: 5 * 60 * 1000 }),

  // Registration: 3 requests per 10 minutes
  register: (req) => checkRateLimit(req, 'register', { maxRequests: 3, windowMs: 10 * 60 * 1000 }),

  // Login: 5 requests per 5 minutes
  login: (req) => checkRateLimit(req, 'login', { maxRequests: 5, windowMs: 5 * 60 * 1000 }),
};
