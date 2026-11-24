import { Leaf, Zap, Droplet, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export default function UserDashboard({ user }: { user: User }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-white/20 p-3 rounded-full"><Leaf className="w-8 h-8 text-white" /></div>
        <div><h1 className="text-3xl font-bold text-white">E-Waste Monitor</h1><p className="text-white/70">Public Dashboard</p></div>
      </div>
      <div className="glass p-8 rounded-2xl mb-8 animate-slide-up">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome, {user.full_name}!</h2>
        <p className="text-white/70">Explore e-waste detection and recycling information. No account required.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate('/ai-detection')}>
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-4 rounded-lg mb-4 group-hover:scale-110 transition-transform"><Leaf className="w-8 h-8 text-white" /></div>
          <h3 className="text-white font-semibold mb-1">AI Detection</h3><p className="text-white/70 text-sm">Detect e-waste items using AI</p>
        </div>
        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate('/pickup-tracking')}>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-lg mb-4 group-hover:scale-110 transition-transform"><Zap className="w-8 h-8 text-white" /></div>
          <h3 className="text-white font-semibold mb-1">Pickup Information</h3><p className="text-white/70 text-sm">View pickup service information</p>
        </div>
        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate('/pickup-tracking')}>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-lg mb-4 group-hover:scale-110 transition-transform"><Droplet className="w-8 h-8 text-white" /></div>
          <h3 className="text-white font-semibold mb-1">Collection Guide</h3><p className="text-white/70 text-sm">Learn about e-waste collection</p>
        </div>
        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate('/analytics')}>
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-lg mb-4 group-hover:scale-110 transition-transform"><TreePine className="w-8 h-8 text-white" /></div>
          <h3 className="text-white font-semibold mb-1">Impact</h3><p className="text-white/70 text-sm">View environmental impact information</p>
        </div>
      </div>
      <div className="glass p-6 rounded-xl"><p className="text-white/70 text-sm">Account-based statistics are disabled because this public demo does not store user data.</p></div>
    </div>
  );
}
