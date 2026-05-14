/**
 * GET /api/chat/pending
 *
 * Cloudflare Pages Function that proxies to NanoClaw's `GET /chat/pending`
 * (the dock-offline buffer drain endpoint added in nanoclaw PR #4).
 *
 * Returns `{ messages: BufferedMessage[] }` with read-once semantics — each
 * message comes back exactly once, then the upstream clears the buffer.
 *
 * Env vars (set in the Pages dashboard, NOT in source):
 *   MC_TUNNEL_URL    e.g. https://<host>.<tailnet>.ts.net:54173
 *   MC_CHAT_SECRET   shared bearer secret, must match NanoClaw side
 *
 * The dock polls this on mount and every 10s while open. Each entry is
 * `{ text: string, ts: string }`; the dock decides role rendering by whether
 * the text starts with `📥 […]` (user mirror) vs anything else (agent reply).
 */

interface Env {
  MC_TUNNEL_URL?: string;
  MC_CHAT_SECRET?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
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

  if (!tunnel || !secret) {
    return jsonError(
      !tunnel ? 'MC_TUNNEL_URL not configured' : 'MC_CHAT_SECRET not configured',
      503,
    );
  }

  let upstream: Response;
  try {
    // Short timeout so a hung tunnel doesn't stall the poll loop.
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 5_000);
    upstream = await fetch(`${tunnel.replace(/\/$/, '')}/chat/pending`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secret}`,
        Accept: 'application/json',
      },
      signal: ac.signal,
    });
    clearTimeout(timer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upstream fetch failed';
    return jsonError(`Upstream unreachable: ${msg}`, 502);
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    return jsonError(
      `Upstream ${upstream.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`,
      upstream.status,
    );
  }

  const body = await upstream.text();
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
