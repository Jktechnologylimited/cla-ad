import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
export async function GET(req: NextRequest) {
  const sql = await getDb(new URL(req.url).searchParams.get('tenantHost') || undefined);
  const rows = await sql`SELECT key, value FROM "SiteSetting"`;
  const settings = Object.fromEntries(rows.map((r: any) => [r.key, r.value]));
  return NextResponse.json({ settings });
}
