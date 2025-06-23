import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSelector } from "@/components/LanguageSelector";
import { IslamicPattern } from "@/components/IslamicPattern";
import { useTranslation } from "react-i18next";

export default function Landing() {
  const { t } = useTranslation();

  const features = [
    {
      icon: "🔐",
      title: t('features.roleBasedAccess'),
      description: t('features.roleBasedAccessDesc'),
      bgColor: "bg-green-100",
    },
    {
      icon: "📹",
      title: t('features.liveClasses'),
      description: t('features.liveClassesDesc'),
      bgColor: "bg-yellow-100",
    },
    {
      icon: "📚",
      title: t('features.resourceLibrary'),
      description: t('features.resourceLibraryDesc'),
      bgColor: "bg-blue-100",
    },
    {
      icon: "🤖",
      title: t('features.aiAssistant'),
      description: t('features.aiAssistantDesc'),
      bgColor: "bg-purple-100",
    },
    {
      icon: "🌍",
      title: t('features.multiLanguage'),
      description: t('features.multiLanguageDesc'),
      bgColor: "bg-green-100",
    },
    {
      icon: "📱",
      title: t('features.mobileFirst'),
      description: t('features.mobileFirstDesc'),
      bgColor: "bg-pink-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <IslamicPattern />
      
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">إ</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Islamic Learning Hub</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition">
                {t('nav.features')}
              </a>
              <a href="#courses" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition">
                {t('nav.courses')}
              </a>
              <a href="#about" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition">
                {t('nav.about')}
              </a>
              
              <div className="flex items-center space-x-3">
                <LanguageSelector />
                
                <Button variant="ghost" asChild>
                  <a href="/api/login">{t('nav.signin')}</a>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href="/api/login">{t('nav.signup')}</a>
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSelector />
              <Button variant="ghost" size="sm" asChild>
                <a href="/api/login">{t('nav.signin')}</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-yellow-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {t('hero.title')}{' '}
                  <span className="text-green-600">{t('hero.titleHighlight')}</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t('hero.subtitle')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg">
                  <a href="/api/login">{t('hero.startLearning')}</a>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-2 border-green-600 text-green-600 hover:bg-green-50 text-lg">
                  <a href="/api/login">{t('hero.becomeTeacher')}</a>
                </Button>
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>10,000+ {t('hero.stats.students')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>500+ {t('hero.stats.teachers')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>1,000+ {t('hero.stats.courses')}</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Students learning Islamic studies" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              
              {/* Floating cards */}
              <Card className="absolute -top-6 -left-6 max-w-xs">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-lg">📖</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Daily Quran</p>
                      <p className="text-sm text-gray-600">Surah Al-Fatiha</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="absolute -bottom-6 -right-6 max-w-xs">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 text-lg">🎓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Live Class</p>
                      <p className="text-sm text-gray-600">Starting in 15 min</p>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t('features.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('features.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">إ</span>
                </div>
                <span className="text-xl font-bold">Islamic Learning Hub</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering Muslim learners worldwide with authentic Islamic education through modern technology.
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
              © 2024 Islamic Learning Hub. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Built with React & Express</span>
              <span className="text-gray-400 text-sm">Deployed on Replit</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
