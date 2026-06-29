import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [genCount, setGenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch fresh profile data and generation count on load
  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const fetchProfileAndStats = async () => {
    try {
      setLoading(true);
      
      // Fetch dynamic user detail (contains MongoDB database registration date)
      const userRes = await API.get('/auth/me');
      
      // Fetch thumbnail history to retrieve total counts
      const countRes = await API.get('/thumbnails');

      if (userRes.data.success) {
        setProfile(userRes.data.user);
      }
      
      if (countRes.data.success) {
        setGenCount(countRes.data.count);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Could not retrieve profile statistics. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Profile Card Container */}
      <div className="glass rounded-2xl overflow-hidden border border-dark-border shadow-2xl relative">
        {/* Color bar decoration */}
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-900 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl bg-dark-bg border-4 border-dark-border flex items-center justify-center text-4xl font-extrabold text-primary-400 select-none shadow-md">
            {profile?.username ? profile.username.substring(0, 2).toUpperCase() : 'AI'}
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-8 pt-16 pb-8">
          <h2 className="text-2xl font-black text-white">{profile?.username || 'Username'}</h2>
          <p className="text-gray-400 text-sm">Creator Account Status</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm my-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mb-3 mx-auto"></div>
              Loading account statistics...
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 mt-8 border-t border-dark-border pt-8">
              
              {/* Account Details Block */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Account Details</h3>
                
                <div>
                  <span className="text-xs text-gray-500 block">Registered Email</span>
                  <span className="text-gray-200 text-sm font-medium">{profile?.email || 'N/A'}</span>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block">Date Joined</span>
                  <span className="text-gray-200 text-sm font-medium">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block">Unique User ID</span>
                  <span className="text-gray-400 font-mono text-[10px] break-all">{profile?._id || 'N/A'}</span>
                </div>
              </div>

              {/* Creator Stats Block */}
              <div className="bg-dark-bg/40 border border-dark-border rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Creator Performance</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-primary-400 tracking-tight">{genCount}</span>
                    <span className="text-xs text-gray-400 font-medium">Thumbnails Generated</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                    You have generated a total of {genCount} AI graphics. All files are hosted on your local project directory.
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-dark-border flex justify-between items-center text-xs text-emerald-400 font-semibold bg-emerald-500/5 px-3.5 py-2 rounded-lg border border-emerald-500/10">
                  <span>● Capstone Server Online</span>
                  <span className="text-gray-500 font-mono">127.0.0.1</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
