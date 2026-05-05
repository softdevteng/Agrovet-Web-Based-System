# 📱 SK AGROVET - Phone Access Deployment Guide

## Overview
This guide will help you make your SK AGROVET system accessible from your phone over the internet (anywhere, anytime).

**What you'll have:**
- ✅ Frontend running on Netlify (worldwide CDN)
- ✅ Backend API running on Railway
- ✅ Both accessible from your phone's browser
- ✅ Auto-deployment on every Git push

---

## 🎯 Step-by-Step Deployment Process

### Step 1: Push Code to GitHub
*Estimated time: 5 minutes*

```bash
# Open terminal in VS Code (Ctrl + `)
cd c:\Users\mwangi\Projects\SK AGROVET WEB BASED SYSTEM

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SK AGROVET system ready for deployment"

# Add GitHub remote
git remote add origin https://github.com/softdevteng/sk-agrovet.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Verification:**
- Visit: https://github.com/softdevteng/sk-agrovet
- You should see all your files and folders

---

### Step 2: Deploy Backend to Railway
*Estimated time: 15 minutes*

#### 2a. Create Railway Account
1. Go to https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway to access your GitHub

#### 2b. Create New Project
1. Click "Create New Project"
2. Select "Deploy from GitHub repo"
3. Search and select: **sk-agrovet**
4. Select branch: **main**

#### 2c. Configure Backend Settings
1. Click on your project
2. In the service, click "Settings" tab
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** 18

#### 2d. Add PostgreSQL Database
1. Click "Add Service"
2. Select "PostgreSQL"
3. Railway automatically provides the connection string

#### 2e. Set Environment Variables
In Railway, click your project → "Variables" tab and add these:

```
DATABASE_URL=<Auto-provided by Railway - copy from PostgreSQL service>
DB_HOST=<Provided by Railway>
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=<Provided by Railway>

JWT_SECRET=your_secret_key_change_this_to_something_secure_123456
JWT_EXPIRE=7d

NODE_ENV=production
PORT=8000

CORS_ORIGIN=https://skagro.netlify.app

EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_app_password
```

#### 2f. Get Your Backend URL
After deployment completes:
1. Click the service in Railway
2. Go to "Settings" → "Domains"
3. Copy the generated URL (looks like: `https://agrovet-production-xxxx.railway.app`)
4. **Save this URL - you'll need it for the frontend**

**Check if backend is running:**
- Visit: `https://[your-railway-url]/api/health`
- You should see a success response

---

### Step 3: Deploy Frontend to Netlify
*Estimated time: 10 minutes*

#### 3a. Create Netlify Account
1. Go to https://app.netlify.com
2. Click "Sign up" or use GitHub login

#### 3b. Connect GitHub Repository
1. Click "Add new site" → "Import an existing project"
2. Select "GitHub" as your Git provider
3. Authorize Netlify to access GitHub
4. Search and select: **sk-agrovet** repository

#### 3c. Configure Build Settings
When prompted, set:
- **Base directory:** Leave empty or set to `/`
- **Build command:** `cd frontend && npm run build`
- **Publish directory:** `frontend/dist`

#### 3d. Set Environment Variable
1. Click "Deploy site" to trigger first build
2. After deployment, go to **Site settings** → **Build & deploy** → **Environment**
3. Click "Edit variables"
4. Add:
   ```
   VITE_API_BASE=https://[your-railway-backend-url]/api
   ```
   Example: `https://agrovet-production-xxxx.railway.app/api`

#### 3e. Trigger Redeployment
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete (2-3 minutes)

#### 3f. Get Your Frontend URL
1. Click "Site settings" → "Site information"
2. Copy your **Site URL** (looks like: `https://skagro.netlify.app`)
3. **This is what you'll access from your phone**

---

### Step 4: Update Backend CORS (Important!)
Now that you have your Netlify URL, update it in Railway:

1. Go to Railway → Your project
2. Click PostgreSQL service → "Variables"
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://skagro.netlify.app
   ```

---

## 📱 Accessing from Your Phone

### Via WiFi (Same Network)
1. On your phone, open browser
2. Visit: `https://skagro.netlify.app`
3. Login with your credentials

### Via Mobile Network (4G/5G)
1. On your phone, open browser
2. Visit: `https://skagro.netlify.app`
3. Same as WiFi - works anywhere with internet!

### Sharing with Others
Simply give them the URL: `https://skagro.netlify.app`
They can access it from anywhere with internet.

---

## 🔄 Automatic Deployment on Code Changes

Every time you push code to GitHub, both frontend and backend automatically redeploy!

```bash
# Make your code changes
# Then:
git add .
git commit -m "Description of changes"
git push origin main

# Frontend will redeploy to Netlify automatically (2-3 min)
# Backend will redeploy to Railway automatically (5-10 min)
```

---

## ✅ Verification Checklist

- [ ] Code pushed to GitHub (https://github.com/softdevteng/sk-agrovet)
- [ ] Backend deployed on Railway
- [ ] Backend health check works: `https://[railway-url]/api/health`
- [ ] Frontend deployed on Netlify
- [ ] Environment variables set in both Railway and Netlify
- [ ] Backend CORS updated with Netlify URL
- [ ] Frontend loads without errors
- [ ] Can log in from phone
- [ ] Can access all features from phone

---

## 🐛 Troubleshooting

### "Cannot connect to API" Error
**Solution:**
1. Check VITE_API_BASE in Netlify environment variables
2. Verify Railway backend URL is correct
3. Check CORS_ORIGIN in Railway matches your Netlify URL
4. Clear browser cache and reload

### "Cannot reach backend"
**Solution:**
1. Visit `https://[railway-url]/api/health` directly
2. If it fails, check Railway deployment logs
3. Verify environment variables in Railway
4. Check PostgreSQL service is running

### "Login not working"
**Solution:**
1. Check JWT_SECRET is set in Railway
2. Verify CORS_ORIGIN includes your Netlify URL
3. Check browser console for specific errors (F12)
4. Try private/incognito browsing

### "Build failed on Netlify"
**Solution:**
1. Check build logs in Netlify → Deploys
2. Verify all dependencies are in package.json
3. Check VITE_API_BASE environment variable is set
4. Try rebuilding with "Trigger deploy"

### "Railway deployment failed"
**Solution:**
1. Check Railway deployment logs
2. Verify all environment variables are set
3. Ensure `npm run build` works locally
4. Check DATABASE_URL format is correct

---

## 💡 Pro Tips

1. **Use custom domain** (Optional):
   - In Netlify: Site settings → Domain management → Add custom domain
   - Point your domain to Netlify

2. **Enable GitHub auto-deployments**:
   - Already enabled! Every push to main branch triggers deploy

3. **Monitor deployments**:
   - Netlify: Deploys tab shows history
   - Railway: Deployments section shows history

4. **Testing on phone**:
   - Use QR code from browser's developer tools
   - Or manually type the URL

---

## 📊 Final Architecture

```
Your Phone
    ↓
  WiFi/4G
    ↓
Netlify (Frontend): https://skagro.netlify.app
    ↓
HTTPS Connection
    ↓
Railway (Backend): https://[railway-url]/api
    ↓
PostgreSQL Database
```

---

## ⏱️ Expected Timeline

| Step | Time | Status |
|------|------|--------|
| Push to GitHub | 5 min | ⚠️ TODO |
| Railway Setup | 15 min | ⚠️ TODO |
| Netlify Setup | 10 min | ⚠️ TODO |
| First Deployment | 10 min | ⚠️ TODO |
| Verification | 5 min | ⚠️ TODO |
| **Total** | **~45 min** | ⚠️ TODO |

---

## Need Help?

If you encounter issues:
1. Check troubleshooting section above
2. Review deployment logs in Railway and Netlify
3. Check browser console (F12 on desktop, or developer tools on phone)
4. Verify all environment variables match exactly

Good luck! 🚀
