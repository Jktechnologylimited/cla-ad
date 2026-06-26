import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
export async function GET(req: NextRequest) {
  const sql = await getDb(new URL(req.url).searchParams.get('tenantHost') || undefined);
  const events = await sql`SELECT * FROM "CalendarEvent" WHERE active=true ORDER BY "startDate" ASC`;
  return NextResponse.json({ events });
}
