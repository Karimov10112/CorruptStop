import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Header } from '../../components/Header';
import { ArrowLeft, Camera, Send, Star, ShieldCheck, Loader2 } from 'lucide-react';

export function ReportForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState("");

  // Form holatlari
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [defects, setDefects] = useState("");
  const [isCompleted, setIsCompleted] = useState("no");

  useEffect(() => {
    fetch(`http://localhost:3001/api/hw/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProject(data);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);

    const steps = [
      "📡 Davlat API portali bilan bog'lanilmoqda...",
      "🔐 Kriptografik SHA-256 xesh yaratilmoqda...",
      "📍 Geo-fencing koordinatalari tekshirilmoqda...",
      "🖼 EXIF va vaqt stampi validatsiyadan o'tkazilmoqda...",
      "🔗 Blockchain audit ledgerga yozilmoqda..."
    ];

    for (const step of steps) {
      setVerificationStep(step);
      await new Promise(r => setTimeout(r, 800));
    }

    setVerifying(false);
    setSubmitting(true);

    const reportData = {
      score_overall: score,
      is_completed: isCompleted,
      visible_defects: defects,
      hash_user_id: "demo-user-123", // Demo maqsadida qotirilgan
      after_photos: ["https://images.unsplash.com/photo-1590424744257-fdb03ed78ee0?auto=format&fit=crop&q=80&w=800"] // Demo rasm
    };

    fetch(`http://localhost:3001/api/hw/projects/${id}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    })
      .then(res => res.json())
      .then(() => {
        setSubmitting(false);
        navigate(`/hokimwatch/${id}`);
      })
      .catch(err => {
        console.error(err);
        setSubmitting(false);
      });
  };

  if (loading) return <div className="p-8 text-center">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Link to={`/hokimwatch/${id}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Loyihaga qaytish
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-xl font-bold text-slate-900 mb-1">Jamoatchilik Nazorati</h1>
            <p className="text-sm text-slate-500">Loyiha: {project?.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Baholash */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">1. Loyiha sifatiga umumiy baho bering</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setScore(star)}
                    onMouseEnter={() => setHoverScore(star)}
                    onMouseLeave={() => setHoverScore(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-10 h-10 ${(hoverScore || score) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Holat */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">2. Ishlar to'liq tugatilganmi?</label>
              <div className="grid grid-cols-3 gap-3">
                {['yes', 'partial', 'no'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setIsCompleted(status)}
                    className={`py-3 rounded-xl border font-medium text-sm transition-all ${
                      isCompleted === status 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {status === 'yes' ? 'Ha, tugatilgan' : status === 'partial' ? 'Qisman' : 'Yo\'q'}
                  </button>
                ))}
              </div>
            </div>

            {/* Rasm */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">3. Dalil sifatida rasm yuklang</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="font-medium text-slate-700">Rasmni yuklash uchun bosing</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG (Maks. 5MB)</p>
              </div>
            </div>

            {/* Nuqsonlar */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">4. Ko'rinadigan nuqsonlar haqida ma'lumot (ixtiyoriy)</label>
              <textarea
                value={defects}
                onChange={e => setDefects(e.target.value)}
                placeholder="Masalan: Devor bo'yog'i ko'chgan, eshiklar yopilmayapti..."
                rows={4}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting || verifying || score === 0}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Tekshirilmoqda...
                </>
              ) : submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Yuborilmoqda...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Xavfsiz Yuborish (7-Layer)
                </>
              )}
            </button>

            {verifying && (
              <div className="mt-4 p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs animate-pulse">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  XAVFSIZLIK PROTOKOLI FAOL
                </div>
                {verificationStep}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
