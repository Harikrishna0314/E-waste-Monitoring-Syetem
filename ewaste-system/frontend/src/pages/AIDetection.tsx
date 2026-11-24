import { useRef, useState } from 'react';
import axios from 'axios';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock3, ImagePlus, Leaf, Loader2, RefreshCw, ShieldAlert, Sparkles, Upload, Weight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Prediction {
  prediction_id?: number;
  detected_objects: string[];
  confidence_scores: number[];
  estimated_weights: number[];
  estimated_values: number[];
  hazard_levels: string[];
  recommendations: string[];
  total_items: number;
  total_weight: number;
  total_value: number;
  accuracy: number;
  processing_time: number;
  bounding_boxes?: Array<{x1:number;y1:number;x2:number;y2:number;width:number;height:number}>;
}
const pretty = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export default function AIDetection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState<Prediction | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const chooseFile = (next?: File) => {
    setError(''); setResult(null);
    if (!next) return;
    if (!next.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (next.size > 10 * 1024 * 1024) { setError('Image must be smaller than 10 MB.'); return; }
    if (preview) URL.revokeObjectURL(preview);
    setFile(next); setPreview(URL.createObjectURL(next));
  };
  const detect = async () => {
    if (!file) { setError('Choose an image before starting detection.'); return; }
    setLoading(true); setError(''); setResult(null);
    const body = new FormData(); body.append('file', file);
    try {
      const response = await axios.post<Prediction>(`${API_URL}/ai/predict`, body);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Detection failed. Check that the AI backend and trained e-waste model are running.');
    } finally { setLoading(false); }
  };
  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview(''); setResult(null); setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-400/15 p-2 text-emerald-300"><Leaf /></div><div><p className="font-bold">E-Waste Monitor</p><p className="text-xs text-slate-400">AI detection workspace</p></div></div>
          <div className="flex gap-2"><button onClick={() => window.history.back()} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"><ArrowLeft size={16}/> Back</button></div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8"><div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300"><Sparkles size={14}/> Computer vision</div><h1 className="text-3xl font-bold tracking-tight md:text-4xl">E-Waste Image Detection</h1><p className="mt-2 max-w-2xl text-slate-400">Upload a clear photo of electronic waste to identify supported items, estimate weight and value, and view safe recycling guidance.</p></div>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <section className="rounded-2xl border border-white/10 bg-slate-900 p-5 md:p-7">
            <div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">Upload an image</h2><span className="text-xs text-slate-500">JPG, PNG, WEBP · Max 10 MB</span></div>
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => chooseFile(e.target.files?.[0])}/>
            {preview ? <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950"><img src={preview} alt="Selected e-waste" className="max-h-[420px] w-full object-contain"/><div className="flex items-center justify-between gap-3 border-t border-white/10 p-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{file?.name}</p><p className="text-xs text-slate-500">{file ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : ''}</p></div><button onClick={reset} className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5">Remove</button></div></div> : <button onClick={() => inputRef.current?.click()} className="flex min-h-[310px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/60 px-6 text-center transition hover:border-emerald-400/60 hover:bg-emerald-400/5"><div className="mb-4 rounded-2xl bg-emerald-400/10 p-4 text-emerald-300"><ImagePlus size={32}/></div><span className="font-semibold">Choose an image to upload</span><span className="mt-2 text-sm text-slate-500">Select a photo from your device</span><span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950"><Upload size={16}/> Browse files</span></button>}
            {error && <div role="alert" className="mt-4 flex gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200"><AlertCircle size={18} className="shrink-0"/>{error}</div>}
            <button onClick={detect} disabled={!file || loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40">{loading ? <><Loader2 size={18} className="animate-spin"/> Analyzing image...</> : <><Sparkles size={18}/> Detect e-waste</>}</button>
            <p className="mt-3 text-center text-xs text-slate-500">Your image is sent securely to the configured backend for analysis.</p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-slate-900 p-5 md:p-7">
            <h2 className="mb-5 font-semibold">Detection results</h2>
            {!result && <div className="flex min-h-[310px] flex-col items-center justify-center text-center"><div className="mb-4 rounded-2xl bg-slate-800 p-4 text-slate-500"><Sparkles size={30}/></div><p className="font-medium text-slate-300">Your results will appear here</p><p className="mt-2 max-w-xs text-sm text-slate-500">Upload an image and run detection to see identified e-waste items and recycling recommendations.</p></div>}
            {result && <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Items detected</p><p className="mt-1 text-2xl font-bold">{result.total_items ?? result.detected_objects?.length ?? 0}</p></div><div className="rounded-xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Estimated weight</p><p className="mt-1 text-2xl font-bold">{Number(result.total_weight || 0).toFixed(2)} <span className="text-sm text-slate-400">kg</span></p></div><div className="rounded-xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Estimated recovery value</p><p className="mt-1 text-2xl font-bold">${Number(result.total_value || 0).toFixed(2)}</p></div><div className="rounded-xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Avg. confidence</p><p className="mt-1 text-2xl font-bold">{(Number(result.accuracy || 0) * 100).toFixed(1)}%</p></div></div>
              <div><h3 className="mb-3 text-sm font-semibold text-slate-300">Identified items</h3>{result.detected_objects?.length ? <div className="space-y-3">{result.detected_objects.map((item, i) => <div key={i} className="rounded-xl border border-white/10 bg-slate-950 p-4"><div className="flex items-center justify-between gap-2"><p className="font-semibold">{pretty(item)}</p><span className={`rounded-full px-2 py-1 text-xs ${result.hazard_levels?.[i] === 'high' ? 'bg-rose-400/15 text-rose-300' : result.hazard_levels?.[i] === 'medium' ? 'bg-amber-400/15 text-amber-300' : 'bg-emerald-400/15 text-emerald-300'}`}>{pretty(result.hazard_levels?.[i] || 'unknown')} hazard</span></div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400"><span>{((result.confidence_scores?.[i] || 0) * 100).toFixed(1)}% confidence</span><span>{result.estimated_weights?.[i] ?? 0} kg est.</span><span>${result.estimated_values?.[i] ?? 0} est. value</span></div>{result.recommendations?.[i] && <p className="mt-3 flex gap-2 text-sm leading-relaxed text-slate-300"><ShieldAlert size={16} className="mt-0.5 shrink-0 text-emerald-300"/>{result.recommendations[i]}</p>}</div>)}</div> : <p className="rounded-xl bg-slate-950 p-4 text-sm text-slate-400">No supported e-waste objects were detected. Try a clearer, closer image with fewer objects.</p>}</div>
              <div className="flex flex-wrap gap-4 border-t border-white/10 pt-4 text-xs text-slate-500"><span className="flex items-center gap-1"><Clock3 size={14}/> {Number(result.processing_time || 0).toFixed(2)} sec</span><span className="flex items-center gap-1"><Weight size={14}/> Model estimates only</span><span className="flex items-center gap-1"><CheckCircle2 size={14}/> Saved to history</span></div>
              <button onClick={reset} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium hover:bg-white/5"><RefreshCw size={16}/> Analyze another image</button>
            </div>}
          </section>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-slate-500">Safety note: AI output is an estimate, not a certified material assessment. Do not dismantle batteries, monitors, or other hazardous electronics. Use an authorized e-waste recycler.</p>
      </main>
    </div>
  );
}
