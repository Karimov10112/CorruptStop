import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'uz' | 'ru' | 'en';

interface Translations {
  [key: string]: {
    uz: string;
    ru: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  nav_map: { uz: 'Xarita', ru: 'Карта', en: 'Map' },
  nav_stats: { uz: 'Statistika', ru: 'Статистика', en: 'Statistics' },
  nav_api: { uz: 'API', ru: 'API', en: 'API' },
  nav_about: { uz: 'Haqimizda', ru: 'О нас', en: 'About' },
  nav_submit: { uz: 'Shikoyat berish', ru: 'Подать жалобу', en: 'Submit Report' },

  // Hero
  hero_title_1: { uz: 'Korrupsiyani ko\'rdingizmi?', ru: 'Увидели коррупцию?', en: 'Witnessed corruption?' },
  hero_title_2: { uz: 'Biz bilan xavfsiz ulashing.', ru: 'Поделитесь с нами безопасно.', en: 'Share with us safely.' },
  hero_desc: { uz: 'CorruptStop — O\'zbekiston fuqarolari uchun anonimlik kafolatlangan korrupsiyaga qarshi platforma. Sizning ovozingiz muhim.', ru: 'CorruptStop — платформа против коррупции с гарантией анонимности для граждан Узбекистана. Ваш голос важен.', en: 'CorruptStop — an anti-corruption platform with guaranteed anonymity for citizens of Uzbekistan. Your voice matters.' },
  hero_cta_telegram: { uz: 'Telegram bot orqali bildirish', ru: 'Сообщить через Telegram бот', en: 'Report via Telegram bot' },
  hero_cta_map: { uz: 'Xaritani ko\'rish', ru: 'Посмотреть карту', en: 'View map' },
  hero_trust: { uz: '🔒 Anonimlik kafolatlangan', ru: '🔒 Анонимность гарантирована', en: '🔒 Anonymity guaranteed' },
  hero_social_proof: { uz: 'fuqaro ishongan', ru: 'граждан доверяют', en: 'citizens trust' },

  // Stats
  stats_reports: { uz: 'Shikoyat', ru: 'Жалоб', en: 'Reports' },
  stats_sectors: { uz: 'Soha', ru: 'Секторов', en: 'Sectors' },
  stats_regions: { uz: 'Viloyat', ru: 'Регионов', en: 'Regions' },
  stats_anonymity: { uz: 'Anonimlik', ru: 'Анонимность', en: 'Anonymity' },

  // How it works
  how_it_works: { uz: '3 qadam — 2 daqiqa', ru: '3 шага — 2 минуты', en: '3 steps — 2 minutes' },
  step_1: { uz: 'Telegram botni oching', ru: 'Откройте Telegram бот', en: 'Open Telegram bot' },
  step_2: { uz: 'Joylashuv va tavsif', ru: 'Местоположение и описание', en: 'Location and description' },
  step_3: { uz: 'Xaritada paydo bo\'ladi', ru: 'Появляется на карте', en: 'Appears on map' },

  // Sectors
  sector_health: { uz: 'Sog\'liqni saqlash', ru: 'Здравоохранение', en: 'Healthcare' },
  sector_education: { uz: 'Ta\'lim', ru: 'Образование', en: 'Education' },
  sector_construction: { uz: 'Qurilish', ru: 'Строительство', en: 'Construction' },
  sector_procurement: { uz: 'Davlat xaridlari', ru: 'Госзакупки', en: 'Procurement' },
  sector_traffic: { uz: 'Yo\'l harakati', ru: 'ДД', en: 'Traffic' },
  sector_property: { uz: 'Yer/Mulk', ru: 'Земля/Имущество', en: 'Property' },
  sector_justice: { uz: 'Sud', ru: 'Суд', en: 'Justice' },
  sector_tax: { uz: 'Soliq', ru: 'Налоги', en: 'Tax' },
  sector_sport: { uz: 'Sport', ru: 'Спорт', en: 'Sport' },
  sector_utilities: { uz: 'Kommunal xizmat', ru: 'Коммунальные', en: 'Utilities' },
  sector_social: { uz: 'Ijtimoiy yordam', ru: 'Соцпомощь', en: 'Social Aid' },
  sector_labor: { uz: 'Mehnat', ru: 'Труд', en: 'Labor' },
  sector_military: { uz: 'Harbiy/Maxfiy', ru: 'Военные/Секретные', en: 'Military/Secret' },
  sector_other: { uz: 'Boshqa', ru: 'Другое', en: 'Other' },

  // Auth
  auth_title: { uz: 'Xush kelibsiz', ru: 'Добро пожаловать', en: 'Welcome' },
  auth_subtitle: { uz: 'Davom etish uchun tizimga kiring', ru: 'Войдите, чтобы продолжить', en: 'Sign in to continue' },
  auth_myid: { uz: 'MyID orqali kirish', ru: 'Войти через MyID', en: 'Sign in with MyID' },
  auth_oneid: { uz: 'OneID orqali kirish', ru: 'Войти через OneID', en: 'Sign in with OneID' },
  auth_no_email: { uz: 'Xavfsizlik sababli email orqali ro\'yxatdan o\'tish bloklangan', ru: 'По соображениям безопасности регистрация через email заблокирована', en: 'Email registration is blocked for security reasons' },

  // Common
  loading: { uz: 'Yuklanmoqda...', ru: 'Загрузка...', en: 'Loading...' },
  search: { uz: 'Qidirish', ru: 'Поиск', en: 'Search' },
  filter: { uz: 'Filtr', ru: 'Фильтр', en: 'Filter' },
  clear: { uz: 'Tozalash', ru: 'Очистить', en: 'Clear' },
  submit: { uz: 'Yuborish', ru: 'Отправить', en: 'Submit' },
  cancel: { uz: 'Bekor qilish', ru: 'Отменить', en: 'Cancel' },
  close: { uz: 'Yopish', ru: 'Закрыть', en: 'Close' },
  save: { uz: 'Saqlash', ru: 'Сохранить', en: 'Save' },
  edit: { uz: 'Tahrirlash', ru: 'Редактировать', en: 'Edit' },
  delete: { uz: 'O\'chirish', ru: 'Удалить', en: 'Delete' },
  view: { uz: 'Ko\'rish', ru: 'Посмотреть', en: 'View' },
  download: { uz: 'Yuklab olish', ru: 'Скачать', en: 'Download' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('cs-lang');
    return (stored as Language) || 'uz';
  });

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('cs-lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
