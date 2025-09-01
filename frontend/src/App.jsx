import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { Toaster } from 'sonner';

// import { setCredentials } from './features/auth/authSlice';
import { setCredentials } from './store/slices/authSlice';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SharePage from './pages/share/SharePage';
import SharedWithMe from './pages/share/sharedWithMe';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.post(
          'http://localhost:8000/api/v1/auth/refresh-token',
          {},
          { withCredentials: true }
        );

        // console.log("Access Token ",res );
        if (res.data.data.accessToken) {
          dispatch(setCredentials({ user: res.data.data.user, accessToken: res.data.data.accessToken }));
        }
      } catch (err) {
        console.log("No session found");
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="/auth/login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify-email" element={<VerifyEmail />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="folder/:folderId" element={<Dashboard />} />
            <Route path="share-with-me" element={<SharedWithMe />} />
          </Route>

          <Route path="/share/:shareId" element={<SharePage/>} />

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;
