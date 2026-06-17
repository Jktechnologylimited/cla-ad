import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function GET() {
  const events = await sql`SELECT * FROM "CalendarEvent" WHERE active=true ORDER BY "startDate" ASC`;
  return NextResponse.json({ events });
}
export async function POST(req: NextRequest) {
  const b = await req.json();
  const [event] = await sql`INSERT INTO "CalendarEvent" (id,title,description,"startDate","endDate",category,color,active)
    VALUES (gen_random_uuid()::text,${b.title},${b.description||null},${b.startDate},${b.endDate||null},${b.category||'General'},${b.color||'#1B4B8A'},true) RETURNING *`;
  return NextResponse.json({ event }, { status: 201 });
}
