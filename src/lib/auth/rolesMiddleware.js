/**
 * Role guard utilities usable both in Next server code and Express-like contexts.
 */
export function allow(...roles) {
  return function enforceRole(ctx = {}) {
    const user = ctx.user || ctx.req?.user || null;
    if (!user) return false;
    return roles.includes(user.role);
  };
}
