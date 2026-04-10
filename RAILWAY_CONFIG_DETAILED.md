# 🚂 RAILWAY CONFIGURATION - DETAILED STEP-BY-STEP GUIDE

## 📍 Overview of What You're Doing
You have TWO services on Railway:
1. **Node.js Service** (your backend API) ← We need to configure THIS one
2. **PostgreSQL Service** (your database) ← This is already set up

We only need to touch the Node.js service settings.

---

## ✅ STEP 1: Access Railway Dashboard

1. **Open browser** and go to: https://railway.app/dashboard
2. **You should see:**
   - Your project name at top left (should say something like "respectful-light" or your project name)
   - Two boxes/cards below:
     - One labeled something like "Node.js" or with a purple Node icon
     - One labeled "PostgreSQL" or with a database icon

---

## ✅ STEP 2: Select Your Node.js Service

**IMPORTANT - Do NOT click on PostgreSQL!**

1. **Look at the two service boxes**
2. **Click on the Node.js box** (should have a purple/blue color, Node.js logo, or say "Node.js")
   - If you hover over it, it should say something like `node-production` or similar
3. **After clicking,** the right side panel will show details about the Node.js service

---

## ✅ STEP 3: Find and Click "Settings" Tab

**After clicking Node.js service**, you should see several tabs at the top of the right panel:

```
Deployments  | Variables  | Settings  | Logs
```

1. **Click on:** "Settings" tab
2. **The Settings panel will open** with various configuration options

---

## ✅ STEP 4: Configure Each Setting

### **SETTING 1: Root Directory**

**What you're looking for:**
- A field labeled: "Root Directory" or "Working Directory"
- It might be under a section called "Build Settings" or just "Settings"
- It probably currently shows: `.` (dot) or is empty

**What to do:**
1. **Click on the "Root Directory" input field**
2. **Clear it completely** (delete whatever is there)
3. **Type exactly:** `backend` (lowercase, no quotes, no slashes)
4. **Expected result:** Field shows `backend`

---

### **SETTING 2: Build Command**

**What you're looking for:**
- A field labeled: "Build Command"
- It might currently show something like: npm run build
- Or it might be empty

**What to do:**
1. **Clear this field completely** (delete everything)
2. **Leave it EMPTY** (Railway auto-detects npm scripts)
3. **Expected result:** The field is blank/empty

> **Why?** Railway automatically runs `npm run build` based on your package.json scripts. If we force it, it might cause issues.

---

### **SETTING 3: Start Command**

**What you're looking for:**
- A field labeled: "Start Command" or "Runtime" or "Start"
- It might currently show: `npm start` or be empty

**What to do:**
1. **Clear this field completely**
2. **Leave it EMPTY** (Railway will use your Procfile)
3. **Expected result:** The field is blank/empty

> **Why?** We added a `Procfile` in your backend folder that tells Railway exactly how to start the app. Railway reads this automatically.

---

### **SETTING 4: Node Version**

**What you're looking for:**
- A field labeled: "Node Version" or "Runtime Version"
- It might show something like: `18.x` or `16.x` or be auto-detected

**What to do:**
1. **Look at what it currently shows**
2. **If it's 16 or lower, change it to 18** (click the field and select/type `18`)
3. **If it's 18 or higher, leave it as is**
4. **Expected result:** Shows `18` or higher (we used Node 18+ features)

---

## ✅ STEP 5: Environment Variables Setup

**IMPORTANT: Do this ALSO in Settings**

Below the build settings, you should see a section for **Environment Variables**.

### **If PostgreSQL is already set up:**
You should already see:
- `DATABASE_URL` (Railway auto-creates this)

### **What you need to ADD:**

1. **Click "Add Variable" or the + button**
2. **Add these variables one by one:**

| Variable Name | Value |
|--------------|-------|
| `DB_NAME` | `sk_agrovet` |
| `DB_USER` | `postgres` |
| `DB_PORT` | `5432` |
| `NODE_ENV` | `production` |
| `PORT` | `8000` |
| `JWT_SECRET` | `your_super_secret_jwt_key_2024` |
| `JWT_EXPIRE` | `7d` |
| `CORS_ORIGIN` | `https://skagro.netlify.app` |

**For EMAIL (optional, you can add later):**
| `EMAIL_USER` | `your.email@gmail.com` |
| `EMAIL_PASS` | `your_app_password` |

3. **After adding each variable, press Enter or click "Save"**

---

## ✅ STEP 6: Save All Changes

**At the bottom of the Settings panel:**

1. **Look for a "Save" button** (usually blue/green)
2. **Click it** to save all your changes
3. **You might see a confirmation message** like "Settings saved successfully"

---

## ✅ STEP 7: Redeploy

**After saving settings:**

1. **Look at the right panel** - you might see a message saying "Changes detected"
2. **Look for a "Redeploy" button** or "Deploy" button
3. **Click it**
4. **A deployment process will start** - you'll see:
   ```
   Building... (might say "Initializing")
   Building... (stays here for 30-60 seconds)
   Deploying...
   ✓ Deployed Successfully (green checkmark appears)
   ```

---

## ⏱️ Wait for Deployment

**The deployment process takes 2-5 minutes:**

1. **You should see a status indicator** (spinning circle → green checkmark)
2. **When you see GREEN CHECKMARK** ✅ - deployment is SUCCESSFUL
3. **Check the "Logs" tab** to see if there are any error messages

---

## 🔗 STEP 8: Get Your Backend URL

**Once deployment succeeds:**

1. **Stay in the Node.js service view**
2. **Look at the TOP RIGHT** of the panel
3. **You should see a "URL" field** with something like:
   ```
   https://agrovet-api-random-name.railway.app
   ```
4. **Copy this URL** (click the copy icon or select and copy)

---

## 📝 Checklist - What Should You See?

After completing all steps, your settings should look like:

```
Root Directory: backend
Build Command: [empty]
Start Command: [empty]
Node Version: 18 (or higher)

Environment Variables:
✓ DATABASE_URL (auto-set by Railway)
✓ DB_NAME: sk_agrovet
✓ DB_USER: postgres
✓ DB_PORT: 5432
✓ NODE_ENV: production
✓ PORT: 8000
✓ JWT_SECRET: your_super_secret_jwt_key_2024
✓ JWT_EXPIRE: 7d
✓ CORS_ORIGIN: https://skagro.netlify.app

Status: ✅ Deployment Successful (GREEN CHECKMARK)
URL: https://agrovet-api-xxxxx.railway.app
```

---

## 🆘 If Something Looks Wrong

### **"I don't see Root Directory field"**
- Scroll down in the Settings panel
- It might be under a "Build" section header

### **"I don't see Settings tab"**
- Make sure you clicked on the NODE.js service (not PostgreSQL)
- Try refreshing the page (F5)

### **"Build is still failing"**
- Go to "Logs" tab
- Look for RED ERROR messages
- Screenshot the error and share with me

### **"Green checkmark appeared but I don't see a URL"**
- The URL appears after successful deployment
- It's usually at the top right of the service panel
- Try refreshing the page

---

## ✅ If Everything Looks Good

1. **Copy your Railway Backend URL** (e.g., `https://agrovet-api.railway.app`)
2. **Go to Netlify:** https://app.netlify.com
3. **Select site: `skagro`**
4. **Go to: Site settings → Build & deploy → Environment**
5. **Add variable:**
   ```
   VITE_API_URL=https://agrovet-api.railway.app/api
   ```
6. **Go to Deploys → Trigger deploy**
7. **Wait for Netlify build to complete**
8. **Test at:** https://skagro.netlify.app/login

---

## 📸 Visual Reference

```
Railway Dashboard Layout:
┌─────────────────────────────────────────┐
│  Project: respectful-light              │
│  Environment: production                │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐    │
│  │   Node.js    │  │  PostgreSQL  │    │
│  │   Service    │  │   Service    │    │
│  └──────────────┘  └──────────────┘    │
├─────────────────────────────────────────┤
│ Click Node.js → Settings Tab             │
│                                         │
│ Root Directory: [backend]               │
│ Build Command:  [empty]                 │
│ Start Command:  [empty]                 │
│ Node Version:   [18]                    │
│                                         │
│ Environment Variables:                  │
│ ✓ DATABASE_URL: ...                     │
│ ✓ DB_NAME: sk_agrovet                   │
│ ✓ ... more variables ...                │
│                                         │
│ [Save] [Redeploy]                       │
│                                         │
│ Status: ✅ Deployment Successful        │
│ URL: https://agrovet-api.railway.app    │
└─────────────────────────────────────────┘
```

---

## 🎯 Summary

1. ✅ Click Node.js service
2. ✅ Click Settings tab
3. ✅ Set Root Directory to `backend`
4. ✅ Clear Build Command (leave empty)
5. ✅ Clear Start Command (leave empty)
6. ✅ Set Node Version to 18+
7. ✅ Add Environment Variables
8. ✅ Click Save
9. ✅ Click Redeploy
10. ✅ Wait for GREEN checkmark
11. ✅ Copy URL
12. ✅ Update Netlify with URL

**You've got this!** 🚀
