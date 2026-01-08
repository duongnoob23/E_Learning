# Script để start Redis Portable
# Tải Redis từ: https://github.com/tporadowski/redis/releases
# Giải nén vào: C:\redis

$redisPath = "C:\redis\redis-server.exe"

Write-Host "🔍 Checking for Redis Portable..." -ForegroundColor Cyan

if (-not (Test-Path $redisPath)) {
    Write-Host ""
    Write-Host "❌ Redis not found at: $redisPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Please:" -ForegroundColor Yellow
    Write-Host "   1. Download Redis from: https://github.com/tporadowski/redis/releases" -ForegroundColor Yellow
    Write-Host "   2. Download: Redis-x64-5.0.14.1.zip (or latest version)" -ForegroundColor Yellow
    Write-Host "   3. Extract to: C:\redis" -ForegroundColor Yellow
    Write-Host "   4. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Kiểm tra xem đã chạy chưa
$process = Get-Process | Where-Object {
    $_.ProcessName -like "*redis-server*" -or 
    $_.Path -eq $redisPath
}

if ($process) {
    Write-Host "✅ Redis is already running (PID: $($process.Id))" -ForegroundColor Green
    Write-Host "📍 Port 6379 should be available" -ForegroundColor Green
    exit 0
}

# Start Redis
Write-Host ""
Write-Host "🚀 Starting Redis Portable..." -ForegroundColor Cyan
try {
    Start-Process -FilePath $redisPath -WindowStyle Minimized
    Start-Sleep -Seconds 2
    
    $process = Get-Process | Where-Object {$_.Path -eq $redisPath}
    if ($process) {
        Write-Host "✅ Redis started successfully (PID: $($process.Id))" -ForegroundColor Green
        Write-Host "📍 Redis is running on port 6379" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  Note: Keep this window open or Redis will stop" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️ Redis process started but not found. Please check manually." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to start Redis: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🧪 Testing connection..." -ForegroundColor Cyan
Start-Sleep -Seconds 1

try {
    $test = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue
    if ($test.TcpTestSucceeded) {
        Write-Host "✅ Redis is accessible on port 6379!" -ForegroundColor Green
        Write-Host ""
        Write-Host "💡 Now you can start your backend server:" -ForegroundColor Yellow
        Write-Host "   npm run dev" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️ Port 6379 is not accessible yet. Wait a few seconds and try again." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Could not test connection: $_" -ForegroundColor Yellow
}

