# Start LocalTunnel for Alumni Connect Hub
# LocalTunnel is FREE and allows multiple tunnels!

Write-Host "Starting LocalTunnel..." -ForegroundColor Cyan
Write-Host "Make sure all services are running first!" -ForegroundColor Yellow
Write-Host ""

# Start 3 tunnels in separate windows
Write-Host "Opening Backend Tunnel (port 8000)..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "lt --port 8000"

Start-Sleep -Seconds 2

Write-Host "Opening Frontend Tunnel (port 8080)..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "lt --port 8080"

Start-Sleep -Seconds 2

Write-Host "Opening WebSocket Tunnel (port 6001)..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "lt --port 6001"

Write-Host ""
Write-Host "✓ All tunnels started!" -ForegroundColor Green
Write-Host ""
Write-Host "Check each terminal window for the tunnel URLs" -ForegroundColor Yellow
Write-Host "URLs will look like: https://xxxxx.loca.lt" -ForegroundColor Cyan
Write-Host ""
Write-Host "Copy the 3 URLs and update your .env files accordingly" -ForegroundColor Yellow
