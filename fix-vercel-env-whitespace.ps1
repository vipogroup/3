# Fix Vercel environment variable whitespace issue
Write-Host "🔧 Fixing MONGODB_DB whitespace in Vercel..." -ForegroundColor Yellow
Write-Host ""

# Remove the old variable with whitespace
Write-Host "1. Removing old MONGODB_DB..." -ForegroundColor Cyan
vercel env rm MONGODB_DB production --yes
vercel env rm MONGODB_DB preview --yes
vercel env rm MONGODB_DB development --yes

Write-Host ""
Write-Host "2. Adding clean MONGODB_DB..." -ForegroundColor Cyan

# Add clean value (no newlines)
$cleanValue = "vipo"
echo $cleanValue | vercel env add MONGODB_DB production
echo $cleanValue | vercel env add MONGODB_DB preview
echo $cleanValue | vercel env add MONGODB_DB development

Write-Host ""
Write-Host "✅ Fixed! Redeploying..." -ForegroundColor Green
Write-Host ""

vercel --prod --yes

Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green
