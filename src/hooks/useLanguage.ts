import { useState, useCallback } from 'react';
import type { Language, TranslationKey, Translations } from '@/types';
import { en } from '@/lib/i18n/en';
import { fr } from '@/lib/i18n/fr';
import { es } from '@/lib/i18n/es';

const translations: Record<Language, Translations> = {
  en,
  fr,
  es,
};

export function useLanguage(initialLang: Language = 'en') {
  const [language, setLanguageState] = useState<Language>(initialLang);

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || key;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('firewall-simulator-language', lang);
    }
  }, []);

  const availableLanguages = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
  ];

  return {
    language,
    setLanguage,
    t,
    availableLanguages,
  };
}

// Load saved language preference
export function loadSavedLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('firewall-simulator-language') as Language;
  return saved && ['en', 'fr', 'es'].includes(saved) ? saved : 'en';
}
