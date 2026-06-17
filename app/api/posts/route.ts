import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { slugify } from '@/lib/utils';
export async function GET() {
  const posts = await sql`SELECT * FROM "Post" ORDER BY "createdAt" DESC`;
  return NextResponse.json({ posts });
}
export async function POST(req: NextRequest) {
  const b = await req.json();
  const slug = slugify(b.title);
  const tags = Array.isArray(b.tags) ? b.tags : [];
  const [post] = await sql`INSERT INTO "Post" (id,type,title,slug,excerpt,content,"coverImage",published,"publishedAt",author,tags)
    VALUES (gen_random_uuid()::text,${b.type||'NEWS'},${b.title},${slug},${b.excerpt||null},${b.content||''},${b.coverImage||null},${b.published||false},${b.published?new Date().toISOString():null},${b.author||'Cecilia Learning Academy'},${tags})
    RETURNING *`;
  return NextResponse.json({ post }, { status: 201 });
}
