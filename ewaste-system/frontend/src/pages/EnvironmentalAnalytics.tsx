import { Leaf, Zap, Droplet, TreePine } from 'lucide-react';

export default function EnvironmentalAnalytics() {
  const metrics = [
    { label: 'CO₂ Saved', value: '— kg', Icon: Leaf },
    { label: 'Energy Saved', value: '— kWh', Icon: Zap },
    { label: 'Water Saved', value: '— L', Icon: Droplet },
    { label: 'Trees Saved', value: '—', Icon: TreePine }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Environmental Analytics</h1>
      <p className="text-white/80 mb-6">Live aggregate analytics require persistent storage, which is disabled in this public demo.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(({ label, value, Icon }) => <div key={label} className="glass p-6 rounded-xl"><Icon className="w-8 h-8 text-emerald-200 mb-4" /><p className="text-white/70 text-sm">{label}</p><p className="text-3xl font-bold text-white mt-2">{value}</p></div>)}
      </div>
    </div>
  );
}
