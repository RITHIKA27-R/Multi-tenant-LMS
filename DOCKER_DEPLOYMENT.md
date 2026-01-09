# 🐳 Docker Deployment Guide - Multi-Tenant LMS

This guide provides step-by-step instructions to deploy the Multi-Tenant LMS using Docker for the backend and npm for the frontend.

## 📋 Prerequisites

- **Docker Desktop** for Windows installed and running.
- **Node.js** (v18+) installed.
- **Git Bash** or **PowerShell**.

---

## 🚀 Step 1: Start Backend Services (Docker)

We will use Docker Compose to start MySQL, Eureka, API Gateway, and all microservices.

### 1. Open Terminal (PowerShell)
Navigate to your project root:
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms"
```

### 2. Clean up Old Containers (Recommended)
Ensure no old conflicting containers are running.
```powershell
docker-compose down -v
```
*(Note: `-v` removes volumes, effectively resetting the database. Remove `-v` if you want to keep data.)*

### 3. Build and Start Backend
This command builds the images and starts the containers in detached mode (`-d`).
```powershell
docker-compose up -d --build
```
*Wait for about 2-3 minutes for all images to build and services to start.*

### 4. Check Service Status
Verify that all containers are running:
```powershell
docker-compose ps
```
You should see `Up` status for:
- `lms-db`
- `discovery-server`
- `api-gateway`
- `user-service`, `course-service`, etc.

---

## 🌐 Step 2: Start Frontend (npm)

We will run the React frontend locally.

### 1. Open a New Terminal (PowerShell)
Navigate to the frontend directory:
```powershell
cd "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms\frontend-react"
```

### 2. Install Dependencies (If not already done)
```powershell
npm install
```

### 3. Start Development Server
```powershell
npm run dev
```
The frontend will start at **http://localhost:5173**.

---

## ✅ Step 3: Verification

1.  **Eureka Dashboard**: Open [http://localhost:8761](http://localhost:8761).
    - Verify that ALL services (`USER-SERVICE`, `API-GATEWAY`, etc.) are listed under "Instances currently registered with Eureka".
    
2.  **API Gateway**: Open [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health).
    - Expected output: `{"status":"UP"}`.

3.  **Frontend Application**: Open [http://localhost:5173](http://localhost:5173).
    - You should see the login page.
    
4.  **Test Login**:
    - **Super Admin**: `superadmin@lms.com` / `password`
    - **Tenant Admin**: `alice@acme.com` / `password`

---

## 🛑 Common Errors & Fixes

### 1. "Port already in use"
**Error**: `bind: address already in use`
**Fix**: You likely have local Java processes running. Stop them:
```powershell
# Find process using port 8080
netstat -ano | findstr :8080
# Kill process (replace PID with actual ID)
taskkill /PID <PID> /F
```
Or simply restart your computer.

### 2. Services not showing in Eureka
**Cause**: The services started before the Discovery Server was ready.
**Fix**: They will self-heal and register automatically within 1-2 minutes. You can also restart specific services:
```powershell
docker-compose restart user-service
```

### 3. Database connection failure
**Error**: `Communications link failure` in logs.
**Cause**: MySQL container wasn't ready when service tried to connect.
**Fix**: The services are configured to wait, but if they fail, restart them:
```powershell
docker-compose restart user-service course-service
```

---

## 🛠️ Useful Commands

| Action | Command |
| :--- | :--- |
| **Start Backend** | `docker-compose up -d` |
| **Stop Backend** | `docker-compose down` |
| **Stop & Clear Data** | `docker-compose down -v` |
| **View Logs** | `docker-compose logs -f` |
| **View Specific Log** | `docker-compose logs -f user-service` |
| **Restart Service** | `docker-compose restart <service-name>` |
