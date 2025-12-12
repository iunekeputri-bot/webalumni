@echo off
title Alumni Connect Hub - Full Stack
color 0A

echo.
echo ========================================
echo   ALUMNI CONNECT HUB - FULL STACK START
echo ========================================
echo.

REM Start Redis
echo [1/4] Starting Redis Server...
if exist "C:\Program Files\Redis\redis-server.exe" (
    start "Redis Server" "C:\Program Files\Redis\redis-server.exe"
) else if exist "C:\Redis\redis-server.exe" (
    start "Redis Server" "C:\Redis\redis-server.exe"
) else (
    echo Redis not found! Please install Redis.
    pause
    exit /b 1
)
timeout /t 2 /nobreak

REM Skip database sync to prevent data loss
REM Database sync only needed once during initial setup
REM To manually sync: cd backend && php artisan admin:sync-databases
echo [2/5] Skipping database sync (preserving data)...

REM Start Websockets
echo [3/5] Starting Laravel Websockets...
start "Laravel Websockets" cmd /k "cd backend & php artisan websockets:serve"
timeout /t 2 /nobreak

REM Start Backend
echo [4/5] Starting Laravel Backend...
start "Laravel Backend" cmd /k "cd backend & php artisan serve"
timeout /t 3 /nobreak

REM Start Frontend
echo [5/5] Starting Frontend (Vite)...
start "Frontend Vite" cmd /k "npm run dev"
timeout /t 5 /nobreak

echo.
echo ========================================
echo   SUCCESS! All services started
echo ========================================
echo.
echo Services:
echo   ✓ Redis          - localhost:6379
echo   ✓ Backend        - http://localhost:8000
echo   ✓ Websockets     - localhost:6001
echo   ✓ Frontend       - http://localhost:8080
echo.
echo Wait 30 seconds for frontend to compile...
echo Then open: http://localhost:8080
echo.
pause
