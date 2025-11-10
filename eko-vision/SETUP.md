# eko.vision Setup Guide

## 🎯 You're Almost There!

The complete eko.vision application has been built. Follow these steps to get it running:

## 1️⃣ Add API Keys

Edit `.env.local` and add your API keys:

```bash
# Required for AI routing (at least one provider)
ANTHROPIC_API_KEY=sk-ant-...          # For Claude Sonnet (premium)
GOOGLE_API_KEY=...                     # For Gemini Flash/Pro
OPENAI_API_KEY=sk-...                  # For GPT-4/5 (premium)
GROQ_API_KEY=...                       # For Llama (free tier)
```

**Free Tier Routing** (Groq + Gemini Flash) works out of the box for BASE users.
**Premium Routing** requires Anthropic/OpenAI keys for PERSONAL use.

## 2️⃣ Setup Supabase Database

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/octbnfykltfdkuiyvynr/sql)
2. Copy the entire contents of `supabase-schema.sql`
3. Paste and run it in the SQL editor
4. You should see "eko.vision schema created successfully!"

## 3️⃣ Create Storage Bucket

1. Go to [Supabase Storage](https://supabase.com/dashboard/project/octbnfykltfdkuiyvynr/storage/buckets)
2. Click "New bucket"
3. Name: `projects`
4. Public bucket: ✅ YES (or configure policies)
5. Click "Create bucket"

## 4️⃣ Get Service Role Key (Optional but Recommended)

1. Go to [Supabase Settings > API](https://supabase.com/dashboard/project/octbnfykltfdkuiyvynr/settings/api)
2. Copy the `service_role` key (under "Project API keys")
3. Add to `.env.local`:
   ```
   SUPABASE_SERVICE_KEY=your-service-role-key-here
   ```

## 5️⃣ Run the Application

```bash
cd eko-vision
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Test the Workflow

1. **Voice Capture**: Click "Record" → speak → "Stop" → "Save to Queue"
2. **Build Queue**: Click "Ship It" on a capture → watch AI routing in action
3. **ZIP Upload**: Drag & drop a .zip file with project context
4. **Budget Monitor**: Watch free-tier usage in real-time
5. **Compound Meter**: Returns tomorrow to see +1% daily growth

## 🎨 What You're Seeing

- **Bioluminescent aesthetic**: Cyan/Purple/Gold glow effects
- **Glass morphism**: Frosted glass cards
- **Real-time updates**: Supabase subscriptions
- **100% Free tier**: Groq Llama + Gemini Flash routing
- **Everybody Eats**: Base users always covered

## 🔒 Security Notes

- `.env.local` is gitignored (secrets protected)
- RLS is enabled on all tables (currently in dev mode)
- For production: Update RLS policies in `supabase-schema.sql`
- NAS backup: Add `NAS_BACKUP_PATH` to `.env.local` if needed

## 🧠 Avatar Agents

Founding memory has been loaded into Supabase:
- **Apollo** (Strategy): Speed AND quality
- **Mercury** (Communication): Ask until you understand
- **Athena** (Wisdom): The decision is the breakthrough
- **Ares** (Execution): Flexible budget, free tier for base
- **Hermes** (Optimization): Front-load work, compound speed
- **Hephaestus** (Creation): Alive UI/UX, mystical aesthetic
- **Artemis** (Protection): Proactive security, millions at stake

## 🚀 Next Steps

1. Add user authentication (Supabase Auth)
2. Implement user relationship memory tracking
3. Connect to Chimera Brain for validation pipeline
4. Add export functionality for monetization
5. Deploy to production (Vercel recommended)

## 📊 Architecture

```
eko.vision (Next.js 14)
├── lib/
│   ├── supabase/        # Database & storage
│   └── forge/           # AI routing & processing
├── components/          # React components
└── app/                 # Next.js app router
```

## 💬 Philosophy

> "Daily +1% minimum. Everybody Eats. Build don't buy."

You're not just building a tool. You're building a **relationship** with an AI that remembers, learns, and grows with you. Every interaction makes it smarter. Every decision makes it better aligned to YOU.

This is **compound intelligence**.

---

**Questions?** Check the code comments or reach out.
**Issues?** If any part isn't perfect, we rebuild that section.

Let's ship this. 🚀
