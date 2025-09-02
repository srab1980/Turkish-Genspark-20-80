import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for frontend-backend communication
app.use('/api/*', cors())

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// Enhanced Turkish learning data - Extended vocabulary with conversation practice
const vocabulary = {
  greetings: [
    { id: 1, turkish: "Merhaba", arabic: "مرحبا", english: "Hello", pronunciation: "mer-ha-BA", 
      example: "Merhaba, nasılsınız?", exampleArabic: "مرحبا، كيف حالك؟",
      icon: "fas fa-hand-wave", emoji: "👋" },
    { id: 2, turkish: "Günaydın", arabic: "صباح الخير", english: "Good morning", pronunciation: "gün-ay-DIN",
      example: "Günaydın! Bugün hava çok güzel.", exampleArabic: "صباح الخير! الطقس جميل جداً اليوم.",
      icon: "fas fa-sun", emoji: "☀️" },
    { id: 3, turkish: "İyi akşamlar", arabic: "مساء الخير", english: "Good evening", pronunciation: "i-yi ak-sham-LAR",
      example: "İyi akşamlar, iyi dinlenmeler.", exampleArabic: "مساء الخير، استراحة طيبة.",
      icon: "fas fa-moon", emoji: "🌙" },
    { id: 4, turkish: "Hoşça kalın", arabic: "وداعا", english: "Goodbye", pronunciation: "hosh-CHA ka-LIN",
      example: "Hoşça kalın, yarın görüşürüz.", exampleArabic: "وداعاً، نراكم غداً.",
      icon: "fas fa-hand-paper", emoji: "👋" },
    { id: 5, turkish: "Lütfen", arabic: "من فضلك", english: "Please", pronunciation: "lüt-FEN",
      example: "Lütfen bana yardım edin.", exampleArabic: "من فضلك ساعدني.",
      icon: "fas fa-hands-praying", emoji: "🙏" },
    { id: 6, turkish: "Teşekkür ederim", arabic: "شكرا لك", english: "Thank you", pronunciation: "te-shek-KÜR e-de-RIM",
      example: "Yardımınız için teşekkür ederim.", exampleArabic: "شكراً لك على مساعدتك.",
      icon: "fas fa-heart", emoji: "❤️" }
  ],
  travel: [
    { id: 7, turkish: "Havaalanı", arabic: "المطار", english: "Airport", pronunciation: "ha-va-a-la-NI",
      example: "Havaalanına taksiyle gittim.", exampleArabic: "ذهبت إلى المطار بالتاكسي.",
      icon: "fas fa-plane", emoji: "✈️" },
    { id: 8, turkish: "Otel", arabic: "فندق", english: "Hotel", pronunciation: "o-TEL",
      example: "Bu otel çok güzel.", exampleArabic: "هذا الفندق جميل جداً.",
      icon: "fas fa-bed", emoji: "🏨" },
    { id: 9, turkish: "Taksi", arabic: "تاكسي", english: "Taxi", pronunciation: "tak-SI",
      example: "Taksi çağırabilir misiniz?", exampleArabic: "هل يمكنك استدعاء تاكسي؟",
      icon: "fas fa-taxi", emoji: "🚕" },
    { id: 10, turkish: "Otobüs", arabic: "حافلة", english: "Bus", pronunciation: "o-to-BÜS",
      example: "Otobüs durağı nerede?", exampleArabic: "أين موقف الحافلة؟",
      icon: "fas fa-bus", emoji: "🚌" },
    { id: 11, turkish: "Tren", arabic: "قطار", english: "Train", pronunciation: "TREN",
      example: "Tren saat kaçta kalkıyor?", exampleArabic: "متى يغادر القطار؟",
      icon: "fas fa-train", emoji: "🚂" },
    { id: 12, turkish: "Bilet", arabic: "تذكرة", english: "Ticket", pronunciation: "bi-LET",
      example: "Bir bilet istiyorum.", exampleArabic: "أريد تذكرة واحدة.",
      icon: "fas fa-ticket-alt", emoji: "🎫" }
  ],
  food: [
    { id: 13, turkish: "Su", arabic: "ماء", english: "Water", pronunciation: "SU",
      example: "Bir bardak su istiyorum.", exampleArabic: "أريد كأس من الماء.",
      icon: "fas fa-tint", emoji: "💧" },
    { id: 14, turkish: "Ekmek", arabic: "خبز", english: "Bread", pronunciation: "ek-MEK",
      example: "Ekmek çok taze.", exampleArabic: "الخبز طازج جداً.",
      icon: "fas fa-bread-slice", emoji: "🍞" },
    { id: 15, turkish: "Et", arabic: "لحم", english: "Meat", pronunciation: "ET",
      example: "Et yemek istemiyorum.", exampleArabic: "لا أريد أن آكل اللحم.",
      icon: "fas fa-drumstick-bite", emoji: "🥩" },
    { id: 16, turkish: "Balık", arabic: "سمك", english: "Fish", pronunciation: "ba-LIK",
      example: "Balık çok lezzetli.", exampleArabic: "السمك لذيذ جداً.",
      icon: "fas fa-fish", emoji: "🐟" },
    { id: 17, turkish: "Sebze", arabic: "خضار", english: "Vegetable", pronunciation: "seb-ZE",
      example: "Taze sebze seviyorum.", exampleArabic: "أحب الخضار الطازجة.",
      icon: "fas fa-carrot", emoji: "🥕" },
    { id: 18, turkish: "Meyve", arabic: "فاكهة", english: "Fruit", pronunciation: "mey-VE",
      example: "Meyve çok sağlıklı.", exampleArabic: "الفاكهة صحية جداً.",
      icon: "fas fa-apple-alt", emoji: "🍎" }
  ],
  shopping: [
    { id: 19, turkish: "Ne kadar?", arabic: "كم الثمن؟", english: "How much?", pronunciation: "ne ka-DAR",
      example: "Bu ne kadar?", exampleArabic: "كم ثمن هذا؟",
      icon: "fas fa-question-circle", emoji: "❓" },
    { id: 20, turkish: "Çok pahalı", arabic: "غالي جدا", english: "Too expensive", pronunciation: "chok pa-ha-LI",
      example: "Bu çok pahalı, daha ucuzu var mı?", exampleArabic: "هذا غالي جداً، هل يوجد أرخص؟",
      icon: "fas fa-exclamation-triangle", emoji: "💸" },
    { id: 21, turkish: "Ucuz", arabic: "رخيص", english: "Cheap", pronunciation: "u-JUZ",
      example: "Bu çok ucuz bir fiyat.", exampleArabic: "هذا سعر رخيص جداً.",
      icon: "fas fa-tag", emoji: "🏷️" },
    { id: 22, turkish: "Para", arabic: "مال", english: "Money", pronunciation: "pa-RA",
      example: "Yeterli param yok.", exampleArabic: "ليس معي مال كافٍ.",
      icon: "fas fa-coins", emoji: "💰" },
    { id: 23, turkish: "Satın almak", arabic: "شراء", english: "To buy", pronunciation: "sa-tin al-MAK",
      example: "Bunu satın almak istiyorum.", exampleArabic: "أريد شراء هذا.",
      icon: "fas fa-shopping-cart", emoji: "🛒" },
    { id: 24, turkish: "Mağaza", arabic: "متجر", english: "Store", pronunciation: "ma-a-za",
      example: "En yakın mağaza nerede?", exampleArabic: "أين أقرب متجر؟",
      icon: "fas fa-store", emoji: "🏪" }
  ],
  directions: [
    { id: 25, turkish: "Nerede?", arabic: "أين؟", english: "Where?", pronunciation: "ne-re-DE",
      example: "Tuvalet nerede?", exampleArabic: "أين دورة المياه؟",
      icon: "fas fa-map-marker-alt", emoji: "📍" },
    { id: 26, turkish: "Sağ", arabic: "يمين", english: "Right", pronunciation: "SA",
      example: "Sağa dönün.", exampleArabic: "انعطفوا يميناً.",
      icon: "fas fa-arrow-right", emoji: "➡️" },
    { id: 27, turkish: "Sol", arabic: "يسار", english: "Left", pronunciation: "SOL",
      example: "Sola git.", exampleArabic: "اذهب يساراً.",
      icon: "fas fa-arrow-left", emoji: "⬅️" },
    { id: 28, turkish: "İleri", arabic: "إلى الأمام", english: "Forward", pronunciation: "i-le-RI",
      example: "Düz ileri gidin.", exampleArabic: "اذهبوا مباشرة إلى الأمام.",
      icon: "fas fa-arrow-up", emoji: "⬆️" },
    { id: 29, turkish: "Geri", arabic: "إلى الوراء", english: "Back", pronunciation: "ge-RI",
      example: "Geri dönelim.", exampleArabic: "دعونا نعود إلى الوراء.",
      icon: "fas fa-arrow-down", emoji: "⬇️" },
    { id: 30, turkish: "Yakın", arabic: "قريب", english: "Close", pronunciation: "ya-KIN",
      example: "Burası çok yakın.", exampleArabic: "هذا المكان قريب جداً.",
      icon: "fas fa-map-pin", emoji: "📌" }
  ],
  emergency: [
    { id: 31, turkish: "Yardım!", arabic: "النجدة!", english: "Help!", pronunciation: "yar-DIM",
      example: "Yardım edin! Kayboldum.", exampleArabic: "ساعدوني! لقد تهت.",
      icon: "fas fa-exclamation-triangle", emoji: "🆘" },
    { id: 32, turkish: "Polis", arabic: "شرطة", english: "Police", pronunciation: "po-LIS",
      example: "Polisi çağırın.", exampleArabic: "اتصلوا بالشرطة.",
      icon: "fas fa-shield-alt", emoji: "👮" },
    { id: 33, turkish: "Doktor", arabic: "طبيب", english: "Doctor", pronunciation: "dok-TOR",
      example: "Doktora ihtiyacım var.", exampleArabic: "أحتاج إلى طبيب.",
      icon: "fas fa-user-md", emoji: "👨‍⚕️" },
    { id: 34, turkish: "Hastane", arabic: "مستشفى", english: "Hospital", pronunciation: "has-ta-NE",
      example: "En yakın hastane nerede?", exampleArabic: "أين أقرب مستشفى؟",
      icon: "fas fa-hospital", emoji: "🏥" },
    { id: 35, turkish: "Acil", arabic: "طوارئ", english: "Emergency", pronunciation: "a-JIL",
      example: "Bu acil durum!", exampleArabic: "هذه حالة طوارئ!",
      icon: "fas fa-ambulance", emoji: "🚨" },
    { id: 36, turkish: "Hasta", arabic: "مريض", english: "Sick", pronunciation: "has-TA",
      example: "Çok hastayım.", exampleArabic: "أنا مريض جداً.",
      icon: "fas fa-thermometer-half", emoji: "🤒" }
  ],
  time: [
    { id: 37, turkish: "Saat", arabic: "ساعة", english: "Hour/Clock", pronunciation: "sa-AT",
      example: "Saat kaç?", exampleArabic: "كم الساعة؟",
      icon: "fas fa-clock", emoji: "🕐" },
    { id: 38, turkish: "Gün", arabic: "يوم", english: "Day", pronunciation: "GÜN",
      example: "Güzel bir gün.", exampleArabic: "يوم جميل.",
      icon: "fas fa-calendar-day", emoji: "📅" },
    { id: 39, turkish: "Hafta", arabic: "أسبوع", english: "Week", pronunciation: "haf-TA",
      example: "Gelecek hafta döneceğim.", exampleArabic: "سأعود الأسبوع القادم.",
      icon: "fas fa-calendar-week", emoji: "📆" },
    { id: 40, turkish: "Ay", arabic: "شهر", english: "Month", pronunciation: "AY",
      example: "Bu ay çok meşgulüm.", exampleArabic: "أنا مشغول جداً هذا الشهر.",
      icon: "fas fa-calendar-alt", emoji: "🗓️" },
    { id: 41, turkish: "Yıl", arabic: "سنة", english: "Year", pronunciation: "YIL",
      example: "Bu yıl Türkiye'ye gideceğim.", exampleArabic: "سأذهب إلى تركيا هذا العام.",
      icon: "fas fa-calendar", emoji: "📅" },
    { id: 42, turkish: "Bugün", arabic: "اليوم", english: "Today", pronunciation: "bu-GÜN",
      example: "Bugün çok yorgunum.", exampleArabic: "أنا متعب جداً اليوم.",
      icon: "fas fa-calendar-check", emoji: "📅" }
  ],
  numbers: [
    { id: 43, turkish: "Bir", arabic: "واحد", english: "One", pronunciation: "BIR",
      example: "Bir çay lütfen.", exampleArabic: "شاي واحد من فضلك.",
      icon: "fas fa-dice-one", emoji: "1️⃣" },
    { id: 44, turkish: "İki", arabic: "اثنان", english: "Two", pronunciation: "i-KI",
      example: "İki bilet istiyorum.", exampleArabic: "أريد تذكرتين.",
      icon: "fas fa-dice-two", emoji: "2️⃣" },
    { id: 45, turkish: "Üç", arabic: "ثلاثة", english: "Three", pronunciation: "ÜCH",
      example: "Üç gün kalacağım.", exampleArabic: "سأمكث لثلاثة أيام.",
      icon: "fas fa-dice-three", emoji: "3️⃣" },
    { id: 46, turkish: "Dört", arabic: "أربعة", english: "Four", pronunciation: "DÖRT",
      example: "Dört kişiyiz.", exampleArabic: "نحن أربعة أشخاص.",
      icon: "fas fa-dice-four", emoji: "4️⃣" },
    { id: 47, turkish: "Beş", arabic: "خمسة", english: "Five", pronunciation: "BESH",
      example: "Beş dakika bekleyin.", exampleArabic: "انتظروا خمس دقائق.",
      icon: "fas fa-dice-five", emoji: "5️⃣" },
    { id: 48, turkish: "On", arabic: "عشرة", english: "Ten", pronunciation: "ON",
      example: "On lira ödedim.", exampleArabic: "دفعت عشر ليرات.",
      icon: "fas fa-sort-numeric-up", emoji: "🔟" }
  ]
};

// Get all categories (enhanced with Excel data)
app.get('/api/categories', (c) => {
  // New categories from Excel file with 31 comprehensive categories
  const enhancedCategories = [
    { id: 'adjective', name: 'Adjective', nameArabic: 'الصفات', wordCount: 77, sessionCount: 8, icon: '📝' },
    { id: 'animal', name: 'Animal', nameArabic: 'الحيوانات', wordCount: 54, sessionCount: 6, icon: '🐾' },
    { id: 'body', name: 'Body', nameArabic: 'أجزاء الجسم', wordCount: 78, sessionCount: 8, icon: '👤' },
    { id: 'clothes', name: 'Clothes', nameArabic: 'الملابس', wordCount: 20, sessionCount: 2, icon: '👕' },
    { id: 'color', name: 'Color', nameArabic: 'الألوان', wordCount: 18, sessionCount: 2, icon: '🎨' },
    { id: 'direction', name: 'Direction', nameArabic: 'الاتجاهات', wordCount: 3, sessionCount: 1, icon: '🧭' },
    { id: 'emotion', name: 'Emotion', nameArabic: 'المشاعر', wordCount: 14, sessionCount: 2, icon: '😊' },
    { id: 'family', name: 'Family', nameArabic: 'العائلة', wordCount: 73, sessionCount: 8, icon: '👨‍👩‍👧‍👦' },
    { id: 'finance', name: 'Finance', nameArabic: 'المالية', wordCount: 22, sessionCount: 3, icon: '💰' },
    { id: 'food', name: 'Food', nameArabic: 'الطعام', wordCount: 113, sessionCount: 12, icon: '🍽️' },
    { id: 'general', name: 'General', nameArabic: 'عام', wordCount: 9, sessionCount: 1, icon: '📚' },
    { id: 'health', name: 'Health', nameArabic: 'الصحة', wordCount: 38, sessionCount: 4, icon: '🏥' },
    { id: 'house', name: 'House', nameArabic: 'المنزل', wordCount: 76, sessionCount: 8, icon: '🏠' },
    { id: 'instrument', name: 'Instrument', nameArabic: 'الآلات', wordCount: 7, sessionCount: 1, icon: '🎻' },
    { id: 'measurement', name: 'Measurement', nameArabic: 'القياس', wordCount: 24, sessionCount: 3, icon: '📏' },
    { id: 'music', name: 'Music', nameArabic: 'الموسيقى', wordCount: 12, sessionCount: 2, icon: '🎵' },
    { id: 'nature', name: 'Nature', nameArabic: 'الطبيعة', wordCount: 37, sessionCount: 4, icon: '🌿' },
    { id: 'number', name: 'Number', nameArabic: 'الأرقام', wordCount: 20, sessionCount: 2, icon: '🔢' },
    { id: 'place', name: 'Place', nameArabic: 'الأماكن', wordCount: 37, sessionCount: 4, icon: '📍' },
    { id: 'plant', name: 'Plant', nameArabic: 'النباتات', wordCount: 6, sessionCount: 1, icon: '🌱' },
    { id: 'pronoun', name: 'Pronoun', nameArabic: 'الضمائر', wordCount: 3, sessionCount: 1, icon: '👆' },
    { id: 'religion', name: 'Religion', nameArabic: 'الدين', wordCount: 5, sessionCount: 1, icon: '🕌' },
    { id: 'school', name: 'School', nameArabic: 'المدرسة', wordCount: 55, sessionCount: 6, icon: '🎓' },
    { id: 'science', name: 'Science', nameArabic: 'العلوم', wordCount: 66, sessionCount: 7, icon: '🔬' },
    { id: 'sport', name: 'Sport', nameArabic: 'الرياضة', wordCount: 16, sessionCount: 2, icon: '⚽' },
    { id: 'technology', name: 'Technology', nameArabic: 'التكنولوجيا', wordCount: 36, sessionCount: 4, icon: '📱' },
    { id: 'time', name: 'Time', nameArabic: 'الوقت', wordCount: 54, sessionCount: 6, icon: '⏰' },
    { id: 'travel', name: 'Travel', nameArabic: 'السفر', wordCount: 46, sessionCount: 5, icon: '✈️' },
    { id: 'verb', name: 'Verb', nameArabic: 'الأفعال', wordCount: 43, sessionCount: 5, icon: '🎯' },
    { id: 'weather', name: 'Weather', nameArabic: 'الطقس', wordCount: 13, sessionCount: 2, icon: '🌤️' },
    { id: 'work', name: 'Work', nameArabic: 'العمل', wordCount: 51, sessionCount: 6, icon: '💼' }
  ];
  
  return c.json({ categories: enhancedCategories, totalSessions: 127 });
});

// Get words by category (enhanced database with sessions)
app.get('/api/words/:category', (c) => {
  const category = c.req.param('category');
  
  return c.json({ 
    category,
    message: 'Words and sessions will be loaded from enhanced database client-side',
    enhanced: true,
    sessionBased: true,
    wordsPerSession: 10
  });
});

// Get sessions by category
app.get('/api/sessions/:category', (c) => {
  const category = c.req.param('category');
  
  return c.json({
    category,
    message: 'Sessions will be loaded from enhanced database client-side via SessionManager',
    sessionBased: true,
    wordsPerSession: 10
  });
});

// Get specific session details
app.get('/api/session/:sessionId', (c) => {
  const sessionId = c.req.param('sessionId');
  
  return c.json({
    sessionId,
    message: 'Session details available via client-side SessionManager.getSessionById()',
    enhanced: true
  });
});

// Get all words (Excel database metadata)
app.get('/api/words', (c) => {
  return c.json({ 
    enhanced: true,
    message: 'Enhanced vocabulary database from Excel file available client-side',
    total: 1126, // From Excel database
    categories: 31,
    sessions: 127,
    source: 'Turkish_Language_Data_categorized_final.xlsx'
  });
});

// Get random words for review (enhanced database client-side)
app.get('/api/words/random/:count', (c) => {
  const count = parseInt(c.req.param('count')) || 10;
  
  return c.json({ 
    enhanced: true,
    message: 'Random words will be selected from enhanced database client-side',
    requested: count,
    availableWords: 1194
  });
});

// Get user progress (Excel database with sessions)
app.get('/api/user/progress', (c) => {
  return c.json({
    totalWords: 1126, // Excel database total
    totalSessions: 127,
    learnedWords: 0,
    completedSessions: 0,
    currentLevel: 1,
    xp: 0,
    streak: 0,
    reviewsToday: 0,
    sessionBased: true,
    wordsPerSession: 10,
    categories: [
      { id: 'food', name: 'Food', sessionsCompleted: 0, totalSessions: 12, progress: 0 },
      { id: 'body', name: 'Body', sessionsCompleted: 0, totalSessions: 8, progress: 0 },
      { id: 'adjective', name: 'Adjective', sessionsCompleted: 0, totalSessions: 8, progress: 0 },
      { id: 'house', name: 'House', sessionsCompleted: 0, totalSessions: 8, progress: 0 },
      { id: 'family', name: 'Family', sessionsCompleted: 0, totalSessions: 8, progress: 0 },
      { id: 'science', name: 'Science', sessionsCompleted: 0, totalSessions: 7, progress: 0 },
      { id: 'school', name: 'School', sessionsCompleted: 0, totalSessions: 6, progress: 0 },
      { id: 'animal', name: 'Animal', sessionsCompleted: 0, totalSessions: 6, progress: 0 },
      { id: 'time', name: 'Time', sessionsCompleted: 0, totalSessions: 6, progress: 0 },
      { id: 'work', name: 'Work', sessionsCompleted: 0, totalSessions: 6, progress: 0 },
      { id: 'travel', name: 'Travel', sessionsCompleted: 0, totalSessions: 5, progress: 0 },
      { id: 'verb', name: 'Verb', sessionsCompleted: 0, totalSessions: 5, progress: 0 }
    ]
  });
});

// Update user progress (demo endpoint)
app.post('/api/user/progress', async (c) => {
  const body = await c.req.json();
  
  return c.json({
    success: true,
    message: "Progress updated successfully",
    data: body
  });
});

// 📚 Enhanced Content & Learning API Endpoints

// Get phrases by category
app.get('/api/phrases/:category', (c) => {
  const category = c.req.param('category');
  const phrases = {
    daily: {
      title: "Daily Phrases",
      titleArabic: "العبارات اليومية",
      difficulty: "beginner",
      phrases: [
        {
          id: 1, turkish: "Nasıl gidiyor?", arabic: "كيف تسير الأمور؟", 
          english: "How's it going?", pronunciation: "na-sıl gi-di-yor",
          usage: "Casual greeting between friends",
          culturalNote: "More casual than 'Nasılsınız?' - shows familiarity",
          examples: [
            { sentence: "Selam! Nasıl gidiyor işler?", arabic: "مرحباً! كيف تسير الأعمال؟" },
            { sentence: "Nasıl gidiyor okul?", arabic: "كيف تسير المدرسة؟" }
          ]
        },
        {
          id: 2, turkish: "Çok güzel!", arabic: "جميل جداً!", 
          english: "Very beautiful/nice!", pronunciation: "chok gü-zel",
          usage: "Expressing admiration or approval",
          culturalNote: "Universal positive expression, very commonly used",
          examples: [
            { sentence: "Bu manzara çok güzel!", arabic: "هذا المنظر جميل جداً!" },
            { sentence: "Yemeğin çok güzel!", arabic: "الطعام لذيذ جداً!" }
          ]
        }
      ]
    },
    restaurant: {
      title: "Restaurant Phrases",
      titleArabic: "عبارات المطعم",
      difficulty: "intermediate",
      phrases: [
        {
          id: 10, turkish: "Hesap, lütfen", arabic: "الحساب، من فضلك", 
          english: "The bill, please", pronunciation: "he-sap lüt-fen",
          usage: "Requesting the check at restaurants",
          culturalNote: "Polite way to ask for bill. Tipping 10-15% is customary",
          examples: [
            { sentence: "Afedersiniz, hesap lütfen.", arabic: "عذراً، الحساب من فضلك." },
            { sentence: "Hesabı ayırabilir misiniz?", arabic: "هل يمكنكم تقسيم الحساب؟" }
          ]
        }
      ]
    }
  };
  
  const categoryPhrases = phrases[category];
  if (!categoryPhrases) {
    return c.json({ error: "Category not found" }, 404);
  }
  
  return c.json(categoryPhrases);
});

// Get all phrase categories
app.get('/api/phrases', (c) => {
  const categories = [
    { id: 'daily', name: 'Daily Phrases', nameArabic: 'العبارات اليومية', difficulty: 'beginner', count: 2 },
    { id: 'restaurant', name: 'Restaurant Phrases', nameArabic: 'عبارات المطعم', difficulty: 'intermediate', count: 1 },
    { id: 'shopping', name: 'Shopping Phrases', nameArabic: 'عبارات التسوق', difficulty: 'intermediate', count: 1 },
    { id: 'advanced', name: 'Advanced Expressions', nameArabic: 'التعبيرات المتقدمة', difficulty: 'advanced', count: 1 }
  ];
  
  return c.json({ categories });
});

// Get conversation practice dialogues
app.get('/api/conversations/:type', (c) => {
  const type = c.req.param('type');
  
  const conversations = {
    hotel: {
      title: "Hotel Check-in",
      titleArabic: "تسجيل الدخول في الفندق",
      difficulty: "intermediate",
      participants: ["Guest", "Receptionist"],
      dialogue: [
        {
          speaker: "Guest",
          turkish: "Merhaba, rezervasyonum var.",
          arabic: "مرحباً، لدي حجز.",
          english: "Hello, I have a reservation.",
          pronunciation: "mer-ha-BA, re-zer-vas-yo-NUM var"
        },
        {
          speaker: "Receptionist", 
          turkish: "Tabii efendim, adınız nedir?",
          arabic: "بالطبع سيدي، ما اسمك؟",
          english: "Of course sir, what is your name?",
          pronunciation: "ta-BII e-fen-DIM, a-dı-NıZ ne-DIR"
        },
        {
          speaker: "Guest",
          turkish: "Benim adım Ahmed Hassan.",
          arabic: "اسمي أحمد حسن.",
          english: "My name is Ahmed Hassan.",
          pronunciation: "be-NIM a-DıM ah-MED has-SAN"
        }
      ],
      keyPhrases: [
        { turkish: "Rezervasyonum var", arabic: "لدي حجز", english: "I have a reservation" },
        { turkish: "Adınız nedir?", arabic: "ما اسمك؟", english: "What is your name?" },
        { turkish: "Oda anahtarı", arabic: "مفتاح الغرفة", english: "Room key" }
      ]
    },
    restaurant: {
      title: "Ordering Food",
      titleArabic: "طلب الطعام", 
      difficulty: "beginner",
      participants: ["Customer", "Waiter"],
      dialogue: [
        {
          speaker: "Waiter",
          turkish: "Hoş geldiniz! Ne istiyorsunuz?",
          arabic: "أهلاً وسهلاً! ماذا تريدون؟",
          english: "Welcome! What would you like?",
          pronunciation: "HOSH gel-di-NIZ! ne is-ti-yor-su-NUZ"
        },
        {
          speaker: "Customer",
          turkish: "Menüyü görebilir miyim?",
          arabic: "هل يمكنني رؤية القائمة؟",
          english: "Can I see the menu?",
          pronunciation: "me-NÜ-yü gö-re-bi-LIR mi-YIM"
        }
      ]
    },
    taxi: {
      title: "Taking a Taxi",
      titleArabic: "ركوب التاكسي",
      difficulty: "beginner", 
      participants: ["Passenger", "Driver"],
      dialogue: [
        {
          speaker: "Passenger",
          turkish: "Havaalanına gitmek istiyorum.",
          arabic: "أريد الذهاب إلى المطار.",
          english: "I want to go to the airport.",
          pronunciation: "ha-va-a-la-Nı-NA git-MEK is-ti-yo-RUM"
        },
        {
          speaker: "Driver",
          turkish: "Tabii, ne kadar sürer?",
          arabic: "بالطبع، كم يستغرق؟",
          english: "Sure, how long does it take?",
          pronunciation: "ta-BII, ne ka-DAR sü-RER"
        }
      ]
    }
  };
  
  const conversation = conversations[type];
  if (!conversation) {
    return c.json({ error: "Conversation type not found" }, 404);
  }
  
  return c.json(conversation);
});

// Get all conversation types
app.get('/api/conversations', (c) => {
  const types = [
    { id: 'hotel', name: 'Hotel Check-in', nameArabic: 'تسجيل الدخول في الفندق', difficulty: 'intermediate' },
    { id: 'restaurant', name: 'Ordering Food', nameArabic: 'طلب الطعام', difficulty: 'beginner' },
    { id: 'taxi', name: 'Taking a Taxi', nameArabic: 'ركوب التاكسي', difficulty: 'beginner' },
    { id: 'shopping', name: 'Shopping', nameArabic: 'التسوق', difficulty: 'intermediate' },
    { id: 'directions', name: 'Asking for Directions', nameArabic: 'السؤال عن الاتجاهات', difficulty: 'intermediate' }
  ];
  
  return c.json({ conversations: types });
});

// Daily Turkish tip endpoint
app.get('/api/daily-tip', (c) => {
  const tips = [
    {
      id: 1,
      category: "pronunciation",
      turkish: "Türkçede 'ğ' harfi sessizdir ve öncesindeki sesliyi uzatır.",
      arabic: "في التركية، حرف 'ğ' صامت ويطيل الحرف المتحرك الذي يسبقه.",
      english: "In Turkish, the letter 'ğ' is silent and lengthens the preceding vowel.",
      example: "dağ (mountain) - pronounced like 'da:'"
    },
    {
      id: 2,
      category: "grammar",
      turkish: "Türkçede fiiller cümlenin sonunda gelir.",
      arabic: "في التركية، الأفعال تأتي في نهاية الجملة.",
      english: "In Turkish, verbs come at the end of the sentence.",
      example: "Ben okula gidiyorum (I am going to school)"
    },
    {
      id: 3,
      category: "culture",
      turkish: "Türkiye'de çay kültürü çok önemlidir. Misafirlere her zaman çay ikram edilir.",
      arabic: "في تركيا، ثقافة الشاي مهمة جداً. يُقدم الشاي دائماً للضيوف.",
      english: "In Turkey, tea culture is very important. Tea is always offered to guests.",
      example: "Çay içer misiniz? (Would you like some tea?)"
    },
    {
      id: 4,
      category: "vocabulary",
      turkish: "Birçok Türkçe kelime Arapça kökenlidir.",
      arabic: "العديد من الكلمات التركية لها أصول عربية.",
      english: "Many Turkish words have Arabic origins.",
      example: "kitap (book) from Arabic 'kitāb'"
    }
  ];
  
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const tipIndex = dayOfYear % tips.length;
  
  return c.json({ tip: tips[tipIndex], date: today.toISOString().split('T')[0] });
});

// Get enhanced word with cultural context and examples
app.get('/api/enhanced-word/:id', (c) => {
  const wordId = parseInt(c.req.param('id'));
  
  // Enhanced vocabulary with additional features
  const enhancedWords = {
    1: {
      id: 1, turkish: "Merhaba", arabic: "مرحبا", english: "Hello", 
      pronunciation: "mer-ha-BA", difficulty: "beginner",
      examples: [
        { sentence: "Merhaba, nasılsınız?", arabic: "مرحبا، كيف حالك؟", context: "formal" },
        { sentence: "Merhaba arkadaşlar!", arabic: "مرحبا أيها الأصدقاء!", context: "informal" },
        { sentence: "Merhaba, benim adım Ali.", arabic: "مرحبا، اسمي علي.", context: "introduction" }
      ],
      culturalNote: "Used at any time of day. More casual than 'Selam'.",
      regionalVariations: [
        { region: "Istanbul", variant: "Merhaba", usage: "Standard" },
        { region: "Ankara", variant: "Selam", usage: "More common in capital" },
        { region: "Izmir", variant: "Merhaba canım", usage: "Warmer, friendly" }
      ],
      icon: "fas fa-hand-wave", emoji: "👋"
    }
  };
  
  const word = enhancedWords[wordId];
  if (!word) {
    return c.json({ error: "Word not found" }, 404);
  }
  
  return c.json(word);
});

// Get content statistics (Excel database with sessions)
app.get('/api/content-stats', (c) => {
  const stats = {
    totalWords: 1126,
    totalSessions: 127,
    totalCategories: 31,
    wordsPerSession: 10,
    totalPhrases: 5,
    byDifficulty: {
      A1: 295,
      A2: 355,
      B1: 234,
      B2: 186,
      C1: 51,
      C2: 5
    },
    categories: {
      words: 31,
      phrases: 4,
      sessions: 127
    },
    features: {
      sessionBasedLearning: true,
      progressiveDifficulty: true,
      vowelHarmonyRules: 1126,
      difficultyLevels: 1126,
      multipleExamples: 1126,
      arabicTranslations: 1126,
      turkishExamples: 1126,
      arabicSentences: 1126,
      turkishSentences: 1126,
      semanticCategorization: true,
      enhancedMetadata: true,
      excelBasedData: true
    },
    sessionBreakdown: {
      'food': 12,
      'body': 8,
      'adjective': 8,
      'house': 8,
      'family': 8,
      'science': 7,
      'school': 6,
      'animal': 6,
      'time': 6,
      'work': 6
    },
    source: 'Turkish_Language_Data_categorized_final.xlsx - Comprehensive Excel Database'
  };
  
  return c.json(stats);
});

// Filter content by difficulty
app.get('/api/content/difficulty/:level', (c) => {
  const level = c.req.param('level');
  
  // This would filter vocabulary based on difficulty level
  const filteredCategories = Object.keys(vocabulary).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    wordCount: vocabulary[key].length, // In real app, filter by difficulty
    difficulty: level,
    icon: getCategoryIcon(key)
  }));
  
  return c.json({ 
    categories: filteredCategories,
    difficulty: level,
    total: filteredCategories.reduce((sum, cat) => sum + cat.wordCount, 0)
  });
});

function getCategoryIcon(category: string): string {
  const icons = {
    greetings: "👋",
    travel: "✈️",
    food: "🍽️",
    shopping: "🛒",
    directions: "🧭",
    emergency: "🚨",
    time: "⏰",
    numbers: "🔢",
    general: "📚"
  };
  
  return icons[category] || "📚";
}

// Main app route with complete Turkish learning interface
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تعلم التركية - Turkish Learning</title>
        
        <!-- Favicon -->
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🇹🇷</text></svg>">
        
        <!-- External Libraries -->
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js"></script>
        
        <!-- Custom Styles -->
        <link href="/static/styles-modern.css" rel="stylesheet">
        <link href="/static/visual-ux-enhancements.css" rel="stylesheet">
        <link href="/static/enhanced-content-styles.css" rel="stylesheet">
        <link href="/static/flashcard-mode.css" rel="stylesheet">
        <link href="/static/quiz-mode.css" rel="stylesheet">
        <link href="/static/phrase-mode.css" rel="stylesheet">
        <link href="/static/session-management.css" rel="stylesheet">
        <link href="/static/enhanced-learning-interface.css" rel="stylesheet">
        
        <!-- PWA Meta Tags -->
        <meta name="theme-color" content="#2563EB">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="تعلم التركية">
        
        <!-- CRITICAL UI FIXES - INLINE STYLES FOR IMMEDIATE APPLICATION -->
        <style>
        /* FORCE HORIZONTAL DIFFICULTY BUTTONS */
        .difficulty-buttons {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            gap: 12px !important;
            flex-wrap: wrap !important;
            align-items: stretch !important;
        }
        
        .btn-difficulty {
            display: flex !important;
            flex-direction: column !important;
            flex: 1 !important;
            min-width: 85px !important;
            max-width: 120px !important;
            min-height: 80px !important;
            align-items: center !important;
            justify-content: center !important;
        }
        
        /* MOBILE RESPONSIVE - KEEP HORIZONTAL */
        @media (max-width: 768px) {
            .difficulty-buttons {
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                gap: 8px !important;
            }
            
            .btn-difficulty {
                min-width: 70px !important;
                max-width: 85px !important;
                flex: 1 !important;
            }
        }
        
        /* NAVIGATION BUTTONS - SAME STYLE AS DIFFICULTY BUTTONS */
        .flashcard-controls {
            display: flex !important;
            justify-content: center !important;
            gap: 12px !important;
        }
        
        .flashcard-controls .btn-flashcard-control {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            min-width: 80px !important;
            min-height: 75px !important;
            border: 3px solid #E5E7EB !important;
            border-radius: 16px !important;
            background: #ffffff !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
            font-size: 12px !important;
            gap: 6px !important;
        }
        
        .flashcard-controls .btn-flashcard-control:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        .flashcard-controls .btn-flashcard-control i {
            font-size: 18px !important;
        }
        </style>
        
        <!-- Configure Tailwind for RTL -->
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        fontFamily: {
                            'arabic': ['Noto Sans Arabic', 'Arial', 'sans-serif'],
                            'turkish': ['Inter', 'system-ui', 'sans-serif']
                        }
                    }
                }
            }
        </script>
    </head>
    <body class="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100">
        <!-- Loading Screen -->
        <div id="loading-screen" class="loading-screen">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h2 class="loading-title">تعلم التركية</h2>
                <p class="loading-subtitle">Turkish Learning Platform</p>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="nav-container">
            <div class="nav-content">
                <div class="nav-brand">
                    <span class="nav-icon">🇹🇷</span>
                    <span class="nav-title">تعلم التركية</span>
                </div>
                
                <div class="nav-links flex">
                    <button class="nav-link active" data-section="dashboard">
                        <i class="fas fa-home"></i>
                        الرئيسية
                    </button>
                    
                    <!-- Learning Dropdown Menu -->
                    <div class="nav-dropdown">
                        <button class="nav-link nav-dropdown-btn">
                            <i class="fas fa-graduation-cap"></i>
                            تعلم
                            <i class="fas fa-chevron-down nav-dropdown-arrow"></i>
                        </button>
                        <div class="nav-dropdown-menu">
                            <button class="nav-dropdown-item" onclick="window.showSection('learn')">
                                <i class="fas fa-play-circle"></i>
                                بدء التعلم
                            </button>
                            <div class="nav-dropdown-divider"></div>
                            <button class="nav-dropdown-item" onclick="window.startQuickLearn('greetings')">
                                👋 التحيات
                            </button>
                            <button class="nav-dropdown-item" onclick="window.startQuickLearn('travel')">
                                ✈️ السفر
                            </button>
                            <button class="nav-dropdown-item" onclick="window.startQuickLearn('food')">
                                🍽️ الطعام
                            </button>
                            <button class="nav-dropdown-item" onclick="window.startQuickLearn('shopping')">
                                🛒 التسوق
                            </button>
                            <button class="nav-dropdown-item" onclick="window.startQuickLearn('directions')">
                                🧭 الاتجاهات
                            </button>
                            <button class="nav-dropdown-item" onclick="window.startQuickLearn('emergency')">
                                🚨 الطوارئ
                            </button>
                            <button class="nav-dropdown-item" onclick="window.startQuickLearn('time')">
                                ⏰ الوقت
                            </button>
                            <button class="nav-dropdown-item" onclick="window.startQuickLearn('numbers')">
                                🔢 الأرقام
                            </button>
                        </div>
                    </div>
                    
                    <button class="nav-link" data-section="review">
                        <i class="fas fa-repeat"></i>
                        مراجعة
                    </button>
                    <button class="nav-link" data-section="conversation">
                        <i class="fas fa-comments"></i>
                        محادثة
                    </button>
                    <button class="nav-link" data-section="phrase">
                        <i class="fas fa-quote-left"></i>
                        العبارات
                    </button>
                    <button class="nav-link" data-section="profile">
                        <i class="fas fa-user-circle"></i>
                        الملف الشخصي
                    </button>
                </div>
                
                <button class="mobile-menu-btn hidden">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
            
            <!-- Mobile Menu -->
            <div class="mobile-menu">
                <button class="mobile-nav-link active" data-section="dashboard">
                    <i class="fas fa-home"></i>
                    <span>الرئيسية</span>
                </button>
                <button class="mobile-nav-link" data-section="learn">
                    <i class="fas fa-graduation-cap"></i>
                    <span>تعلم</span>
                </button>
                <button class="mobile-nav-link" data-section="review">
                    <i class="fas fa-repeat"></i>
                    <span>مراجعة</span>
                </button>
                <button class="mobile-nav-link" data-section="conversation">
                    <i class="fas fa-comments"></i>
                    <span>محادثة</span>
                </button>
                <button class="mobile-nav-link" data-section="profile">
                    <i class="fas fa-user-circle"></i>
                    <span>الملف الشخصي</span>
                </button>
                
                <!-- Mobile Category Quick Access -->
                <div class="mobile-category-divider">
                    <span>الفئات السريعة</span>
                </div>
                <button class="mobile-nav-link mobile-category-link" onclick="window.startQuickLearn('greetings')">
                    <span>👋 التحيات</span>
                </button>
                <button class="mobile-nav-link mobile-category-link" onclick="window.startQuickLearn('travel')">
                    <span>✈️ السفر</span>
                </button>
                <button class="mobile-nav-link mobile-category-link" onclick="window.startQuickLearn('food')">
                    <span>🍽️ الطعام</span>
                </button>
                <button class="mobile-nav-link mobile-category-link" onclick="window.startQuickLearn('shopping')">
                    <span>🛒 التسوق</span>
                </button>
                <button class="mobile-nav-link mobile-category-link" onclick="window.startQuickLearn('directions')">
                    <span>🧭 الاتجاهات</span>
                </button>
                <button class="mobile-nav-link mobile-category-link" onclick="window.startQuickLearn('emergency')">
                    <span>🚨 الطوارئ</span>
                </button>
                <button class="mobile-nav-link mobile-category-link" onclick="window.startQuickLearn('time')">
                    <span>⏰ الوقت</span>
                </button>
                <button class="mobile-nav-link mobile-category-link" onclick="window.startQuickLearn('numbers')">
                    <span>🔢 الأرقام</span>
                </button>
            </div>
        </nav>

        <!-- Main Content -->
        <!-- Navigation Debug Panel (Hidden by default) -->
        <div id="nav-debug" style="position: fixed; top: 80px; left: 10px; z-index: 1000; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 8px; font-size: 12px; display: none;">
            <div style="margin-bottom: 8px; font-weight: bold;">Navigation Debug</div>
            <button onclick="window.forceNavigateTo('dashboard')" style="margin: 2px; padding: 4px 8px; font-size: 11px;">Home</button>
            <button onclick="window.forceNavigateTo('learn')" style="margin: 2px; padding: 4px 8px; font-size: 11px;">Learn</button>
            <button onclick="window.forceNavigateTo('review')" style="margin: 2px; padding: 4px 8px; font-size: 11px;">Review</button>
            <button onclick="window.forceNavigateTo('progress')" style="margin: 2px; padding: 4px 8px; font-size: 11px;">Progress</button>
            <br>
            <button onclick="document.getElementById('nav-debug').style.display='none'" style="margin-top: 5px; padding: 2px 6px; font-size: 10px;">Hide</button>
        </div>

        <main class="main-container">
            <!-- Dashboard Section -->
            <section id="dashboard-section" class="content-section active">
                <div class="welcome-card">
                    <div class="welcome-content">
                        <h1 class="welcome-title">الخبراء في تعلم اللغة التركية</h1>
                        <p class="welcome-subtitle">لأكثر من 30 عاماً، يتجه المتعلمون إلى منصتنا لبناء الطلاقة والثقة التي يحتاجونها للتحدث باللغة التركية</p>
                        
                        <div class="hero-actions" style="margin-top: 2rem;">
                            <button class="btn-start-learning" onclick="window.showSection('learn')">
                                ابدأ التعلم
                            </button>
                        </div>
                        
                        <div class="user-stats">
                            <div class="stat-item">
                                <div class="stat-icon">🏆</div>
                                <div class="stat-content">
                                    <div class="stat-value" id="user-xp">0</div>
                                    <div class="stat-label">نقاط الخبرة</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon">📚</div>
                                <div class="stat-content">
                                    <div class="stat-value" id="words-learned">0</div>
                                    <div class="stat-label">كلمة مُتعلمة</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon">🔥</div>
                                <div class="stat-content">
                                    <div class="stat-value" id="streak-days">0</div>
                                    <div class="stat-label">أيام متتالية</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="second-nature-section">
                    <h2 class="second-nature-title">من لغة ثانية إلى طبيعة ثانية</h2>
                    <p class="second-nature-subtitle">منصتنا تساعدك على استغلال قدرة عقلك الفطرية لتعلم اللغة التركية، وتمنحك الثقة للتحدث بطلاقة</p>
                </div>

                <div class="categories-grid" id="categories-container">
                    <!-- Categories will be loaded dynamically -->
                </div>
                
                <!-- Featured Learning Modes Section -->
                <div class="featured-modes-section">
                    <h3 class="featured-modes-title">أنماط التعلم المتاحة</h3>
                    <p class="featured-modes-subtitle">اختر النمط الذي يناسبك لتعلم اللغة التركية بطريقة تفاعلية وممتعة</p>
                    
                    <div class="featured-modes-grid">
                        <div class="featured-mode-card" data-mode="flashcard">
                            <div class="mode-icon">📱</div>
                            <h4 class="mode-title">البطاقات التعليمية</h4>
                            <p class="mode-description">تعلم الكلمات التفاعلية مع الأصوات والأمثلة</p>
                            <div class="mode-features">
                                <span class="feature-tag">🔊 نطق</span>
                                <span class="feature-tag">📝 أمثلة</span>
                                <span class="feature-tag">🎯 تفاعلي</span>
                            </div>
                        </div>
                        
                        <div class="featured-mode-card" data-mode="quiz">
                            <div class="mode-icon">🎯</div>
                            <h4 class="mode-title">الاختبار التفاعلي</h4>
                            <p class="mode-description">اختبر معرفتك بالكلمات مع خيارات متعددة</p>
                            <div class="mode-features">
                                <span class="feature-tag">🎮 تحدي</span>
                                <span class="feature-tag">📊 نتائج</span>
                                <span class="feature-tag">⏱️ سرعة</span>
                            </div>
                        </div>
                        
                        <div class="featured-mode-card" data-mode="phrase">
                            <div class="mode-icon">📝</div>
                            <h4 class="mode-title">العبارات والتعابير</h4>
                            <p class="mode-description">تعلم العبارات التركية الشائعة والمفيدة</p>
                            <div class="mode-features">
                                <span class="feature-tag">💬 محادثة</span>
                                <span class="feature-tag">🌍 سياق</span>
                                <span class="feature-tag">📚 أمثلة</span>
                            </div>
                        </div>
                        
                        <div class="featured-mode-card" data-mode="conversation">
                            <div class="mode-icon">💬</div>
                            <h4 class="mode-title">المحادثات التفاعلية</h4>
                            <p class="mode-description">تدرب على المحادثات التركية الحقيقية</p>
                            <div class="mode-features">
                                <span class="feature-tag">🗣️ حوار</span>
                                <span class="feature-tag">🎭 أدوار</span>
                                <span class="feature-tag">🌟 واقعي</span>
                            </div>
                        </div>
                        
                        <div class="featured-mode-card" data-mode="review">
                            <div class="mode-icon">🔄</div>
                            <h4 class="mode-title">المراجعة المتباعدة</h4>
                            <p class="mode-description">راجع الكلمات بنظام التكرار الذكي</p>
                            <div class="mode-features">
                                <span class="feature-tag">🧠 ذاكرة</span>
                                <span class="feature-tag">📈 تقدم</span>
                                <span class="feature-tag">⚡ فعال</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modes-cta">
                        <p class="modes-cta-text">لبدء التعلم، انتقل إلى قسم "تعلم" واختر الفئة والنمط المفضل لديك</p>
                        <button class="modes-cta-btn" onclick="TurkishLearningApp.showSection('learn')">
                            <i class="fas fa-play"></i>
                            ابدأ التعلم الآن
                        </button>
                    </div>
                </div>
            </section>

            <!-- Learning Section -->
            <section id="learn-section" class="content-section">
                <div class="section-header">
                    <h2 class="section-title">وضع التعلم</h2>
                    <p class="section-subtitle">تعلم كلمات جديدة مع الأمثلة والنطق</p>
                </div>
                
                <div id="learning-interface">
                    <div class="learning-controls">
                        <div class="controls-header">
                            <h3>إعدادات التعلم</h3>
                            <p class="controls-subtitle">اختر فئة ونمط التعلم المفضل لديك</p>
                        </div>
                        
                        <div class="controls-grid">
                            <div class="control-group">
                                <label for="category-select" class="control-label">
                                    <i class="fas fa-folder-open"></i>
                                    الفئة
                                </label>
                                <select id="category-select" class="control-select">
                                    <option value="">اختر فئة للتعلم...</option>
                                </select>
                            </div>
                            
                            <div class="control-group">
                                <label for="learning-mode" class="control-label">
                                    <i class="fas fa-graduation-cap"></i>
                                    نمط التعلم
                                </label>
                                <select id="learning-mode" class="control-select">
                                    <option value="flashcard">📱 بطاقات تعليمية - تعلم الكلمات التفاعلية مع الأصوات والأمثلة</option>
                                    <option value="quiz">🎯 اختبار تفاعلي - اختبر معرفتك بالكلمات مع خيارات متعددة</option>
                                    <option value="phrase">📝 العبارات والتعابير - تعلم العبارات التركية الشائعة والمفيدة</option>
                                    <option value="conversation">💬 محادثات تفاعلية - تدرب على المحادثات التركية الحقيقية</option>
                                    <option value="review">🔄 المراجعة المتباعدة - راجع الكلمات بنظام التكرار الذكي</option>
                                </select>
                                <div class="mode-info-tooltip">
                                    جميع أنماط التعلم متاحة: البطاقات، الاختبارات، العبارات، المحادثات، والمراجعة الذكية
                                </div>
                            </div>
                        </div>
                        
                        <div class="start-button-container">
                            <button id="start-learning" class="btn-primary btn-enhanced" disabled>
                                <i class="fas fa-play"></i>
                                ابدأ جلسة التعلم
                            </button>
                            <p class="start-help-text">اختر فئة ونمط التعلم لبدء الجلسة</p>
                        </div>
                    </div>
                    
                    <div id="learning-content" class="learning-session hidden">
                        <!-- Learning content will be inserted here -->
                    </div>
                </div>
            </section>

            <!-- Review Section -->
            <section id="review-section" class="content-section">
                <div class="section-header">
                    <h2 class="section-title">وضع المراجعة</h2>
                    <p class="section-subtitle">راجع الكلمات المُتعلمة باستخدام خوارزمية التكرار المتباعد</p>
                </div>
                
                <div id="review-interface">
                    <div class="review-stats" id="review-stats">
                        <div class="review-stat">
                            <div class="stat-number" id="review-total">0</div>
                            <div class="stat-label">للمراجعة اليوم</div>
                        </div>
                        <div class="review-stat">
                            <div class="stat-number" id="review-struggling">0</div>
                            <div class="stat-label">كلمات صعبة</div>
                        </div>
                        <div class="review-stat">
                            <div class="stat-number" id="review-maintenance">0</div>
                            <div class="stat-label">مراجعة دورية</div>
                        </div>
                    </div>
                    
                    <div class="review-controls">
                        <button id="start-review" class="btn-primary">ابدأ المراجعة</button>
                        <button id="review-all" class="btn-secondary">راجع الكل</button>
                    </div>
                    
                    <div id="review-content" class="review-session hidden">
                        <!-- Review content will be inserted here -->
                    </div>
                </div>
            </section>

            <!-- Conversation Practice Section -->
            <section id="conversation-section" class="content-section">
                <div class="section-header">
                    <h2 class="section-title">ممارسة المحادثة</h2>
                    <p class="section-subtitle">تعلم المحادثات التركية الشائعة في المواقف اليومية</p>
                    
                    <!-- Daily Turkish Tip -->
                    <div class="daily-tip-card" id="daily-tip-card">
                        <div class="daily-tip-header">
                            <i class="fas fa-lightbulb"></i>
                            <span class="daily-tip-title">نصيحة اليوم</span>
                            <span class="daily-tip-date" id="daily-tip-date"></span>
                        </div>
                        <div class="daily-tip-content" id="daily-tip-content">
                            <!-- Daily tip will be loaded here -->
                        </div>
                    </div>
                </div>
                
                <div id="conversation-interface">
                    <!-- Conversation Selection -->
                    <div class="conversation-selection">
                        <h3 class="conversation-selection-title">اختر موقف المحادثة</h3>
                        <div class="conversation-grid" id="conversation-types">
                            <!-- Conversation types will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Active Conversation -->
                    <div id="conversation-practice" class="conversation-practice hidden">
                        <div class="conversation-header">
                            <div class="conversation-info">
                                <h3 class="conversation-title" id="conversation-title"></h3>
                                <div class="conversation-meta">
                                    <span class="difficulty-badge" id="conversation-difficulty"></span>
                                    <span class="participants-info" id="conversation-participants"></span>
                                </div>
                            </div>
                            <button class="btn-back" onclick="window.showConversationSelection()">
                                <i class="fas fa-arrow-right"></i>
                                عودة
                            </button>
                        </div>
                        
                        <!-- Dialogue Display -->
                        <div class="dialogue-container" id="dialogue-container">
                            <!-- Dialogue will be displayed here -->
                        </div>
                        
                        <!-- Key Phrases -->
                        <div class="key-phrases-section" id="key-phrases-section">
                            <h4 class="key-phrases-title">العبارات المهمة</h4>
                            <div class="key-phrases-grid" id="key-phrases-grid">
                                <!-- Key phrases will be displayed here -->
                            </div>
                        </div>
                        
                        <!-- Practice Controls -->
                        <div class="practice-controls">
                            <button class="btn-practice" id="btn-practice-dialogue">
                                <i class="fas fa-microphone"></i>
                                تدرب على المحادثة
                            </button>
                            <button class="btn-practice" id="btn-listen-dialogue">
                                <i class="fas fa-volume-up"></i>
                                استمع للمحادثة كاملة
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Profile Section -->
            <section id="profile-section" class="content-section">
                <div class="section-header">
                    <h2 class="section-title">الملف الشخصي</h2>
                    <p class="section-subtitle">تتبع تقدمك وإنجازاتك في تعلم اللغة التركية</p>
                </div>
                
                <div class="profile-dashboard">
                    <!-- User Profile Card -->
                    <div class="profile-card">
                        <div class="profile-avatar">
                            <div class="avatar-circle">
                                <i class="fas fa-user-graduate"></i>
                            </div>
                            <div class="profile-level">
                                <span id="profile-level">المستوى 1</span>
                            </div>
                        </div>
                        <div class="profile-info">
                            <h3 class="profile-name">متعلم التركية</h3>
                            <p class="profile-title">مبتدئ</p>
                            <div class="profile-stats-mini">
                                <div class="stat-mini">
                                    <span id="profile-xp-display">0</span>
                                    <label>نقطة خبرة</label>
                                </div>
                                <div class="stat-mini">
                                    <span id="profile-words-display">0</span>
                                    <label>كلمة مُتعلمة</label>
                                </div>
                                <div class="stat-mini">
                                    <span id="profile-streak-display">0</span>
                                    <label>يوم متتالي</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Progress Overview -->
                    <div class="progress-overview">
                        <div class="progress-card">
                            <h3 class="progress-card-title">إجمالي التقدم</h3>
                            <div class="progress-circle">
                                <div class="progress-text">
                                    <span id="overall-progress">0%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="progress-card">
                            <h3 class="progress-card-title">إنجازات اليوم</h3>
                            <div class="achievement-list" id="daily-achievements">
                                <div class="achievement-item">
                                    <i class="fas fa-clock text-blue-500"></i>
                                    <span>لم تبدأ بعد</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Enhanced Gamification System -->
                    <div class="gamification-section">
                        <h3 class="gamification-title">🎮 نظام المكافآت والتحديات</h3>
                        
                        <!-- Daily Challenges -->
                        <div class="challenges-container">
                            <div class="challenges-card">
                                <h4 class="challenges-card-title">
                                    <i class="fas fa-calendar-day"></i>
                                    التحديات اليومية
                                    <span class="streak-multiplier" id="streak-multiplier" style="display: none;">2x نقاط!</span>
                                </h4>
                                <div class="daily-challenges" id="daily-challenges">
                                    <!-- Daily challenges will be generated here -->
                                </div>
                            </div>
                            
                            <!-- Weekly Competition -->
                            <div class="challenges-card">
                                <h4 class="challenges-card-title">
                                    <i class="fas fa-trophy"></i>
                                    المنافسة الأسبوعية
                                </h4>
                                <div class="weekly-leaderboard" id="weekly-leaderboard">
                                    <div class="leaderboard-item self">
                                        <div class="rank">#<span id="user-rank">--</span></div>
                                        <div class="player-info">
                                            <div class="player-name">أنت</div>
                                            <div class="player-score"><span id="user-weekly-score">0</span> نقطة</div>
                                        </div>
                                        <div class="player-badge">🎯</div>
                                    </div>
                                    <div class="leaderboard-others" id="leaderboard-others">
                                        <!-- Other players will be generated here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Achievement Chains -->
                        <div class="achievement-chains">
                            <h4 class="achievement-chains-title">سلاسل الإنجازات</h4>
                            <div class="achievement-chains-grid" id="achievement-chains">
                                <!-- Achievement chains will be generated here -->
                            </div>
                        </div>
                        
                        <!-- Unlockable Themes -->
                        <div class="themes-section">
                            <h4 class="themes-title">الثيمات المتاحة</h4>
                            <div class="themes-grid" id="unlockable-themes">
                                <!-- Unlockable themes will be generated here -->
                            </div>
                        </div>
                        
                        <!-- Classic Achievements & Badges -->
                        <div class="achievements-section">
                            <h4 class="achievements-title">الإنجازات الأساسية</h4>
                            <div class="achievements-grid" id="achievements-grid">
                                <div class="achievement-badge locked" data-achievement="first-word">
                                    <div class="badge-icon">🎯</div>
                                    <div class="badge-name">أول كلمة</div>
                                    <div class="badge-description">تعلم أول كلمة تركية</div>
                                </div>
                                <div class="achievement-badge locked" data-achievement="streak-7">
                                    <div class="badge-icon">🔥</div>
                                    <div class="badge-name">أسبوع كامل</div>
                                    <div class="badge-description">7 أيام متتالية من التعلم</div>
                                </div>
                                <div class="achievement-badge locked" data-achievement="category-complete">
                                    <div class="badge-icon">⭐</div>
                                    <div class="badge-name">إكمال فئة</div>
                                    <div class="badge-description">إكمال فئة كاملة من المفردات</div>
                                </div>
                                <div class="achievement-badge locked" data-achievement="review-master">
                                    <div class="badge-icon">🏆</div>
                                    <div class="badge-name">خبير المراجعة</div>
                                    <div class="badge-description">مراجعة 50 كلمة بنجاح</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Category Progress -->
                    <div class="category-progress-section">
                        <h3 class="category-progress-title">تقدم الفئات</h3>
                        <div class="category-progress" id="category-progress">
                            <!-- Category progress will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Learning Statistics -->
                    <div class="learning-stats">
                        <h3 class="stats-title">إحصائيات التعلم</h3>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon">📊</div>
                                <div class="stat-content">
                                    <div class="stat-number" id="total-sessions">0</div>
                                    <div class="stat-label">جلسات تعلم</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">⏱️</div>
                                <div class="stat-content">
                                    <div class="stat-number" id="total-time">0د</div>
                                    <div class="stat-label">وقت التعلم</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">✅</div>
                                <div class="stat-content">
                                    <div class="stat-number" id="accuracy-rate">0%</div>
                                    <div class="stat-label">معدل الدقة</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">🎯</div>
                                <div class="stat-content">
                                    <div class="stat-number" id="best-streak">0</div>
                                    <div class="stat-label">أفضل سلسلة</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Advanced Analytics Dashboard -->
                    <div class="analytics-dashboard">
                        <h3 class="analytics-title">لوحة التحليلات المتقدمة</h3>
                        
                        <!-- Learning Heatmap -->
                        <div class="analytics-section">
                            <div class="analytics-card">
                                <h4 class="analytics-card-title">
                                    <i class="fas fa-calendar-alt"></i>
                                    خريطة النشاط اليومي
                                </h4>
                                <p class="analytics-card-subtitle">تصور نشاط التعلم اليومي على مدار السنة</p>
                                <div class="heatmap-container" id="learning-heatmap">
                                    <!-- Heatmap will be generated here -->
                                </div>
                            </div>
                        </div>
                        
                        <!-- Performance Trends & Category Radar -->
                        <div class="analytics-grid">
                            <div class="analytics-card">
                                <h4 class="analytics-card-title">
                                    <i class="fas fa-chart-line"></i>
                                    اتجاهات الأداء
                                </h4>
                                <p class="analytics-card-subtitle">تطور معدل الدقة عبر الزمن</p>
                                <div class="chart-container">
                                    <canvas id="performance-trend-chart"></canvas>
                                </div>
                            </div>
                            
                            <div class="analytics-card">
                                <h4 class="analytics-card-title">
                                    <i class="fas fa-spider"></i>
                                    إتقان الفئات
                                </h4>
                                <p class="analytics-card-subtitle">مستوى الإتقان في جميع فئات المفردات</p>
                                <div class="chart-container">
                                    <canvas id="category-radar-chart"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Learning Velocity & Recommendations -->
                        <div class="analytics-grid">
                            <div class="analytics-card">
                                <h4 class="analytics-card-title">
                                    <i class="fas fa-tachometer-alt"></i>
                                    سرعة التعلم
                                </h4>
                                <p class="analytics-card-subtitle">عدد الكلمات المُتعلمة في كل جلسة</p>
                                <div class="chart-container">
                                    <canvas id="learning-velocity-chart"></canvas>
                                </div>
                            </div>
                            
                            <div class="analytics-card">
                                <h4 class="analytics-card-title">
                                    <i class="fas fa-lightbulb"></i>
                                    توصيات ذكية
                                </h4>
                                <p class="analytics-card-subtitle">اقتراحات مخصصة لتحسين التعلم</p>
                                <div class="recommendations-container" id="ai-recommendations">
                                    <!-- AI recommendations will be generated here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Scripts -->
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/tts-service.js"></script>
        <script src="/static/review-system.js"></script>
        <!-- Legacy Learning Systems (for compatibility) -->
        <script src="/static/learning-system.js"></script>
        <script src="/static/conversation-system.js"></script>
        <script src="/static/analytics-dashboard.js"></script>
        <script src="/static/gamification-system.js"></script>
        <script src="/static/visual-ux-system.js"></script>
        <script src="/static/enhanced-content-system.js"></script>
        
        <!-- Enhanced Vocabulary Database with Sessions (1,126 Turkish words, 31 categories, 127 sessions) -->
        <script src="/static/enhanced-vocabulary-with-sessions.js"></script>
        
        <!-- Difficulty-Based Session Management System -->
        <script src="/static/difficulty-based-session-manager.js"></script>
        
        <!-- New Modular Learning System -->
        <script src="/static/word-svg-icons.js"></script>
        <script src="/static/learning-mode-base.js"></script>
        <script src="/static/learning-mode-manager.js"></script>
        
        <!-- Learning Mode Containers -->
        <script src="/static/modes/flashcard-mode.js"></script>
        <script src="/static/modes/quiz-mode.js"></script>
        <script src="/static/modes/review-mode.js"></script>
        <script src="/static/modes/conversation-mode.js"></script>
        <script src="/static/modes/phrase-mode.js"></script>
        
        <!-- Session Management System -->
        <script src="/static/session-management.js"></script>
        
        <!-- Integration Layer -->
        <script src="/static/modular-integration.js"></script>
        
        <!-- Main App (must be last) -->
        <script src="/static/app-modern.js"></script>
        


    </body>
    </html>
  `)
})

export default app