@echo off
chcp 65001 >nul
title VIPO - Vercel Environment Variables Update

echo.
echo =====================================
echo   VIPO - Vercel Env Update Script
echo =====================================
echo.

cd /d "%~dp0"

echo Running PowerShell script...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0update-vercel-env.ps1"

echo.
pause
