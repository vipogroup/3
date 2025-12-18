@echo off
chcp 65001 >nul
title Add Cloudinary to Vercel

echo.
echo =====================================
echo   Adding Cloudinary to Vercel
echo =====================================
echo.

cd /d "%~dp0"

echo Step 1: Adding CLOUDINARY_CLOUD_NAME...
echo dxb1qqmxd | vercel env add CLOUDINARY_CLOUD_NAME production
echo dxb1qqmxd | vercel env add CLOUDINARY_CLOUD_NAME preview
echo dxb1qqmxd | vercel env add CLOUDINARY_CLOUD_NAME development

echo.
echo Step 2: Adding CLOUDINARY_API_KEY...
echo 294162094416863 | vercel env add CLOUDINARY_API_KEY production
echo 294162094416863 | vercel env add CLOUDINARY_API_KEY preview
echo 294162094416863 | vercel env add CLOUDINARY_API_KEY development

echo.
echo Step 3: Adding CLOUDINARY_API_SECRET...
echo.
echo ⚠️  IMPORTANT: You need to copy the API Secret from Cloudinary Dashboard
echo    Click "Show" next to API Secret and copy it.
echo.
pause
echo.
echo Paste the API Secret and press Enter:
set /p API_SECRET=

echo %API_SECRET% | vercel env add CLOUDINARY_API_SECRET production
echo %API_SECRET% | vercel env add CLOUDINARY_API_SECRET preview
echo %API_SECRET% | vercel env add CLOUDINARY_API_SECRET development

echo.
echo Step 4: Redeploying...
vercel --prod --yes

echo.
echo =====================================
echo   Done!
echo =====================================
echo.
echo Cloudinary is now configured!
echo You can now upload images directly from the admin dashboard.
echo.
pause
