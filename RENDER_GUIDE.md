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

## 🟢 Part 2: Cloudinary Setup (Image Storage)
We use Cloudinary to store images because Render deletes local files after restarts.

1.  **Sign Up:** Go to [Cloudinary](https://cloudinary.com/) and create a free account.
2.  **Dashboard:** Look at the "Account Details" on the Dashboard.
3.  **Get Credentials:**
    *   Start copying:
    *   `Cloud Name`
    *   `API Key`
    *   `API Secret`

---

## 🟢 Part 3: Render.com Setup (Server)
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
        *   `MONGO_URI` : (Your MongoDB Connection String)
        *   `JWT_SECRET` : `supersecuresecretkey`
        *   `CLOUDINARY_CLOUD_NAME` : (From Cloudinary Dashboard)
        *   `CLOUDINARY_API_KEY` : (From Cloudinary Dashboard)
        *   `CLOUDINARY_API_SECRET` : (From Cloudinary Dashboard)
5.  **Deploy:**
    *   Click **Create Web Service**.

---

## 🟢 Part 4: Verification
Render will start building your app. Watch the logs.

1.  **Wait for:** `Nest application successfully started` in the logs.
2.  **Get URL:** Look for your deployed URL at the top (e.g., `https://cms-backend-xv32.onrender.com`).
3.  **Test:**
    *   Open Postman.
    *   Relogin to get a token.
    *   Try to **Upload Image**. It should return a Cloudinary URL (`https://res.cloudinary.com/...`).

---

## ❓ Common Errors & Fixes

**Error: "Cloudinary Upload Error"**
*   **Fix:** Check `CLOUDINARY_...` env vars in Render. Are they correct?

**Error: "MongoTimeoutError"**
*   **Fix:** Check MongoDB Network Access (`0.0.0.0/0`).

**Error: "App crashes immediately"**
*   **Fix:** Check `JWT_SECRET` and other env vars are present.
