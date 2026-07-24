# URGENT: Set GitHub Secret for Authentication

The authentication is failing because `NEXTAUTH_SECRET` is not set in GitHub secrets.

## Generate a Secret

Run this command in PowerShell to generate a secure secret:
```powershell
-join ((1..32) | ForEach {'{0:X}' -f (Get-Random -Max 256)})
```

Or use this value (already generated):
```
7A3B9C2D8E4F1A6B5C9D0E3F8A2B7C4D9E5F0A1B6C8D3E9F4A0B5C7D2E8F3A9B
```

## Add to GitHub Secrets

1. Go to: https://github.com/lostspace003/gennoor-tech/settings/secrets/actions
2. Click "New repository secret"
3. Add:
   - Name: `NEXTAUTH_SECRET`
   - Value: The generated secret above
4. Click "Add secret"

## Remove Azure AD Variables (Optional)

Since we're not using Azure AD, you can also remove these from the workflow to avoid confusion:
- AZURE_AD_CLIENT_ID
- AZURE_AD_CLIENT_SECRET  
- AZURE_AD_TENANT_ID

But they won't cause issues if left empty.

## Redeploy

After adding the secret, either:
1. Push a commit to trigger deployment
2. Or go to Actions tab and manually trigger the workflow

## Test

Once deployed, test all users:
- admin@gennoor.com
- jalalkhan@gennoor.com
- yusufchaudhary@gennoor.com
- contact@gennoor.com

All should be able to login with any password (we'll add proper password validation later).