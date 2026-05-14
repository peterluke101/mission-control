/**
 * Next.js App Router handler — POST /api/chat
 *
 * Forwards a chat request to the local NanoClaw mc-chat HTTP channel and
 * pipes its Server-Sent Events response straight to the browser.
 *
 * Why this exists alongside `functions/api/chat.ts`:
 *   - `functions/api/chat.ts` is a Cloudflare Pages Function — only used when
 *     the dashboard is deployed to Cloudflare Pages.
 *   - When running locally (`npm run dev`), Pages Functions are NOT executed.
 *     The Next.js dev server only serves Route Handlers from `src/app/api/**`.
 *     So we need a Next-native version too.
 *
 * Both implementations follow the same protocol: read `MC_TUNNEL_URL` and
 * `MC_CHAT_SECRET` from env, POST upstream with a bearer token, stream the
 * SSE body back untouched. Locally `MC_TUNNEL_URL` defaults to
 * `http://127.0.0.1:54173` (same machine), so no Tailscale Funnel is needed
 * for dev — the browser hits Next, Next hits localhost.
 */

export const runtime = 'nodejs';
// Tell Next this is a long-running streaming response. Without this hint the
// dev server may try to fully buffer the body, breaking SSE.
export const dynamic = 'force-dynamic';

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

export async function POST(req: Request): Promise<Response> {
  const tunnel = process.env.MC_TUNNEL_URL || 'http://127.0.0.1:54173';
  const secret = process.env.MC_CHAT_SECRET;
  if (!secret) return jsonError('MC_CHAT_SECRET not configured', 503);

  let bodyText: string;
  try {
    bodyText = await req.text();
    if (bodyText) JSON.parse(bodyText); // validate
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
