# CORS & Backend Fix - Deployment Guide

## 🎯 What Was Fixed

### 1. **Backend CORS Configuration** (`server.js`)
- ✅ Whitelist includes Vercel production URL
- ✅ Whitelist includes all localhost development ports
- ✅ Enabled `credentials: true` for JWT/cookies
- ✅ Added all necessary allowed headers
- ✅ Added OPTIONS preflight handling
- ✅ Added proper error and 404 handlers
- ✅ Improved middleware ordering (CORS → JSON parser → Routes)

### 2. **Frontend Axios Configuration** (`api.js`)
- ✅ Added `withCredentials: true` so cookies/auth headers work
- ✅ Better error handling for 401/403 responses
- ✅ Auto-redirect to login on unauthorized
- ✅ Improved logging for debugging
- ✅ Network error detection

### 3. **Environment Variables** 
- ✅ Frontend: `VITE_API_URL` correctly set to production URL
- ✅ Backend: All required env vars present (`MONGO_URI`, `JWT_SECRET`, etc.)

---

## 📋 Pre-Deployment Checklist

### Backend (Node.js on Railway)

- [ ] Push the updated `server.js` to GitHub
- [ ] Ensure Railway has these environment variables set:
  ```
  MONGO_URI=mongodb+srv://genbyte-admin:33556677_AM@genbyte.2smdab1.mongodb.net/genbyte?retryWrites=true&w=majority&appName=genbyte
  JWT_SECRET=genbyte_super_secret_key_2026
  CLOUDINARY_CLOUD_NAME=dshkhf5r9
  CLOUDINARY_API_KEY=424868636162538
  CLOUDINARY_API_SECRET=chgKpmXkqVDwVjsw1lghXThRrN0
  ```
- [ ] Verify Railway auto-redeploys after push
- [ ] Check Railway logs for "✅ MongoDB Connected"

### Frontend (React on Vercel)

- [ ] Push the updated `api.js` to GitHub
- [ ] Push the updated `.env.production` to GitHub
- [ ] Verify `.env.production` contains:
  ```
  VITE_API_URL=https://cozy-fulfillment-production.up.railway.app
  ```
- [ ] Vercel auto-deploys after push
- [ ] Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## 🚀 Deployment Steps

### Step 1: Update Backend on Railway

```bash
# In your local repo
git add backend/server.js
git commit -m "fix: improve CORS configuration and error handling"
git push origin main
```

Railway should auto-deploy. Check the Railway dashboard for success.

### Step 2: Update Frontend on Vercel

```bash
# In your local repo
git add frontend/src/api.js frontend/.env.production
git commit -m "fix: add withCredentials and improve axios error handling"
git push origin main
```

Vercel should auto-deploy. Check the Vercel dashboard for success.

### Step 3: Verify in Browser

1. **Open your frontend**: https://genbyte-five.vercel.app
2. **Open browser DevTools**: Press F12, go to Console
3. **Try to login** with any valid credentials

**Check for these messages:**
```
✅ API Base URL: https://cozy-fulfillment-production.up.railway.app
🌍 Frontend Origin: https://genbyte-five.vercel.app
📤 [POST] https://cozy-fulfillment-production.up.railway.app/api/auth/login
🔐 JWT Token added to request
✅ Response 200: https://cozy-fulfillment-production.up.railway.app/api/auth/login
```

**Should NOT see:**
```
❌ Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy
```

---

## 🔍 Troubleshooting

### Issue: Still Getting CORS Errors

1. **Clear cache and hard refresh:**
   - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Check if Railway backend is running:**
   - Visit: https://cozy-fulfillment-production.up.railway.app/
   - Should see JSON response with API info

3. **Check Railway logs for errors:**
   - Go to Railway dashboard → Your project → Logs
   - Look for "✅ MongoDB Connected"

4. **Verify environment variables in Railway:**
   - Go to Railway dashboard → Your project → Variables
   - Make sure all env vars are set correctly

### Issue: Login Works But Can't Access Dashboard

This means:
- CORS is working ✅
- Authentication might have other issues

Check:
1. Is the JWT token being saved? (Open DevTools → Application → localStorage)
2. Are requests including the Authorization header? (Check Network tab)
3. Is backend responding with 200 or error? (Check Network tab)

### Issue: 401 Unauthorized Error

1. Clear localStorage: `localStorage.clear()` in console
2. Try logging in again
3. Verify `JWT_SECRET` is the same in backend `.env` and Railway

### Issue: 500 Server Error from Backend

Check Railway logs:
```
❌ Error: [error message]
```

Common causes:
- MongoDB connection failed (check `MONGO_URI`)
- Missing environment variable
- Route handler error

---

## 📡 How CORS Works Now

### Preflight Request (Browser Auto-Sends)
```
OPTIONS /api/auth/login
Origin: https://genbyte-five.vercel.app
Access-Control-Request-Method: POST
```

### Backend Response
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://genbyte-five.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, ...
Access-Control-Allow-Credentials: true
```

### Actual Request (Browser Auto-Sends)
```
POST /api/auth/login
Authorization: Bearer [your-jwt-token]
Content-Type: application/json
```

**If CORS headers are missing**, the browser blocks the entire request.

---

## 🔐 Security Notes

1. **Never commit `.env`** - It contains secrets
2. **Use `.env.production`** for public env vars only (API URL is OK)
3. **Railway environment variables** are private and secure
4. **whitelist Vercel domain** - Only allow your frontend
5. **Do NOT expose JWT_SECRET** - Keep it in backend `.env` only

---

## ✅ Production Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] CORS errors gone from browser console
- [ ] Login/Signup works end-to-end
- [ ] Dashboard loads user data
- [ ] Admin can upload files (if applicable)
- [ ] JWT token persists across page refresh
- [ ] Logout clears token properly

---

## 📝 Environment Variables Reference

### Frontend (`.env.production`)
```env
VITE_API_URL=https://cozy-fulfillment-production.up.railway.app
```

### Backend (Railway Dashboard)
```env
MONGO_URI=mongodb+srv://genbyte-admin:33556677_AM@genbyte.2smdab1.mongodb.net/genbyte?retryWrites=true&w=majority&appName=genbyte
JWT_SECRET=genbyte_super_secret_key_2026
CLOUDINARY_CLOUD_NAME=dshkhf5r9
CLOUDINARY_API_KEY=424868636162538
CLOUDINARY_API_SECRET=chgKpmXkqVDwVjsw1lghXThRrN0
```

---

## 🎓 Understanding the Key Changes

### Why `withCredentials: true`?

```javascript
// ❌ WITHOUT withCredentials
axios.get('/api/auth/login')
// Browser will NOT send cookies or Authorization header
// JWT won't work!

// ✅ WITH withCredentials
const api = axios.create({ withCredentials: true })
api.get('/api/auth/login')
// Browser WILL send cookies and Authorization header
// JWT works perfectly!
```

### Why CORS Must Be First?

```javascript
// ❌ WRONG ORDER
app.use(express.json())     // Parses body
app.use(cors())             // Handles CORS
// Preflight OPTIONS requests fail because body parser runs first!

// ✅ CORRECT ORDER
app.use(cors())             // Handle CORS preflight
app.use(express.json())     // Then parse body
// OPTIONS requests are handled by CORS, don't go to body parser
```

### Why Multiple Origins?

```javascript
origin: [
  'https://genbyte-five.vercel.app',  // Production (Vercel)
  'http://localhost:5173',             // Development (Vite)
  'http://localhost:5174',             // Alternate dev port
]
// Each origin needs explicit allowance
// Wildcard '*' breaks credentials!
```

---

## 🆘 Need Help?

1. **Check browser DevTools Console** - First clue is always there
2. **Check Railway Logs** - Second clue is backend logs
3. **Check Network Tab** - See exact request/response
4. **Test API directly** - Visit `https://[your-railway-url]/api/health`

---

## 🎉 What Should Happen

After deployment, when you try to login:

```javascript
// 1. Browser auto-sends preflight
OPTIONS /api/auth/login

// 2. Backend responds with CORS headers
✅ Access-Control-Allow-Origin: https://genbyte-five.vercel.app

// 3. Browser sends actual request
POST /api/auth/login
Authorization: Bearer [token]

// 4. Backend responds with 200 + user data
✅ {"user": {...}, "token": "..."}

// 5. Frontend saves token
localStorage.setItem('token', new_token)

// 6. Future requests include token
Authorization: Bearer [saved_token]

// 7. You're logged in! 🎉
```

---

**Last Updated:** 2026-04-08  
**Status:** Production Ready ✅
