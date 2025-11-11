# 🚀 QUICK START - Windows

## You're in the wrong folder! Here's the fix:

### Step 1: Get the code
```batch
cd C:\Users\JB
git clone https://github.com/JB3ARD3N/Project-Sundae.git
cd Project-Sundae
git checkout claude/build-feature-011CV2XMi6WYeCzZv4Q4dMHC
```

### Step 2: Navigate to the app
```batch
cd eko-vision
```

### Step 3: Boot it!
```batch
boot-chimera-os.bat
```

**OR manually:**
```batch
npm install
npm run dev
```

### Step 4: Open your browser
```
http://localhost:3000/os
```

---

## 🎯 Full Path Should Be:
```
C:\Users\JB\Project-Sundae\eko-vision\
```

NOT:
```
C:\Users\JB\eko-vision-deploy\  ❌ (This is empty!)
```

---

## ⚡ One-Liner (PowerShell):
```powershell
cd C:\Users\JB; git clone https://github.com/JB3ARD3N/Project-Sundae.git; cd Project-Sundae; git checkout claude/build-feature-011CV2XMi6WYeCzZv4Q4dMHC; cd eko-vision; npm install; npm run dev
```

---

## 🆘 If Git Clone Fails

You might be using a local git server. Find your git URL:
```batch
# Check your existing repos for the URL pattern
# It will look like: http://127.0.0.1:XXXXX/git/JB3ARD3N/Project-Sundae
```

Then use that URL in the clone command.
