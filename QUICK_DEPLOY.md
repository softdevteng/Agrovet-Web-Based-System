# QUICK START - DEPLOY BACKEND NOW

## 🚀 EASIEST WAY - Use the Automated Script

### For Windows (You're on Windows!):

#### Step 1: Open Terminal
```
1. Open PowerShell or Command Prompt
2. Navigate to backend folder:
   cd "C:\Users\mwangi\Projects\SK AGROVET WEB BASED SYSTEM\backend"
```

#### Step 2: Run the deployment script
```
.\railway-deploy.bat
```

That's it! The script will:
- ✅ Install Railway CLI
- ✅ Log you into Railway
- ✅ Create/link your project
- ✅ Deploy everything automatically
- ✅ Tell you what to do next

---

## 📋 What the Script Does

When you run `railway-deploy.bat`, it will:

1. **Check** if Railway CLI is installed (if not, installs it)
2. **Open browser** for you to login with GitHub
3. **Ask** which project to use
4. **Automatically:**
   - Builds your backend (`npm run build`)
   - Sets up Node.js service
   - Sets up PostgreSQL
   - Configures all settings
   - Deploys everything

---

## ⏱️ Timeline

- **Step 1 (Login):** 1 minute
- **Step 2 (Project link):** 1 minute  
- **Step 3 (Deploy):** 3-5 minutes
- **Total:** ~10 minutes

---

## ✅ After Script Completes

1. **Script will tell you** a URL like: `https://agrovet-api-xxxxx.railway.app`
2. **Copy that URL**
3. Go to Netlify and update:
   ```
   VITE_API_URL=https://agrovet-api-xxxxx.railway.app/api
   ```
4. **Redeploy Netlify frontend**
5. **Test login** at https://skagro.netlify.app/login

---

## 🆘 Troubleshooting

### "Permission denied" error
```
Run PowerShell as Administrator:
1. Right-click PowerShell
2. Click "Run as administrator"
3. Run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
4. Try again: .\railway-deploy.bat
```

### "npm: command not found"
```
You need Node.js installed:
https://nodejs.org/ (download version 18+)
Then try again
```

### Script stopped or errored
```
1. Check the error message
2. Try running again: .\railway-deploy.bat
3. If still fails, share the error
```

---

## 📝 Manual Alternative (If Script Doesn't Work)

If the script fails, here's what to do manually:

```bash
# 1. Go to backend folder
cd backend

# 2. Install Railway CLI
npm install -g railway

# 3. Login
railway login

# 4. Link project
railway link

# 5. Deploy
railway up
```

---

## 🎯 Summary

**Just run this one command:**
```
.\railway-deploy.bat
```

**Then follow the prompts!**

**Total time: 10-15 minutes**

---

## ✨ That's It!

The script handles everything automatically. You just need to:
1. Run the script
2. Follow the prompts
3. Keep window open until done
4. Update Netlify with the URL it gives you

**You've got this!** 🚀
