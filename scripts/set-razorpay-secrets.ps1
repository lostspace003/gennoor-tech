# Saves the Razorpay keys as GitHub secrets, from the key file Razorpay lets you download.
# Run it yourself, from the project folder:
#
#     powershell -ExecutionPolicy Bypass -File scripts\set-razorpay-secrets.ps1
#
# It never prints a key. It:
#   1. reads rzp-key.csv (the Key ID and Key Secret),
#   2. saves RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET as GitHub secrets,
#   3. makes a random webhook secret, saves it as RAZORPAY_WEBHOOK_SECRET, and writes it to
#      rzp-webhook-secret.txt so you can paste the same text into Razorpay's webhook form.
#
# Both files are ignored by git. Delete them once the webhook is set up.
param([string]$KeyFile = 'rzp-key.csv')

$ErrorActionPreference = 'Stop'
if (-not (Test-Path $KeyFile)) { Write-Host "Cannot find $KeyFile in this folder." -ForegroundColor Red; exit 1 }

# The file is "key_id,key_secret" with the values on the next line. Read it loosely so a
# different column order or quoting still works.
$fields = (Get-Content $KeyFile -Raw) -split '[,\r\n]+' | ForEach-Object { $_.Trim().Trim('"') } | Where-Object { $_ }
$id = $fields | Where-Object { $_ -match '^rzp_(live|test)_[A-Za-z0-9]+$' } | Select-Object -First 1
$secret = $fields | Where-Object { $_ -ne $id -and $_ -notmatch '^(key[ _]?id|key[ _]?secret)$' -and $_.Length -ge 16 } | Select-Object -First 1

if (-not $id -or -not $secret) { Write-Host "Could not find a Key ID and a Key Secret in $KeyFile." -ForegroundColor Red; exit 1 }
$mode = if ($id -like 'rzp_live_*') { 'LIVE (real money)' } else { 'TEST (no real money)' }

gh secret set RAZORPAY_KEY_ID --body $id | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Host 'GitHub refused RAZORPAY_KEY_ID. Is gh signed in?' -ForegroundColor Red; exit 1 }
gh secret set RAZORPAY_KEY_SECRET --body $secret | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Host 'GitHub refused RAZORPAY_KEY_SECRET.' -ForegroundColor Red; exit 1 }

# A fresh webhook secret, unless one was already made (so re-running does not break a webhook you already added)
$hookFile = 'rzp-webhook-secret.txt'
if (Test-Path $hookFile) {
  $hook = (Get-Content $hookFile -Raw).Trim()
} else {
  $bytes = New-Object byte[] 24
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  $hook = -join ($bytes | ForEach-Object { $_.ToString('x2') })
  Set-Content -Path $hookFile -Value $hook -NoNewline
}
gh secret set RAZORPAY_WEBHOOK_SECRET --body $hook | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Host 'GitHub refused RAZORPAY_WEBHOOK_SECRET.' -ForegroundColor Red; exit 1 }

Write-Host ''
Write-Host "Saved three GitHub secrets. Keys are $mode." -ForegroundColor Green
Write-Host '  RAZORPAY_KEY_ID'
Write-Host '  RAZORPAY_KEY_SECRET'
Write-Host '  RAZORPAY_WEBHOOK_SECRET'
Write-Host ''
Write-Host "The webhook secret is in $hookFile. Open it and paste it into Razorpay's webhook form."
Write-Host 'Next: redeploy the site so it picks the secrets up.'
