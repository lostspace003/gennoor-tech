$ErrorActionPreference = 'Continue'
Import-Module ExchangeOnlineManagement -ErrorAction Stop
Connect-ExchangeOnline -DisableWAM -ShowBanner:$false -ErrorAction Stop

Write-Host "==== Recipient lookups ====" -ForegroundColor Cyan
foreach ($a in @('training@gennoor.com','sales@gennoor.com')) {
    Write-Host ""
    Write-Host "---- $a ----" -ForegroundColor Yellow
    $r = Get-EXORecipient -Identity $a -ErrorAction SilentlyContinue
    if ($r) {
        Write-Host "  [OK] Exists" -ForegroundColor Green
        Write-Host "    DisplayName:          $($r.DisplayName)"
        Write-Host "    RecipientType:        $($r.RecipientType)"
        Write-Host "    RecipientTypeDetails: $($r.RecipientTypeDetails)"
        Write-Host "    PrimarySmtpAddress:   $($r.PrimarySmtpAddress)"

        $m = Get-EXOMailbox -Identity $a -ErrorAction SilentlyContinue
        if ($m) {
            Write-Host "    HiddenFromGAL:        $($m.HiddenFromAddressListsEnabled)"
            Write-Host "    ForwardingSmtp:       $($m.ForwardingSmtpAddress)"
            Write-Host "    ForwardingAddress:    $($m.ForwardingAddress)"
            Write-Host "    DeliverToMailboxAndForward: $($m.DeliverToMailboxAndForward)"
        }
    } else {
        Write-Host "  [FAIL] Not found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==== Send-As permissions (who can send from these addresses) ====" -ForegroundColor Cyan
foreach ($a in @('training@gennoor.com','sales@gennoor.com')) {
    Write-Host ""
    Write-Host "---- $a ----" -ForegroundColor Yellow
    Get-RecipientPermission -Identity $a -ErrorAction SilentlyContinue |
        Where-Object { $_.Trustee -ne 'NT AUTHORITY\SELF' } |
        Format-Table Trustee,AccessRights -AutoSize
}

Disconnect-ExchangeOnline -Confirm:$false | Out-Null
Write-Host "[OK] Done." -ForegroundColor Cyan
