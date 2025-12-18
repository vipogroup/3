@echo off
chcp 65001 >nul
title Fix Cloudinary - Final Correct Values

echo.
echo =====================================
echo   Fixing Cloudinary with CORRECT values
echo =====================================
echo.

cd /d "%~dp0"

echo Removing all old Cloudinary variables...
echo y | vercel env rm CLOUDINARY_CLOUD_NAME production 2>nul
echo y | vercel env rm CLOUDINARY_CLOUD_NAME preview 2>nul
echo y | vercel env rm CLOUDINARY_CLOUD_NAME development 2>nul
echo y | vercel env rm CLOUDINARY_API_KEY production 2>nul
echo y | vercel env rm CLOUDINARY_API_KEY preview 2>nul
echo y | vercel env rm CLOUDINARY_API_KEY development 2>nul
echo y | vercel env rm CLOUDINARY_API_SECRET production 2>nul
echo y | vercel env rm CLOUDINARY_API_SECRET preview 2>nul
echo y | vercel env rm CLOUDINARY_API_SECRET development 2>nul

echo.
echo Adding CORRECT Cloud Name: dxb1qqmxd
echo dxb1qqmxd | vercel env add CLOUDINARY_CLOUD_NAME production
echo dxb1qqmxd | vercel env add CLOUDINARY_CLOUD_NAME preview
echo dxb1qqmxd | vercel env add CLOUDINARY_CLOUD_NAME development

echo.
echo Adding CORRECT API Key: 278462296464553
echo 278462296464553 | vercel env add CLOUDINARY_API_KEY production
echo 278462296464553 | vercel env add CLOUDINARY_API_KEY preview
echo 278462296464553 | vercel env add CLOUDINARY_API_KEY development

echo.
echo Adding CORRECT API Secret: XUOWwcwVKmV0lUYADRZ8r6hknUs
echo XUOWwcwVKmV0lUYADRZ8r6hknUs | vercel env add CLOUDINARY_API_SECRET production
echo XUOWwcwVKmV0lUYADRZ8r6hknUs | vercel env add CLOUDINARY_API_SECRET preview
echo XUOWwcwVKmV0lUYADRZ8r6hknUs | vercel env add CLOUDINARY_API_SECRET development

echo.
echo Redeploying...
vercel --prod --yes

echo.
echo =====================================
echo   Done! All Cloudinary settings updated!
echo =====================================
echo.
pause
