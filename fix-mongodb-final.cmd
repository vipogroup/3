@echo off
chcp 65001 >nul
title Fix MONGODB_DB - Final

echo.
echo =====================================
echo   Fixing MONGODB_DB (Final Attempt)
echo =====================================
echo.

cd /d "%~dp0"

echo Step 1: Removing incorrect MONGODB_DB...
echo.

call :remove_env production
call :remove_env preview
call :remove_env development

echo.
echo Step 2: Creating clean value file...
echo.

echo|set /p="vipo"> temp_vipo.txt

echo.
echo Step 3: Adding correct MONGODB_DB...
echo.

type temp_vipo.txt | vercel env add MONGODB_DB production
type temp_vipo.txt | vercel env add MONGODB_DB preview
type temp_vipo.txt | vercel env add MONGODB_DB development

del temp_vipo.txt

echo.
echo Step 4: Redeploying...
echo.

vercel --prod --yes

echo.
echo =====================================
echo   Done!
echo =====================================
echo.
echo Wait 30 seconds then try to login.
echo.
pause
exit /b

:remove_env
echo Removing from %1...
echo y | vercel env rm MONGODB_DB %1 2>nul
exit /b
