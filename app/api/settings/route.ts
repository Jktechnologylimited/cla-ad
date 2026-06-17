import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function GET() {
  const rows = await sql`SELECT key, value FROM "SiteSetting"`;
  const settings = Object.fromEntries(rows.map((r: any) => [r.key, r.value]));
  return NextResponse.json({ settings });
}
export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, string>;
  for (const [key, value] of Object.entries(body)) {
    await sql`INSERT INTO "SiteSetting" (key,value,label) VALUES (${key},${value},${key})
      ON CONFLICT (key) DO UPDATE SET value=${value},"updatedAt"=NOW()`;
  }
  return NextResponse.json({ success: true });
}
