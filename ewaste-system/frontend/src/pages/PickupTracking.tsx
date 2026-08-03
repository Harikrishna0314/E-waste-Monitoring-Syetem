import { LogOut } from 'lucide-react';
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

export default function PickupTracking({ user, onLogout }: PageProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Pickup Tracking</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="glass p-8 rounded-2xl">
        <p className="text-white/70">No pickups scheduled yet</p>
      </div>
    </div>
  );
}
