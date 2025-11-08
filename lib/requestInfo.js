export function getReqInfo(req) {
  const ip = req?.headers?.get?.("x-forwarded-for") || req?.headers?.get?.("x-real-ip") || "";
  const userAgent = req?.headers?.get?.("user-agent") || "";
  return { ip, userAgent };
}
