# 🚀 Quick Start Guide - Multi-Tenant LMS

This guide will help you deploy and run your Multi-Tenant LMS in minutes!

## Choose Your Deployment Method

### Option 1: Docker (Recommended - Easiest)

**Prerequisites:**
- Docker Desktop installed and running

**Steps:**
1. Open PowerShell in the project directory
2. Run the deployment script:
   ```powershell
   .\deploy.ps1
   ```
3. Choose option `1` (Start all services)
4. Wait 2-3 minutes for all services to start
5. Access the application at: **http://localhost**

**That's it! You're done! 🎉**

---

### Option 2: Manual Docker Compose

**Prerequisites:**
- Docker Desktop installed and running

**Steps:**
```powershell
# Navigate to project directory
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"

# Start all services
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

**Access:**
- Frontend: http://localhost
- API Gateway: http://localhost:8080  
- Eureka: http://localhost:8761

---

### Option 3: Local Development (For Developers)

**Prerequisites:**
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0

**Backend Services:**

Open 8 separate PowerShell terminals and run:

```powershell
# Terminal 1: Discovery Server
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
mvn spring-boot:run -pl discovery-server

# Terminal 2: API Gateway
mvn spring-boot:run -pl api-gateway

# Terminal 3: User Service
mvn spring-boot:run -pl user-service

# Terminal 4: Course Service
mvn spring-boot:run -pl course-service

# Terminal 5: Assessment Service
mvn spring-boot:run -pl assessment-service

# Terminal 6: Notification Service
mvn spring-boot:run -pl notification-service

# Terminal 7: Attendance Service
mvn spring-boot:run -pl attendance-service

# Terminal 8: Leave Service
mvn spring-boot:run -pl leave-service
```

**Frontend:**
```powershell
# New terminal - Frontend
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms\frontend-react"
npm install
npm run dev
```

**Access:** http://localhost:5173

---

## 🔐 Demo Login Credentials

After deployment, you can login with these accounts:

### Super Admin (Full System Access)
- **Email:** superadmin@lms.com
- **Password:** password
- **Access:** All tenants, system settings, security, analytics

### Tenant Admin (Acme Corp)
- **Email:** alice@acme.com
- **Password:** password
- **Access:** Acme Corp tenant, course management, users

### Learner (Beta Updates)
- **Email:** bob@beta.com
- **Password:** password  
- **Access:** Course enrollment, assessments, progress tracking

---

## ✅ Verify Deployment

After starting services, verify everything is working:

### 1. Check Eureka Dashboard
Open: http://localhost:8761

You should see all services registered:
- API-GATEWAY
- USER-SERVICE
- COURSE-SERVICE
- ASSESSMENT-SERVICE
- NOTIFICATION-SERVICE
- ATTENDANCE-SERVICE
- LEAVE-SERVICE

### 2. Check API Gateway Health
```powershell
curl http://localhost:8080/actuator/health
```
Should return: `{"status":"UP"}`

### 3. Check Frontend
Open: http://localhost (or http://localhost:5173 for dev)

You should see the login page.

### 4. Test Login
- Login with any of the demo accounts
- Dashboard should load with your role-specific view

---

## 🛠️ Common Commands

### Docker Deployment

```powershell
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f user-service

# Restart a service
docker-compose restart user-service

# Rebuild and restart
docker-compose up -d --build

# Check service status
docker-compose ps

# Clean everything (including data!)
docker-compose down -v
```

### Local Development

```powershell
# Build all services
mvn clean install -DskipTests

# Build specific service
mvn clean install -pl user-service -DskipTests

# Run specific service
mvn spring-boot:run -pl user-service

# Frontend - Dev mode
cd frontend-react
npm run dev

# Frontend - Production build
npm run build
npm run preview
```

---

## 🐛 Troubleshooting

### Services not starting?

**Check Docker:**
```powershell
docker ps
docker-compose logs
```

**Check ports:**
```powershell
# Ensure these ports are free:
# 80, 3306, 8761, 8080, 8081-8086
netstat -ano | findstr "8080"
```

### Can't connect to database?

```powershell
# Check MySQL container
docker exec -it lms-db mysql -u root -proot

# Check database exists
SHOW DATABASES;
```

### Frontend can't reach backend?

1. Check API Gateway is running: http://localhost:8080/actuator/health
2. Check browser console for CORS errors
3. Verify API URL in frontend configuration

### Service not registered in Eureka?

1. Wait 30-60 seconds for registration
2. Check service logs: `docker-compose logs <service-name>`
3. Verify Eureka URL in service configuration

---

## 🎯 Next Steps

After successful deployment:

1. **Explore the Super Admin Dashboard**
   - Manage tenants
   - Create tenant admins
   - View system analytics
   - Configure security settings

2. **Create a Test Tenant**
   - Login as superadmin
   - Go to "Tenants" → "Add New Tenant"
   - Create tenant admin user

3. **Manage Courses**
   - Login as tenant admin
   - Create courses
   - Add course materials
   - Create assessments

4. **Test Learner Experience**
   - Login as learner
   - Enroll in courses
   - Take assessments
   - Track progress

---

## 📚 Additional Resources

- **Full Deployment Guide:** See `DEPLOYMENT_GUIDE.md`
- **Database Setup:** See `MYSQL_SETUP.md`
- **Tech Stack:** See `TECH_STACK_ALIGNMENT.md`
- **Project Overview:** See `README.md`

---

## 💡 Pro Tips

1. **Use Docker for quick demos** - Fastest way to get up and running
2. **Use local development for active coding** - Hot reload, easier debugging
3. **Check Eureka dashboard first** - If service isn't registered, it won't work
4. **Use deployment script** - Interactive menu makes it easy
5. **Monitor logs** - `docker-compose logs -f` shows real-time activity

---

## 🎉 You're All Set!

Your Multi-Tenant LMS is now running!

**Quick Access:**
- 🌐 Application: http://localhost
- 🔧 API Gateway: http://localhost:8080
- 📊 Eureka: http://localhost:8761

**Need Help?**
- Check the logs: `docker-compose logs -f`
- Review `DEPLOYMENT_GUIDE.md` for detailed information
- Check service health: http://localhost:8080/actuator/health

**Happy Learning! 📚✨**
