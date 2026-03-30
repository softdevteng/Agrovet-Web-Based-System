# Deployment Guide - SK AGROVET Web-Based System

## 🚀 Quick Start Services

### Current Status (Local Development)
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Database:** PostgreSQL on localhost:5432

---

## 📋 Step 1: Push Code to GitHub

### Setup Remote Repository
```bash
# Add your GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/softdevteng/sk-agrovet.git

# Rename branch to main (GitHub uses main by default)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Verify Push
```bash
git log --oneline
git remote -v
```

---

## 🌐 Step 2: Deploy Frontend to Netlify

### Option A: Deploy via Netlify CLI
```bash
# 1. Install Netlify CLI globally
npm install -g netlify-cli

# 2. Build the frontend
cd frontend
npm run build

# 3. Login to Netlify
netlify login

# 4. Deploy to production
netlify deploy --prod --dir=dist
```

### Option B: Deploy via Netlify Web Dashboard (Recommended)
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select GitHub as the source
4. Authorize GitHub and select **softdevteng/sk-agrovet** repository
5. Configure build settings:
   - **Build command:** `cd frontend && npm run build`
   - **Publish directory:** `frontend/dist`
6. Click "Deploy site"

### Netlify Environment Variables (Frontend)
In Netlify dashboard → Site settings → Build & deploy → Environment:
```
VITE_API_URL=https://your-backend-domain.com
```

---

## 🔧 Step 3: Deploy Backend (Choose One Option)

### ⭐ RECOMMENDED: Use a Dedicated Backend Hosting (NOT Netlify)

**Why not Netlify for Backend?**
- Netlify is designed for static sites + serverless functions
- Your Express backend needs persistent server
- Better options: Heroku, Railway, Render, Fly.io

#### Option 1: Railway.app (Easiest)
```bash
# 1. Sign up at https://railway.app
# 2. Create new project
# 3. Select "Deploy from GitHub"
# 4. Connect your repository
# 5. Configure variables in Railway dashboard:
#    - DATABASE_URL: Your PostgreSQL connection string
#    - JWT_SECRET: Your secret key
#    - NODE_ENV: production
# 6. Railway auto-deploys from git push
```

#### Option 2: Render.com
```bash
# 1. Sign up at https://render.com
# 2. Create new "Web Service"
# 3. Connect GitHub repository
# 4. Configure build & start commands:
#    - Build: npm install && npm run build
#    - Start: npm start
# 5. Add environment variables
# 6. Deploy
```

#### Option 3: Heroku (if available in your region)
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create sk-agrovet-api

# Set environment variables
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set JWT_SECRET="your_secret"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

### Option B: Netlify Functions (Advanced)
If you want to keep everything on Netlify, convert Express routes to serverless functions:
```bash
# Install serverless plugins
npm install --save-dev @netlify/functions

# Create functions directory
mkdir -p netlify/functions

# Convert Express routes to individual function files
# Each route becomes: netlify/functions/[route].ts
```

---

## 🗄️ Step 4: Database Deployment

### PostgreSQL Hosting Options:
1. **Supabase** (Recommended - PostgreSQL + backend)
   - Sign up: https://supabase.com
   - Create project
   - Update `DATABASE_URL` in backend environment

2. **Railway Database**
   - PostgreSQL plugin in Railway
   - Auto-connects to your backend

3. **AWS RDS**
   - Create RDS PostgreSQL instance
   - Configure security groups
   - Save connection string

4. **Azure Database for PostgreSQL**
   - Azure portal → Create resource
   - Configure and save connection string

---

## 🔑 IMPORTANT: Environment Variables Configuration

### Backend Environment Variables
Create `.env` in backend directory (NEVER commit):
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/sk_agrovet
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=sk_agrovet
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d

# Server
PORT=8000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://your-frontend-domain.netlify.app

# Email (if configured)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend Environment Variables
Create `.env.production` in frontend directory:
```env
VITE_API_URL=https://your-backend-api.railway.app
```

---

## ✅ Deployment Checklist

- [ ] Code committed to GitHub
- [ ] `.env` files NOT committed (check .gitignore)
- [ ] Frontend build succeeds: `npm run build`
- [ ] Backend builds: `npm run build`
- [ ] Frontend deployed to Netlify
- [ ] Backend deployed to Railway/Render/Heroku
- [ ] Database set up and accessible
- [ ] Environment variables configured
- [ ] CORS_ORIGIN updated in backend
- [ ] API base URL updated in frontend
- [ ] Test API connection: `curl https://your-api-domain/api/health`
- [ ] Frontend loads at https://your-domain.netlify.app
- [ ] Login functionality works end-to-end

---

## 🔍 Testing Deployment

### Test Backend API
```bash
# Health check
curl https://your-backend-api.railway.app/api/health

# Test auth endpoint
curl -X POST https://your-backend-api.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Test Frontend
1. Open https://your-domain.netlify.app
2. Try login with test credentials
3. Check browser console for API errors
4. Verify requests go to production API (not localhost)

---

## 📊 Monitoring & Logs

### Railway Logs
- Dashboard → Deployments → View logs
- Real-time logs visible on deployment page

### Render Logs
- Service page → Logs tab
- Tail logs for debugging

### Netlify Logs
- Site → Deployments → Deploy log
- Functions → Function log (for serverless)

---

## 🆘 Troubleshooting

### "CORS Error" when frontend calls backend
**Solution:** Update `CORS_ORIGIN` in backend `.env` to your Netlify frontend URL

### Database connection fails
**Solution:** Verify `DATABASE_URL` is correct and database is accessible

### Build fails on Netlify
**Solution:** 
- Check build logs in Netlify dashboard
- Ensure `package.json` scripts are correct
- Verify all dependencies installed locally

### Frontend shows "Cannot reach API"
**Solution:**
- Check `VITE_API_URL` environment variable
- Verify backend is running
- Check browser network tab for actual request URL
- Ensure CORS headers are correct

---

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Railway Guide](https://docs.railway.app)
- [Express.js Deployment](https://expressjs.com/en/advanced/best-practice-security.html)
- [PostgreSQL Production Setup](https://www.postgresql.org/docs/current/sql-running.html)

---

**Happy Deploying! 🎉**
