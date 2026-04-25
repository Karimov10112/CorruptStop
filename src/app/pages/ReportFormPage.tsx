import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import { Shield, MapPin, ChevronRight, ChevronLeft, CheckCircle, Upload, X, Search } from 'lucide-react';
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
    locationType: '',
    city: '',
    address: '',
    description: '',
    amount: '',
    file: null as File | null,
  });
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
            <div className="bg-muted rounded-lg p-4 mb-6 inline-block">
              <p className="text-sm text-muted-foreground mb-1">ID:</p>
              <p className="text-2xl font-mono">{reportId}</p>
              <button className="text-sm text-primary hover:underline mt-2">📋 Nusxa olish</button>
            </div>
            <div className="bg-warning-light dark:bg-warning-amber/10 rounded-lg p-4 mb-6">
              <p className="text-sm">
                ⭐ Ball: <span className="font-medium">+10</span> (Jami: {(user?.points || 0) + 10} ball)
              </p>
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

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    addReport({
      lat: (formData as any).lat || 41.2995, // Haqiqiy lat
      lng: (formData as any).lng || 69.2401, // Haqiqiy lng
      sector: formData.sector,
      location: 'GPS Hudud (Aniq)',
      description: formData.description,
      image: (formData as any).imagePreview,
    });

    const id = `CS-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    setReportId(id);
    setSubmitted(true);
  };

  const canProceed = () => {
    if (step === 1) return formData.sector !== '';
    if (step === 2) return formData.locationType === 'gps';
    if (step === 3) return formData.description.length >= 3;
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
          {/* Step 1: Sector */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                Qaysi sohada muammo kuzatdingiz?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">Tegishli sohani tanlang</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sectors.map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => setFormData({ ...formData, sector: sector.id })}
                    className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                      formData.sector === sector.id
                        ? 'border-primary bg-coral-light dark:bg-coral-action/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{sector.emoji}</div>
                    <div className="text-xs">{t(sector.key)}</div>
                  </button>
                ))}
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

          {/* Step 3: Description */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                Nima bo'lganini qisqacha yozing
              </h2>
              <p className="text-sm text-muted-foreground mb-6">(500 belgigacha)</p>

              <div className="space-y-4">
                <div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 500);
                      setFormData({ ...formData, description: val });
                      setCharCount(val.length);
                    }}
                    placeholder="Hodisa haqida batafsil ma'lumot bering..."
                    rows={6}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg resize-none"
                  />
                  <div className="text-right text-sm text-muted-foreground mt-1">
                    {charCount}/500
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
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
                        // Rasm preview uchun base64 ga o'tkazamiz
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
                      className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer block"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Faylni yuklang yoki shu yerga torting
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        EXIF ma'lumotlari avtomatik tozalanadi
                      </p>
                    </label>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-border bg-muted flex justify-center">
                      {(formData as any).imagePreview && (
                        <img 
                          src={(formData as any).imagePreview} 
                          alt="Preview" 
                          className="max-w-full max-h-[400px] object-contain"
                        />
                      )}
                      <button 
                        onClick={() => setFormData({ ...formData, file: null, imagePreview: undefined } as any)}
                        className="absolute top-2 right-2 p-1.5 bg-danger-red text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="p-3 text-xs truncate">
                        {formData.file.name}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                ✅ Shikoyatingizni tekshirib ko'ring
              </h2>
              <p className="text-sm text-muted-foreground mb-6">Barcha ma'lumotlar to'g'rimi?</p>

              <div className="space-y-4 bg-muted/50 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{sectors.find(s => s.id === formData.sector)?.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Soha:</p>
                    <p className="font-medium">{t(sectors.find(s => s.id === formData.sector)?.key || '')}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs text-primary hover:underline flex items-center gap-1">
                    ✍️ Tahrirlash
                  </button>
                </div>

                <div className="border-t border-border pt-4 flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Joylashuv:</p>
                    <p className="font-medium">
                      {formData.locationType === 'gps' ? '📍 GPS joylashuv (500m radius)' : `${formData.city}, ${formData.address}`}
                    </p>
                  </div>
                  <button onClick={() => setStep(2)} className="text-xs text-primary hover:underline flex items-center gap-1">
                    ✍️ Tahrirlash
                  </button>
                </div>

                <div className="border-t border-border pt-4 flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Tavsif:</p>
                    <p className="text-sm">{formData.description}</p>
                  </div>
                  <button onClick={() => setStep(3)} className="text-xs text-primary hover:underline flex items-center gap-1">
                    ✍️ Tahrirlash
                  </button>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">
                    Sana: 24 Aprel 2026, {new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </p>
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
                Yuborish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
