import { createContext, useContext, useEffect, useState } from "react";
import { Language } from "@/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const languages: Record<string, Language> = {
  ar: { code: 'ar', name: 'العربية', direction: 'rtl' },
  en: { code: 'en', name: 'English', direction: 'ltr' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

import { getTranslation } from "@/lib/i18n";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(languages.ar);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang.code);
    
    // Update HTML attributes
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.direction;
  };

  const t = (key: string): string => {
    return getTranslation(key, language.code);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && languages[savedLang]) {
      setLanguage(languages[savedLang]);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { languages };
