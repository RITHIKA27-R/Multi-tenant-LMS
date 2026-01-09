# Multi-Tenant LMS Deployment Script
# This script helps deploy the application using Docker Compose

Write-Host "🚀 Multi-Tenant LMS Deployment Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✓ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not installed. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

try {
    docker-compose --version | Out-Null
    Write-Host "✓ Docker Compose is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker Compose is not installed. Please install Docker Compose." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Select deployment option:" -ForegroundColor Cyan
Write-Host "1. Start all services (fresh deployment)"
Write-Host "2. Stop all services"
Write-Host "3. Restart all services"
Write-Host "4. View logs"
Write-Host "5. Check service status"
Write-Host "6. Clean up (remove containers and volumes)"
Write-Host ""

$choice = Read-Host "Enter your choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Starting all services..." -ForegroundColor Yellow
        Write-Host "This may take a few minutes on first run..." -ForegroundColor Yellow
        Write-Host ""
        
        # Build and start services
        docker-compose up -d --build
        
        Write-Host ""
        Write-Host "✓ Services started successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Access points:" -ForegroundColor Cyan
        Write-Host "  Frontend:           http://localhost" -ForegroundColor White
        Write-Host "  API Gateway:        http://localhost:8080" -ForegroundColor White
        Write-Host "  Eureka Dashboard:   http://localhost:8761" -ForegroundColor White
        Write-Host ""
        Write-Host "Demo Accounts:" -ForegroundColor Cyan
        Write-Host "  Super Admin:  superadmin@lms.com / password" -ForegroundColor White
        Write-Host "  Tenant Admin: alice@acme.com / password" -ForegroundColor White
        Write-Host "  Learner:      bob@beta.com / password" -ForegroundColor White
        Write-Host ""
        Write-Host "To view logs, run: docker-compose logs -f" -ForegroundColor Yellow
    }
    
    "2" {
        Write-Host ""
        Write-Host "Stopping all services..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✓ All services stopped" -ForegroundColor Green
    }
    
    "3" {
        Write-Host ""
        Write-Host "Restarting all services..." -ForegroundColor Yellow
        docker-compose restart
        Write-Host "✓ All services restarted" -ForegroundColor Green
    }
    
    "4" {
        Write-Host ""
        Write-Host "Showing logs (press Ctrl+C to exit)..." -ForegroundColor Yellow
        docker-compose logs -f
    }
    
    "5" {
        Write-Host ""
        Write-Host "Service Status:" -ForegroundColor Cyan
        docker-compose ps
    }
    
    "6" {
        Write-Host ""
        Write-Host "WARNING: This will remove all containers and volumes!" -ForegroundColor Red
        $confirm = Read-Host "Are you sure? (yes/no)"
        
        if ($confirm -eq "yes") {
            Write-Host "Cleaning up..." -ForegroundColor Yellow
            docker-compose down -v
            Write-Host "✓ Cleanup completed" -ForegroundColor Green
        } else {
            Write-Host "Cleanup cancelled" -ForegroundColor Yellow
        }
    }
    
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Done! 🎉" -ForegroundColor Green
