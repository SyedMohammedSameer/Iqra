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
      'hero.subtitle': 'Join thousands of students and teachers in our comprehensive Islamic education platform. Learn Quran, Hadith, Islamic history, and more with certified instructors.',
      'hero.startLearning': 'Start Learning',
      'hero.becomeTeacher': 'Become a Teacher',
      'hero.stats.students': 'Students',
      'hero.stats.teachers': 'Teachers',
      'hero.stats.courses': 'Courses',
      
      // Features
      'features.title': 'Comprehensive Learning Platform',
      'features.subtitle': 'Everything you need to learn and teach Islam in one platform',
      'features.roleBasedAccess': 'Role-Based Access',
      'features.roleBasedAccessDesc': 'Secure authentication system with separate dashboards for students and teachers.',
      'features.liveClasses': 'Live Online Classes',
      'features.liveClassesDesc': 'Integrated video conferencing with Google Meet, Zoom, and Jitsi.',
      'features.resourceLibrary': 'Rich Resource Library',
      'features.resourceLibraryDesc': 'Upload and access PDFs, videos, and notes.',
      'features.aiAssistant': 'AI Islamic Assistant',
      'features.aiAssistantDesc': 'Ask questions about Quran, Hadith, and Islamic history.',
      'features.multiLanguage': 'Multi-Language Support',
      'features.multiLanguageDesc': 'Available in English, Arabic, Urdu, and Bangla.',
      'features.mobileFirst': 'Mobile-First Design',
      'features.mobileFirstDesc': 'Optimized for all devices.',
      
      // Dashboard
      'dashboard.welcome': 'Welcome Back',
      'dashboard.upcomingClasses': 'Upcoming Classes',
      'dashboard.recentMaterials': 'Recent Materials',
      'dashboard.dailyInspiration': 'Daily Inspiration',
      'dashboard.verseOfDay': 'Verse of the Day',
      'dashboard.hadithOfDay': 'Hadith of the Day',
      'dashboard.aiAssistant': 'AI Islamic Assistant',
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
      'hero.subtitle': 'انضم إلى آلاف الطلاب والمعلمين في منصة التعليم الإسلامي الشاملة. تعلم القرآن والحديث والتاريخ الإسلامي والمزيد مع مدربين معتمدين.',
      'hero.startLearning': 'ابدأ التعلم',
      'hero.becomeTeacher': 'كن معلماً',
      'hero.stats.students': 'طلاب',
      'hero.stats.teachers': 'معلمين',
      'hero.stats.courses': 'دورات',
      
      // Features
      'features.title': 'منصة تعليمية شاملة',
      'features.subtitle': 'كل ما تحتاجه لتعلم وتدريس الإسلام في منصة واحدة',
      'features.roleBasedAccess': 'الوصول القائم على الأدوار',
      'features.roleBasedAccessDesc': 'نظام مصادقة آمن مع لوحات تحكم منفصلة للطلاب والمعلمين.',
      'features.liveClasses': 'فصول مباشرة عبر الإنترنت',
      'features.liveClassesDesc': 'مؤتمرات فيديو متكاملة مع Google Meet و Zoom و Jitsi.',
      'features.resourceLibrary': 'مكتبة موارد غنية',
      'features.resourceLibraryDesc': 'تحميل والوصول إلى ملفات PDF ومقاطع الفيديو والملاحظات.',
      'features.aiAssistant': 'مساعد الذكي الإسلامي',
      'features.aiAssistantDesc': 'اسأل أسئلة حول القرآن والحديث والتاريخ الإسلامي.',
      'features.multiLanguage': 'دعم متعدد اللغات',
      'features.multiLanguageDesc': 'متاح بالإنجليزية والعربية والأردية والبنغالية.',
      'features.mobileFirst': 'تصميم يركز على الهاتف المحمول',
      'features.mobileFirstDesc': 'محسن لجميع الأجهزة.',
      
      // Dashboard
      'dashboard.welcome': 'مرحباً بعودتك',
      'dashboard.upcomingClasses': 'الفصول القادمة',
      'dashboard.recentMaterials': 'المواد الحديثة',
      'dashboard.dailyInspiration': 'الإلهام اليومي',
      'dashboard.verseOfDay': 'آية اليوم',
      'dashboard.hadithOfDay': 'حديث اليوم',
      'dashboard.aiAssistant': 'المساعد الذكي الإسلامي',
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
      'hero.subtitle': 'ہزاروں طلباء اور اساتذہ کے ساتھ ہمارے جامع اسلامی تعلیمی پلیٹ فارم میں شامل ہوں۔ معتبر اساتذہ کے ساتھ قرآن، حدیث، اسلامی تاریخ اور مزید سیکھیں۔',
      'hero.startLearning': 'سیکھنا شروع کریں',
      'hero.becomeTeacher': 'استاد بنیں',
      'hero.stats.students': 'طلباء',
      'hero.stats.teachers': 'اساتذہ',
      'hero.stats.courses': 'کورسز',
      
      // Features
      'features.title': 'جامع تعلیمی پلیٹ فارم',
      'features.subtitle': 'ایک پلیٹ فارم میں اسلام سیکھنے اور سکھانے کے لیے آپ کو جو کچھ چاہیے',
      'features.roleBasedAccess': 'کردار پر مبنی رسائی',
      'features.roleBasedAccessDesc': 'طلباء اور اساتذہ کے لیے الگ ڈیش بورڈ کے ساتھ محفوظ تصدیقی نظام۔',
      'features.liveClasses': 'لائیو آن لائن کلاسز',
      'features.liveClassesDesc': 'Google Meet، Zoom، اور Jitsi کے ساتھ مربوط ویڈیو کانفرنسنگ۔',
      'features.resourceLibrary': 'بھرپور وسائل کی لائبریری',
      'features.resourceLibraryDesc': 'PDFs، ویڈیوز، اور نوٹس اپ لوڈ اور رسائی۔',
      'features.aiAssistant': 'AI اسلامی اسسٹنٹ',
      'features.aiAssistantDesc': 'قرآن، حدیث، اور اسلامی تاریخ کے بارے میں سوالات پوچھیں۔',
      'features.multiLanguage': 'کثیر لسانی سپورٹ',
      'features.multiLanguageDesc': 'انگریزی، عربی، اردو، اور بنگالی میں دستیاب۔',
      'features.mobileFirst': 'موبائل فرسٹ ڈیزائن',
      'features.mobileFirstDesc': 'تمام آلات کے لیے بہتر بنایا گیا۔',
      
      // Dashboard
      'dashboard.welcome': 'واپسی مبارک',
      'dashboard.upcomingClasses': 'آنے والی کلاسز',
      'dashboard.recentMaterials': 'حالیہ مواد',
      'dashboard.dailyInspiration': 'روزانہ تحریک',
      'dashboard.verseOfDay': 'آج کی آیت',
      'dashboard.hadithOfDay': 'آج کی حدیث',
      'dashboard.aiAssistant': 'AI اسلامی اسسٹنٹ',
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
      'hero.subtitle': 'আমাদের ব্যাপক ইসলামী শিক্ষা প্ল্যাটফর্মে হাজার হাজার ছাত্র এবং শিক্ষকদের সাথে যোগ দিন। সার্টিফাইড প্রশিক্ষকদের সাথে কুরআন, হাদিস, ইসলামী ইতিহাস এবং আরও অনেক কিছু শিখুন।',
      'hero.startLearning': 'শেখা শুরু করুন',
      'hero.becomeTeacher': 'শিক্ষক হন',
      'hero.stats.students': 'ছাত্রছাত্রী',
      'hero.stats.teachers': 'শিক্ষক',
      'hero.stats.courses': 'কোর্স',
      
      // Features
      'features.title': 'ব্যাপক শিক্ষা প্ল্যাটফর্ম',
      'features.subtitle': 'একটি প্ল্যাটফর্মে ইসলাম শেখার এবং শেখানোর জন্য আপনার যা কিছু দরকার',
      'features.roleBasedAccess': 'ভূমিকা-ভিত্তিক অ্যাক্সেস',
      'features.roleBasedAccessDesc': 'ছাত্র এবং শিক্ষকদের জন্য পৃথক ড্যাশবোর্ড সহ নিরাপদ প্রমাণীকরণ সিস্টেম।',
      'features.liveClasses': 'লাইভ অনলাইন ক্লাস',
      'features.liveClassesDesc': 'Google Meet, Zoom, এবং Jitsi এর সাথে একীভূত ভিডিও কনফারেন্সিং।',
      'features.resourceLibrary': 'সমৃদ্ধ রিসোর্স লাইব্রেরি',
      'features.resourceLibraryDesc': 'PDF, ভিডিও এবং নোট আপলোড এবং অ্যাক্সেস করুন।',
      'features.aiAssistant': 'AI ইসলামী সহায়ক',
      'features.aiAssistantDesc': 'কুরআন, হাদিস এবং ইসলামী ইতিহাস সম্পর্কে প্রশ্ন জিজ্ঞাসা করুন।',
      'features.multiLanguage': 'বহু-ভাষা সমর্থন',
      'features.multiLanguageDesc': 'ইংরেজি, আরবি, উর্দু এবং বাংলায় উপলব্ধ।',
      'features.mobileFirst': 'মোবাইল ফার্স্ট ডিজাইন',
      'features.mobileFirstDesc': 'সব ডিভাইসের জন্য অপ্টিমাইজড।',
      
      // Dashboard
      'dashboard.welcome': 'ফিরে আসায় স্বাগতম',
      'dashboard.upcomingClasses': 'আসন্ন ক্লাস',
      'dashboard.recentMaterials': 'সাম্প্রতিক উপকরণ',
      'dashboard.dailyInspiration': 'দৈনিক অনুপ্রেরণা',
      'dashboard.verseOfDay': 'আজের আয়াত',
      'dashboard.hadithOfDay': 'আজের হাদিস',
      'dashboard.aiAssistant': 'AI ইসলামী সহায়ক',
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
