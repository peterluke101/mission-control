import { NextResponse } from 'next/server';

const GUMROAD_TOKEN = process.env.GUMROAD_ACCESS_TOKEN;
const BASE = 'https://api.gumroad.com/v2';

async function gumroadFetch(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${GUMROAD_TOKEN}` },
    next: { revalidate: 60 }, // cache 60s
  });
  return res.json();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get('endpoint') || 'user';

  try {
    let data;
    if (endpoint === 'user') {
      data = await gumroadFetch('/user');
    } else if (endpoint === 'products') {
      data = await gumroadFetch('/products');
    } else if (endpoint === 'sales') {
      const after = searchParams.get('after') || '';
      const before = searchParams.get('before') || '';
      let url = '/sales?';
      if (after) url += `after=${after}&`;
      if (before) url += `before=${before}&`;
      data = await gumroadFetch(url);
    } else {
      return NextResponse.json({ error: 'Unknown endpoint' }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
