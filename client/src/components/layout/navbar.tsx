import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/hooks/use-language";
import { Menu, X, Shield } from "lucide-react";
import logoImage from "/images/logo.png";

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
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" data-testid="logo-link">
              <img 
                src={logoImage} 
                alt={isRTL ? 'شعار شركة فردوس سعود الشرهان' : 'Firdous Saud Al-Sharhan Logo'}
                className="w-12 h-12 object-contain"
              />
              <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                <h1 className="text-base font-semibold text-gray-900 leading-tight">
                  {isRTL ? 'شركة فردوس سعود الشرهان' : 'Firdous Saud Al-Sharhan'}
                </h1>
                <p className="text-xs text-gray-600">
                  {isRTL ? 'للمحاماة والاستشارات القانونية' : 'Law and Consulting Co'}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-testid={`nav-link-${item.href.replace('/', '') || 'home'}`}
              >
                {item.label}
              </Link>
            ))}
            
            <LanguageSwitcher />

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-gray-900 bg-gray-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`mobile-nav-link-${item.href.replace('/', '') || 'home'}`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center justify-center pt-3 border-t border-gray-100">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
