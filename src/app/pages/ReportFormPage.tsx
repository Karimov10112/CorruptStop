import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import { Shield, MapPin, ChevronRight, ChevronLeft, CheckCircle, Upload, X, Search, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';

const customIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCAzMiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMEMxMC40NzcyIDAgNiA0LjQ3NzE1IDYgMTBDNiAxNy41IDE2IDMwIDE2IDMwQzE2IDMwIDI2IDE3LjUgMjYgMTBDMjYgNC40NzcxNSAyMS41MjI4IDAgMTYgMFoiIGZpbGw9IiNENTVBMzAiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjEwIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
});

function LocationMarker({ position, setPosition }: { position: [number, number], setPosition: (lat: number, lng: number) => void }) {
  // useMapEvents click funksiyasi o'chirildi, shunda xaritani bosib o'zgartirib bo'lmaydi
  const map = useMapEvents({});

  return position ? (
    <Marker position={position} icon={customIcon} draggable={false} />
  ) : null;
}

function MapRecenter({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 16);
  }, [position, map]);
  return null;
}

const sectors = [
  { emoji: '🏥', key: 'sector_health', id: 'health' },
  { emoji: '📚', key: 'sector_education', id: 'education' },
  { emoji: '🏗', key: 'sector_construction', id: 'construction' },
  { emoji: '🛒', key: 'sector_procurement', id: 'procurement' },
  { emoji: '🚗', key: 'sector_traffic', id: 'traffic' },
  { emoji: '🏠', key: 'sector_property', id: 'property' },
  { emoji: '⚖️', key: 'sector_justice', id: 'justice' },
  { emoji: '💰', key: 'sector_tax', id: 'tax' },
  { emoji: '⚽', key: 'sector_sport', id: 'sport' },
  { emoji: '🏘', key: 'sector_utilities', id: 'utilities' },
  { emoji: '👶', key: 'sector_social', id: 'social' },
  { emoji: '💼', key: 'sector_labor', id: 'labor' },
  { emoji: '🔒', key: 'sector_military', id: 'military' },
  { emoji: '📦', key: 'sector_other', id: 'other' },
];

export function ReportFormPage() {
  const { isAuthenticated, user } = useAuth();
  const { t, language } = useLanguage();
  const { addReport } = useReports();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sector: '',
    organization: '',
    locationType: '',
    city: '',
    address: '',
    description: '',
    amount: '',
    file: null as File | null,
    imagePreview: undefined as string | undefined,
    lat: 41.2995,
    lng: 69.2401
  });
  const [aiResult, setAiResult] = useState<any>(null);
  const [charCount, setCharCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl mb-4">Shikoyat berish uchun tizimga kiring</h2>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-trust-light dark:bg-trust-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-trust-teal" />
            </div>
            <h1 className="text-3xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              🎉 Shikoyatingiz qabul qilindi!
            </h1>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6 text-left">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded">AI ANALYSIS</div>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>
              <p className="text-sm text-slate-600 mb-4 italic">"{aiResult?.analysis}"</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Aniqlangan soha</p>
                  <p className="text-sm font-bold text-slate-700 capitalize">{aiResult?.category || 'Aniqlanmadi'}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Mas'ul tashkilot</p>
                  <p className="text-sm font-bold text-slate-700">{aiResult?.organization || 'Ko\'rib chiqilmoqda'}</p>
                </div>
              </div>

              {aiResult?.legal_basis && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <p className="text-[10px] text-blue-800 font-bold uppercase">Huquqiy asos: {aiResult.legal_basis}</p>
                </div>
              )}
            </div>


            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/map')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                🗺 Xaritada ko'rish
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                  setFormData({
                    sector: '',
                    locationType: '',
                    city: '',
                    address: '',
                    description: '',
                    amount: '',
                    file: null,
                  });
                }}
                className="px-6 py-3 border border-border rounded-lg hover:bg-muted"
              >
                📝 Yangi shikoyat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleNext = async () => {
    if (step === 1 && formData.description.length >= 10) {
      setStep(2);
    } else if (step === 2) {
      // Step 2 dan 3 ga o'tayotganda AI tahlilini boshlaymiz
      setStep(3);
      setLoading(true);
      try {
        const apiUrl = `http://${window.location.hostname}:3001/api/ai-precheck`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: formData.description })
        });
        
        if (!response.ok) throw new Error('Server hatosi');
        
        const result = await response.json();
        setAiResult(result);
      } catch (error) {
        console.error('AI Precheck Error:', error);
        alert('Tizim bilan bog\'lanishda xatolik. Iltimos, server ishlayotganini tekshiring.');
        setStep(2); // Qaytaramiz
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const apiUrl = `http://${window.location.hostname}:3001/api/reports`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          lat: formData.lat,
          lng: formData.lng,
          image: formData.imagePreview,
          category: aiResult?.category,
          organization: aiResult?.organization
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setReportId(result.id);
        if (result.ai_analysis) {
          setAiResult(result.ai_analysis);
        }
        setSubmitted(true);
      } else {
        alert(result.message || 'Xatolik yuz berdi');
      }
    } catch (error) {
      alert('Server bilan aloqa uzildi');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (loading) return false; // AI tahlil qilayotganda bosib bo'lmaydi
    if (step === 1) return formData.description.length >= 10;
    if (step === 2) return formData.locationType === 'gps';
    if (step === 3) return aiResult && aiResult.status !== 'invalid';
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    s === step
                      ? 'bg-primary text-primary-foreground scale-110'
                      : s < step
                      ? 'bg-trust-teal text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`h-1 w-full mx-2 rounded-full ${
                      s < step ? 'bg-trust-teal' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {language === 'uz' ? 'Qadam' : language === 'ru' ? 'Шаг' : 'Step'} {step} / 4
          </div>
        </div>

        <div className="bg-trust-light dark:bg-trust-teal/10 border border-trust-teal/20 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-trust-teal flex-shrink-0 mt-0.5" />
          <div className="text-sm text-deep-charcoal dark:text-foreground">
            <strong>GPS orqali aniq joylashuv.</strong> Muammo yuz bergan nuqta xaritada aniq ko'rsatiladi. Barcha ma'lumotlar shifrlangan va xavfsizlik kafolatlangan.
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-8">
          {/* Step 1: Description */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                Nima bo'lganini batafsil yozing
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                AI tizimi matnni tahlil qilib, tegishli sohani o'zi aniqlaydi. 
                Shuningdek, <a href="https://t.me/corruptstop_bot" target="_blank" className="text-primary font-bold hover:underline">Telegram botimiz</a> orqali ham yuborishingiz mumkin.
              </p>

              <div className="space-y-4">
                <div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 500);
                      setFormData({ ...formData, description: val });
                      setCharCount(val.length);
                    }}
                    placeholder="Masalan: Maktabimizda o'quvchilardan noqonuniy ravishda pul yig'ish holatlari kuzatilmoqda..."
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <div className="text-right text-xs text-muted-foreground mt-2 font-mono">
                    {charCount}/500
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    📎 Rasm yoki hujjat (ixtiyoriy)
                  </label>
                  
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, file });
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, imagePreview: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  {!formData.file ? (
                    <label 
                      htmlFor="file-upload"
                      className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-primary transition-all cursor-pointer block bg-slate-50/50"
                    >
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-600">
                        Faylni tanlang yoki yuklang
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        EXIF ma'lumotlari (joylashuv, vaqt) avtomatik tekshiriladi
                      </p>
                    </label>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex justify-center group">
                      {formData.imagePreview && (
                        <img 
                          src={formData.imagePreview} 
                          alt="Preview" 
                          className="max-w-full max-h-[300px] object-contain transition-transform group-hover:scale-105"
                        />
                      )}
                      <button 
                        onClick={() => setFormData({ ...formData, file: null, imagePreview: undefined })}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-xl hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                Hodisa qayerda bo'ldi?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">Xaritadan aniq nuqtani belgilang</p>

              <div className="space-y-4 mb-6">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, locationType: 'gps' }));
                    if (navigator.geolocation) {
                      setLoading(true);
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setFormData(prev => ({ 
                            ...prev, 
                            lat: pos.coords.latitude, 
                            lng: pos.coords.longitude 
                          }));
                          setLoading(false);
                        },
                        (err) => {
                          setLoading(false);
                          alert("GPS-ni aniqlash imkoni bo'lmadi. Iltimos, xaritada o'zingiz belgilang yoki brauzerda ruxsat berilganini tekshiring.");
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                      );
                    }
                  }}
                  className={`w-full p-6 border-2 rounded-xl flex items-center gap-4 transition-all ${
                    formData.locationType === 'gps'
                      ? 'border-primary bg-coral-light dark:bg-coral-action/10 shadow-md'
                      : 'border-border hover:border-primary/50'
                  } ${loading ? 'opacity-70 cursor-wait' : ''}`}
                >
                  <MapPin className={`w-8 h-8 text-primary ${loading ? 'animate-bounce' : ''}`} />
                  <div className="text-left flex-1">
                    <p className="font-bold text-lg">
                      {loading ? '🔍 GPS aniqlanmoqda...' : '📍 GPS orqali aniq nuqtani topish'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {loading ? 'Iltimos kuting, eng aniq koordinatalar olinmoqda...' : 'Tugmani bosing va GPS ruxsatini bering'}
                    </p>
                  </div>
                </button>
                {formData.locationType === 'gps' && (
                  <div className="h-64 w-full rounded-xl overflow-hidden border-2 border-border relative z-0">
                    <MapContainer
                      center={[(formData as any).lat || 41.2995, (formData as any).lng || 69.2401]}
                      zoom={15}
                      className="h-full w-full"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMarker 
                        position={[(formData as any).lat || 41.2995, (formData as any).lng || 69.2401]} 
                        setPosition={(lat, lng) => setFormData(prev => ({ ...prev, lat, lng }))}
                      />
                      <MapRecenter position={[(formData as any).lat || 41.2995, (formData as any).lng || 69.2401]} />
                    </MapContainer>
                    <div className="absolute bottom-2 left-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded text-[10px] z-[1000] text-center border border-border text-primary font-bold">
                      🔒 Joylashuv faqat GPS orqali aniqlandi. Uni o'zgartirib bo'lmaydi.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: AI Smart Tahlili */}
          {step === 3 && (
            <div className="text-center py-4">
              <div className={`w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 ${loading ? 'animate-spin-slow' : ''}`}>
                <Shield className={`w-10 h-10 ${loading ? 'text-primary' : aiResult?.status === 'invalid' ? 'text-red-500' : 'text-emerald-500'}`} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">AI Smart Tahlili</h2>
              
              {loading ? (
                <p className="text-slate-500 mb-8 animate-pulse">Sun'iy intellekt matnni tahlil qilib, tegishli tashkilotni aniqlamoqda...</p>
              ) : aiResult?.status === 'invalid' ? (
                <div className="space-y-4">
                   <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-left">
                      <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                        <AlertTriangle className="w-5 h-5" />
                        AI RAD ETDI
                      </div>
                      <p className="text-sm text-red-700 leading-relaxed">{aiResult.analysis}</p>
                   </div>
                   <button onClick={() => setStep(1)} className="text-primary font-bold hover:underline">
                      ✍️ Shikoyat matnini tahrirlash
                   </button>
                </div>
              ) : (
                <div className="space-y-4 max-w-sm mx-auto">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                    <CheckCircle className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-black opacity-60">Soha aniqlandi</p>
                      <p className="text-sm font-bold capitalize">{aiResult?.category || 'Umumiy'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                    <CheckCircle className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-black opacity-60">Mas'ul organ</p>
                      <p className="text-sm font-bold">{aiResult?.organization}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                    <CheckCircle className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-black opacity-60">Status</p>
                      <p className="text-sm font-bold">SHIKOYAT O'RINLI</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Final Confirmation */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                🚀 Yuborishga tayyormisiz?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">Yuborish tugmasini bosganingizdan so'ng, AI yakuniy tahlilni amalga oshiradi.</p>

              <div className="space-y-4 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
                    📝
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Shikoyat mazmuni</p>
                    <p className="text-sm text-slate-700 line-clamp-3">{formData.description}</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
                    📍
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Joylashuv</p>
                    <p className="text-sm text-slate-700">GPS koordinatalari muhrlangan</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Xavfsizlik protokoli</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Sizning shaxsingiz 100% anonim qoladi. Ma'lumotlar shifrlangan.</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-4 border-2 border-border rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-2 font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                Orqaga
              </button>
            ) : (
              <div /> // Bo'sh joy saqlash uchun
            )}
            
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20"
              >
                Keyingi
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-4 bg-[#1D9E75] text-white rounded-xl hover:bg-[#168a65] transition-all flex items-center justify-center gap-2 font-bold shadow-lg shadow-trust-teal/20 animate-pulse-subtle"
              >
                <CheckCircle className="w-5 h-5" />
                {loading ? 'Yuborilmoqda...' : 'Yuborish'}
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
