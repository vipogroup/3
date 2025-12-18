@echo off
chcp 65001 >nul
title Fix Cloud Name to dckhhnoqh

echo.
echo =====================================
echo   Updating Cloud Name to dckhhnoqh
echo =====================================
echo.

cd /d "%~dp0"

echo Removing old Cloud Name...
echo y | vercel env rm CLOUDINARY_CLOUD_NAME production 2>nul
echo y | vercel env rm CLOUDINARY_CLOUD_NAME preview 2>nul
echo y | vercel env rm CLOUDINARY_CLOUD_NAME development 2>nul

echo.
echo Creating clean value file...
echo|set /p="dckhhnoqh"> temp_cloud.txt

echo.
echo Adding correct Cloud Name: dckhhnoqh
type temp_cloud.txt | vercel env add CLOUDINARY_CLOUD_NAME production
type temp_cloud.txt | vercel env add CLOUDINARY_CLOUD_NAME preview
type temp_cloud.txt | vercel env add CLOUDINARY_CLOUD_NAME development

del temp_cloud.txt

echo.
echo Redeploying...
vercel --prod --yes

echo.
echo =====================================
echo   Done!
echo =====================================
echo.
pause
