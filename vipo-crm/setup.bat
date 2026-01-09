@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    VIPO CRM - התקנה אוטומטית
echo ========================================
echo.

:: Check Node.js
echo [1/6] בודק Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js לא מותקן!
    echo הורד מ: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js מותקן

:: Check Docker
echo [2/6] בודק Docker...
docker -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker לא מותקן!
    echo הורד מ: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo ✅ Docker מותקן

:: Install Backend dependencies
echo [3/6] מתקין Backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ שגיאה בהתקנת Backend
    pause
    exit /b 1
)
echo ✅ Backend dependencies הותקנו

:: Install Frontend dependencies
echo [4/6] מתקין Frontend dependencies...
cd frontend
call npm install
cd ..
if %errorlevel% neq 0 (
    echo ❌ שגיאה בהתקנת Frontend
    pause
    exit /b 1
)
echo ✅ Frontend dependencies הותקנו

:: Start PostgreSQL
echo [5/6] מפעיל PostgreSQL ב-Docker...
docker ps -a | findstr vipo-postgres >nul 2>&1
if %errorlevel% equ 0 (
    echo PostgreSQL container כבר קיים, מפעיל...
    docker start vipo-postgres
) else (
    echo יוצר PostgreSQL container חדש...
    docker run --name vipo-postgres -e POSTGRES_USER=vipo -e POSTGRES_PASSWORD=vipo123 -e POSTGRES_DB=vipo_crm -p 5432:5432 -d postgres:15
)
timeout /t 5 /nobreak >nul
echo ✅ PostgreSQL פועל

:: Run Prisma migrations
echo [6/6] מריץ Prisma migrations...
call npx prisma migrate deploy
call npx prisma generate
if %errorlevel% neq 0 (
    echo ⚠️ אזהרה: בעיה ב-migrations, מנסה ליצור מחדש...
    call npx prisma migrate dev --name init
)
echo ✅ Database מוכן

echo.
echo ========================================
echo    ✅ ההתקנה הושלמה בהצלחה!
echo ========================================
echo.
echo להרצת המערכת, הרץ: start.bat
echo.
pause
