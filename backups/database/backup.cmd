@echo off
setlocal
set "REPO_ROOT=C:\Users\ALFA DPM\Desktop\New Agent System Miriam\vipo-agents-test"
cd /d "%REPO_ROOT%"
echo Running database backup from %REPO_ROOT%
npm run backup:db
endlocal
pause
