import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Shield, Eye, EyeOff, Newspaper, MessageSquare, Settings, LogOut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { NewsManagement } from "@/components/admin/news-management";
import { ContactMessages } from "@/components/admin/contact-messages";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: AdminUser;
}

export default function Admin() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language.direction === 'rtl';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('news-management');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Check if user is already logged in on component mount
  useState(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    if (token && userData) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(userData));
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      setIsLoggedIn(true);
      setCurrentUser(data.user);
      setLoginData({ email: '', password: '', remember: false });
      toast({
        title: isRTL ? "تم تسجيل الدخول بنجاح" : "Login Successful",
        description: isRTL ? "مرحباً بك في لوحة التحكم" : "Welcome to the dashboard",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ في تسجيل الدخول" : "Login Error",
        description: isRTL ? "بيانات الدخول غير صحيحة" : "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: isRTL ? "خطأ في النموذج" : "Form Error",
        description: isRTL ? "يرجى ملء جميع الحقول" : "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ email: loginData.email, password: loginData.password });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveSection('news-management');
    toast({
      title: isRTL ? "تم تسجيل الخروج" : "Logged Out",
      description: isRTL ? "تم تسجيل الخروج بنجاح" : "Successfully logged out",
    });
  };

  const sidebarItems = [
    {
      id: 'news-management',
      icon: Newspaper,
      label: t('admin.dashboard.news'),
      component: NewsManagement
    },
    {
      id: 'contact-messages',
      icon: MessageSquare,
      label: t('admin.dashboard.messages'),
      component: ContactMessages
    },
    {
      id: 'site-settings',
      icon: Settings,
      label: t('admin.dashboard.settings'),
      component: () => (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-primary-green mb-4">
            {isRTL ? "إعدادات الموقع" : "Site Settings"}
          </h2>
          <p className="text-text-medium">
            {isRTL ? "قريباً..." : "Coming soon..."}
          </p>
        </div>
      )
    }
  ];

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-sugar flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl" data-testid="admin-login-card">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary-green">
              {t('admin.login.title')}
            </CardTitle>
            <p className="text-text-medium mt-2">
              {t('admin.login.subtitle')}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6" data-testid="admin-login-form">
              <div>
                <Label htmlFor="admin-email" className="text-sm font-semibold text-text-dark mb-2">
                  {t('admin.login.email')}
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  data-testid="input-admin-email"
                />
              </div>

              <div>
                <Label htmlFor="admin-password" className="text-sm font-semibold text-text-dark mb-2">
                  {t('admin.login.password')}
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                    data-testid="input-admin-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center text-text-medium hover:text-text-dark`}
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="toggle-password-visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="remember-me"
                  checked={loginData.remember}
                  onCheckedChange={(checked) => setLoginData(prev => ({ ...prev, remember: !!checked }))}
                  data-testid="checkbox-remember"
                />
                <Label htmlFor="remember-me" className="text-sm text-text-medium">
                  {t('admin.login.remember')}
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-primary-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-green/90 transition-all"
                data-testid="submit-login"
              >
                {loginMutation.isPending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                ) : (
                  <>
                    <Shield className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('admin.login.submit')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  const ActiveComponent = sidebarItems.find(item => item.id === activeSection)?.component || NewsManagement;

  return (
    <div className="min-h-screen bg-sugar">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-primary-green text-white flex-shrink-0 min-h-screen" data-testid="admin-sidebar">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center">
              <div className={`w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <Shield className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold" data-testid="admin-role">
                  {isRTL ? "المدير" : "Admin"}
                </p>
                <p className="text-sm text-gray-300" data-testid="admin-name">
                  {currentUser?.username || ""}
                </p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  variant="ghost"
                  className={`w-full justify-start px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-accent-gold text-white'
                      : 'text-white hover:bg-white/10'
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <IconComponent className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-white hover:bg-white/10 transition-colors justify-start"
              data-testid="logout-button"
            >
              <LogOut className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('admin.dashboard.logout')}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto" data-testid="admin-main-content">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
