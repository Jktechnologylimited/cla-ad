import { NextRequest, NextResponse } from "next/server";
import { provisionTenant } from "@/lib/provision";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// POST /api/provision  { orgId }
// Header: x-provision-secret: <PROVISION_SECRET>
// Creates the tenant's database, builds + seeds the schema, applies tier
// features, and activates the organisation. Idempotent / retryable.
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-provision-secret");
  if (!process.env.PROVISION_SECRET || secret !== process.env.PROVISION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let orgId: string | undefined;
  try {
    const body = await req.json();
    orgId = body?.orgId;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!orgId) return NextResponse.json({ error: "orgId is required" }, { status: 400 });

  try {
    const result = await provisionTenant(orgId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[provision] failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
