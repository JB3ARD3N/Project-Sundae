-- eko.vision Supabase Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table (for ZIP uploads)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  zip_url TEXT NOT NULL,
  file_list JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Captures table (for voice captures)
CREATE TABLE IF NOT EXISTS captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transcript TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'shipped', 'archived'
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Context snapshots table (for build context)
CREATE TABLE IF NOT EXISTS context_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table (for tracking all system events)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL, -- 'voice_capture', 'build_shipped', 'zip_uploaded', etc.
  event_data JSONB NOT NULL,
  cost DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core memory table (for avatar agent memory)
CREATE TABLE IF NOT EXISTS core_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL, -- 'Apollo', 'Mercury', etc.
  memory_type TEXT NOT NULL, -- 'founding', 'learned', 'pattern'
  content TEXT NOT NULL,
  importance INTEGER DEFAULT 5, -- 1-10 scale
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  access_count INTEGER DEFAULT 0
);

-- User profile table (for persistent relationship memory)
CREATE TABLE IF NOT EXISTS user_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL, -- Can be email, username, or UUID
  preferences JSONB DEFAULT '{}',
  decision_patterns JSONB DEFAULT '{}',
  communication_style JSONB DEFAULT '{}',
  successful_strategies JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Build queue table (for tracking build jobs)
CREATE TABLE IF NOT EXISTS build_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  capture_id UUID REFERENCES captures(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'building', 'completed', 'failed'
  fragments JSONB DEFAULT '[]',
  code_blocks JSONB DEFAULT '[]',
  cost DECIMAL(10, 6) DEFAULT 0,
  error_log TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_captures_status ON captures(status);
CREATE INDEX IF NOT EXISTS idx_captures_created_at ON captures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_core_memory_agent ON core_memory(agent_name);
CREATE INDEX IF NOT EXISTS idx_core_memory_type ON core_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_build_queue_status ON build_queue(status);

-- Create storage bucket for projects (run this separately in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('projects', 'projects', true);

-- Row Level Security (RLS) - Enable for production
-- For now, we'll keep it simple. Add RLS policies based on your auth setup.

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_queue ENABLE ROW LEVEL SECURITY;

-- For development: Allow all operations (REMOVE IN PRODUCTION)
CREATE POLICY "Enable all for development" ON projects FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON captures FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON context_snapshots FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON events FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON core_memory FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON user_profile FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON build_queue FOR ALL USING (true);

-- Insert founding memory for avatar agents
INSERT INTO core_memory (agent_name, memory_type, content, importance) VALUES
  ('Apollo', 'founding', 'Speed AND quality. Never sacrifice one for the other. Strategic decisions must consider both dimensions.', 10),
  ('Apollo', 'founding', 'Competitive Strategy: Find what competitors do that people DON''T like. Put those pain points into "dont do" category. Build the opposite.', 10),
  ('Apollo', 'founding', 'Study 1-star reviews, not 5-star reviews. Pain points reveal opportunities. Every complaint is a feature request.', 10),
  ('Apollo', 'founding', 'They extract → We distribute. They replace → We augment. They hide costs → We show transparency. Build what they are NOT.', 10),
  ('Mercury', 'founding', 'Ask questions until you truly understand. Clear communication prevents costly mistakes.', 10),
  ('Athena', 'founding', 'The decision itself is the breakthrough, not the day counting. Focus on wisdom, not metrics.', 10),
  ('Ares', 'founding', 'Budget is flexible for PERSONAL use. 100% free-tier for BASE users. Everybody Eats.', 10),
  ('Hermes', 'founding', 'Front-load the work today to compound speed tomorrow. Short-term effort creates long-term velocity.', 10),
  ('Hephaestus', 'founding', 'Build UI/UX that feels alive. Bioluminescent, mystical, glowing. Not just functional, magical.', 10),
  ('Artemis', 'founding', 'Millions at stake. Proactive security. Anticipate threats before they materialize. No paranoia, just preparation.', 10);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'eko.vision schema created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create storage bucket named "projects" in Supabase Dashboard > Storage';
  RAISE NOTICE '2. Make the bucket public or configure appropriate policies';
  RAISE NOTICE '3. Update RLS policies for production (currently in dev mode)';
END $$;
