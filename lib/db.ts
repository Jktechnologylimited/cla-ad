import { neon } from '@neondatabase/serverless';
import { headers } from 'next/headers';

// ---- Multi-tenant database resolution (SchoolDesk option C) ----
// One deployment serves many schools. Each request resolves to that school's
// OWN database, looked up by hostname in the shared control-plane DB
// (organisations table). Falls back to DATABASE_URL when no control DB is
// configured, so a single-tenant deployment (e.g. Cecilia) keeps working.

const CONTROL_URL = process.env.CONTROL_DATABASE_URL;
const FALLBACK_URL = process.env.DATABASE_URL ?? 'postgresql://placeholder:placeholder@placeholder/placeholder';
const ROOT_DOMAINS = (process.env.TENANT_ROOT_DOMAINS || 'jktl.com.ng').split(',').map(s => s.trim()).filter(Boolean);

export type TenantInfo = { dbUrl: string; orgName: string | null; brandColor: string | null; logoUrl: string | null; status: string | null } | null;

const tenantCache = new Map<string, { t: TenantInfo; exp: number }>();

async function resolveTenant(rawHost: string): Promise<TenantInfo> {
  if (!CONTROL_URL || !rawHost) return null; // single-tenant fallback mode
  const host = rawHost.toLowerCase().split(':')[0].replace(/^www\./, '');
  const cached = tenantCache.get(host);
  if (cached && cached.exp > Date.now()) return cached.t;

  let info: TenantInfo = null;
  try {
    const control = neon(CONTROL_URL);
    let sub = '';
    for (const root of ROOT_DOMAINS) {
      if (host.endsWith('.' + root)) { sub = host.slice(0, host.length - root.length - 1).split('.')[0]; break; }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rows: any[] = [];
    if (!sub) {
      rows = await control`SELECT database_url, org_name, brand_color, logo_url, status FROM organisations WHERE product='schooldesk' AND lower(custom_domain)=${host} LIMIT 1`;
    }
    if (!rows.length && sub) {
      rows = await control`SELECT database_url, org_name, brand_color, logo_url, status FROM organisations WHERE product='schooldesk' AND subdomain=${sub} LIMIT 1`;
    }
    const r = rows[0];
    if (r && r.database_url) {
      info = { dbUrl: r.database_url as string, orgName: r.org_name ?? null, brandColor: r.brand_color ?? null, logoUrl: r.logo_url ?? null, status: r.status ?? null };
    }
  } catch { info = null; }

  tenantCache.set(host, { t: info, exp: Date.now() + 60_000 });
  return info;
}

export async function getTenant(overrideHost?: string): Promise<TenantInfo> {
  if (overrideHost) return resolveTenant(overrideHost);
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') || h.get('host') || '';
    return await resolveTenant(host);
  } catch { return null; }
}

// Returns the neon client for the current tenant's database (or fallback).
export async function getDb(overrideHost?: string) {
  const t = await getTenant(overrideHost);
  return neon(t?.dbUrl || FALLBACK_URL);
}

// Tenant-aware drop-in for the previous singleton `sql`: resolves the tenant
// database per call (cached) from the request host. Existing `await sql\`...\``
// call sites work unchanged.
/* eslint-disable @typescript-eslint/no-explicit-any */
type SqlFn = ((strings: TemplateStringsArray, ...values: any[]) => Promise<any[]>) & {
  query: (q: string, params?: any[]) => Promise<any[]>;
};
const sql = (async (strings: TemplateStringsArray, ...values: any[]) => {
  const db = await getDb();
  return (db as any)(strings, ...values);
}) as SqlFn;
sql.query = async (q: string, params?: any[]) => {
  const db = await getDb();
  return (db as any).query(q, params);
};
/* eslint-enable @typescript-eslint/no-explicit-any */
export default sql;

export async function initDB(connectionString?: string) {
  const db = connectionString ? neon(connectionString) : await getDb();
  await db`CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS "SiteSetting" (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    label TEXT NOT NULL DEFAULT '',
    "group" TEXT NOT NULL DEFAULT 'general',
    type TEXT NOT NULL DEFAULT 'text',
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS "HeroSlide" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    tag TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    image TEXT,
    "ctaLabel" TEXT NOT NULL DEFAULT 'Apply Now',
    "ctaHref" TEXT NOT NULL DEFAULT '/admissions',
    "cta2Label" TEXT NOT NULL DEFAULT 'Learn More',
    "cta2Href" TEXT NOT NULL DEFAULT '/about',
    "order" INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await db`DO $$ BEGIN
    CREATE TYPE "PostType" AS ENUM ('NEWS','EVENT','BLOG','ANNOUNCEMENT');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`;

  await db`CREATE TABLE IF NOT EXISTS "Post" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    type "PostType" NOT NULL DEFAULT 'NEWS',
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMPTZ,
    author TEXT NOT NULL DEFAULT 'Cecilia Learning Academy',
    tags TEXT[] NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS "GalleryImage" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    url TEXT NOT NULL,
    caption TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    "order" INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS "CalendarEvent" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ,
    category TEXT NOT NULL DEFAULT 'General',
    color TEXT NOT NULL DEFAULT '#1B4B8A',
    active BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS "AdmissionEnquiry" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "parentName" TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    "childName" TEXT NOT NULL,
    "childDOB" TEXT NOT NULL,
    division TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'NEW',
    notes TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS "ContactMessage" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  // Default hero slides
  await db`INSERT INTO "HeroSlide" (id, tag, title, subtitle, "ctaLabel", "ctaHref", "cta2Label", "cta2Href", "order", active, "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid()::text,'Welcome to CLA','Shaping Tomorrow''s Leaders Today','Cecilia Learning Academy provides world-class education from Crèche through Senior Secondary School in the heart of Port Harcourt.','Apply for Admission','/admissions','Explore Our Schools','/schools',0,true,NOW(),NOW()),
    (gen_random_uuid()::text,'Academic Excellence','Where Learning Meets Character','Our holistic curriculum nurtures academic achievement, moral values, and personal development — preparing students for life beyond the classroom.','Our Programmes','/schools','About CLA','/about',1,true,NOW(),NOW()),
    (gen_random_uuid()::text,'Enrol Today','Give Your Child the Best Foundation','Limited spaces available. Join hundreds of families who trust Cecilia Learning Academy for quality education in Rumuolumeni, Port Harcourt.','Start Application','/admissions','Contact Us','/contact',2,true,NOW(),NOW())
  ON CONFLICT DO NOTHING`;
}
