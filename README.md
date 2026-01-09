# Multi-Tenant Learning Management System (LMS)

A complete full-stack multi-tenant LMS with Spring Boot microservices backend and modern web frontend.

## 🏗️ Architecture

### Backend Services (Spring Boot)
- **Discovery Server** (Port 8761) - Eureka service registry
- **API Gateway** (Port 8080) - JWT validation, tenant context injection
- **User Service** (Port 8081) - Authentication, user management
- **Course Service** (Port 8082) - Course CRUD with tenant isolation
- **Assessment Service** (Port 8083) - Assessment management
- **Notification Service** (Port 8084) - Notification system

### Frontend (HTML/CSS/JavaScript)
- Modern, responsive UI with gradient design
- Login page with demo account quick-fill
- Dashboard showing tenant-isolated courses
- Built with vanilla JavaScript (no framework required)

## ✅ Completed Features

### Backend
1. ✅ **Service Discovery** - All services register with Eureka
2. ✅ **API Gateway** - Routes requests with JWT validation
3. ✅ **Authentication** - Login endpoint returns JWT tokens
4. ✅ **Multi-Tenant Isolation** - Data perfectly isolated by tenant ID
5. ✅ **JWT Security** - Tokens contain `tenantId`, `role`, and `username`
6. ✅ **Database Setup** - H2 in-memory databases for all services
7. ✅ **Seed Data** - Pre-loaded with 2 tenants and 2 users

### Frontend
1. ✅ **Login Page** - Beautiful gradient design with animations
2. ✅ **Dashboard** - Displays user's courses
3. ✅ **Tenant Isolation** - Users only see their own tenant's data
4. ✅ **Auto-fill Demo Accounts** - Click demo cards to auto-fill credentials

## 🚀 How to Run

### Start Backend Services

```powershell
# Terminal 1 - Discovery Server (if not already running)
cd c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms
mvn spring-boot:run -pl discovery-server

# Terminal 2 - API Gateway (if not already running)
mvn spring-boot:run -pl api-gateway

# Terminal 3 - User Service (if not already running)
mvn spring-boot:run -pl user-service

# Terminal 4 - Course Service (if not already running)
mvn spring-boot:run -pl course-service

# Terminal 5 - Assessment Service (if not already running)
mvn spring-boot:run -pl assessment-service

# Terminal 6 - Notification Service (if not already running)
mvn spring-boot:run -pl notification-service
```

### Access Frontend

Open `frontend/login.html` in your browser:
```powershell
Start-Process "c:\Users\Rithika R\.gemini\antigravity\scratch\multi-tenant-lms\frontend\login.html"
```

## 🔐 Demo Accounts

### Acme Corp (Tenant 1)
- **Email**: alice@acme.com
- **Password**: password
- **Role**: ADMIN

### Beta Updates (Tenant 2)
- **Email**: bob@beta.com
- **Password**: password
- **Role**: USER

## 🧪 Tested Scenarios

✅ **Authentication Flow**
- Users can login and receive JWT tokens
- Tokens contain tenant ID, role, and username

✅ **Tenant Isolation**
- Alice (Tenant 1) created "Spring Boot Course"
- Bob (Tenant 2) created "Docker Course"
- Alice can ONLY see Spring Boot Course
- Bob can ONLY see Docker Course
- Perfect data isolation verified!

✅ **API Gateway**
- Validates JWT tokens
- Extracts tenant information
- Forwards requests with X-Tenant-ID header
- Properly routes to microservices via Eureka

## 📊 API Endpoints

### Authentication
```
POST http://localhost:8081/auth/login
Content-Type: application/json
{
  "username": "alice@acme.com",
  "password": "password"
}
```

### Courses (via Gateway)
```
GET http://localhost:8080/courses
Authorization: Bearer <token>

POST http://localhost:8080/courses
Authorization: Bearer <token>
Content-Type: application/json
{
  "title": "Course Title",
  "description": "Course Description"
}
```

### Assessments (via Gateway)
```
GET http://localhost:8080/assessments
Authorization: Bearer <token>

POST http://localhost:8080/assessments
Authorization: Bearer <token>
Content-Type: application/json
{
  "title": "Assessment Title",
  "courseId": 1
}
```

### Notifications (via Gateway)
```
GET http://localhost:8080/notifications
Authorization: Bearer <token>

POST http://localhost:8080/notifications
Authorization: Bearer <token>
Content-Type: application/json
{
  "message": "Notification message",
  "recipient": "user@example.com"
}
```

## 🛠️ Technical Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Service Discovery**: Eureka
- **API Gateway**: Spring Cloud Gateway
- **Security**: JWT (jjwt library)
- **Database**: H2 (in-memory)
- **ORM**: Hibernate/JPA
- **Build Tool**: Maven

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern gradients, animations, flexbox/grid
- **JavaScript** - ES6+ features, async/await
- **No frameworks** - Vanilla JS for simplicity

## 🎨 Design Features

- **Gradient themes** - Purple/blue gradient design system
- **Smooth animations** - Fade-in, hover effects, micro-interactions
- **Responsive layout** - Works on desktop and mobile
- **Modern UI** - Card-based design, rounded corners, shadows
- **Accessibility** - Semantic HTML, proper labels, focus states

## 📁 Project Structure

```
multi-tenant-lms/
├── discovery-server/
├── api-gateway/
├── user-service/
├── course-service/
├── assessment-service/
├── notification-service/
├── frontend/
│   ├── login.html
│   ├── login.js
│   ├── dashboard.html
│   ├── dashboard.js
│   └── styles.css
├── pom.xml
└── README.md
```

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **BCrypt Password Hashing** - Passwords encrypted in database
- **CORS Handling** - Configured for frontend access
- **Multi-Tenant Context** - Thread-local tenant isolation
- **Gateway Validation** - All protected routes validated

## 🚦 Current Status

**All services are running and fully functional!**

- ✅ Backend services tested via API
- ✅ Multi-tenant isolation verified
- ✅ Frontend UI created
- ✅ Login flow working
- ✅ Dashboard showing courses

## 📝 Next Steps (Optional Enhancements)

1. Add course enrollment functionality
2. Implement assessment submission and grading
3. Add real-time notifications with WebSocket
4. Create admin panel for tenant management
5. Add user profile management
6. Implement course progress tracking
7. Add file upload for course materials
8. Create reporting and analytics dashboard

## 🙏 Credits

Built as a complete demonstration of:
- Microservices architecture
- Multi-tenancy patterns
- JWT security
- Modern web design
- Full-stack development

---

**Enjoy your Multi-Tenant LMS! 🎓**
