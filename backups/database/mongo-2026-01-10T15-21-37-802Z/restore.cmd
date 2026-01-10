@echo off
setlocal
set "REPO_ROOT=c:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
set "BACKUP_DIR=c:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test\backups\database\mongo-2026-01-10T15-21-37-802Z"
cd /d "%REPO_ROOT%"
if not "%~1"=="" set "MONGODB_URI=%~1"
echo Restoring backup from "%BACKUP_DIR%"
node scripts\db\restore-from-dir.js "%BACKUP_DIR%"
endlocal
pause