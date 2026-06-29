const mongoose = require('mongoose');

// Define Thumbnail Schema to store original prompt, enhanced prompt, and local image file details
const thumbnailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: String,
    required: [true, 'Original prompt description is required']
  },
  enhancedPrompt: {
    type: String,
    required: [true, 'Optimized AI prompt description is required']
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Thumbnail', thumbnailSchema);
