const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Thumbnail = require('../models/Thumbnail');
const { protect } = require('../middleware/auth');

// Make sure uploads directory exists in backend/uploads
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// @route   GET /api/thumbnails
// @desc    Get user's generated thumbnails history & count
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Fetch all thumbnails created by the authenticated user, newest first
    const thumbnails = await Thumbnail.find({ user: req.user.id }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: thumbnails.length,
      thumbnails
    });
  } catch (error) {
    console.error('Fetch thumbnails error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error. Failed to retrieve history.' });
  }
});

// @route   POST /api/thumbnails
// @desc    Generate a new thumbnail and save both original & enhanced prompts
// @access  Private
router.post('/', protect, async (req, res) => {
  const { prompt, enhancedPrompt, aspectRatio, quality } = req.body;

  if (!prompt || !enhancedPrompt) {
    return res.status(400).json({ success: false, message: 'Please provide both original and enhanced prompts.' });
  }

  // Configure dimensions based on Aspect Ratio (16:9 vs Square)
  let width = 1280;
  let height = 720;

  if (aspectRatio === 'square') {
    width = 1024;
    height = 1024;
  }

  const seed = Math.floor(Math.random() * 10000000);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;

  let imageBuffer;
  let generatorSource = 'Pollinations AI';

  try {
    console.log(`[AI] Generating via Pollinations AI...`);
    const response = await axios.get(pollinationsUrl, { 
      responseType: 'arraybuffer',
      timeout: 15000
    });

    if (response.status === 200) {
      imageBuffer = Buffer.from(response.data, 'binary');
    } else {
      throw new Error(`Pollinations returned non-200 status: ${response.status}`);
    }
  } catch (pollinationsError) {
    console.warn(`[AI] Pollinations failed. Triggering Hugging Face:`, pollinationsError.message);
    generatorSource = 'Hugging Face API';

    const hfToken = process.env.HUGGING_FACE_TOKEN;
    if (!hfToken || hfToken.startsWith('hf_your_actual_token')) {
      return res.status(500).json({ 
        success: false, 
        message: 'Pollinations AI failed, and Hugging Face API fallback is unconfigured. Please add HUGGING_FACE_TOKEN to backend/.env.' 
      });
    }

    try {
      const hfUrl = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';
      const response = await axios.post(
        hfUrl,
        { inputs: enhancedPrompt },
        {
          headers: { 
            Authorization: `Bearer ${hfToken}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer',
          timeout: 25000
        }
      );

      if (response.status === 200) {
        imageBuffer = Buffer.from(response.data, 'binary');
      } else {
        throw new Error(`Hugging Face returned non-200 status: ${response.status}`);
      }
    } catch (hfError) {
      console.error(`[AI] Hugging Face fallback failed:`, hfError.message);
      return res.status(500).json({ 
        success: false, 
        message: `AI Image generation failed. Both APIs failed. (Error: ${hfError.message})` 
      });
    }
  }

  try {
    // Generate unique local file name
    const filename = `thumbnail_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
    const filePath = path.join(uploadsDir, filename);

    // Save binary buffer locally
    fs.writeFileSync(filePath, imageBuffer);

    // Dynamic Host path so it works in both dev (localhost:5000) and prod deployments
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

    // Create MongoDB thumbnail record saving both prompt inputs
    const thumbnail = await Thumbnail.create({
      user: req.user.id,
      prompt,
      enhancedPrompt,
      imageUrl
    });

    return res.status(201).json({
      success: true,
      message: `Thumbnail successfully generated using ${generatorSource}.`,
      thumbnail
    });
  } catch (saveError) {
    console.error(`[FS] Error saving file locally:`, saveError.message);
    return res.status(500).json({ success: false, message: 'Server error. Failed to save thumbnail locally.' });
  }
});

// @route   DELETE /api/thumbnails/:id
// @desc    Delete a thumbnail from MongoDB and delete its local physical file
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    // Find the thumbnail record and verify ownership
    const thumbnail = await Thumbnail.findOne({ _id: req.params.id, user: req.user.id });

    if (!thumbnail) {
      return res.status(404).json({ success: false, message: 'Thumbnail not found or unauthorized deletion.' });
    }

    // Extract the filename from the imageUrl path
    const filename = path.basename(thumbnail.imageUrl);
    const filePath = path.join(uploadsDir, filename);

    // Synchronously delete the physical image file from the backend/uploads folder if it exists
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`[FS] Successfully deleted local file: ${filename}`);
      } catch (fileErr) {
        console.error(`[FS] Failed to delete file ${filename}:`, fileErr.message);
      }
    }

    // Delete record from database
    await thumbnail.deleteOne();

    return res.json({
      success: true,
      message: 'Thumbnail and local file deleted successfully.'
    });
  } catch (error) {
    console.error('Delete thumbnail error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error. Failed to delete thumbnail.' });
  }
});

module.exports = router;
