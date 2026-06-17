import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL ?? 'postgresql://placeholder:placeholder@placeholder/placeholder');
export default sql;

export async function initDB() {
  await sql`CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS "SiteSetting" (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    label TEXT NOT NULL DEFAULT '',
    "group" TEXT NOT NULL DEFAULT 'general',
    type TEXT NOT NULL DEFAULT 'text',
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS "HeroSlide" (
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

  await sql`DO $$ BEGIN
    CREATE TYPE "PostType" AS ENUM ('NEWS','EVENT','BLOG','ANNOUNCEMENT');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`;

  await sql`CREATE TABLE IF NOT EXISTS "Post" (
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

  await sql`CREATE TABLE IF NOT EXISTS "GalleryImage" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    url TEXT NOT NULL,
    caption TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    "order" INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS "CalendarEvent" (
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

  await sql`CREATE TABLE IF NOT EXISTS "AdmissionEnquiry" (
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

  await sql`CREATE TABLE IF NOT EXISTS "ContactMessage" (
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
  await sql`INSERT INTO "HeroSlide" (id, tag, title, subtitle, "ctaLabel", "ctaHref", "cta2Label", "cta2Href", "order", active, "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid()::text,'Welcome to CLA','Shaping Tomorrow''s Leaders Today','Cecilia Learning Academy provides world-class education from Crèche through Senior Secondary School in the heart of Port Harcourt.','Apply for Admission','/admissions','Explore Our Schools','/schools',0,true,NOW(),NOW()),
    (gen_random_uuid()::text,'Academic Excellence','Where Learning Meets Character','Our holistic curriculum nurtures academic achievement, moral values, and personal development — preparing students for life beyond the classroom.','Our Programmes','/schools','About CLA','/about',1,true,NOW(),NOW()),
    (gen_random_uuid()::text,'Enrol Today','Give Your Child the Best Foundation','Limited spaces available. Join hundreds of families who trust Cecilia Learning Academy for quality education in Rumuolumeni, Port Harcourt.','Start Application','/admissions','Contact Us','/contact',2,true,NOW(),NOW())
  ON CONFLICT DO NOTHING`;
}
