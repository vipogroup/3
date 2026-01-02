@echo off
setlocal
set "REPO_ROOT=C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
cd /d "%REPO_ROOT%"

echo === Running Vercel production deploy ===
echo.

REM Check if running from dashboard (no pause) or manually (with pause)
if "%1"=="--auto" (
    npx vercel --prod --yes
    if errorlevel 1 (
        echo [ERROR] Vercel deploy failed
        exit /b 1
    ) else (
        echo [SUCCESS] Vercel deploy finished
        exit /b 0
    )
) else (
    npx vercel --prod --yes
    if errorlevel 1 (
        echo Vercel deploy reported an issue.
    ) else (
        echo Vercel deploy finished successfully!
    )
    echo.
    pause
)

endlocal
