@echo off
setlocal
set "REPO_ROOT=C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
set "BACKUP_DIR=C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test\backups\database\mongo-2026-01-06T12-26-35-842Z"
cd /d "%REPO_ROOT%"
if not "%~1"=="" set "MONGODB_URI=%~1"
echo Restoring backup from "%BACKUP_DIR%"
node scripts\db\restore-from-dir.js "%BACKUP_DIR%"
endlocal
pause