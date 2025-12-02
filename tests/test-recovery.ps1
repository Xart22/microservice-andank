Write-Host "--- Mengukur Recovery Time (Pemeliharaan Service) ---" -ForegroundColor Cyan

# 1. Pastikan mati dulu (Biar adil)
docker stop pemeliharaan-service
Start-Sleep -Seconds 2

# 2. Nyalakan dan catat waktu start
$startTime = Get-Date
docker start pemeliharaan-service
Write-Host "Container dinyalakan. Menunggu service ready..."

# 3. Ping ke endpoint /health (Sesuai server.ts bapak)
# Kita loop terus sampai statusnya 200 OK
do {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3002/health" -Method Get -ErrorAction SilentlyContinue
        $statusCode = $response.StatusCode
    } catch {
        $statusCode = 0
    }
    # Cek setiap 200ms agar presisi
    Start-Sleep -Milliseconds 200
} while ($statusCode -ne 200)

$endTime = Get-Date
$duration = ($endTime - $startTime).TotalSeconds

Write-Host "----------------------------------------------------"
Write-Host "SUKSES! Service Pulih (200 OK)." -ForegroundColor Green
Write-Host "Recovery Time: $duration detik" -ForegroundColor Yellow
Write-Host "----------------------------------------------------"