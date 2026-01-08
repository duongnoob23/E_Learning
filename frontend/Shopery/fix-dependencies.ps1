# Script to fix package-lock.json sync issue
# Run this script from the frontend/Shopery directory

Write-Host "🔧 Fixing package-lock.json sync issue..." -ForegroundColor Cyan

# Step 1: Remove old files
Write-Host "`n📦 Step 1: Removing node_modules and package-lock.json..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ Removed node_modules" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✅ Removed package-lock.json" -ForegroundColor Green
}

# Step 2: Install dependencies
Write-Host "`n📥 Step 2: Installing dependencies with npm install..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully installed dependencies!" -ForegroundColor Green
    
    # Step 3: Verify React version
    Write-Host "`n🔍 Step 3: Verifying React version..." -ForegroundColor Yellow
    npm ls react react-dom
    
    Write-Host "`n✨ Done! Now you can commit and push:" -ForegroundColor Cyan
    Write-Host "   git add package.json package-lock.json" -ForegroundColor White
    Write-Host "   git commit -m 'fix: downgrade React to 18.3.1 for react-quill compatibility'" -ForegroundColor White
    Write-Host "   git push" -ForegroundColor White
} else {
    Write-Host "`n❌ npm install failed. Please check the errors above." -ForegroundColor Red
    exit 1
}

