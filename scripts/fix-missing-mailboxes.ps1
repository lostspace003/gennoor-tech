# Fixes Exchange Online recipients:
#   1. Verify training@gennoor.com is healthy (already exists)
#   2. Create sales@gennoor.com as shared mailbox (missing - blocks booking flow)
#   3. Soft-delete wamiqmushtaq@gennoor.com and najmussaquib@gennoor.com per user request

$ErrorActionPreference = 'Continue'
$AdminGrantee = 'jalalceo@gennoor.com'
$UsersToRemove = @('wamiqmushtaq@gennoor.com', 'najmussaquib@gennoor.com')
$SalesSmtp = 'sales@gennoor.com'
$TrainingSmtp = 'training@gennoor.com'

Write-Host "[*] Connecting to Exchange Online..." -ForegroundColor Cyan
Import-Module ExchangeOnlineManagement -ErrorAction Stop
Connect-ExchangeOnline -DisableWAM -ShowBanner:$false -ErrorAction Stop

# 1. Diagnose training@
Write-Host ""
Write-Host "==== Diagnose $TrainingSmtp ====" -ForegroundColor Yellow
$tmbx = Get-EXOMailbox -Identity $TrainingSmtp -ErrorAction SilentlyContinue
if ($tmbx) {
    Write-Host "  Type:             $($tmbx.RecipientTypeDetails)"
    Write-Host "  Display:          $($tmbx.DisplayName)"
    Write-Host "  HiddenFromGAL:    $($tmbx.HiddenFromAddressListsEnabled)"
    Write-Host "  ForwardingAddr:   $($tmbx.ForwardingAddress)"
    Write-Host "  ForwardingSmtp:   $($tmbx.ForwardingSmtpAddress)"
    Write-Host "  DeliverToBoth:    $($tmbx.DeliverToMailboxAndForward)"
    Write-Host "  PrimarySmtp:      $($tmbx.PrimarySmtpAddress)"
    if (-not $tmbx.EmailAddresses -contains "SMTP:$TrainingSmtp" -and -not $tmbx.EmailAddresses -contains "smtp:$TrainingSmtp") {
        Write-Host "  [!] $TrainingSmtp not in EmailAddresses!" -ForegroundColor Red
    } else {
        Write-Host "  [OK] EmailAddresses contains $TrainingSmtp" -ForegroundColor Green
    }
} else {
    Write-Host "  [FAIL] training@ NOT found despite earlier listing - check manually" -ForegroundColor Red
}

# 2. Create sales@ shared mailbox
Write-Host ""
Write-Host "==== Create $SalesSmtp ====" -ForegroundColor Yellow
$smbx = Get-EXORecipient -Identity $SalesSmtp -ErrorAction SilentlyContinue
if ($smbx) {
    Write-Host "  [OK] $SalesSmtp already exists: $($smbx.RecipientTypeDetails)" -ForegroundColor Green
} else {
    Write-Host "  [.] Creating shared mailbox $SalesSmtp..." -ForegroundColor Yellow
    try {
        New-Mailbox -Shared -Name 'Gennoor Sales' -Alias 'sales' -DisplayName 'Gennoor Sales' -PrimarySmtpAddress $SalesSmtp -ErrorAction Stop | Out-Null
        Write-Host "  [OK] Shared mailbox created" -ForegroundColor Green
        Start-Sleep -Seconds 8
        try {
            Add-MailboxPermission -Identity $SalesSmtp -User $AdminGrantee -AccessRights FullAccess -InheritanceType All -AutoMapping:$true -Confirm:$false -ErrorAction Stop | Out-Null
            Write-Host "  [OK] FullAccess granted to $AdminGrantee" -ForegroundColor Green
        } catch {
            Write-Host "  [WARN] FullAccess: $($_.Exception.Message)" -ForegroundColor DarkYellow
        }
        try {
            Add-RecipientPermission -Identity $SalesSmtp -Trustee $AdminGrantee -AccessRights SendAs -Confirm:$false -ErrorAction Stop | Out-Null
            Write-Host "  [OK] SendAs granted to $AdminGrantee" -ForegroundColor Green
        } catch {
            Write-Host "  [WARN] SendAs: $($_.Exception.Message)" -ForegroundColor DarkYellow
        }
    } catch {
        Write-Host "  [FAIL] Create failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 3. Remove the two users
Write-Host ""
Write-Host "==== Remove users ====" -ForegroundColor Yellow
foreach ($u in $UsersToRemove) {
    Write-Host "  -- $u --"
    $rcpt = Get-EXORecipient -Identity $u -ErrorAction SilentlyContinue
    if (-not $rcpt) {
        Write-Host "    [SKIP] not found in Exchange recipients" -ForegroundColor DarkYellow
        continue
    }
    Write-Host "    Found: $($rcpt.RecipientTypeDetails) -- $($rcpt.DisplayName)"
    try {
        Remove-Mailbox -Identity $u -Confirm:$false -ErrorAction Stop
        Write-Host "    [OK] Mailbox removed (soft-deleted, recoverable for 30 days)" -ForegroundColor Green
    } catch {
        Write-Host "    [FAIL] Remove-Mailbox: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 4. Final state
Write-Host ""
Write-Host "==== Final state ====" -ForegroundColor Cyan
foreach ($addr in @($TrainingSmtp, $SalesSmtp)) {
    $r = Get-EXORecipient -Identity $addr -ErrorAction SilentlyContinue
    if ($r) {
        Write-Host "  [OK] $addr -- $($r.RecipientTypeDetails) -- $($r.DisplayName)" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $addr -- MISSING" -ForegroundColor Red
    }
}
foreach ($u in $UsersToRemove) {
    $r = Get-EXORecipient -Identity $u -ErrorAction SilentlyContinue
    if ($r) {
        Write-Host "  [STILL PRESENT] $u" -ForegroundColor Red
    } else {
        Write-Host "  [REMOVED] $u" -ForegroundColor Green
    }
}

Disconnect-ExchangeOnline -Confirm:$false | Out-Null
Write-Host ""
Write-Host "[OK] Done. Bounce should clear within ~5 minutes." -ForegroundColor Cyan
