# 🚀 Quick Deploy Guide

## Deploy Your AI Studio in 60 Seconds!

### Fastest Option: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to web-app folder
cd C:\Users\nugye\OneDrive\Pictures\Screenshots\dist2\dist\web-app

# 3. Deploy!
vercel

# Follow the prompts:
# - Login/Sign up (automatic)
# - Project name: grudge-cloudpilot
# - Settings: Accept defaults
# ✅ DONE! Your URL: https://grudge-cloudpilot.vercel.app
```

### Alternative: Python Local Server

```bash
# Test locally first
cd C:\Users\nugye\OneDrive\Pictures\Screenshots\dist2\dist\web-app
python -m http.server 8000

# Open: http://localhost:8000
```

---

## Files to Deploy

✅ **Required Files** (in `web-app` folder):
- `index.html` - Main app
- `styles.css` - All styling
- `app.js` - Application logic
- `README.md` - Documentation

✅ **Parent Folder** (needed for imports):
- `ai-config.js` - AI configuration (in parent `dist` folder)

---

## Deployment Checklist

- [ ] Copy `ai-config.js` to web-app folder
- [ ] Update logo if desired
- [ ] Test locally: `python -m http.server 8000`
- [ ] Deploy to Vercel/Netlify
- [ ] Test live site
- [ ] Share your URL! 🎉

---

## Post-Deployment

### 1. Test Everything

✅ AI chat works
✅ Image upload works  
✅ Theme toggle works
✅ Settings save
✅ Mobile responsive

### 2. Custom Domain (Optional)

Vercel/Netlify both offer:
- Free custom domains
- Automatic HTTPS
- Global CDN
- Zero configuration

### 3. Share!

Your free AI studio is live!
No API costs, no limits, 100% yours.

---

## Need Help?

**Common Issues:**

**Q: "Module not found" error?**
A: Copy `ai-config.js` into the `web-app` folder

**Q: Blank page?**
A: Check browser console (F12) for errors

**Q: AI not responding?**
A: Simulated mode works without Ollama

**Q: Styling broken?**
A: Clear cache, ensure `styles.css` loaded

---

## Upgrade to Real AI

Want actual AI instead of simulated mode?

```bash
# Install Ollama
winget install Ollama.Ollama

# Download a model
ollama pull llama3.3

# Run your web app locally
python -m http.server 8000

# AI will automatically use Ollama!
```

Note: Deployed sites use simulated mode unless you host the backend too.

---

**GRUDGE CLOUDPILOT - Deploy and Dominate!** 🔥
