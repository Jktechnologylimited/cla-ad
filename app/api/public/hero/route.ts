import { NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function GET() {
  const slides = await sql`SELECT * FROM "HeroSlide" WHERE active=true ORDER BY "order" ASC`;
  return NextResponse.json({ slides });
}
