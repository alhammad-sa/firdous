import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Eye, Target, Heart, CheckCircle, Star, Award, Users } from "lucide-react";

export default function About() {
  const { t, language } = useLanguage();
  const isRTL = language.direction === 'rtl';
  
  // Intersection Observer hooks for animations
  const { ref: heroRef, isIntersecting: heroVisible } = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });
  const { ref: cardsRef, isIntersecting: cardsVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: partnersRef, isIntersecting: partnersVisible } = useIntersectionObserver({ threshold: 0.1 });

  const skills = [
    "البحث القانوني",
    "حوكمة الشركات", 
    "مكافحة غسل الأموال",
    "كشف التزوير والتزييف"
  ];

  const skillsEn = [
    "Legal Research",
    "Corporate Governance",
    "Anti-Money Laundering", 
    "Fraud Detection"
  ];

  const currentSkills = isRTL ? skills : skillsEn;

  const successPartners = [
    { 
      name: isRTL ? "الشرهان للصرافة" : "Sharhan Exchange", 
      logo: "/images/partners/sharhan-exchange.png",
      alt: isRTL ? "شركة الشرهان للصرافة" : "Sharhan Exchange"
    },
    { 
      name: isRTL ? "الحربي للصرافة" : "Harbi Exchange", 
      logo: "/images/partners/harbi-exchange.png",
      alt: isRTL ? "شركة الحربي للصرافة" : "Harbi Exchange"
    },
    { 
      name: isRTL ? "إيلاف لرعاية وتأهيل النزيلات" : "Ilaf Care Center", 
      logo: "/images/partners/ilaf.png",
      alt: isRTL ? "إيلاف لرعاية وتأهيل النزيلات" : "Ilaf Care Center"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-sugar-light to-sugar min-h-screen relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-green/5 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-accent-gold/5 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-secondary-green/5 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-primary-green/10 rounded-full animate-bounce delay-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Lawyer Biography */}
        <div ref={heroRef} className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className={`${isRTL ? 'order-2 lg:order-1' : 'order-2 lg:order-2'} transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-x-0 scale-100' : `opacity-0 ${isRTL ? 'translate-x-10' : '-translate-x-10'} scale-95`}`}>
            <div className="relative">
              <img 
                src="/images/lady-justice-saudi.jpg" 
                alt={isRTL ? "العدالة" : "Lady Justice"}
                className="rounded-xl shadow-2xl w-full h-auto"
                data-testid="lawyer-photo"
              />
            </div>
          </div>
          <div className={`${isRTL ? 'order-1 lg:order-2' : 'order-1 lg:order-1'} transition-all duration-1000 delay-300 ${heroVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${isRTL ? '-translate-x-10' : 'translate-x-10'}`}`}>
            <h2 className={`text-4xl lg:text-5xl font-bold text-primary-green mb-6 whitespace-nowrap transition-all duration-1000 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} data-testid="lawyer-name">
              {t('about.title')}
            </h2>
            <p className={`text-lg text-text-medium leading-relaxed mb-6 transition-all duration-1000 delay-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} data-testid="lawyer-bio">
              {isRTL 
                ? "فردوس سعود الشرهان محامية سعودية من مواليد المنطقة الشرقية الدمام، حاصلة على بكالوريوس القانون من كليات الأصالة بالدمام. بدأت مسيرتها المهنية كمديرة فرع لشركة الشرهان للصرافة من عام 2015 حتى 2021، مما أكسبها خبرة قيمة في المجال المالي والتجاري."
                : "Firdous Saud Al-Sharhan, a Saudi lawyer born in Eastern Province, Dammam, holds a Bachelor's degree in Law from Al-Asalah Colleges in Dammam. She began her professional journey as a branch manager at Al-Sharhan Exchange Company from 2015 to 2021, where she gained invaluable experience in the financial and commercial sectors."
              }
            </p>
            <p className={`text-lg text-text-medium leading-relaxed mb-6 transition-all duration-1000 delay-900 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} data-testid="lawyer-experience">
              {isRTL
                ? "انتقلت بعدها إلى مجال المحاماة، حيث عملت كمحامية متدربة في مكتب المحامي عمرو الرماح ثم أسست شركتها الخاصة للمحاماة."
                : "Following this, she transitioned into the legal field, working as a trainee lawyer under the mentorship of Lawyer Amr Al-Rafei before eventually establishing her own law firm."
              }
            </p>

            {/* Skills */}
            <div className={`mb-8 transition-all duration-1000 delay-1100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <h3 className="text-xl font-bold text-primary-green mb-4" data-testid="skills-title">
                {isRTL ? "التخصصات والمهارات" : "Specializations and Skills"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {currentSkills.map((skill, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center p-3 rounded-lg bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 delay-${index * 100} ${heroVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${isRTL ? 'translate-x-5' : '-translate-x-5'}`}`}
                    data-testid={`skill-${index}`}
                  >
                    <CheckCircle className={`text-accent-gold w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} animate-pulse`} />
                    <span className="text-text-medium font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Company Vision, Mission, Values */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className={`bg-white p-8 shadow-lg text-center ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} data-testid="vision-card">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-green to-secondary-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Eye className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary-green mb-4">{t('about.vision.title')}</h3>
              <p className="text-text-medium leading-relaxed" data-testid="vision-content">
                {t('about.vision.content')}
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-white p-8 shadow-lg text-center transition-all duration-700 delay-200 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} data-testid="mission-card">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-green to-secondary-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Target className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary-green mb-4">{t('about.mission.title')}</h3>
              <p className="text-text-medium leading-relaxed" data-testid="mission-content">
                {t('about.mission.content')}
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-white p-8 shadow-lg text-center transition-all duration-700 delay-400 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} data-testid="values-card">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-green to-secondary-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary-green mb-4">{t('about.values.title')}</h3>
              <div className="text-text-medium space-y-2">
                {t('about.values.items').split(',').map((value: string, index: number) => (
                  <div key={index} className={`transition-all duration-500 delay-${index * 100} ${cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'} font-medium`} data-testid={`value-${index}`}>{value.trim()}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Partners */}
        <Card ref={partnersRef} className={`bg-white p-12 shadow-lg transition-all duration-700 ${partnersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} data-testid="partners-section">
          <CardContent>
            <h3 className={`text-3xl lg:text-4xl font-bold text-primary-green text-center mb-8 transition-all duration-1000 delay-200 ${partnersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              {isRTL ? "شركاء النجاح" : "Success Partners"}
            </h3>
            <div className="flex justify-center items-center space-x-16 space-x-reverse flex-wrap gap-8">
              {successPartners.map((partner, index) => (
                <div 
                  key={index} 
                  className={`text-center transition-all duration-1000 delay-${600 + index * 200} ${partnersVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 rotate-6'}`} 
                  data-testid={`partner-${index}`}
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-sugar to-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-4 p-4">
                    <img 
                      src={partner.logo} 
                      alt={partner.alt}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className="font-semibold text-text-dark max-w-[120px] mx-auto leading-tight">{partner.name}</p>
                  <div className={`w-16 h-0.5 bg-gradient-to-r from-primary-green to-accent-gold mx-auto mt-2 transition-all duration-500 ${partnersVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transitionDelay: `${800 + index * 200}ms` }}></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
