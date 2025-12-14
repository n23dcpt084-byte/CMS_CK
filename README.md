# NestJS CMS Backend (Student Project)

This is a simplified CMS backend built with NestJS, MongoDB, and Express for a university assignment.

## 🚀 Features
- **Admin Authentication**: Secure JWT-based login (Hardcoded Admin for assignment simplicity).
- **Post Management**: Create, Read, Update, Delete (CRUD) blog posts.
- **Image Upload**: Upload images using Multer (Local Storage).
- **Architecture**: Modular structure (AuthModule, PostsModule, UploadModule).

## 🛠️ Setup & Run

### 1. Requirements
- Node.js (v14+)
- MongoDB (Running locally on default port 27017)

### 2. Installations
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Check the \`.env\` file in the root directory:
\`\`\`env
MONGO_URI=mongodb://localhost:27017/cms_project_db
JWT_SECRET=supersexualsecretkey
\`\`\`

### 4. Start Server
\`\`\`bash
npm run start
\`\`\`
The server will start at: `http://localhost:3000`

## 🔑 Login Credentials (Admin)
- **Email**: `admin@cms.com`
- **Password**: `admin`

## 📡 API Endpoints

### Authentication
- `POST /auth/login`
    - Body: `{ "email": "admin@cms.com", "password": "admin" }`
    - Response: `{ "access_token": "..." }`

### Posts
- `GET /posts` - Get all posts (Public)
- `GET /posts/:id` - Get single post (Public)
- `POST /posts` - Create post (**Requires Token**)
- `PATCH /posts/:id` - Update post (**Requires Token**)
- `DELETE /posts/:id` - Delete post (**Requires Token**)

### Uploads
- `POST /upload` - Upload image file (**Requires Token**)
    - Key: `file`
- `GET /upload/files/:filename` - View image (Public)
