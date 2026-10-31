# Sign in to LinkedIn once for the connector. You type your own password in a secure browser view; this script and the
# website never see it. The login is saved on the Azure Files share and reused until LinkedIn expires it.
#
# It starts a temporary login container on the same share, prints a private link, waits for you to finish, then deletes
# the temporary container. Run: powershell -File scripts/linkedin-mcp-login.ps1
#
# NOTE: written from the connector's documentation and not yet run end to end (it needs a real LinkedIn sign-in).
$ErrorActionPreference = 'Stop'
$env:PYTHONUTF8 = '1'
$env:MSYS_NO_PATHCONV = '1'
$sub = '2f55ca6d-7f38-4220-919c-591a66eb1a2b'
$rg = 'rg-gennoor-tech'
$cae = 'cae-gennoor-career'
$share = 'linkedin-mcp'
$app = 'ca-linkedin-login'
$main = 'ca-gennoor-linkedin-mcp'

# Only one thing may use the saved browser profile at a time: stop the connector while you sign in.
# (the connector is scaled to zero when idle, so nothing else is using the profile)

az containerapp create --subscription $sub -g $rg -n $app --environment $cae `
  --image docker.io/stickerdaniel/linkedin-mcp-server:latest --ingress external --target-port 6080 --cpu 1.0 --memory 2Gi `
  --min-replicas 1 --max-replicas 1 --output none
$yaml = @"
properties:
  template:
    containers:
      - name: $app
        image: docker.io/stickerdaniel/linkedin-mcp-server:latest
        args: ['--login', '--login-viewer']
        resources: { cpu: 1.0, memory: 2Gi }
        volumeMounts: [{ volumeName: profile, mountPath: /home/pwuser/.linkedin-mcp }]
    scale: { minReplicas: 1, maxReplicas: 1 }
    volumes: [{ name: profile, storageType: AzureFile, storageName: $share, mountOptions: 'uid=1000,gid=1000,file_mode=0600,dir_mode=0700,noperm,nobrl,mfsymlinks' }]
"@
$file = New-TemporaryFile
Set-Content -Path $file -Value $yaml
az containerapp update --subscription $sub -g $rg -n $app --yaml $file --output none
Remove-Item $file
$fqdn = az containerapp show --subscription $sub -g $rg -n $app --query 'properties.configuration.ingress.fqdn' -o tsv

Write-Host 'Waiting for the sign-in page to start...'
Start-Sleep -Seconds 60
$logs = az containerapp logs show --subscription $sub -g $rg -n $app --tail 100 --format text 2>$null | Out-String
$token = [regex]::Match($logs, 'token=([A-Za-z0-9_\-]+)').Groups[1].Value
if ($token) { Write-Host "`nOpen this link and sign in to LinkedIn (type your own password):`n  https://$fqdn/vnc_lite.html#?path=websockify%3Ftoken%3D$token&scale=true`n" }
else { Write-Host "`nOpen https://$fqdn/ . If it asks for a token, find the line containing 'token=' in:`n  az containerapp logs show --subscription $sub -g $rg -n $app --tail 100`n" }

Read-Host 'When the page says your session is saved, press Enter to finish'
az containerapp delete --subscription $sub -g $rg -n $app --yes --output none
Write-Host 'Done. Open Admin > LinkedIn hub and press "Check sign-in".'
