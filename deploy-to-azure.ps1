# PowerShell Script to Deploy Gennoor Lead Management to Azure

Write-Host "🚀 Deploying Gennoor Lead Management System to Azure" -ForegroundColor Cyan

# Variables
$resourceGroup = "gennoor-leads-rg"
$location = "centralindia"
$appName = "gennoor-leads"
$planName = "gennoor-leads-plan"
$dbName = "gennoor-leads-db"

# Login to Azure
Write-Host "1. Logging in to Azure..." -ForegroundColor Yellow
az login

# Create Resource Group
Write-Host "2. Creating Resource Group..." -ForegroundColor Yellow
az group create --name $resourceGroup --location $location

# Create App Service Plan
Write-Host "3. Creating App Service Plan..." -ForegroundColor Yellow
az appservice plan create `
  --name $planName `
  --resource-group $resourceGroup `
  --location $location `
  --sku B2 `
  --is-linux

# Create Web App
Write-Host "4. Creating Web App..." -ForegroundColor Yellow
az webapp create `
  --name $appName `
  --resource-group $resourceGroup `
  --plan $planName `
  --runtime "NODE:20-lts"

# Configure App Settings
Write-Host "5. Configuring App Settings..." -ForegroundColor Yellow
az webapp config appsettings set `
  --resource-group $resourceGroup `
  --name $appName `
  --settings `
    NODE_ENV=production `
    NEXTAUTH_URL="https://$appName.azurewebsites.net" `
    NEXTAUTH_SECRET="gennoor-secret-2024-change-in-production" `
    AUTHORIZED_EMAILS="admin@gennoor.com,contact@gennoor.com,yusufchaudhary@gennoor.com,jalalkhan@gennoor.com"

# Build the application
Write-Host "6. Building Next.js application..." -ForegroundColor Yellow
npm run build

# Create deployment package
Write-Host "7. Creating deployment package..." -ForegroundColor Yellow
Compress-Archive -Path ".next", "public", "package.json", "package-lock.json", "next.config.ts" -DestinationPath "deploy.zip" -Force

# Deploy to Azure
Write-Host "8. Deploying to Azure..." -ForegroundColor Yellow
az webapp deployment source config-zip `
  --resource-group $resourceGroup `
  --name $appName `
  --src "deploy.zip"

# Enable Always On
Write-Host "9. Enabling Always On..." -ForegroundColor Yellow
az webapp config set `
  --resource-group $resourceGroup `
  --name $appName `
  --always-on true

# Get the URL
$url = "https://$appName.azurewebsites.net"

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your application is available at:" -ForegroundColor Cyan
Write-Host $url -ForegroundColor White
Write-Host ""
Write-Host "Admin Panel:" -ForegroundColor Cyan
Write-Host "$url/admin/leads-final" -ForegroundColor White
Write-Host ""
Write-Host "Login with any of these emails:" -ForegroundColor Yellow
Write-Host "  • admin@gennoor.com" -ForegroundColor White
Write-Host "  • contact@gennoor.com" -ForegroundColor White
Write-Host "  • yusufchaudhary@gennoor.com" -ForegroundColor White
Write-Host "  • jalalkhan@gennoor.com" -ForegroundColor White