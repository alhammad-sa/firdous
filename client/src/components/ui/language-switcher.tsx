import { useLanguage, languages } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-sugar rounded-full p-1" data-testid="language-switcher">
      {Object.values(languages).map((lang) => (
        <Button
          key={lang.code}
          onClick={() => setLanguage(lang)}
          variant="ghost"
          size="sm"
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            language.code === lang.code
              ? 'bg-primary-green text-white'
              : 'text-primary-green hover:bg-primary-green/10'
          }`}
          data-testid={`lang-button-${lang.code}`}
        >
          {lang.code === 'ar' ? '🇸🇦' : '🇺🇸'}
        </Button>
      ))}
    </div>
  );
}
