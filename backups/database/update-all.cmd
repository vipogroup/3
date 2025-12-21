@echo off
setlocal
set "REPO_ROOT=C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
cd /d "%REPO_ROOT%"

echo === Starting full pre-update routine ===

echo.
echo [1/3] Running database backup...
npm run backup:db
if errorlevel 1 (
    echo ❌ Backup failed. Aborting sequence.
    goto END
)

echo.
echo [2/3] Tagging latest-stable in Git...
npm run tag:stable
if errorlevel 1 (
    echo ⚠️  Tagging reported an issue. Review the output above.
    goto OPEN_VERCEL
)

echo ✅ Git tag latest-stable updated successfully.

:OPEN_VERCEL
echo.
echo [3/3] Opening Vercel dashboard (optional redeploy)...
start "" "https://vercel.com/vipos-projects-0154d019/vipo-agents-test"

echo.
echo === Routine completed ===

:END
endlocal
pause
