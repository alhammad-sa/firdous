export interface Language {
  code: 'ar' | 'en';
  name: string;
  direction: 'rtl' | 'ltr';
}

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  ar: Translation;
  en: Translation;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface KeyFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}
