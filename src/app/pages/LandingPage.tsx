import { Link } from 'react-router';
import { Shield, ExternalLink, ChevronRight, CheckCircle, MapPin, TrendingUp, BarChart3, Users, Database } from 'lucide-react';
import { Header } from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

const sectors = [
  { emoji: '🏥', key: 'sector_health' },
  { emoji: '📚', key: 'sector_education' },
  { emoji: '🏗', key: 'sector_construction' },
  { emoji: '🛒', key: 'sector_procurement' },
  { emoji: '🚗', key: 'sector_traffic' },
  { emoji: '🏠', key: 'sector_property' },
  { emoji: '⚖️', key: 'sector_justice' },
  { emoji: '💰', key: 'sector_tax' },
  { emoji: '⚽', key: 'sector_sport' },
  { emoji: '🏘', key: 'sector_utilities' },
  { emoji: '👶', key: 'sector_social' },
  { emoji: '💼', key: 'sector_labor' },
  { emoji: '🔒', key: 'sector_military' },
  { emoji: '📦', key: 'sector_other' },
];

export function LandingPage() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%231D1D1B\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div>
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-trust-light dark:bg-trust-teal/10 text-trust-teal rounded-full mb-6 animate-pulse">
                <Shield className="w-4 h-4" />
                <span className="text-sm">{t('hero_trust')}</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-6xl mb-4 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                Shaffof Byudjet va
              </h1>
              <h1 className="text-5xl lg:text-6xl mb-6 leading-tight text-primary" style={{ fontFamily: 'var(--font-serif)' }}>
                Jamoatchilik Nazorati
              </h1>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                CorruptStop va HokimWatch — davlat loyihalarini nazorat qilish, byudjet o'g'riligini to'xtatish va korrupsiya holatlari haqida anonim xabar berish uchun yagona platforma.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Link
                  to="/hokimwatch"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-md border border-slate-700"
                >
                  🏗 HokimWatch'ga o'tish
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  to={isAuthenticated ? "/report" : "/login"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-md"
                >
                  {language === 'uz' ? 'Saytda shikoyat' : 'Сообщить'}
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <a
                  href="https://t.me/corruptstop_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-md"
                >
                  ✈️ Bot orqali shikoyat
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-warning-amber">★</span>
                  ))}
                </div>
                <span>2,847 {t('hero_social_proof')}</span>
              </div>
            </div>

            {/* Right: Mockup */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Floating Card 1 */}
                <div className="absolute top-0 right-0 w-64 bg-card border border-border rounded-2xl p-4 shadow-lg animate-float">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-trust-light dark:bg-trust-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-trust-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">2 daqiqa oldin</p>
                      <p className="text-sm font-medium mb-1">Shikoyat qabul qilindi</p>
                      <p className="text-xs text-muted-foreground">Toshkent, Yunusobod tumani</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute bottom-20 left-0 w-56 bg-card border border-border rounded-2xl p-4 shadow-lg" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">🏥</span>
                        <span className="text-xs px-2 py-1 bg-coral-light dark:bg-coral-action/10 text-primary rounded">
                          Ta'lim
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Samarqand</p>
                    </div>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-trust-teal rounded-full"></div>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="w-full aspect-[4/3] bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-coral-light via-warm-white to-trust-light dark:from-coral-action/5 dark:via-background dark:to-trust-teal/5 flex items-center justify-center relative">
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 p-8 opacity-20">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="bg-muted-gray rounded-full"></div>
                      ))}
                    </div>
                    <MapPin className="w-16 h-16 text-primary relative z-10 animate-bounce" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BarChart3, value: '2,847', label: t('stats_reports') },
              { icon: Users, value: '14', label: t('stats_sectors') },
              { icon: MapPin, value: '12', label: t('stats_regions') },
              { icon: Shield, value: '100%', label: t('stats_anonymity') },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-3xl mb-1 text-primary" style={{ fontFamily: 'var(--font-serif)' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HokimWatch Showcase Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full mb-6 text-sm">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>YANGI: 7-Qatlamli Himoya Tizimi</span>
              </div>
              <h2 className="text-4xl lg:text-5xl mb-6 font-black text-slate-900 leading-tight">
                HokimWatch: Byudjetni <span className="text-primary">Blockchain</span> Nazoratiga Topshiring
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Biz inson omilini butunlay chetlatdik. Loyihalar holati sun'iy yo'ldosh (Sentinel-2), AI tahlili va blockchain zanjiri orqali o'zaro tasdiqlanadi. Ma'lumotni na hokim, na biz o'zgartira olamiz.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { icon: '🔗', text: 'Blockchain Audit Trail' },
                  { icon: '📡', text: 'Sentinel-2 Satellite View' },
                  { icon: '🔐', text: 'Crypto-Photo Verification' },
                  { icon: '⚖️', text: 'Avtomatik Eskalatsiya' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-bold text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/hokimwatch"
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all transform hover:scale-[1.05] shadow-xl"
              >
                HokimWatch Map'ga O'tish
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative z-10 bg-white p-2 rounded-3xl shadow-2xl border border-slate-200 rotate-3">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                  alt="Satellite View" 
                  className="rounded-2xl w-full grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute top-8 left-8 bg-black/70 backdrop-blur-md text-emerald-400 p-4 rounded-2xl border border-white/20 font-mono text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    SENTINEL-2 ACTIVE
                  </div>
                  <p>COORDINATES: 41.2995, 69.2401</p>
                  <p>STATUS: VERIFIED BY AI</p>
                </div>
              </div>
              {/* Background Glow */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* LandWatch Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full mb-6 text-sm font-bold">
              🌱 YANGI: LandWatch Tizimi
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
              Yerlar <span className="text-emerald-400">Noqonuniy</span> Sotilishiga Chek Qo'yamiz
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              O'zbekistonda eng keng tarqalgan korrupsiya turi — yer savdo-sotiq. Hokimlar bog'larni, bolalar maydonchalari va qo'riqlanadigan hududlarni yashirincha sotmoqda. LandWatch bu jarayonni shaffof qiladi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: '👥',
                title: 'Jamoatchilik Tasdiqi',
                desc: 'Bitta odam aytsa ishonmasliklari mumkin. Mahalliy 100+ aholi "Bu haqiqat!" deb tasdiqlasa, buni yopib bo\'lib bo\'lmaydi.',
                color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
                tag: 'Social Proof Engine'
              },
              {
                icon: '🛰️',
                title: 'AI + Satellite Tahlili',
                desc: 'AI rasmni 2020-yildagi sun\'iy yo\'ldosh surati bilan solishtiradi: "Bu yerda 2023-gacha daraxt bor edi. Hozir beton. Noqonuniy!"',
                color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
                tag: 'Sentinel-2 Powered'
              },
              {
                icon: '📄',
                title: 'Avtomatik Yuridik Hujjat',
                desc: 'Bir tugma bosish bilan Prokuratura va Adliya Vazirligi standartiga mos rasmiy shikoyat PDF tayyorlanadi va yuboriladi.',
                color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
                tag: 'PDF Generator'
              }
            ].map((item, i) => (
              <div key={i} className={`relative p-6 rounded-2xl bg-gradient-to-br ${item.color} border backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}>
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">{item.tag}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/hokimwatch/land"
              className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-400 transition-all transform hover:scale-[1.05] shadow-xl shadow-emerald-500/30"
            >
              🌱 LandWatch Xaritasini Ko'rish
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/report"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all"
            >
              📄 Yer Muammosini Xabar Berish
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              {t('how_it_works')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: '📱', title: t('step_1') },
              { icon: '📍', title: t('step_2') },
              { icon: '✓', title: t('step_3') },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-lg mb-2">{step.title}</h3>
                  {idx < 2 && (
                    <ChevronRight className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-muted-foreground hidden md:block" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12" style={{ fontFamily: 'var(--font-serif)' }}>
            14 ta Soha Kategoriyasi
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-6xl mx-auto">
            {sectors.map((sector, idx) => (
              <Link
                key={idx}
                to={isAuthenticated ? `/report?sector=${sector.key.replace('sector_', '')}` : "/login"}
                className="bg-background hover:bg-muted border border-border rounded-xl p-4 text-center transition-all hover:scale-105 hover:shadow-md group"
              >
                <div className="text-3xl mb-2 transition-transform group-hover:scale-110">{sector.emoji}</div>
                <div className="text-xs font-medium group-hover:text-primary transition-colors">{t(sector.key)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Map Teaser */}
      <section className="relative h-[480px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-coral-light via-warm-white to-trust-light dark:from-coral-action/10 dark:via-background dark:to-trust-teal/10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl px-8 py-6 text-center">
            <div className="text-3xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Bugun O'zbekistonda — <span className="text-primary">47</span> yangi shikoyat
            </div>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all"
            >
              To'liq xaritani ko'rish
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl mb-8 text-center" style={{ fontFamily: 'var(--font-serif)' }}>{t('nav_about')}</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  CorruptStop — bu fuqarolik jamiyati va texnologiyalar birlashmasi. Bizning maqsadimiz — O'zbekistonda korrupsiyaga qarshi kurashda har bir fuqaro o'z hissasini anonim va xavfsiz tarzda qo'shishi uchun qulay platforma yaratishdir.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-trust-teal/10 flex items-center justify-center text-trust-teal">✓</div>
                    <span>100% Anonimlik kafolati</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-trust-teal/10 flex items-center justify-center text-trust-teal">✓</div>
                    <span>Real-vaqtda monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-trust-teal/10 flex items-center justify-center text-trust-teal">✓</div>
                    <span>Ochiq ma'lumotlar</span>
                  </div>
                </div>
              </div>
              <div className="bg-muted rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
                <Shield className="w-32 h-32 text-primary opacity-20 absolute" />
                <div className="relative z-10 text-center">
                  <div className="text-6xl mb-4">🇺🇿</div>
                  <h3 className="text-2xl font-bold mb-2">Vatanimiz uchun</h3>
                  <p className="text-sm text-muted-foreground">Shaffof kelajakni birgalikda quramiz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section id="api" className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Dasturchilar uchun
            </div>
            <h2 className="text-4xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Ochiq API Tizimi</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Biz korrupsiyaga oid anonimlashtirilgan ma'lumotlarni ochiq holda taqdim etamiz. Jurnalistlar va tadqiqotchilar bizning API orqali real-vaqtda ma'lumot olishlari mumkin.
            </p>
            <div className="bg-deep-charcoal text-white rounded-2xl p-6 text-left font-mono text-sm overflow-x-auto shadow-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="ml-2 text-white/50">bash — curl</span>
              </div>
              <p className="text-trust-teal"># Barcha ochiq shikoyatlarni olish</p>
              <p><span className="text-primary">curl</span> -X GET https://api.corruptstop.uz/v1/reports</p>
              <p className="mt-4 text-trust-teal"># Javob (JSON)</p>
              <pre className="text-white/80">
{`{
  "status": "success",
  "data": [
    {
      "id": "CS-2026-4847",
      "sector": "health",
      "lat": 41.2995,
      "lng": 69.2401,
      "status": "verified"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <span className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>CorruptStop</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('hero_trust')}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Platforma</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/map" className="text-muted-foreground hover:text-primary">{t('nav_map')}</Link></li>
                <li><Link to="/stats" className="text-muted-foreground hover:text-primary">{t('nav_stats')}</Link></li>
                <li><a href="#api" className="text-muted-foreground hover:text-primary">{t('nav_api')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Resurslar</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Qo'llanma</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Maxfiylik</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Bog'lanish</h4>
              <a
                href="https://t.me/corruptstop_bot"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="w-4 h-4" />
                Telegram Bot
              </a>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>CorruptStop — Aksilkorrupsiya Xakatoni 2026 | Sarbon Universiteti</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
