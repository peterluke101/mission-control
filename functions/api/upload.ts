/**
 * POST /api/upload
 *
 * Streams a multipart request body to NanoClaw via the Tailscale Funnel.
 * NanoClaw responds with JSON: { url, filename } and we forward that back.
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
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(ctx: PagesContext): Promise<Response> {
  const { request, env } = ctx;
  const tunnel = env.MC_TUNNEL_URL;
  const secret = env.MC_CHAT_SECRET;

  if (!tunnel) return jsonError('MC_TUNNEL_URL not configured', 503);
  if (!secret) return jsonError('MC_CHAT_SECRET not configured', 503);

  const contentType = request.headers.get('Content-Type') ?? '';
  if (!contentType.toLowerCase().includes('multipart/form-data')) {
    return jsonError('Expected multipart/form-data', 415);
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${tunnel.replace(/\/$/, '')}/upload`, {
      method: 'POST',
      headers: {
        // Preserve the multipart boundary by forwarding the original content-type.
        'Content-Type': contentType,
        Authorization: `Bearer ${secret}`,
      },
      body: request.body,
      // Required when forwarding a streamed body in Workers.
      // @ts-expect-error duplex is a valid fetch init field in Workers / undici
      duplex: 'half',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upstream fetch failed';
    return jsonError(`Upstream unreachable: ${msg}`, 502);
  }

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      'Content-Type':
        upstream.headers.get('Content-Type') ?? 'application/json',
    },
  });
}
