@echo off
chcp 65001 >nul
title VIPO - Create Admin in Vercel MongoDB

echo.
echo =====================================
echo   Create Admin User in Production
echo =====================================
echo.

cd /d "%~dp0"

echo Running script to create admin in MongoDB Atlas...
echo.

node scripts\create-admin-vercel.js

echo.
pause
