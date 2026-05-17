/**
 * GET /api/chat/health
 *
 * Probes NanoClaw at `${MC_TUNNEL_URL}/health` with the shared bearer.
 * Returns 200 with `{ ok, ts, error? }` either way so the client can
 * distinguish a network failure from a health-endpoint failure (vs.
 * the proxy itself being down, which would be a non-200 here).
 */

interface Env {
  MC_TUNNEL_URL?: string;
  MC_CHAT_SECRET?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

function ok200(payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequestGet(ctx: PagesContext): Promise<Response> {
  const { env } = ctx;
  const tunnel = env.MC_TUNNEL_URL;
  const secret = env.MC_CHAT_SECRET;
  const ts = Date.now();

  if (!tunnel || !secret) {
    return ok200({
      ok: false,
      ts,
      error: !tunnel ? 'MC_TUNNEL_URL not configured' : 'MC_CHAT_SECRET not configured',
    });
  }

  try {
    // Short timeout so a hung tunnel doesn't keep the dot stale.
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 5_000);
    const upstream = await fetch(`${tunnel.replace(/\/$/, '')}/health`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${secret}` },
      signal: ac.signal,
    });
    clearTimeout(timer);

    if (!upstream.ok) {
      return ok200({ ok: false, ts, error: `Upstream ${upstream.status}` });
    }
    // Try to surface upstream payload but tolerate non-JSON.
    let upstreamData: unknown = null;
    try {
      upstreamData = await upstream.json();
    } catch {
      upstreamData = null;
    }
    return ok200({ ok: true, ts, upstream: upstreamData });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return ok200({ ok: false, ts, error: msg });
  }
}
