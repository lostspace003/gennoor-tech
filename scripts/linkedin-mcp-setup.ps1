# One-time setup of the LinkedIn connector on Azure Container Apps (already done for gennoor-tech; kept so it can be rebuilt).
#
# Creates, in rg-gennoor-tech next to ca-gennoor-vector and ca-gennoor-studio:
#   - an Azure Files share "linkedin-mcp" holding the saved LinkedIn login, so it survives restarts
#   - the Container App "ca-gennoor-linkedin-mcp" running the open-source stickerdaniel/linkedin-mcp-server,
#     reachable ONLY from inside the Container Apps environment (internal ingress), never from the internet
#   - LINKEDIN_MCP_URL on ca-gennoor-studio, so the studio service can reach it
#
# Run: powershell -File scripts/linkedin-mcp-setup.ps1
$ErrorActionPreference = 'Stop'
$env:PYTHONUTF8 = '1'
$env:MSYS_NO_PATHCONV = '1'
$sub = '2f55ca6d-7f38-4220-919c-591a66eb1a2b'
$rg = 'rg-gennoor-tech'
$cae = 'cae-gennoor-career'
$storage = 'stgennoortech'
$share = 'linkedin-mcp'
$app = 'ca-gennoor-linkedin-mcp'

Write-Host '1/5 Azure Files share for the saved login'
az storage share-rm create --subscription $sub -g $rg --storage-account $storage -n $share --quota 5 --output none

Write-Host '2/5 Mount it into the Container Apps environment'
$key = az storage account keys list --subscription $sub -g $rg -n $storage --query '[0].value' -o tsv
az containerapp env storage set --subscription $sub -g $rg -n $cae --storage-name $share `
  --azure-file-account-name $storage --azure-file-account-key $key --azure-file-share-name $share --access-mode ReadWrite --output none

Write-Host '3/5 The connector: internal only, one replica (the browser profile must never be used twice)'
# FASTMCP_HTTP_ALLOWED_HOSTS: the server refuses any other Host name with 421, so only the studio service's name works.
az containerapp create --subscription $sub -g $rg -n $app --environment $cae `
  --image docker.io/stickerdaniel/linkedin-mcp-server:latest --ingress internal --target-port 8080 --cpu 1.0 --memory 2Gi `
  --min-replicas 0 --max-replicas 1 `
  --env-vars TRANSPORT=streamable-http HOST=0.0.0.0 PORT=8080 HTTP_PATH=/mcp 'FASTMCP_HTTP_ALLOWED_HOSTS=["ca-gennoor-linkedin-mcp"]' --output none
az containerapp ingress update --subscription $sub -g $rg -n $app --allow-insecure true --output none

Write-Host '4/5 Attach the share (needs a YAML update; the CLI has no flag for volumes)'
$yaml = @"
properties:
  template:
    containers:
      - name: $app
        image: docker.io/stickerdaniel/linkedin-mcp-server:latest
        env:
          - { name: TRANSPORT, value: streamable-http }
          - { name: HOST, value: 0.0.0.0 }
          - { name: PORT, value: "8080" }
          - { name: HTTP_PATH, value: /mcp }
          - { name: FASTMCP_HTTP_ALLOWED_HOSTS, value: '["$app"]' }
        resources: { cpu: 1.0, memory: 2Gi }
        volumeMounts: [{ volumeName: profile, mountPath: /home/pwuser/.linkedin-mcp }]
    scale: { minReplicas: 0, maxReplicas: 1 }
    volumes: [{ name: profile, storageType: AzureFile, storageName: $share, mountOptions: 'uid=1000,gid=1000,file_mode=0600,dir_mode=0700,noperm,nobrl,mfsymlinks' }]
"@
$file = New-TemporaryFile
Set-Content -Path $file -Value $yaml
az containerapp update --subscription $sub -g $rg -n $app --yaml $file --output none
Remove-Item $file

Write-Host '5/5 Point the studio service at it'
az containerapp update --subscription $sub -g $rg -n ca-gennoor-studio --set-env-vars "LINKEDIN_MCP_URL=http://$app/mcp" --output none
Write-Host 'Done. Next: run scripts/linkedin-mcp-login.ps1 to sign in to LinkedIn once.'
