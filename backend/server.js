const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const thumbnailRoutes = require('./routes/thumbnail');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB Atlas Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse incoming JSON request bodies

// Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/thumbnails', thumbnailRoutes);

// Serve statically generated local thumbnails from backend/uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Static Folder Path for the built React Frontend
const distPath = path.join(__dirname, '../frontend/dist');

// Serve static assets from frontend build
app.use(express.static(distPath));

// Wildcard route to handle React Router client-side routing.
// If the frontend build is missing (e.g. during development before running npm run build),
// it will send a friendly status message instead of crashing.
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('ThumbnailAI Backend API is running successfully. Build the frontend (npm run build-frontend) to view the UI on this port.');
    }
  });
});

// Start listening on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
