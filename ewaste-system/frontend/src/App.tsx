import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import CollectionCenterDashboard from './pages/CollectionCenterDashboard';
import AIDetection from './pages/AIDetection';
import PickupTracking from './pages/PickupTracking';
import EnvironmentalAnalytics from './pages/EnvironmentalAnalytics';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onRegister={handleLogin} />} />

        {/* Protected Routes */}
        {user ? (
          <>
            {user.role === 'user' && (
              <>
                <Route path="/dashboard" element={<UserDashboard user={user} onLogout={handleLogout} />} />
                <Route path="/ai-detection" element={<AIDetection user={user} onLogout={handleLogout} />} />
                <Route path="/pickup-tracking" element={<PickupTracking user={user} onLogout={handleLogout} />} />
                <Route path="/analytics" element={<EnvironmentalAnalytics user={user} onLogout={handleLogout} />} />
              </>
            )}

            {user.role === 'admin' && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
                <Route path="/analytics" element={<EnvironmentalAnalytics user={user} onLogout={handleLogout} />} />
              </>
            )}

            {user.role === 'developer' && (
              <>
                <Route path="/developer/dashboard" element={<DeveloperDashboard user={user} onLogout={handleLogout} />} />
                <Route path="/ai-detection" element={<AIDetection user={user} onLogout={handleLogout} />} />
              </>
            )}

            {user.role === 'collection_center' && (
              <>
                <Route path="/center/dashboard" element={<CollectionCenterDashboard user={user} onLogout={handleLogout} />} />
                <Route path="/pickup-tracking" element={<PickupTracking user={user} onLogout={handleLogout} />} />
              </>
            )}

            <Route path="/" element={<Navigate to={
              user.role === 'admin' ? '/admin/dashboard' :
              user.role === 'developer' ? '/developer/dashboard' :
              user.role === 'collection_center' ? '/center/dashboard' :
              '/dashboard'
            } />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
