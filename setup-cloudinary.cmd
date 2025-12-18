@echo off
chcp 65001 >nul
title Setup Cloudinary on Vercel

echo.
echo =====================================
echo   Setting up Cloudinary on Vercel
echo =====================================
echo.

cd /d "%~dp0"

echo Adding CLOUDINARY_CLOUD_NAME...
echo dxb1qqmxd | vercel env add CLOUDINARY_CLOUD_NAME production
echo dxb1qqmxd | vercel env add CLOUDINARY_CLOUD_NAME preview
echo dxb1qqmxd | vercel env add CLOUDINARY_CLOUD_NAME development

echo.
echo Adding CLOUDINARY_API_KEY...
echo 294162094416863 | vercel env add CLOUDINARY_API_KEY production
echo 294162094416863 | vercel env add CLOUDINARY_API_KEY preview
echo 294162094416863 | vercel env add CLOUDINARY_API_KEY development

echo.
echo Adding CLOUDINARY_API_SECRET...
echo XUOWwcwVKmV0lUYADRZ8r6hknUs | vercel env add CLOUDINARY_API_SECRET production
echo XUOWwcwVKmV0lUYADRZ8r6hknUs | vercel env add CLOUDINARY_API_SECRET preview
echo XUOWwcwVKmV0lUYADRZ8r6hknUs | vercel env add CLOUDINARY_API_SECRET development

echo.
echo Redeploying to Vercel...
vercel --prod --yes

echo.
echo =====================================
echo   Done!
echo =====================================
echo.
pause
