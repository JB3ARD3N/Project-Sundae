# 🚀 eKo.vision Setup Guide

## ✅ What's Already Done

- ✅ Supabase credentials configured
- ✅ Build successful (zero errors)
- ✅ All code committed and pushed
- ✅ Prometheus Pro tier integrated
- ✅ Complete UI ready

**Your Supabase Project:** `octbnfykltfdkuiyvynr.supabase.co`

---

## 📋 Next Steps (5 minutes total)

### STEP 1: Create Database Tables (2 minutes)

Go to your Supabase SQL Editor:
👉 https://supabase.com/dashboard/project/octbnfykltfdkuiyvynr/sql/new

Run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Captures table (voice notes → build queue)
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

-- Projects table (ZIP uploads)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'uploaded',
  files JSONB DEFAULT '[]'::jsonb,
  zip_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Context snapshots (optional - for future use)
CREATE TABLE IF NOT EXISTS context_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  focus TEXT,
  conversation TEXT,
  code_generated JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_captures_created_at ON captures(created_at DESC);
CREATE INDEX idx_captures_status ON captures(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_snapshots ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for development - tighten later)
CREATE POLICY "Allow all operations" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON captures FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON context_snapshots FOR ALL USING (true);
```

---

### STEP 2: Create Storage Bucket (1 minute)

Go to Storage:
👉 https://supabase.com/dashboard/project/octbnfykltfdkuiyvynr/storage/buckets

1. Click **"New bucket"**
2. Name: `projects`
3. ✅ Check **"Public bucket"** (for easy access)
4. Click **"Create bucket"**

---

### STEP 3: Add AI API Keys (Optional - 2 minutes)

Edit `/eko-vision/.env.local` and add your AI keys:

```bash
# AI API Keys
ANTHROPIC_API_KEY=sk-ant-...        # For Claude (Prometheus Pro)
GOOGLE_API_KEY=AIza...               # For Gemini (Pro + Free tier)
OPENAI_API_KEY=sk-...                # For GPT-5 (Prometheus Pro)
GROQ_API_KEY=gsk_...                 # For Groq (Free tier - optional)
```

**Note:** Without these, you'll see errors when clicking "Ship It". Add them when you're ready to test AI processing.

---

### STEP 4: Test Locally

```bash
cd eko-vision
npm run dev
```

Visit: http://localhost:3000

**Test the flow:**
1. 🎤 Click "Record" → speak → click "Stop"
2. 💾 Click "Save to Queue"
3. 🚀 Click "Ship It" (requires AI keys)
4. 📦 Upload a ZIP file
5. 💰 Check Budget Monitor

---

### STEP 5: Deploy to Vercel (Optional)

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel --prod
```

**Add environment variables in Vercel:**
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add all from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `GOOGLE_API_KEY`
   - `OPENAI_API_KEY`
   - `GROQ_API_KEY`

---

## 🎯 How to Use

### Basic Flow (Free Tier - "Everybody Eats")
1. Record voice note → "Save to Queue"
2. Click "Ship It" on any queue item
3. System uses **free AI models** (Groq/Gemini Flash)
4. Generates code fragments
5. Shows cost ($0 for free tier!)

### Prometheus Pro Flow
Edit `components/BuildQueue.tsx` line 28:

```typescript
// Change from:
const result = await forgeProcessor.process(item.transcript || 'Unnamed', 'base');

// To:
const result = await forgeProcessor.process(item.transcript || 'Unnamed', 'pro');
```

Now clicking "Ship It" uses:
- Claude Sonnet (speed)
- Gemini Pro (balance)
- GPT-5 (complex tasks)

---

## 🔧 Troubleshooting

### "Ship It" button shows error
→ Add AI API keys to `.env.local`

### Voice capture doesn't work
→ Browser needs microphone permission
→ Try Chrome/Edge (best Web Speech API support)

### ZIP upload fails
→ Create "projects" bucket in Supabase Storage
→ Make sure it's marked as "Public"

### Build queue shows "No items"
→ Record a voice note and click "Save to Queue"
→ Check Supabase captures table has data

---

## 📊 What You Built

**Three-Tier AI Routing:**
- **Base**: 100% free (Groq + Gemini Flash)
- **Personal**: Smart routing ($0.005-$0.05/query)
- **Prometheus Pro**: Best models always ($0.015-$0.10/query)

**Features:**
- Voice-to-creation pipeline
- ZIP project uploads
- Real-time build queue
- Budget monitoring
- Compound intelligence tracking
- Bioluminescent UI

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database + Storage)
- AI: Claude, Gemini, GPT, Groq

---

## 📖 Documentation

- **Prometheus Pro**: `PROMETHEUS_PRO.md`
- **Supabase Schema**: `supabase-schema.sql`
- **Main Code**: `lib/forge/` + `components/`

---

## 🚀 You're Ready!

Everything is set up. Just run the SQL, create the storage bucket, add your AI keys, and you're live!

**Your dashboard will be operational at:**
- Local: http://localhost:3000
- Production: https://your-app.vercel.app

---

**"Everybody Eats. Truth Above All. Build don't buy."** 🔥
