import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  const fields = Object.entries(b).map(([k,v]) => ({ k, v }));
  let [slide] = await sql`SELECT * FROM "HeroSlide" WHERE id=${id}`;
  if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const merged = { ...slide, ...b };
  const [updated] = await sql`UPDATE "HeroSlide" SET tag=${merged.tag},title=${merged.title},subtitle=${merged.subtitle},image=${merged.image||null},"ctaLabel"=${merged.ctaLabel},"ctaHref"=${merged.ctaHref},"cta2Label"=${merged.cta2Label},"cta2Href"=${merged.cta2Href},"order"=${merged.order},active=${merged.active},"updatedAt"=NOW() WHERE id=${id} RETURNING *`;
  return NextResponse.json({ slide: updated });
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await sql`DELETE FROM "HeroSlide" WHERE id=${id}`;
  return NextResponse.json({ success: true });
}
