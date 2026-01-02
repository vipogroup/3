@echo off
chcp 65001 > nul
setlocal EnableDelayedExpansion

set "REPO_ROOT=C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
set "PORT=3001"

echo.
echo ========================================
echo    הפעלה מחדש של שרת VIPO
echo ========================================
echo.

cd /d "%REPO_ROOT%"

:: Check if server is running on port 3001
echo בודק אם יש שרת פעיל על פורט %PORT%...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    set "PID=%%a"
)

if defined PID (
    echo נמצא שרת פעיל עם PID: !PID!
    echo סוגר את השרת הקיים...
    taskkill /PID !PID! /F > nul 2>&1
    if !errorlevel! equ 0 (
        echo השרת הקודם נסגר בהצלחה.
    ) else (
        echo לא הצלחתי לסגור את השרת הקודם.
    )
    timeout /t 2 /nobreak > nul
) else (
    echo לא נמצא שרת פעיל על פורט %PORT%.
)

echo.
echo מפעיל שרת חדש...
echo השרת יפעל בכתובת: http://localhost:%PORT%
echo.
echo לסגירת השרת לחץ Ctrl+C
echo ========================================
echo.

npm run dev

endlocal
