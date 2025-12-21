@echo off
setlocal
set "REPO_ROOT=C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
cd /d "%REPO_ROOT%"

echo === Running Vercel production deploy (via npx) ===
npx vercel --prod
if errorlevel 1 (
    echo Vercel deploy reported an issue (ייתכן שצריך להתחבר עם "npx vercel login").
) else (
    echo Vercel deploy finished.
)

echo.
echo אם נדרש גיבוי, הרץ update-all.cmd לפני פריסה.

echo.
pause
endlocal
