@echo off
chcp 65001 >nul
title Fix API Key to 276462296464553

echo.
echo =====================================
echo   Updating API Key to 276462296464553
echo =====================================
echo.

cd /d "%~dp0"

echo Removing old API Key...
echo y | vercel env rm CLOUDINARY_API_KEY production 2>nul
echo y | vercel env rm CLOUDINARY_API_KEY preview 2>nul
echo y | vercel env rm CLOUDINARY_API_KEY development 2>nul

echo.
echo Adding correct API Key: 276462296464553
echo 276462296464553 | vercel env add CLOUDINARY_API_KEY production
echo 276462296464553 | vercel env add CLOUDINARY_API_KEY preview
echo 276462296464553 | vercel env add CLOUDINARY_API_KEY development

echo.
echo Redeploying...
vercel --prod --yes

echo.
echo =====================================
echo   Done!
echo =====================================
echo.
pause
