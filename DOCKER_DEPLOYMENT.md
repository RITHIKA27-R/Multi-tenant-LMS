# Multi-Tenant LMS - Docker Deployment Guide

## Prerequisites
- Docker Desktop installed and running
- At least 8GB RAM allocated to Docker
- Ports 80, 3306, 8080-8086, 8761 available

## Quick Start

### 1. Start All Services
```bash
docker-compose up -d
```

### 2. Check Service Status
```bash
docker-compose ps
```

### 3. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service
docker-compose logs -f api-gateway
docker-compose logs -f frontend
```

### 4. Stop All Services
```bash
docker-compose down
```

### 5. Stop and Remove Volumes (Clean Start)
```bash
docker-compose down -v
```

## Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost | React UI |
| API Gateway | http://localhost:8080 | Main API entry point |
| User Service | http://localhost:8081 | User management |
| Course Service | http://localhost:8082 | Course management |
| Assessment Service | http://localhost:8083 | Assessments/Quizzes |
| Notification Service | http://localhost:8084 | Notifications |
| Attendance Service | http://localhost:8085 | Attendance tracking |
| Leave Service | http://localhost:8086 | Leave management |
| Discovery Server | http://localhost:8761 | Eureka dashboard |
| MySQL | localhost:3306 | Database (root/root123) |

## Building Services

### Build All Services
```bash
docker-compose build
```

### Build Specific Service
```bash
docker-compose build user-service
```

### Build Without Cache
```bash
docker-compose build --no-cache
```

## Troubleshooting

### Service Won't Start
1. Check logs: `docker-compose logs [service-name]`
2. Ensure MySQL is healthy: `docker-compose ps mysql-db`
3. Wait for Discovery Server: `docker-compose logs discovery-server`

### Database Connection Issues
```bash
# Restart MySQL
docker-compose restart mysql-db

# Check MySQL logs
docker-compose logs mysql-db
```

### Port Conflicts
If ports are already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "NEW_PORT:8080"  # Change NEW_PORT to available port
```

### Reset Everything
```bash
# Stop all services
docker-compose down

# Remove all volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Rebuild and start
docker-compose up -d --build
```

## Development Workflow

### 1. Make Code Changes
Edit your service code as needed.

### 2. Rebuild Service
```bash
# Stop the service
docker-compose stop user-service

# Rebuild
docker-compose build user-service

# Start
docker-compose up -d user-service
```

### 3. View Real-time Logs
```bash
docker-compose logs -f user-service
```

## Production Deployment

### Update Environment Variables
Create `.env` file:
```env
MYSQL_ROOT_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
SPRING_PROFILES_ACTIVE=prod
```

### Run in Production Mode
```bash
docker-compose --env-file .env up -d
```

## Monitoring

### Check Resource Usage
```bash
docker stats
```

### Inspect Service
```bash
docker inspect lms-user-service
```

### Execute Commands Inside Container
```bash
docker exec -it lms-user-service sh
```

## Backup & Restore

### Backup Database
```bash
docker exec lms-mysql mysqldump -uroot -proot123 --all-databases > backup.sql
```

### Restore Database
```bash
docker exec -i lms-mysql mysql -uroot -proot123 < backup.sql
```

## Network Configuration

All services are connected via `lms-network` bridge network.

### View Network
```bash
docker network inspect lms-network
```

## Health Checks

Services include health checks:
- **MySQL**: Runs `mysqladmin ping`
- **Discovery Server**: Checks `/actuator/health`
- **API Gateway**: Checks `/actuator/health`

View health status:
```bash
docker-compose ps
```

## Scaling Services

```bash
# Scale a service to multiple instances
docker-compose up -d --scale user-service=3
```

## Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Restart services
docker-compose restart

# Remove stopped containers
docker-compose rm

# Pull latest images
docker-compose pull

# Show running containers
docker-compose ps

# Show logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Execute command in service
docker-compose exec user-service sh
```

## Service Dependencies

```
mysql-db → discovery-server → api-gateway → frontend
         ↓
         └─→ user-service
         ↓
         └─→ course-service
         ↓
         └─→ assessment-service
         ↓
         └─→ notification-service
         ↓
         └─→ attendance-service
         ↓
         └─→ leave-service
```

## Default Credentials

### MySQL
- **Username**: root
- **Password**: root123

### Application
- **Super Admin**: superadmin@lms.com / superpassword
- **Tenant Admin**: tenant@gmail.com / password
- **Learner**: learner@lms.com / password

## Support

For issues or questions:
1. Check service logs: `docker-compose logs [service]`
2. Verify Eureka dashboard: http://localhost:8761
3. Check API Gateway health: http://localhost:8080/actuator/health
