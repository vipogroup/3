/**
 * Compatibility wrapper: re-export existing bcrypt helpers.
 */
export { hashPassword, verifyPassword as comparePassword } from '../../..//lib/auth/hash.js';
