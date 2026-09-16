# 🍕 OrderIt - Full Stack Food Delivery & Restaurant Platform with AI & Stripe

OrderIt is a feature-rich, scalable MERN stack web application built for seamless food ordering and multi-restaurant management. It features **AI-powered copywriting & review sentiment analysis**, **Stripe Checkout Payment Gateway integration**, and **real-time admin management tools**.

---

## ✨ Key Features & Capabilities

### 🤖 1. AI-Powered Intelligence (Groq Llama-3.1 & Dynamic Engine)
- **✨ AI Restaurant Description Generator**: Generates catchy, creative restaurant descriptions strictly under 200 characters with a live remaining character indicator (`(200 left)`).
- **✨ AI Dish Description Generator**: Generates appetizing food item descriptions strictly under 150 characters with live character countdown (`(150 left)`).
- **📊 AI Customer Review Analyzer**: Automatically evaluates restaurant reviews, generating sentiment scores, bulleted key takeaways, and top mentioned dishes.
- **⚡ Smart Dynamic Copywriting Fallback**: Includes a built-in category-aware copywriting engine that guarantees unique, high-variety fallback descriptions if API keys are absent or offline.

### 💳 2. Stripe Payment Gateway Integration
- **Stripe Checkout Session**: Complete cart checkout with line item calculation, shipping options, and INR currency support.
- **Dynamic Origin Redirects**: Uses dynamic origin resolution (`req.headers.origin`) ensuring users seamlessly return to the active frontend domain/port (`/success?session_id=...`).
- **Duplicate Prevention & Verification**: Verifies Stripe session `payment_status` before creating order records in MongoDB.

### 👑 3. Admin & Restaurant Owner Dashboard
- **Restaurant Management**:
  - **Create Restaurant**: Add new restaurants with name, address, description (manual or AI-generated), pure veg toggle, geo-coordinates, and custom images.
  - **Edit Restaurant**: Modify all restaurant details dynamically without page reloads.
  - **Delete Restaurant**: Easily remove restaurants from the platform.
- **Multi-Category Menu Management**:
  - Add multiple menu categories (*Starters, Main Course, Beverages, Pastries, etc.*) per restaurant.
  - Delete individual menu categories without affecting other menu groups.
- **Food Item Management**:
  - **Create Food Item**: Add items under specific menu categories with price, stock, description (with AI generator), and image URL.
  - **Edit Food Item**: Update name, price, description, stock, and images anytime with live auto-refresh.
  - **Delete Food Item**: Remove individual food items safely.

### 👤 4. Customer Features & UX
- **Explore & Search**: Search restaurants by keyword, filter 100% Pure Veg options, and sort by ratings or review counts.
- **Cart Management**: Real-time stock validation, quantity adjusters, and cart summary calculations.
- **Header Navigation**: Quick **Home** navigation link in both top header bar and user profile dropdown menu for effortless navigation from any screen.
- **User Profile & Order History**: Update avatar images (Cloudinary integration), track order status, and review past orders.
- **Smart Toast Alerts**: Clean single-instance notifications (`ToastContainer limit={1}`) with deduplication to prevent stacked warning messages.

---

## 🛠️ Tech Stack

### 💻 Frontend
- **Framework & Build**: React 18, Vite
- **State Management**: Redux Toolkit (Slices & Async Thunks)
- **Routing**: React Router v6
- **UI & Icons**: Bootstrap 5, FontAwesome, CSS3
- **Notifications**: React Toastify

### ⚙️ Backend
- **Runtime**: Node.js, Express.js (CommonJS)
- **Database**: MongoDB Atlas with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) with HTTP-Only Cookies & Bearer Tokens, Bcrypt.js
- **Media Storage**: Cloudinary SDK

### 🔌 Third-Party APIs
- **AI Models**: Groq API (`llama-3.1-8b-instant`)
- **Payments**: Stripe Node SDK (`stripe checkout.sessions`)

---

## 📁 Project Structure

```
Food_Order_Project/
├── backend/
│   ├── config/             # Config files (config.env, cloudinary.js)
│   ├── controllers/        # Route controllers (auth, restaurant, menu, foodItem, order, payment, ai)
│   ├── middlewares/        # Auth, Role Authorization, CatchAsync, ErrorHandler
│   ├── models/             # Mongoose Schemas (user, restaurant, menu, foodItem, order, cartModel)
│   ├── routes/             # Express Route definitions (/api/v1/*)
│   ├── services/           # External Services (ai.service.js, aiReviewAnalyzer.js)
│   ├── utils/              # Utility functions & Database Seeders
│   ├── app.js              # Express app setup & middleware mounting
│   └── server.js           # Server startup script
│
├── frontend/
│   ├── src/
│   │   ├── Components/     # React Components (Home, Restaurant, Menu, Fooditem, Cart, Admin, User)
│   │   ├── redux/          # Redux Toolkit Store, Slices & Async Actions
│   │   ├── utils/          # Axios API Instance (api.js)
│   │   ├── App.jsx         # App routes & main layout
│   │   └── main.jsx        # App entrypoint
│   └── vite.config.js      # Vite build & proxy settings
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/vaibhavpal7549/food_order.git
cd food_order
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create `backend/config/config.env` with your credentials:
```env
PORT=8000
NODE_ENV=development
DB_LOCAL_URI=mongodb://127.0.0.1:27017/food_order
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_TIME=7d
COOKIE_EXPIRES_TIME=7
FRONTEND_URL=http://localhost:5173

# Stripe Credentials
STRIPE_SECRET_KEY=sk_test_...
STRIPE_API_KEY=pk_test_...

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Engine Credentials
GROQ_API_KEY=gsk_...
```

Run Backend Dev Server:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔗 Key API Routes (`/api/v1/*`)

| Endpoint | Method | Description | Access |
|---|---|---|---|
| `/api/v1/users/login` | POST | User Login | Public |
| `/api/v1/users/signup` | POST | User Signup | Public |
| `/api/v1/eats/stores` | GET | Get All Restaurants | Public |
| `/api/v1/eats/stores` | POST | Create New Restaurant | Admin |
| `/api/v1/eats/stores/:storeId` | PATCH | Edit Restaurant Details | Admin |
| `/api/v1/eats/stores/:storeId/menus` | GET | Get Restaurant Menus | Public |
| `/api/v1/eats/stores/:storeId/menus` | POST | Add Menu Category | Admin |
| `/api/v1/eats/item` | POST | Create Food Item | Admin |
| `/api/v1/eats/item/:foodId` | PATCH | Edit Food Item Details | Admin |
| `/api/v1/payment/process` | POST | Initiate Stripe Checkout | Authenticated |
| `/api/v1/ai/generate-restaurant-ai` | POST | Generate AI Restaurant Description | Admin |
| `/api/v1/ai/generate-food-ai` | POST | Generate AI Dish Description | Admin |
| `/api/v1/ai/admin/restaurants/:id/analyze` | PUT | Analyze Customer Reviews with AI | Admin |

---

## 👨‍💻 Author

**Vaibhav Pal**
- **GitHub**: [vaibhavpal7549](https://github.com/vaibhavpal7549)
