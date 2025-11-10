# 🚀 Deploy eKo.vision to Vercel

## Quick Deploy (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
(This opens browser - follow the prompts)

### Step 3: Navigate to Project
```bash
cd /path/to/Project-Sundae/eko-vision
```

### Step 4: Deploy
```bash
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? **Choose your account**
- Link to existing project? **N** (first time)
- Project name? **eko-vision** (or whatever you want)
- Directory? **./** (press Enter)
- Override settings? **N**

### Step 5: Add Environment Variables

After deploy, Vercel gives you a URL. Now add your secrets:

**Go to:** https://vercel.com/[your-username]/eko-vision/settings/environment-variables

**Add these variables:**

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Copy from your `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Copy from your `.env.local` |
| `OPENAI_API_KEY` | Copy from your `.env.local` |
| `GOOGLE_API_KEY` | Copy from your `.env.local` |
| `ANTHROPIC_API_KEY` | Copy from your `.env.local` (full key) |
| `OPENROUTER_API_KEY` | Copy from your `.env.local` (full key) |

**💡 Tip:** All these values are in your local `eko-vision/.env.local` file - just copy-paste them!

**Important:** Make sure to check **"Production"** for each variable!

### Step 6: Redeploy with Secrets
```bash
vercel --prod
```

### Step 7: Open Your Live App! 🎉
Vercel gives you a URL like:
```
https://eko-vision-abc123.vercel.app
```

---

## Alternative: Deploy from GitHub

1. **Go to:** https://vercel.com/new
2. **Import Git Repository:** Select `JB3ARD3N/Project-Sundae`
3. **Configure Project:**
   - Framework: Next.js
   - Root Directory: `eko-vision`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Add Environment Variables** (same as above)
5. **Deploy!**

---

## What You'll See:

✅ Beautiful bioluminescent dashboard  
✅ Voice capture working  
✅ ZIP upload ready  
✅ Build queue + "Ship It" button  
✅ Real-time budget tracking  
✅ Prometheus Pro badge  

---

## Test Your Deployment:

1. 🎤 Click "Record" → speak → "Stop" → "Save"
2. 📋 See item in Build Queue
3. 🚀 Click "Ship It" → Watch it process!
4. 💰 Check Budget Monitor for costs

---

**Your live URL will be:** `https://[project-name].vercel.app`

🔥 GO TIME!
