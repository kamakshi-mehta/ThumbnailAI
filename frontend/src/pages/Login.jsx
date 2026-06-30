import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Login = () => {
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Validation error states
  const [errors, setErrors] = useState({});
  // Auto-dismissing Toast state
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  // Set and dismiss alerts
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 3000);
  };

  // Track values changes and clear error status on typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // Form validations
  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      tempErrors.password = 'Password is required.';
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
      const response = await API.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        showToast('Login successful! Redirecting...', 'success');
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Invalid email or password.');
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
            ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
            : 'bg-red-100 border-red-200 text-red-700'
        }`}>
          <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="w-full max-w-md p-8 rounded-2xl glass glow-primary border border-orange-100">
        <h2 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-orange-50 to-amber-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-slate-500 text-center mb-8 text-xs font-medium">
          Sign in to access your Creator Workspace.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input block */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email ID"
              className={`w-full bg-white border rounded-lg px-4 py-2.5 text-slate-850 focus:outline-none focus:ring-1 text-sm transition-all ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-200 focus:border-orange-500 focus:ring-orange-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* Password input block */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full bg-white border rounded-lg px-4 py-2.5 text-slate-850 focus:outline-none focus:ring-1 text-sm transition-all ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-200 focus:border-orange-500 focus:ring-orange-500'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer shadow-md mt-6"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-slate-500 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-500 font-semibold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
