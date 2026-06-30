import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const Dashboard = () => {
  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error('Error parsing user data:', err);
  }

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [promptText, setPromptText] = useState('');
  const [category, setCategory] = useState('gaming');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [quality, setQuality] = useState('hd');

  // App UI states
  const [generatedImage, setGeneratedImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [copySuccess, setCopySuccess] = useState(false);

  // Toast alert dispatcher
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 3000);
  };

  // Preset categories
  const categories = [
    { value: 'gaming', label: 'Gaming' },
    { value: 'tech', label: 'Tech' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'cartoon', label: 'Cartoon' },
    { value: 'anime', label: 'Anime' },
    { value: 'mrbeast', label: 'MrBeast' },
    { value: 'realistic', label: 'Realistic' }
  ];

  // Fetch history on load
  useEffect(() => {
    fetchThumbnailHistory();
  }, []);

  const fetchThumbnailHistory = async () => {
    try {
      setFetchingHistory(true);
      const response = await API.get('/thumbnails');
      if (response.data.success) {
        setHistory(response.data.thumbnails);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Could not retrieve thumbnail history. Please try again.');
    } finally {
      setFetchingHistory(false);
    }
  };

  // Helper function to automatically optimize/improve prompt
  const improvePrompt = (originalPrompt, titleText, descText, categoryVal, qualityVal) => {
    // 1. Establish the base idea
    let baseText = originalPrompt.trim();
    if (!baseText) {
      baseText = `${titleText} - ${descText}`;
    }

    // 2. Map styling rules for B.Tech project prompt improver
    const categoryRules = {
      gaming: "vibrant 3D gaming render, cinematic lighting, neon highlights, high octane, octane render, detailed gaming desk background, cyber vibe",
      tech: "clean minimalist modern technology, sharp focus, futuristic tech interface, photorealistic hardware, soft professional studio lighting, 4k",
      finance: "wealth and success concept, high contrast golden coins and money elements, clean lines, professional financial presentation look, photorealistic",
      education: "creative learning visual, friendly bright colors, modern flat 3D vector graphics, clean composition, academic elements",
      cartoon: "bold 2D cartoon illustration, solid outlines, flat saturated colors, expressive character design, clean vector art",
      anime: "modern anime key visual, highly detailed digital painting, vibrant gradient background, beautiful lighting reflections, anime aesthetic",
      mrbeast: "extremely high-energy clickbait style, shocked facial expressions, hyper-saturated colors, glow effects, extreme contrast, action-packed graphic",
      realistic: "photorealistic capture, detailed skin textures, realistic environmental volumetric lighting, depth of field, cinematic 35mm camera shot"
    };

    const styleGuide = categoryRules[categoryVal] || categoryRules.gaming;

    // 3. Add quality configurations
    const qualityDetails = qualityVal === 'ultra-hd'
      ? "hyper-detailed textures, volumetric atmospheric lighting, Unreal Engine 5 render, 8k resolution, raytracing, masterwork"
      : "high definition, clean details, smooth lighting, 4k resolution";

    // 4. Combine into an optimized prompt
    return `${baseText}, ${styleGuide}, ${qualityDetails}, colorful, centered composition, high visual appeal for YouTube thumbnail`;
  };

  // Generate thumbnail handler
  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!promptText.trim() && !title.trim()) {
      return showToast('Please provide either a Video Title or an Image Prompt.', 'error');
    }

    // Double check aspect ratio
    let targetRatio = aspectRatio === '16:9' ? '16:9' : 'square';

    setLoading(true);
    setGeneratedImage(null);

    // Auto-improve prompt on client-side before sending to server
    const optimizedPrompt = improvePrompt(promptText, title, description, category, quality);
    const originalPrompt = promptText.trim() || `${title} - ${description}`;

    try {
      // Send parameters to backend
      const response = await API.post('/thumbnails', {
        prompt: originalPrompt,
        enhancedPrompt: optimizedPrompt,
        aspectRatio: targetRatio,
        quality
      });

      if (response.data.success) {
        const newThumbnail = response.data.thumbnail;
        setGeneratedImage(newThumbnail);
        // Add to history list locally
        setHistory(prevHistory => [newThumbnail, ...prevHistory]);
        showToast('Thumbnail generated successfully!', 'success');
      }
    } catch (err) {
      console.error('Generation failure:', err);
      showToast(err.response?.data?.message || 'Failed to generate image. Please verify backend service.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Download logic (fetches file from local express uploads and downloads it)
  const handleDownload = async (url, promptName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Clean up string for filename
      const safeName = promptName.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      link.download = `${safeName}_thumbnail.jpg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Blob download failed, opening in tab as fallback:', err);
      window.open(url, '_blank');
    }
  };

  // Copy improved prompt to clipboard
  const handleCopyPrompt = () => {
    if (generatedImage) {
      navigator.clipboard.writeText(generatedImage.enhancedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      showToast('Optimized prompt copied to clipboard!', 'success');
    }
  };

  // Reset form to generate again
  const handleGenerateAgain = () => {
    setTitle('');
    setDescription('');
    setPromptText('');
    setCategory('gaming');
    setAspectRatio('16:9');
    setQuality('hd');
    setGeneratedImage(null);
    setError('');
    showToast('Form reset. Ready to generate again!', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      {/* Toast Notification Alert Overlay */}
      {toast.message && (
        <div className={`fixed top-24 right-6 px-5 py-3 rounded-xl shadow-2xl border transition-all duration-300 z-50 text-sm flex items-center gap-2 ${
          toast.type === 'success' 
            ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
            : 'bg-red-100 border-red-200 text-red-700'
        }`}>
          <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Greeting Banner */}
      <div className="glass p-6 md:p-8 rounded-2xl glow-primary mb-8 border border-orange-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-orange-50 to-amber-500 bg-clip-text text-transparent">
            Welcome Back, {user?.username || 'Creator'}
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">
            MERN Capstone - AI YouTube Thumbnail Generator workspace.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-orange-100 px-4 py-2.5 rounded-xl">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Thumbnails</span>
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-black px-3 py-1 rounded-lg">
            {history.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid lg:grid-cols-5 gap-8 mb-12">
        
        {/* Left Side: Generator Configuration Form */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-orange-100">
          <form onSubmit={handleGenerate} className="space-y-5">
            <h3 className="text-lg font-bold text-slate-800 border-b border-orange-100 pb-2">
              Thumbnail Metadata
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Video Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. I Built an AI App in 24 Hours!"
                className="w-full bg-white border border-orange-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Video Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Coding capstone tutorial showing MERN fallback routes..."
                className="w-full bg-white border border-orange-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Core Image Scene (Prompt)</label>
              <textarea
                rows="3"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe what visual elements should be in the thumbnail..."
                className="w-full bg-white border border-orange-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-orange-500 text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:border-orange-500 text-xs"
                >
                  <option value="hd">HD (Standard)</option>
                  <option value="ultra-hd">Ultra HD (Detailed)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Aspect Ratio</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="ratio"
                    checked={aspectRatio === '16:9'}
                    onChange={() => setAspectRatio('16:9')}
                    className="accent-orange-500"
                  />
                  16:9 (YouTube)
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="ratio"
                    checked={aspectRatio === 'square'}
                    onChange={() => setAspectRatio('square')}
                    className="accent-orange-500"
                  />
                  Square (1:1)
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer shadow-md mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                  Generate Thumbnail
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Live Image Output Preview Area */}
        <div className="lg:col-span-3 glass p-6 rounded-2xl border border-orange-100 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-slate-800 border-b border-orange-100 pb-2 mb-4">
            Live Preview Workspace
          </h3>

          <div className="w-full flex items-center justify-center bg-[#f8fafc] border border-orange-100 rounded-xl p-4 min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 text-sm font-semibold">Generating graphics on server...</p>
                <p className="text-slate-400 text-xs mt-1">Downloading buffer to local folder...</p>
              </div>
            ) : generatedImage ? (
              <div className="w-full flex flex-col items-center">
                {/* Dynamically styled display block representing the aspect ratio of output */}
                <div className={`w-full overflow-hidden rounded-lg bg-[#f8fafc] border border-orange-100 relative group shadow-lg ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square max-w-sm'}`}>
                  <img
                    src={generatedImage.imageUrl}
                    alt={generatedImage.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleDownload(generatedImage.imageUrl, generatedImage.prompt)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-3.5 rounded-full transition-colors cursor-pointer"
                      title="Download Image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                    </button>
                    <a
                      href={generatedImage.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gray-700 hover:bg-gray-600 text-white font-bold p-3.5 rounded-full transition-colors"
                      title="Open full size"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Dashboard Action Controls */}
                <div className="flex flex-wrap gap-3 mt-6 w-full justify-center">
                  <button
                    onClick={() => handleDownload(generatedImage.imageUrl, generatedImage.prompt)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download Image
                  </button>

                  <button
                    onClick={handleCopyPrompt}
                    className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {copySuccess ? (
                      <>
                        <svg className="w-4 h-4 text-green-455" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Copy Prompt
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateAgain}
                    className="bg-white border border-orange-200 text-slate-700 hover:bg-orange-50/50 text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18.5"></path>
                    </svg>
                    Generate Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-slate-400">
                <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-sm font-semibold">Submit your video details on the left.</p>
                <p className="text-xs mt-1 text-slate-400">The optimized output will render dynamically.</p>
              </div>
            )}
          </div>

          {generatedImage && (
            <div className="mt-4 bg-orange-50/20 border border-orange-100 p-3 rounded-lg">
              <span className="text-[10px] text-orange-500 font-mono block uppercase font-bold">Optimized Prompt (Copied):</span>
              <p className="text-xs text-slate-650 mt-1 italic leading-relaxed">"{generatedImage.enhancedPrompt}"</p>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Section: Recent History Logs */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 border-b border-orange-100 pb-3 mb-6">
          Recent Thumbnail History
        </h2>

        {fetchingHistory ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mb-3 mx-auto"></div>
            Loading history...
          </div>
        ) : history.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {history.map((item) => (
              <div key={item._id} className="glass rounded-xl overflow-hidden border border-orange-100 flex flex-col group hover:border-orange-300 transition-colors duration-300">
                <div className="aspect-video w-full bg-[#f8fafc] relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleDownload(item.imageUrl, item.prompt)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2.5 rounded-full transition-colors cursor-pointer"
                      title="Download"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                    </button>
                    <a
                      href={item.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gray-700 hover:bg-gray-600 text-white font-bold p-2.5 rounded-full transition-colors"
                      title="Open full size"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="p-4 border-t border-orange-100 flex-grow flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                    "{item.prompt}"
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-3 block">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-orange-50/5 border border-dashed border-orange-100 text-center p-12 rounded-xl text-slate-400">
            <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            No generated thumbnails yet. Describe your first scene above to create output!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
