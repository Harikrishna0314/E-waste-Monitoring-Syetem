import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Leaf, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface RegisterPageProps {
  onRegister: (user: any, token: string) => void;
}

export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'user',
    phone: '',
    city: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role,
        phone: formData.phone,
        city: formData.city,
        country: formData.country
      });

      const { user, token } = response.data;
      onRegister(user, token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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

          <h2 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h2>
          <p className="text-white/70 text-center mb-8">Join our e-waste recycling platform</p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="glass-input text-white placeholder-white/50 text-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="glass-input text-white placeholder-white/50 text-sm"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="glass-input text-white text-sm"
              >
                <option value="user">User</option>
                <option value="collection_center">Collection Center</option>
                <option value="developer">Developer</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="glass-input text-white placeholder-white/50 text-sm"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="glass-input text-white placeholder-white/50 text-sm"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                className="glass-input text-white placeholder-white/50 text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 mt-4"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-white/70 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-300 hover:text-emerald-200 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
