import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import News from "@/pages/news";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const isAdminPage = location === '/admin';

  if (isAdminPage) {
    return (
      <Switch>
        <Route path="/admin" component={Admin} />
      </Switch>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-sugar">
      {location !== '/' && <Navbar />}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/news" component={News} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen">
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
