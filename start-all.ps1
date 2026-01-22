# 🚀 Multi-Tenant LMS - One-Click Start Script

Write-Host "--- Starting Eureka Discovery Server ---" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "mvn -pl discovery-server spring-boot:run"

# Wait for Eureka to initialize (usually 10-15 seconds)
$waitSecs = 15
Write-Host "Waiting $waitSecs seconds for Discovery Server to be ready..."
Start-Sleep -s $waitSecs

Write-Host "--- Starting Microservices ---" -ForegroundColor Cyan

# Start Core Services
Write-Host "Launching User Service..."
Start-Process powershell -ArgumentList "mvn -pl user-service spring-boot:run"

Write-Host "Launching API Gateway..."
Start-Process powershell -ArgumentList "mvn -pl api-gateway spring-boot:run"

Start-Sleep -s 5

# Start Other Services
Write-Host "Launching Course Service..."
Start-Process powershell -ArgumentList "mvn -pl course-service spring-boot:run"

Write-Host "Launching Assessment Service..."
Start-Process powershell -ArgumentList "mvn -pl assessment-service spring-boot:run"

Write-Host "--- All background services have been launched! ---" -ForegroundColor Green
Write-Host "1. Eureka Dashboard: http://localhost:8761"
Write-Host "2. API Gateway: http://localhost:8080"
Write-Host "3. Check your windows to see individual logs."
