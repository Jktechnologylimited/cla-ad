import { NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function GET() {
  const rows = await sql`SELECT key, value FROM "SiteSetting"`;
  const settings = Object.fromEntries(rows.map((r: any) => [r.key, r.value]));
  return NextResponse.json({ settings });
}
