@echo off
title Alumni Connect Hub - Full Stack
color 0A

echo.
echo ========================================
echo   ALUMNI CONNECT HUB - FULL STACK START
echo ========================================
echo.

REM Check if Redis is installed
redis-cli ping >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Redis not found. Please install Redis first.
    echo Download from: https://github.com/microsoftarchive/redis/releases
    pause
    exit /b 1
)

REM Check if PHP is installed
php -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PHP not found. Please add PHP to PATH.
    pause
    exit /b 1
)

REM Check if Node is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js.
    pause
    exit /b 1
)

echo [1/5] Starting Redis Server...
start "Redis" redis-server
timeout /t 2 /nobreak

echo [2/5] Starting Laravel Websockets...
cd backend
start "Laravel Websockets" cmd /k "php artisan websockets:serve"
timeout /t 2 /nobreak

echo [3/5] Starting Laravel Backend...
start "Laravel Backend" cmd /k "php artisan serve --host=127.0.0.1 --port=8000"
timeout /t 3 /nobreak

echo [4/5] Starting Frontend (Vite)...
cd ..
start "Frontend Vite" cmd /k "npm run dev"
timeout /t 5 /nobreak

echo.
echo ========================================
echo   ✓ ALL SERVICES STARTED
echo ========================================
echo.
echo Services Running:
echo   ✓ Redis          - localhost:6379
echo   ✓ Backend        - http://localhost:8000
echo   ✓ Websockets     - localhost:6001
echo   ✓ Frontend       - http://localhost:8080
echo.
echo Open in browser: http://localhost:8080
echo.
echo To expose with Ngrok, run in new terminal:
echo   .\start-ngrok-tunnels.ps1
echo.
echo Press any key to continue...
pause
