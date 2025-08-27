import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for frontend-backend communication
app.use('/api/*', cors())

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// Turkish vocabulary data - 48 words across 8 travel-focused categories
const vocabulary = {
  greetings: [
    { id: 1, turkish: "Merhaba", arabic: "مرحبا", english: "Hello", pronunciation: "mer-ha-BA", 
      example: "Merhaba, nasılsınız?", exampleArabic: "مرحبا، كيف حالك؟" },
    { id: 2, turkish: "Günaydın", arabic: "صباح الخير", english: "Good morning", pronunciation: "gün-ay-DIN",
      example: "Günaydın! Bugün hava çok güzel.", exampleArabic: "صباح الخير! الطقس جميل جداً اليوم." },
    { id: 3, turkish: "İyi akşamlar", arabic: "مساء الخير", english: "Good evening", pronunciation: "i-yi ak-sham-LAR",
      example: "İyi akşamlar, iyi dinlenmeler.", exampleArabic: "مساء الخير، استراحة طيبة." },
    { id: 4, turkish: "Hoşça kalın", arabic: "وداعا", english: "Goodbye", pronunciation: "hosh-CHA ka-LIN",
      example: "Hoşça kalın, yarın görüşürüz.", exampleArabic: "وداعاً، نراكم غداً." },
    { id: 5, turkish: "Lütfen", arabic: "من فضلك", english: "Please", pronunciation: "lüt-FEN",
      example: "Lütfen bana yardım edin.", exampleArabic: "من فضلك ساعدني." },
    { id: 6, turkish: "Teşekkür ederim", arabic: "شكرا لك", english: "Thank you", pronunciation: "te-shek-KÜR e-de-RIM",
      example: "Yardımınız için teşekkür ederim.", exampleArabic: "شكراً لك على مساعدتك." }
  ],
  travel: [
    { id: 7, turkish: "Havaalanı", arabic: "المطار", english: "Airport", pronunciation: "ha-va-a-la-NI",
      example: "Havaalanına taksiyle gittim.", exampleArabic: "ذهبت إلى المطار بالتاكسي." },
    { id: 8, turkish: "Otel", arabic: "فندق", english: "Hotel", pronunciation: "o-TEL",
      example: "Bu otel çok güzel.", exampleArabic: "هذا الفندق جميل جداً." },
    { id: 9, turkish: "Taksi", arabic: "تاكسي", english: "Taxi", pronunciation: "tak-SI",
      example: "Taksi çağırabilir misiniz?", exampleArabic: "هل يمكنك استدعاء تاكسي؟" },
    { id: 10, turkish: "Otobüs", arabic: "حافلة", english: "Bus", pronunciation: "o-to-BÜS",
      example: "Otobüs durağı nerede?", exampleArabic: "أين موقف الحافلة؟" },
    { id: 11, turkish: "Tren", arabic: "قطار", english: "Train", pronunciation: "TREN",
      example: "Tren saat kaçta kalkıyor?", exampleArabic: "متى يغادر القطار؟" },
    { id: 12, turkish: "Bilet", arabic: "تذكرة", english: "Ticket", pronunciation: "bi-LET",
      example: "Bir bilet istiyorum.", exampleArabic: "أريد تذكرة واحدة." }
  ],
  food: [
    { id: 13, turkish: "Su", arabic: "ماء", english: "Water", pronunciation: "SU",
      example: "Bir bardak su istiyorum.", exampleArabic: "أريد كأس من الماء." },
    { id: 14, turkish: "Ekmek", arabic: "خبز", english: "Bread", pronunciation: "ek-MEK",
      example: "Ekmek çok taze.", exampleArabic: "الخبز طازج جداً." },
    { id: 15, turkish: "Et", arabic: "لحم", english: "Meat", pronunciation: "ET",
      example: "Et yemek istemiyorum.", exampleArabic: "لا أريد أن آكل اللحم." },
    { id: 16, turkish: "Balık", arabic: "سمك", english: "Fish", pronunciation: "ba-LIK",
      example: "Balık çok lezzetli.", exampleArabic: "السمك لذيذ جداً." },
    { id: 17, turkish: "Sebze", arabic: "خضار", english: "Vegetable", pronunciation: "seb-ZE",
      example: "Taze sebze seviyorum.", exampleArabic: "أحب الخضار الطازجة." },
    { id: 18, turkish: "Meyve", arabic: "فاكهة", english: "Fruit", pronunciation: "mey-VE",
      example: "Meyve çok sağlıklı.", exampleArabic: "الفاكهة صحية جداً." }
  ],
  shopping: [
    { id: 19, turkish: "Ne kadar?", arabic: "كم الثمن؟", english: "How much?", pronunciation: "ne ka-DAR",
      example: "Bu ne kadar?", exampleArabic: "كم ثمن هذا؟" },
    { id: 20, turkish: "Çok pahalı", arabic: "غالي جدا", english: "Too expensive", pronunciation: "chok pa-ha-LI",
      example: "Bu çok pahalı, daha ucuzu var mı?", exampleArabic: "هذا غالي جداً، هل يوجد أرخص؟" },
    { id: 21, turkish: "Ucuz", arabic: "رخيص", english: "Cheap", pronunciation: "u-JUZ",
      example: "Bu çok ucuz bir fiyat.", exampleArabic: "هذا سعر رخيص جداً." },
    { id: 22, turkish: "Para", arabic: "مال", english: "Money", pronunciation: "pa-RA",
      example: "Yeterli param yok.", exampleArabic: "ليس معي مال كافٍ." },
    { id: 23, turkish: "Satın almak", arabic: "شراء", english: "To buy", pronunciation: "sa-tin al-MAK",
      example: "Bunu satın almak istiyorum.", exampleArabic: "أريد شراء هذا." },
    { id: 24, turkish: "Mağaza", arabic: "متجر", english: "Store", pronunciation: "ma-a-za",
      example: "En yakın mağaza nerede?", exampleArabic: "أين أقرب متجر؟" }
  ],
  directions: [
    { id: 25, turkish: "Nerede?", arabic: "أين؟", english: "Where?", pronunciation: "ne-re-DE",
      example: "Tuvalet nerede?", exampleArabic: "أين دورة المياه؟" },
    { id: 26, turkish: "Sağ", arabic: "يمين", english: "Right", pronunciation: "SA",
      example: "Sağa dönün.", exampleArabic: "انعطفوا يميناً." },
    { id: 27, turkish: "Sol", arabic: "يسار", english: "Left", pronunciation: "SOL",
      example: "Sola git.", exampleArabic: "اذهب يساراً." },
    { id: 28, turkish: "İleri", arabic: "إلى الأمام", english: "Forward", pronunciation: "i-le-RI",
      example: "Düz ileri gidin.", exampleArabic: "اذهبوا مباشرة إلى الأمام." },
    { id: 29, turkish: "Geri", arabic: "إلى الوراء", english: "Back", pronunciation: "ge-RI",
      example: "Geri dönelim.", exampleArabic: "دعونا نعود إلى الوراء." },
    { id: 30, turkish: "Yakın", arabic: "قريب", english: "Close", pronunciation: "ya-KIN",
      example: "Burası çok yakın.", exampleArabic: "هذا المكان قريب جداً." }
  ],
  emergency: [
    { id: 31, turkish: "Yardım!", arabic: "النجدة!", english: "Help!", pronunciation: "yar-DIM",
      example: "Yardım edin! Kayboldum.", exampleArabic: "ساعدوني! لقد تهت." },
    { id: 32, turkish: "Polis", arabic: "شرطة", english: "Police", pronunciation: "po-LIS",
      example: "Polisi çağırın.", exampleArabic: "اتصلوا بالشرطة." },
    { id: 33, turkish: "Doktor", arabic: "طبيب", english: "Doctor", pronunciation: "dok-TOR",
      example: "Doktora ihtiyacım var.", exampleArabic: "أحتاج إلى طبيب." },
    { id: 34, turkish: "Hastane", arabic: "مستشفى", english: "Hospital", pronunciation: "has-ta-NE",
      example: "En yakın hastane nerede?", exampleArabic: "أين أقرب مستشفى؟" },
    { id: 35, turkish: "Acil", arabic: "طوارئ", english: "Emergency", pronunciation: "a-JIL",
      example: "Bu acil durum!", exampleArabic: "هذه حالة طوارئ!" },
    { id: 36, turkish: "Hasta", arabic: "مريض", english: "Sick", pronunciation: "has-TA",
      example: "Çok hastayım.", exampleArabic: "أنا مريض جداً." }
  ],
  time: [
    { id: 37, turkish: "Saat", arabic: "ساعة", english: "Hour/Clock", pronunciation: "sa-AT",
      example: "Saat kaç?", exampleArabic: "كم الساعة؟" },
    { id: 38, turkish: "Gün", arabic: "يوم", english: "Day", pronunciation: "GÜN",
      example: "Güzel bir gün.", exampleArabic: "يوم جميل." },
    { id: 39, turkish: "Hafta", arabic: "أسبوع", english: "Week", pronunciation: "haf-TA",
      example: "Gelecek hafta döneceğim.", exampleArabic: "سأعود الأسبوع القادم." },
    { id: 40, turkish: "Ay", arabic: "شهر", english: "Month", pronunciation: "AY",
      example: "Bu ay çok meşgulüm.", exampleArabic: "أنا مشغول جداً هذا الشهر." },
    { id: 41, turkish: "Yıl", arabic: "سنة", english: "Year", pronunciation: "YIL",
      example: "Bu yıl Türkiye'ye gideceğim.", exampleArabic: "سأذهب إلى تركيا هذا العام." },
    { id: 42, turkish: "Bugün", arabic: "اليوم", english: "Today", pronunciation: "bu-GÜN",
      example: "Bugün çok yorgunum.", exampleArabic: "أنا متعب جداً اليوم." }
  ],
  numbers: [
    { id: 43, turkish: "Bir", arabic: "واحد", english: "One", pronunciation: "BIR",
      example: "Bir çay lütfen.", exampleArabic: "شاي واحد من فضلك." },
    { id: 44, turkish: "İki", arabic: "اثنان", english: "Two", pronunciation: "i-KI",
      example: "İki bilet istiyorum.", exampleArabic: "أريد تذكرتين." },
    { id: 45, turkish: "Üç", arabic: "ثلاثة", english: "Three", pronunciation: "ÜCH",
      example: "Üç gün kalacağım.", exampleArabic: "سأمكث لثلاثة أيام." },
    { id: 46, turkish: "Dört", arabic: "أربعة", english: "Four", pronunciation: "DÖRT",
      example: "Dört kişiyiz.", exampleArabic: "نحن أربعة أشخاص." },
    { id: 47, turkish: "Beş", arabic: "خمسة", english: "Five", pronunciation: "BESH",
      example: "Beş dakika bekleyin.", exampleArabic: "انتظروا خمس دقائق." },
    { id: 48, turkish: "On", arabic: "عشرة", english: "Ten", pronunciation: "ON",
      example: "On lira ödedim.", exampleArabic: "دفعت عشر ليرات." }
  ]
};

// Get all categories
app.get('/api/categories', (c) => {
  const categories = Object.keys(vocabulary).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    wordCount: vocabulary[key].length,
    icon: getCategoryIcon(key)
  }));
  
  return c.json({ categories });
});

// Get words by category
app.get('/api/words/:category', (c) => {
  const category = c.req.param('category');
  const words = vocabulary[category] || [];
  
  return c.json({ 
    category,
    words,
    total: words.length
  });
});

// Get all words
app.get('/api/words', (c) => {
  const allWords = [];
  Object.values(vocabulary).forEach(categoryWords => {
    allWords.push(...categoryWords);
  });
  
  return c.json({ 
    words: allWords,
    total: allWords.length,
    categories: Object.keys(vocabulary).length
  });
});

// Get random words for review
app.get('/api/words/random/:count', (c) => {
  const count = parseInt(c.req.param('count')) || 10;
  const allWords = [];
  Object.values(vocabulary).forEach(categoryWords => {
    allWords.push(...categoryWords);
  });
  
  const shuffled = allWords.sort(() => 0.5 - Math.random());
  const randomWords = shuffled.slice(0, Math.min(count, allWords.length));
  
  return c.json({ 
    words: randomWords,
    requested: count,
    returned: randomWords.length
  });
});

// Get user progress (demo endpoint)
app.get('/api/user/progress', (c) => {
  return c.json({
    totalWords: 48,
    learnedWords: 0,
    currentLevel: 1,
    xp: 0,
    streak: 0,
    reviewsToday: 0,
    categories: Object.keys(vocabulary).map(key => ({
      name: key,
      progress: 0,
      completed: false
    }))
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

function getCategoryIcon(category: string): string {
  const icons = {
    greetings: "👋",
    travel: "✈️",
    food: "🍽️",
    shopping: "🛒",
    directions: "🧭",
    emergency: "🚨",
    time: "⏰",
    numbers: "🔢"
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
        
        <!-- Custom Styles -->
        <link href="/static/styles-modern.css" rel="stylesheet">
        
        <!-- PWA Meta Tags -->
        <meta name="theme-color" content="#2563EB">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="تعلم التركية">
        
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
                
                <div class="nav-links hidden md:flex">
                    <button class="nav-link active" data-section="dashboard">
                        <i class="fas fa-home"></i>
                        الرئيسية
                    </button>
                    <button class="nav-link" data-section="learn">
                        <i class="fas fa-graduation-cap"></i>
                        تعلم
                    </button>
                    <button class="nav-link" data-section="review">
                        <i class="fas fa-repeat"></i>
                        مراجعة
                    </button>
                    <button class="nav-link" data-section="progress">
                        <i class="fas fa-chart-line"></i>
                        التقدم
                    </button>
                </div>
                
                <button class="mobile-menu-btn md:hidden">
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
                <button class="mobile-nav-link" data-section="progress">
                    <i class="fas fa-chart-line"></i>
                    <span>التقدم</span>
                </button>
            </div>
        </nav>

        <!-- Main Content -->
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
                            <select class="language-selector" style="margin-right: 1rem;">
                                <option>التركية للعرب</option>
                            </select>
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
            </section>

            <!-- Learning Section -->
            <section id="learn-section" class="content-section">
                <div class="section-header">
                    <h2 class="section-title">وضع التعلم</h2>
                    <p class="section-subtitle">تعلم كلمات جديدة مع الأمثلة والنطق</p>
                </div>
                
                <div id="learning-interface">
                    <div class="learning-controls">
                        <select id="category-select" class="control-select">
                            <option value="">اختر فئة...</option>
                        </select>
                        <select id="learning-mode" class="control-select">
                            <option value="flashcard">بطاقات تعليمية</option>
                            <option value="quiz">اختبار</option>
                        </select>
                        <button id="start-learning" class="btn-primary" disabled>ابدأ التعلم</button>
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

            <!-- Progress Section -->
            <section id="progress-section" class="content-section">
                <div class="section-header">
                    <h2 class="section-title">تتبع التقدم</h2>
                    <p class="section-subtitle">راقب تطورك في تعلم اللغة التركية</p>
                </div>
                
                <div class="progress-dashboard">
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
                    
                    <div class="category-progress" id="category-progress">
                        <!-- Category progress will be loaded here -->
                    </div>
                </div>
            </section>
        </main>

        <!-- Scripts -->
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/review-system.js"></script>
        <script src="/static/learning-system.js"></script>
        <script src="/static/app-modern.js"></script>
    </body>
    </html>
  `)
})

export default app