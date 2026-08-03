import { LogOut, Users, MapPin, TrendingUp } from 'lucide-react';
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

export default function AdminDashboard({ user, onLogout }: DashboardProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white mt-2">0</p>
            </div>
            <Users className="w-12 h-12 text-emerald-400 opacity-50" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Collection Centers</p>
              <p className="text-3xl font-bold text-white mt-2">0</p>
            </div>
            <MapPin className="w-12 h-12 text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Pending Requests</p>
              <p className="text-3xl font-bold text-white mt-2">0</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-400 opacity-50" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white mt-2">0</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-400 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}
