# Script để start Redis/Memurai thủ công
# Chạy: .\start-redis.ps1

Write-Host "🔍 Checking for Redis/Memurai..." -ForegroundColor Cyan

# Kiểm tra các vị trí có thể có Memurai
$possiblePaths = @(
    "C:\Program Files\Memurai\memurai.exe",
    "C:\Program Files (x86)\Memurai\memurai.exe",
    "$env:LOCALAPPDATA\Memurai\memurai.exe",
    "$env:ProgramFiles\Memurai\memurai.exe"
)

$memuraiPath = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $memuraiPath = $path
        Write-Host "✅ Found Memurai at: $path" -ForegroundColor Green
        break
    }
}

if (-not $memuraiPath) {
    Write-Host ""
    Write-Host "❌ Memurai not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Please install Memurai:" -ForegroundColor Yellow
    Write-Host "   1. Download from: https://www.memurai.com/get-memurai" -ForegroundColor Yellow
    Write-Host "   2. Run the .msi installer" -ForegroundColor Yellow
    Write-Host "   3. Make sure to check 'Install as Windows Service'" -ForegroundColor Yellow
    Write-Host "   4. Complete the installation" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or use WSL2 if you have it installed." -ForegroundColor Yellow
    exit 1
}

# Kiểm tra xem đã chạy chưa
$process = Get-Process | Where-Object {$_.ProcessName -like "*memurai*" -or $_.Path -eq $memuraiPath}
if ($process) {
    Write-Host "✅ Memurai is already running (PID: $($process.Id))" -ForegroundColor Green
    Write-Host "📍 Port 6379 should be available" -ForegroundColor Green
    exit 0
}

# Start Memurai
Write-Host ""
Write-Host "🚀 Starting Memurai..." -ForegroundColor Cyan
try {
    Start-Process -FilePath $memuraiPath -WindowStyle Hidden
    Start-Sleep -Seconds 2
    
    $process = Get-Process | Where-Object {$_.Path -eq $memuraiPath}
    if ($process) {
        Write-Host "✅ Memurai started successfully (PID: $($process.Id))" -ForegroundColor Green
        Write-Host "📍 Redis should be available on port 6379" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Memurai process started but not found. Please check manually." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to start Memurai: $_" -ForegroundColor Red
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

