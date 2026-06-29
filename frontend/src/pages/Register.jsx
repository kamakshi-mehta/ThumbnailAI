import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Register = () => {
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Validation error states (individual input fields)
  const [errors, setErrors] = useState({});
  // Auto-dismissing Toast / Notification banner state
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, email, password, confirmPassword } = formData;

  // Set and auto-dismiss alerts
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 3000);
  };

  // Track values changes and clear error borders on type
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // Core Form Validation
  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) {
      tempErrors.username = 'Username is required.';
    } else if (username.length < 3) {
      tempErrors.username = 'Username must be at least 3 characters.';
    }

    if (!email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      tempErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return showToast('Please fix the errors in the form.');
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/register', {
        username,
        email,
        password
      });

      if (response.data.success) {
        showToast('Registration successful! Redirecting...', 'success');
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Brief timeout so the user sees the success toast alert before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Toast Notification Alert Overlay */}
      {toast.message && (
        <div className={`fixed top-24 right-6 px-5 py-3 rounded-xl shadow-2xl border transition-all duration-300 z-50 text-sm flex items-center gap-2 ${
          toast.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="w-full max-w-md p-8 rounded-2xl glass glow-primary border border-dark-border">
        <h2 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          Create an Account
        </h2>
        <p className="text-gray-400 text-center mb-8 text-xs">
          Join ThumbnailAI to generate YouTube thumbnails.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input block */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Choose username"
              className={`w-full bg-[#0D1424] border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 text-sm transition-all ${
                errors.username 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-dark-border focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1.5">{errors.username}</p>
            )}
          </div>

          {/* Email Input block */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email ID"
              className={`w-full bg-[#0D1424] border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 text-sm transition-all ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-dark-border focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* Password Input block */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full bg-[#0D1424] border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 text-sm transition-all ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-dark-border focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input block */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full bg-[#0D1424] border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 text-sm transition-all ${
                errors.confirmPassword 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-dark-border focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer shadow-lg mt-6"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
