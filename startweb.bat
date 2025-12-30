@echo off
echo Starting Alumni Connect Hub...

echo Checking for Redis...
if exist "C:\Program Files\Redis\redis-server.exe" (
    echo Starting Redis...
    start "Redis Server" cmd /k "C:\Program Files\Redis\redis-server.exe"
) else if exist "C:\Redis\redis-server.exe" (
    echo Starting Redis...
    start "Redis Server" cmd /k "C:\Redis\redis-server.exe"
) else (
    echo Redis not found. Skipping Redis start.
)

echo Skipping database sync...

:: Start Reverb (New for Laravel 12)
echo Starting Laravel Reverb (WebSocket)...
start "Laravel Reverb" cmd /k "cd backend & php artisan reverb:start"

:: Start Backend
echo Starting Laravel Backend...
start "Laravel Backend" cmd /k "cd backend & php artisan serve"

:: Start Frontend
echo Starting Vite Frontend...
start "Vite Frontend" cmd /k "npm run dev"

echo.
echo Application started!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:8080
echo Reverb Server: 0.0.0.0:8080
echo.
pause