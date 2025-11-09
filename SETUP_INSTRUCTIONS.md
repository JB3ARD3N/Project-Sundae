# 🚀 CHIMERA SETUP INSTRUCTIONS

## What We Just Built

✅ **Layer 0: Intent Engine** - Perfect intent detection
✅ **Dual Vault System** - Internal (private) + Market (for sale)
✅ **Supabase Integration** - Cloud storage with NAS backup

---

## 🛑 ACTION REQUIRED: Setup Supabase

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Name**: `chimera-vault`
   - **Database Password**: (Generate strong password - SAVE THIS!)
   - **Region**: Choose closest to you
   - **Plan**: Free tier is fine to start

### Step 2: Get Your Credentials

After project is created:

1. Go to **Settings** → **API**
2. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGc...
service_role key: eyJhbGc... (KEEP SECRET!)
```

### Step 3: Set Environment Variables

Create `/home/user/Project-Sundae/.env` file:

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...  # KEEP SECRET

# Vault Encryption Keys
CHIMERA_INTERNAL_KEY=<generate-random-64-char-hex>
CHIMERA_MARKET_KEY=<generate-random-64-char-hex>
CHIMERA_VAULT_KEY=<generate-random-64-char-hex>
CHIMERA_ENCRYPTION_KEY=<generate-random-64-char-hex>

# NAS Backup (if you have NAS storage)
NAS_BACKUP_PATH=/path/to/your/nas/chimera-backups
```

**Generate random keys** with this command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run it 4 times, one for each key.

### Step 4: Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy/paste this SQL:

```sql
-- Internal Vault (Private - Your competitive edge)
CREATE TABLE IF NOT EXISTS chimera_internal_vault (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  content TEXT NOT NULL,  -- Encrypted
  value NUMERIC DEFAULT 0,
  watermark TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  encrypted BOOLEAN DEFAULT true
);

ALTER TABLE chimera_internal_vault ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_internal_type ON chimera_internal_vault(type);
CREATE INDEX idx_internal_value ON chimera_internal_vault(value DESC);
CREATE INDEX idx_internal_created ON chimera_internal_vault(created_at DESC);

CREATE POLICY "Authenticated users only" ON chimera_internal_vault
  FOR ALL USING (auth.role() = 'authenticated');

-- Market Vault (For sale/rent)
CREATE TABLE IF NOT EXISTS chimera_market_vault (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  content TEXT NOT NULL,  -- Encrypted and sanitized
  value NUMERIC DEFAULT 0,
  watermark TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  encrypted BOOLEAN DEFAULT true,
  exportable BOOLEAN DEFAULT true
);

ALTER TABLE chimera_market_vault ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_market_type ON chimera_market_vault(type);
CREATE INDEX idx_market_value ON chimera_market_vault(value DESC);
CREATE INDEX idx_market_exportable ON chimera_market_vault(exportable);

CREATE POLICY "Public read access" ON chimera_market_vault
  FOR SELECT USING (exportable = true);

CREATE POLICY "Authenticated write access" ON chimera_market_vault
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Audit Log (Track all access)
CREATE TABLE IF NOT EXISTS chimera_audit_log (
  id SERIAL PRIMARY KEY,
  vault TEXT NOT NULL,
  entry_id TEXT NOT NULL,
  accessor TEXT NOT NULL,
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  metadata JSONB
);

CREATE INDEX idx_audit_entry ON chimera_audit_log(entry_id);
CREATE INDEX idx_audit_timestamp ON chimera_audit_log(timestamp DESC);
```

4. Click **RUN**
5. Verify: Should see "Success. No rows returned"

### Step 5: Install Supabase Package

```bash
cd /home/user/Project-Sundae/chimera-core
npm install @supabase/supabase-js
```

### Step 6: (Optional) Setup NAS Backup

If you have NAS storage:

1. Create backup directory:
```bash
mkdir -p /path/to/your/nas/chimera-backups/internal
mkdir -p /path/to/your/nas/chimera-backups/market
```

2. Set permissions:
```bash
chmod 700 /path/to/your/nas/chimera-backups
```

3. Update `NAS_BACKUP_PATH` in `.env`

---

## ✅ Verification

Test that everything works:

```bash
cd /home/user/Project-Sundae/chimera-core
node -e "
const { SupabaseVault } = require('./dist/lib/storage/supabase-vault');
const vault = new SupabaseVault({
  url: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY,
  enableRLS: true
});
vault.initialize().then(() => console.log('✅ Supabase connected!'));
"
```

Should see: `✅ Supabase connected!`

---

## 🎯 What's Next

After setup, tell me:
- ✅ "Supabase is ready" - And I'll build the rest
- ❌ "I'm stuck on step X" - And I'll help you

---

## 🔐 Security Checklist

- [ ] `.env` file added to `.gitignore`
- [ ] Environment variables set
- [ ] Strong database password
- [ ] Service key kept secret (never commit!)
- [ ] Row-level security enabled
- [ ] NAS backup configured (optional)

---

## 💰 Cost Estimate

**Supabase Free Tier:**
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users
- **$0/month**

**Supabase Pro (when you scale):**
- 8 GB database
- 100 GB file storage
- Unlimited users
- **$25/month**

**Your data = millions → $25/month is nothing.**

---

## 🚨 CRITICAL: Keep These Secret

NEVER commit these to git:
- SUPABASE_SERVICE_KEY
- CHIMERA_*_KEY values
- .env file

Already added to `.gitignore` for safety.

---

Ready? Complete the setup and tell me when done! 🚀
