import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Scale, Handshake, Award, Phone, Gavel } from "lucide-react";

export default function Home() {
  const { t, language } = useLanguage();
  const isRTL = language.direction === 'rtl';

  const keyFeatures = [
    {
      icon: Scale,
      title: t('features.expertise.title'),
      description: t('features.expertise.description')
    },
    {
      icon: Handshake,
      title: t('features.commitment.title'),
      description: t('features.commitment.description')
    },
    {
      icon: Award,
      title: t('features.excellence.title'),
      description: t('features.excellence.description')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen">
        <div className="relative gradient-hero text-white">
          {/* Background overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className={`text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'} lg:w-2/3`}>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block" data-testid="hero-title-1">{t('hero.title1')}</span>
                <span className="block text-accent-gold" data-testid="hero-title-2">{t('hero.title2')}</span>
                <span className="block" data-testid="hero-title-3">{t('hero.title3')}</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-4 text-gray-200 leading-relaxed" data-testid="hero-subtitle">
                {t('hero.subtitle')}
              </p>
              <p className="text-lg mb-8 text-gray-300 leading-relaxed" data-testid="hero-description">
                {t('hero.description')}
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'lg:justify-start' : 'lg:justify-start'} justify-center`}>
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="bg-accent-gold text-white hover:bg-accent-gold/90 transform hover:scale-105 transition-all"
                    data-testid="cta-contact"
                  >
                    <Phone className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('hero.cta1')}
                  </Button>
                </Link>
                <Link href="/services">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary-green transition-all"
                    data-testid="cta-services"
                  >
                    <Gavel className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('hero.cta2')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-green mb-4" data-testid="features-title">
                {t('features.title')}
              </h2>
              <p className="text-xl text-text-medium max-w-3xl mx-auto" data-testid="features-subtitle">
                {t('features.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {keyFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card 
                    key={index} 
                    className="text-center p-8 bg-sugar-light shadow-sm hover:shadow-md transition-all"
                    data-testid={`feature-card-${index}`}
                  >
                    <CardContent className="pt-6">
                      <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-6">
                        <IconComponent className="text-white w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-primary-green mb-4" data-testid={`feature-title-${index}`}>
                        {feature.title}
                      </h3>
                      <p className="text-text-medium leading-relaxed" data-testid={`feature-description-${index}`}>
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
