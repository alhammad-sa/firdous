import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Gavel, FileText, Building, Coins, Calculator, Users, Phone, ArrowLeft, ArrowRight, Star, Shield, Award } from "lucide-react";

export default function Services() {
  const { t, language } = useLanguage();
  const isRTL = language.direction === 'rtl';
  
  const { ref: headerRef, isIntersecting: headerVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: servicesRef, isIntersecting: servicesVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: ctaRef, isIntersecting: ctaVisible } = useIntersectionObserver({ threshold: 0.1 });

  const services = [
    {
      icon: Gavel,
      title: isRTL ? "التحكيم التجاري وحل النزاعات" : "Commercial Arbitration and Dispute Resolution",
      description: isRTL 
        ? "خدمات التحكيم والوساطة لحل النزاعات التجارية والمدنية بطرق فعالة وسريعة"
        : "Arbitration and mediation services to resolve commercial and civil disputes effectively and quickly"
    },
    {
      icon: FileText,
      title: isRTL ? "صياغة ومراجعة العقود" : "Contract Drafting and Review",
      description: isRTL
        ? "إعداد ومراجعة جميع أنواع العقود والاتفاقيات القانونية بدقة واحترافية عالية"
        : "Preparation and review of all types of contracts and legal agreements with high precision and professionalism"
    },
    {
      icon: Building,
      title: isRTL ? "خدمة الشركات وأسواق المال" : "Corporate and Capital Markets Services",
      description: isRTL
        ? "استشارات قانونية متخصصة للشركات في مجال الاستثمار والأسواق المالية"
        : "Specialized legal consultations for companies in investment and financial markets"
    },
    {
      icon: Coins,
      title: isRTL ? "تحصيل الديون" : "Debt Collection",
      description: isRTL
        ? "خدمات احترافية لتحصيل الديون والمستحقات المالية بالطرق القانونية المناسبة"
        : "Professional services for collecting debts and financial obligations through appropriate legal methods"
    },
    {
      icon: Calculator,
      title: isRTL ? "الضرائب والجمارك" : "Tax and Customs",
      description: isRTL
        ? "حلول قانونية متخصصة في مجال الضرائب والجمارك والامتثال الضريبي"
        : "Specialized legal solutions in taxation, customs, and tax compliance"
    },
    {
      icon: Users,
      title: isRTL ? "الاستشارات القانونية المتخصصة" : "Specialized Legal Consultations",
      description: isRTL
        ? "استشارات قانونية شاملة في مختلف مجالات القانون المدني والتجاري والإداري"
        : "Comprehensive legal consultations in various fields of civil, commercial, and administrative law"
    }
  ];

  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="py-20 bg-gradient-to-br from-white via-sugar/30 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div ref={headerRef} className={`text-center mb-20 transition-all duration-1000 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-green/10 via-accent-gold/10 to-primary-green/10 rounded-full blur-3xl transform scale-150"></div>
            <h1 className="relative text-5xl lg:text-6xl font-bold text-primary-green mb-8 leading-tight" data-testid="services-title">
              {t('services.title')}
            </h1>
          </div>
          <p className="text-xl lg:text-2xl text-text-medium max-w-4xl mx-auto leading-relaxed font-light" data-testid="services-subtitle">
            {t('services.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-green to-accent-gold mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div ref={servicesRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const delay = index * 200;
            return (
              <Card 
                key={index} 
                className={`relative p-10 bg-white shadow-xl border-0 rounded-2xl overflow-hidden transition-all duration-1000 delay-${delay} transform ${
                  servicesVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
                }`}
                style={{ transitionDelay: `${delay}ms` }}
                data-testid={`service-card-${index}`}
              >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-green/5 to-accent-gold/5 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent-gold/10 to-primary-green/10 rounded-full transform -translate-x-8 translate-y-8"></div>
                
                <CardContent className="p-0 relative z-10">
                  {/* Icon Container */}
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-green via-primary-green to-secondary-green rounded-2xl flex items-center justify-center mb-8 shadow-lg relative">
                    <IconComponent className="text-white w-10 h-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-primary-green mb-6 leading-tight" data-testid={`service-title-${index}`}>
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-text-medium leading-relaxed text-lg font-light" data-testid={`service-description-${index}`}>
                    {service.description}
                  </p>
                  
                  {/* Quality Indicator */}
                  <div className="flex items-center mt-6 pt-6 border-t border-gray-100">
                    <Star className="w-5 h-5 text-accent-gold fill-current" />
                    <span className="text-sm text-text-medium font-medium ml-2">
                      {isRTL ? 'خدمة متخصصة' : 'Professional Service'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action Section */}
        <div ref={ctaRef} className={`text-center transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Card className="relative bg-gradient-to-br from-primary-green via-primary-green to-secondary-green text-white p-16 rounded-3xl shadow-2xl overflow-hidden" data-testid="cta-section">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full transform -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/3 rounded-full transform translate-x-30 translate-y-30"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-accent-gold/10 rounded-full transform"></div>
            
            <CardContent className="relative z-10">
              {/* Premium Badge */}
              <div className="inline-flex items-center bg-accent-gold/20 border border-accent-gold/30 rounded-full px-6 py-2 mb-8">
                <Award className="w-5 h-5 text-accent-gold mr-2" />
                <span className="text-accent-gold font-semibold">
                  {isRTL ? 'استشارة قانونية مميزة' : 'Premium Legal Consultation'}
                </span>
              </div>
              
              <h3 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight" data-testid="cta-title">
                {t('services.cta.title')}
              </h3>
              
              <p className="text-xl lg:text-2xl mb-12 text-gray-100 max-w-3xl mx-auto leading-relaxed font-light" data-testid="cta-subtitle">
                {t('services.cta.subtitle')}
              </p>
              
              {/* Benefits Row */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent-gold mr-3" />
                  <span className="text-gray-100 font-medium">
                    {isRTL ? 'سرية تامة' : 'Complete Confidentiality'}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent-gold mr-3" />
                  <span className="text-gray-100 font-medium">
                    {isRTL ? 'خبرة متخصصة' : 'Expert Experience'}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <Award className="w-6 h-6 text-accent-gold mr-3" />
                  <span className="text-gray-100 font-medium">
                    {isRTL ? 'حلول مبتكرة' : 'Innovative Solutions'}
                  </span>
                </div>
              </div>
              
              <Link href="/contact">
                <Button 
                  size="lg"
                  className="bg-accent-gold text-white hover:bg-accent-gold/90 text-lg px-12 py-6 rounded-full font-semibold shadow-lg transform transition-all duration-300"
                  data-testid="cta-button"
                >
                  <Phone className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  {t('services.cta.button')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
