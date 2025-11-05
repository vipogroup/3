# scripts/test-auth.ps1
$ErrorActionPreference = 'Stop'

# Base URL
$BaseUrl = $env:BASE_URL
if (-not $BaseUrl -or $BaseUrl -eq '') { $BaseUrl = 'http://localhost:3001' }

# Admin creds to try
$Email = 'admin@vipo.local'
$passwords = @('12345678A!', '12345678A')

# Results bucket
$result = [ordered]@{
  'env:MONGODB_URI'   = $false
  'env:JWT_SECRET'    = $false
  'reset-admin'       = $false
  'me_before_401'     = $false
  'login_ok'          = $false
  'cookie_token'      = $false
  'me_after_200'      = $false
  'bad_password_401'  = $false
  'not_found_404'     = $false
}

# Check .env.local (נמצא בתיקיית האב של app)
$envFile = Join-Path (Get-Location) '..\.env.local'
if (Test-Path $envFile) {
  $envRaw = Get-Content $envFile -Raw
  if ($envRaw -match '^\s*MONGODB_URI\s*=') { $result['env:MONGODB_URI'] = $true }
  if ($envRaw -match '^\s*JWT_SECRET\s*=')  { $result['env:JWT_SECRET']  = $true }
}

# נסה לזרוע/לאפס אדמין (אם יש script כזה ב-npm)
try {
  $o = npm.cmd run reset-admin 2>&1
  if ($LASTEXITCODE -eq 0 -and ($o -match 'Admin user.*(created|updated)')) {
    $result['reset-admin'] = $true
  }
} catch {}

# Helpers
function Post-Json([string]$url, [hashtable]$body, $session) {
  Invoke-RestMethod -Uri $url -Method POST `
    -Headers @{ 'Content-Type'='application/json' } `
    -Body ($body | ConvertTo-Json) `
    -WebSession $session -TimeoutSec 15
}
function Get-Status([string]$url, $session) {
  try {
    $r = Invoke-WebRequest -Uri $url -WebSession $session -Method GET
    return [int]$r.StatusCode
  } catch {
    $ex = $_.Exception.Response
    if ($ex) { return [int]$ex.StatusCode } else { return -1 }
  }
}
function Flag([bool]$b) { if ($b) { '1' } else { '0' } }

# Session לשמירת קוקיז
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# לפני התחברות: /me אמור להיות 401
if ((Get-Status "$BaseUrl/api/auth/me" $session) -eq 401) { $result['me_before_401'] = $true }

# ניסיון התחברות עם סיסמאות אפשריות
$used = $null
foreach ($p in $passwords) {
  try {
    $login = Post-Json "$BaseUrl/api/auth/login" @{ email = $Email; password = $p } $session
    if ($login.ok -eq $true) { $result['login_ok'] = $true; $used = $p; break }
  } catch {}
}

# בדיקת קוקי טוקן
try {
  $cookie = $session.Cookies.GetCookies($BaseUrl)['token']
  if ($cookie -and $cookie.Value) { $result['cookie_token'] = $true }
} catch {}

# אחרי התחברות: /me אמור להיות 200
if ((Get-Status "$BaseUrl/api/auth/me" $session) -eq 200) { $result['me_after_200'] = $true }

# בדיקות שליליות
try {
  Post-Json "$BaseUrl/api/auth/login" @{ email = $Email; password = 'wrong-pass' } $session
} catch {
  if ($_.Exception.Response.StatusCode -eq 401) { $result['bad_password_401'] = $true }
}
try {
  $rand = [guid]::NewGuid().ToString('N')
  Post-Json "$BaseUrl/api/auth/login" @{ email = "nouser_$rand@ex.com"; password = 'a' } $session
} catch {
  if ($_.Exception.Response.StatusCode -eq 404) { $result['not_found_404'] = $true }
}

# דוח מסכם
"===== AUTH CHECK ====="
"env MONGODB_URI   = " + (Flag $result['env:MONGODB_URI'])
"env JWT_SECRET    = " + (Flag $result['env:JWT_SECRET'])
"reset-admin       = " + (Flag $result['reset-admin'])
"me before login 401 = " + (Flag $result['me_before_401'])
"login ok          = " + (Flag $result['login_ok'])
"token cookie      = " + (Flag $result['cookie_token'])
"me after login 200 = " + (Flag $result['me_after_200'])
"wrong password 401 = " + (Flag $result['bad_password_401'])
"user not found 404 = " + (Flag $result['not_found_404'])
"Base URL: $BaseUrl"
