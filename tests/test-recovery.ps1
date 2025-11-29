Write-Host "--- Memulai Uji Recovery Time ---" -ForegroundColor Cyan

# 1. Pastikan mati dulu
docker stop tj-pemeliharaan
Start-Sleep -Seconds 2

# 2. Nyalakan dan catat waktu start
$startTime = Get-Date
docker start tj-pemeliharaan
Write-Host "Container dinyalakan. Menunggu service ready..."

# 3. Loop ping sampai 200 OK
do {
    try {
        # Cek health check (Port 3002)
        $response = Invoke-WebRequest -Uri "http://localhost:3002/health" -Method Get -ErrorAction SilentlyContinue
        $statusCode = $response.StatusCode
    } catch {
        $statusCode = 0
    }
    # Cek setiap 200ms agar akurat
    Start-Sleep -Milliseconds 200
} while ($statusCode -ne 200)

$endTime = Get-Date
$duration = ($endTime - $startTime).TotalSeconds

Write-Host "------------------------------------------------"
Write-Host "SUKSES! Service Pulih." -ForegroundColor Green
Write-Host "Recovery Time: $duration detik" -ForegroundColor Yellow
Write-Host "------------------------------------------------"

