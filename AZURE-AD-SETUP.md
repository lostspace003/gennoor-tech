# 🔐 Azure AD (Entra ID) Setup for CRM Authentication

## ✅ **Current Users in Azure AD:**
- admin@gennoor.com ✅
- yusufchaudhary@gennoor.com ✅
- jalalkhan@gennoor.com ✅
- contact@gennoor.com ❌ (Needs to be added)

---

## 📋 **STEP 1: Add contact@gennoor.com to Azure AD**

### Via Azure Portal:
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **Users**
3. Click **+ New user** → **Create new user**
4. Fill in:
   - **User principal name:** contact@gennoor.com
   - **Display name:** Contact Team
   - **Password:** Gennoor@12345
   - **First name:** Contact
   - **Last name:** Team
5. Under **Settings**:
   - Usage location: India
   - Job title: Sales Team
6. Click **Create**

### Via PowerShell (Admin):
```powershell
# Connect to Azure AD
Connect-AzureAD

# Create new user
$PasswordProfile = New-Object -TypeName Microsoft.Open.AzureAD.Model.PasswordProfile
$PasswordProfile.Password = "Gennoor@12345"
$PasswordProfile.ForceChangePasswordNextLogin = $false

New-AzureADUser -DisplayName "Contact Team" `
                -PasswordProfile $PasswordProfile `
                -UserPrincipalName "contact@gennoor.com" `
                -AccountEnabled $true `
                -MailNickName "contact" `
                -UsageLocation "IN"
```

---

## 📋 **STEP 2: Configure GitHub Secrets**

Go to your GitHub repository → Settings → Secrets and add:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `AZURE_AD_CLIENT_ID` | Your App Client ID | From Azure AD App Registration |
| `AZURE_AD_CLIENT_SECRET` | Your Client Secret | From Azure AD App Registration |
| `AZURE_AD_TENANT_ID` | Your Tenant ID | Your Azure AD Tenant ID |
| `NEXTAUTH_SECRET` | Random 32+ char string | Generate with: `openssl rand -base64 32` |
| `AZURE_CREDENTIALS` | JSON credentials | For Azure deployment |

---

## 📋 **STEP 3: Azure AD App Registration**

### If not already done:
1. Go to **Azure AD** → **App registrations**
2. Click **New registration**
3. Name: `Gennoor CRM`
4. Supported account types: **Single tenant**
5. Redirect URI: 
   - Platform: **Web**
   - URL: `https://gennoor-tech.azurewebsites.net/api/auth/callback/microsoft-entra-id`
6. Click **Register**

### Configure App:
1. Go to **Certificates & secrets** → **New client secret**
2. Description: `CRM Auth`
3. Expires: **24 months**
4. Copy the secret value → Add to GitHub Secrets as `AZURE_AD_CLIENT_SECRET`

### API Permissions:
1. Go to **API permissions**
2. Ensure these are granted:
   - `User.Read`
   - `email`
   - `profile`
   - `openid`

### Authentication:
1. Go to **Authentication**
2. Add redirect URIs:
   ```
   https://gennoor-tech.azurewebsites.net/api/auth/callback/microsoft-entra-id
   http://localhost:3000/api/auth/callback/microsoft-entra-id
   ```
3. Enable **ID tokens** and **Access tokens**

---

## 📋 **STEP 4: Update Application Settings in Azure**

In Azure Portal → App Service → Configuration → Application Settings:

```bash
AZURE_AD_CLIENT_ID = <your-client-id>
AZURE_AD_CLIENT_SECRET = <your-client-secret>
AZURE_AD_TENANT_ID = <your-tenant-id>
NEXTAUTH_URL = https://gennoor-tech.azurewebsites.net
NEXTAUTH_SECRET = <your-nextauth-secret>
NODE_ENV = production
```

---

## 🔑 **User Login Credentials**

| User | Email | Password | Method |
|------|-------|----------|--------|
| Admin | admin@gennoor.com | (Azure AD password) | Microsoft Login |
| Contact | contact@gennoor.com | Gennoor@12345 | Microsoft Login |
| Yusuf | yusufchaudhary@gennoor.com | (Azure AD password) | Microsoft Login |
| Jalal | jalalkhan@gennoor.com | (Azure AD password) | Microsoft Login |

---

## 🌐 **Login Process**

1. Navigate to: https://gennoor-tech.azurewebsites.net/admin/login
2. Click **"Sign in with Microsoft"**
3. Enter Azure AD credentials
4. Grant permissions (first time only)
5. Redirected to CRM dashboard

---

## 🔧 **Fallback (if Azure AD not configured)**

The system will automatically fall back to simple email authentication if Azure AD environment variables are not set. In this case:
- Users can login with their email and ANY password
- This is only for development/testing

---

## ✅ **Verification Steps**

1. **Test Azure AD Login:**
   ```bash
   curl -X GET "https://gennoor-tech.azurewebsites.net/api/auth/providers"
   ```
   Should show: `{"microsoft-entra-id": {...}}`

2. **Test User Access:**
   - Login as contact@gennoor.com
   - Verify CRM access
   - Check restrictions (no upload/delete)

3. **Check Logs:**
   - Azure Portal → App Service → Log stream
   - Look for authentication events

---

## 📝 **Important Notes**

- **First login:** Users may need to accept permissions
- **Password reset:** Done via Azure AD portal
- **MFA:** Can be enabled per user in Azure AD
- **Session timeout:** 24 hours (configured in auth.ts)
- **CC Email:** All CRM emails still CC to admin@gennoor.com

---

## 🚨 **Troubleshooting**

| Issue | Solution |
|-------|----------|
| "Sign in with Microsoft" not showing | Check AZURE_AD_CLIENT_ID is set |
| Invalid redirect URI | Add URL to App Registration |
| User not authorized | Add email to allowed users |
| Token expired | Clear cookies, login again |
| 500 error on login | Check client secret is valid |

---

*Last Updated: July 24, 2026*
*For support: admin@gennoor.com*