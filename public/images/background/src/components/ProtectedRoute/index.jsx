import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, redirectPath = '/login' }) {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;