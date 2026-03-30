@echo off
REM SK AGROVET Setup Script for Windows

echo ======================================
echo SK AGROVET Installation Script
echo ======================================
echo.

REM Check Node.js
echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js not found. Please install Node.js 18+
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION%

REM Check npm
echo Checking npm installation...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X npm not found
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION%

echo.
echo Installing Backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install backend dependencies
    exit /b 1
)
cd ..
echo [OK] Backend setup complete

echo.
echo Installing Frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install frontend dependencies
    exit /b 1
)
cd ..
echo [OK] Frontend setup complete

echo.
echo ======================================
echo [OK] Installation Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Update .env file with your database credentials
echo 2. Start PostgreSQL (docker-compose up -d postgres)
echo 3. Run migrations: cd backend ^&^& npm run db:migrate
echo 4. Start backend: npm run dev
echo 5. Start frontend (in new terminal): cd frontend ^&^& npm run dev
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
pause
