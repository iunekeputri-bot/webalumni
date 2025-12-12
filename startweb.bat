@echo off
echo Starting Alumni Connect Hub...

:: Start Redis (if installed via WSL or Docker, otherwise skip)
echo Checking for Redis...
if exist "C:\Program Files\Redis\redis-server.exe" (
    echo Starting Redis...
    start "Redis Server" cmd /k "C:\Program Files\Redis\redis-server.exe"
) else if exist "C:\Redis\redis-server.exe" (
    echo Starting Redis...
    start "Redis Server" cmd /k "C:\Redis\redis-server.exe"
) else (
    echo Redis not found. Skipping Redis start (ensure it is running if needed).
)

:: Skip database sync to prevent data loss on every startup
:: Only run manually when needed: cd backend && php artisan admin:sync-databases
echo Skipping database sync (preserving existing data)...

:: Start Websockets
echo Starting Laravel Websockets...
start "Laravel Websockets" cmd /k "cd backend ^& php artisan websockets:serve"

:: Start Backend
echo Starting Laravel Backend...
start "Laravel Backend" cmd /k "cd backend ^& php artisan serve"

:: Start Frontend
echo Starting Vite Frontend...
start "Vite Frontend" cmd /k "npm run dev"

echo.
echo Application started!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:8080
echo Websockets: Port 6001
echo.
pause