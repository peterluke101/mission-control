/**
 * Next.js App Router handler — GET /api/chat/health
 *
 * Polled every ~30s by the chat dock to drive the status dot. Always
 * returns HTTP 200 with `{ ok, ts, error? }` so the client can
 * distinguish "this route is reachable but upstream is down" from
 * "the dashboard itself is offline".
 *
 * Local-dev twin of `functions/api/chat/health.ts` (the Cloudflare
 * Pages Function); see that file for the deploy-time counterpart.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HEALTH_TIMEOUT_MS = 5000;

export async function GET(): Promise<Response> {
  const tunnel = process.env.MC_TUNNEL_URL || 'http://127.0.0.1:54173';
  const secret = process.env.MC_CHAT_SECRET;
  const now = new Date().toISOString();

  if (!secret) {
    return Response.json(
      { ok: false, ts: now, error: 'MC_CHAT_SECRET not configured' },
      { status: 200 },
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  try {
    const upstream = await fetch(`${tunnel.replace(/\/$/, '')}/health`, {
      headers: { Authorization: `Bearer ${secret}` },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!upstream.ok) {
      return Response.json(
        { ok: false, ts: now, error: `upstream ${upstream.status}` },
        { status: 200 },
      );
    }
    // Upstream returns { ok, ts, channel, queued } — pass through.
    const body = (await upstream.json()) as Record<string, unknown>;
    return Response.json({ ok: true, ts: now, upstream: body }, { status: 200 });
  } catch (err) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : 'unknown error';
    return Response.json(
      { ok: false, ts: now, error: msg },
      { status: 200 },
    );
  }
}
