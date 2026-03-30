#!/bin/bash

# SK AGROVET Setup Script

echo "======================================"
echo "SK AGROVET Installation Script"
echo "======================================"
echo ""

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "✓ Node.js $(node --version)"

# Check npm
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "✓ npm $(npm --version)"

# Check PostgreSQL
echo "Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "⚠ PostgreSQL not found. You can use Docker instead."
fi

echo ""
echo "Installing Backend dependencies..."
cd backend
npm install
cp ../.env.example ../.env
echo "✓ Backend setup complete"

echo ""
echo "Installing Frontend dependencies..."
cd ../frontend
npm install
echo "✓ Frontend setup complete"

echo ""
echo "======================================"
echo "✓ Installation Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Start PostgreSQL (docker-compose up -d postgres)"
echo "3. Run migrations: cd backend && npm run db:migrate"
echo "4. Start backend: npm run dev"
echo "5. Start frontend (in new terminal): cd frontend && npm run dev"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
