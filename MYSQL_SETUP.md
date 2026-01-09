# MySQL Setup Guide for Multi-Tenant LMS

## ✅ Database Configuration Updated

All services have been updated to use **MySQL** instead of H2.

---

## 📊 Database Schema

The system uses **4 separate MySQL databases** for microservices isolation:

1. **lms_user_db** - User Service (Port 8081)
   - Tables: `users`, `tenant`

2. **lms_course_db** - Course Service (Port 8082)
   - Tables: `course`

3. **lms_assessment_db** - Assessment Service (Port 8083)
   - Tables: `assessments`

4. **lms_notification_db** - Notification Service (Port 8084)
   - Tables: `notifications`

---

## 🚀 MySQL Installation

### Option 1: Install MySQL Server (Recommended)

1. **Download MySQL Installer**
   - Visit: https://dev.mysql.com/downloads/installer/
   - Download "MySQL Installer for Windows"
   - Choose "Custom" installation

2. **Install Components**
   - MySQL Server 8.0 (or latest)
   - MySQL Workbench (optional, for GUI management)

3. **Configure MySQL Server**
   - Set root password: `root` (or update application.yml files)
   - Port: `3306` (default)
   - Start MySQL Service

4. **Verify Installation**
   ```powershell
   mysql -u root -p
   # Enter password: root
   ```

### Option 2: Docker (Quick Setup)

```powershell
# Run MySQL in Docker
docker run --name mysql-lms `
  -e MYSQL_ROOT_PASSWORD=root `
  -p 3306:3306 `
  -d mysql:8.0

# Verify it's running
docker ps
```

---

## 🗄️ Database Creation

**Good News**: Databases are created automatically! 

The connection string includes `createDatabaseIfNotExist=true`, so when each service starts, it will:
1. Connect to MySQL server
2. Create its database if it doesn't exist
3. Create tables automatically (Hibernate `ddl-auto: update`)

### Manual Creation (Optional)

If you prefer to create databases manually:

```sql
CREATE DATABASE lms_user_db;
CREATE DATABASE lms_course_db;
CREATE DATABASE lms_assessment_db;
CREATE DATABASE lms_notification_db;
```

---

## ⚙️ Configuration Details

### Connection Settings (in application.yml)

```yaml
datasource:
  url: jdbc:mysql://localhost:3306/lms_user_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
  username: root
  password: root
  driver-class-name: com.mysql.cj.jdbc.Driver

jpa:
  database-platform: org.hibernate.dialect.MySQLDialect
  hibernate:
    ddl-auto: update
  show-sql: true
```

### Update if Using Different Credentials

If your MySQL has different credentials, update these files:
- `user-service/src/main/resources/application.yml`
- `course-service/src/main/resources/application.yml`
- `assessment-service/src/main/resources/application.yml`
- `notification-service/src/main/resources/application.yml`

---

## 🔄 Starting Services with MySQL

### Step 1: Start MySQL

```powershell
# Check if MySQL is running
Get-Service MySQL*

# If not running, start it
Start-Service MySQL80
```

### Step 2: Rebuild Services (Download MySQL Connector)

```powershell
cd c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms
mvn clean install
```

### Step 3: Start Services

```powershell
# Terminal 1 - Discovery Server
mvn spring-boot:run -pl discovery-server

# Terminal 2 - API Gateway
mvn spring-boot:run -pl api-gateway

# Terminal 3 - User Service
mvn spring-boot:run -pl user-service

# Terminal 4 - Course Service
mvn spring-boot:run -pl course-service

# Terminal 5 - Assessment Service
mvn spring-boot:run -pl assessment-service

# Terminal 6 - Notification Service
mvn spring-boot:run -pl notification-service
```

---

## 🔍 Verify MySQL Databases

### Using MySQL Command Line

```sql
-- Connect to MySQL
mysql -u root -p

-- List all databases
SHOW DATABASES;

-- Should see:
-- lms_user_db
-- lms_course_db
-- lms_assessment_db
-- lms_notification_db

-- Check a specific database
USE lms_user_db;
SHOW TABLES;

-- View tenant data
SELECT * FROM tenant;
SELECT * FROM users;
```

### Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to localhost:3306
3. See all 4 databases in the left panel
4. Browse tables and data

---

## 📋 Seed Data

The User Service will automatically create:
- **2 Tenants**: Acme Corp, Beta Updates
- **2 Users**: tenant@gmail.com, learner@lms.com

This happens on first startup via `UserServiceApplication.java`.

---

## ⚠️ Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
**Solution**: Update password in all application.yml files

### Error: "Communications link failure"
**Solution**: 
1. Check if MySQL is running: `Get-Service MySQL*`
2. Start MySQL: `Start-Service MySQL80`
3. Verify port 3306 is open

### Error: "Unknown database"
**Solution**: Add `createDatabaseIfNotExist=true` to connection string (already done)

### Slow Performance
**Solution**: 
1. Increase MySQL memory in `my.ini`
2. Use indexes on tenantId columns
3. Add connection pooling configuration

---

## 🎯 Benefits of MySQL vs H2

✅ **Persistent Storage** - Data survives restarts
✅ **Production Ready** - Industry standard database
✅ **Better Performance** - Optimized for concurrent access
✅ **Advanced Features** - Transactions, indexes, views
✅ **Easy Backup** - Database dump/restore tools
✅ **GUI Tools** - MySQL Workbench for management

---

## 📊 MySQL Optimization (Production)

### Add Indexes for Better Performance

```sql
-- User Service
USE lms_user_db;
CREATE INDEX idx_tenant_id ON users(tenant_id);
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);

-- Course Service
USE lms_course_db;
CREATE INDEX idx_tenant_id ON course(tenant_id);

-- Assessment Service
USE lms_assessment_db;
CREATE INDEX idx_tenant_id ON assessments(tenant_id);

-- Notification Service
USE lms_notification_db;
CREATE INDEX idx_tenant_id ON notifications(tenant_id);
```

### Connection Pool Settings (application.yml)

```yaml
datasource:
  hikari:
    maximum-pool-size: 10
    minimum-idle: 2
    connection-timeout: 30000
```

---

## 🔐 Security Best Practices

1. **Change Default Password**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourStrongPassword';
   ```

2. **Create Application User**
   ```sql
   CREATE USER 'lms_app'@'localhost' IDENTIFIED BY 'lms_password';
   GRANT ALL PRIVILEGES ON lms_*.* TO 'lms_app'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update application.yml**
   ```yaml
   username: lms_app
   password: lms_password
   ```

---

## ✅ Quick Start Checklist

- [ ] MySQL installed and running
- [ ] Root password set to `root` (or updated in configs)
- [ ] Port 3306 accessible
- [ ] Maven rebuild completed (`mvn clean install`)
- [ ] All services started
- [ ] Databases auto-created
- [ ] Seed data loaded
- [ ] Frontend working with persistent data

---

**You're now using MySQL for production-ready persistent storage! 🎉**
