# Azure AD/Entra ID Setup for CRM Authentication

## Required GitHub Secrets

You need to set these in GitHub Secrets for Azure AD authentication to work:

1. **AZURE_AD_CLIENT_ID** - Your app registration client ID
2. **AZURE_AD_CLIENT_SECRET** - Your app registration client secret  
3. **AZURE_AD_TENANT_ID** - Your Azure tenant ID

## Steps to Configure

### 1. Create App Registration in Azure Portal

1. Go to Azure Portal → Azure Active Directory
2. Navigate to "App registrations" → "New registration"
3. Set:
   - Name: `Gennoor CRM`
   - Supported account types: "Accounts in this organizational directory only"
   - Redirect URI: `https://gennoor-tech.azurewebsites.net/api/auth/callback/microsoft-entra-id`

### 2. Configure App Registration

1. Go to "Authentication" section
   - Add platform: Web
   - Redirect URIs: 
     - `https://gennoor-tech.azurewebsites.net/api/auth/callback/microsoft-entra-id`
     - `http://localhost:3000/api/auth/callback/microsoft-entra-id` (for local testing)
   - Enable "ID tokens"

2. Go to "Certificates & secrets"
   - New client secret
   - Description: "CRM Auth"
   - Copy the secret value immediately (shown only once)

3. Go to "API permissions"
   - Should have: `User.Read` (default)
   - Add if needed: `email`, `profile`, `openid`

### 3. Add Secrets to GitHub

```bash
# Set the secrets using GitHub CLI
gh secret set AZURE_AD_CLIENT_ID --body "your-client-id-here" --repo lostspace003/gennoor-tech
gh secret set AZURE_AD_CLIENT_SECRET --body "your-client-secret-here" --repo lostspace003/gennoor-tech  
gh secret set AZURE_AD_TENANT_ID --body "your-tenant-id-here" --repo lostspace003/gennoor-tech
```

### 4. Authorized Users

Only these emails can login (configured in code):
- admin@gennoor.com
- jalalkhan@gennoor.com
- yusufchaudhary@gennoor.com
- contact@gennoor.com

These users must exist in your Azure AD/Entra ID directory.

### 5. Test

After deployment:
1. Go to https://gennoor-tech.azurewebsites.net/admin/login
2. Click "Sign in with Microsoft Entra ID"
3. Login with your Microsoft account
4. If authorized, you'll be redirected to CRM

## Benefits

- No passwords to share or manage
- Users login with their Microsoft accounts
- Secure OAuth 2.0 flow
- Single Sign-On (SSO) capability
- Centralized user management in Azure AD