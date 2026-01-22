# 🔧 Fix for API Gateway 404 Error on Render

## 🔴 The Problem
Your API Gateway logs show:
```
registration status: 404
Cannot execute request on any known server
```

This means the API Gateway cannot find the Discovery Server (Eureka).

---

## ✅ The Solution (Choose ONE)

### Option 1: Deploy Discovery Server First (RECOMMENDED)

**This is the simplest fix:**

1. Go to Render Dashboard: https://dashboard.render.com
2. Find your `discovery-service`
3. Click "Manual Deploy" → "Clear Build Cache & Deploy"
4. **Wait until it shows "Live" (green)** - this takes 3-5 minutes
5. Once it's live, **redeploy the API Gateway**
6. Done! The 404 error will disappear

**Why this works**: The API Gateway is looking for the Discovery Server, but it's not running yet. Once you deploy it, the Gateway will find it automatically.

---

### Option 2: Update the Eureka URL Manually

**If Option 1 doesn't work, do this:**

1. Go to Render Dashboard
2. Click on `discovery-service`
3. **Copy the exact URL** (e.g., `https://discovery-service-xyz123.onrender.com`)
4. Go to `api-gateway` in Render
5. Click "Environment" tab
6. Find `EUREKA_SERVER_URL`
7. Update it to: `https://YOUR-ACTUAL-DISCOVERY-URL.onrender.com/eureka/`
8. Save and redeploy

---

## 📋 Deployment Order (CRITICAL!)

Always deploy in this order:

```
1. discovery-service  ← Deploy FIRST, wait for "Live"
2. user-service       ← Deploy SECOND, wait for "Live"
3. api-gateway        ← Deploy THIRD, wait for "Live"
4. Other services     ← Deploy in any order
```

**Why?** Because:
- User Service needs Discovery Server to register
- API Gateway needs Discovery Server to find User Service
- If you deploy them out of order, they can't find each other

---

## 🔍 How to Verify It's Fixed

### Step 1: Check Discovery Server
Open in browser: `https://YOUR-DISCOVERY-SERVICE-URL.onrender.com`

You should see the Eureka dashboard with a table showing registered services.

### Step 2: Check API Gateway Logs
After redeploying, the logs should show:
```
✅ registration status: 204  (instead of 404)
✅ DiscoveryClient_API-GATEWAY - registration successful
```

### Step 3: Test Login
```bash
curl -X POST https://YOUR-API-GATEWAY-URL.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@lms.com","password":"superpassword"}'
```

Should return a JWT token (not 503 error).

---

## 🚨 If It Still Doesn't Work

Check these:

1. **Discovery Server Status**: Is it "Live" (green) in Render?
2. **URL Match**: Does the URL in `render.yaml` match the actual Discovery Service URL?
3. **Logs**: Check discovery-service logs for errors
4. **Port**: Discovery Server should be on port 10000

---

## 💡 Quick Checklist

- [ ] Discovery Server is deployed and showing "Live"
- [ ] API Gateway EUREKA_SERVER_URL matches actual Discovery Service URL
- [ ] Services deployed in correct order (Discovery → User → Gateway)
- [ ] Waited 2-3 minutes after deployment for registration
- [ ] Checked Eureka dashboard shows registered services

---

**Last Updated**: 2026-01-22
**Status**: Ready to deploy
