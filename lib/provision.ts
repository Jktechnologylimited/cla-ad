import { neon } from "@neondatabase/serverless";
import { randomBytes } from "crypto";
import { initDB } from "@/lib/db";
import { createNeonProject } from "@/lib/neon";
import { featuresForPlan } from "@/lib/tiers";

const CONTROL_URL = process.env.CONTROL_DATABASE_URL || process.env.DATABASE_URL;

export interface ProvisionResult {
  ok: boolean;
  orgId: string;
  subdomain: string;
  databaseCreated: boolean;
  adminEmail: string;
  tempPassword?: string;     // only returned when the admin user is first created
  features: Record<string, unknown>;
}

function genPassword(): string {
  // readable-ish temporary password
  return randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10) + "9";
}

// Seed a freshly-initialised tenant DB with an admin login + branding settings.
async function seedTenant(dbUrl: string, org: Record<string, any>): Promise<string | undefined> {
  const db = neon(dbUrl);

  // Admin user (SchoolDesk stores plaintext passwords today; matches its login check)
  let tempPassword: string | undefined;
  const existing = await db`SELECT id FROM "User" WHERE email = ${org.owner_email} LIMIT 1`;
  if (existing.length === 0) {
    tempPassword = genPassword();
    await db`INSERT INTO "User" (email, password, name, role)
             VALUES (${org.owner_email}, ${tempPassword}, ${org.owner_name || "Administrator"}, 'ADMIN')`;
  }

  // Branding settings from the organisation record (so their site shows their identity)
  const settings: [string, string, string][] = [
    ["school_name", org.org_name || "", "School Name"],
    ["school_email", org.owner_email || "", "Contact Email"],
    ["school_phone", org.owner_phone || "", "Phone"],
    ["school_address", org.address || "", "Address"],
  ];
  for (const [key, value, label] of settings) {
    if (!value) continue;
    await db`INSERT INTO "SiteSetting" (key, value, label, "group", type)
             VALUES (${key}, ${value}, ${label}, 'branding', 'text')
             ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
  }

  return tempPassword;
}

// Full provisioning for one organisation. Idempotent & safely retryable.
export async function provisionTenant(orgId: string): Promise<ProvisionResult> {
  if (!CONTROL_URL) throw new Error("CONTROL_DATABASE_URL is not set");
  const control = neon(CONTROL_URL);

  // Track the Neon project id without requiring a prior migration
  await control`ALTER TABLE organisations ADD COLUMN IF NOT EXISTS neon_project_id TEXT`;

  const rows = await control`SELECT * FROM organisations WHERE id = ${orgId} LIMIT 1`;
  const org = rows[0];
  if (!org) throw new Error("Organisation not found");
  if (org.product !== "schooldesk") throw new Error(`Provisioning not supported for product '${org.product}'`);

  // 1. Create the tenant database if it doesn't have one yet
  let databaseCreated = false;
  let dbUrl: string = org.database_url;
  if (!dbUrl) {
    const name = `schooldesk-${org.subdomain || org.id}`;
    const { connectionUri, projectId } = await createNeonProject(name);
    dbUrl = connectionUri;
    databaseCreated = true;
    await control`UPDATE organisations SET database_url = ${dbUrl}, neon_project_id = ${projectId} WHERE id = ${orgId}`;
  }

  // 2. Build the schema (idempotent)
  await initDB(dbUrl);

  // 3. Seed admin login + branding (idempotent)
  const tempPassword = await seedTenant(dbUrl, org);

  // 4. Apply tier features + activate
  const features = featuresForPlan(org.plan);
  await control`UPDATE organisations
                SET features = ${JSON.stringify(features)}::jsonb,
                    status = 'active',
                    activated_at = COALESCE(activated_at, NOW())
                WHERE id = ${orgId}`;

  return {
    ok: true,
    orgId,
    subdomain: org.subdomain,
    databaseCreated,
    adminEmail: org.owner_email,
    tempPassword,
    features: features as unknown as Record<string, unknown>,
  };
}
