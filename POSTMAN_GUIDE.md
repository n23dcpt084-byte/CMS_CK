# 🦅 Postman Testing Guide - NestJS CMS Backend

This guide will help you test your backend API using Postman. Follow these steps exactly to demonstrate your project.

---

## 🟢 Step 1: Login (Authentication)
**Goal:** Get a "Key" (JWT Token) so you can do Admin actions (Create/Delete/Update).

1.  Create a new Request in Postman.
2.  **Method:** select `POST`.
3.  **URL:** `http://localhost:3000/auth/login`
4.  **Body** (tab):
    *   Select `raw`
    *   Select `JSON` (from the dropdown that says "Text")
    *   Paste this:
        ```json
        {
          "email": "admin@cms.com",
          "password": "admin"
        }
        ```
5.  **Hit Send.**
6.  **Expected Response:** You should see a token:
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
7.  **IMPORTANT:** Copy that long string inside the quotes. You need it for the next steps!

---

## 🟢 Step 2: Upload an Image
**Goal:** Upload a file and get a URL back to use in your post.

1.  Create a new Request.
2.  **Method:** `POST`.
3.  **URL:** `http://localhost:3000/upload`
4.  **Authorization** (tab):
    *   Type: Select `Bearer Token`.
    *   Token: Paste the **Token** you copied in Step 1.
5.  **Body** (tab):
    *   Select `form-data`.
    *   Key: Type `file` -> Change default "Text" dropdown to "File".
    *   Value: Select an image from your computer (e.g., `banner.jpg`).
6.  **Hit Send.**
7.  **Expected Response:**
    ```json
    {
      "url": "http://localhost:3000/upload/files/a1b2c3d4.jpg",
      "filename": "a1b2c3d4.jpg"
    }
    ```
8.  **Copy this URL** for the next step.

---

## 🟢 Step 3: Create a Post
**Goal:** Create a new blog post in the database.

1.  Create a new Request.
2.  **Method:** `POST`.
3.  **URL:** `http://localhost:3000/posts`
4.  **Authorization** (tab):
    *   Select `Bearer Token`.
    *   Paste your Token.
5.  **Body** (tab):
    *   Select `raw` -> `JSON`.
    *   Paste this (replace `imageUrl` with the one you got in Step 2):
        ```json
        {
          "title": "My First Project Defense",
          "content": "NestJS is a progressive Node.js framework...",
          "imageUrl": "http://localhost:3000/upload/files/a1b2c3d4.jpg"
        }
        ```
6.  **Hit Send.**
7.  **Expected Response:** The created post object with an `_id`.

---

## 🟢 Step 4: Get All Posts (Public)
**Goal:** See the list of all posts (Anyone can do this, no token needed).

1.  Create a new Request.
2.  **Method:** `GET`.
3.  **URL:** `http://localhost:3000/posts`
4.  **Authorization:** None (No token needed).
5.  **Hit Send.**
6.  **Expected Response:** An array `[]` containing your posts.

---

## 🟢 Step 5: Update a Post
**Goal:** Change the title of a post.

1.  Get the `_id` of the post from Step 3 or 4 (e.g., `657...`).
2.  Create a new Request.
3.  **Method:** `PATCH`.
4.  **URL:** `http://localhost:3000/posts/YOUR_POST_ID_HERE`
5.  **Authorization:** `Bearer Token` (Paste your token).
6.  **Body** (raw JSON):
    ```json
    {
      "title": "Updated Title: API is Working!"
    }
    ```
7.  **Hit Send.**

---

## 🟢 Step 6: Delete a Post
**Goal:** Remove a post.

1.  Create a new Request.
2.  **Method:** `DELETE`.
3.  **URL:** `http://localhost:3000/posts/YOUR_POST_ID_HERE`
4.  **Authorization:** `Bearer Token` (Paste your token).
5.  **Hit Send.**
6.  **Expected Response:** The deleted post object (or a success message depending on implementation).

---

## 🎓 Defense Tips
*   **Response Code 201**: Means Created (Good for POST).
*   **Response Code 200**: Means TCP/OK (Good for GET/PATCH/DELETE).
*   **Response Code 401**: Means Unauthorized (You forgot the Token!).
*   **Response Code 400**: Means Bad Request (You forgot a required field like 'title').
