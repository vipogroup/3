@echo off
chcp 65001 >nul
title Fix MONGODB_DB in Vercel

echo.
echo =====================================
echo   Fix MONGODB_DB Environment Variable
echo =====================================
echo.

cd /d "%~dp0"

echo Step 1: Removing old MONGODB_DB with whitespace...
echo.

echo Removing from production...
echo y | vercel env rm MONGODB_DB production

echo Removing from preview...
echo y | vercel env rm MONGODB_DB preview

echo Removing from development...
echo y | vercel env rm MONGODB_DB development

echo.
echo Step 2: Adding clean MONGODB_DB value...
echo.

echo Adding to production...
echo vipo| vercel env add MONGODB_DB production

echo Adding to preview...
echo vipo| vercel env add MONGODB_DB preview

echo Adding to development...
echo vipo| vercel env add MONGODB_DB development

echo.
echo Step 3: Redeploying...
echo.

vercel --prod --yes

echo.
echo =====================================
echo   Done!
echo =====================================
echo.
pause
