import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
export async function GET() {
  try {
    await initDB();
    return NextResponse.json({ success: true, message: 'Database initialised' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
