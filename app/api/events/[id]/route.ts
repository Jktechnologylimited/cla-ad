import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  const [existing] = await sql`SELECT * FROM "CalendarEvent" WHERE id=${id}`;
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const m = { ...existing, ...b };
  const [event] = await sql`UPDATE "CalendarEvent" SET title=${m.title},description=${m.description||null},"startDate"=${m.startDate},"endDate"=${m.endDate||null},category=${m.category},color=${m.color},active=${m.active},"updatedAt"=NOW() WHERE id=${id} RETURNING *`;
  return NextResponse.json({ event });
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await sql`UPDATE "CalendarEvent" SET active=false WHERE id=${id}`;
  return NextResponse.json({ success: true });
}
