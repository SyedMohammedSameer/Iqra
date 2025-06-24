import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/LanguageSelector";
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
  X
} from "lucide-react";

export default function Landing() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: t('features.roleBasedAccess'),
      description: t('features.roleBasedAccessDesc'),
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: t('features.liveClasses'),
      description: t('features.liveClassesDesc'),
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <Book className="w-8 h-8" />,
      title: t('features.resourceLibrary'),
      description: t('features.resourceLibraryDesc'),
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: t('features.aiAssistant'),
      description: t('features.aiAssistantDesc'),
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('features.multiLanguage'),
      description: t('features.multiLanguageDesc'),
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: t('features.mobileFirst'),
      description: t('features.mobileFirstDesc'),
      gradient: "from-pink-500 to-rose-600",
    },
  ];

  const stats = [
    { number: "50K+", label: t('hero.stats.students'), icon: <Users className="w-6 h-6" /> },
    { number: "1K+", label: t('hero.stats.teachers'), icon: <GraduationCap className="w-6 h-6" /> },
    { number: "5K+", label: t('hero.stats.courses'), icon: <Book className="w-6 h-6" /> },
    { number: "4.9★", label: "Rating", icon: <Star className="w-6 h-6" /> },
  ];

  const testimonials = [
    {
      name: "Ahmed Al-Rashid",
      role: "Student",
      content: "Iqra has transformed my Islamic learning journey. The AI assistant helps me understand complex concepts easily.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Fatima Khan",
      role: "Teacher",
      content: "Teaching on Iqra is seamless. The platform's tools make it easy to engage with students worldwide.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e7f3a8?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Omar Hassan",
      role: "Parent",
      content: "My children love learning Quran through Iqra. The interactive lessons keep them engaged and motivated.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg md:text-xl font-serif">إقرأ</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Iqra
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Islamic Learning</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                About
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                Reviews
              </a>
              <LanguageSelector />
              <Button variant="ghost" className="text-gray-700 hover:text-emerald-600">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg">
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
                className="text-gray-700"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg">
              <div className="flex flex-col space-y-4 p-6">
                <a href="#features" className="text-gray-700 hover:text-emerald-600 font-medium">
                  Features
                </a>
                <a href="#about" className="text-gray-700 hover:text-emerald-600 font-medium">
                  About
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-emerald-600 font-medium">
                  Reviews
                </a>
                <div className="flex space-x-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    Sign In
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-emerald-100/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-teal-100/30 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 text-sm font-medium">
                  ✨ New: AI-Powered Islamic Learning
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="text-gray-900">{t('hero.title')}</span>{' '}
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                    {t('hero.titleHighlight')}
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {t('hero.subtitle')}
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t('hero.startLearning')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg">
                  {t('hero.becomeTeacher')}
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                      <div className="text-emerald-600">{stat.icon}</div>
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Islamic Learning" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <Card className="absolute -top-6 -left-6 w-64 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                      <Book className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Daily Quran</p>
                      <p className="text-sm text-gray-600">Surah Al-Fatiha</p>
                      <div className="flex items-center mt-1">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-xs text-emerald-600">Completed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="absolute -bottom-6 -right-6 w-56 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Live Class</p>
                      <p className="text-sm text-gray-600">Starting in 15 min</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-xs text-red-600">Live</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2">
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
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2">
              Student Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Loved by Learners Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our community says about their learning journey with Iqra
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Start Your Islamic Learning Journey Today
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Join thousands of students and teachers worldwide. Begin with our free courses and discover the beauty of Islamic knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-6 text-lg shadow-xl">
                <Heart className="w-5 h-5 mr-2" />
                Start Learning Free
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-6 text-lg">
                Become an Instructor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
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
              <h6 className="font-semibold mb-4">Platform</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Student Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition">Teacher Portal</a></li>
                <li><a href="#" className="hover:text-white transition">Course Catalog</a></li>
                <li><a href="#" className="hover:text-white transition">AI Assistant</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Support</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">Community</a></li>
                <li><a href="#" className="hover:text-white transition">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Legal</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Iqra Islamic Learning Platform. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Built with React & Node.js</span>
              <span className="text-gray-400 text-sm">Made with ❤️ for the Ummah</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}