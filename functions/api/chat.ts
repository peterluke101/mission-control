/**
 * POST /api/chat
 *
 * Cloudflare Pages Function that proxies a chat request to the NanoClaw
 * agent via a Tailscale Funnel. The upstream returns SSE; we forward
 * the body stream untouched so the browser can read it chunk-by-chunk.
 *
 * Env vars (set in the Pages dashboard, NOT in source):
 *   MC_TUNNEL_URL    e.g. https://<host>.<tailnet>.ts.net:54173
 *   MC_CHAT_SECRET   shared bearer secret, must match NanoClaw side
 *
 * Why SSE: Cloudflare Workers cap a single request at ~30s wall time,
 * but agent runs can take 10-90s. SSE keeps bytes flowing so the worker
 * doesn't time out, and lets the UI render tokens as they arrive.
 */

interface Env {
  MC_TUNNEL_URL?: string;
  MC_CHAT_SECRET?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

function sseError(message: string, status = 502): Response {
  const body =
    `data: ${JSON.stringify({ type: 'error', message })}\n\n` +
    `data: ${JSON.stringify({ type: 'done' })}\n\n`;
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(ctx: PagesContext): Promise<Response> {
  const { request, env } = ctx;
  const tunnel = env.MC_TUNNEL_URL;
  const secret = env.MC_CHAT_SECRET;

  if (!tunnel) {
    return jsonError('MC_TUNNEL_URL not configured', 503);
  }
  if (!secret) {
    return jsonError('MC_CHAT_SECRET not configured', 503);
  }

  // We re-read the body as JSON for validation, then forward it.
  let bodyText: string;
  try {
    bodyText = await request.text();
    if (bodyText) JSON.parse(bodyText);
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${tunnel.replace(/\/$/, '')}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
        Accept: 'text/event-stream',
      },
      body: bodyText,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upstream fetch failed';
    return sseError(`Upstream unreachable: ${msg}`);
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    return sseError(
      `Upstream ${upstream.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`,
    );
  }

  // Forward the SSE body stream as-is.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
