# Restore Script for backup: 2026-01-06T16-41-58_full-backup
# Usage: .\restore.ps1 [-MongoUri "mongodb://..."]

param(
    [string]$MongoUri = ""
)

$ErrorActionPreference = "Stop"
$BackupDir = $PSScriptRoot
$RepoRoot = "C:\\Users\\ALFA DPM\\Desktop\\New Agent System Miriam\\vipo-agents-test"

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  VIPO System Restore" -ForegroundColor Cyan
Write-Host "  Backup: 2026-01-06T16-41-58_full-backup" -ForegroundColor Cyan  
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Restore MongoDB
Write-Host ""
Write-Host "🔄 Restoring MongoDB..." -ForegroundColor Yellow
if ($MongoUri) { 
    $env:MONGODB_URI = $MongoUri 
}
Set-Location $RepoRoot

$mongoBackupDir = Join-Path $BackupDir "mongodb"
if (Test-Path $mongoBackupDir) {
    node scripts/db/restore-from-dir.js "$mongoBackupDir"
    Write-Host "✅ MongoDB restored" -ForegroundColor Green
} else {
    Write-Host "⚠️ No MongoDB backup found" -ForegroundColor Yellow
}

# Restore Git tag
Write-Host ""
Write-Host "🔄 Checking Git tag..." -ForegroundColor Yellow
$gitInfoFile = Join-Path $BackupDir "git" "git-info.json"
if (Test-Path $gitInfoFile) {
    $gitInfo = Get-Content $gitInfoFile | ConvertFrom-Json
    Write-Host "📍 Backup was at commit: $($gitInfo.commit.Substring(0,8))" -ForegroundColor Blue
    Write-Host "📍 Tag: $($gitInfo.tag)" -ForegroundColor Blue
    Write-Host ""
    Write-Host "To restore code to this point, run:" -ForegroundColor Yellow
    Write-Host "  git checkout $($gitInfo.tag)" -ForegroundColor White
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  Restore Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green