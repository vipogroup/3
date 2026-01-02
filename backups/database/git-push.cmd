@echo off
setlocal
set "REPO_ROOT=C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
cd /d "%REPO_ROOT%"

echo === Git Push to GitHub ===
echo.

REM Check if running from dashboard (no pause) or manually (with pause)
if "%1"=="--auto" (
    git add -A
    if errorlevel 1 (
        echo [ERROR] git add failed
        exit /b 1
    )
    
    git commit -m "Update from dashboard - %date% %time%"
    if errorlevel 1 (
        echo [WARNING] Nothing to commit or commit failed
    )
    
    git push
    if errorlevel 1 (
        echo [ERROR] git push failed
        exit /b 1
    )
    
    echo [SUCCESS] Git push completed
    exit /b 0
) else (
    git add -A
    git commit -m "Update from dashboard - %date% %time%"
    git push
    
    if errorlevel 1 (
        echo Git push reported an issue.
    ) else (
        echo Git push completed successfully!
    )
    echo.
    pause
)

endlocal
