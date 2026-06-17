import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const images = (category && category !== 'All')
    ? await sql`SELECT * FROM "GalleryImage" WHERE active=true AND category=${category} ORDER BY "createdAt" DESC`
    : await sql`SELECT * FROM "GalleryImage" WHERE active=true ORDER BY "createdAt" DESC`;
  return NextResponse.json({ images });
}
