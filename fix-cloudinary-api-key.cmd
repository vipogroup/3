@echo off
chcp 65001 >nul
title Fix Cloudinary API Key

echo.
echo =====================================
echo   Fixing Cloudinary API Key
echo =====================================
echo.

cd /d "%~dp0"

echo Removing old API Key...
echo y | vercel env rm CLOUDINARY_API_KEY production 2>nul
echo y | vercel env rm CLOUDINARY_API_KEY preview 2>nul
echo y | vercel env rm CLOUDINARY_API_KEY development 2>nul

echo.
echo Adding correct API Key...
echo 278462398464563 | vercel env add CLOUDINARY_API_KEY production
echo 278462398464563 | vercel env add CLOUDINARY_API_KEY preview
echo 278462398464563 | vercel env add CLOUDINARY_API_KEY development

echo.
echo Redeploying...
vercel --prod --yes

echo.
echo =====================================
echo   Done!
echo =====================================
echo.
pause
