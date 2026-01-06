@echo off
REM Restore Script for backup: 2026-01-06T16-43-33_complete-backup
REM Usage: restore.cmd [mongodb-uri]

setlocal
set "BACKUP_DIR=%~dp0"
set "REPO_ROOT=C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"

echo ═══════════════════════════════════════════════════════════
echo   VIPO System Restore
echo   Backup: 2026-01-06T16-43-33_complete-backup
echo ═══════════════════════════════════════════════════════════

if not "%~1"=="" set "MONGODB_URI=%~1"

cd /d "%REPO_ROOT%"

echo.
echo Restoring MongoDB...
if exist "%BACKUP_DIR%mongodb" (
    node scripts\db\restore-from-dir.js "%BACKUP_DIR%mongodb"
    echo MongoDB restored successfully
) else (
    echo No MongoDB backup found
)

echo.
echo ═══════════════════════════════════════════════════════════
echo   Restore Complete!
echo ═══════════════════════════════════════════════════════════

endlocal
pause