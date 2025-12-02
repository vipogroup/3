/**
 * Compatibility wrapper: re-export existing JWT helpers.
 */
export { sign as signJwt, verify as verifyJwt } from '../../..//lib/auth/createToken.js';
