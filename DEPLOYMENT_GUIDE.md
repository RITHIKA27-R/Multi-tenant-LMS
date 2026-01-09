# 🚀 Multi-Tenant LMS Deployment Guide

This guide provides multiple deployment options for your Multi-Tenant Learning Management System.

## 📋 Table of Contents
1. [Local Development Deployment](#1-local-development-deployment)
2. [Docker Deployment](#2-docker-deployment)
3. [Kubernetes Deployment](#3-kubernetes-deployment)
4. [Production Deployment (Cloud)](#4-production-deployment-cloud)

---

## Prerequisites

### Required Software
- **Java 17+** - For Spring Boot backend
- **Maven 3.8+** - For building backend services
- **Node.js 18+** - For React frontend
- **Docker** (optional) - For containerized deployment
- **kubectl** (optional) - For Kubernetes deployment
- **MySQL 8.0** - For production database

### Environment Variables
Before deploying, ensure these are configured:
```powershell
# Database
$env:MYSQL_HOST = "localhost"
$env:MYSQL_PORT = "3306"
$env:MYSQL_ROOT_PASSWORD = "root"

# JWT Secret (change in production!)
$env:JWT_SECRET = "your-secure-secret-key-minimum-256-bits"

# Application Profile
$env:SPRING_PROFILES_ACTIVE = "prod"
```

---

## 1. Local Development Deployment

### Step 1: Build All Backend Services

```powershell
# Navigate to project root
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"

# Clean and build all services
mvn clean install -DskipTests
```

### Step 2: Start MySQL Database

**Option A: Local MySQL Installation**
```powershell
# Start MySQL service
Start-Service MySQL80

# Create databases
mysql -u root -p
```
```sql
CREATE DATABASE IF NOT EXISTS lms_user_db;
CREATE DATABASE IF NOT EXISTS lms_course_db;
CREATE DATABASE IF NOT EXISTS lms_assessment_db;
CREATE DATABASE IF NOT EXISTS lms_notification_db;
CREATE DATABASE IF NOT EXISTS lms_attendance_db;
CREATE DATABASE IF NOT EXISTS lms_leave_db;
```

**Option B: Docker MySQL**
```powershell
docker run -d `
  --name lms-mysql `
  -p 3306:3306 `
  -e MYSQL_ROOT_PASSWORD=root `
  mysql:8.0
```

### Step 3: Start Backend Services (in order)

**Terminal 1: Discovery Server (Eureka)**
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
mvn spring-boot:run -pl discovery-server
```
Wait for: `Tomcat started on port(s): 8761`

**Terminal 2: API Gateway**
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
mvn spring-boot:run -pl api-gateway
```
Wait for: `Tomcat started on port(s): 8080`

**Terminal 3: User Service**
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
mvn spring-boot:run -pl user-service
```

**Terminal 4: Course Service**
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
mvn spring-boot:run -pl course-service
```

**Terminal 5: Assessment Service**
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
mvn spring-boot:run -pl assessment-service
```

**Terminal 6: Notification Service**
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
mvn spring-boot:run -pl notification-service
```

**Terminal 7: Attendance Service**
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
mvn spring-boot:run -pl attendance-service
```

**Terminal 8: Leave Service**
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
mvn spring-boot:run -pl leave-service
```

### Step 4: Build and Start Frontend

```powershell
# Navigate to React frontend
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms\frontend-react"

# Install dependencies (first time only)
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

**For Development:**
```powershell
# Start dev server with hot reload
npm run dev
```

### Step 5: Verify Deployment

1. **Check Eureka Dashboard**: http://localhost:8761
   - All services should be registered

2. **Check API Gateway**: http://localhost:8080/actuator/health
   - Should return: `{"status":"UP"}`

3. **Check Frontend**: http://localhost:5173 (dev) or http://localhost:4173 (preview)

4. **Test Login**:
   - Super Admin: `superadmin@lms.com` / `password`
   - Tenant Admin: `alice@acme.com` / `password`
   - Learner: `bob@beta.com` / `password`

---

## 2. Docker Deployment

Docker provides a simplified deployment with all services containerized.

### Step 1: Ensure Docker is Running

```powershell
docker --version
docker-compose --version
```

### Step 2: Build Docker Images

```powershell
# Navigate to project root
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"

# Build all services
docker-compose build
```

This will build Docker images for:
- discovery-server
- api-gateway
- user-service
- course-service
- assessment-service
- notification-service
- attendance-service
- leave-service

### Step 3: Start All Services

```powershell
# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

### Step 4: Build and Serve Frontend

**Option A: Add Frontend to Docker Compose**
(You may want to add this to docker-compose.yml)

**Option B: Serve Separately**
```powershell
cd frontend-react
npm install
npm run build
npm run preview
```

### Step 5: Verify Docker Deployment

```powershell
# Check running containers
docker-compose ps

# Check specific service logs
docker-compose logs user-service
docker-compose logs api-gateway

# Access services
# Eureka: http://localhost:8761
# API Gateway: http://localhost:8080
# Frontend: http://localhost:5173 or 4173
```

### Step 6: Stop Services

```powershell
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## 3. Kubernetes Deployment

For production-grade orchestration with auto-scaling and self-healing.

### Prerequisites
- **Kubernetes cluster** (Minikube, Docker Desktop K8s, or cloud provider)
- **kubectl** CLI tool

### Step 1: Start Kubernetes Cluster

**For Minikube:**
```powershell
minikube start --cpus=4 --memory=8192
```

**For Docker Desktop:**
- Enable Kubernetes in Docker Desktop settings

### Step 2: Create Namespace

```powershell
kubectl create namespace lms-namespace
```

### Step 3: Build and Push Docker Images

```powershell
# Build images with tags
docker build -t discovery-server:latest ./discovery-server
docker build -t api-gateway:latest ./api-gateway
docker build -t user-service:latest ./user-service
docker build -t course-service:latest ./course-service
docker build -t assessment-service:latest ./assessment-service
docker build -t notification-service:latest ./notification-service
docker build -t attendance-service:latest ./attendance-service
docker build -t leave-service:latest ./leave-service

# For Minikube - use Minikube's docker daemon
# eval $(minikube docker-env)
```

**For Cloud Deployment (AWS/GCP/Azure):**
```powershell
# Tag and push to container registry
# Example for Docker Hub:
docker tag discovery-server:latest yourusername/discovery-server:latest
docker push yourusername/discovery-server:latest
# Repeat for all services
```

### Step 4: Create Complete Kubernetes Manifests

The existing `k8s-manifests.yml` is incomplete. You need to create manifests for all services. I'll provide this in a separate file.

### Step 5: Deploy to Kubernetes

```powershell
# Apply all manifests
kubectl apply -f k8s-manifests-complete.yml

# Check deployments
kubectl get deployments -n lms-namespace

# Check pods
kubectl get pods -n lms-namespace

# Check services
kubectl get services -n lms-namespace
```

### Step 6: Access Services

**For Minikube:**
```powershell
# Get service URLs
minikube service api-gateway -n lms-namespace --url

# Access Eureka
minikube service discovery-server -n lms-namespace --url
```

**For LoadBalancer (Cloud):**
```powershell
# Get external IP
kubectl get service api-gateway -n lms-namespace
```

### Step 7: Scale Services

```powershell
# Scale user service to 3 replicas
kubectl scale deployment user-service --replicas=3 -n lms-namespace

# Auto-scale based on CPU
kubectl autoscale deployment user-service --cpu-percent=70 --min=2 --max=10 -n lms-namespace
```

### Step 8: Monitor and Troubleshoot

```powershell
# View logs
kubectl logs -f deployment/user-service -n lms-namespace

# Describe pod for issues
kubectl describe pod <pod-name> -n lms-namespace

# Execute commands in pod
kubectl exec -it <pod-name> -n lms-namespace -- /bin/sh
```

---

## 4. Production Deployment (Cloud)

### Option A: AWS Deployment

#### Architecture
- **ECS/EKS**: Container orchestration
- **RDS MySQL**: Managed database
- **ALB**: Application Load Balancer
- **S3 + CloudFront**: Frontend hosting
- **Route 53**: DNS management

#### Steps

**1. Setup RDS MySQL**
```powershell
# Using AWS CLI
aws rds create-db-instance `
  --db-instance-identifier lms-database `
  --db-instance-class db.t3.medium `
  --engine mysql `
  --master-username admin `
  --master-user-password YourSecurePassword123! `
  --allocated-storage 20
```

**2. Push Images to ECR**
```powershell
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push images
docker tag discovery-server:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/discovery-server:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/discovery-server:latest
# Repeat for all services
```

**3. Deploy with ECS/EKS**
- Create ECS cluster or EKS cluster
- Create task definitions for each service
- Create services with load balancer

**4. Deploy Frontend to S3**
```powershell
# Build frontend
cd frontend-react
npm run build

# Upload to S3
aws s3 sync ./dist s3://your-lms-bucket --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option B: Azure Deployment

#### Architecture
- **AKS**: Azure Kubernetes Service
- **Azure Database for MySQL**: Managed database
- **Application Gateway**: Load balancer
- **Azure Blob Storage**: Frontend hosting
- **Azure CDN**: Content delivery

#### Steps

**1. Create AKS Cluster**
```powershell
az aks create `
  --resource-group lms-resources `
  --name lms-cluster `
  --node-count 3 `
  --enable-addons monitoring `
  --generate-ssh-keys
```

**2. Create Azure Database for MySQL**
```powershell
az mysql server create `
  --resource-group lms-resources `
  --name lms-mysql-server `
  --location eastus `
  --admin-user myadmin `
  --admin-password YourPassword123! `
  --sku-name GP_Gen5_2
```

**3. Deploy to AKS**
```powershell
# Get credentials
az aks get-credentials --resource-group lms-resources --name lms-cluster

# Deploy
kubectl apply -f k8s-manifests-complete.yml
```

### Option C: Google Cloud Platform

#### Architecture
- **GKE**: Google Kubernetes Engine
- **Cloud SQL**: MySQL database
- **Cloud Load Balancing**: Traffic distribution
- **Cloud Storage + CDN**: Frontend hosting

#### Steps

**1. Create GKE Cluster**
```powershell
gcloud container clusters create lms-cluster `
  --num-nodes=3 `
  --machine-type=n1-standard-2 `
  --zone=us-central1-a
```

**2. Create Cloud SQL Instance**
```powershell
gcloud sql instances create lms-mysql `
  --tier=db-n1-standard-2 `
  --region=us-central1
```

**3. Deploy to GKE**
```powershell
# Get credentials
gcloud container clusters get-credentials lms-cluster --zone=us-central1-a

# Deploy
kubectl apply -f k8s-manifests-complete.yml
```

---

## 🔒 Production Security Checklist

- [ ] Change default passwords (MySQL, admin accounts)
- [ ] Use strong JWT secret (minimum 256 bits)
- [ ] Enable HTTPS/TLS certificates
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable database encryption at rest
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerting
- [ ] Configure backup and disaster recovery
- [ ] Use secrets management (AWS Secrets Manager, Azure Key Vault, etc.)
- [ ] Implement logging and audit trails
- [ ] Regular security updates and patches

---

## 🔍 Monitoring and Observability

### Health Checks

All services expose actuator endpoints:
```
http://localhost:8080/actuator/health
http://localhost:8080/actuator/info
http://localhost:8080/actuator/metrics
```

### Recommended Tools

1. **Prometheus + Grafana**: Metrics and dashboards
2. **ELK Stack**: Centralized logging
3. **Jaeger**: Distributed tracing
4. **New Relic / DataDog**: APM (Application Performance Monitoring)

---

## 🐛 Troubleshooting

### Services Not Registering with Eureka
```powershell
# Check Eureka URL in application.yml
# Ensure discovery-server is running first
# Check network connectivity
```

### Database Connection Issues
```powershell
# Verify MySQL is running
# Check connection string
# Verify credentials
# Check firewall rules
```

### Frontend Can't Connect to Backend
```powershell
# Check CORS configuration in API Gateway
# Verify API Gateway URL in frontend
# Check browser console for errors
```

---

## 📊 Performance Optimization

### Backend
- Enable connection pooling
- Configure JVM heap size: `-Xmx2g -Xms1g`
- Use caching (Redis)
- Enable database indexing

### Frontend
- Enable build optimization
- Use CDN for static assets
- Enable compression (gzip/brotli)
- Implement lazy loading

---

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose logs <service-name>`
2. Check Eureka dashboard: http://localhost:8761
3. Verify database connections
4. Review application.yml configurations

---

## 🎉 Deployment Validation

After deployment, verify:

1. ✅ All services visible in Eureka
2. ✅ API Gateway health check passes
3. ✅ Frontend accessible
4. ✅ Login functionality works
5. ✅ Super Admin dashboard loads
6. ✅ Tenant isolation working
7. ✅ Course creation/viewing works
8. ✅ User management functional

---

**Congratulations! Your Multi-Tenant LMS is now deployed! 🚀**
