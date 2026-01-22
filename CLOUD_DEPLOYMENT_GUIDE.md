# 🚀 Cloud Deployment Troubleshooting Guide

## ✅ All Fixes Applied

### 1. Environment Variables (render.yaml)
- ✅ **JWT_SECRET** added to user-service and api-gateway
- ✅ **JWT_EXPIRATION** added to user-service  
- ✅ **Database credentials** hardcoded (Aiven MySQL)
- ✅ **EUREKA_SERVER_URL** configured for all services

### 2. CORS Configuration
- ✅ **SecurityConfig.java** updated with CORS support
- ✅ **API Gateway** already has global CORS enabled
- ✅ Allows all origins for development/testing

### 3. Frontend Configuration
- ✅ **`.env.production`** created pointing to cloud API Gateway
- ⚠️ **ACTION REQUIRED**: Update `VITE_API_BASE_URL` with your actual Render API Gateway URL

---

## 📋 Deployment Checklist

### Step 1: Verify Aiven Database Access
1. Go to [Aiven Console](https://console.aiven.io/)
2. Click on your MySQL service
3. Navigate to **"Allowed IP addresses"**
4. Ensure `0.0.0.0/0` is added (allows all IPs)
5. ✅ **Status**: Should show "Allows connections from anywhere"

### Step 2: Update Frontend URL
1. Open `frontend-react/.env.production`
2. Replace `https://api-gateway.onrender.com` with your **actual** API Gateway URL from Render
3. Example: `https://api-gateway-xyz123.onrender.com`

### Step 3: Deploy Services on Render (IN ORDER!)

#### 3.1 Deploy Discovery Server First
```
1. Go to Render Dashboard
2. Click on "discovery-service"
3. Click "Manual Deploy" → "Clear Build Cache & Deploy"
4. Wait until status shows "Live" (green)
5. Copy the URL (e.g., https://discovery-service-nb5s.onrender.com)
```

#### 3.2 Update Eureka URL (If Different)
If your Discovery Service URL is **NOT** `https://discovery-service-nb5s.onrender.com`:
```
1. For EACH service (user, course, assessment, etc.):
   - Go to service in Render
   - Click "Environment" tab
   - Find EUREKA_SERVER_URL
   - Update to: https://YOUR-ACTUAL-URL/eureka/
   - Save
```

#### 3.3 Deploy User Service
```
1. Click on "user-service"
2. Manual Deploy → Clear Build Cache & Deploy
3. Wait for "Live" status
4. Check logs for: "Started UserServiceApplication"
5. Look for: "DiscoveryClient_USER-SERVICE - registration status: 204"
```

#### 3.4 Deploy API Gateway
```
1. Click on "api-gateway"
2. Manual Deploy → Clear Build Cache & Deploy
3. Wait for "Live" status
4. Copy the URL (e.g., https://api-gateway-abc123.onrender.com)
```

#### 3.5 Deploy Other Services
Deploy in any order:
- course-service
- assessment-service
- notification-service
- attendance-service
- leave-service

---

## 🔍 Verification Steps

### Check 1: Eureka Dashboard
```
1. Open: https://YOUR-DISCOVERY-SERVICE-URL.onrender.com
2. Look for "Instances currently registered with Eureka"
3. You should see:
   - USER-SERVICE
   - API-GATEWAY
   - COURSE-SERVICE
   - ASSESSMENT-SERVICE
   - etc.
```

### Check 2: Test Login Endpoint
```bash
curl -X POST https://YOUR-API-GATEWAY-URL.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@lms.com","password":"superpassword"}'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "SUPER_ADMIN"
}
```

**Error Responses:**
- `503 Service Unavailable` → User service not registered in Eureka
- `401 Unauthorized` → Wrong credentials
- `CORS error` → Frontend URL mismatch

### Check 3: Service Logs
For each service showing errors:
```
1. Click on service in Render
2. Go to "Logs" tab
3. Look for:
   - ❌ "Communications link failure" → Aiven IP not whitelisted
   - ❌ "JWT signature does not match" → JWT_SECRET mismatch
   - ❌ "No instances available" → Eureka URL wrong
   - ✅ "Started [Service]Application" → Success!
```

---

## 🐛 Common Issues & Fixes

### Issue 1: 503 Service Unavailable
**Cause**: User service not registered in Eureka

**Fix**:
1. Check user-service logs for Eureka registration
2. Verify EUREKA_SERVER_URL matches actual Discovery Service URL
3. Restart user-service after fixing URL

### Issue 2: CORS Error in Browser
**Cause**: Frontend calling wrong API URL

**Fix**:
1. Open browser DevTools → Network tab
2. Check if requests go to `localhost` → ❌ Wrong!
3. Update `.env.production` with correct API Gateway URL
4. Rebuild frontend: `npm run build`

### Issue 3: Database Connection Timeout
**Cause**: Aiven blocking Render IPs

**Fix**:
1. Aiven Console → Allowed IPs → Add `0.0.0.0/0`
2. Wait 30 seconds
3. Redeploy service

### Issue 4: JWT Token Invalid
**Cause**: JWT_SECRET not set or different between services

**Fix**:
1. Check render.yaml has JWT_SECRET for user-service and api-gateway
2. Both must have same value: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
3. Redeploy both services

---

## 📊 Environment Variables Summary

### Discovery Service
```yaml
PORT: 10000
SPRING_PROFILES_ACTIVE: docker
```

### API Gateway
```yaml
PORT: 10000
EUREKA_SERVER_URL: https://discovery-service-nb5s.onrender.com/eureka/
SPRING_PROFILES_ACTIVE: docker
JWT_SECRET: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

### User Service
```yaml
PORT: 10000
SPRING_DATASOURCE_URL: jdbc:mysql://mysql-283ef25f-multi-tenant-lms.j.aivencloud.com:18511/defaultdb?ssl-mode=REQUIRED&createDatabaseIfNotExist=true
SPRING_DATASOURCE_USERNAME: avnadmin
SPRING_DATASOURCE_PASSWORD: AVNS_QBUJCEZCE_0r7adA3WT
EUREKA_SERVER_URL: https://discovery-service-nb5s.onrender.com/eureka/
SPRING_PROFILES_ACTIVE: docker
JWT_SECRET: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION: 86400000
```

### Other Services (Course, Assessment, etc.)
```yaml
PORT: 10000
SPRING_DATASOURCE_URL: jdbc:mysql://mysql-283ef25f-multi-tenant-lms.j.aivencloud.com:18511/defaultdb?ssl-mode=REQUIRED&createDatabaseIfNotExist=true
SPRING_DATASOURCE_USERNAME: avnadmin
SPRING_DATASOURCE_PASSWORD: AVNS_QBUJCEZCE_0r7adA3WT
EUREKA_SERVER_URL: https://discovery-service-nb5s.onrender.com/eureka/
SPRING_PROFILES_ACTIVE: docker
```

---

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ All services show "Live" status in Render
- ✅ Eureka dashboard shows all services registered
- ✅ Login API returns JWT token
- ✅ Frontend can communicate with backend
- ✅ No CORS errors in browser console
- ✅ Database queries work (check logs for SQL statements)

---

## 📞 Quick Debug Commands

### Check if service is reachable:
```bash
curl https://YOUR-SERVICE-URL.onrender.com/actuator/health
```

### Check Eureka registration:
```bash
curl https://YOUR-DISCOVERY-URL.onrender.com/eureka/apps
```

### Test login:
```bash
curl -X POST https://YOUR-API-GATEWAY-URL.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@lms.com","password":"superpassword"}'
```

---

## 🔄 If All Else Fails

1. **Delete and recreate services** in Render (fresh start)
2. **Check Render status page**: https://status.render.com/
3. **Verify GitHub repo** has latest code
4. **Review Render build logs** for compilation errors
5. **Contact Render support** if infrastructure issue

---

**Last Updated**: 2026-01-22
**Status**: All fixes applied ✅
