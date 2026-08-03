import { LogOut, Users, MapPin, TrendingUp, Download, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

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

// Mock data
const monthlyRequestsData = [
  { month: 'Jan', requests: 120, completed: 90 },
  { month: 'Feb', requests: 150, completed: 110 },
  { month: 'Mar', requests: 180, completed: 140 },
  { month: 'Apr', requests: 200, completed: 160 },
  { month: 'May', requests: 220, completed: 180 },
  { month: 'Jun', requests: 250, completed: 200 },
];

const deviceCategoryData = [
  { name: 'Laptop', value: 35 },
  { name: 'Mobile', value: 25 },
  { name: 'Monitor', value: 20 },
  { name: 'Battery', value: 12 },
  { name: 'Other', value: 8 },
];

const centerPerformanceData = [
  { center: 'Center A', pickups: 150, recycled: 145 },
  { center: 'Center B', pickups: 120, recycled: 110 },
  { center: 'Center C', pickups: 180, recycled: 170 },
  { center: 'Center D', pickups: 95, recycled: 85 },
];

const COLORS = ['#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444'];

export default function AdminDashboardEnhanced({ user, onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('month');

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleExportReport = () => {
    alert('Report export feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/70 mt-1">System Overview & Analytics</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-white px-4 py-2 rounded-lg transition-all"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Total Users</p>
              <p className="text-4xl font-bold text-white mt-2">2,543</p>
              <p className="text-emerald-300 text-xs mt-2">↑ 12% from last month</p>
            </div>
            <Users className="w-12 h-12 text-emerald-400 opacity-50" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Collection Centers</p>
              <p className="text-4xl font-bold text-white mt-2">48</p>
              <p className="text-blue-300 text-xs mt-2">↑ 3 new centers</p>
            </div>
            <MapPin className="w-12 h-12 text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Items Recycled</p>
              <p className="text-4xl font-bold text-white mt-2">15,234</p>
              <p className="text-purple-300 text-xs mt-2">↑ 8% from last month</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-400 opacity-50" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">AI Accuracy</p>
              <p className="text-4xl font-bold text-white mt-2">94.2%</p>
              <p className="text-green-300 text-xs mt-2">↑ 2.1% improvement</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Requests Chart */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-4">Monthly Requests & Completion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRequestsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device Category Distribution */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-4">Device Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Center Performance */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-white font-semibold mb-4">Collection Center Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={centerPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="pickups" fill="#10b981" />
            <Bar dataKey="recycled" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Environmental Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="glass p-6 rounded-xl">
          <p className="text-white/70 text-sm">CO₂ Saved</p>
          <p className="text-3xl font-bold text-white mt-2">45,230 kg</p>
          <p className="text-emerald-300 text-xs mt-2">Equivalent to 5 trees</p>
        </div>
        <div className="glass p-6 rounded-xl">
          <p className="text-white/70 text-sm">Energy Saved</p>
          <p className="text-3xl font-bold text-white mt-2">12,450 kWh</p>
          <p className="text-blue-300 text-xs mt-2">Household power for 1 month</p>
        </div>
        <div className="glass p-6 rounded-xl">
          <p className="text-white/70 text-sm">Water Saved</p>
          <p className="text-3xl font-bold text-white mt-2">234,500 L</p>
          <p className="text-purple-300 text-xs mt-2">Olympic pools: 0.9</p>
        </div>
        <div className="glass p-6 rounded-xl">
          <p className="text-white/70 text-sm">Materials Recovered</p>
          <p className="text-3xl font-bold text-white mt-2">2,345 kg</p>
          <p className="text-green-300 text-xs mt-2">Copper & Aluminum</p>
        </div>
      </div>
    </div>
  );
}
