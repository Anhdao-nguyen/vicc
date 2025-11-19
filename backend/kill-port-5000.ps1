# PowerShell script to kill process using port 5000
Write-Host "🔍 Checking for process using port 5000..." -ForegroundColor Yellow

$port = 5000
$processInfo = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($processInfo) {
    $processId = $processInfo.OwningProcess
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue

    if ($process) {
        Write-Host "❌ Found process using port $port" -ForegroundColor Red
        Write-Host "   Process: $($process.ProcessName)" -ForegroundColor Cyan
        Write-Host "   PID: $processId" -ForegroundColor Cyan

        $confirmation = Read-Host "Do you want to kill this process? (y/n)"

        if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
            Stop-Process -Id $processId -Force
            Write-Host "✅ Process killed successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Process NOT killed. Please manually stop it." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "✅ Port $port is free!" -ForegroundColor Green
}

Write-Host "`n📝 You can now run: npm run dev" -ForegroundColor Cyan
