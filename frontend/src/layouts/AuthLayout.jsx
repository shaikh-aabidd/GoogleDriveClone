// src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const AuthLayout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Google Drive Clone</h1>
          <p className="mt-2 text-sm text-gray-600">
            Secure cloud storage for your files
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
