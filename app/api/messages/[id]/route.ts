import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { read } = await req.json();
  const [message] = await sql`UPDATE "ContactMessage" SET read=${read} WHERE id=${id} RETURNING *`;
  return NextResponse.json({ message });
}
