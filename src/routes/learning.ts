// Turkish Learning API Routes

import { Hono } from 'hono'

const learning = new Hono()

// Demo vocabulary data - 8 categories with Turkish words for travelers
const demoWords = [
  // Greetings (6 words)
  { id: 1, turkish_word: "Merhaba", arabic_translation: "مرحبا", phonetic: "mer-ha-ba", category: "Greetings", frequency_rank: 1, difficulty_level: 1, example_sentence_turkish: "Merhaba, nasılsınız?", example_sentence_arabic: "مرحبا، كيف حالكم؟" },
  { id: 2, turkish_word: "Teşekkürler", arabic_translation: "شكرا لك", phonetic: "te-shek-kür-ler", category: "Greetings", frequency_rank: 2, difficulty_level: 1, example_sentence_turkish: "Teşekkürler, çok naziksiniz.", example_sentence_arabic: "شكرا لك، أنتم لطفاء جداً." },
  { id: 3, turkish_word: "Günaydın", arabic_translation: "صباح الخير", phonetic: "gün-ay-dın", category: "Greetings", frequency_rank: 3, difficulty_level: 1, example_sentence_turkish: "Günaydın! Nasıl uyudunuz?", example_sentence_arabic: "صباح الخير! كيف نمتم؟" },
  { id: 4, turkish_word: "İyi akşamlar", arabic_translation: "مساء الخير", phonetic: "i-yi ak-şam-lar", category: "Greetings", frequency_rank: 4, difficulty_level: 1, example_sentence_turkish: "İyi akşamlar, hoş geldiniz.", example_sentence_arabic: "مساء الخير، أهلاً وسهلاً." },
  { id: 5, turkish_word: "Özür dilerim", arabic_translation: "أعتذر", phonetic: "ö-zür di-le-rim", category: "Greetings", frequency_rank: 5, difficulty_level: 1, example_sentence_turkish: "Özür dilerim, geç kaldım.", example_sentence_arabic: "أعتذر، لقد تأخرت." },
  { id: 6, turkish_word: "Lütfen", arabic_translation: "من فضلك", phonetic: "lüt-fen", category: "Greetings", frequency_rank: 6, difficulty_level: 1, example_sentence_turkish: "Lütfen bana yardım edin.", example_sentence_arabic: "من فضلك ساعدوني." },

  // Airport & Transportation (8 words)
  { id: 7, turkish_word: "Havalimanı", arabic_translation: "المطار", phonetic: "ha-va-li-ma-nı", category: "Airport & Transportation", frequency_rank: 7, difficulty_level: 2, example_sentence_turkish: "Havalimanına nasıl gidebilirim?", example_sentence_arabic: "كيف يمكنني الذهاب إلى المطار؟" },
  { id: 8, turkish_word: "Uçak", arabic_translation: "طائرة", phonetic: "u-chak", category: "Airport & Transportation", frequency_rank: 8, difficulty_level: 1, example_sentence_turkish: "Uçağım saat kaçta kalkıyor?", example_sentence_arabic: "متى تقلع طائرتي؟" },
  { id: 9, turkish_word: "Bilet", arabic_translation: "تذكرة", phonetic: "bi-let", category: "Airport & Transportation", frequency_rank: 9, difficulty_level: 1, example_sentence_turkish: "Biletimi nerede alabilirim?", example_sentence_arabic: "أين يمكنني الحصول على تذكرتي؟" },
  { id: 10, turkish_word: "Taksi", arabic_translation: "تاكسي", phonetic: "tak-si", category: "Airport & Transportation", frequency_rank: 10, difficulty_level: 1, example_sentence_turkish: "Taksi çağırabilir misiniz?", example_sentence_arabic: "هل يمكنكم استدعاء تاكسي؟" },
  { id: 11, turkish_word: "Otobüs", arabic_translation: "باص", phonetic: "o-to-büs", category: "Airport & Transportation", frequency_rank: 11, difficulty_level: 1, example_sentence_turkish: "Otobüs durağı nerede?", example_sentence_arabic: "أين موقف الباص؟" },
  { id: 12, turkish_word: "Tren", arabic_translation: "قطار", phonetic: "tren", category: "Airport & Transportation", frequency_rank: 12, difficulty_level: 1, example_sentence_turkish: "Tren istasyonu uzak mı?", example_sentence_arabic: "هل محطة القطار بعيدة؟" },
  { id: 13, turkish_word: "Metro", arabic_translation: "مترو", phonetic: "met-ro", category: "Airport & Transportation", frequency_rank: 13, difficulty_level: 1, example_sentence_turkish: "Metro kartı nereden alabilirim?", example_sentence_arabic: "من أين يمكنني الحصول على بطاقة المترو؟" },
  { id: 14, turkish_word: "Bagaj", arabic_translation: "أمتعة", phonetic: "ba-gaj", category: "Airport & Transportation", frequency_rank: 14, difficulty_level: 2, example_sentence_turkish: "Bagajımı nerede bulabilirim?", example_sentence_arabic: "أين يمكنني العثور على أمتعتي؟" },

  // Hotel & Accommodation (6 words)
  { id: 15, turkish_word: "Otel", arabic_translation: "فندق", phonetic: "o-tel", category: "Hotel & Accommodation", frequency_rank: 15, difficulty_level: 1, example_sentence_turkish: "Bu otelin fiyatı ne kadar?", example_sentence_arabic: "كم سعر هذا الفندق؟" },
  { id: 16, turkish_word: "Oda", arabic_translation: "غرفة", phonetic: "o-da", category: "Hotel & Accommodation", frequency_rank: 16, difficulty_level: 1, example_sentence_turkish: "Tek kişilik oda istiyorum.", example_sentence_arabic: "أريد غرفة مفردة." },
  { id: 17, turkish_word: "Rezervasyon", arabic_translation: "حجز", phonetic: "re-zer-vas-yon", category: "Hotel & Accommodation", frequency_rank: 17, difficulty_level: 2, example_sentence_turkish: "Rezervasyon yapmak istiyorum.", example_sentence_arabic: "أريد أن أقوم بحجز." },
  { id: 18, turkish_word: "Anahtar", arabic_translation: "مفتاح", phonetic: "a-nah-tar", category: "Hotel & Accommodation", frequency_rank: 18, difficulty_level: 1, example_sentence_turkish: "Oda anahtarımı kaybettim.", example_sentence_arabic: "لقد فقدت مفتاح غرفتي." },
  { id: 19, turkish_word: "Resepsiyon", arabic_translation: "الاستقبال", phonetic: "re-sep-si-yon", category: "Hotel & Accommodation", frequency_rank: 19, difficulty_level: 2, example_sentence_turkish: "Resepsiyona gitmem gerek.", example_sentence_arabic: "أحتاج إلى الذهاب إلى الاستقبال." },
  { id: 20, turkish_word: "Kahvaltı", arabic_translation: "إفطار", phonetic: "kah-val-tı", category: "Hotel & Accommodation", frequency_rank: 20, difficulty_level: 2, example_sentence_turkish: "Kahvaltı saat kaçta?", example_sentence_arabic: "متى وقت الإفطار؟" },

  // Food & Dining (8 words)
  { id: 21, turkish_word: "Restoran", arabic_translation: "مطعم", phonetic: "res-to-ran", category: "Food & Dining", frequency_rank: 21, difficulty_level: 1, example_sentence_turkish: "İyi bir restoran önerebilir misiniz?", example_sentence_arabic: "هل يمكنكم اقتراح مطعم جيد؟" },
  { id: 22, turkish_word: "Menü", arabic_translation: "قائمة طعام", phonetic: "me-nü", category: "Food & Dining", frequency_rank: 22, difficulty_level: 1, example_sentence_turkish: "Menüyü görebilir miyim?", example_sentence_arabic: "هل يمكنني رؤية قائمة الطعام؟" },
  { id: 23, turkish_word: "Su", arabic_translation: "ماء", phonetic: "su", category: "Food & Dining", frequency_rank: 23, difficulty_level: 1, example_sentence_turkish: "Bir bardak su lütfen.", example_sentence_arabic: "كوب ماء من فضلك." },
  { id: 24, turkish_word: "Çay", arabic_translation: "شاي", phonetic: "çay", category: "Food & Dining", frequency_rank: 24, difficulty_level: 1, example_sentence_turkish: "Türk çayı çok lezzetli.", example_sentence_arabic: "الشاي التركي لذيذ جداً." },
  { id: 25, turkish_word: "Kahve", arabic_translation: "قهوة", phonetic: "kah-ve", category: "Food & Dining", frequency_rank: 25, difficulty_level: 1, example_sentence_turkish: "Türk kahvesi içmek istiyorum.", example_sentence_arabic: "أريد أن أشرب قهوة تركية." },
  { id: 26, turkish_word: "Yemek", arabic_translation: "طعام", phonetic: "ye-mek", category: "Food & Dining", frequency_rank: 26, difficulty_level: 1, example_sentence_turkish: "Bu yemek ne kadar?", example_sentence_arabic: "كم سعر هذا الطعام؟" },
  { id: 27, turkish_word: "Hesap", arabic_translation: "حساب", phonetic: "he-sap", category: "Food & Dining", frequency_rank: 27, difficulty_level: 1, example_sentence_turkish: "Hesap lütfen.", example_sentence_arabic: "الحساب من فضلك." },
  { id: 28, turkish_word: "Bahşiş", arabic_translation: "إكرامية", phonetic: "bah-şiş", category: "Food & Dining", frequency_rank: 28, difficulty_level: 2, example_sentence_turkish: "Bahşiş vermek zorunda mıyım?", example_sentence_arabic: "هل يجب أن أعطي إكرامية؟" },

  // Numbers & Time (6 words)
  { id: 29, turkish_word: "Bir", arabic_translation: "واحد", phonetic: "bir", category: "Numbers & Time", frequency_rank: 29, difficulty_level: 1, example_sentence_turkish: "Bir bilet lütfen.", example_sentence_arabic: "تذكرة واحدة من فضلك." },
  { id: 30, turkish_word: "Saat", arabic_translation: "ساعة", phonetic: "sa-at", category: "Numbers & Time", frequency_rank: 30, difficulty_level: 1, example_sentence_turkish: "Saat kaç?", example_sentence_arabic: "كم الساعة؟" },
  { id: 31, turkish_word: "Gün", arabic_translation: "يوم", phonetic: "gün", category: "Numbers & Time", frequency_rank: 31, difficulty_level: 1, example_sentence_turkish: "Bugün hava çok güzel.", example_sentence_arabic: "الطقس جميل جداً اليوم." },
  { id: 32, turkish_word: "Hafta", arabic_translation: "أسبوع", phonetic: "haf-ta", category: "Numbers & Time", frequency_rank: 32, difficulty_level: 1, example_sentence_turkish: "Geçen hafta İstanbul'daydım.", example_sentence_arabic: "كنت في إسطنبول الأسبوع الماضي." },
  { id: 33, turkish_word: "Dakika", arabic_translation: "دقيقة", phonetic: "da-ki-ka", category: "Numbers & Time", frequency_rank: 33, difficulty_level: 1, example_sentence_turkish: "Beş dakika bekleyin lütfen.", example_sentence_arabic: "انتظروا خمس دقائق من فضلكم." },
  { id: 34, turkish_word: "Yarın", arabic_translation: "غداً", phonetic: "ya-rın", category: "Numbers & Time", frequency_rank: 34, difficulty_level: 1, example_sentence_turkish: "Yarın görüşürüz.", example_sentence_arabic: "نراكم غداً." },

  // Directions & Navigation (6 words)
  { id: 35, turkish_word: "Nerede", arabic_translation: "أين", phonetic: "ne-re-de", category: "Directions & Navigation", frequency_rank: 35, difficulty_level: 1, example_sentence_turkish: "Bankamat nerede?", example_sentence_arabic: "أين الصراف الآلي؟" },
  { id: 36, turkish_word: "Sağ", arabic_translation: "يمين", phonetic: "sağ", category: "Directions & Navigation", frequency_rank: 36, difficulty_level: 1, example_sentence_turkish: "Sağa dönün.", example_sentence_arabic: "انعطفوا يميناً." },
  { id: 37, turkish_word: "Sol", arabic_translation: "شمال", phonetic: "sol", category: "Directions & Navigation", frequency_rank: 37, difficulty_level: 1, example_sentence_turkish: "Sola git.", example_sentence_arabic: "اذهب شمالاً." },
  { id: 38, turkish_word: "Düz", arabic_translation: "مستقيم", phonetic: "düz", category: "Directions & Navigation", frequency_rank: 38, difficulty_level: 1, example_sentence_turkish: "Düz gidin.", example_sentence_arabic: "اذهبوا مستقيماً." },
  { id: 39, turkish_word: "Harita", arabic_translation: "خريطة", phonetic: "ha-ri-ta", category: "Directions & Navigation", frequency_rank: 39, difficulty_level: 2, example_sentence_turkish: "Haritanız var mı?", example_sentence_arabic: "هل لديكم خريطة؟" },
  { id: 40, turkish_word: "Adres", arabic_translation: "عنوان", phonetic: "ad-res", category: "Directions & Navigation", frequency_rank: 40, difficulty_level: 1, example_sentence_turkish: "Bu adresi biliyor musunuz?", example_sentence_arabic: "هل تعرفون هذا العنوان؟" },

  // Emergency Situations (4 words)
  { id: 41, turkish_word: "Yardım", arabic_translation: "مساعدة", phonetic: "yar-dım", category: "Emergency Situations", frequency_rank: 41, difficulty_level: 1, example_sentence_turkish: "Yardım edin!", example_sentence_arabic: "ساعدوني!" },
  { id: 42, turkish_word: "Polis", arabic_translation: "شرطة", phonetic: "po-lis", category: "Emergency Situations", frequency_rank: 42, difficulty_level: 1, example_sentence_turkish: "Polisi arayın lütfen.", example_sentence_arabic: "اتصلوا بالشرطة من فضلكم." },
  { id: 43, turkish_word: "Hastane", arabic_translation: "مستشفى", phonetic: "has-ta-ne", category: "Emergency Situations", frequency_rank: 43, difficulty_level: 2, example_sentence_turkish: "Hastaneye gitmem gerek.", example_sentence_arabic: "أحتاج إلى الذهاب إلى المستشفى." },
  { id: 44, turkish_word: "Acil", arabic_translation: "طوارئ", phonetic: "a-cil", category: "Emergency Situations", frequency_rank: 44, difficulty_level: 2, example_sentence_turkish: "Bu çok acil!", example_sentence_arabic: "هذا عاجل جداً!" },

  // Shopping & Markets (4 words)
  { id: 45, turkish_word: "Mağaza", arabic_translation: "متجر", phonetic: "ma-ğa-za", category: "Shopping & Markets", frequency_rank: 45, difficulty_level: 2, example_sentence_turkish: "Bu mağaza çok pahalı.", example_sentence_arabic: "هذا المتجر غالي جداً." },
  { id: 46, turkish_word: "Para", arabic_translation: "نقود", phonetic: "pa-ra", category: "Shopping & Markets", frequency_rank: 46, difficulty_level: 1, example_sentence_turkish: "Ne kadar para?", example_sentence_arabic: "كم من المال؟" },
  { id: 47, turkish_word: "Ucuz", arabic_translation: "رخيص", phonetic: "u-cuz", category: "Shopping & Markets", frequency_rank: 47, difficulty_level: 1, example_sentence_turkish: "Daha ucuz var mı?", example_sentence_arabic: "هل يوجد أرخص؟" },
  { id: 48, turkish_word: "Pazar", arabic_translation: "سوق", phonetic: "pa-zar", category: "Shopping & Markets", frequency_rank: 48, difficulty_level: 1, example_sentence_turkish: "Pazar nerede?", example_sentence_arabic: "أين السوق؟" }
];

// Get categories with word counts
learning.get('/categories/demo', async (c) => {
  const categories = [
    { category: 'Greetings', word_count: 6 },
    { category: 'Airport & Transportation', word_count: 8 },
    { category: 'Hotel & Accommodation', word_count: 6 },
    { category: 'Food & Dining', word_count: 8 },
    { category: 'Numbers & Time', word_count: 6 },
    { category: 'Directions & Navigation', word_count: 6 },
    { category: 'Emergency Situations', word_count: 4 },
    { category: 'Shopping & Markets', word_count: 4 }
  ];
  
  return c.json({ success: true, categories });
});

// Get next words for learning
learning.get('/next-words/demo', async (c) => {
  const limit = parseInt(c.req.query('limit') || '10');
  const category = c.req.query('category');
  const quick = c.req.query('quick');
  
  let wordsToReturn = [...demoWords];
  
  if (category) {
    wordsToReturn = demoWords.filter(word => word.category === category);
  }
  
  if (quick) {
    // For quick lessons, return random words from different categories
    const shuffled = [...demoWords].sort(() => 0.5 - Math.random());
    wordsToReturn = shuffled.slice(0, limit);
  }
  
  if (!quick && !category) {
    wordsToReturn = demoWords.slice(0, limit);
  }
  
  return c.json({ 
    success: true, 
    words: wordsToReturn.slice(0, limit),
    total: wordsToReturn.length 
  });
});

// User login/creation (demo)
learning.post('/user/login', async (c) => {
  const { userId } = await c.req.json();
  
  // Demo user creation
  const user = {
    id: userId,
    name: 'مستخدم تجريبي',
    email: 'demo@example.com',
    current_streak: 0,
    total_xp: 0,
    level: 1,
    created_at: new Date().toISOString()
  };
  
  return c.json({ success: true, user });
});

export default learning