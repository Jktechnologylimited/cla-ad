import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, notes } = await req.json();
  const [enquiry] = await sql`UPDATE "AdmissionEnquiry" SET status=${status},notes=${notes||null},"updatedAt"=NOW() WHERE id=${id} RETURNING *`;
  return NextResponse.json({ enquiry });
}
