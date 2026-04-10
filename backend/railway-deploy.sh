#!/bin/bash
# SK AGROVET - Railway Deployment Script
# This script helps you deploy the backend automatically

echo "================================================"
echo "SK AGROVET Backend - Railway Deployment Helper"
echo "================================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g railway
fi

echo "✅ Railway CLI found"
echo ""

# Login to Railway
echo "🔐 Logging in to Railway..."
echo "   → A browser window will open"
echo "   → Click 'Authorize' to connect your GitHub account"
railway login

echo ""
echo "✅ Logged in successfully"
echo ""

# Link to project
echo "🔗 Linking to project..."
echo "   → Select '🆕 Create a new project' if first time"
echo "   → Or select your existing project"
railway link

echo ""
echo "✅ Project linked"
echo ""

# Check if we're in backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in backend directory"
    echo "   Please run this script from the backend folder:"
    echo "   cd backend && bash railway-deploy.sh"
    exit 1
fi

echo "📦 Uploading code and deploying..."
echo "   This may take 3-5 minutes..."
echo ""

# Deploy
railway up

echo ""
echo "================================================"
echo "✅ Deployment Complete!"
echo "================================================"
echo ""
echo "Your backend is now live on Railway!"
echo ""
echo "📍 Next Steps:"
echo "   1. Go to: https://railway.app/dashboard"
echo "   2. Copy your backend API URL"
echo "   3. Go to Netlify: https://app.netlify.app"
echo "   4. Update VITE_API_URL with your Railway URL"
echo "   5. Redeploy Netlify frontend"
echo ""
echo "🎉 Done!"
