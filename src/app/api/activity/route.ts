import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public/data/activity.json');

export async function GET() {
  const data = await fs.readFile(filePath, 'utf8');
  return Response.json(JSON.parse(data));
}

export async function PUT(req: Request) {
  const body = await req.json();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(body, null, 2));
  return Response.json({ ok: true });
}
