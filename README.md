# ThumbnailAI - MERN YouTube Thumbnail Generator

ThumbnailAI is a complete MERN stack web application that automatically optimizes user video concepts into descriptive, high-quality prompts and generates professional YouTube thumbnails. 

It implements a reliable **high-availability fallback AI pipeline** (Pollinations AI with Hugging Face Stable Diffusion fallback), saves generated graphics directly to local server storage to prevent broken CDN links, and integrates user history search/download/deletion dashboards.

---

## 📂 Project Folder Structure

```text
thumbnail-ai/
├── backend/                  # Express/Node.js API Server
│   ├── config/               # Database Connection configuration
│   │   └── db.js             # MongoDB connection initialization
│   ├── middleware/           # Route guard logic
│   │   └── auth.js           # JWT Authentication interceptor
│   ├── models/               # MongoDB Mongoose Schemas
│   │   ├── User.js           # Hashed user accounts
│   │   └── Thumbnail.js      # Prompt & image local metadata
│   ├── routes/               # REST API Routes
│   │   ├── auth.js           # Signup, login, & user details
│   │   └── thumbnail.js      # Generate (AI fallback logic), GET, and DELETE
│   ├── uploads/              # Local storage folder for generated JPEGs
│   ├── .env.example          # Sample environment configurations
│   ├── package.json          # Node server dependencies
│   └── server.js             # Main server startup entry point
│
├── frontend/                 # Vite + React Client App
│   ├── src/
│   │   ├── components/       # Shared UI parts
│   │   │   ├── Navbar.jsx    # Responsive menu bar with mobile hamburger
│   │   │   └── ProtectedRoute.jsx # Frontend navigation route guardian
│   │   ├── pages/            # Page layouts
│   │   │   ├── Landing.jsx   # Public info hero
│   │   │   ├── Login.jsx     # SignIn with visual warning helpers
│   │   │   ├── Register.jsx  # SignUp with individual input error hooks
│   │   │   ├── Dashboard.jsx # Generation workspace with local toasts
│   │   │   ├── History.jsx   # Searchable user gallery log
│   │   │   ├── Profile.jsx   # Real-time statistics logs
│   │   │   └── NotFound.jsx  # Dark 404 page
│   │   ├── utils/
│   │   │   └── api.js        # Axios instance with request headers interceptors
│   │   ├── App.jsx           # Client side routes config
│   │   └── main.jsx          # React app DOM loader
│   ├── index.html            # Main site HTML structure
│   ├── tailwind.config.js    # Tailwind layout settings
│   ├── vite.config.js        # Vite port (3000) & proxy configuration
│   └── package.json          # React packages & scripts
│
├── package.json              # Root project manager script
└── README.md                 # Complete documentation guide (This file)
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file inside the `backend/` directory and configure the variables as shown below:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/thumbnail_ai
JWT_SECRET=your_secret_jwt_key_here
HUGGING_FACE_TOKEN=your_huggingface_write_token_here
```

- **MONGO_URI:** The connection URI to your MongoDB database. Defaults to your local MongoDB server.
- **JWT_SECRET:** Any unique key used to sign and encrypt JSON Web Tokens.
- **HUGGING_FACE_TOKEN:** A Hugging Face token (Write permission recommended) used to call Stable Diffusion models as a fallback mechanism.

---

## 🛠️ Installation Steps

### Prerequisites
1. **Node.js** (v18 or higher recommended)
2. **MongoDB Community Server** installed and running locally.

### Setup Steps
1. Clone the project or open the folder in your terminal:
   ```bash
   cd thumbnail-ai
   ```
2. Run the root install script to install dependencies for the root, backend, and frontend concurrently:
   ```bash
   npm run install-all
   ```
3. Set up the `.env` file in the `backend/` folder (using the instructions above).

---

## 🚀 Running the Project Locally

### 1. Start MongoDB Connection
Make sure your local MongoDB service is running. On Windows, you can start it via Services or command line:
```powershell
net start MongoDB
```

### 2. Launch the Development Server
From the root project directory, boot the backend and frontend concurrently:
```bash
npm run dev
```
- **React Frontend:** Serves on [http://localhost:3000/](http://localhost:3000/) (proxies API traffic automatically)
- **Node Backend:** Runs on [http://localhost:5000/](http://localhost:5000/) with Nodemon reload support.

---

## 📦 Git Workflow Commands

To push this codebase to your personal GitHub repository:

1. Initialize git in the root folder:
   ```bash
   git init
   ```
2. Create a `.gitignore` in the root (ignoring `node_modules`, `.env`, and production builds):
   ```text
   node_modules/
   backend/.env
   frontend/dist/
   backend/uploads/*
   !backend/uploads/.gitkeep
   ```
3. Stage and commit files:
   ```bash
   git add .
   git commit -m "feat: complete ThumbnailAI application build"
   ```
4. Connect to your GitHub repository and upload:
   ```bash
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

---

## ☁️ Deployment Guide (Render + Vercel + MongoDB Atlas)

Follow these steps to deploy this application to the cloud for free:

### 1. Database Cloud Setup (MongoDB Atlas)
1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Shared Cluster.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) or select IP permissions.
4. Under **Database Access**, create a user credentials set (username/password).
5. Copy the connection string (looks like `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/...`).

### 2. Backend Hosting (Render)
1. Register on [Render.com](https://render.com/).
2. Click **New +** > **Web Service**.
3. Link your GitHub repository.
4. Set the following settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install --prefix backend`
   - **Start Command:** `npm start --prefix backend`
5. Go to the **Environment** tab on Render and add your variables:
   - `MONGO_URI` (Paste your MongoDB Atlas string)
   - `JWT_SECRET` (A strong custom key)
   - `HUGGING_FACE_TOKEN` (Your API token)
   - `PORT` = `5000`
6. Copy the deployed backend URL (e.g. `https://thumbnail-api.onrender.com`).

### 3. Frontend Hosting (Vercel)
1. Before deploying, modify [api.js](file:///C:/Users/ganesha/Downloads/thumbnail-ai/frontend/src/utils/api.js) on your frontend. Change your Axios baseURL from `/api` to your absolute Render backend URL (`https://your-api.onrender.com/api`).
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Set the **Root Directory** as `frontend/`.
5. Set the **Framework Preset** as `Vite`.
6. Click **Deploy**. Vercel will host your client application and provide a production domain.

---

## 🎯 Final Local Verification Checklist

Confirm that these features are operational before demo day:
- [ ] **Auth Check:** Create a new account. Verify the form validation triggers borders red on weak passwords/bad emails. Confirm a Toast alert greets you on redirect.
- [ ] **Route Protection:** Sign out, then try typing `http://localhost:3000/dashboard` in the address bar. Verify it redirects you to the login screen.
- [ ] **AI Fallback Check:** Generate a thumbnail. Inspect your `backend/uploads/` directory; verify that a JPEG was downloaded to your server disk.
- [ ] **Download Utility:** Click download on the dashboard. Verify that it triggers a local browser save.
- [ ] **Clipboard Copier:** Click copy optimized prompt. Paste in notepad to verify text matches the AI prompt.
- [ ] **Search Gallery:** Create several thumbnails, go to **History**, and type prompt keywords. Confirm list filters cards instantly.
- [ ] **Unlink / Delete Sync:** Delete a thumbnail. Verify it disappears from history and its file is deleted from the `backend/uploads/` server folder.
- [ ] **Profile Check:** View **Profile**. Check that your registration date and total count are fetched from MongoDB.
- [ ] **404 Check:** Type `http://localhost:3000/invalid-url` and verify the custom NotFound page is rendered.
