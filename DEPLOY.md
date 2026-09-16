# 🌐 Production Deployment Guide (Food Order Project)

This guide provides step-by-step instructions for deploying the **Full-Stack Food Order Web Application** to production hosting platforms.

---

## 🏗️ Architecture Overview

| Component | Technology | Recommended Hosting Platform |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) + Redux Toolkit | **Vercel** / Netlify / Render Static |
| **Backend** | Node.js + Express API | **Render** / Railway / AWS App Runner |
| **Database** | MongoDB Atlas | **MongoDB Atlas Cloud** |
| **Media Storage** | Cloudinary | **Cloudinary Media Cloud** |

---

## 📋 1. Pre-Deployment Checklist

Before deploying, make sure you have:
1. **GitHub Repository**: Push your code to a GitHub repository.
2. **MongoDB Atlas IP Access**: In MongoDB Atlas -> Security -> Network Access -> Add IP Address -> Select `0.0.0.0/0` (Allow Access from Anywhere) so cloud hosting platforms can connect to Atlas.
3. **Cloudinary Account**: Keep your Cloud Name, API Key, and API Secret ready.
4. **Stripe & Email Credentials**: Stripe secret key & SMTP credentials.

---

## ⚙️ 2. Step 1: Deploying Backend (Render)

### Step 1.1: Create Web Service on Render
1. Sign in to [Render](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `food_order`.
4. Configure the service parameters:
   - **Name**: `food-order-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Nearest to your users (e.g. Singapore or Frankfurt)
   - **Branch**: `main` (or `master`)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

### Step 1.2: Add Backend Environment Variables
Under the **Environment** tab on Render, add the following variables:

| Key | Example / Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `8000` |
| `MONGO_ATLAS_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/?appName=App` |
| `FRONTEND_URL` | `https://your-frontend-app.vercel.app` *(Update after deploying frontend)* |
| `JWT_SECRET` | `your_secure_random_jwt_secret` |
| `JWT_EXPIRES_TIME` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | `your_cloudinary_cloud_name` |
| `CLOUDINARY_API_KEY` | `your_cloudinary_api_key` |
| `CLOUDINARY_API_SECRET` | `your_cloudinary_api_secret` |
| `STRIPE_SECRET_KEY` | `sk_live_or_test_key` |
| `STRIPE_API_KEY` | `pk_live_or_test_key` |

5. Click **Create Web Service**.
6. Once deployed, copy your Live Backend URL (e.g. `https://food-order-backend.onrender.com`).

---

## 🎨 3. Step 2: Deploying Frontend (Vercel)

### Step 2.1: Import Project to Vercel
1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `food_order`.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2.2: Add Single Page App (SPA) Rewrite Rule
Create `frontend/vercel.json` to handle client-side routing (`react-router-dom`):

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2.3: Configure Vite API Proxy / Base URL
If using production API routing, update `FRONTEND_URL` in backend environment variables to match your Vercel URL (e.g. `https://food-order-app.vercel.app`).

5. Click **Deploy**.

---

## 🔄 4. Step 3: Link Backend & Frontend (Final CORS Setup)

1. Copy your Vercel Frontend URL (e.g. `https://food-order-app.vercel.app`).
2. Go back to Render -> Backend Service -> **Environment**.
3. Update `FRONTEND_URL` variable:
   ```env
   FRONTEND_URL=https://food-order-app.vercel.app
   ```
4. Save changes and redeploy backend.

---

## ✅ 5. Verification & Testing

Once deployed:
1. Open your Live Frontend App URL.
2. Register a new user account (with Avatar image).
3. Verify MongoDB Atlas connects cleanly and saves user documents.
4. Verify Cloudinary receives uploaded images.
5. Place a test order and check Stripe checkout session flow.

---

## 🛠️ Production Troubleshooting

- **CORS Error (`Access-Control-Allow-Origin`)**: Ensure `FRONTEND_URL` in backend `.env` matches your exact Vercel frontend domain without trailing slash `/`.
- **`querySrv ECONNREFUSED`**: Ensure MongoDB Atlas Network Access has `0.0.0.0/0` added.
- **`Request entity too large`**: `express.json({ limit: '50mb' })` is configured in `backend/app.js` to allow avatar uploads.
- **404 on Page Refresh**: Ensure `vercel.json` rewrites rule is placed inside `frontend/`.
