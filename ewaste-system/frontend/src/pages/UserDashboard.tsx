import { LogOut, Leaf, Zap, Droplet, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function UserDashboard({ user, onLogout }: DashboardProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">E-Waste Monitor</h1>
            <p className="text-white/70">User Dashboard</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Welcome Card */}
      <div className="glass p-8 rounded-2xl mb-8 animate-slide-up">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome, {user.full_name}!</h2>
        <p className="text-white/70">Start your e-waste recycling journey today</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Upload E-Waste */}
        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => navigate('/ai-detection')}>
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-4 rounded-lg mb-4 group-hover:scale-110 transition-transform">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-1">AI Detection</h3>
          <p className="text-white/70 text-sm">Detect e-waste items using AI</p>
        </div>

        {/* Book Pickup */}
        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => navigate('/pickup-tracking')}>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-lg mb-4 group-hover:scale-110 transition-transform">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-1">Book Pickup</h3>
          <p className="text-white/70 text-sm">Schedule e-waste collection</p>
        </div>

        {/* Track Pickup */}
        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => navigate('/pickup-tracking')}>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-lg mb-4 group-hover:scale-110 transition-transform">
            <Droplet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-1">Track Pickup</h3>
          <p className="text-white/70 text-sm">Monitor your pickups in real-time</p>
        </div>

        {/* Environmental Impact */}
        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => navigate('/analytics')}>
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-lg mb-4 group-hover:scale-110 transition-transform">
            <TreePine className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-1">Impact</h3>
          <p className="text-white/70 text-sm">View your environmental impact</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-xl">
          <p className="text-white/70 text-sm mb-2">Items Recycled</p>
          <p className="text-4xl font-bold text-white">0</p>
        </div>
        <div className="glass p-6 rounded-xl">
          <p className="text-white/70 text-sm mb-2">CO₂ Saved (kg)</p>
          <p className="text-4xl font-bold text-white">0</p>
        </div>
        <div className="glass p-6 rounded-xl">
          <p className="text-white/70 text-sm mb-2">Points Earned</p>
          <p className="text-4xl font-bold text-white">0</p>
        </div>
      </div>
    </div>
  );
}
