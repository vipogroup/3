param(
    [string]$MongoUri = ""
)

$repoRoot = "c:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
$backupDir = "c:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test\backups\database\mongo-2026-01-10T18-43-11-937Z"

if ($MongoUri) { $env:MONGODB_URI = $MongoUri }

Set-Location $repoRoot
Write-Host "Restoring backup from $backupDir"
node scripts/db/restore-from-dir.js "$backupDir"