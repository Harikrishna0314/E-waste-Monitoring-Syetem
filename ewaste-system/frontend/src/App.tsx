import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import AIDetection from './pages/AIDetection';
import PickupTracking from './pages/PickupTracking';
import EnvironmentalAnalytics from './pages/EnvironmentalAnalytics';

const guestUser = {
  id: 0,
  email: 'guest@local',
  full_name: 'Guest',
  role: 'guest'
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/register" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<UserDashboard user={guestUser} />} />
        <Route path="/ai-detection" element={<AIDetection />} />
        <Route path="/pickup-tracking" element={<PickupTracking />} />
        <Route path="/analytics" element={<EnvironmentalAnalytics />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
