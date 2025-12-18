@echo off
chcp 65001 >nul
title Fix Cloudinary - Clean Values (No Spaces)

echo.
echo =====================================
echo   Fixing Cloudinary - Removing Spaces
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
echo Creating clean value files...
echo|set /p="dxb1qqmxd"> temp_cloud.txt
echo|set /p="276462296464553"> temp_key.txt
echo|set /p="XUOWwcwVKmV0lUYADRZ8r6hknUs"> temp_secret.txt

echo.
echo Adding Cloud Name (clean)...
type temp_cloud.txt | vercel env add CLOUDINARY_CLOUD_NAME production
type temp_cloud.txt | vercel env add CLOUDINARY_CLOUD_NAME preview
type temp_cloud.txt | vercel env add CLOUDINARY_CLOUD_NAME development

echo.
echo Adding API Key (clean)...
type temp_key.txt | vercel env add CLOUDINARY_API_KEY production
type temp_key.txt | vercel env add CLOUDINARY_API_KEY preview
type temp_key.txt | vercel env add CLOUDINARY_API_KEY development

echo.
echo Adding API Secret (clean)...
type temp_secret.txt | vercel env add CLOUDINARY_API_SECRET production
type temp_secret.txt | vercel env add CLOUDINARY_API_SECRET preview
type temp_secret.txt | vercel env add CLOUDINARY_API_SECRET development

echo.
echo Cleaning up temp files...
del temp_cloud.txt
del temp_key.txt
del temp_secret.txt

echo.
echo Redeploying...
vercel --prod --yes

echo.
echo =====================================
echo   Done! All values are now clean!
echo =====================================
echo.
pause
