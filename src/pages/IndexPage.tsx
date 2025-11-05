import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import LanguageSelector from "../components/common/LanguageSelector";
import ThemeToggle from "../components/common/ThemeToggle";
import { Heart, Users, Calendar, Activity, Shield, Stethoscope, Mail, Phone, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram, Play, Ambulance, Brain, UserCheck, Clipboard, Zap, Monitor, MessageCircle, Send, X, Bot, Menu, Settings, Info, Contact } from "lucide-react";

export default function IndexPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [showStaffWarning, setShowStaffWarning] = useState(false);
  const [staffWarningLoading, setStaffWarningLoading] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't redirect immediately, allow patients to use AI assistant on homepage
  const isPatient = user && user.role === 'patient';
  // Only redirect if we're not in development mode AND we're not already redirecting
  const shouldRedirect = user && user.role !== 'patient' && process.env.NODE_ENV !== 'development';

  // All useEffect hooks must be called before any conditional returns
  useEffect(() => {
    if (shouldRedirect) {
      // Only redirect non-patient users
      // Add a small delay to prevent immediate redirect loops
      const timer = setTimeout(() => {
        setLocation(`/${user.role}`);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, user, setLocation]);

  // Check if cookies were already accepted
  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (cookiesAccepted) {
      setShowCookieConsent(false);
    }
  }, []);

  // Remove the conditional return that was causing issues
  // The redirect is now handled in useEffect with a timeout

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isPatient) return;

    const newMessage = { role: 'user' as const, content: inputMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleAIChatToggle = () => {
    if (!user) {
      // Show warning for non-logged-in users
      setShowLoginWarning(true);
      return;
    }

    if (user.role !== 'patient') {
      // Show warning for non-patient users
      setShowLoginWarning(true);
      return;
    }

    // Toggle chat for logged-in patients
    setShowAIChat(!showAIChat);
  };

  const handleLoginWarningClose = () => {
    setShowLoginWarning(false);
  };

  const handleLoginRedirect = () => {
    setShowLoginWarning(false);
    setLocation('/login');
  };

  const handleStaffLoginClick = () => {
    setShowStaffWarning(true);
  };

  const handleStaffWarningClose = () => {
    setShowStaffWarning(false);
    setStaffWarningLoading(false);
  };

  const handleStaffWarningProceed = () => {
    setStaffWarningLoading(true);
    setTimeout(() => {
      setShowStaffWarning(false);
      setStaffWarningLoading(false);
      setLocation('/staff-login');
    }, 3000);
  };

  const handleAcceptCookies = () => {
    setShowCookieConsent(false);
    localStorage.setItem('cookiesAccepted', 'true');
  };

  const handleDeclineCookies = () => {
    setShowCookieConsent(false);
    localStorage.setItem('cookiesAccepted', 'false');
  };

  const handleSidebarItemClick = (path: string) => {
    setSidebarOpen(false);
    setLocation(path);
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('appointment') || lowerQuestion.includes('book')) {
      return "I can help you schedule an appointment! Our system allows you to book appointments with specialists, general practitioners, and emergency consultations. You can schedule appointments through your patient dashboard or call our 24/7 helpline at +1-555-SEVA-MED.";
    }

    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('urgent')) {
      return "For medical emergencies, please call 911 immediately or visit our Emergency Department which operates 24/7. Our emergency team includes trauma specialists, cardiac care experts, and critical care physicians ready to provide immediate life-saving treatment.";
    }

    if (lowerQuestion.includes('service') || lowerQuestion.includes('department')) {
      return "SevaMed offers comprehensive healthcare services including: Emergency Care, Specialized Treatment, Patient Management, Appointment Scheduling, AI Health Insights, and Health Monitoring. We have 150+ doctors across multiple specialties including Cardiology, Neurology, Pediatrics, Ophthalmology, and Orthopedics.";
    }

    if (lowerQuestion.includes('doctor') || lowerQuestion.includes('specialist')) {
      return "Our medical team includes 150+ qualified doctors and 50+ specialists across various fields. We have cardiologists, neurologists, pediatricians, orthopedic surgeons, ophthalmologists, and general medicine practitioners. All our doctors are board-certified and experienced in their respective specialties.";
    }

    if (lowerQuestion.includes('facility') || lowerQuestion.includes('equipment')) {
      return "Our state-of-the-art facility includes 500+ hospital beds, 15 operating theaters, 3 MRI machines, 4 CT scanners, 50 ventilators, and advanced diagnostic equipment. We maintain the highest standards of medical technology to ensure accurate diagnosis and effective treatment.";
    }

    if (lowerQuestion.includes('hour') || lowerQuestion.includes('time') || lowerQuestion.includes('open')) {
      return "SevaMed operates 24/7 for emergency services. Our outpatient clinics are open Monday-Saturday 8:00 AM - 8:00 PM, and Sunday 10:00 AM - 6:00 PM. Emergency Department, ICU, and critical care services are available round the clock.";
    }

    return "Thank you for your question! I'm here to help you understand our healthcare management system. You can ask me about our services, facilities, doctors, appointments, emergency care, or any other aspect of SevaMed. How may I assist you with your healthcare needs today?";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900" data-testid="index-page">
      {/* Header */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-blue-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Menu button and Logo on the left side */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-200 hover:bg-blue-600/30 hover:text-blue-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
                  <img
                    src="./sevamed logo.png"
                    alt="SevaMed Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{t("sevamed_hms")}</h1>
                  <p className="text-xs text-blue-600 dark:text-blue-400">{t("healthcare_management")}</p>
                </div>
              </div>
            </div>

            {/* Staff Login button on the right side */}
            <div className="flex items-center">
              <Button
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={handleStaffLoginClick}
                data-testid="staff-login-button"
              >
                Staff Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* User Account Section */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Account</h3>
                  {user ? (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                        onClick={() => {
                          setSidebarOpen(false);
                          setLocation('/login');
                        }}
                      >
                        Sign In to View Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleSidebarItemClick('/settings')}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    {t("settings")}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleSidebarItemClick('/about-us')}
                  >
                    <Info className="h-5 w-5 mr-3" />
                    About Us
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleSidebarItemClick('/contact')}
                  >
                    <Contact className="h-5 w-5 mr-3" />
                    Contact Us
                  </Button>
                </nav>

                {/* Settings Section */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <LanguageSelector />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Theme
                      </label>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  © 2025 SevaMed HMS. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Full Screen Background Images */}
        <div className="absolute inset-0">
          {/* Slideshow Images - Full Coverage */}
          <div className="absolute inset-0 hero-slide-1">
            <img
              src="./analog-landscape-city-with-buildings.jpg"
              alt="SevaMed Hospital Exterior"
              className="w-full h-full object-cover brightness-110 contrast-110 saturate-105"
            />
          </div>
          <div className="absolute inset-0 hero-slide-2">
            <img
              src="./doctor-suggesting-hospital-program-patient.jpg"
              alt="SevaMed Hospital Interior"
              className="w-full h-full object-cover brightness-110 contrast-110 saturate-105"
            />
          </div>
          <div className="absolute inset-0 hero-slide-3">
            <img
              src="./low-rise-building.jpg"
              alt="SevaMed Patient Room"
              className="w-full h-full object-cover brightness-110 contrast-110 saturate-105"
            />
          </div>
          <div className="absolute inset-0 hero-slide-4">
            <img
              src="./medication-drug-pharmacist-prescription-patient.jpg"
              alt="SevaMed Operating Theater"
              className="w-full h-full object-cover brightness-110 contrast-110 saturate-105"
            />
          </div>
          <div className="absolute inset-0 hero-slide-5">
            <img
              src="./analog-landscape-city-with-buildings.jpg"
              alt="SevaMed Emergency Department"
              className="w-full h-full object-cover brightness-110 contrast-110 saturate-105"
            />
          </div>

          {/* Darker Overlay for Better Text Visibility */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-20 flex items-center min-h-screen">
          <div className="w-full flex flex-col justify-center items-center text-center">
            {/* Content positioned in center with enhanced blur background */}
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl">
              <h2 className="text-5xl lg:text-6xl font-bold text-blue-100 mb-8 drop-shadow-2xl leading-tight">
                Advanced Healthcare Management System
              </h2>
              <p className="text-xl lg:text-2xl text-green-100 mb-12 leading-relaxed drop-shadow-xl">
                Providing comprehensive healthcare solutions with advanced technology and compassionate care.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:bg-gradient-to-r hover:from-green-700 hover:to-emerald-800 shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl px-8 py-4 text-lg font-semibold"
                  onClick={() => setLocation("/register")}
                  data-testid="hero-register"
                >
                  Register as Patient
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-300 text-blue-200 hover:bg-blue-600/30 hover:text-blue-100 shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                  onClick={() => setLocation("/login")}
                  data-testid="hero-login"
                >
                  Patient {t("login")}
                </Button>
              </div>
            </div>

            {/* Slideshow Indicators */}
            <div className="flex space-x-3 mt-12">
              <div className="w-4 h-4 bg-white/80 rounded-full shadow-lg indicator-1 backdrop-blur-sm"></div>
              <div className="w-4 h-4 bg-white/80 rounded-full shadow-lg indicator-2 backdrop-blur-sm"></div>
              <div className="w-4 h-4 bg-white/80 rounded-full shadow-lg indicator-3 backdrop-blur-sm"></div>
              <div className="w-4 h-4 bg-white/80 rounded-full shadow-lg indicator-4 backdrop-blur-sm"></div>
              <div className="w-4 h-4 bg-white/80 rounded-full shadow-lg indicator-5 backdrop-blur-sm"></div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Explore SevaMed</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-blue-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-4">Our Medical Facilities</h3>
            <p className="text-xl text-blue-600 dark:text-blue-300">World-class healthcare infrastructure in India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setLocation("/departments/emergency")}>
              <img
                src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80"
                alt="Emergency Department"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">🚨 Emergency Department</h4>
                  <p className="text-sm opacity-90">24/7 critical care services</p>
                  <div className="mt-2 text-xs font-semibold">Learn More →</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setLocation("/departments/cardiology")}>
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80"
                alt="Cardiology Department"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">❤️ Cardiology Department</h4>
                  <p className="text-sm opacity-90">Advanced heart care center</p>
                  <div className="mt-2 text-xs font-semibold">Learn More →</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setLocation("/departments/neurology")}>
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                alt="Neurology Department"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">🧠 Neurology Department</h4>
                  <p className="text-sm opacity-90">Brain and nervous system care</p>
                  <div className="mt-2 text-xs font-semibold">Learn More →</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setLocation("/departments/orthopedics")}>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba99ef?auto=format&fit=crop&w=800&q=80"
                alt="Orthopedics Department"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">🦴 Orthopedics Department</h4>
                  <p className="text-sm opacity-90">Bone and joint specialists</p>
                  <div className="mt-2 text-xs font-semibold">Learn More →</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setLocation("/departments/pediatrics")}>
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                alt="Pediatrics Department"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">👶 Pediatrics Department</h4>
                  <p className="text-sm opacity-90">Children's healthcare experts</p>
                  <div className="mt-2 text-xs font-semibold">Learn More →</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setLocation("/departments/oncology")}>
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80"
                alt="Oncology Department"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">🛡️ Oncology Department</h4>
                  <p className="text-sm opacity-90">Cancer treatment center</p>
                  <div className="mt-2 text-xs font-semibold">Learn More →</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setLocation("/departments/radiology")}>
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
                alt="Radiology Department"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">📱 Radiology Department</h4>
                  <p className="text-sm opacity-90">Advanced imaging services</p>
                  <div className="mt-2 text-xs font-semibold">Learn More →</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setLocation("/departments/gynecology")}>
              <img
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80"
                alt="Gynecology Department"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">🌸 Gynecology Department</h4>
                  <p className="text-sm opacity-90">Women's health specialists</p>
                  <div className="mt-2 text-xs font-semibold">Learn More →</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-700 dark:to-blue-700">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-4">Our Foundation</h3>
            <p className="text-xl text-blue-600 dark:text-blue-300">Built on excellence, compassion, and innovation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-blue-200 dark:border-blue-700 dark:bg-gray-800 cursor-pointer" onClick={() => setLocation("/mission")}>
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">{t("mission")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 dark:text-blue-300">{t("comprehensive_care")}</p>
                <div className="mt-4 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  Learn More →
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-green-200 dark:border-green-700 dark:bg-gray-800 cursor-pointer" onClick={() => setLocation("/vision")}>
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400">{t("vision")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 dark:text-green-300">{t("leading_healthcare")}</p>
                <div className="mt-4 flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-semibold">
                  Learn More →
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-blue-200 dark:border-blue-700 dark:bg-gray-800 cursor-pointer" onClick={() => setLocation("/facilities")}>
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">Our Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 dark:text-blue-300">State-of-the-art medical facilities and equipment</p>
                <div className="mt-4 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  Explore Facilities →
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-4">Our Services</h3>
            <p className="text-xl text-blue-600 dark:text-blue-300">Comprehensive healthcare solutions for all</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Patient Management */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 group dark:bg-gray-800 dark:border-gray-700 overflow-hidden cursor-pointer" onClick={() => setLocation("/services/patient-management")}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                  alt="Patient Management"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-2 group-hover:animate-bounce">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-400">Patient Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600 dark:text-blue-300">
                  Complete patient record management with medical history, appointments, and care tracking.
                </p>
                <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  Click to learn more →
                </div>
              </CardContent>
            </Card>

            {/* Emergency Care */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 group dark:bg-gray-800 dark:border-gray-700 overflow-hidden cursor-pointer" onClick={() => setLocation("/services/emergency-care")}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
                  alt="Emergency Care"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-2 group-hover:animate-bounce">
                    <Ambulance className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-400">Emergency Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600 dark:text-red-300">
                  24/7 emergency medical services with rapid response and critical care capabilities.
                </p>
                <div className="mt-4 flex items-center text-red-600 dark:text-red-400 text-sm font-semibold">
                  Click to learn more →
                </div>
              </CardContent>
            </Card>

            {/* Specialized Treatment */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 group dark:bg-gray-800 dark:border-gray-700 overflow-hidden cursor-pointer" onClick={() => setLocation("/services/specialized-treatment")}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80"
                  alt="Specialized Treatment"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-2 group-hover:animate-bounce">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-400">Specialized Treatment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600 dark:text-green-300">
                  Advanced medical treatments across 15+ specialties with cutting-edge technology.
                </p>
                <div className="mt-4 flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
                  Click to learn more →
                </div>
              </CardContent>
            </Card>

            {/* Appointment Scheduling */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 group dark:bg-gray-800 dark:border-gray-700 overflow-hidden cursor-pointer" onClick={() => setLocation("/services/appointment-scheduling")}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80"
                  alt="Appointment Scheduling"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-2 group-hover:animate-bounce">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-purple-800 dark:text-purple-400">Appointment Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-600 dark:text-purple-300">
                  Easy online appointment booking with specialists and follow-up reminders.
                </p>
                <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 text-sm font-semibold">
                  Click to learn more →
                </div>
              </CardContent>
            </Card>

            {/* AI Health Insights */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 group dark:bg-gray-800 dark:border-gray-700 overflow-hidden cursor-pointer" onClick={() => setLocation("/services/ai-insights")}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1677442135722-5f11e06a4e6d?auto=format&fit=crop&w=800&q=80"
                  alt="AI Health Insights"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-2 group-hover:animate-bounce">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-indigo-800 dark:text-indigo-400">AI Health Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-600 dark:text-indigo-300">
                  AI-powered health analysis and personalized wellness recommendations.
                </p>
                <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
                  Click to learn more →
                </div>
              </CardContent>
            </Card>

            {/* Health Monitoring */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 group dark:bg-gray-800 dark:border-gray-700 overflow-hidden cursor-pointer" onClick={() => setLocation("/services/health-monitoring")}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80"
                  alt="Health Monitoring"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-2 group-hover:animate-bounce">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-teal-800 dark:text-teal-400">Health Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-teal-600 dark:text-teal-300">
                  Continuous health tracking with real-time alerts and trend analysis.
                </p>
                <div className="mt-4 flex items-center text-teal-600 dark:text-teal-400 text-sm font-semibold">
                  Click to learn more →
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-lg">Specialist Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg">Hospital Beds</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg">Medical Departments</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-lg">Happy Patients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-4">Contact Us</h3>
            <p className="text-xl text-blue-600 dark:text-blue-300">Get in touch with our healthcare team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-blue-800 dark:text-blue-400">Our Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600 dark:text-blue-300">
                  123 Healthcare Avenue<br />
                  Medical District, Hyderabad<br />
                  Telangana 500001, India
                </p>
              </CardContent>
            </Card>

            <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-green-800 dark:text-green-400">Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600 dark:text-green-300">
                  Emergency: +91 98765 43210<br />
                  General: +91 12345 67890<br />
                  Helpline: 1800-SEVA-MED
                </p>
              </CardContent>
            </Card>

            <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-purple-800 dark:text-purple-400">Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-600 dark:text-purple-300">
                  General: info@sevamed.in<br />
                  Support: support@sevamed.in<br />
                  Careers: careers@sevamed.in
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                  <Heart className="text-white h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">SevaMed</h4>
                  <p className="text-sm text-gray-400">Healthcare Excellence</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Providing advanced healthcare solutions with compassion and cutting-edge technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-6">Quick Links</h5>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Departments</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-6">Services</h5>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Patient Management</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Emergency Care</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Specialized Treatment</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Appointment Scheduling</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Health Monitoring</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-6">Working Hours</h5>
              <ul className="space-y-3 text-gray-400">
                <li className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span>8:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Emergency</span>
                  <span>24/7</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SevaMed Healthcare Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-700 dark:text-gray-300 mb-4 md:mb-0">
                We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={handleDeclineCookies}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Decline
                </Button>
                <Button
                  onClick={handleAcceptCookies}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Warning Modal */}
      {showLoginWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Login Required</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoginWarningClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please log in as a patient to access the AI assistant and chat features.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleLoginWarningClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLoginRedirect}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Login Warning Modal */}
      {showStaffWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Staff Login</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStaffWarningClose}
                disabled={staffWarningLoading}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You will be redirected to the staff login page. This area is for authorized personnel only.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleStaffWarningClose}
                disabled={staffWarningLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStaffWarningProceed}
                disabled={staffWarningLoading}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700"
              >
                {staffWarningLoading ? "Redirecting..." : "Proceed"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Interface */}
      {showAIChat && (
        <div className="fixed bottom-4 right-4 w-full max-w-md z-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-96">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                  <Bot className="text-white h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">SevaMed AI Assistant</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIChat(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about our services..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={!isPatient}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !isPatient}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chat Button */}
      <Button
        onClick={handleAIChatToggle}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg z-30 flex items-center justify-center"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
}
