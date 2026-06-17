-- ============================================================
-- Cecilia Learning Academy — Neon PostgreSQL 17 Setup Script
-- Run this in your Neon SQL Editor to create all tables
-- ============================================================

-- Enum for Post types
DO $$ BEGIN
  CREATE TYPE "PostType" AS ENUM ('NEWS', 'EVENT', 'BLOG', 'ANNOUNCEMENT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Users (admin accounts)
CREATE TABLE IF NOT EXISTS "User" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'ADMIN',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site Settings (all editable content)
CREATE TABLE IF NOT EXISTS "SiteSetting" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key         TEXT UNIQUE NOT NULL,
  value       TEXT NOT NULL DEFAULT '',
  label       TEXT NOT NULL DEFAULT '',
  "group"     TEXT NOT NULL DEFAULT 'general',
  type        TEXT NOT NULL DEFAULT 'text',
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hero Slides
CREATE TABLE IF NOT EXISTS "HeroSlide" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tag         TEXT NOT NULL,
  title       TEXT NOT NULL,
  subtitle    TEXT NOT NULL,
  image       TEXT,
  "ctaLabel"  TEXT NOT NULL DEFAULT 'Apply Now',
  "ctaHref"   TEXT NOT NULL DEFAULT '/admissions',
  "cta2Label" TEXT NOT NULL DEFAULT 'Learn More',
  "cta2Href"  TEXT NOT NULL DEFAULT '/about',
  "order"     INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Posts (News, Blog, Events, Announcements)
CREATE TABLE IF NOT EXISTS "Post" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type          "PostType" NOT NULL DEFAULT 'NEWS',
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  excerpt       TEXT,
  content       TEXT NOT NULL DEFAULT '',
  "coverImage"  TEXT,
  published     BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMPTZ,
  author        TEXT NOT NULL DEFAULT 'Cecilia Learning Academy',
  tags          TEXT[] NOT NULL DEFAULT '{}',
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gallery Images
CREATE TABLE IF NOT EXISTS "GalleryImage" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  url         TEXT NOT NULL,
  caption     TEXT,
  category    TEXT NOT NULL DEFAULT 'General',
  "order"     INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calendar Events
CREATE TABLE IF NOT EXISTS "CalendarEvent" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title         TEXT NOT NULL,
  description   TEXT,
  "startDate"   TIMESTAMPTZ NOT NULL,
  "endDate"     TIMESTAMPTZ,
  category      TEXT NOT NULL DEFAULT 'General',
  color         TEXT NOT NULL DEFAULT '#1B4B8A',
  active        BOOLEAN NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admission Enquiries
CREATE TABLE IF NOT EXISTS "AdmissionEnquiry" (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "parentName" TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,
  "childName"  TEXT NOT NULL,
  "childDOB"   TEXT NOT NULL,
  division     TEXT NOT NULL,
  message      TEXT,
  status       TEXT NOT NULL DEFAULT 'NEW',
  notes        TEXT,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS "ContactMessage" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SEED: Create the first admin user
-- Password below is: Admin@CLA2024 (bcrypt hashed)
-- CHANGE THIS PASSWORD immediately after first login!
-- ============================================================
INSERT INTO "User" (id, email, password, name, role)
VALUES (
  gen_random_uuid()::text,
  'admin@cecilialearningacademy.com.ng',
  '$2b$10$XK2piMrNMSeGx7Of7YifHeDscEXp0jxWkngK5fKDJIzHX0xZ3Qwni',
  'CLA Administrator',
  'ADMIN'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- SEED: Default hero slides
-- ============================================================
INSERT INTO "HeroSlide" (id, tag, title, subtitle, "ctaLabel", "ctaHref", "cta2Label", "cta2Href", "order", active)
VALUES
(
  gen_random_uuid()::text,
  'Welcome to CLA',
  'Shaping Tomorrow''s Leaders Today',
  'Cecilia Learning Academy provides world-class education from Crèche through Senior Secondary School in the heart of Port Harcourt.',
  'Apply for Admission', '/admissions', 'Explore Our Schools', '/schools',
  0, true
),
(
  gen_random_uuid()::text,
  'Academic Excellence',
  'Where Learning Meets Character',
  'Our holistic curriculum nurtures academic achievement, moral values, and personal development — preparing students for life beyond the classroom.',
  'Our Programmes', '/schools', 'About CLA', '/about',
  1, true
),
(
  gen_random_uuid()::text,
  'Enrol Today',
  'Give Your Child the Best Foundation',
  'Limited spaces available. Join hundreds of families who trust Cecilia Learning Academy for quality education in Rumuolumeni, Port Harcourt.',
  'Start Application', '/admissions', 'Contact Us', '/contact',
  2, true
)
ON CONFLICT DO NOTHING;

SELECT 'Setup complete! Tables created successfully.' AS status;
