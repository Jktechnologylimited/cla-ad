import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  const [existing] = await sql`SELECT * FROM "Post" WHERE id=${id}`;
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const m = { ...existing, ...b };
  const tags = Array.isArray(m.tags) ? m.tags : [];
  const [post] = await sql`UPDATE "Post" SET type=${m.type},title=${m.title},excerpt=${m.excerpt||null},content=${m.content},\"coverImage\"=${m.coverImage||null},published=${m.published},\"publishedAt\"=${m.publishedAt||null},author=${m.author},tags=${tags},\"updatedAt\"=NOW() WHERE id=${id} RETURNING *`;
  return NextResponse.json({ post });
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await sql`DELETE FROM "Post" WHERE id=${id}`;
  return NextResponse.json({ success: true });
}
