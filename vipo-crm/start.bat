@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    VIPO CRM - הפעלת המערכת
echo ========================================
echo.

:: Start Docker if not running
echo בודק Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo מפעיל Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo ממתין ל-Docker...
    timeout /t 30 /nobreak >nul
)

:: Start PostgreSQL
echo מפעיל PostgreSQL...
docker start vipo-postgres >nul 2>&1
timeout /t 3 /nobreak >nul
echo ✅ PostgreSQL פועל

:: Start Backend
echo מפעיל Backend על port 4000...
start "VIPO Backend" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 3 /nobreak >nul

:: Start Frontend
echo מפעיל Frontend על port 5173...
start "VIPO Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo    ✅ המערכת פועלת!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:4000
echo.
echo לסגירה - סגור את חלונות ה-Terminal
echo.
pause
