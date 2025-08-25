import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Gavel, FileText, Building, Coins, Calculator, Users, Phone, ArrowLeft, ArrowRight } from "lucide-react";

export default function Services() {
  const { t, language } = useLanguage();
  const isRTL = language.direction === 'rtl';

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
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary-green mb-6" data-testid="services-title">
            {t('services.title')}
          </h1>
          <p className="text-xl text-text-medium max-w-3xl mx-auto" data-testid="services-subtitle">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index} 
                className="p-8 bg-sugar-light shadow-sm hover:shadow-lg transition-all border-r-4 border-accent-gold"
                data-testid={`service-card-${index}`}
              >
                <CardContent className="p-0">
                  <div className="w-14 h-14 bg-primary-green rounded-lg flex items-center justify-center mb-6">
                    <IconComponent className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-green mb-4" data-testid={`service-title-${index}`}>
                    {service.title}
                  </h3>
                  <p className="text-text-medium leading-relaxed" data-testid={`service-description-${index}`}>
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-primary-green text-white p-12" data-testid="cta-section">
            <CardContent>
              <h3 className="text-3xl font-bold mb-4" data-testid="cta-title">
                {t('services.cta.title')}
              </h3>
              <p className="text-xl mb-8 text-gray-200" data-testid="cta-subtitle">
                {t('services.cta.subtitle')}
              </p>
              <Link href="/contact">
                <Button 
                  size="lg"
                  className="bg-accent-gold text-white hover:bg-accent-gold/90 transform hover:scale-105 transition-all"
                  data-testid="cta-button"
                >
                  <Phone className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
