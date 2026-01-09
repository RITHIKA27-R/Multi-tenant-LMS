---
description: Deploy the Multi-Tenant LMS application
---

# Deploy Multi-Tenant LMS

This workflow provides step-by-step instructions to deploy the Multi-Tenant LMS application.

## Choose Your Deployment Method

Before starting, choose which deployment method you want to use:
- **Docker Compose**: Easiest, recommended for demos and development
- **Local Development**: For active development with hot reload
- **Kubernetes**: For production, scalable deployments
- **Cloud**: For production cloud deployments (AWS, Azure, GCP)

---

## Method 1: Docker Compose (Recommended)

### Prerequisites
Ensure Docker Desktop is installed and running.

### Steps

// turbo-all

1. **Navigate to project directory**
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
```

2. **Check Docker is running**
```powershell
docker --version
docker-compose --version
```

3. **Build and start all services**
```powershell
docker-compose up -d --build
```

4. **Wait for services to start (2-3 minutes)**
Check status:
```powershell
docker-compose ps
```

5. **View logs (optional)**
```powershell
docker-compose logs -f
```

6. **Verify deployment**
- Eureka: http://localhost:8761
- API Gateway: http://localhost:8080/actuator/health
- Frontend: http://localhost

7. **Test login**
Login with: superadmin@lms.com / password

### Stop services
```powershell
docker-compose down
```

---

## Method 2: Local Development

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0

### Steps

1. **Start MySQL**
```powershell
Start-Service MySQL80
```

2. **Build all services**
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
mvn clean install -DskipTests
```

3. **Start Discovery Server (Terminal 1)**
```powershell
mvn spring-boot:run -pl discovery-server
```
Wait for: "Tomcat started on port(s): 8761"

4. **Start API Gateway (Terminal 2)**
```powershell
mvn spring-boot:run -pl api-gateway
```
Wait for: "Tomcat started on port(s): 8080"

5. **Start User Service (Terminal 3)**
```powershell
mvn spring-boot:run -pl user-service
```

6. **Start Course Service (Terminal 4)**
```powershell
mvn spring-boot:run -pl course-service
```

7. **Start Assessment Service (Terminal 5)**
```powershell
mvn spring-boot:run -pl assessment-service
```

8. **Start Notification Service (Terminal 6)**
```powershell
mvn spring-boot:run -pl notification-service
```

9. **Start Attendance Service (Terminal 7)**
```powershell
mvn spring-boot:run -pl attendance-service
```

10. **Start Leave Service (Terminal 8)**
```powershell
mvn spring-boot:run -pl leave-service
```

11. **Start Frontend (Terminal 9)**
```powershell
cd frontend-react
npm install
npm run dev
```

12. **Access application**
Open: http://localhost:5173

---

## Method 3: Kubernetes

### Prerequisites
- Kubernetes cluster (Minikube, Docker Desktop K8s, or cloud)
- kubectl CLI

### Steps

1. **Start Kubernetes cluster (if using Minikube)**
```powershell
minikube start --cpus=4 --memory=8192
```

2. **Build Docker images**
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
docker-compose build
```

3. **For Minikube - use Minikube's Docker daemon**
```powershell
minikube docker-env | Invoke-Expression
docker-compose build
```

4. **Deploy to Kubernetes**
```powershell
kubectl apply -f k8s-manifests-complete.yml
```

5. **Check deployment status**
```powershell
kubectl get pods -n lms-namespace
kubectl get services -n lms-namespace
```

6. **Access services (Minikube)**
```powershell
minikube service api-gateway -n lms-namespace --url
minikube service frontend -n lms-namespace --url
```

### Scale services
```powershell
kubectl scale deployment user-service --replicas=3 -n lms-namespace
```

---

## Method 4: Cloud Deployment

See detailed guides:
- AWS: See CLOUD_DEPLOYMENT.md - AWS section
- Azure: See CLOUD_DEPLOYMENT.md - Azure section
- GCP: See CLOUD_DEPLOYMENT.md - GCP section
- DigitalOcean: See CLOUD_DEPLOYMENT.md - DigitalOcean section

---

## Verification Steps

After deployment, verify everything is working:

1. **Check Eureka Dashboard**
   - URL: http://localhost:8761
   - All services should be registered

2. **Check API Gateway Health**
   - URL: http://localhost:8080/actuator/health
   - Should return: {"status":"UP"}

3. **Access Frontend**
   - Docker: http://localhost
   - Local Dev: http://localhost:5173
   - Should see login page

4. **Test Login**
   - Super Admin: superadmin@lms.com / password
   - Tenant Admin: alice@acme.com / password
   - Learner: bob@beta.com / password

5. **Verify Functionality**
   - Navigate through dashboard
   - Create a course (as admin)
   - View courses (as learner)
   - Check all modules load correctly

---

## Troubleshooting

### Services not starting?
```powershell
# Docker
docker-compose logs <service-name>

# Local
# Check terminal output for errors
# Ensure MySQL is running
# Check ports are not in use
```

### Database connection errors?
```powershell
# Verify MySQL is running
Get-Service MySQL80

# Check connection string in application.yml
```

### Frontend can't reach backend?
- Check CORS configuration in API Gateway
- Verify API_URL in frontend configuration
- Check browser console for errors

---

## Quick Reference

### Demo Accounts
- Super Admin: superadmin@lms.com / password
- Tenant Admin: alice@acme.com / password
- Learner: bob@beta.com / password

### Service Ports
- Frontend: 80 (Docker) or 5173 (Dev)
- API Gateway: 8080
- Eureka: 8761
- User Service: 8081
- Course Service: 8082
- Assessment Service: 8083
- Notification Service: 8084
- Attendance Service: 8085
- Leave Service: 8086

### Important URLs
- Eureka Dashboard: http://localhost:8761
- API Gateway Health: http://localhost:8080/actuator/health
- Frontend: http://localhost (or http://localhost:5173)

---

**Deployment Complete! 🚀**

For more details, see:
- QUICKSTART.md - Quick start guide
- DEPLOYMENT_GUIDE.md - Comprehensive deployment documentation
- CLOUD_DEPLOYMENT.md - Cloud-specific deployment guides
