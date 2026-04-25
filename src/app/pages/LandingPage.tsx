import { Link } from 'react-router';
import { Shield, ExternalLink, ChevronRight, CheckCircle, MapPin, TrendingUp, BarChart3, Users } from 'lucide-react';
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
                {t('hero_title_1')}
              </h1>
              <h1 className="text-5xl lg:text-6xl mb-6 leading-tight text-primary" style={{ fontFamily: 'var(--font-serif)' }}>
                {t('hero_title_2')}
              </h1>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                {t('hero_desc')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Link
                  to="/telegram"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#229ED9] text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-md"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.35-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.24.36-.49.99-.74 3.88-1.69 6.47-2.8 7.77-3.32 3.7-1.47 4.47-1.73 4.97-1.74.11 0 .35.03.5.16.13.1.17.24.18.33.02.1.03.28.02.43z"/></svg>
                  {t('hero_cta_telegram')}
                </Link>
                <Link
                  to={isAuthenticated ? "/report" : "/login"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-md"
                >
                  {language === 'uz' ? 'Veb-sayt orqali bildirish' : 'Сообщить через сайт'}
                  <ChevronRight className="w-5 h-5" />
                </Link>
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
