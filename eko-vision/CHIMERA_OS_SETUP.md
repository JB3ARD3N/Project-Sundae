# 🚀 CHIMERA OS - Setup & Boot Guide

Your personal AI command center cockpit. Built for speed, control, and total domination.

## 🎯 Quick Start (Windows)

### Step 1: Pull Latest Changes
```bash
cd C:\Users\JB\eko-vision-deploy
git pull origin claude/build-feature-011CV2XMi6WYeCzZv4Q4dMHC
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment (Optional)
```bash
# Copy the example environment file
copy .env.example .env.local

# Edit .env.local with your actual values (optional - works without them)
```

### Step 4: Boot the OS 🚀
```bash
# Development mode (with hot reload)
npm run dev

# OR Production mode (faster, optimized)
npm run build
npm start
```

### Step 5: Access Your Cockpit
Open your browser and navigate to:
- **Main Dashboard**: http://localhost:3000
- **Chimera OS Cockpit**: http://localhost:3000/os 🎯

---

## 🎮 Features

### Brain Power Lever
Drag the lever to control AI processing intensity (0-100%)
- **0-20%**: IDLE (low cost, slow processing)
- **20-40%**: LOW (basic operations)
- **40-60%**: MEDIUM (balanced performance)
- **60-80%**: HIGH (intensive tasks)
- **80-100%**: MAXIMUM (full power, highest cost)

### KPI Metrics Switches
Toggle to monitor specific metrics:
- 🧠 **Intelligence**: AI learning rate & pattern extraction
- ⚡ **Speed**: Response time & throughput
- 💰 **Cost**: Budget tracking & optimization
- 🤖 **Agents**: Active agent count & utilization
- 🧬 **Memory**: Knowledge base & recall accuracy
- 🔒 **Security**: Threat detection & encryption
- 🔨 **Build Queue**: Active builds & deployment status
- ✓ **Truth Score**: Verification confidence levels

### Automation Pipeline
One-button deployment system:
1. **Research**: Analyze requirements & gather data
2. **Build**: Generate code & run tests
3. **Deploy**: Push to production

Click the big **"DEPLOY NOW"** button and watch it go!

### Dev Tools
4 integrated panels:
- **Terminal**: Execute commands
- **Logs**: View system logs
- **Env**: Check environment variables
- **Git**: Manage version control

---

## ⚙️ Configuration

### Environment Variables (Optional)

Create a `.env.local` file in the `eko-vision` directory:

```env
# Supabase (Optional - has fallback values)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Providers (Future Integration)
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
```

**Note**: The OS works without these! It uses placeholder values for demo mode.

---

## 🛠️ Troubleshooting

### Issue: "npm run dev" not found
**Solution**: Make sure you're in the correct directory
```bash
cd eko-vision
npm install
npm run dev
```

### Issue: Port 3000 already in use
**Solution**: Use a different port
```bash
# Windows
set PORT=3001 && npm run dev

# Linux/Mac
PORT=3001 npm run dev
```

### Issue: Module not found errors
**Solution**: Clear cache and reinstall
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue: Build errors
**Solution**: Check Node.js version
```bash
node --version
# Should be v18 or higher

# Update if needed
nvm install 18
nvm use 18
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd eko-vision
vercel
```

### Option 2: Docker
```bash
# Build image
docker build -t chimera-os .

# Run container
docker run -p 3000:3000 chimera-os
```

### Option 3: Static Export
```bash
# Build static files
npm run build

# Files will be in .next/standalone
# Deploy to any static host
```

---

## 🎨 Customization

### Change Color Scheme
Edit `tailwind.config.ts`:
```typescript
colors: {
  'eko-cyan': '#00F5FF',    // Primary accent
  'eko-purple': '#8B00FF',  // Secondary accent
  'eko-gold': '#FFD700',    // Tertiary accent
}
```

### Modify Brain Power Levels
Edit `components/os/BrainPowerLever.tsx` (line 12-18)

### Add New KPI Metrics
Edit `components/os/KPIMetricsSwitches.tsx` (line 9-56)

### Customize Pipeline Stages
Edit `components/os/AutomationPipeline.tsx` (line 17-32)

---

## 📊 Performance

- **Page Load**: ~130 KB First Load JS
- **Build Time**: ~20 seconds
- **Hot Reload**: ~100ms
- **Animation FPS**: 60fps (GPU accelerated)

---

## 🔮 Next Steps

1. **Connect Chimera Core**: Wire up the backend intelligence
2. **Add Voice Commands**: Integrate voice-to-action
3. **Real-time WebSocket**: Live updates across all metrics
4. **Agent Visualization**: See agents spawning and working
5. **Electron Wrapper**: Convert to desktop app
6. **Linux Distro**: Package as bootable OS

---

## 🆘 Support

Having issues? Check these resources:
1. [Next.js Docs](https://nextjs.org/docs)
2. [Framer Motion Docs](https://www.framer.com/motion/)
3. [Tailwind CSS Docs](https://tailwindcss.com/docs)
4. Project README: `/README.md`

---

## 📝 License

Built for Project Sundae. Chimera Brain powered. Truth above all.

**"Daily +1% minimum. Everybody Eats. Build don't buy."**

---

🎯 **You're ready to fly this spaceship!** 🛸
