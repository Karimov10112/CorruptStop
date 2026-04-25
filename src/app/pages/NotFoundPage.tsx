import { Link } from 'react-router';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function NotFoundPage() {
  const { language } = useLanguage();

  const messages = {
    uz: { title: 'Sahifa topilmadi', subtitle: 'Kechirasiz, siz qidirayotgan sahifa mavjud emas.', back: 'Bosh sahifaga qaytish' },
    ru: { title: 'Страница не найдена', subtitle: 'Извините, страница, которую вы ищете, не существует.', back: 'Вернуться на главную' },
    en: { title: 'Page Not Found', subtitle: 'Sorry, the page you are looking for does not exist.', back: 'Back to Home' }
  };

  const msg = messages[language];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-4xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>{msg.title}</h1>
        <p className="text-muted-foreground mb-8">{msg.subtitle}</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          {msg.back}
        </Link>
      </div>
    </div>
  );
}
