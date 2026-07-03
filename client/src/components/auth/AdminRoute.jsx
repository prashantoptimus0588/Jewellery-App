// src/components/auth/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const AdminRoute = ({ children }) => {
  // Make sure your useAuthStore actually exposes an isLoading state!
  const { user, isAuthenticated, isLoading } = useAuthStore();

  // 1. Pause rendering while Zustand checks local storage or fetches the user
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <p>Verifying admin access...</p>
      </div>
    );
  }

  // 2. Once loading is completely finished, run the role checks
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;

  // 3. If they pass, render the admin layout
  return children;
};

export default AdminRoute;