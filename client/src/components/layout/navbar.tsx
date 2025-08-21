import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/hooks/use-language";
import { Menu, X, Shield } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRTL = language.direction === 'rtl';

  const navItems = [
    { href: "/", label: t('navigation.home') },
    { href: "/about", label: t('navigation.about') },
    { href: "/services", label: t('navigation.services') },
    { href: "/news", label: t('navigation.news') },
    { href: "/contact", label: t('navigation.contact') },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-accent-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" data-testid="logo-link">
              <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl font-inter">FS</span>
              </div>
              <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                <h1 className="text-lg font-bold text-primary-green leading-tight">
                  {isRTL ? 'شركة فردوس سعود الشرهان' : 'Firdous Saud Al-Sharhan'}
                </h1>
                <p className="text-sm text-accent-gold">
                  {isRTL ? 'للمحاماة والاستشارات القانونية' : 'Law and Consulting Co'}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary-green'
                    : 'text-text-medium hover:text-accent-gold'
                }`}
                data-testid={`nav-link-${item.href.replace('/', '') || 'home'}`}
              >
                {item.label}
              </Link>
            ))}
            
            <LanguageSwitcher />

            <Link href="/admin">
              <Button 
                className="bg-accent-gold text-white hover:bg-accent-gold/90" 
                data-testid="admin-button"
              >
                <Shield className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('navigation.admin')}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-primary-green hover:text-accent-gold p-2"
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary-green'
                    : 'text-text-medium hover:text-accent-gold'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`mobile-nav-link-${item.href.replace('/', '') || 'home'}`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <LanguageSwitcher />
              <Link href="/admin">
                <Button 
                  className="bg-accent-gold text-white hover:bg-accent-gold/90" 
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="mobile-admin-button"
                >
                  <Shield className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('navigation.admin')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
