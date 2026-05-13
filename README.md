# ⚡ Echo — Full-Stack MERN E-Commerce Platform
### Premium Tech Gadgets with Loyalty Rewards System

**By:** Khalid Jamil (Roll No: 230613000417)    
**Stack:** MongoDB · Express.js · React.js · Node.js

---

## ✨ Features

| Feature | Minor Project | Major Project (MERN) |
|---------|:---:|:---:|
| Database | localStorage | ✅ MongoDB Atlas |
| Authentication | Fake | ✅ Real JWT + bcrypt |
| Products | Hardcoded HTML | ✅ Dynamic from DB |
| Search & Filter | ❌ | ✅ By name, category, price |
| Shopping Cart | localStorage | ✅ React state |
| Orders | Nothing saved | ✅ Saved to MongoDB |
| Order History Page | ❌ | ✅ Full page |
| Loyalty Points | localStorage | ✅ Saved to MongoDB |
| Rewards Store | localStorage | ✅ Saved to MongoDB |
| Email Notifications | ❌ | ✅ Welcome, Order, Reward |
| Payment Gateway | ❌ | ✅ Razorpay (Indian) |
| Admin Panel | ❌ | ✅ Add/Edit/Delete + Orders |
| Deployment | Static only | ✅ Render + Vercel |

---

## 📁 Project Structure

```
echo-fullstack/
├── backend/
│   ├── config/db.js              ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     ← Register, Login, GetMe
│   │   ├── productController.js  ← CRUD for products
│   │   ├── orderController.js    ← Razorpay + Orders
│   │   └── rewardController.js   ← Rewards redemption
│   ├── middleware/auth.js        ← JWT verify + Admin check
│   ├── models/
│   │   ├── User.js / Product.js / Order.js / Reward.js
│   ├── routes/
│   │   ├── auth.js / products.js / orders.js / rewards.js
│   ├── utils/
│   │   ├── emailService.js       ← Nodemailer + HTML templates
│   │   └── seeder.js             ← Seeds 9 products + admin user
│   ├── server.js
│   └── .env.example
│
└── frontend/
    └── src/
        ├── components/           ← Navbar, AuthModal, CartModal, RewardsModal, ProductCard
        ├── context/AppContext.jsx ← Global state (user, cart)
        ├── pages/                ← Home, Products, OrderHistory, AdminPanel
        ├── utils/api.js          ← Axios + JWT interceptor
        ├── App.jsx / main.jsx / index.css
```

---

## 🛠️ LOCAL SETUP (Step by Step)

### STEP 1 — MongoDB Atlas (5 minutes, free)

1. Go to https://mongodb.com/atlas → Sign up free
2. Create **Free Cluster** (M0 Sandbox)
3. Database Access → Add user with password
4. Network Access → Add IP `0.0.0.0/0`
5. Connect → Drivers → Copy connection string

---

### STEP 2 — Backend Setup

```bash
cd echo-fullstack/backend
npm install
cp .env.example .env        # Mac/Linux
copy .env.example .env      # Windows
```

**Fill in your `.env`:**
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/echo_db
JWT_SECRET=echo_my_secret_key_change_this
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM=Echo Store <yourgmail@gmail.com>
```

```bash
npm run seed    # Adds 9 products + admin user to MongoDB
npm run dev     # Start server → http://localhost:5000
```

---

### STEP 3 — Frontend Setup

```bash
cd echo-fullstack/frontend
npm install
cp .env.example .env
```

**Fill in your `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

```bash
npm run dev    # Start frontend → http://localhost:5173
```

---

### 🔑 Default Admin Account
- **Email:** admin@echo.com
- **Password:** admin123

---

## 💳 Razorpay Test Setup

1. Sign up at https://dashboard.razorpay.com (free)
2. Stay in Test Mode
3. Settings → API Keys → Generate Test Key
4. Add Key ID + Secret to both `.env` files
5. Use test card: `4111 1111 1111 1111` | Any expiry | CVV: `123` | OTP: `1234`

> If Razorpay is not configured, checkout auto-uses **simulation mode** — order is still saved with loyalty points awarded.

---

## 📧 Gmail Email Setup

1. Google Account → Security → Enable 2-Step Verification
2. Security → App Passwords → Create password for "Echo App"
3. Copy the 16-character password → paste as `EMAIL_PASS` in `.env`

> If email is not configured, app works fine — emails are just skipped with a console log.

---

## 🌐 FREE DEPLOYMENT

### Backend → Render.com

1. Push code to GitHub
2. Render.com → New Web Service → Connect repo
3. Root Directory: `backend` | Build: `npm install` | Start: `npm start`
4. Add all environment variables from `.env`
5. Deploy → copy your Render URL

### Frontend → Vercel.com

1. Vercel.com → New Project → Import repo
2. Root Directory: `frontend` | Framework: Vite
3. Environment Variables:
   - `VITE_API_URL` = `https://your-render-url.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID` = your Razorpay key
4. Deploy → copy your Vercel URL

### Final Step
Update `FRONTEND_URL` on Render to your Vercel URL.

**Run seeder on Render:** Render dashboard → Shell → `node utils/seeder.js`

---

## 📡 API Endpoints

```
AUTH
  POST  /api/auth/register              Register (sends welcome email)
  POST  /api/auth/login                 Login
  GET   /api/auth/me                    Get current user

PRODUCTS
  GET   /api/products                   Get all
  GET   /api/products?search=echo       Search
  GET   /api/products?category=earbuds  Filter
  GET   /api/products?sort=price-low    Sort
  POST  /api/products                   Create (Admin)
  PUT   /api/products/:id               Update (Admin)
  DELETE /api/products/:id              Delete (Admin)

ORDERS
  POST  /api/orders/simulate            Place order (no payment needed)
  POST  /api/orders/create-razorpay-order
  POST  /api/orders/verify-payment
  GET   /api/orders/my-orders           User history
  GET   /api/orders                     All orders (Admin)

REWARDS
  GET   /api/rewards                    Catalog + user points
  POST  /api/rewards/redeem             Redeem (sends email)
  GET   /api/rewards/my-rewards         User's rewards
```

---

## 📧 Email Notifications

| Trigger | Subject | Content |
|---------|---------|---------|
| Register | Welcome to Echo! | Account info + loyalty rewards intro |
| Checkout | Order Confirmed | Order ID, items, total, points earned |
| Redeem Reward | Reward Redeemed | Reward name + voucher code |

All emails use beautiful responsive HTML templates with Echo branding.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Axios, Bootstrap 5 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Payment | Razorpay |
| Email | Nodemailer (Gmail) |
| Deployment | Vercel (frontend), Render (backend) |

---

## 👨‍💻 Developer

**Khalid Jamil**
