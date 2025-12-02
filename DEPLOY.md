# 🚀 Deployment Guide - VIPO Sales Hub

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Render Deployment](#render-deployment)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Rollback Procedures](#rollback-procedures)
6. [Monitoring & Alerts](#monitoring--alerts)
7. [Backup & Recovery](#backup--recovery)

---

## 🔍 Pre-Deployment Checklist

### Code Quality

- [ ] All tests pass locally
- [ ] No console.error or console.warn in production code
- [ ] No TODO/FIXME comments in critical paths
- [ ] Code reviewed and approved
- [ ] Dependencies updated and audited (`npm audit`)

### Environment

- [ ] `.env.production` configured with all required variables
- [ ] Secrets are NOT committed to Git
- [ ] `.gitignore` includes `.env*` files

### Database

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (0.0.0.0/0 for Render or specific IPs)
- [ ] Backup strategy configured

### Testing

- [ ] E2E tests completed (see `STAGE_14_E2E_CHECKLIST.md`)
- [ ] All 7 test scenarios passed
- [ ] No errors in browser console
- [ ] No errors in server logs

---

## ⚙️ Environment Setup

### Required Environment Variables

```bash
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vipo_prod

# JWT
JWT_SECRET=<64-char-random-string>

# App
PUBLIC_URL=https://your-app.onrender.com
PORT=3001
NODE_ENV=production
DRY_RUN=false
```

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🌐 Render Deployment

### Step 1: Prepare Repository

```bash
# Initialize Git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Stage 14: Production ready"

# Set main branch
git branch -M main

# Add remote (replace with your repo)
git remote add origin https://github.com/USERNAME/REPO.git

# Push
git push -u origin main
```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** vipo-sales-hub (or your choice)
   - **Region:** Choose closest to your users
   - **Branch:** main
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start`
   - **Instance Type:** Free (or paid for production)

### Step 3: Add Environment Variables

In Render dashboard → Environment:

```
MONGODB_URI = <your-mongodb-uri>
JWT_SECRET = <your-jwt-secret>
PUBLIC_URL = https://vipo-sales-hub.onrender.com
PORT = 3001
NODE_ENV = production
DRY_RUN = false
```

### Step 4: Enable Auto-Deploy

- Settings → Auto-Deploy: **Yes**
- Every push to `main` will trigger automatic deployment

### Step 5: Deploy

Click **Create Web Service** or **Manual Deploy**

Wait for build to complete (~5-10 minutes)

---

## ✅ Post-Deployment Verification

### 1. Health Check

```bash
# Check if server is up
curl https://your-app.onrender.com/

# Should return 200 OK
```

### 2. API Endpoints

```bash
# Test auth endpoint (should return 401)
curl -i https://your-app.onrender.com/api/auth/me

# Expected: 401 Unauthorized
```

### 3. Login Flow

1. Open browser: `https://your-app.onrender.com/login`
2. Login with admin credentials
3. Check `/api/auth/me` → should return user data

### 4. Repeat E2E Tests

Run all tests from `STAGE_14_E2E_CHECKLIST.md` on production URL

### 5. Check Logs

In Render dashboard → Logs:

- [ ] No ERROR messages
- [ ] Server started successfully
- [ ] Database connected

---

## 🔄 Rollback Procedures

### Quick Rollback (Render Dashboard)

1. Go to Render dashboard → Your service
2. Click **Deploys** tab
3. Find the last working deployment
4. Click **Rollback to this deploy**
5. Confirm rollback

### Git Rollback

```bash
# Find the commit to rollback to
git log --oneline

# Revert to specific commit
git revert <commit-hash>

# Or reset (dangerous - rewrites history)
git reset --hard <commit-hash>

# Force push (if using reset)
git push -f origin main

# Render will auto-deploy the reverted version
```

### Manual Rollback Steps

1. **Identify the issue**
   - Check Render logs
   - Check browser console
   - Check MongoDB logs

2. **Revert code**

   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Wait for auto-deploy** (~5 min)

4. **Verify rollback**
   - Run health checks
   - Test critical flows
   - Check logs

5. **Document incident**
   - What broke?
   - What was reverted?
   - How to prevent in future?

---

## 📊 Monitoring & Alerts

### Render Built-in Monitoring

1. **Dashboard Metrics:**
   - CPU usage
   - Memory usage
   - Request count
   - Response times

2. **Configure Alerts:**
   - Settings → Notifications
   - Add email/Slack webhook
   - Set thresholds:
     - High CPU (>80%)
     - High memory (>80%)
     - Restart failures
     - Deploy failures

### Custom Logging

```javascript
// In your code
console.log('INFO:', message);
console.error('ERROR:', error);
console.warn('WARNING:', warning);
```

View in Render → Logs

### External Monitoring (Optional)

- **Uptime Robot:** Free uptime monitoring
- **Sentry:** Error tracking
- **LogRocket:** Session replay
- **New Relic:** APM

---

## 💾 Backup & Recovery

### MongoDB Atlas Backups

#### Enable Automatic Backups

1. Go to MongoDB Atlas
2. Select your cluster
3. Click **Backup** tab
4. Enable **Continuous Backup** or **Snapshot Backups**
5. Configure:
   - Frequency: Daily
   - Retention: 7 days (or more)

#### Manual Backup

```bash
# Using mongodump
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/vipo_prod" \
  --out="/backups/$(date +%Y-%m-%d)"

# Compress
tar -czf backup-$(date +%Y-%m-%d).tar.gz /backups/$(date +%Y-%m-%d)
```

#### Restore from Backup

```bash
# Extract backup
tar -xzf backup-2025-11-01.tar.gz

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/vipo_prod" \
  /backups/2025-11-01
```

### Automated Backup Script

```bash
#!/bin/bash
# backup-mongodb.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/var/backups/mongodb"
MONGODB_URI="your-mongodb-uri"

# Create backup
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$DATE"

# Compress
tar -czf "$BACKUP_DIR/backup-$DATE.tar.gz" "$BACKUP_DIR/$DATE"

# Remove uncompressed
rm -rf "$BACKUP_DIR/$DATE"

# Keep only last 7 days
find "$BACKUP_DIR" -name "backup-*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Add to cron:

```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup-mongodb.sh
```

---

## 🔒 Security Checklist

### SSL/HTTPS

- [ ] Render provides free SSL automatically
- [ ] Force HTTPS redirect enabled
- [ ] No mixed content warnings

### Cookies

- [ ] `HttpOnly` flag set
- [ ] `Secure` flag set in production
- [ ] `SameSite=Lax` or `Strict`

### Authentication

- [ ] JWT secret is strong (64+ chars)
- [ ] Passwords hashed with bcrypt
- [ ] No default/weak credentials

### Authorization

- [ ] RBAC enforced (admin/agent/customer)
- [ ] Protected routes check permissions
- [ ] API endpoints validate user roles

### Database

- [ ] MongoDB user has minimal permissions
- [ ] IP whitelist configured
- [ ] Connection string not exposed

### Dependencies

- [ ] `npm audit` shows no critical vulnerabilities
- [ ] Dependencies up to date
- [ ] No known security issues

---

## 📈 Performance Optimization

### Render Configuration

- [ ] Use paid instance for production (not Free tier)
- [ ] Enable persistent disk if needed
- [ ] Configure health check endpoint

### Database

- [ ] Indexes created on frequently queried fields
- [ ] Connection pooling configured
- [ ] Query optimization

### Caching

- [ ] Static assets cached
- [ ] API responses cached where appropriate
- [ ] CDN for static files (optional)

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Build Fails

```
Error: Cannot find module 'xyz'
```

**Solution:** Check `package.json` dependencies, run `npm install`

#### 2. Database Connection Error

```
MongoServerError: Authentication failed
```

**Solution:**

- Check MONGODB_URI is correct
- Verify database user credentials
- Check IP whitelist

#### 3. 502 Bad Gateway

**Solution:**

- Check Render logs for errors
- Verify PORT environment variable
- Check if server is listening on correct port

#### 4. CORS Errors

**Solution:**

- Configure CORS in your app
- Set correct PUBLIC_URL
- Check allowed origins

#### 5. Cookie Not Set

**Solution:**

- Check `Secure` flag (requires HTTPS)
- Verify `SameSite` setting
- Check domain configuration

---

## 📞 Support & Resources

### Documentation

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Community

- Render Community Forum
- Stack Overflow
- GitHub Issues

### Emergency Contacts

- DevOps Lead: **\*\***\_\_\_**\*\***
- Database Admin: **\*\***\_\_\_**\*\***
- Security Team: **\*\***\_\_\_**\*\***

---

## ✅ Deployment Completion Checklist

- [ ] Code deployed to Render
- [ ] All environment variables configured
- [ ] Database connected and accessible
- [ ] Post-deployment tests passed
- [ ] Monitoring and alerts configured
- [ ] Backup strategy implemented
- [ ] Rollback procedure documented
- [ ] Team notified of deployment
- [ ] CHANGELOG.md updated

---

**Last Updated:** 2025-11-01  
**Version:** 1.0  
**Status:** ✅ Production Ready
