import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { label } = await req.json();
    if (!label) return NextResponse.json({ error: 'missing label' }, { status: 400 });

    // Notify Ares via OpenClaw gateway
    const gatewayPort = 18789;
    const token = process.env.OPENCLAW_GATEWAY_TOKEN || '';

    // Use the gateway's session inject to notify Ares
    try {
      await fetch(`http://127.0.0.1:${gatewayPort}/api/sessions/main/inject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: 'system',
          content: `[MC TODO COMPLETED] Pete marked as done: "${label}". Update MEMORY.md and MC data accordingly.`,
        }),
      });
    } catch {
      // Gateway notify is best-effort — don't fail the UI
    }

    return NextResponse.json({ ok: true, completed: label });
  } catch {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}
