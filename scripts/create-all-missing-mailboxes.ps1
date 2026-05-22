# Creates every missing function-shared mailbox the website's email-service
# expects as a from-address. Shared mailboxes are free in Exchange Online.

$ErrorActionPreference = 'Continue'
$AdminGrantee = 'jalalceo@gennoor.com'

$Targets = @(
    @{ Smtp = 'schedule@gennoor.com';     Alias = 'schedule';     Display = 'Gennoor Schedule' },
    @{ Smtp = 'info@gennoor.com';         Alias = 'info';         Display = 'Gennoor Info' },
    @{ Smtp = 'enquiry@gennoor.com';      Alias = 'enquiry';      Display = 'Gennoor Enquiry' },
    @{ Smtp = 'customercare@gennoor.com'; Alias = 'customercare'; Display = 'Gennoor Customer Care' },
    @{ Smtp = 'webinar@gennoor.com';      Alias = 'webinar';      Display = 'Gennoor Webinar' },
    @{ Smtp = 'marketing@gennoor.com';    Alias = 'marketing';    Display = 'Gennoor Marketing' },
    @{ Smtp = 'hr@gennoor.com';           Alias = 'hr';           Display = 'Gennoor HR' },
    @{ Smtp = 'escalation@gennoor.com';   Alias = 'escalation';   Display = 'Gennoor Escalation' }
)

Import-Module ExchangeOnlineManagement -ErrorAction Stop
Connect-ExchangeOnline -DisableWAM -ShowBanner:$false -ErrorAction Stop

foreach ($t in $Targets) {
    Write-Host ""
    Write-Host "==== $($t.Smtp) ====" -ForegroundColor Yellow

    $existing = Get-EXORecipient -Identity $t.Smtp -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  [SKIP] Already exists: $($existing.RecipientTypeDetails)" -ForegroundColor DarkYellow
        continue
    }

    try {
        New-Mailbox -Shared -Name $t.Display -Alias $t.Alias -DisplayName $t.Display -PrimarySmtpAddress $t.Smtp -ErrorAction Stop | Out-Null
        Write-Host "  [OK] Shared mailbox created" -ForegroundColor Green

        Start-Sleep -Seconds 6

        try {
            Add-MailboxPermission -Identity $t.Smtp -User $AdminGrantee -AccessRights FullAccess -InheritanceType All -AutoMapping:$true -Confirm:$false -ErrorAction Stop | Out-Null
            Write-Host "  [OK] FullAccess granted to $AdminGrantee" -ForegroundColor Green
        } catch {
            Write-Host "  [WARN] FullAccess: $($_.Exception.Message)" -ForegroundColor DarkYellow
        }

        try {
            Add-RecipientPermission -Identity $t.Smtp -Trustee $AdminGrantee -AccessRights SendAs -Confirm:$false -ErrorAction Stop | Out-Null
            Write-Host "  [OK] SendAs granted to $AdminGrantee" -ForegroundColor Green
        } catch {
            Write-Host "  [WARN] SendAs: $($_.Exception.Message)" -ForegroundColor DarkYellow
        }
    } catch {
        Write-Host "  [ERR] $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==== Final check ====" -ForegroundColor Cyan
foreach ($t in $Targets) {
    $r = Get-EXORecipient -Identity $t.Smtp -ErrorAction SilentlyContinue
    if ($r) {
        Write-Host ("  [OK] {0,-32}  {1,-15}  {2}" -f $t.Smtp, $r.RecipientTypeDetails, $r.DisplayName) -ForegroundColor Green
    } else {
        Write-Host ("  [FAIL] {0,-32}  STILL MISSING" -f $t.Smtp) -ForegroundColor Red
    }
}

Disconnect-ExchangeOnline -Confirm:$false | Out-Null
Write-Host ""
Write-Host "[OK] Done. Bookings + every email flow should now route correctly." -ForegroundColor Cyan
