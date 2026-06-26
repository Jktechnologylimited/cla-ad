import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
export async function GET(req: NextRequest) {
  const sql = await getDb(new URL(req.url).searchParams.get('tenantHost') || undefined);
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const slug = searchParams.get('slug');
  const limit = parseInt(searchParams.get('limit') || '20');
  if (slug) {
    const [post] = await sql`SELECT * FROM "Post" WHERE slug=${slug} AND published=true LIMIT 1`;
    return NextResponse.json({ post: post || null });
  }
  const posts = type
    ? await sql`SELECT * FROM "Post" WHERE published=true AND type=${type}::"PostType" ORDER BY "publishedAt" DESC NULLS LAST LIMIT ${limit}`
    : await sql`SELECT * FROM "Post" WHERE published=true ORDER BY "publishedAt" DESC NULLS LAST LIMIT ${limit}`;
  return NextResponse.json({ posts });
}
