# Aiven MySQL to Render Connection Guide (UPDATED)

### 1. Your Specific Connection Details
Store these safely:
- **Environment Variable Name**: `AIVEN_MYSQL_URL`
- **Value**: `jdbc:mysql://mysql-283ef25f-multi-tenant-lms.j.aivencloud.com:18511/defaultdb?ssl-mode=REQUIRED&createDatabaseIfNotExist=true`

- **Environment Variable Name**: `AIVEN_MYSQL_PASSWORD`
- **Value**: [REDACTED_FOR_SECURITY_CHECK]

---

### 2. Update these in your Render Blueprint (render.yaml)
I have configured `render.yaml` to use these variables. In your Render Dashboard:
1. Go to **Dashboard** -> **Environment Groups** (or the individual service).
2. Add a new secret file or environment variable:
   - `AIVEN_MYSQL_URL`
   - `AIVEN_MYSQL_PASSWORD`

### 3. Connection for MySQL Workbench
To see your data locally:
- **Connection Method**: Standard (TCP/IP)
- **Hostname**: `mysql-283ef25f-multi-tenant-lms.j.aivencloud.com`
- **Port**: `18511`
- **Username**: `avnadmin`
- **Password**: [REDACTED_FOR_SECURITY_CHECK]
- **SSL**: Set "SSL Mode" to **'Require'** (in the SSL tab)
