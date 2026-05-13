# 🚀 Quick Start Guide

## Step 1: Check Backend is Running

Open Terminal 1:
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Echo Backend running on port 5000
```

**Test it:** Open http://localhost:5000 in browser
- Should show: `{"message": "🚀 Echo API is running!", "status": "OK"}`

If you see errors:
- `MongoDB Error` → Check your `backend/.env` has correct `MONGO_URI`
- `Port 5000 already in use` → Kill the process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)

---

## Step 2: Check Frontend is Running

Open Terminal 2:
```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in 234 ms
➜  Local:   http://localhost:5173/
```

**Test it:** Open http://localhost:5173 in browser
- Should show the Echo homepage

If you see errors:
- Check `frontend/.env` exists with `VITE_API_URL=http://localhost:5000/api`

---

## Step 3: Test Login

1. Click **Login** button in navbar
2. Use test credentials shown in the gold box:
   - Email: `admin@echo.com`
   - Password: `admin123`
3. Click **Sign In**

**What to check in browser console (F12):**
```
🔗 API configured: http://localhost:5000/api
📤 POST /auth/login (public)
✅ POST /auth/login - Success
```

---

## Common Issues

### ❌ "Network Error" / "Connection failed"
**Cause:** Backend not running
**Fix:** Start backend in Terminal 1 (see Step 1)

### ❌ "Invalid email or password"
**Cause:** No users in database yet
**Fix:** 
```bash
cd backend
npm run seed
```
This creates the admin user.

### ❌ "MongoDB Error"
**Cause:** Wrong connection string
**Fix:** 
1. Go to MongoDB Atlas → Connect → Drivers
2. Copy the connection string
3. Replace `<password>` with your actual password
4. Paste into `backend/.env` as `MONGO_URI`

### ❌ CORS errors in console
**Cause:** Backend `.env` has wrong `FRONTEND_URL`
**Fix:** In `backend/.env`, set:
```
FRONTEND_URL=http://localhost:5173
```

---

## Quick Test Checklist

- [ ] Backend running on :5000
- [ ] Frontend running on :5173
- [ ] Can open http://localhost:5000 and see API message
- [ ] Can open http://localhost:5173 and see homepage
- [ ] Database seeded (`npm run seed` in backend)
- [ ] Can login with admin@echo.com / admin123

---

## Need More Help?

Check browser console (F12) for detailed logs:
- `🔗` = API configuration
- `📤` = Outgoing request
- `✅` = Success
- `❌` = Error (read the message)
