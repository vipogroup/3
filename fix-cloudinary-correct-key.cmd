@echo off
chcp 65001 >nul
title Fix Cloudinary API Key - Correct

echo.
echo =====================================
echo   Fixing Cloudinary API Key (Correct)
echo =====================================
echo.

cd /d "%~dp0"

echo Removing incorrect API Key...
echo y | vercel env rm CLOUDINARY_API_KEY production 2>nul
echo y | vercel env rm CLOUDINARY_API_KEY preview 2>nul
echo y | vercel env rm CLOUDINARY_API_KEY development 2>nul

echo.
echo Adding CORRECT API Key: 276462296464553
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
