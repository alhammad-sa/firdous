import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Eye, Target, Heart, CheckCircle } from "lucide-react";

export default function About() {
  const { t, language } = useLanguage();
  const isRTL = language.direction === 'rtl';

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
      name: isRTL ? "إيلاف لرعاية وتأهيل اليتيمات" : "Ilaf Care Center", 
      logo: "/images/partners/ilaf.png",
      alt: isRTL ? "إيلاف لرعاية وتأهيل اليتيمات" : "Ilaf Care Center"
    }
  ];

  return (
    <div className="py-20 bg-sugar-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Lawyer Biography */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className={`${isRTL ? 'order-2 lg:order-1' : 'order-2 lg:order-2'}`}>
            <img 
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt={t('about.title')}
              className="rounded-xl shadow-xl w-full h-auto"
              data-testid="lawyer-photo"
            />
          </div>
          <div className={`${isRTL ? 'order-1 lg:order-2' : 'order-1 lg:order-1'}`}>
            <h2 className="text-4xl font-bold text-primary-green mb-6" data-testid="lawyer-name">
              {t('about.title')}
            </h2>
            <p className="text-lg text-text-medium leading-relaxed mb-6" data-testid="lawyer-bio">
              {isRTL 
                ? "فردوس سعود الشرهان محامية سعودية من مواليد المنطقة الشرقية الدمام، حاصلة على بكالوريوس القانون من كليات الأصالة بالدمام. بدأت مسيرتها المهنية كمديرة فرع لشركة الشرهان للصرافة من عام 2015 حتى 2021، مما أكسبها خبرة قيمة في المجال المالي والتجاري."
                : "Firdous Saud Al-Sharhan, a Saudi lawyer born in Eastern Province, Dammam, holds a Bachelor's degree in Law from Al-Asalah Colleges in Dammam. She began her professional journey as a branch manager at Al-Sharhan Exchange Company from 2015 to 2021, where she gained invaluable experience in the financial and commercial sectors."
              }
            </p>
            <p className="text-lg text-text-medium leading-relaxed mb-6" data-testid="lawyer-experience">
              {isRTL
                ? "انتقلت بعدها إلى مجال المحاماة، حيث عملت كمحامية متدربة في مكتب المحامي عمرو الرماح ثم أسست شركتها الخاصة للمحاماة."
                : "Following this, she transitioned into the legal field, working as a trainee lawyer under the mentorship of Lawyer Amr Al-Rafei before eventually establishing her own law firm."
              }
            </p>

            {/* Skills */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-primary-green mb-4" data-testid="skills-title">
                {isRTL ? "التخصصات والمهارات" : "Specializations and Skills"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {currentSkills.map((skill, index) => (
                  <div key={index} className="flex items-center" data-testid={`skill-${index}`}>
                    <CheckCircle className={`text-accent-gold w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span className="text-text-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Company Vision, Mission, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white p-8 shadow-lg text-center" data-testid="vision-card">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary-green mb-4">{t('about.vision.title')}</h3>
              <p className="text-text-medium leading-relaxed" data-testid="vision-content">
                {t('about.vision.content')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white p-8 shadow-lg text-center" data-testid="mission-card">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-accent-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary-green mb-4">{t('about.mission.title')}</h3>
              <p className="text-text-medium leading-relaxed" data-testid="mission-content">
                {t('about.mission.content')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white p-8 shadow-lg text-center" data-testid="values-card">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary-green mb-4">{t('about.values.title')}</h3>
              <div className="text-text-medium space-y-2">
                {t('about.values.items').split(',').map((value: string, index: number) => (
                  <div key={index} data-testid={`value-${index}`}>{value.trim()}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Partners */}
        <Card className="bg-white p-12 shadow-lg" data-testid="partners-section">
          <CardContent>
            <h3 className="text-3xl font-bold text-primary-green text-center mb-8">
              {isRTL ? "شركاء النجاح" : "Success Partners"}
            </h3>
            <div className="flex justify-center items-center space-x-16 space-x-reverse flex-wrap gap-8">
              {successPartners.map((partner, index) => (
                <div key={index} className="text-center" data-testid={`partner-${index}`}>
                  <div className="w-32 h-32 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-4 p-4">
                    <img 
                      src={partner.logo} 
                      alt={partner.alt}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className="font-semibold text-text-dark max-w-[120px] mx-auto leading-tight">{partner.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
