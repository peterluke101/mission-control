/**
 * POST /api/upload  —  Cloudflare Pages Function
 *
 * The browser sends multipart/form-data with field name "file".
 * NanoClaw's mc-chat /upload expects JSON `{ filename, mime, dataBase64 }`,
 * so we parse the multipart here and re-emit as JSON.
 *
 * (Mirror of `src/app/api/upload/route.ts`, the Next route handler used in
 * local dev.)
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

function arrayBufferToBase64(buf: ArrayBuffer): string {
  // CF Workers' globalThis includes `btoa` but only on binary strings.
  const bytes = new Uint8Array(buf);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + CHUNK)),
    );
  }
  return btoa(bin);
}

export async function onRequestPost(ctx: PagesContext): Promise<Response> {
  const { request, env } = ctx;
  const tunnel = env.MC_TUNNEL_URL;
  const secret = env.MC_CHAT_SECRET;

  if (!tunnel) return jsonError('MC_TUNNEL_URL not configured', 503);
  if (!secret) return jsonError('MC_CHAT_SECRET not configured', 503);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError('Expected multipart/form-data', 415);
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return jsonError('Missing "file" field', 400);
  }

  const arrayBuf = await file.arrayBuffer();
  const dataBase64 = arrayBufferToBase64(arrayBuf);

  let upstream: Response;
  try {
    upstream = await fetch(`${tunnel.replace(/\/$/, '')}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        filename: file.name,
        mime: file.type || 'application/octet-stream',
        dataBase64,
      }),
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
