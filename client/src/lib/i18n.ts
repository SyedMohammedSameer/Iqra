import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.features': 'Features',
      'nav.courses': 'Courses', 
      'nav.about': 'About',
      'nav.signin': 'Sign In',
      'nav.signup': 'Sign Up',
      
      // Landing page
      'hero.title': 'Learn Islam',
      'hero.titleHighlight': 'Authentically',
      'hero.subtitle': 'Join thousands of students and teachers worldwide in our comprehensive Islamic education platform. Learn Quran, Hadith, Islamic history, and more with certified instructors.',
      'hero.startLearning': 'Start Learning',
      'hero.becomeTeacher': 'Become a Teacher',
      'hero.stats.students': 'Students',
      'hero.stats.teachers': 'Teachers',
      'hero.stats.courses': 'Courses',
      
      // Features
      'features.title': 'Everything You Need to Learn Islam',
      'features.subtitle': 'Modern tools and traditional wisdom combined for authentic Islamic education',
      'features.roleBasedAccess': 'Smart Learning Paths',
      'features.roleBasedAccessDesc': 'Personalized dashboards for students and teachers with role-based access and progress tracking.',
      'features.liveClasses': 'Live Interactive Classes',
      'features.liveClassesDesc': 'Real-time learning with integrated video conferencing, screen sharing, and interactive whiteboards.',
      'features.resourceLibrary': 'Rich Digital Library',
      'features.resourceLibraryDesc': 'Access thousands of Islamic resources including PDFs, videos, audio lectures, and interactive content.',
      'features.aiAssistant': 'AI Islamic Scholar',
      'features.aiAssistantDesc': 'Get instant answers to your Islamic questions with our AI assistant trained on authentic Islamic sources.',
      'features.multiLanguage': 'Global Language Support',
      'features.multiLanguageDesc': 'Learn in your preferred language with support for English, Arabic, Urdu, and Bengali.',
      'features.mobileFirst': 'Mobile-First Design',
      'features.mobileFirstDesc': 'Seamless learning experience across all devices - phone, tablet, or desktop.',
      
      // Dashboard
      'dashboard.welcome': 'Welcome Back',
      'dashboard.upcomingClasses': 'Upcoming Classes',
      'dashboard.recentMaterials': 'Recent Materials',
      'dashboard.dailyInspiration': 'Daily Inspiration',
      'dashboard.verseOfDay': 'Verse of the Day',
      'dashboard.hadithOfDay': 'Hadith of the Day',
      'dashboard.aiAssistant': 'AI Islamic Scholar',
      'dashboard.askQuestion': 'Ask me anything about Islam',
      'dashboard.learningProgress': 'Learning Progress',
      
      // Classes
      'classes.joinClass': 'Join Class',
      'classes.remindMe': 'Remind Me',
      'classes.scheduleNew': 'Schedule New Class',
      'classes.myClasses': 'My Classes',
      'classes.availableClasses': 'Available Classes',
      
      // Files
      'files.upload': 'Upload Resources',
      'files.download': 'Download',
      'files.watch': 'Watch',
      'files.dragDrop': 'Drag and drop your files here, or click to browse',
      'files.browseFiles': 'Browse Files',
      'files.recentUploads': 'Recent Uploads',
      
      // Chat
      'chat.askQuestion': 'Ask a question...',
      'chat.send': 'Send',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.share': 'Share',
      'common.viewAll': 'View All',
    }
  },
  ar: {
    translation: {
      // Navigation
      'nav.features': 'الميزات',
      'nav.courses': 'الدورات',
      'nav.about': 'حول',
      'nav.signin': 'تسجيل الدخول',
      'nav.signup': 'إنشاء حساب',
      
      // Landing page
      'hero.title': 'تعلم الإسلام',
      'hero.titleHighlight': 'بطريقة أصيلة',
      'hero.subtitle': 'انضم إلى آلاف الطلاب والمعلمين حول العالم في منصة إقرأ التعليمية الشاملة. تعلم القرآن والحديث والتاريخ الإسلامي والمزيد مع مدربين معتمدين.',
      'hero.startLearning': 'ابدأ التعلم',
      'hero.becomeTeacher': 'كن معلماً',
      'hero.stats.students': 'طلاب',
      'hero.stats.teachers': 'معلمين',
      'hero.stats.courses': 'دورات',
      
      // Features
      'features.title': 'كل ما تحتاجه لتعلم الإسلام',
      'features.subtitle': 'أدوات حديثة وحكمة تقليدية متحدة للتعليم الإسلامي الأصيل',
      'features.roleBasedAccess': 'مسارات تعلم ذكية',
      'features.roleBasedAccessDesc': 'لوحات تحكم شخصية للطلاب والمعلمين مع الوصول القائم على الأدوار وتتبع التقدم.',
      'features.liveClasses': 'فصول تفاعلية مباشرة',
      'features.liveClassesDesc': 'تعلم في الوقت الفعلي مع مؤتمرات الفيديو المتكاملة ومشاركة الشاشة واللوحات التفاعلية.',
      'features.resourceLibrary': 'مكتبة رقمية غنية',
      'features.resourceLibraryDesc': 'الوصول إلى آلاف الموارد الإسلامية بما في ذلك ملفات PDF ومقاطع الفيديو والمحاضرات الصوتية والمحتوى التفاعلي.',
      'features.aiAssistant': 'عالم الذكاء الاصطناعي الإسلامي',
      'features.aiAssistantDesc': 'احصل على إجابات فورية لأسئلتك الإسلامية مع مساعدنا الذكي المدرب على المصادر الإسلامية الأصيلة.',
      'features.multiLanguage': 'دعم اللغات العالمية',
      'features.multiLanguageDesc': 'تعلم بلغتك المفضلة مع دعم الإنجليزية والعربية والأردية والبنغالية.',
      'features.mobileFirst': 'تصميم يركز على الهاتف المحمول',
      'features.mobileFirstDesc': 'تجربة تعلم سلسة عبر جميع الأجهزة - الهاتف أو الجهاز اللوحي أو سطح المكتب.',
      
      // Dashboard
      'dashboard.welcome': 'مرحباً بعودتك',
      'dashboard.upcomingClasses': 'الفصول القادمة',
      'dashboard.recentMaterials': 'المواد الحديثة',
      'dashboard.dailyInspiration': 'الإلهام اليومي',
      'dashboard.verseOfDay': 'آية اليوم',
      'dashboard.hadithOfDay': 'حديث اليوم',
      'dashboard.aiAssistant': 'عالم الذكاء الاصطناعي الإسلامي',
      'dashboard.askQuestion': 'اسألني أي شيء عن الإسلام',
      'dashboard.learningProgress': 'تقدم التعلم',
      
      // Classes
      'classes.joinClass': 'انضم للفصل',
      'classes.remindMe': 'ذكرني',
      'classes.scheduleNew': 'جدولة فصل جديد',
      'classes.myClasses': 'فصولي',
      'classes.availableClasses': 'الفصول المتاحة',
      
      // Files
      'files.upload': 'تحميل الموارد',
      'files.download': 'تحميل',
      'files.watch': 'مشاهدة',
      'files.dragDrop': 'اسحب وأفلت ملفاتك هنا، أو انقر للتصفح',
      'files.browseFiles': 'تصفح الملفات',
      'files.recentUploads': 'التحميلات الحديثة',
      
      // Chat
      'chat.askQuestion': 'اسأل سؤالاً...',
      'chat.send': 'إرسال',
      
      // Common
      'common.loading': 'جارٍ التحميل...',
      'common.error': 'خطأ',
      'common.success': 'نجح',
      'common.cancel': 'إلغاء',
      'common.save': 'حفظ',
      'common.edit': 'تعديل',
      'common.delete': 'حذف',
      'common.share': 'مشاركة',
      'common.viewAll': 'عرض الكل',
    }
  },
  ur: {
    translation: {
      // Navigation
      'nav.features': 'خصوصیات',
      'nav.courses': 'کورسز',
      'nav.about': 'تعارف',
      'nav.signin': 'سائن ان',
      'nav.signup': 'سائن اپ',
      
      // Landing page
      'hero.title': 'اسلام سیکھیں',
      'hero.titleHighlight': 'مستند طریقے سے',
      'hero.subtitle': 'دنیا بھر میں ہزاروں طلباء اور اساتذہ کے ساتھ ہمارے جامع اسلامی تعلیمی پلیٹ فارم اقرأ میں شامل ہوں۔ معتبر اساتذہ کے ساتھ قرآن، حدیث، اسلامی تاریخ اور مزید سیکھیں۔',
      'hero.startLearning': 'سیکھنا شروع کریں',
      'hero.becomeTeacher': 'استاد بنیں',
      'hero.stats.students': 'طلباء',
      'hero.stats.teachers': 'اساتذہ',
      'hero.stats.courses': 'کورسز',
      
      // Features
      'features.title': 'اسلام سیکھنے کے لیے آپ کو جو کچھ چاہیے',
      'features.subtitle': 'مستند اسلامی تعلیم کے لیے جدید ٹولز اور روایتی حکمت کا امتزاج',
      'features.roleBasedAccess': 'ذہین سیکھنے کے راستے',
      'features.roleBasedAccessDesc': 'طلباء اور اساتذہ کے لیے ذاتی ڈیش بورڈ کے ساتھ کردار پر مبنی رسائی اور پیش قدمی کی نگرانی۔',
      'features.liveClasses': 'لائیو انٹریکٹو کلاسز',
      'features.liveClassesDesc': 'مربوط ویڈیو کانفرنسنگ، اسکرین شیئرنگ، اور انٹریکٹو وائٹ بورڈز کے ساتھ حقیقی وقت میں سیکھنا۔',
      'features.resourceLibrary': 'بھرپور ڈیجیٹل لائبریری',
      'features.resourceLibraryDesc': 'PDFs، ویڈیوز، آڈیو لیکچرز، اور انٹریکٹو مواد سمیت ہزاروں اسلامی وسائل تک رسائی۔',
      'features.aiAssistant': 'AI اسلامی عالم',
      'features.aiAssistantDesc': 'مستند اسلامی ذرائع پر تربیت یافتہ ہمارے AI اسسٹنٹ کے ساتھ اپنے اسلامی سوالات کے فوری جوابات حاصل کریں۔',
      'features.multiLanguage': 'عالمی زبان کی سپورٹ',
      'features.multiLanguageDesc': 'انگریزی، عربی، اردو، اور بنگالی کی سپورٹ کے ساتھ اپنی پسندیدہ زبان میں سیکھیں۔',
      'features.mobileFirst': 'موبائل فرسٹ ڈیزائن',
      'features.mobileFirstDesc': 'تمام آلات میں ہموار سیکھنے کا تجربہ - فون، ٹیبلٹ، یا ڈیسک ٹاپ۔',
      
      // Dashboard
      'dashboard.welcome': 'واپسی مبارک',
      'dashboard.upcomingClasses': 'آنے والی کلاسز',
      'dashboard.recentMaterials': 'حالیہ مواد',
      'dashboard.dailyInspiration': 'روزانہ تحریک',
      'dashboard.verseOfDay': 'آج کی آیت',
      'dashboard.hadithOfDay': 'آج کی حدیث',
      'dashboard.aiAssistant': 'AI اسلامی عالم',
      'dashboard.askQuestion': 'اسلام کے بارے میں کچھ بھی پوچھیں',
      'dashboard.learningProgress': 'تعلیمی پیش قدمی',
      
      // Classes
      'classes.joinClass': 'کلاس میں شامل ہوں',
      'classes.remindMe': 'یاد دہانی',
      'classes.scheduleNew': 'نئی کلاس شیڈول کریں',
      'classes.myClasses': 'میری کلاسز',
      'classes.availableClasses': 'دستیاب کلاسز',
      
      // Files
      'files.upload': 'وسائل اپ لوڈ کریں',
      'files.download': 'ڈاؤن لوڈ',
      'files.watch': 'دیکھیں',
      'files.dragDrop': 'اپنی فائلیں یہاں گھسیٹیں اور چھوڑیں، یا براؤز کرنے کے لیے کلک کریں',
      'files.browseFiles': 'فائلیں براؤز کریں',
      'files.recentUploads': 'حالیہ اپ لوڈز',
      
      // Chat
      'chat.askQuestion': 'سوال پوچھیں...',
      'chat.send': 'بھیجیں',
      
      // Common
      'common.loading': 'لوڈ ہو رہا ہے...',
      'common.error': 'غلطی',
      'common.success': 'کامیابی',
      'common.cancel': 'منسوخ',
      'common.save': 'محفوظ کریں',
      'common.edit': 'تبدیل کریں',
      'common.delete': 'حذف کریں',
      'common.share': 'شئیر کریں',
      'common.viewAll': 'سب دیکھیں',
    }
  },
  bn: {
    translation: {
      // Navigation
      'nav.features': 'বৈশিষ্ট্য',
      'nav.courses': 'কোর্স',
      'nav.about': 'সম্পর্কে',
      'nav.signin': 'সাইন ইন',
      'nav.signup': 'সাইন আপ',
      
      // Landing page
      'hero.title': 'ইসলাম শিখুন',
      'hero.titleHighlight': 'প্রামাণিকভাবে',
      'hero.subtitle': 'বিশ্বব্যাপী হাজার হাজার ছাত্র এবং শিক্ষকদের সাথে আমাদের ব্যাপক ইসলামী শিক্ষা প্ল্যাটফর্ম ইকরায় যোগ দিন। সার্টিফাইড প্রশিক্ষকদের সাথে কুরআন, হাদিস, ইসলামী ইতিহাস এবং আরও অনেক কিছু শিখুন।',
      'hero.startLearning': 'শেখা শুরু করুন',
      'hero.becomeTeacher': 'শিক্ষক হন',
      'hero.stats.students': 'ছাত্রছাত্রী',
      'hero.stats.teachers': 'শিক্ষক',
      'hero.stats.courses': 'কোর্স',
      
      // Features
      'features.title': 'ইসলাম শেখার জন্য আপনার যা কিছু দরকার',
      'features.subtitle': 'প্রামাণিক ইসলামী শিক্ষার জন্য আধুনিক সরঞ্জাম এবং ঐতিহ্যবাহী জ্ঞানের সমন্বয়',
      'features.roleBasedAccess': 'স্মার্ট শেখার পথ',
      'features.roleBasedAccessDesc': 'ভূমিকা-ভিত্তিক অ্যাক্সেস এবং অগ্রগতি ট্র্যাকিং সহ ছাত্র এবং শিক্ষকদের জন্য ব্যক্তিগত ড্যাশবোর্ড।',
      'features.liveClasses': 'লাইভ ইন্টারঅ্যাক্টিভ ক্লাস',
      'features.liveClassesDesc': 'একীভূত ভিডিও কনফারেন্সিং, স্ক্রিন শেয়ারিং এবং ইন্টারঅ্যাক্টিভ হোয়াইটবোর্ডের সাথে রিয়েল-টাইম শেখা।',
      'features.resourceLibrary': 'সমৃদ্ধ ডিজিটাল লাইব্রেরি',
      'features.resourceLibraryDesc': 'PDF, ভিডিও, অডিও লেকচার এবং ইন্টারঅ্যাক্টিভ সামগ্রী সহ হাজার হাজার ইসলামী সম্পদে অ্যাক্সেস।',
      'features.aiAssistant': 'AI ইসলামী পণ্ডিত',
      'features.aiAssistantDesc': 'প্রামাণিক ইসলামী উৎসে প্রশিক্ষিত আমাদের AI সহায়কের সাথে আপনার ইসলামী প্রশ্নের তাৎক্ষণিক উত্তর পান।',
      'features.multiLanguage': 'বৈশ্বিক ভাষা সমর্থন',
      'features.multiLanguageDesc': 'ইংরেজি, আরবি, উর্দু এবং বাংলার সমর্থন সহ আপনার পছন্দের ভাষায় শিখুন।',
      'features.mobileFirst': 'মোবাইল ফার্স্ট ডিজাইন',
      'features.mobileFirstDesc': 'সব ডিভাইসে নিরবচ্ছিন্ন শেখার অভিজ্ঞতা - ফোন, ট্যাবলেট বা ডেস্কটপ।',
      
      // Dashboard
      'dashboard.welcome': 'ফিরে আসায় স্বাগতম',
      'dashboard.upcomingClasses': 'আসন্ন ক্লাস',
      'dashboard.recentMaterials': 'সাম্প্রতিক উপকরণ',
      'dashboard.dailyInspiration': 'দৈনিক অনুপ্রেরণা',
      'dashboard.verseOfDay': 'আজের আয়াত',
      'dashboard.hadithOfDay': 'আজের হাদিস',
      'dashboard.aiAssistant': 'AI ইসলামী পণ্ডিত',
      'dashboard.askQuestion': 'ইসলাম সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন',
      'dashboard.learningProgress': 'শেখার অগ্রগতি',
      
      // Classes
      'classes.joinClass': 'ক্লাসে যোগ দিন',
      'classes.remindMe': 'মনে করিয়ে দিন',
      'classes.scheduleNew': 'নতুন ক্লাস সময়সূচী',
      'classes.myClasses': 'আমার ক্লাস',
      'classes.availableClasses': 'উপলব্ধ ক্লাস',
      
      // Files
      'files.upload': 'রিসোর্স আপলোড করুন',
      'files.download': 'ডাউনলোড',
      'files.watch': 'দেখুন',
      'files.dragDrop': 'আপনার ফাইলগুলি এখানে টেনে আনুন এবং ছেড়ে দিন, বা ব্রাউজ করতে ক্লিক করুন',
      'files.browseFiles': 'ফাইল ব্রাউজ করুন',
      'files.recentUploads': 'সাম্প্রতিক আপলোড',
      
      // Chat
      'chat.askQuestion': 'একটি প্রশ্ন জিজ্ঞাসা করুন...',
      'chat.send': 'পাঠান',
      
      // Common
      'common.loading': 'লোড হচ্ছে...',
      'common.error': 'ত্রুটি',
      'common.success': 'সফল',
      'common.cancel': 'বাতিল',
      'common.save': 'সংরক্ষণ',
      'common.edit': 'সম্পাদনা',
      'common.delete': 'মুছুন',
      'common.share': 'শেয়ার',
      'common.viewAll': 'সব দেখুন',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;