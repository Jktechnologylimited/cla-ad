import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function GET() {
  const slides = await sql`SELECT * FROM "HeroSlide" ORDER BY "order" ASC`;
  return NextResponse.json({ slides });
}
export async function POST(req: NextRequest) {
  const b = await req.json();
  const count = await sql`SELECT COUNT(*) FROM "HeroSlide"`;
  const order = parseInt(count[0].count);
  const [slide] = await sql`INSERT INTO "HeroSlide" (id,tag,title,subtitle,image,"ctaLabel","ctaHref","cta2Label","cta2Href","order",active)
    VALUES (gen_random_uuid()::text,${b.tag},${b.title},${b.subtitle},${b.image||null},${b.ctaLabel||'Apply Now'},${b.ctaHref||'/admissions'},${b.cta2Label||'Learn More'},${b.cta2Href||'/about'},${order},true)
    RETURNING *`;
  return NextResponse.json({ slide }, { status: 201 });
}
