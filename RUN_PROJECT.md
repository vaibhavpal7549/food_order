# 🚀 Project Run & Setup Guide (Food Order Project)

This guide provides step-by-step instructions to set up, configure, and run both the **Backend API** and **Frontend Application**.

---

## 📋 Prerequisites

- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **MongoDB Atlas Account** (or active connection string)

---

## ⚙️ 1. Environment Configuration

Ensure your `backend/config/config.env` file exists and contains the necessary environment variables:

```env
PORT=8000
NODE_ENV=development
MONGO_ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>
FRONTEND_URL=http://localhost:5173

# Authentication & Tokens
JWT_SECRET=YOUR_JWT_SECRET_KEY
JWT_EXPIRES_TIME=7d
COOKIE_EXPIRES_TIME=7

# Cloudinary Setup (For Image Uploads)
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

# Stripe Payment Setup
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_API_KEY=YOUR_STRIPE_PUBLIC_KEY

# Mail Configuration
SMTP_HOST=YOUR_SMTP_HOST
SMTP_PORT=2525
SMTP_EMAIL=YOUR_SMTP_EMAIL
SMTP_PASSWORD=YOUR_SMTP_PASSWORD
SMTP_FROM_EMAIL=noreply@zyka.com
SMTP_FROM_NAME=Zyka Food Order
```

---

## 📦 2. Installation

Install dependencies for both backend and frontend applications:

### Backend Dependencies
```bash
cd backend
npm install
```

### Frontend Dependencies
```bash
cd frontend
npm install
```

---

## 🏃 3. Running the Project

Open **two terminal windows/tabs**:

### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```
- **Backend API URL**: `http://localhost:8000`

### Terminal 2: Frontend Client
```bash
cd frontend
npm run dev
```
- **Frontend App URL**: `http://localhost:5173`

---

##  🌱 4. Database Seeding (Optional)

To seed initial food items into MongoDB Atlas:

```bash
cd backend
npm run seeder
```

---

## 🔍 5. Verification Links

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API Status**: [http://localhost:8000/api/v1/eats/stores](http://localhost:8000/api/v1/eats/stores)

---

## 🛠️ Common Troubleshooting

- **`querySrv ECONNREFUSED` error**: Ensured `dns.setServers(['8.8.8.8', '1.1.1.1'])` is configured in `backend/db.js` for Windows DNS compatibility.
- **Port Conflict**: If port `8000` or `5173` is in use, update `PORT` in `backend/config/config.env` or Vite config.
