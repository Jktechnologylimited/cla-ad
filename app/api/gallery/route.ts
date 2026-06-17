import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function GET() {
  const images = await sql`SELECT * FROM "GalleryImage" WHERE active=true ORDER BY "createdAt" DESC`;
  return NextResponse.json({ images });
}
export async function POST(req: NextRequest) {
  const b = await req.json();
  const [image] = await sql`INSERT INTO "GalleryImage" (id,url,caption,category,active)
    VALUES (gen_random_uuid()::text,${b.url},${b.caption||null},${b.category||'General'},true) RETURNING *`;
  return NextResponse.json({ image }, { status: 201 });
}
