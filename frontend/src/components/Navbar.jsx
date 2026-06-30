import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Navbar component with desktop responsive bar and mobile hamburger dropdown menu
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false); // Toggle state for mobile drawer

  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error('Error parsing user data:', err);
  }

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsOpen(false); // close drawer
    navigate('/login');
  };

  return (
    <nav className="glass border-b border-orange-500/10 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo Link */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent tracking-wide hover:opacity-90 transition-opacity">
          ThumbnailAI
        </Link>
        
        {/* Desktop Links (Visible on Tablet/Desktop, Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          {token ? (
            <>
              <span className="text-slate-500 text-sm">
                Welcome, <strong className="text-slate-800">{user?.username}</strong>
              </span>
              <Link to="/dashboard" className="text-slate-600 hover:text-orange-600 transition-colors font-semibold text-sm">
                Dashboard
              </Link>
              <Link to="/history" className="text-slate-600 hover:text-orange-600 transition-colors font-semibold text-sm">
                History
              </Link>
              <Link to="/profile" className="text-slate-600 hover:text-orange-600 transition-colors font-semibold text-sm">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm shadow-md cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-orange-600 transition-colors font-semibold text-sm">
                Login
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 text-sm glow-primary cursor-pointer">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu Toggle Button (Visible on Mobile Only) */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-slate-600 hover:text-slate-800 focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Links Dropdown list (Renders dynamically) */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-orange-500/10 flex flex-col gap-4">
          {token ? (
            <>
              <span className="text-slate-500 text-sm pb-1 border-b border-orange-500/5">
                Welcome, <strong className="text-slate-800">{user?.username}</strong>
              </span>
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="text-slate-600 hover:text-orange-600 transition-colors font-semibold text-sm"
              >
                Dashboard
              </Link>
              <Link 
                to="/history" 
                onClick={() => setIsOpen(false)}
                className="text-slate-600 hover:text-orange-600 transition-colors font-semibold text-sm"
              >
                History
              </Link>
              <Link 
                to="/profile" 
                onClick={() => setIsOpen(false)}
                className="text-slate-600 hover:text-orange-600 transition-colors font-semibold text-sm"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm shadow-md cursor-pointer w-full text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="text-slate-600 hover:text-orange-600 transition-colors font-semibold text-sm"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 text-sm glow-primary text-center cursor-pointer w-full"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
