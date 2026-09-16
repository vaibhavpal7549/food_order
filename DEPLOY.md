# 🌐 Complete Deployment Guide: Backend & Frontend on Render

This guide provides step-by-step instructions for deploying both the **Backend API** and **Frontend React (Vite) App** on **Render.com**.

---

## 🏗️ Architecture Overview

| Component | Technology | Render Service Type | Host / URL Format |
| :--- | :--- | :--- | :--- |
| **Backend** | Node.js + Express API | **Web Service** | `https://food-order-backend.onrender.com` |
| **Frontend** | React (Vite) + Redux Toolkit | **Static Site** | `https://food-order-frontend.onrender.com` |
| **Database** | MongoDB Atlas | Cloud Database | MongoDB Atlas URI |
| **Media** | Cloudinary | Media Storage | Cloudinary API |

---

## 📋 1. Pre-Deployment Checklist

1. **GitHub Repository**: Push your code to GitHub (`food_order`).
2. **MongoDB Atlas IP Access**: In MongoDB Atlas ➔ Security ➔ Network Access ➔ Add IP Address ➔ Select `0.0.0.0/0` (Allow Access from Anywhere).
3. **Cloudinary Credentials**: Cloud Name, API Key, and API Secret.
4. **Stripe & Email Credentials**: Stripe secret key & publishable key.

---

## ⚙️ 2. Step 1: Deploy Backend (Render Web Service)

### 2.1 Create Web Service
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository: `food_order`.
4. Configure backend settings:
   - **Name**: `food-order-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Nearest to your users (e.g. Singapore / Frankfurt)
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

### 2.2 Configure Backend Environment Variables
Under the **Environment** tab of your backend Web Service, add:

| Key | Example / Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `8000` |
| `MONGO_ATLAS_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `FRONTEND_URL` | `https://food-order-frontend.onrender.com` *(Without trailing slash `/`)* |
| `JWT_SECRET` | `your_secure_random_jwt_secret` |
| `JWT_EXPIRES_TIME` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | `your_cloudinary_cloud_name` |
| `CLOUDINARY_API_KEY` | `your_cloudinary_api_key` |
| `CLOUDINARY_API_SECRET` | `your_cloudinary_api_secret` |
| `STRIPE_SECRET_KEY` | `sk_live_or_test_key` |
| `STRIPE_API_KEY` | `pk_live_or_test_key` |

5. Click **Deploy Web Service**.
6. Copy your live Backend URL (e.g. `https://food-order-backend-zwfc.onrender.com`).

---

## 🎨 3. Step 2: Deploy Frontend (Render Static Site)

### 3.1 Create Static Site
1. On Render Dashboard, click **New +** ➔ **Static Site**.
2. Connect the same GitHub repository: `food_order`.
3. Configure frontend settings:
   - **Name**: `food-order-frontend` (or your choice)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Branch**: `main`

### 3.2 Configure Frontend Environment Variable
Under the **Environment** tab of your frontend Static Site, add:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://food-order-backend-zwfc.onrender.com/api` |

*(Replace with your actual Render backend URL followed by `/api`)*

### 3.3 Add SPA Rewrite Rule (Fix 404 on Page Refresh)
1. On your Frontend Static Site page on Render, go to **Redirects / Rewrites**.
2. Click **Add Rule**.
3. Configure rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
4. Click **Save Changes**.

4. Click **Create Static Site**.

---

## 🔄 4. Step 3: Link Backend & Frontend (CORS Setup)

1. Copy your Live Frontend URL (e.g. `https://food-order-frontend.onrender.com`).
2. Go back to Render Dashboard ➔ **Backend Web Service** ➔ **Environment**.
3. Update `FRONTEND_URL` variable to your frontend Render URL:
   ```env
   FRONTEND_URL=https://food-order-frontend.onrender.com
   ```
   *(Ensure no trailing slash `/` at the end)*
4. Click **Save Changes** (Render will automatically redeploy the backend).

---

## ✅ 5. Verification & Testing

Once both services are live on Render:
1. Open your Frontend URL (`https://food-order-frontend.onrender.com`).
2. Check browser Developer Console (F12) ➔ Network tab to verify API calls reach `https://food-order-backend-zwfc.onrender.com/api/...`.
3. Register a user, upload avatar, place food order, and test Stripe payment flow.

---

## 🛠️ Common Troubleshooting

- **CORS Error**: Ensure `FRONTEND_URL` in backend env matches your exact frontend Render URL **without trailing slash** (`/`).
- **404 Page Refresh Error**: Ensure Render Static Site has the **Rewrite rule** (`/*` ➔ `/index.html`).
- **API Failures**: Ensure `VITE_API_BASE_URL` in frontend env ends with `/api` (e.g., `https://food-order-backend-zwfc.onrender.com/api`).
