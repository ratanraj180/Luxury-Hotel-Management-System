# 🏨 Global Hotel Luxury Management System

Welcome to the ultimate, enterprise-scale **Luxury Hotel Management System**, elegantly designed for a premium user experience and powered by an incredibly robust MERN stack architecture.

This full-stack application allows users to discover, filter, and book over 100 exquisite hotel rooms located in 25 iconic global destinations. Securely built with role-based authentication, the platform features a stunning glassmorphism design and a powerful Admin Control Center.

## ✨ Key Features

- **Global Exploration**: Discover properties seamlessly from Tokyo to Paris via dynamic, real-time dropdown filters.
- **Luxury Glassmorphism UI**: Beautifully frosted, semi-transparent overlays combined with high-resolution, rotating panoramic backdrops.
- **Smart Filtering**: Live filtering by specific Destination, Room Category (from Single to Presidential Suites), and adjustable sliding Budget Constraints.
- **Live Price Calculators**: Automated calculation engines that scale stay prices dependent on selected Check-In and Check-Out intervals.
- **Admin Control Center**: A secure operational dashboard utilizing JWT authentication. Faculty / Admins can execute complete CRUD operations (Create, Read, Update, Delete) on vast amounts of rooms, properties, cities, and guest bookings across the globe.

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, React Router, Axios, Custom Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Security**: JSON Web Tokens (JWT) & bcryptjs Password Hashing

---

## 🚀 Quick Start Guide

You easily run this fully functional, populated application directly on your local machine using the instructions below!

### Prerequisites
- Node.js installed
- MongoDB installed locally (running on `mongodb://localhost:27017`)

### 1. Backend Setup

Open a terminal and start the backend:
```bash
cd backend
npm install
npm run dev
```

**Seed the Global Database** (Only run once!):
To automatically flood the database with over 100 properties, 25 global destination cities, and generate the default Admin Account:
```bash
node seed.js
```

### 2. Frontend Setup

Open a second, separate terminal and start the frontend UI:
```bash
cd frontend
npm install
npm run dev
```

Your browser will automatically open the platform, or you can navigate to `http://localhost:5173/`.

### 3. Administrator Access

To securely test the Admin Dashboard and operational capabilities:
1. Navigate to **Login**.
2. **Email**: `admin@hotel.com`
3. **Password**: `admin123`
4. A new **Dashboard** link will illuminate in your top navigation bar.

---
*Architected and Designed for Excellence.*
