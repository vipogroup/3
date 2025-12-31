param(
    [string]$MongoUri = ""
)

$repoRoot = "C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
$backupDir = "C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test\backups\database\mongo-2025-12-31T15-47-09-768Z"

if ($MongoUri) { $env:MONGODB_URI = $MongoUri }

Set-Location $repoRoot
Write-Host "Restoring backup from $backupDir"
node scripts/db/restore-from-dir.js "$backupDir"