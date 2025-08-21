import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { MapPin, Phone, Mail, Clock, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const { t, language } = useLanguage();
  const isRTL = language.direction === 'rtl';

  const navigationLinks = [
    { href: "/", label: t('navigation.home') },
    { href: "/about", label: t('navigation.about') },
    { href: "/services", label: t('navigation.services') },
    { href: "/news", label: t('navigation.news') },
    { href: "/contact", label: t('navigation.contact') },
  ];

  return (
    <footer className="bg-primary-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className={`w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <span className="text-white font-bold text-lg">FS</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {isRTL ? 'شركة فردوس سعود الشرهان' : 'Firdous Saud Al-Sharhan'}
                </h3>
                <p className="text-gray-300">
                  {isRTL ? 'للمحاماة والاستشارات القانونية' : 'Law and Consulting Company'}
                </p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a 
                href="#" 
                className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center hover:bg-accent-gold/80 transition-colors"
                data-testid="social-twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center hover:bg-accent-gold/80 transition-colors"
                data-testid="social-linkedin"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center hover:bg-accent-gold/80 transition-colors"
                data-testid="social-instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors"
                    data-testid={`footer-link-${link.href.replace('/', '') || 'home'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer.contactInfo')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className={`text-accent-gold mt-1 flex-shrink-0 w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="text-gray-300">
                  {isRTL ? 'الدمام، المنطقة الشرقية\nالمملكة العربية السعودية' : 'Dammam, Eastern Province\nKingdom of Saudi Arabia'}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className={`text-accent-gold flex-shrink-0 w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="text-gray-300">+966 50 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail className={`text-accent-gold flex-shrink-0 w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="text-gray-300">info@firdouslaw.sa</span>
              </li>
              <li className="flex items-center">
                <Clock className={`text-accent-gold flex-shrink-0 w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="text-gray-300">
                  {isRTL ? 'الأحد - الخميس: 9:00 ص - 6:00 م' : 'Sun - Thu: 9:00 AM - 6:00 PM'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 border-opacity-50 pt-8 mt-8 text-center">
          <p className="text-gray-300">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
