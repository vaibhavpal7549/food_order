# 🍔 Food Order App (Full Stack)

A modern full-stack Food Ordering Web Application where users can explore food items, add them to cart, and place orders easily. This project is designed to simulate real-world platforms like Swiggy/Zomato.

---

## 🚀 Live Status

🚧 Currently in Development (Backend Initialized)

---

## ✨ Features

### 👤 User Features

* 🔐 User Authentication (Signup/Login with JWT)
* 🍽️ Browse Food Items
* 🛒 Add to Cart
* 📦 Place Orders
* 📜 View Order History

### 🛠️ Admin Features (Planned)

* ➕ Add Food Items
* ✏️ Edit Food Items
* ❌ Delete Food Items
* 📊 Admin Dashboard
* 📦 Order Management

---

## 🧠 Tech Stack

### 💻 Frontend (Planned)

* Next.js
* Tailwind CSS
* Axios

### ⚙️ Backend

* Node.js
* Express.js

### 🗄️ Database

* MongoDB (Atlas)

### 🔐 Authentication

* JWT (JSON Web Token)
* Bcrypt.js

---

## 📁 Folder Structure

```
food_order/
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Food.js
│   │   ├── Order.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
├── frontend/ (Coming Soon)
│
└── README.md
```

---

## ⚙️ Installation & Setup Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/vaibhavpal7549/food_order.git
cd food_order
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

---

### 3️⃣ Create Environment File (.env)

Create a `.env` file inside the backend folder and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

### 4️⃣ Run Backend Server

```bash
npm start
```

Server will run on:
http://localhost:8000

---

## 🔗 API Endpoints

### 🔐 Authentication APIs

* POST `/api/auth/register` → Register User
* POST `/api/auth/login` → Login User

### 🍔 Food APIs

* GET `/api/food` → Get all food items
* POST `/api/food` → Add food item (Admin)

### 📦 Order APIs

* POST `/api/order` → Place order
* GET `/api/order/user` → Get user orders

---

## 🔄 Workflow

1. User registers/logins
2. User browses food items
3. Adds items to cart
4. Places order
5. Order stored in database

---

## 🚧 Future Enhancements

* 💳 Payment Integration (Razorpay / Stripe)
* 📡 Real-time Order Tracking (Socket.IO)
* ⭐ Ratings & Reviews System
* 📱 Fully Responsive UI
* 🔔 Notifications (Email/SMS)
* 🌐 Multi-vendor support
* 🤖 AI-based Food Recommendation System

---

## 🌍 Deployment Plan

Frontend → Vercel
Backend → Render / Railway
Database → MongoDB Atlas

---

## 🛡️ Security Features

* Password Hashing using Bcrypt
* JWT-based Authentication
* Protected Routes (Middleware)
* Environment Variables for sensitive data

---

## 🤝 Contributing

Contributions are welcome!

Steps:

1. Fork the repo
2. Create a new branch
3. Make changes
4. Submit a Pull Request

---

## 👨‍💻 Author

Vaibhav Pal

GitHub: https://github.com/vaibhavpal7549
LinkedIn: https://linkedin.com/in/vaibhavpal7549

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---

## 📌 Note

This project is being built as a real-world scalable application and will be continuously improved with advanced features.
