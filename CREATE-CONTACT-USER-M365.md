# 📧 Create contact@gennoor.com in Microsoft 365

## 🔐 **STEP-BY-STEP GUIDE**

### **Option 1: Via Microsoft 365 Admin Center (Easiest)**

1. **Open:** https://admin.microsoft.com
2. **Login:** Use your admin@gennoor.com account
3. **Navigate:** Users → Active users
4. **Click:** "+ Add a user"
5. **Fill in:**
   ```
   First name: Contact
   Last name: Team
   Display name: Contact Team
   Username: contact
   Domain: @gennoor.com
   ```
6. **Password Options:**
   - ✅ Let me create the password
   - Password: **Gennoor@12345**
   - ✅ Make this user change password on first sign-in: **Uncheck**
7. **Click:** Next
8. **Assign Licenses:**
   - Select appropriate license (Microsoft 365 Business Basic minimum)
9. **Optional settings:** Skip
10. **Click:** Finish adding

---

### **Option 2: Via Azure Portal**

1. **Open:** https://portal.azure.com
2. **Login:** Use admin@gennoor.com
3. **Navigate:** Azure Active Directory → Users
4. **Click:** "+ New user" → "Create new user"
5. **User details:**
   ```
   User principal name: contact@gennoor.com
   Mail nickname: contact
   Display name: Contact Team
   Password: Gennoor@12345
   ```
6. **Properties:**
   ```
   First name: Contact
   Last name: Team
   Job title: Sales Team
   Department: Sales
   Usage location: India
   ```
7. **Groups:** Add to any relevant groups
8. **Roles:** User (no admin roles needed)
9. **Click:** Create

---

### **Option 3: Via PowerShell (For Admins)**

```powershell
# Install module if needed
Install-Module -Name AzureAD

# Connect to Azure AD
Connect-AzureAD -AccountId admin@gennoor.com

# Create password profile
$PasswordProfile = New-Object -TypeName Microsoft.Open.AzureAD.Model.PasswordProfile
$PasswordProfile.Password = "Gennoor@12345"
$PasswordProfile.ForceChangePasswordNextLogin = $false

# Create the user
New-AzureADUser `
    -DisplayName "Contact Team" `
    -GivenName "Contact" `
    -Surname "Team" `
    -UserPrincipalName "contact@gennoor.com" `
    -MailNickName "contact" `
    -PasswordProfile $PasswordProfile `
    -AccountEnabled $true `
    -UsageLocation "IN" `
    -JobTitle "Sales Team" `
    -Department "Sales"

# Assign license (replace with your license SKU)
$License = New-Object -TypeName Microsoft.Open.AzureAD.Model.AssignedLicense
$License.SkuId = (Get-AzureADSubscribedSku | Where-Object {$_.SkuPartNumber -eq "O365_BUSINESS_ESSENTIALS"}).SkuId
$LicensesToAssign = New-Object -TypeName Microsoft.Open.AzureAD.Model.AssignedLicenses
$LicensesToAssign.AddLicenses = $License

Set-AzureADUserLicense -ObjectId "contact@gennoor.com" -AssignedLicenses $LicensesToAssign
```

---

## ✅ **After Creating the User**

### **1. Verify User Creation:**
- Go to https://admin.microsoft.com → Users
- Search for "contact@gennoor.com"
- Ensure status shows "Active"

### **2. Test Login:**
1. Open incognito/private browser
2. Go to: https://gennoor-tech.azurewebsites.net/admin/login
3. Click "Sign in with Microsoft"
4. Enter: contact@gennoor.com
5. Password: Gennoor@12345
6. Complete any first-time setup if prompted

### **3. Grant CRM Access:**
The user is already authorized in the code for:
- View leads ✅
- Research leads ✅
- Send emails ✅
- Cannot upload/delete (admin only) ✅

---

## 📝 **Important Notes**

- **License Required:** User needs at least Microsoft 365 Business Basic license
- **First Login:** May need to accept terms or set up MFA
- **Password Policy:** Ensure password meets your org's complexity requirements
- **Email Delivery:** User will have a real mailbox at contact@gennoor.com

---

## 🔧 **Troubleshooting**

| Issue | Solution |
|-------|----------|
| "User already exists" | Check deleted users, restore if needed |
| "Password doesn't meet requirements" | Use stronger password with symbols |
| "No licenses available" | Purchase additional license or reassign |
| "Can't login to CRM" | Wait 5-10 mins for sync, clear browser cache |

---

## 📧 **Final User Details**

```yaml
Email: contact@gennoor.com
Password: Gennoor@12345
Display Name: Contact Team
Department: Sales
CRM Access: Limited (no upload/delete)
Email CC: All CRM emails CC to admin@gennoor.com
```

---

*Once created, the user can immediately login to the CRM using Microsoft authentication.*