# Script untuk debug Combined PDF Generation
# Usage: .\debug-pdf.ps1

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "   DEBUG COMBINED PDF LOGS" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$logFile = "d:\laragon\www\SmartPlan-Web\backend\storage\logs\laravel.log"

if (Test-Path $logFile) {
    Write-Host "📋 Monitoring log file..." -ForegroundColor Green
    Write-Host "File: $logFile" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""

    Get-Content $logFile -Wait -Tail 100 | Where-Object {
        $_ -match 'Combined|Step \d+|Business Plan|Financial|📊|💰|📈|✅|❌|⚠️|🔍|📁|📦|📢|⚙️|👥|💼|📅|🏢|📄|🔍'
    }
} else {
    Write-Host "❌ Log file not found: $logFile" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pastikan aplikasi Laravel sudah berjalan!" -ForegroundColor Yellow
}
