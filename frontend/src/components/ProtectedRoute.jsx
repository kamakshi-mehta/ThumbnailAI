import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component to shield routes from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If no token is found in localStorage, redirect user to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the protected component
  return children;
};

export default ProtectedRoute;
