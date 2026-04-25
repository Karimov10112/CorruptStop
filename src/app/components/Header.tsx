import { Link, useLocation } from 'react-router';
import { Shield, Moon, Sun, Globe, ArrowRight, CheckCircle, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-999 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Shield className="w-8 h-8 text-primary" />
          <span className="text-xl hidden sm:inline" style={{ fontFamily: 'var(--font-serif)' }}>
            CorruptStop
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/map"
            className={`text-sm hover:text-primary transition-colors ${isActive('/map') ? 'text-primary font-medium' : 'text-foreground'
              }`}
          >
            {t('nav_map')}
          </Link>
          <Link
            to="/stats"
            className={`text-sm hover:text-primary transition-colors ${isActive('/stats') ? 'text-primary font-medium' : 'text-foreground'
              }`}
          >
            {t('nav_stats')}
          </Link>
          <a
            href="#api"
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            {t('nav_api')}
          </a>
          <a
            href="#about"
            className="text-sm text-foreground hover:text-primary transition-colors"
          >
            {t('nav_about')}
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative group">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span className="text-xs uppercase">{language}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {(['uz', 'ru', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${language === lang ? 'text-primary font-medium' : 'text-foreground'
                    }`}
                >
                  {lang === 'uz' ? "O'zbek" : lang === 'ru' ? 'Русский' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          {/* Auth / Report Button */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition-all shadow-sm">
                <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span>{user?.name.split(' ')[0]} ({user?.points} ball)</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <div className="p-3 border-b border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">{language === 'uz' ? 'Telefon' : 'Телефон'}</p>
                  <p className="text-sm font-mono font-bold">{user?.phone}</p>
                </div>
                <Link
                  to="/report"
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-trust-teal" />
                  {t('nav_submit')}
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition-colors"
                  >
                    <Shield className="w-4 h-4 text-primary" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm hover:bg-danger-red/10 text-danger-red transition-colors border-t border-border"
                >
                  <X className="w-4 h-4" />
                  {language === 'uz' ? 'Chiqish' : language === 'ru' ? 'Выйти' : 'Logout'}
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-sm flex items-center gap-2"
            >
              <span>{t('nav_submit')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
