import { useState } from 'react';
import { Header } from '../../components/Header';
import { Search, Database, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export function AuditExplorer() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!hash) return;
    setSearching(true);
    setResult(null);

    try {
      const res = await fetch('http://localhost:3001/api/hw/audit-ledger');
      const data = await res.json();
      
      const block = data.ledger.find((b: any) => b.hash.includes(hash) || b.data.report_id?.includes(hash) || b.data.project_id?.includes(hash));
      
      if (block) {
        setResult({ ...block, chainValid: data.isValid });
      } else {
        setResult({ error: "Xesh topilmadi yoki Blockchain'da mavjud emas." });
      }
    } catch (e) {
      setResult({ error: "Xatolik yuz berdi." });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center mb-12">
          <Database className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-4xl font-black mb-2 tracking-tight">HokimWatch Audit Explorer</h1>
          <p className="text-slate-400">Blockchain audit zanjiridan xesh-kodlarni tekshirish va tasdiqlash vositasi</p>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl mb-8">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                value={hash}
                onChange={e => setHash(e.target.value)}
                placeholder="Hash kodini yoki ID ni kiriting..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={searching}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              {searching ? "Qidirilmoqda..." : "Tekshirish"}
            </button>
          </div>
        </div>

        {result && (
          <div className={`rounded-2xl border p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${result.error ? 'bg-red-500/10 border-red-500/50' : 'bg-emerald-500/10 border-emerald-500/50'}`}>
            {result.error ? (
              <div className="flex items-center gap-4 text-red-400">
                <AlertCircle className="w-12 h-12" />
                <div>
                  <h3 className="text-xl font-bold">Xatolik</h3>
                  <p>{result.error}</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-emerald-400">TASDIQLANDI</h3>
                      <p className="text-slate-400">Ushbu ma'lumot blockchain zanjirida mavjud va o'zgartirilmagan.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">BLOCK #{result.index}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-sm">
                  <div className="space-y-4">
                    <div>
                      <div className="text-slate-500 uppercase text-[10px] mb-1">Hash Kodingiz</div>
                      <div className="bg-slate-900 p-3 rounded border border-slate-700 break-all text-emerald-400">{result.hash}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 uppercase text-[10px] mb-1">Oldingi Block Hash</div>
                      <div className="bg-slate-900 p-3 rounded border border-slate-700 break-all">{result.previousHash}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-slate-500 uppercase text-[10px] mb-1">Vaqt</div>
                      <div className="bg-slate-900 p-3 rounded border border-slate-700">{new Date(result.timestamp).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 uppercase text-[10px] mb-1">Ma'lumot</div>
                      <div className="bg-slate-900 p-3 rounded border border-slate-700 whitespace-pre-wrap">
                        {JSON.stringify(result.data, null, 2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className={`w-2 h-2 rounded-full ${result.chainValid ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    Blockchain Butunligi: {result.chainValid ? 'Buzilmagan' : 'XAVF OSTIDA'}
                  </div>
                  <Link to="/hokimwatch" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Qaytish
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
