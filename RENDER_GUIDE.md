# 🚀 Render & MongoDB Atlas Deployment Guide

This guide will help you deploy your **NestJS CMS Backend** to the internet for free using Render (for the server) and MongoDB Atlas (for the database).

---

## 🟢 Part 1: MongoDB Atlas Setup (Database)
We need a database that is accessible from the internet, not just `localhost`.

1.  **Create Account:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up (Free).
2.  **Create Cluster:**
    *   Choose **Shared (FREE)** option.
    *   Provider: AWS.
    *   Region: Choose one close to you (e.g., Singapore).
    *   Click **Create Cluster**.
3.  **Create Database User:**
    *   Go to **Database Access** (sidebar).
    *   Click **Add New Database User**.
    *   Username: `admin` (or whatever you want).
    *   Password: **Create a strong password** and **COPY IT** immediately.
    *   Role: Read and write to any database.
    *   Click **Add User**.
4.  **Network Access (IP Whitelist):**
    *   Go to **Network Access** (sidebar).
    *   Click **Add IP Address**.
    *   Select **Allow Access From Anywhere** (`0.0.0.0/0`).
    *   Click **Confirm**. *(This is required so Render can connect).*
5.  **Get Connection String:**
    *   Go to **Database** (sidebar).
    *   Click **Connect** on your cluster.
    *   Select **Drivers**.
    *   Copy the string like: `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    *   **Replace `<password>`** with your real password.
    *   **Save this URI!** You will need it for Render.

---

## 🟢 Part 2: Render.com Setup (Server)
Now we upload your code to Render.

1.  **Push Code to GitHub:**
    *   Make sure your project is pushed to a GitHub repository.
2.  **Create Web Service:**
    *   Go to [Render Dashboard](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
3.  **Configure Service:**
    *   **Name:** `cms-backend` (or similar).
    *   **Region:** Singapore (or same as MongoDB).
    *   **Branch:** `main`.
    *   **Runtime:** `Node`.
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm run start:prod`
    *   **Plan:** Free.
4.  **Environment Variables (Important!):**
    *   Scroll down to **Environment Variables**.
    *   Click **Add Environment Variable** for each:
        *   Key: `MONGO_URI` | Value: (Paste your MongoDB Connection String from Part 1)
        *   Key: `JWT_SECRET` | Value: `supersecuresecretkey` (or any long string)
5.  **Deploy:**
    *   Click **Create Web Service**.

---

## 🟢 Part 3: Verification
Render will start building your app. Watch the logs.

1.  **Wait for:** `Nest application successfully started` in the logs.
2.  **Get URL:** Look for your deployed URL at the top (e.g., `https://cms-backend-xv32.onrender.com`).
3.  **Test:**
    *   Open Postman.
    *   Replace `http://localhost:3000` with your **new Render URL**.
    *   Try to **Login** (`POST /auth/login`).
    *   If you get a token, **IT WORKS!** 🎉

---

## ❓ Common Errors & Fixes

**Error: "MongoTimeoutError: Server selection timed out"**
*   **Fix:** Did you do Part 1 Step 4? Allow Access From Anywhere (`0.0.0.0/0`) in MongoDB Network Access is mandatory.

**Error: "Authentication Failed"**
*   **Fix:** Check your `MONGO_URI` in Render. Did you replace `<password>` with the real password? Did you remove the `< >` brackets?

**Error: "App crashes immediately"**
*   **Fix:** Check Environment Variables. Make sure `JWT_SECRET` is set. Check logs for details.
