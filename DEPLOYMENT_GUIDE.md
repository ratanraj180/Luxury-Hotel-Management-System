# 🚀 Web Server Deployment Guide (Vercel & Render)

Streamlit is not capable of running your Javascript MERN application. However, deploying your project properly is extremely easy (and free!).

There are two pieces to your project:
1. **The Backend (Node.js)**: Holds the logic and database connections.
2. **The Frontend (React.js)**: Holds the visual Interface.

We will deploy the Backend to **Render.com** and the Frontend to **Vercel.com**.

## Step 1: Deploy Database & Backend (Render.com)
1. Go to [Render.com](https://render.com/) and create a free account.
2. Ensure your MongoDB cluster is running on MongoDB Atlas (if you don't have Atlas, sign up at [mongodb.com](https://www.mongodb.com/) for a free database cluster and get your connection string URI).
3. On Render, click **Create New Web Service**.
4. Connect the GitHub repository `Luxury-Hotel-Management-System`.
5. Specify the Root Directory as `backend`.
6. Use the Build Command: `npm install`
7. Use the Start Command: `node server.js`
8. **CRITICAL**: Go to "Environment Variables" and add:
   - `MONGODB_URI` = (Your MongoDB Atlas connection URL)
9. Click **Deploy**! Once finished, Render will give you a live URL (e.g. `https://luxury-hotel-api.onrender.com`). Copy this URL!

## Step 2: Deploy Frontend Interface (Vercel.com)
1. Go to [Vercel.com](https://vercel.com/) and create a free account using your GitHub.
2. Click **Add New Project** and select `Luxury-Hotel-Management-System`.
3. Locate the "Framework Preset" and make sure **Vite** is selected.
4. Set the Root Directory to `frontend`.
5. Expand "Environment Variables" and add:
   - `VITE_API_URL` = `https://luxury-hotel-api.onrender.com/api` (Replace with your actual Render URL ending in `/api`).
6. Click **Deploy**!

In less than 5 minutes, Vercel will give you a final, beautiful public URL that you can send directly to your friends and faculty!
