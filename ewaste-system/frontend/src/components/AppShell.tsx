import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Activity, BarChart3, BookOpen, Cpu, Database, Leaf, Recycle, ShieldCheck } from 'lucide-react';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', Icon: Activity },
  { to: '/ai-detection', label: 'AI Detection', Icon: Cpu, tag: 'AI CORE' },
  { to: '/analytics', label: 'Analytics', Icon: BarChart3 },
  { to: '/pickup-tracking', label: 'Disposal & Centers', Icon: Recycle },
  { to: '/about', label: 'About Project', Icon: BookOpen },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const current = navigation.find(item => item.to === location.pathname)?.label ?? 'Dashboard';
  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[224px] flex-col border-r border-[#28344a] bg-[#080f20] px-3 py-5 lg:flex">
        <div className="mb-7 flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300"><Recycle size={22}/></div>
          <div><p className="text-[15px] font-extrabold tracking-tight">CirculAI</p><p className="text-[9px] font-bold uppercase tracking-[.18em] text-emerald-300">E-Waste Intelligence</p></div>
        </div>
        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300"/> Guest Mode / Demo</div>
        <nav className="space-y-1">
          {navigation.map(({to,label,Icon,tag}) => <NavLink key={to} to={to} className={({isActive}) => `flex items-center justify-between rounded-lg border px-3 py-2.5 text-[12px] transition ${isActive ? 'border-emerald-300/20 bg-[#202b40] text-emerald-300 shadow-[inset_2px_0_0_#4edea3]' : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'}`}>
            <span className="flex items-center gap-2.5"><Icon size={15}/>{label}</span>{tag && <span className="rounded-full bg-emerald-300/10 px-1.5 py-0.5 text-[8px] font-bold text-emerald-300">{tag}</span>}
          </NavLink>)}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="rounded-lg border border-[#29364b] bg-[#111b2d] p-3 text-[10px]">
            <div className="flex justify-between text-slate-300"><span>Academic Capstone</span><span className="text-emerald-300">Final Year</span></div>
            <div className="mt-2 flex items-center gap-2 text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300"/> Flask AI API · Guest access</div>
          </div>
          <div className="flex items-center justify-between px-1 text-[10px] text-slate-500"><span className="flex items-center gap-2"><Database size={12}/> Database disabled</span><ShieldCheck size={13}/></div>
        </div>
      </aside>
      <div className="min-h-screen lg:pl-[224px]">
        <header className="sticky top-0 z-20 flex min-h-[54px] flex-wrap items-center justify-between gap-3 border-b border-[#263249] bg-[#0a1223]/95 px-4 py-3 backdrop-blur md:px-7">
          <div className="flex items-center gap-2 text-[11px] text-slate-300"><span className="text-emerald-300"><Activity size={13}/></span> CirculAI System <span className="text-slate-600">/</span> <span className="text-slate-400">{current}</span></div>
          <div className="flex flex-wrap items-center gap-2 text-[9px] font-semibold tracking-wide">
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/5 px-2.5 py-1.5 text-emerald-200"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-300"/>PUBLIC DEMO · NO AUTH REQUIRED</span>
            <span className="rounded-full border border-[#344158] bg-[#111b2d] px-2.5 py-1.5 text-slate-400">SYSTEM ONLINE</span>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-5 md:px-7 md:py-7">{children}</main>
      </div>
      <div className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-[#263249] bg-[#080f20] px-2 py-2 lg:hidden">
        {navigation.map(({to,label,Icon}) => <NavLink key={to} to={to} className={({isActive}) => `flex flex-col items-center gap-1 px-2 text-[9px] ${isActive ? 'text-emerald-300' : 'text-slate-400'}`}><Icon size={17}/>{label}</NavLink>)}
      </div>
    </div>
  );
}
