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
│   │   │   └── NotFound.jsx  # 404 page
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
└── README.md                 # Project documentation (This file)
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file inside the `backend/` directory and configure the variables as shown below:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_jwt_key_here
```

- **MONGO_URI:** The connection URI to your MongoDB database (Local or MongoDB Atlas).
- **JWT_SECRET:** Any unique key used to sign and encrypt JSON Web Tokens for user sessions.

---

## 🛠️ Installation Steps

### Prerequisites
1. **Node.js** (v18 or higher recommended)
2. **MongoDB** installed locally or an Atlas cloud cluster.

### Setup Steps
1. Clone the project or open the folder:
   ```bash
   cd thumbnail-ai
   ```
2. Install all dependencies concurrently:
   ```bash
   npm run install-all
   ```
3. Set up the `.env` file in the `backend/` folder (using the instructions above).

---

## 🚀 Running the Project Locally

From the root project directory, boot the backend and frontend concurrently:
```bash
npm run dev
```
- **React Frontend:** Serves on [http://localhost:3000/](http://localhost:3000/) (proxies API traffic automatically)
- **Node Backend:** Runs on [http://localhost:5000/](http://localhost:5000/)

---

## ☁️ Deployment Guide (Render + Vercel + MongoDB Atlas)

### 1. Database Cloud Setup (MongoDB Atlas)
1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a Free Cluster.
2. In **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
3. In **Database Access**, create a user credentials set (username/password).
4. Copy the driver connection string.

### 2. Backend Hosting (Render)
1. Register on [Render.com](https://render.com/) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Configure the following parameters:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Under **Advanced Settings / Environment Variables**, add your keys:
   - `MONGO_URI` (Paste your MongoDB Atlas connection string)
   - `JWT_SECRET` (A strong custom key)
5. Copy the deployed backend URL (e.g. `https://thumbnail-ai-backend.onrender.com`).

### 3. Frontend Hosting (Vercel)
1. Log in to [Vercel](https://vercel.com/) and import your GitHub repository.
2. Set the **Root Directory** as `frontend`.
3. Under **Environment Variables**, add:
   - **Key:** `VITE_API_URL`
   - **Value:** *(Paste your Render backend URL)*
4. Click **Deploy**. Vercel will host your client application and provide a production domain.

---

## 🎯 Verification Checklist

- [x] **Auth Validation:** Inputs trigger border colors red on weak passwords or invalid emails, and toast alerts greet on redirects.
- [x] **Route Protection:** Direct access to `/dashboard` redirects to `/login` if unauthenticated.
- [x] **AI Generation:** Describe a scene, generate a YouTube thumbnail in 16:9 ratio, and view logs immediately.
- [x] **Download Utility:** Download generated graphics locally to your PC.
- [x] **Clipboard Copier:** Copy optimized prompts to your clipboard for external use.
- [x] **Search Gallery:** Real-time keyword filter searching through your history gallery.
- [x] **Account Statistics:** Profile page displays registration date and total thumbnail stats from MongoDB.
- [x] **404 Handling:** Friendly customized 404 page for unmatched routes.
