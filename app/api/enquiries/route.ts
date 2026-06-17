import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { sendEnquiryConfirmation } from '@/lib/email';
export async function GET() {
  const enquiries = await sql`SELECT * FROM "AdmissionEnquiry" ORDER BY "createdAt" DESC`;
  return NextResponse.json({ enquiries });
}
export async function POST(req: NextRequest) {
  const b = await req.json();
  const [enquiry] = await sql`INSERT INTO "AdmissionEnquiry" (id,"parentName",email,phone,"childName","childDOB",division,message,status)
    VALUES (gen_random_uuid()::text,${b.parentName},${b.email},${b.phone},${b.childName},${b.childDOB},${b.division},${b.message||null},'NEW') RETURNING *`;
  await sendEnquiryConfirmation({ to: b.email, parentName: b.parentName, childName: b.childName, division: b.division }).catch(console.error);
  return NextResponse.json({ enquiry }, { status: 201 });
}
