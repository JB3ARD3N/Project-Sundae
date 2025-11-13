# 🚀 CHIMERA OS - Complete Deployment Guide

**Deploy to: eKo.vision, 0r8.ai, and other domains**

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start](#quick-start)
3. [Production Deployment](#production-deployment)
4. [Domain Configuration](#domain-configuration)
5. [Environment Setup](#environment-setup)
6. [Database Setup (Supabase)](#database-setup)
7. [API Key Configuration](#api-key-configuration)
8. [Deployment Options](#deployment-options)
9. [Post-Deployment](#post-deployment)
10. [Troubleshooting](#troubleshooting)

---

## 🖥️ System Requirements

### Minimum:
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Recommended:
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 10GB+ SSD
- **Network**: 10 Mbps+ upload/download

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/JB3ARD3N/Project-Sundae.git
cd Project-Sundae
git checkout claude/build-feature-011CV2XMi6WYeCzZv4Q4dMHC
```

### 2. Install Dependencies

```bash
cd eko-vision
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see [Environment Setup](#environment-setup))

### 4. Run Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000/os**

---

## 🌐 Production Deployment

### Option 1: Vercel (Recommended - 5 minutes)

**Perfect for eKo.vision domain**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd eko-vision
vercel

# Add custom domain
vercel domains add eko.vision
vercel domains add 0r8.ai
```

**Configure DNS** (at your domain registrar):
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Option 2: Docker (Self-Hosted)

```bash
# Build image
cd Project-Sundae
docker build -t chimera-os:latest -f eko-vision/Dockerfile .

# Run container
docker run -d \
  --name chimera-os \
  -p 3000:3000 \
  --env-file .env.production \
  chimera-os:latest

# Or use Docker Compose
docker-compose up -d
```

### Option 3: VPS (DigitalOcean, AWS, etc.)

```bash
# On your server
git clone https://github.com/JB3ARD3N/Project-Sundae.git
cd Project-Sundae/eko-vision

# Install dependencies
npm install

# Build for production
npm run build

# Start with PM2
npm i -g pm2
pm2 start npm --name "chimera-os" -- start
pm2 save
pm2 startup
```

**Configure Nginx** reverse proxy:
```nginx
server {
    listen 80;
    server_name eko.vision www.eko.vision;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Domain Configuration

### eKo.vision (Primary Domain)

**In `.env.production`:**
```env
NEXT_PUBLIC_APP_URL=https://eko.vision
NEXT_PUBLIC_APP_NAME=eKo.vision
NEXT_PUBLIC_DOMAIN=eko.vision
```

### 0r8.ai (Secondary Domain)

**Route Configuration:**
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://0r8.ai',
          },
        ],
      },
    ];
  },
};
```

### Multi-Domain Support

```bash
# In Vercel
vercel domains add eko.vision
vercel domains add 0r8.ai

# Set environment per domain
vercel env add NEXT_PUBLIC_DOMAIN production
# Enter: eko.vision (for eko.vision deployment)
# Enter: 0r8.ai (for 0r8.ai deployment)
```

---

## 🔐 Environment Setup

### Required Variables

```env
# ===== CORE CONFIGURATION =====
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://eko.vision
NEXT_PUBLIC_APP_NAME="CHIMERA OS"

# ===== SUPABASE (Database & Auth) =====
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ===== AI PROVIDERS =====

# Groq (Free Tier: 14,400 RPD)
GROQ_API_KEY=gsk_...

# Google Gemini (Free Tier: 1,500 RPD)
GEMINI_API_KEY=AIza...

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI GPT
OPENAI_API_KEY=sk-...

# ===== VOICE SYSTEM =====
# Whisper API (Optional - fallback for voice)
WHISPER_API_KEY=your-whisper-key

# ===== CHIMERA CORE CONFIG =====
CHIMERA_BRAIN_POWER=50
CHIMERA_MAX_AGENTS=250
CHIMERA_TRUTH_THRESHOLD=0.7
MONTHLY_BUDGET_LIMIT=200
COST_ALERT_THRESHOLD=0.8

# ===== FEATURE FLAGS =====
ENABLE_VOICE_CAPTURE=true
ENABLE_AUTO_DEPLOY=true
ENABLE_AGENT_MESH=true
ENABLE_TRUTH_ENGINE=true
ENABLE_REAL_TIME=true

# ===== SECURITY =====
JWT_SECRET=your-super-secret-jwt-key-change-this
ENCRYPTION_KEY=your-256-bit-encryption-key-change-this
```

### Optional Variables

```env
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Monitoring
SENTRY_DSN=https://...@sentry.io/...

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Backup Storage
NAS_BACKUP_PATH=/mnt/nas/chimera-backups
AWS_S3_BUCKET=chimera-backups
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

---

## 💾 Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose region closest to your users
4. Copy your **Project URL** and **anon key**

### 2. Run Database Migrations

```sql
-- Table: projects
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  files TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Table: captures (voice/text captures)
CREATE TABLE captures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transcript TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Table: queue (build queue)
CREATE TABLE queue (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transcript TEXT,
  name TEXT,
  status TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  complexity FLOAT DEFAULT 0.5,
  cost FLOAT DEFAULT 0,
  deploy_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Table: patterns (memory system)
CREATE TABLE patterns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  input TEXT NOT NULL,
  output JSONB NOT NULL,
  success BOOLEAN DEFAULT true,
  confidence FLOAT DEFAULT 0.5,
  tags TEXT[] DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Table: vault (encrypted data storage)
CREATE TABLE vault (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  encrypted_data TEXT NOT NULL,
  watermark TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  value_estimate FLOAT DEFAULT 0,
  license TEXT DEFAULT 'private',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX idx_patterns_tags ON patterns USING GIN(tags);
CREATE INDEX idx_queue_status ON queue(status);
CREATE INDEX idx_vault_user ON vault(user_id);
CREATE INDEX idx_projects_user ON projects(user_id);
```

### 3. Set Up Row-Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Repeat for other tables...
```

### 4. Configure Auth

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Enable desired providers (Email, Google, GitHub, etc.)
3. Configure redirect URLs:
   - `https://eko.vision/auth/callback`
   - `http://localhost:3000/auth/callback` (development)

---

## 🤖 API Key Configuration

### Get Free API Keys

#### 1. Groq (Free Tier)
- Visit: https://console.groq.com/keys
- Sign up and generate API key
- **Limit**: 14,400 requests/day (free)

#### 2. Google Gemini (Free Tier)
- Visit: https://makersuite.google.com/app/apikey
- Create API key
- **Limit**: 1,500 requests/day (free)

#### 3. Anthropic Claude
- Visit: https://console.anthropic.com/
- Purchase credits ($5 minimum)
- Generate API key
- **Cost**: ~$0.003 per 1k tokens

#### 4. OpenAI GPT
- Visit: https://platform.openai.com/api-keys
- Add payment method
- Create API key
- **Cost**: Varies by model

---

## 🚢 Deployment Options Compared

| Feature | Vercel | Docker | VPS | Desktop App |
|---------|--------|--------|-----|-------------|
| **Setup Time** | 5 min | 15 min | 30 min | 2 hours |
| **Cost** | Free-$20/mo | Server cost | $5-50/mo | Free |
| **Scalability** | Automatic | Manual | Manual | N/A |
| **SSL** | Automatic | Manual | Manual | N/A |
| **Best For** | Production | Enterprise | Control | Offline |
| **Difficulty** | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

**Recommendation**: Use **Vercel** for eKo.vision production deployment.

---

## ✅ Post-Deployment Checklist

### 1. Test Core Features

- [ ] Visit `https://eko.vision/os`
- [ ] Boot sequence plays correctly
- [ ] Brain Power lever responds
- [ ] KPI metrics toggle
- [ ] System status shows real data
- [ ] Dev Tools terminal works
- [ ] Voice capture (if enabled)

### 2. Monitor Performance

```bash
# Check build logs
vercel logs

# Monitor real-time
vercel logs --follow

# Check analytics
vercel analytics
```

### 3. Set Up Monitoring

- **Sentry**: Error tracking
  ```bash
  npm install @sentry/nextjs
  ```

- **Vercel Analytics**: Built-in
  ```typescript
  // app/layout.tsx
  import { Analytics } from '@vercel/analytics/react';

  export default function RootLayout({ children }) {
    return (
      <html>
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    );
  }
  ```

### 4. Configure Backups

```bash
# Supabase automatic backups (Pro plan)
# Or manual exports
supabase db dump -f backup.sql

# Schedule via cron
0 3 * * * cd /home/user/backups && supabase db dump -f "backup-$(date +\%Y\%m\%d).sql"
```

### 5. Security Hardening

- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure CORS properly
- [ ] Set secure headers
- [ ] Enable rate limiting
- [ ] Rotate API keys regularly
- [ ] Set up WAF (Web Application Firewall)

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Module not found`
```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Error**: `Type error`
```bash
# Check TypeScript
npm run type-check

# Fix common issues
npx tsc --noEmit
```

### API Routes Not Working

**Error**: `404 Not Found`
- Check file structure: `app/api/[route]/route.ts`
- Ensure proper exports: `export async function GET()`
- Check console for errors

**Error**: `500 Internal Server Error`
- Check API route logs
- Verify environment variables
- Test API route locally

### Supabase Connection Issues

**Error**: `supabaseUrl is required`
```bash
# Check .env.local
cat .env.local | grep SUPABASE

# Restart dev server
npm run dev
```

**Error**: `JWT expired`
- Check Supabase dashboard → Settings → API
- Regenerate anon key if needed

### Performance Issues

**Slow page load**
```bash
# Analyze bundle size
npm run build
npm run analyze

# Optimize images
# Use next/image component

# Enable caching
# Add cache headers in next.config.js
```

**High CPU usage**
- Reduce brain power setting
- Disable unused metrics
- Check for infinite loops

---

## 🆘 Support & Resources

### Documentation
- **Project Docs**: `/Documentation/`
- **Setup Guide**: `/eko-vision/CHIMERA_OS_SETUP.md`
- **API Reference**: Coming soon

### Community
- **GitHub Issues**: https://github.com/JB3ARD3N/Project-Sundae/issues
- **Discussions**: https://github.com/JB3ARD3N/Project-Sundae/discussions

### Contact
- **Email**: support@eko.vision
- **Discord**: Coming soon

---

## 🎯 Production Checklist

Before going live on **eKo.vision**:

- [ ] All environment variables set
- [ ] Supabase tables created
- [ ] API keys configured
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Error tracking set up
- [ ] Backups configured
- [ ] Security headers set
- [ ] Rate limiting enabled
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on system

---

## 🚀 Launch Sequence

```bash
# Final pre-launch checks
cd eko-vision

# 1. Clean build
rm -rf .next node_modules
npm install
npm run build

# 2. Test build locally
npm start
# Visit http://localhost:3000/os

# 3. Deploy to production
vercel --prod

# 4. Verify deployment
curl https://eko.vision/api/chimera/status

# 5. Monitor logs
vercel logs --follow

# 6. Announce launch! 🎉
```

---

**Built with Truth Above All. Everybody Eats. Daily +1% Minimum.**

**eKo.vision** | **0r8.ai** | **Chimera OS**
