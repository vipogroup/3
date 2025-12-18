# ========================================
# VIPO - Vercel Redeploy Script
# ========================================

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  VIPO - Vercel Redeploy" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting redeploy to production..." -ForegroundColor Yellow
Write-Host ""

# Navigate to project directory
Set-Location -Path $PSScriptRoot

# Deploy to production
vercel --prod --yes

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  ✅ Deployment complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your site: https://vipo-agents-test.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "Done! 🎉" -ForegroundColor Green
Write-Host ""
