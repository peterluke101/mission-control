/**
 * Next.js App Router handler — POST /api/upload
 *
 * The chat dock sends a single file as multipart/form-data with field name
 * "file". NanoClaw's mc-chat /upload expects JSON: { filename, mime, dataBase64 }.
 * This handler does the translation: parse the multipart, base64-encode the
 * file bytes, POST JSON upstream.
 *
 * (Why translate here rather than in NanoClaw? Keeping the NanoClaw HTTP
 * channel dep-free — no busboy/formidable — was a deliberate trade-off; the
 * Web platform makes multipart parsing trivial in both Next route handlers
 * and Cloudflare Pages Functions, so doing the conversion here is cheap.)
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError('Expected multipart/form-data', 415);
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return jsonError('Missing "file" field', 400);
  }

  // Read the file into memory and base64-encode for the JSON payload.
  // 25 MB cap is enforced on the NanoClaw side; we don't double-check here
  // so we don't drift from the upstream limit.
  const arrayBuf = await file.arrayBuffer();
  const dataBase64 = Buffer.from(arrayBuf).toString('base64');

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
