import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/LanguageSelector";
// We'll define AuthModal inline for now
import { useTranslation } from "react-i18next";
import { 
  Book, 
  Users, 
  Globe, 
  Smartphone, 
  Video, 
  Bot, 
  GraduationCap, 
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Menu,
  X,
  Sparkles,
  Zap,
  Trophy,
  Clock,
  Award,
  MessageCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Landing() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: t('features.roleBasedAccess'),
      description: t('features.roleBasedAccessDesc'),
      gradient: "from-emerald-500 via-teal-500 to-emerald-600",
      delay: "0s"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: t('features.liveClasses'),
      description: t('features.liveClassesDesc'),
      gradient: "from-blue-500 via-indigo-500 to-purple-600",
      delay: "0.1s"
    },
    {
      icon: <Book className="w-8 h-8" />,
      title: t('features.resourceLibrary'),
      description: t('features.resourceLibraryDesc'),
      gradient: "from-purple-500 via-pink-500 to-rose-600",
      delay: "0.2s"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: t('features.aiAssistant'),
      description: t('features.aiAssistantDesc'),
      gradient: "from-orange-500 via-red-500 to-pink-600",
      delay: "0.3s"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('features.multiLanguage'),
      description: t('features.multiLanguageDesc'),
      gradient: "from-green-500 via-emerald-500 to-teal-600",
      delay: "0.4s"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: t('features.mobileFirst'),
      description: t('features.mobileFirstDesc'),
      gradient: "from-pink-500 via-rose-500 to-red-600",
      delay: "0.5s"
    },
  ];

  const stats = [
    { number: "50K+", label: t('hero.stats.students'), icon: <Users className="w-6 h-6" />, color: "text-emerald-600" },
    { number: "1K+", label: t('hero.stats.teachers'), icon: <GraduationCap className="w-6 h-6" />, color: "text-blue-600" },
    { number: "5K+", label: t('hero.stats.courses'), icon: <Book className="w-6 h-6" />, color: "text-purple-600" },
    { number: "4.9★", label: "Rating", icon: <Star className="w-6 h-6" />, color: "text-yellow-600" },
  ];

  const achievements = [
    { icon: <Trophy className="w-6 h-6" />, text: "Best Islamic Learning Platform 2024" },
    { icon: <Award className="w-6 h-6" />, text: "1M+ Students Worldwide" },
    { icon: <Clock className="w-6 h-6" />, text: "24/7 AI Support" },
    { icon: <Sparkles className="w-6 h-6" />, text: "Certified by Islamic Scholars" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-x-hidden">
      {/* Enhanced Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-white/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-lg md:text-xl font-serif">إقرأ</span>
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  Iqra
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Islamic Learning</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:scale-105">
                Features
              </a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:scale-105">
                About
              </a>
              <LanguageSelector />
              <Button 
                variant="ghost" 
                onClick={() => openAuthModal("login")}
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => openAuthModal("register")}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-4">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:bg-emerald-50 transition-all duration-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t shadow-xl animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col space-y-4 p-6">
                <a href="#features" className="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 py-2 hover:pl-2">
                  Features
                </a>
                <a href="#about" className="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 py-2 hover:pl-2">
                  About
                </a>
                <div className="flex space-x-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => openAuthModal("login")}
                    className="flex-1 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => openAuthModal("register")}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-teal-100/50 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-r from-emerald-50/30 to-teal-50/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Enhanced Content */}
            <div className="space-y-8 text-center lg:text-left animate-in slide-in-from-left-8 duration-1000">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 hover:from-emerald-200 hover:to-teal-200 px-6 py-3 text-sm font-medium border-0 shadow-lg animate-in fade-in-0 duration-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  New: AI-Powered Islamic Learning
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '0.2s' }}>
                  <span className="text-gray-900">{t('hero.title')}</span>{' '}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                      {t('hero.titleHighlight')}
                    </span>
                    <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full -z-10 animate-in fade-in-0 duration-1000" style={{ animationDelay: '1s' }}></div>
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '0.4s' }}>
                  {t('hero.subtitle')}
                </p>
              </div>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '0.6s' }}>
                <Button 
                  size="lg" 
                  onClick={() => openAuthModal("register")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t('hero.startLearning')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => openAuthModal("register")}
                  className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 px-8 py-6 text-lg hover:scale-105 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('hero.becomeTeacher')}
                </Button>
              </div>
              
              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 animate-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '0.8s' }}>
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left group hover:scale-110 transition-all duration-300">
                    <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                      <div className={`${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                      <div className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{stat.number}</div>
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enhanced Hero Image */}
            <div className="relative animate-in slide-in-from-right-8 duration-1000" style={{ animationDelay: '0.4s' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-500 group">
                <img 
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Islamic Learning" 
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
              
              {/* Enhanced Floating Cards */}
              <Card className="absolute -top-6 -left-6 w-64 shadow-2xl border-0 bg-white/95 backdrop-blur-xl animate-in slide-in-from-left-4 duration-1000" style={{ animationDelay: '1s' }}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                      <Book className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Daily Quran</p>
                      <p className="text-sm text-gray-600">Surah Al-Fatiha</p>
                      <div className="flex items-center mt-1">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-xs text-emerald-600 font-medium">Completed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="absolute -bottom-6 -right-6 w-56 shadow-2xl border-0 bg-white/95 backdrop-blur-xl animate-in slide-in-from-right-4 duration-1000" style={{ animationDelay: '1.2s' }}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Live Class</p>
                      <p className="text-sm text-gray-600">Starting in 15 min</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-xs text-red-600 font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 text-white animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-emerald-200 hover:text-white transition-colors">
                  {achievement.icon}
                </div>
                <span className="text-sm font-medium">{achievement.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-emerald-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 animate-in slide-in-from-bottom-6 duration-1000">
            <Badge className="bg-emerald-100 text-emerald-700 px-6 py-3 border-0 shadow-lg">
              <Zap className="w-4 h-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-4 bg-white/50 backdrop-blur-sm animate-in slide-in-from-bottom-6 duration-1000"
                style={{ animationDelay: feature.delay }}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-700/50 to-teal-700/50"></div>
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-1000">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Start Your Islamic Learning Journey Today
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students and teachers worldwide. Begin with our free courses and discover the beauty of Islamic knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button 
                size="lg" 
                onClick={() => openAuthModal("register")}
                className="bg-white text-emerald-600 hover:bg-gray-50 hover:scale-105 px-8 py-6 text-lg shadow-xl transition-all duration-300 group"
              >
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Learning Free
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => openAuthModal("register")}
                className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 hover:scale-105 px-8 py-6 text-lg transition-all duration-300"
              >
                Become an Instructor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg font-serif">إقرأ</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Iqra</h3>
                  <p className="text-sm text-gray-400">Islamic Learning</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering Muslim learners worldwide with authentic Islamic education through modern technology and traditional wisdom.
              </p>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4 text-emerald-400">Platform</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">Student Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">Teacher Portal</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">Course Catalog</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">AI Assistant</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4 text-emerald-400">Support</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4 text-emerald-400">Legal</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Iqra Islamic Learning Platform. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Built with React & Node.js</span>
              <span className="text-gray-400 text-sm flex items-center">
                Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for the Ummah
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}