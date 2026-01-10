# WhatsApp Server Startup Script
# הפעלה: לחיצה כפולה או הרצה מ-PowerShell

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "       WhatsApp Server - VIPO          " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PM2 is installed
$pm2Installed = Get-Command pm2 -ErrorAction SilentlyContinue

if ($pm2Installed) {
    Write-Host "[PM2] Starting with PM2..." -ForegroundColor Green
    
    # Start with PM2
    Set-Location $PSScriptRoot
    pm2 start ecosystem.config.js
    
    Write-Host ""
    Write-Host "[OK] WhatsApp Server is running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Useful commands:" -ForegroundColor Yellow
    Write-Host "  pm2 status       - Check status" -ForegroundColor Gray
    Write-Host "  pm2 logs         - View logs" -ForegroundColor Gray
    Write-Host "  pm2 restart all  - Restart" -ForegroundColor Gray
    Write-Host "  pm2 stop all     - Stop" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "[Node] PM2 not found, starting with Node directly..." -ForegroundColor Yellow
    Write-Host "[TIP] Install PM2 for auto-restart: npm install -g pm2" -ForegroundColor Gray
    Write-Host ""
    
    # Start with Node
    Set-Location $PSScriptRoot
    node index.js
}
