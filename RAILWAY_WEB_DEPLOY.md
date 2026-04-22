# Railway Web Deployment Guide

## Step 1: Login to Railway
1. Go to https://railway.app
2. Click **"Login"** button (top right)
3. Select **"Login with GitHub"**
4. Authorize the Railway app to access your GitHub account
5. You'll be redirected to the Railway dashboard

## Step 2: Create a New Environment
1. In the Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your `SK AGROVET WEB BASED SYSTEM` repository
4. Click **"Deploy now"**
5. Railway will automatically detect it's a Node.js project

## Step 3: Configure PostgreSQL Database
1. In your Railway project, click the **"+ New"** button
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically provision a PostgreSQL instance
4. The environment variables will be auto-added to your application

## Step 4: Set Environment Variables
1. Click on your **Node.js service** in the Railway project
2. Go to the **"Variables"** tab
3. Add these environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=[automatically added by PostgreSQL plugin]
   JWT_SECRET=[use a strong random string, e.g., change-me-in-production-12345]
   GMAIL_USER=[your Gmail address]
   GMAIL_PASSWORD=[your Gmail app password]
   ALLOWED_ORIGINS=https://skagro.netlify.app
   ```
4. Click **"Save"**

## Step 5: Deploy
1. Railway should automatically deploy when you save variables
2. Wait for the deployment to complete (you'll see a green checkmark)
3. Look for a URL that looks like: `https://agrovet-api-xxxxx.railway.app`
4. Click the URL to test if the API is running - you should see a JSON response

## Step 6: Connect Frontend to Backend
1. Go to your Netlify dashboard: https://app.netlify.app
2. Select your **"skagro"** site
3. Click **"Site settings"** → **"Build & deploy"** → **"Environment"**
4. Click **"Edit variables"**
5. Add a new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** Your Railway API URL (e.g., `https://agrovet-api-xxxxx.railway.app/api`)
6. Click **"Save"**

## Step 7: Redeploy Frontend
1. Go to the **"Deploys"** tab on Netlify
2. Find the latest deployment
3. Click **"Retry deploy"** or go to **"Trigger deploy"** → **"Deploy site"**
4. Wait for redeployment to complete

## Step 8: Test End-to-End
1. Go to https://skagro.netlify.app/login
2. Try to register a new account
3. You should receive a verification code via email (or check console logs in Railway)
4. Complete the registration and login
5. If it works, you're done! 🎉

## Troubleshooting

**If you don't see your GitHub repo:**
- Make sure you pushed all code to GitHub (check: `git status`)
- Try disconnecting and reconnecting Railway to GitHub

**If deployment fails:**
- Check the **Logs** tab in Railway service details
- Look for error messages about missing environment variables or database connection

**If email doesn't send:**
- Check that `GMAIL_USER` and `GMAIL_PASSWORD` are correct
- In development, verification codes are also logged to `verification_codes.json` on the server

**If Netlify frontend can't connect to backend:**
- Verify the `VITE_API_URL` is correct and includes `/api` at the end
- Check that the Railway URL is publicly accessible (not private)
- Trigger a Netlify redeploy after setting the environment variable

## Getting Your Railway API URL

1. Go to Railway dashboard
2. Click on your project
3. Click on the **Node.js service**
4. In the **Deployments** tab, you'll see a URL starting with your-domain-xxxxx.railway.app
5. The full API URL is: `https://your-domain-xxxxx.railway.app/api`
