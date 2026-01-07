@echo off
echo ========================================
echo    VIPO Server - Auto Restart
echo ========================================
echo.

REM סגירת שרתים קיימים על פורט 3001
echo Closing existing servers on port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
    echo Killing process %%a
    taskkill /PID %%a /F /T 2>nul
)

echo.
echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo.
echo Starting new server...
cd /d "c:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
start "VIPO Server" cmd /k "npm run dev"

echo.
echo ========================================
echo    Server started in new window!
echo ========================================
timeout /t 3 /nobreak >nul
