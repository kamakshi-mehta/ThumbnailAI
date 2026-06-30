import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Set and dismiss toast notifications
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 3000);
  };
  const [copyStates, setCopyStates] = useState({}); // track copy states per thumbnail id
  const [expandedPromptId, setExpandedPromptId] = useState(null); // track which card shows enhanced prompt

  // Fetch history on load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await API.get('/thumbnails');
      if (response.data.success) {
        setHistory(response.data.thumbnails);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch your thumbnail history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Download logic (fetches locally saved image file from express server)
  const handleDownload = async (url, promptName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const safeName = promptName.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      link.download = `${safeName}_thumbnail.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Blob download failed, opening in new tab instead:', err);
      window.open(url, '_blank');
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this thumbnail and its local file?')) {
      return;
    }

    try {
      const response = await API.delete(`/thumbnails/${id}`);
      if (response.data.success) {
        showToast('Thumbnail and local file deleted successfully.', 'success');
        // Update local state history array
        setHistory(prevHistory => prevHistory.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to delete thumbnail.', 'error');
    }
  };

  // Copy optimized prompt to clipboard
  const handleCopyPrompt = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopyStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
    showToast('Optimized prompt copied to clipboard!', 'success');
  };

  // Filter history based on search query
  const filteredHistory = history.filter(item => {
    const query = searchQuery.toLowerCase();
    const promptMatch = item.prompt?.toLowerCase().includes(query);
    const enhancedMatch = item.enhancedPrompt?.toLowerCase().includes(query);
    return promptMatch || enhancedMatch;
  });

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

      {/* Page Header */}
      <div className="glass p-6 md:p-8 rounded-2xl glow-primary mb-8 border border-orange-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-orange-50 to-amber-500 bg-clip-text text-transparent">
            Generation History Log
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">
            Search, copy prompts, download, or delete your saved thumbnails.
          </p>
        </div>
        
        {/* Search Bar Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompt keywords..."
            className="w-full bg-white border border-orange-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-xs font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-sm font-semibold">Fetching Capstone Database logs...</p>
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHistory.map((item) => (
            <div key={item._id} className="glass rounded-xl overflow-hidden border border-orange-100 flex flex-col justify-between group hover:border-orange-300 transition-all duration-300">
              
              {/* Image Preview Block */}
              <div className="aspect-video w-full bg-[#f8fafc] relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Visual Actions overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleDownload(item.imageUrl, item.prompt)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2.5 rounded-full transition-colors cursor-pointer"
                    title="Download to PC"
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
                    title="Open Full Image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold p-2.5 rounded-full transition-colors cursor-pointer"
                    title="Delete Permanently"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Text Card details */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="mb-3">
                    <span className="text-[10px] text-slate-400 font-mono block uppercase font-bold">Original prompt:</span>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                      "{item.prompt}"
                    </p>
                  </div>

                  {/* Toggle Accordion detail for optimized prompt */}
                  <div className="mt-3">
                    <button
                      onClick={() => setExpandedPromptId(expandedPromptId === item._id ? null : item._id)}
                      className="text-[10px] text-orange-500 font-semibold hover:underline flex items-center gap-1 focus:outline-none"
                    >
                      {expandedPromptId === item._id ? 'Hide Optimized Prompt ▲' : 'View Optimized Prompt ▼'}
                    </button>
                    {expandedPromptId === item._id && (
                      <div className="mt-2 bg-orange-50/20 border border-orange-100 p-3 rounded-lg text-[11px] text-slate-500 leading-relaxed italic relative">
                        "{item.enhancedPrompt}"
                        <button
                          onClick={() => handleCopyPrompt(item._id, item.enhancedPrompt)}
                          className="absolute right-2 bottom-2 text-orange-600 hover:text-orange-500 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-white border border-orange-100 focus:outline-none cursor-pointer"
                        >
                          {copyStates[item._id] ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-orange-100 mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(item.createdAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-orange-50/5 border border-dashed border-orange-100 text-center p-12 rounded-xl text-slate-400">
          <svg className="w-12 h-12 mx-auto text-slate-350 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-sm font-semibold">No generated thumbnails found.</p>
          <p className="text-xs mt-1 text-slate-400">Try creating a thumbnail first or adjusting your search keywords.</p>
        </div>
      )}
    </div>
  );
};

export default History;
