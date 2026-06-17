import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { sendContactConfirmation } from '@/lib/email';
export async function POST(req: NextRequest) {
  const b = await req.json();
  const [message] = await sql`INSERT INTO "ContactMessage" (id,name,email,phone,subject,message,read)
    VALUES (gen_random_uuid()::text,${b.name},${b.email},${b.phone||null},${b.subject},${b.message},false) RETURNING *`;
  await sendContactConfirmation({ to: b.email, name: b.name, subject: b.subject }).catch(console.error);
  return NextResponse.json({ message }, { status: 201 });
}
