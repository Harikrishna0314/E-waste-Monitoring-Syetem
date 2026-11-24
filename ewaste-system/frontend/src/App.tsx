import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import AIDetection from './pages/AIDetection';
import PickupTracking from './pages/PickupTracking';
import EnvironmentalAnalytics from './pages/EnvironmentalAnalytics';
import AboutProject from './pages/AboutProject';
import ApiDocs from './pages/ApiDocs';

function App() {
  return <Router><Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<Navigate to="/dashboard" replace />} />
    <Route path="/register" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<UserDashboard />} />
    <Route path="/ai-detection" element={<AIDetection />} />
    <Route path="/pickup-tracking" element={<PickupTracking />} />
    <Route path="/analytics" element={<EnvironmentalAnalytics />} />
    <Route path="/about" element={<AboutProject />} />
    <Route path="/api-docs" element={<ApiDocs />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></Router>;
}
export default App;
