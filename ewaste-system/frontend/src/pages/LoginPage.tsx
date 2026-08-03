import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Leaf, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface LoginPageProps {
  onLogin: (user: any, token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { user, token } = response.data;
      onLogin(user, token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glass Card */}
        <div className="glass p-8 rounded-2xl shadow-2xl animate-slide-up">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-emerald-400 to-blue-500 p-3 rounded-full">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="ml-3 text-2xl font-bold text-white">E-Waste Monitor</h1>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h2>
          <p className="text-white/70 text-center mb-8">Sign in to your account</p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="glass-input text-white placeholder-white/50"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input text-white placeholder-white/50"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="px-3 text-white/50 text-sm">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-white/70">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-300 hover:text-emerald-200 font-semibold">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 glass p-4 rounded-lg text-white/80 text-sm">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>User: user@example.com / password</p>
          <p>Admin: admin@example.com / password</p>
        </div>
      </div>
    </div>
  );
}
