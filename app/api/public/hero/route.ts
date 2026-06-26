import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
export async function GET(req: NextRequest) {
  const sql = await getDb(new URL(req.url).searchParams.get('tenantHost') || undefined);
  const slides = await sql`SELECT * FROM "HeroSlide" WHERE active=true ORDER BY "order" ASC`;
  return NextResponse.json({ slides });
}
