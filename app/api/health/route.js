import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

/**
 * Health Check Endpoint
 *
 * Used for uptime monitoring and deployment health checks.
 * No authentication required.
 *
 * GET /api/health
 * Returns: { status: 'ok', timestamp: ISO string }
 */

async function GETHandler() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

export const GET = withErrorLogging(GETHandler);
