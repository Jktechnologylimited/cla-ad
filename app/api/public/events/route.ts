import { NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function GET() {
  const events = await sql`SELECT * FROM "CalendarEvent" WHERE active=true ORDER BY "startDate" ASC`;
  return NextResponse.json({ events });
}
