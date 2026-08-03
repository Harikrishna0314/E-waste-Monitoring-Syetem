import { LogOut, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

export default function AIDetection({ user, onLogout }: PageProps) {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">AI E-Waste Detection</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
        <div className="border-2 border-dashed border-white/30 rounded-lg p-12 text-center">
          <Upload className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">Upload E-Waste Image</h3>
          <p className="text-white/70 mb-6">Drag and drop or click to select an image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:shadow-lg transition-all">
            Select Image
          </label>
        </div>
      </div>
    </div>
  );
}
