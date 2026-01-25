#!/bin/bash

# Multi-Tenant LMS - Docker Deployment Script
# This script helps deploy the entire application using Docker Compose

set -e

echo "=== Multi-Tenant LMS Docker Deployment ==="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running. Please start Docker Desktop.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker is running${NC}"
}

# Function to check if ports are available
check_ports() {
    echo "Checking if required ports are available..."
    ports=(80 3306 8080 8081 8082 8083 8084 8085 8086 8761)
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "${YELLOW}Warning: Port $port is already in use${NC}"
        fi
    done
}

# Function to build services
build_services() {
    echo ""
    echo "Building Docker images..."
    docker compose build --parallel
    echo -e "${GREEN}✓ All services built successfully${NC}"
}

# Function to start services
start_services() {
    echo ""
    echo "Starting all services..."
    docker compose up -d
    echo -e "${GREEN}✓ All services started${NC}"
}

# Function to check service health
check_health() {
    echo ""
    echo "Checking service health..."
    sleep 10
    
    # Check MySQL
    if docker compose ps mysql-db | grep -q "healthy"; then
        echo -e "${GREEN}✓ MySQL is healthy${NC}"
    else
        echo -e "${YELLOW}⚠ MySQL is starting...${NC}"
    fi
    
    # Check Discovery Server
    if curl -f http://localhost:8761/actuator/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Discovery Server is healthy${NC}"
    else
        echo -e "${YELLOW}⚠ Discovery Server is starting...${NC}"
    fi
    
    # Check API Gateway
    if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ API Gateway is healthy${NC}"
    else
        echo -e "${YELLOW}⚠ API Gateway is starting...${NC}"
    fi
}

# Function to show service URLs
show_urls() {
    echo ""
    echo "=== Service URLs ==="
    echo "Frontend:          http://localhost"
    echo "API Gateway:       http://localhost:8080"
    echo "Discovery Server:  http://localhost:8761"
    echo "User Service:      http://localhost:8081"
    echo "Course Service:    http://localhost:8082"
    echo "Assessment Service: http://localhost:8083"
    echo ""
    echo "Database: localhost:3306 (root/root123)"
    echo ""
}

# Function to show logs
show_logs() {
    echo ""
    echo "Showing logs (Ctrl+C to exit)..."
    docker compose logs -f
}

# Function to stop services
stop_services() {
    echo ""
    echo "Stopping all services..."
    docker compose down
    echo -e "${GREEN}✓ All services stopped${NC}"
}

# Function to clean up
cleanup() {
    echo ""
    echo "Cleaning up (removing containers, networks, and volumes)..."
    docker compose down -v
    echo -e "${GREEN}✓ Cleanup complete${NC}"
}

# Main menu
show_menu() {
    echo ""
    echo "Select an option:"
    echo "1) Deploy (Build & Start all services)"
    echo "2) Start services"
    echo "3) Stop services"
    echo "4) Restart services"
    echo "5) View logs"
    echo "6) Check status"
    echo "7) Clean up (Stop & Remove all)"
    echo "8) Exit"
    echo ""
    read -p "Enter choice [1-8]: " choice
    echo ""
}

# Main script
check_docker

case "${1}" in
    deploy)
        build_services
        start_services
        check_health
        show_urls
        ;;
    start)
        start_services
        check_health
        show_urls
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        start_services
        check_health
        ;;
    logs)
        show_logs
        ;;
    status)
        docker compose ps
        ;;
    clean)
        cleanup
        ;;
    *)
        while true; do
            show_menu
            case $choice in
                1)
                    build_services
                    start_services
                    check_health
                    show_urls
                    ;;
                2)
                    start_services
                    check_health
                    show_urls
                    ;;
                3)
                    stop_services
                    ;;
                4)
                    stop_services
                    start_services
                    check_health
                    ;;
                5)
                    show_logs
                    ;;
                6)
                    docker compose ps
                    ;;
                7)
                    cleanup
                    ;;
                8)
                    echo "Exiting..."
                    exit 0
                    ;;
                *)
                    echo -e "${RED}Invalid option${NC}"
                    ;;
            esac
        done
        ;;
esac
