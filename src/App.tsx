import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";

import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import UIUXDesign from "./pages/services/UIUXDesign";
import WebDevelopment from "./pages/services/WebDevelopment";
import SoftwareDevelopment from "./pages/services/SoftwareDevelopment";
import SoftwareConsultancy from "./pages/services/SoftwareConsultancy";
import MobileDevelopment from "./pages/services/MobileDevelopment";
import Ecommerce from "./pages/services/Ecommerce";
import QualityAssurance from "./pages/services/QualityAssurance";

// SEO Configuration
const seoConfig = {
  home: {
    title: "Hawi Software Solutions - Leading Software Development in Ethiopia",
    description: "Hawi Software Solutions (HSS) is an emerging software firm in Adama, Ethiopia. We provide quality software solutions, web development, mobile apps, and custom software development services.",
    keywords: "software development, web development, mobile apps, Ethiopia, Adama, Hawi Software, custom software, IT solutions",
    ogImage: "https://www.hawisoftware.com/wp-content/uploads/elementor/thumbs/cropped-logohawi-2-pcfbk6ai9qzrfkcdr3jdhf52biqlr9k6bd27gv33s8.png"
  },
  about: {
    title: "About Us - Hawi Software Solutions | Who We Are",
    description: "Learn about Hawi Software Solutions, our mission, vision, and values. We are a leading software development company in Adama, Ethiopia committed to innovation and excellence.",
    keywords: "about Hawi Software, software company Ethiopia, mission vision values, IT company Adama",
    ogImage: "https://www.hawisoftware.com/wp-content/uploads/elementor/thumbs/cropped-logohawi-2-pcfbk6ai9qzrfkcdr3jdhf52biqlr9k6bd27gv33s8.png"
  },
  contact: {
    title: "Contact Us - Hawi Software Solutions | Get in Touch",
    description: "Contact Hawi Software Solutions for your software development needs. Located in Adama, Ethiopia. Call +251 900276031 or email info@hawisoftware.com",
    keywords: "contact Hawi Software, software development contact, Ethiopia IT services, Adama software company",
    ogImage: "https://www.hawisoftware.com/wp-content/uploads/elementor/thumbs/cropped-logohawi-2-pcfbk6ai9qzrfkcdr3jdhf52biqlr9k6bd27gv33s8.png"
  },
  services: {
    title: "Our Services - Hawi Software Solutions | Software Development Services",
    description: "Explore our comprehensive software development services including web development, mobile apps, UI/UX design, custom software solutions, and more.",
    keywords: "software development services, web development, mobile apps, UI/UX design, custom software, IT services",
    ogImage: "https://www.hawisoftware.com/wp-content/uploads/elementor/thumbs/cropped-logohawi-2-pcfbk6ai9qzrfkcdr3jdhf52biqlr9k6bd27gv33s8.png"
  }
};

// SEO Component
const SEO = ({ page }: { page: keyof typeof seoConfig }) => {
  const config = seoConfig[page];
  
  return (
    <HelmetProvider>
      <title>{config.title}</title>
      <meta name="description" content={config.description} />
      <meta name="keywords" content={config.keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://hawisoftware.com/" />
      <meta property="og:title" content={config.title} />
      <meta property="og:description" content={config.description} />
      <meta property="og:image" content={config.ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://hawisoftware.com/" />
      <meta property="twitter:title" content={config.title} />
      <meta property="twitter:description" content={config.description} />
      <meta property="twitter:image" content={config.ogImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hawi Software Solutions" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href="https://hawisoftware.com/" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Hawi Software Solutions",
          "description": config.description,
          "url": "https://hawisoftware.com/",
          "logo": config.ogImage,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Adama",
            "addressCountry": "Ethiopia"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+251-900276031",
            "contactType": "customer service",
            "email": "info@hawisoftware.com"
          }
        })}
      </script>
    </HelmetProvider>
  );
};

export const UserContext = createContext<{
  user: { id?: string; name?: string; email: string; role: string; profilePic?: string; phone?: string; company?: string } | null;
  setUser: (user: { id?: string; name?: string; email: string; role: string; profilePic?: string; phone?: string; company?: string } | null) => void;
}>({
  user: null,
  setUser: () => {},
});

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState<{ id?: string; name?: string; email: string; role: string; profilePic?: string; phone?: string; company?: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<keyof typeof seoConfig>('home');

  // Update current page for SEO
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') setCurrentPage('home');
    else if (path === '/about') setCurrentPage('about');
    else if (path === '/contact') setCurrentPage('contact');
    else if (path.startsWith('/services')) setCurrentPage('services');
  }, []);

  // Hydrate user from localStorage and/or backend profile if token exists
  useEffect(() => {
    try {
      const stored = localStorage.getItem('authUser');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
    // If authenticated, try to fetch profile for freshest user data
    import("@/lib/api").then(({ auth }) => {
      if (auth.isAuthenticated()) {
        import("@/lib/services").then(({ userService }) => {
          userService.getProfile().then(res => {
            if (res.success && res.data) {
              const profile = Array.isArray(res.data) ? res.data[0] : res.data;
              setUser((prev) => {
                const merged = { ...(prev || {}), ...profile } as any;
                try { localStorage.setItem('authUser', JSON.stringify(merged)); } catch {}
                return merged;
              });
            }
          }).catch((error) => {
            console.warn('Failed to fetch user profile:', error);
          });
        }).catch((error) => {
          console.warn('Failed to import userService:', error);
        });
      }
    }).catch((error) => {
      console.warn('Failed to import auth:', error);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser }}>
        <HelmetProvider>
          <SEO page={currentPage} />
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<UserDashboard />} />

                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/services/ui-ux-design" element={<UIUXDesign />} />
                <Route path="/services/web-development" element={<WebDevelopment />} />
                <Route path="/services/software-development" element={<SoftwareDevelopment />} />
                <Route path="/services/software-consultancy" element={<SoftwareConsultancy />} />
                <Route path="/services/mobile-development" element={<MobileDevelopment />} />
                <Route path="/services/ecommerce" element={<Ecommerce />} />
                <Route path="/services/quality-assurance" element={<QualityAssurance />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </HelmetProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
