import { LogOut, Leaf, Zap, Droplet, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface PageProps {
  user: User;
  onLogout: () => void;
}

export default function EnvironmentalAnalytics({ user, onLogout }: PageProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Environmental Analytics</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-xl">
          <Leaf className="w-8 h-8 text-green-400 mb-4" />
          <p className="text-white/70 text-sm">CO₂ Saved</p>
          <p className="text-3xl font-bold text-white mt-2">0 kg</p>
        </div>

        <div className="glass p-6 rounded-xl">
          <Zap className="w-8 h-8 text-yellow-400 mb-4" />
          <p className="text-white/70 text-sm">Energy Saved</p>
          <p className="text-3xl font-bold text-white mt-2">0 kWh</p>
        </div>

        <div className="glass p-6 rounded-xl">
          <Droplet className="w-8 h-8 text-blue-400 mb-4" />
          <p className="text-white/70 text-sm">Water Saved</p>
          <p className="text-3xl font-bold text-white mt-2">0 L</p>
        </div>

        <div className="glass p-6 rounded-xl">
          <TreePine className="w-8 h-8 text-emerald-400 mb-4" />
          <p className="text-white/70 text-sm">Trees Saved</p>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
      </div>
    </div>
  );
}
