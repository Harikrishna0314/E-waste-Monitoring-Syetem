import { LogOut, Package, MapPin } from 'lucide-react';
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

export default function CollectionCenterDashboard({ user, onLogout }: DashboardProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Collection Center Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl">
          <Package className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-white font-semibold mb-2">Inventory</h3>
          <p className="text-white/70 text-sm">Manage collected e-waste items</p>
        </div>

        <div className="glass p-6 rounded-xl">
          <MapPin className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-white font-semibold mb-2">Assigned Pickups</h3>
          <p className="text-white/70 text-sm">View and manage pickup requests</p>
        </div>
      </div>
    </div>
  );
}
