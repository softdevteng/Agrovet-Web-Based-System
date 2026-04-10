@echo off
REM SK AGROVET - Railway Deployment Script for Windows
REM This script helps you deploy the backend automatically

echo.
echo ================================================
echo SK AGROVET Backend - Railway Deployment Helper
echo ================================================
echo.

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if errorlevel 1 (
    echo Downloading Railway CLI...
    npm install -g railway
    if errorlevel 1 (
        echo Error installing Railway. Please install Node.js first.
        pause
        exit /b 1
    )
)

echo.
echo ✅ Railway CLI is ready
echo.

REM Check backend directory
if not exist "package.json" (
    echo ❌ Error: Not in backend directory
    echo    Please run this from: SK AGROVET WEB BASED SYSTEM\backend
    echo.
    pause
    exit /b 1
)

echo.
echo 🔐 Step 1: Login to Railway
echo    → A browser window will open
echo    → Click "Authorize" to connect your GitHub
echo    → Come back here when done
echo.
pause
railway login

echo.
echo ✅ Logged in!
echo.

echo 🔗 Step 2: Link to your project
echo    → If NEW: Select "Create a new project"
echo    → If EXISTING: Select your project
echo.
pause
railway link

echo.
echo ✅ Project linked!
echo.

echo 📦 Step 3: Deploying your backend...
echo    ⏳ This takes 3-5 minutes...
echo    ⏳ Keep this window open...
echo.

railway up

echo.
echo ================================================
echo ✅ DEPLOYMENT SUCCESSFUL!
echo ================================================
echo.
echo Your backend is now live on Railway!
echo.
echo NEXT STEPS:
echo.
echo 1. Go to Railway Dashboard:
echo    https://railway.app/dashboard
echo.
echo 2. Find your backend URL (looks like):
echo    https://agrovet-api-xxxxx.railway.app
echo.
echo 3. Copy the full URL
echo.
echo 4. Go to Netlify:
echo    https://app.netlify.app
echo.
echo 5. Select site: skagro
echo.
echo 6. Go to Settings → Build & deploy → Environment
echo.
echo 7. Add environment variable:
echo    Name:  VITE_API_URL
echo    Value: https://agrovet-api-xxxxx.railway.app/api
echo    (Replace xxxxx with your actual Railway URL)
echo.
echo 8. Go to Deploys → Trigger deploy
echo.
echo 9. Test login at:
echo    https://skagro.netlify.app/login
echo.
echo 🎉 Done!
echo.
pause
