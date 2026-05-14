/**
 * Next.js App Router handler — GET /api/chat/pending
 *
 * Proxies to NanoClaw's `GET /chat/pending` (added in PR #4 of
 * peterluke101/nanoclaw). Returns `{ messages: BufferedMessage[] }` and
 * drains the buffer atomically on the NanoClaw side.
 *
 * The dock-offline buffer holds messages that were addressed to mc-chat but
 * arrived when no SSE stream was open — typically agent replies to Telegram
 * inbounds, or mirrored Telegram inbounds themselves prefixed with
 * `📥 [Telegram]\n`. The dock polls this on mount and every 10s while open.
 *
 * Read-once semantics: each message is returned exactly once. The dock is
 * responsible for displaying / persisting them locally.
 *
 * Mirrors the env handling of `/api/chat/route.ts`: `MC_TUNNEL_URL` and
 * `MC_CHAT_SECRET`, defaulting to `http://127.0.0.1:54173` locally.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(): Promise<Response> {
  const tunnel = process.env.MC_TUNNEL_URL || 'http://127.0.0.1:54173';
  const secret = process.env.MC_CHAT_SECRET;
  if (!secret) return jsonError('MC_CHAT_SECRET not configured', 503);

  let upstream: Response;
  try {
    upstream = await fetch(`${tunnel.replace(/\/$/, '')}/chat/pending`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secret}`,
        Accept: 'application/json',
      },
      // Buffer poll is fast; no streaming.
      cache: 'no-store',
    });
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
    headers: { 'Content-Type': 'application/json' },
  });
}
