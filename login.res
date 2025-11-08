HTTP/1.1 401 Unauthorized
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'
vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch
content-type: application/json
Date: Fri, 07 Nov 2025 23:22:16 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{"error":"BAD_CREDENTIALS"}
