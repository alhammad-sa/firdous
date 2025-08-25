import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Scale, Handshake, Award, Phone, Gavel, Users, Shield, BookOpen, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { NewsArticle } from "@shared/schema";

function LatestUpdatesSection() {
  const { t, language } = useLanguage();
  const isRTL = language.direction === 'rtl';

  const { data: articles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
  });

  // Filter to get published articles and limit to 3
  const latestArticles = articles
    .filter(article => article.published)
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
    .slice(0, 3);

  const getArticleTitle = (article: NewsArticle) => {
    return isRTL ? article.title : (article.titleEn || article.title);
  };

  const getArticleExcerpt = (article: NewsArticle) => {
    return isRTL ? article.excerpt : (article.excerptEn || article.excerpt);
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return isRTL 
      ? d.toLocaleDateString('ar-SA') 
      : d.toLocaleDateString('en-US');
  };

  if (isLoading) return null;

  return (
    <div className="bg-gradient-to-br from-sugar to-sugar-light py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-green mb-6">
            {isRTL 
              ? 'اقرأ آخر التحديثات حول قوانين وأنظمة المملكة' 
              : 'Read Our Latest Updates on the Kingdom\'s Laws & Regulations'}
          </h2>
          <p className="text-xl text-text-medium max-w-4xl mx-auto leading-relaxed">
            {isRTL 
              ? 'ابق على اطلاع بآخر التطورات القانونية والتشريعية في المملكة العربية السعودية'
              : 'Stay informed with the latest legal and regulatory developments in the Kingdom of Saudi Arabia'}
          </p>
        </div>
        
        {latestArticles.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {latestArticles.map((article, index) => (
              <Card 
                key={article.id} 
                className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {article.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={article.imageUrl} 
                      alt={getArticleTitle(article)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-secondary-green text-white px-3 py-1 rounded-full text-sm font-medium">
                      {isRTL ? article.category : (article.categoryEn || article.category)}
                    </span>
                    <span className={`text-text-medium text-sm ${isRTL ? 'mr-3' : 'ml-3'}`}>
                      {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary-green mb-4 leading-tight group-hover:text-secondary-green transition-colors">
                    {getArticleTitle(article)}
                  </h3>
                  <p className="text-text-medium leading-relaxed mb-6">
                    {getArticleExcerpt(article)}
                  </p>
                  <Link href={`/news`}>
                    <Button variant="ghost" className="text-secondary-green hover:text-primary-green p-0 h-auto font-semibold">
                      {isRTL ? 'اقرأ المزيد' : 'Read More'}
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-text-medium">
              {isRTL ? 'لا توجد مقالات متاحة حالياً' : 'No articles available at the moment'}
            </p>
          </div>
        )}
        
        <div className="text-center">
          <Link href="/news">
            <Button 
              size="lg" 
              className="bg-secondary-green text-white hover:bg-primary-green px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
            >
              {isRTL ? 'عرض جميع الأخبار' : 'View All News'}
              <ArrowRight className={`w-6 h-6 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'}`} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

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
      <section className="relative min-h-screen -mt-20 pt-20">
        <div className="relative gradient-hero text-white min-h-screen">
          {/* Background overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-24">
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
                    size="lg"
                    className="bg-white text-primary-green border-2 border-white hover:bg-primary-green hover:text-white font-semibold shadow-lg transform hover:scale-105 transition-all"
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
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary-green mb-6" data-testid="features-title">
                {t('features.title')}
              </h2>
              <p className="text-xl text-text-medium max-w-4xl mx-auto leading-relaxed" data-testid="features-subtitle">
                {t('features.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {keyFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card 
                    key={index} 
                    className="group text-center p-10 bg-gradient-to-br from-sugar-light to-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    data-testid={`feature-card-${index}`}
                  >
                    <CardContent className="pt-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-green to-secondary-green rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="text-white w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold text-primary-green mb-6" data-testid={`feature-title-${index}`}>
                        {feature.title}
                      </h3>
                      <p className="text-text-medium leading-relaxed text-lg" data-testid={`feature-description-${index}`}>
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Latest Updates Section */}
        <LatestUpdatesSection />

        {/* About Section */}
        <div className="bg-secondary-green py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className={isRTL ? 'lg:order-2' : ''}>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
                  {isRTL ? 'رؤيتنا' : 'Our Vision'}
                </h2>
                <p className="text-xl text-gray-200 leading-relaxed mb-8">
                  {isRTL 
                    ? 'نسعى لتكون الخيار الأول للشركات والأفراد في المملكة العربية السعودية للحصول على الخدمات القانونية المتميزة والاستشارات المهنية.'
                    : 'We strive to be the first choice for companies and individuals in the Kingdom of Saudi Arabia for obtaining distinguished legal services and professional consultations.'}
                </p>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-gold mb-2">500+</div>
                    <div className="text-gray-300">{isRTL ? 'عميل راضي' : 'Satisfied Clients'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-gold mb-2">15+</div>
                    <div className="text-gray-300">{isRTL ? 'سنة خبرة' : 'Years Experience'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-gold mb-2">95%</div>
                    <div className="text-gray-300">{isRTL ? 'معدل النجاح' : 'Success Rate'}</div>
                  </div>
                </div>
              </div>
              <div className={`relative ${isRTL ? 'lg:order-1' : ''}`}>
                <div className="aspect-video bg-gradient-to-br from-accent-gold to-primary-green rounded-2xl shadow-2xl flex items-center justify-center">
                  <Users className="w-32 h-32 text-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-primary-green to-secondary-green py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              {isRTL ? 'هل تحتاج إلى استشارة قانونية؟' : 'Need Legal Consultation?'}
            </h2>
            <p className="text-xl text-gray-200 mb-12 leading-relaxed">
              {isRTL 
                ? 'تواصل معنا اليوم للحصول على استشارة قانونية مجانية من خبرائنا المتخصصين'
                : 'Contact us today for a free legal consultation from our specialized experts'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-accent-gold text-white hover:bg-accent-gold/90 px-8 py-4 text-lg font-semibold shadow-lg">
                  <Phone className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  {isRTL ? 'تواصل معنا' : 'Contact Us'}
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-green px-8 py-4 text-lg font-semibold">
                  <BookOpen className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  {isRTL ? 'خدماتنا' : 'Our Services'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
