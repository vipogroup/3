$port = 3000
$portPid = (netstat -ano | Select-String ":$port" | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -Unique)

if ($portPid) {
    Write-Host "Port $port in use by PID $portPid - killing..."
    taskkill /PID $portPid /F | Out-Null
    Start-Sleep -Seconds 2
} else {
    Write-Host "Port $port is free."
}

Write-Host "Starting dev server on port $port..."
npm run dev
