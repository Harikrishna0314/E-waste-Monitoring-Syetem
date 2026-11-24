import { useState } from 'react';
import { Check, Copy, FileCode2, Server, ShieldCheck } from 'lucide-react';
import AppShell from '../components/AppShell';
const API = [
  { method: 'GET', path: '/api/health', title: 'Health check', detail: 'Returns API availability and confirms that database persistence is disabled.' },
  { method: 'GET', path: '/api/ai/model-info', title: 'AI model information', detail: 'Returns configured model path status and supported e-waste labels.' },
  { method: 'POST', path: '/api/ai/predict', title: 'Run image inference', detail: 'Accepts multipart/form-data with one image field named file. Returns classes, confidence, bounding boxes, hazard levels, recommendations, and estimates.' },
  { method: 'GET', path: '/api/analytics/environmental', title: 'Environmental analytics', detail: 'Returns an empty analytics collection because this deployment does not persist user or regional records.' },
];
export default function ApiDocs() {
  const [copied, setCopied] = useState('');
  const copy = async (value: string) => { try { await navigator.clipboard.writeText(value); setCopied(value); window.setTimeout(() => setCopied(''), 1800); } catch { setCopied(''); } };
  const base = import.meta.env.VITE_API_URL || window.location.origin;
  const curl = `curl -X POST "${base}/api/ai/predict" -F "file=@ewaste-image.jpg"`;
  return <AppShell><div className="mb-6"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-emerald-300">Developer interface / REST contract</p><h1 className="mt-1 text-3xl font-extrabold">API Docs & Schema</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Public API reference for the database-free CirculAI demonstration.</p></div>
  <div className="grid gap-3 md:grid-cols-3">{[{t:'Authentication',v:'Not required',Icon:ShieldCheck},{t:'Persistence',v:'Disabled',Icon:Server},{t:'Inference input',v:'Multipart image',Icon:FileCode2}].map(({t,v,Icon})=><div key={t} className="rounded-xl border border-[#26334a] bg-[#151f33] p-4"><Icon size={18} className="text-emerald-300"/><p className="mt-3 text-[10px] uppercase tracking-wider text-slate-500">{t}</p><p className="mt-1 text-lg font-bold">{v}</p></div>)}</div>
  <section className="mt-4 space-y-3">{API.map(api=><article key={api.path} className="rounded-xl border border-[#26334a] bg-[#151f33] p-5"><div className="flex flex-wrap items-center gap-3"><span className={`rounded px-2 py-1 text-[10px] font-bold ${api.method==='POST'?'bg-emerald-300/10 text-emerald-300':'bg-sky-300/10 text-sky-200'}`}>{api.method}</span><code className="text-sm text-slate-100">{api.path}</code></div><h2 className="mt-3 text-sm font-bold">{api.title}</h2><p className="mt-1 text-xs leading-5 text-slate-400">{api.detail}</p></article>)}</section>
  <section className="mt-4 rounded-xl border border-[#26334a] bg-[#151f33] p-5"><h2 className="font-bold">Example: submit an image</h2><p className="mt-1 text-xs text-slate-400">Replace the sample filename with a local image path.</p><pre className="mt-4 overflow-x-auto rounded-lg bg-[#080f20] p-4 text-xs leading-6 text-emerald-200">{curl}</pre><button onClick={()=>copy(curl)} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#34435a] px-3 py-2 text-xs font-semibold hover:bg-white/5">{copied===curl?<Check size={14}/>:<Copy size={14}/>} {copied===curl?'Copied':'Copy cURL'}</button></section>
  <p className="mt-4 text-[10px] leading-5 text-slate-500">AI inference requires compatible trained YOLO weights configured on the backend. Weight and recovery-value outputs are heuristics, not certified valuations.</p></AppShell>;
}