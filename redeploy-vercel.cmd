@echo off
chcp 65001 >nul
title VIPO - Vercel Redeploy

echo.
echo =====================================
echo   VIPO - Vercel Redeploy
echo =====================================
echo.

cd /d "%~dp0"

powershell -ExecutionPolicy Bypass -File "%~dp0redeploy-vercel.ps1"

echo.
pause
