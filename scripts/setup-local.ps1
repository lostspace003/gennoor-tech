# PowerShell script to setup local development environment

Write-Host "🚀 Setting up Gennoor Lead Management System for Local Development" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "1. Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if ($?) {
    Write-Host "   ✅ Docker is running" -ForegroundColor Green
} else {
    Write-Host "   ❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Create .env.local if it doesn't exist
Write-Host ""
Write-Host "2. Setting up environment variables..." -ForegroundColor Yellow
if (!(Test-Path ".env.local")) {
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "   ✅ Created .env.local from template" -ForegroundColor Green
    Write-Host "   ⚠️  Please add your OPENAI_API_KEY to .env.local" -ForegroundColor Magenta
} else {
    Write-Host "   ✅ .env.local already exists" -ForegroundColor Green
}

# Start local services
Write-Host ""
Write-Host "3. Starting local services (PostgreSQL & Redis)..." -ForegroundColor Yellow
docker-compose -f docker-compose.local.yml up -d

# Wait for PostgreSQL to be ready
Write-Host ""
Write-Host "4. Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$maxRetries = 30
$retries = 0
while ($retries -lt $maxRetries) {
    $result = docker exec gennoor-postgres-local pg_isready -U postgres 2>$null
    if ($?) {
        Write-Host "   ✅ PostgreSQL is ready!" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 1
    $retries++
    Write-Host "   ⏳ Waiting for PostgreSQL... ($retries/$maxRetries)" -NoNewline -ForegroundColor Gray
    Write-Host "`r" -NoNewline
}

if ($retries -eq $maxRetries) {
    Write-Host "   ❌ PostgreSQL failed to start. Check Docker logs." -ForegroundColor Red
    exit 1
}

# Install npm dependencies
Write-Host ""
Write-Host "5. Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($?) {
    Write-Host "   ✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Display status
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✨ Local Development Environment Ready!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services running:" -ForegroundColor Yellow
Write-Host "  • PostgreSQL with pgvector: localhost:5432" -ForegroundColor White
Write-Host "  • Redis Cache: localhost:6379" -ForegroundColor White
Write-Host "  • Database Admin (Adminer): http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "Database credentials:" -ForegroundColor Yellow
Write-Host "  • Server: localhost:5432" -ForegroundColor White
Write-Host "  • Database: gennoor_leads" -ForegroundColor White
Write-Host "  • Username: postgres" -ForegroundColor White
Write-Host "  • Password: postgres" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Add your OPENAI_API_KEY to .env.local" -ForegroundColor White
Write-Host "  2. Run: npm run dev" -ForegroundColor Green
Write-Host "  3. Open: http://localhost:3000/admin/leads-v2" -ForegroundColor Green
Write-Host ""
Write-Host "To stop services later, run:" -ForegroundColor Yellow
Write-Host "  docker-compose -f docker-compose.local.yml down" -ForegroundColor White
Write-Host ""