-- eKo.vision Supabase Schema
-- Run this in your Supabase SQL Editor
-- Project: octbnfykltfdkuiyvynr

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================
-- CAPTURES TABLE
-- Voice notes → Build Queue
-- ======================
CREATE TABLE IF NOT EXISTS captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transcript TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'new',
  complexity INTEGER DEFAULT 5,
  cost DECIMAL(10, 4) DEFAULT 0,
  deploy_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ======================
-- PROJECTS TABLE
-- ZIP uploads + extracted files
-- ======================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'uploaded',
  files JSONB DEFAULT '[]'::jsonb,
  zip_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ======================
-- CONTEXT SNAPSHOTS TABLE
-- Session context (optional - future use)
-- ======================
CREATE TABLE IF NOT EXISTS context_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  focus TEXT,
  conversation TEXT,
  code_generated JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ======================
-- INDEXES
-- Performance optimization
-- ======================
CREATE INDEX IF NOT EXISTS idx_captures_created_at ON captures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_captures_status ON captures(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- ======================
-- ROW LEVEL SECURITY
-- Enable RLS for all tables
-- ======================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_snapshots ENABLE ROW LEVEL SECURITY;

-- ======================
-- POLICIES
-- Allow all operations (development)
-- TODO: Tighten these for production
-- ======================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations" ON projects;
DROP POLICY IF EXISTS "Allow all operations" ON captures;
DROP POLICY IF EXISTS "Allow all operations" ON context_snapshots;

-- Create new policies
CREATE POLICY "Allow all operations" 
  ON projects 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all operations" 
  ON captures 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all operations" 
  ON context_snapshots 
  FOR ALL 
  USING (true);

-- ======================
-- VERIFICATION QUERIES
-- Run these to verify setup
-- ======================

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('captures', 'projects', 'context_snapshots');

-- Check indexes exist
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('captures', 'projects');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('captures', 'projects', 'context_snapshots');

-- ======================
-- SAMPLE DATA (optional)
-- Uncomment to add test data
-- ======================

-- INSERT INTO captures (transcript, tags, status) VALUES
--   ('Build a dashboard with charts', ARRAY['dashboard', 'charts'], 'new'),
--   ('Create API endpoints for users', ARRAY['api', 'backend'], 'shipped'),
--   ('Add authentication system', ARRAY['auth', 'security'], 'new');

-- INSERT INTO projects (name, status, files) VALUES
--   ('test-project', 'uploaded', '["index.ts", "package.json"]'::jsonb),
--   ('demo-app', 'processing', '["app.ts", "README.md"]'::jsonb);
