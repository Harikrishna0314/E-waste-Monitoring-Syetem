import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, ArrowUpRight, Battery, CheckCircle2, Cpu, Droplets, Gem, Leaf, Recycle, ShieldAlert, Sparkles, TreePine, Zap } from 'lucide-react';
import AppShell from '../components/AppShell';

const metrics = [
  { label: 'GLOBAL E-WASTE GENERATED', value: '62.0M', unit: 'Tonnes', note: 'Illustrative 2024 estimate', Icon: Recycle, color: 'text-emerald-300', bar: 'w-[72%]' },
  { label: 'FORMAL RECYCLING RATE', value: '22.3%', unit: 'Documented', note: 'Global reference figure', Icon: AlertTriangle, color: 'text-amber-300', bar: 'w-[22%]' },
  { label: 'HEAVY METALS MITIGATED', value: '14.8', unit: 'kg / demo avg', note: 'Sample model output', Icon: ShieldAlert, color: 'text-emerald-300', bar: 'w-[66%]' },
  { label: 'ECONOMIC VALUE AT STAKE', value: '$62B', unit: 'Annual gross', note: 'Illustrative estimate', Icon: Gem, color: 'text-emerald-300', bar: 'w-[55%]' },
];
const impact = [
  { title: 'Carbon Footprint Avoidance', text: 'Refurbishing and extracting secondary raw materials can reduce demand for virgin mineral mining and associated emissions.', value: 'DEMO INDICATOR', Icon: Leaf },
  { title: 'Groundwater Leaching Halt', text: 'Safe handling helps prevent hazardous substances from entering soil and groundwater through informal disposal.', value: 'SAFE DISPOSAL', Icon: Droplets },
  { title: 'Strategic Mineral Reserves', text: 'Recovering copper, gold, palladium and other materials supports a more circular electronics supply chain.', value: 'MATERIAL RECOVERY', Icon: Gem },
];
export default function UserDashboard() {
  const navigate = useNavigate();
  return <AppShell>
    <section className="overflow-hidden rounded-xl border border-[#29374d] bg-[radial-gradient(ellipse_at_90%_0%,rgba(25,135,112,.18),transparent_45%),linear-gradient(110deg,#17223a,#18283a)] p-6 md:p-8">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[9px] font-semibold tracking-[.13em] text-emerald-300"><span className="rounded-full bg-emerald-300/10 px-2.5 py-1">● PUBLIC DEMONSTRATION MODE</span><span className="text-slate-500">FINAL YEAR B.TECH ENGINEERING PROJECT</span></div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Circularity intelligence platform</p>
      <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#e2e8fa] md:text-[42px]">E-Waste Monitoring & <span className="text-emerald-300">Circular AI</span> System</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">AI-assisted classification of electronic waste, material hazard awareness, and responsible recovery guidance for a more circular electronics lifecycle.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => navigate('/ai-detection')} className="inline-flex items-center gap-2 rounded-lg bg-[#10b981] px-5 py-3 text-sm font-bold text-[#06251d] shadow-lg shadow-emerald-950/30 transition hover:bg-[#4edea3]"><Cpu size={16}/> Launch AI Scanner <ArrowUpRight size={15}/></button>
        <button onClick={() => navigate('/pickup-tracking')} className="inline-flex items-center gap-2 rounded-lg border border-[#34435a] bg-[#202b40] px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-[#29374d]"><Recycle size={16} className="text-emerald-300"/> Explore Disposal Guide</button>
        <button onClick={() => navigate('/analytics')} className="inline-flex items-center gap-2 rounded-lg border border-[#34435a] bg-[#101a2d] px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-[#202b40]"><Activity size={16}/> View Demo Analytics</button>
      </div>
    </section>
    <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({label,value,unit,note,Icon,color,bar}) => <article key={label} className="rounded-xl border border-[#26334a] bg-[#151f33] p-4 shadow-lg shadow-black/10"><div className="flex items-start justify-between gap-2"><p className="max-w-[190px] text-[9px] font-bold tracking-[.12em] text-slate-400">{label}</p><Icon size={17} className={color}/></div><div className="mt-4 flex items-baseline gap-2"><strong className="text-3xl font-extrabold tracking-tight text-[#e2e8fa]">{value}</strong><span className="text-[10px] text-slate-400">{unit}</span></div><p className="mt-2 text-[10px] text-slate-500">{note}</p><div className="mt-3 h-1 overflow-hidden rounded-full bg-[#303b50]"><div className={`h-full rounded-full bg-emerald-400 ${bar}`}/></div></article>)}
    </section>
    <section className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_.9fr]">
      <article className="rounded-xl border border-[#26334a] bg-[#151f33] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[.15em] text-emerald-300">Computer vision / model workspace</p><h2 className="mt-1 text-xl font-bold">AI Vision Recognition Engine</h2><p className="mt-1 text-[11px] text-slate-400">YOLO-powered electronic waste classification</p></div><span className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-[9px] font-bold text-emerald-200">MODEL DEMO</span></div>
        <div className="mt-5 grid min-h-[210px] place-items-center overflow-hidden rounded-lg border border-emerald-300/10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,.16),transparent_60%),linear-gradient(135deg,#071527,#10263a)] p-6 text-center">
          <div><div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300"><Cpu size={42}/></div><p className="font-semibold text-slate-100">Visual inspection console</p><p className="mt-2 max-w-md text-xs leading-5 text-slate-400">Upload an image to identify supported e-waste categories and receive confidence scores with safe handling guidance.</p><button onClick={() => navigate('/ai-detection')} className="mt-4 rounded-lg border border-emerald-300/30 px-4 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-300/10">Open image ingestion console →</button></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">{['Printed Circuit Boards','Lithium-Polymer Cells','CRT Displays','Copper Core Wiring','Rare-Earth Motors','Capacitor Arrays'].map(x=><span key={x} className="rounded bg-[#202b40] px-2 py-1 text-[9px] text-slate-300">{x}</span>)}</div>
        <p className="mt-5 text-[10px] text-slate-500">Predictions are processed on request and are not saved to user history.</p>
      </article>
      <article className="rounded-xl border border-[#26334a] bg-[#151f33] p-5">
        <div className="flex items-center gap-2"><Sparkles size={17} className="text-emerald-300"/><h2 className="text-lg font-bold">How CirculAI Works</h2></div>
        <p className="mt-2 text-xs leading-5 text-slate-400">A simple workflow from image input to safer end-of-life handling.</p>
        <div className="mt-5 space-y-3">{[{n:'01',t:'Optical Ingestion',d:'Upload an image of discarded electronic equipment.'},{n:'02',t:'AI Classification',d:'The model identifies supported waste categories and confidence scores.'},{n:'03',t:'Safe Recovery Guidance',d:'Review hazard information and responsible disposal recommendations.'}].map(s=><div key={s.n} className="flex gap-3 rounded-lg bg-[#1b263a] p-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-xs font-bold text-emerald-300">{s.n}</span><div><h3 className="text-sm font-semibold">{s.t}</h3><p className="mt-1 text-[11px] leading-5 text-slate-400">{s.d}</p></div></div>)}</div>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-[#2b3a50] px-3 py-2 text-[10px] text-slate-400"><span className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-300"/> Public demo mode</span><span className="text-emerald-300">READY</span></div>
      </article>
    </section>
    <section className="mt-7"><div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-emerald-300">Ecological stewardship matrix</p><h2 className="mt-1 text-2xl font-bold">Environmental Impact Offsets</h2></div><span className="text-[9px] text-slate-500">EDUCATIONAL INDICATORS · NOT LIVE TELEMETRY</span></div><div className="grid gap-3 md:grid-cols-3">{impact.map(({title,text,value,Icon})=><article key={title} className="rounded-xl border border-[#26334a] bg-[#151f33] p-5"><div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#202b40] text-emerald-300"><Icon size={18}/></div><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 min-h-[70px] text-xs leading-5 text-slate-400">{text}</p><div className="mt-4 flex items-center justify-between border-t border-[#29364b] pt-3 text-[9px]"><span className="text-slate-500">REFERENCE</span><span className="font-bold text-emerald-300">{value}</span></div></article>)}</div></section>
    <section className="mt-7"><div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold">Safe E-Waste Handling Protocols</h2><span className="text-[9px] text-slate-500">GENERAL SAFETY GUIDANCE</span></div><div className="grid gap-3 md:grid-cols-3">{[{t:'Isolate Lithium Batteries',d:'Do not puncture, crush, or dismantle damaged lithium-ion batteries. Keep them away from heat and arrange specialist collection.',Icon:Battery},{t:'Separate From Household Waste',d:'Keep electronic devices and circuit boards out of ordinary bins. Use an authorized e-waste collection or recycling route.',Icon:Recycle},{t:'Protect Personal Data',d:'Back up important files and securely erase personal information from phones, computers, and storage devices before recycling.',Icon:ShieldAlert}].map(({t,d,Icon})=><article key={t} className="rounded-xl border border-[#26334a] bg-[#151f33] p-4"><div className="mb-3 flex items-center gap-2 text-emerald-300"><Icon size={16}/><h3 className="text-sm font-semibold">{t}</h3></div><p className="text-[11px] leading-5 text-slate-400">{d}</p></article>)}</div></section>
    <footer className="mt-8 flex flex-wrap justify-between gap-2 border-t border-[#26334a] pt-4 text-[9px] text-slate-500"><span className="flex items-center gap-2"><ShieldCheck size={12}/> CirculAI Capstone Demonstrator · Flask + PyTorch</span><span>DEMO BUILD · PUBLIC GUEST ACCESS</span></footer>
  </AppShell>;
}
