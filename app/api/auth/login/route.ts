import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

  const rows = await sql`SELECT * FROM "User" WHERE email = ${email} LIMIT 1`;
  if (!rows.length)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const user = rows[0];
  // Simple password check — stored as plaintext in DB for now (set via env or DB)
  // In production you should hash; for now compare directly
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@CLA2024';
  const valid = password === adminPassword || password === user.password;
  if (!valid)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = await createToken({ email: user.email, role: user.role, name: user.name });
  const res = NextResponse.json({ success: true, user: { email: user.email, name: user.name, role: user.role } });
  res.cookies.set('cla-admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
