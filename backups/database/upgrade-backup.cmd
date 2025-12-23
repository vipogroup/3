@echo off
setlocal enableextensions

set "REPO_ROOT=C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
set "BACKUP_ROOT=%REPO_ROOT%\backups\database"

cd /d "%REPO_ROOT%" || goto :EOF

echo ==================================================
echo === תהליך גיבוי סביב שדרוג המערכת          ===
echo ==================================================

echo שלב 1: גיבוי לפני השדרוג
call :RunBackup "לפני השדרוג"
if errorlevel 1 goto :END

echo.
echo שלב 1.1: תיוג גרסה יציבה (latest-stable)
npm run tag:stable
if errorlevel 1 (
    echo ⚠️  שים לב - יצירת התגית נכשלה. ניתן להמשיך אך מומלץ לבדוק.
)

echo.
echo ================================================
echo שלב 2: בצע עכשיו את פעולות השדרוג, פריסה ובדיקות.
echo לאחר שהכול הושלם ומאושר, לחץ על מקש כלשהו כדי להמשיך וליצור גיבוי חדש.
echo ================================================
pause >nul

echo.
echo שלב 3: גיבוי אחרי השדרוג
call :RunBackup "אחרי השדרוג"
if errorlevel 1 goto :END

echo.
echo ✅ התהליך הושלם. מומלץ להעתיק את תיקיות הגיבוי האחרונה למיקום חיצוני ובטוח (לדוגמה, כונן גיבוי או OneDrive).
echo    ניתן לפתוח את התיקייה כאן:
echo    %BACKUP_ROOT%
start "" "%BACKUP_ROOT%"

goto :END

:RunBackup
setlocal
set "PHASE=%~1"

echo ----------------------------------------------
echo מריץ npm run backup:db (%PHASE%)
npm run backup:db
if errorlevel 1 (
    echo ❌ הגיבוי נכשל בשלב %PHASE%.
    endlocal & exit /b 1
)

for /f "delims=" %%I in ('dir /b /ad /o-d "%BACKUP_ROOT%\mongo-*" 2^>nul') do (
    set "LATEST=%%I"
    goto :Found
)
:Found
if defined LATEST (
    echo ↳ גיבוי נשמר בתיקייה: %BACKUP_ROOT%\%LATEST%
) else (
    echo ⚠️  לא נמצאה תיקיית גיבוי למרות שהפקודה הצליחה. בדוק ידנית.
)
endlocal & exit /b 0

:END
endlocal
