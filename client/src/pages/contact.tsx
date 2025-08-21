import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContactMessage } from "@shared/schema";

export default function Contact() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language.direction === 'rtl';

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: isRTL ? "تم إرسال الرسالة" : "Message Sent",
        description: isRTL ? "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً." : "Your message has been sent successfully. We will contact you soon.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ في الإرسال" : "Sending Error",
        description: isRTL ? "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى." : "An error occurred while sending the message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast({
        title: isRTL ? "خطأ في النموذج" : "Form Error",
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const subjectOptions = [
    { value: "", label: isRTL ? "اختر نوع الاستشارة" : "Choose consultation type" },
    { value: "commercial", label: isRTL ? "قانون تجاري" : "Commercial Law" },
    { value: "civil", label: isRTL ? "قانون مدني" : "Civil Law" },
    { value: "arbitration", label: isRTL ? "تحكيم" : "Arbitration" },
    { value: "contracts", label: isRTL ? "عقود" : "Contracts" },
    { value: "other", label: isRTL ? "أخرى" : "Other" },
  ];

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-green mb-6" data-testid="contact-title">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-text-medium max-w-3xl mx-auto" data-testid="contact-subtitle">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-sugar-light p-8 shadow-sm" data-testid="contact-form-card">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-primary-green mb-6" data-testid="form-title">
                {t('contact.form.title')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-text-dark mb-2">
                      {t('contact.form.name')} *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-text-dark mb-2">
                      {t('contact.form.email')} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                      data-testid="input-email"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-text-dark mb-2">
                      {t('contact.form.phone')} *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-sm font-semibold text-text-dark mb-2">
                      {t('contact.form.subject')}
                    </Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                      <SelectTrigger 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                        data-testid="select-subject"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-semibold text-text-dark mb-2">
                    {t('contact.form.message')} *
                  </Label>
                  <Textarea
                    id="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder={t('contact.form.placeholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent resize-vertical"
                    data-testid="textarea-message"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full bg-accent-gold text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-accent-gold/90 transition-all transform hover:scale-105 shadow-lg"
                  data-testid="submit-button"
                >
                  {contactMutation.isPending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                  ) : (
                    <>
                      <Send className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('contact.form.submit')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-primary-green text-white p-8" data-testid="contact-info-card">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-6" data-testid="contact-info-title">
                  {t('contact.info.title')}
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className={`w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center flex-shrink-0 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{t('contact.info.address')}</h4>
                      <p className="text-gray-200" data-testid="address-text">
                        {isRTL 
                          ? "الدمام، المنطقة الشرقية\nالمملكة العربية السعودية"
                          : "Dammam, Eastern Province\nKingdom of Saudi Arabia"
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className={`w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center flex-shrink-0 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{t('contact.info.phone')}</h4>
                      <p className="text-gray-200" data-testid="phone-text">+966 50 123 4567</p>
                      <p className="text-gray-200">+966 13 123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className={`w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center flex-shrink-0 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{t('contact.info.email')}</h4>
                      <p className="text-gray-200" data-testid="email-text">info@firdouslaw.sa</p>
                      <p className="text-gray-200">consultation@firdouslaw.sa</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className={`w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center flex-shrink-0 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{t('contact.info.hours')}</h4>
                      <p className="text-gray-200" data-testid="hours-text">
                        {isRTL
                          ? "الأحد - الخميس: 9:00 ص - 6:00 م\nالجمعة - السبت: مغلق"
                          : "Sun - Thu: 9:00 AM - 6:00 PM\nFri - Sat: Closed"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="bg-sugar-light p-8 text-center" data-testid="map-card">
              <CardContent className="p-0">
                <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-text-medium">
                    <MapPin className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-medium" data-testid="map-title">
                      {isRTL ? "خريطة الموقع" : "Location Map"}
                    </p>
                    <p className="text-sm" data-testid="map-description">
                      {isRTL ? "سيتم عرض الموقع على الخريطة هنا" : "Location will be displayed on the map here"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
