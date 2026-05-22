$ErrorActionPreference = 'Continue'
Import-Module ExchangeOnlineManagement -ErrorAction Stop
Connect-ExchangeOnline -DisableWAM -ShowBanner:$false -ErrorAction Stop

$Addresses = @(
    'training@gennoor.com',
    'sales@gennoor.com',
    'schedule@gennoor.com',
    'info@gennoor.com',
    'enquiry@gennoor.com',
    'customercare@gennoor.com',
    'webinar@gennoor.com',
    'marketing@gennoor.com',
    'admin@gennoor.com',
    'jalalceo@gennoor.com',
    'hr@gennoor.com',
    'escalation@gennoor.com',
    'contact@gennoor.com'
)

Write-Host "==== All email-FROM addresses used by the app ====" -ForegroundColor Cyan
foreach ($a in $Addresses) {
    $r = Get-EXORecipient -Identity $a -ErrorAction SilentlyContinue
    if ($r) {
        Write-Host ("  [OK]    {0,-32}  {1,-15}  {2}" -f $a, $r.RecipientTypeDetails, $r.DisplayName) -ForegroundColor Green
    } else {
        Write-Host ("  [FAIL]  {0,-32}  MISSING - emails from this address will bounce" -f $a) -ForegroundColor Red
    }
}

Disconnect-ExchangeOnline -Confirm:$false | Out-Null
