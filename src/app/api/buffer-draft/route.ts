import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';

const QUEUE_PATH = '/Users/macmini/.openclaw/workspace/peptide-compass/marketing/buffer-queue.json';

export async function POST(req: Request) {
  try {
    const { text, id } = await req.json();
    if (!text || !id) {
      return NextResponse.json({ error: 'Missing text or id' }, { status: 400 });
    }

    // Ensure directory exists
    await mkdir(path.dirname(QUEUE_PATH), { recursive: true });

    // Read existing queue or start fresh
    let queue: unknown[] = [];
    try {
      const existing = await readFile(QUEUE_PATH, 'utf-8');
      queue = JSON.parse(existing);
    } catch {
      // File doesn't exist yet, start with empty array
    }

    // Append new draft
    queue.push({ id, text, queuedAt: new Date().toISOString() });
    await writeFile(QUEUE_PATH, JSON.stringify(queue, null, 2));

    // Fire system event
    const preview = text.slice(0, 50).replace(/"/g, '\\"');
    exec(`openclaw system event --text "Buffer draft queued: ${preview}" --mode now`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('buffer-draft error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
