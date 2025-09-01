// 🎯 Enhanced Turkish Language Categorizer with Session System
// Advanced categorization and 10-words-per-session learning structure

import fs from 'fs';
import path from 'path';

class EnhancedTurkishCategorizer {
    constructor() {
        this.csvFile = 'turkish_language_data.csv';
        this.outputFile = 'public/static/enhanced-vocabulary-with-sessions.js';
        this.wordsPerSession = 10;
        
        this.stats = {
            totalRows: 0,
            processedWords: 0,
            duplicates: 0,
            categories: new Map(),
            sessions: new Map(),
            difficultyLevels: new Map(),
            vowelHarmonyTypes: new Map()
        };
        
        // Enhanced categorization system with specific domains
        this.advancedCategories = {
            // Basic Communication (الأساسيات)
            'greetings_basics': {
                name: 'Basic Greetings & Politeness',
                nameArabic: 'التحيات والمجاملات الأساسية',
                icon: '👋',
                keywords: ['merhaba', 'günaydın', 'iyi', 'teşekkür', 'lütfen', 'özür', 'hoş', 'selam', 'elveda', 'affedersin', 'pardon']
            },
            
            // Family & Relationships (العائلة والعلاقات)
            'family_relationships': {
                name: 'Family & Relationships',
                nameArabic: 'العائلة والعلاقات',
                icon: '👨‍👩‍👧‍👦',
                keywords: ['anne', 'baba', 'çocuk', 'kardeş', 'aile', 'eş', 'arkadaş', 'sevgili', 'abla', 'abi', 'teyze', 'amca', 'dede', 'nine']
            },
            
            // Body & Health (الجسم والصحة)
            'body_health': {
                name: 'Body Parts & Health',
                nameArabic: 'أجزاء الجسم والصحة',
                icon: '🏥',
                keywords: ['baş', 'göz', 'kulak', 'burun', 'ağız', 'diş', 'el', 'ayak', 'hasta', 'doktor', 'hastane', 'ağrı', 'ilaç', 'sağlık', 'akciğer', 'kalp', 'alın', 'parmak']
            },
            
            // Food & Cooking (الطعام والطبخ)
            'food_cooking': {
                name: 'Food & Cooking',
                nameArabic: 'الطعام والطبخ',
                icon: '🍽️',
                keywords: ['yemek', 'su', 'ekmek', 'et', 'sebze', 'meyve', 'çay', 'kahve', 'tuz', 'şeker', 'süt', 'peynir', 'balık', 'tavuk', 'pilav', 'çorba', 'salata']
            },
            
            // Clothing & Fashion (الملابس والأزياء)
            'clothing_fashion': {
                name: 'Clothing & Fashion',
                nameArabic: 'الملابس والأزياء',
                icon: '👕',
                keywords: ['giysi', 'elbise', 'pantolon', 'gömlek', 'ayakkabı', 'çanta', 'şapka', 'eldiven', 'mont', 'etek', 'kazak', 'çorap', 'iç çamaşır']
            },
            
            // Transportation & Travel (المواصلات والسفر)
            'transport_travel': {
                name: 'Transportation & Travel',
                nameArabic: 'المواصلات والسفر',
                icon: '🚗',
                keywords: ['araba', 'otobüs', 'tren', 'uçak', 'taksi', 'bisiklet', 'metro', 'bilet', 'istasyon', 'havaalanı', 'seyahat', 'yol', 'trafik', 'köprü']
            },
            
            // Home & Living (المنزل والمعيشة)
            'home_living': {
                name: 'Home & Living',
                nameArabic: 'المنزل والمعيشة',
                icon: '🏠',
                keywords: ['ev', 'oda', 'yatak', 'masa', 'sandalye', 'pencere', 'kapı', 'mutfak', 'banyo', 'salon', 'bahçe', 'çekmece', 'dolap', 'buzdolabı', 'televizyon']
            },
            
            // Work & Education (العمل والتعليم)
            'work_education': {
                name: 'Work & Education',
                nameArabic: 'العمل والتعليم',
                icon: '🎓',
                keywords: ['iş', 'çalışmak', 'okul', 'öğrenci', 'öğretmen', 'kitap', 'kalem', 'kağıt', 'ders', 'sınav', 'diploma', 'üniversite', 'meslek', 'işadamı']
            },
            
            // Shopping & Commerce (التسوق والتجارة)
            'shopping_commerce': {
                name: 'Shopping & Commerce',
                nameArabic: 'التسوق والتجارة',
                icon: '🛒',
                keywords: ['alışveriş', 'mağaza', 'para', 'fiyat', 'satın', 'satmak', 'ücret', 'kart', 'nakit', 'indirim', 'market', 'kasiyer', 'fiş', 'alışveriş merkezi']
            },
            
            // Nature & Weather (الطبيعة والطقس)
            'nature_weather': {
                name: 'Nature & Weather',
                nameArabic: 'الطبيعة والطقس',
                icon: '🌿',
                keywords: ['hava', 'güneş', 'yağmur', 'kar', 'rüzgar', 'ağaç', 'çiçek', 'hayvan', 'kuş', 'deniz', 'göl', 'dağ', 'orman', 'çiy', 'bulut', 'dal', 'sıcak', 'soğuk']
            },
            
            // Technology & Modern Life (التكنولوجيا والحياة العصرية)
            'technology_modern': {
                name: 'Technology & Modern Life',
                nameArabic: 'التكنولوجيا والحياة العصرية',
                icon: '📱',
                keywords: ['bilgisayar', 'telefon', 'internet', 'email', 'website', 'teknoloji', 'dijital', 'online', 'mobil', 'uygulama', 'virüs', 'donanım', 'yazılım', 'ATM']
            },
            
            // Colors & Descriptions (الألوان والصفات)
            'colors_descriptions': {
                name: 'Colors & Descriptions',
                nameArabic: 'الألوان والصفات',
                icon: '🎨',
                keywords: ['renk', 'kırmızı', 'mavi', 'yeşil', 'sarı', 'siyah', 'beyaz', 'büyük', 'küçük', 'uzun', 'kısa', 'güzel', 'çirkin', 'iyi', 'kötü']
            },
            
            // Time & Calendar (الوقت والتقويم)
            'time_calendar': {
                name: 'Time & Calendar',
                nameArabic: 'الوقت والتقويم',
                icon: '⏰',
                keywords: ['saat', 'zaman', 'gün', 'hafta', 'ay', 'yıl', 'bugün', 'yarın', 'dün', 'pazartesi', 'salı', 'ocak', 'şubat', 'temmuz', 'sabah', 'öğle', 'akşam', 'gece']
            },
            
            // Numbers & Mathematics (الأرقام والرياضيات)
            'numbers_math': {
                name: 'Numbers & Mathematics',
                nameArabic: 'الأرقام والرياضيات',
                icon: '🔢',
                keywords: ['bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'sayı', 'matematik', 'hesap']
            },
            
            // Arts & Culture (الفنون والثقافة)
            'arts_culture': {
                name: 'Arts & Culture',
                nameArabic: 'الفنون والثقافة',
                icon: '🎭',
                keywords: ['sanat', 'müzik', 'resim', 'şarkı', 'dans', 'tiyatro', 'sinema', 'kitap', 'şiir', 'kültür', 'müze', 'galeri', 'konser']
            },
            
            // Sports & Recreation (الرياضة والترفيه)
            'sports_recreation': {
                name: 'Sports & Recreation',
                nameArabic: 'الرياضة والترفيه',
                icon: '⚽',
                keywords: ['spor', 'futbol', 'basketbol', 'tenis', 'yüzmek', 'koşmak', 'oyun', 'maç', 'takım', 'sporcu', 'antrenman', 'stadyum']
            },
            
            // Legal & Government (القانون والحكومة)
            'legal_government': {
                name: 'Legal & Government',
                nameArabic: 'القانون والحكومة',
                icon: '⚖️',
                keywords: ['hukuk', 'avukat', 'mahkeme', 'hükümet', 'devlet', 'belediye', 'polis', 'asker', 'adalet', 'kanun', 'anlaşma']
            },
            
            // Emergency & Safety (الطوارئ والأمان)
            'emergency_safety': {
                name: 'Emergency & Safety',
                nameArabic: 'الطوارئ والأمان',
                icon: '🚨',
                keywords: ['acil', 'yardım', 'polis', 'itfaiye', 'ambulans', 'güvenlik', 'tehlike', 'kaza', 'ameliyat', 'anestezi', 'aspiratör']
            },
            
            // Science & Research (العلوم والبحث)
            'science_research': {
                name: 'Science & Research',
                nameArabic: 'العلوم والبحث',
                icon: '🔬',
                keywords: ['bilim', 'araştırma', 'laboratuvar', 'deney', 'kimya', 'fizik', 'biyoloji', 'astronomi', 'araştırma görevlisi', 'argon', 'asit', 'atom']
            },
            
            // General Vocabulary (المفردات العامة)
            'general_vocabulary': {
                name: 'General Vocabulary',
                nameArabic: 'المفردات العامة',
                icon: '📚',
                keywords: [] // Default category for unmatched words
            }
        };
    }
    
    /**
     * Categorize a word based on its Turkish text and meaning
     */
    categorizeWord(word, arabicTranslation) {
        const wordLower = word.toLowerCase().trim();
        
        // Check each category for keyword matches
        for (const [categoryId, categoryData] of Object.entries(this.advancedCategories)) {
            if (categoryId === 'general_vocabulary') continue; // Skip general for now
            
            // Check if word matches any keywords in this category
            for (const keyword of categoryData.keywords) {
                if (wordLower.includes(keyword.toLowerCase()) || 
                    keyword.toLowerCase().includes(wordLower)) {
                    return categoryId;
                }
            }
        }
        
        // Advanced semantic matching based on Arabic translation
        const arabicLower = arabicTranslation.toLowerCase();
        
        // Family terms
        if (arabicLower.includes('أب') || arabicLower.includes('أم') || 
            arabicLower.includes('ابن') || arabicLower.includes('بنت') || 
            arabicLower.includes('عائلة') || arabicLower.includes('زوج')) {
            return 'family_relationships';
        }
        
        // Body parts and health
        if (arabicLower.includes('جسم') || arabicLower.includes('رأس') || 
            arabicLower.includes('عين') || arabicLower.includes('صحة') ||
            arabicLower.includes('مرض') || arabicLower.includes('طبيب')) {
            return 'body_health';
        }
        
        // Food and drink
        if (arabicLower.includes('طعام') || arabicLower.includes('شراب') || 
            arabicLower.includes('أكل') || arabicLower.includes('فاكهة') ||
            arabicLower.includes('خضار') || arabicLower.includes('لحم')) {
            return 'food_cooking';
        }
        
        // Numbers
        if (arabicLower.match(/واحد|اثنان|ثلاثة|أربعة|خمسة|ستة|سبعة|ثمانية|تسعة|عشرة/)) {
            return 'numbers_math';
        }
        
        // Time related
        if (arabicLower.includes('وقت') || arabicLower.includes('يوم') || 
            arabicLower.includes('ساعة') || arabicLower.includes('شهر') ||
            arabicLower.includes('سنة') || arabicLower.includes('أسبوع')) {
            return 'time_calendar';
        }
        
        // Default to general vocabulary
        return 'general_vocabulary';
    }
    
    /**
     * Create sessions of 10 words each within a category
     */
    createSessions(categoryWords, categoryId) {
        const sessions = [];
        const wordsPerSession = this.wordsPerSession;
        
        // Sort by difficulty level first (A1, A2, B1, B2, C1, C2)
        const difficultyOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
        categoryWords.sort((a, b) => {
            const diffA = difficultyOrder[a.difficultyLevel] || 999;
            const diffB = difficultyOrder[b.difficultyLevel] || 999;
            return diffA - diffB;
        });
        
        // Create sessions of 10 words each
        for (let i = 0; i < categoryWords.length; i += wordsPerSession) {
            const sessionWords = categoryWords.slice(i, i + wordsPerSession);
            const sessionNumber = Math.floor(i / wordsPerSession) + 1;
            
            const session = {
                sessionId: `${categoryId}_session_${sessionNumber}`,
                sessionNumber: sessionNumber,
                categoryId: categoryId,
                words: sessionWords,
                wordCount: sessionWords.length,
                difficultyRange: this.getSessionDifficultyRange(sessionWords),
                estimatedTime: Math.ceil(sessionWords.length * 2.5), // 2.5 minutes per word
                unlocked: sessionNumber === 1 // First session is always unlocked
            };
            
            sessions.push(session);
        }
        
        return sessions;
    }
    
    /**
     * Get difficulty range for a session
     */
    getSessionDifficultyRange(words) {
        const levels = words.map(w => w.difficultyLevel).filter(Boolean);
        if (levels.length === 0) return 'Mixed';
        
        const uniqueLevels = [...new Set(levels)];
        if (uniqueLevels.length === 1) return uniqueLevels[0];
        
        return `${uniqueLevels[0]}-${uniqueLevels[uniqueLevels.length - 1]}`;
    }
    
    /**
     * Generate enhanced pronunciation
     */
    generatePronunciation(turkishWord) {
        return turkishWord
            .replace(/ç/g, 'CH')
            .replace(/ş/g, 'SH')
            .replace(/ğ/g, '')
            .replace(/ı/g, 'I')
            .replace(/ö/g, 'Ö')
            .replace(/ü/g, 'Ü')
            .toUpperCase()
            .split('')
            .join('-');
    }
    
    /**
     * Generate contextual icon for word
     */
    generateWordIcon(word, category) {
        const iconMappings = {
            // Family
            'anne': '👩', 'baba': '👨', 'çocuk': '👶', 'aile': '👨‍👩‍👧‍👦',
            
            // Food
            'ekmek': '🍞', 'su': '💧', 'çay': '🫖', 'kahve': '☕', 'balık': '🐟',
            
            // Animals
            'kuş': '🐦', 'kedi': '🐱', 'köpek': '🐕', 'aslan': '🦁',
            
            // Transportation
            'araba': '🚗', 'uçak': '✈️', 'tren': '🚂', 'otobüs': '🚌',
            
            // Numbers
            'bir': '1️⃣', 'iki': '2️⃣', 'üç': '3️⃣', 'dört': '4️⃣', 'beş': '5️⃣',
            
            // Time
            'saat': '🕐', 'gün': '📅', 'ay': '📆', 'yıl': '🗓️',
            
            // Default category icons
            'greetings_basics': '👋',
            'family_relationships': '👨‍👩‍👧‍👦',
            'body_health': '🏥',
            'food_cooking': '🍽️',
            'clothing_fashion': '👕',
            'transport_travel': '🚗',
            'home_living': '🏠',
            'work_education': '🎓',
            'shopping_commerce': '🛒',
            'nature_weather': '🌿',
            'technology_modern': '📱',
            'colors_descriptions': '🎨',
            'time_calendar': '⏰',
            'numbers_math': '🔢',
            'arts_culture': '🎭',
            'sports_recreation': '⚽',
            'legal_government': '⚖️',
            'emergency_safety': '🚨',
            'science_research': '🔬',
            'general_vocabulary': '📚'
        };
        
        // Try specific word match first
        if (iconMappings[word.toLowerCase()]) {
            return iconMappings[word.toLowerCase()];
        }
        
        // Fall back to category icon
        return iconMappings[category] || '📚';
    }
    
    /**
     * Main processing function
     */
    async processData() {
        try {
            console.log('🚀 Starting Enhanced Turkish Categorization with Sessions...\n');
            
            // Read and parse CSV
            const csvData = fs.readFileSync(this.csvFile, 'utf-8');
            const lines = csvData.split('\n').filter(line => line.trim());
            
            console.log(`📊 Loaded ${lines.length} lines from CSV`);
            this.stats.totalRows = lines.length - 1; // Exclude header
            
            const processedWords = new Set();
            const categorizedData = {};
            const allSessions = {};
            
            // Initialize categories
            Object.keys(this.advancedCategories).forEach(categoryId => {
                categorizedData[categoryId] = [];
            });
            
            // Process each line
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                try {
                    const [word, difficulty, vowelHarmony, arabic, turkishExample, arabicExample] = 
                        line.split(',').map(field => field.replace(/\r/g, '').trim());
                    
                    if (!word || word === 'Word') continue;
                    
                    // Skip duplicates
                    const wordKey = word.toLowerCase();
                    if (processedWords.has(wordKey)) {
                        this.stats.duplicates++;
                        continue;
                    }
                    
                    processedWords.add(wordKey);
                    
                    // Categorize the word
                    const category = this.categorizeWord(word, arabic);
                    
                    // Create enhanced word object
                    const enhancedWord = {
                        id: this.stats.processedWords + 1,
                        turkish: word,
                        arabic: arabic || '',
                        english: 'word', // Placeholder - could be enhanced with translation API
                        pronunciation: this.generatePronunciation(word),
                        example: turkishExample || `${word} örneği`,
                        exampleArabic: arabicExample || `مثال ${arabic}`,
                        category: category,
                        difficultyLevel: difficulty || 'A1',
                        vowelHarmony: vowelHarmony || 'Mixed',
                        icon: this.generateWordIcon(word, category),
                        emoji: this.generateWordIcon(word, category),
                        sessionReady: true
                    };
                    
                    categorizedData[category].push(enhancedWord);
                    this.stats.processedWords++;
                    
                    // Update statistics
                    this.stats.categories.set(category, 
                        (this.stats.categories.get(category) || 0) + 1);
                    this.stats.difficultyLevels.set(difficulty, 
                        (this.stats.difficultyLevels.get(difficulty) || 0) + 1);
                    this.stats.vowelHarmonyTypes.set(vowelHarmony, 
                        (this.stats.vowelHarmonyTypes.get(vowelHarmony) || 0) + 1);
                    
                } catch (error) {
                    console.warn(`⚠️  Error processing line ${i}: ${error.message}`);
                }
            }
            
            // Create sessions for each category
            console.log('\n📚 Creating learning sessions...');
            let totalSessions = 0;
            
            Object.keys(categorizedData).forEach(categoryId => {
                const categoryWords = categorizedData[categoryId];
                if (categoryWords.length > 0) {
                    const sessions = this.createSessions(categoryWords, categoryId);
                    allSessions[categoryId] = sessions;
                    totalSessions += sessions.length;
                    this.stats.sessions.set(categoryId, sessions.length);
                    
                    console.log(`  ${categoryId}: ${categoryWords.length} words → ${sessions.length} sessions`);
                }
            });
            
            // Generate output
            console.log('\n📝 Generating enhanced database with sessions...');
            this.generateEnhancedOutput(categorizedData, allSessions);
            
            // Print final statistics
            this.printStatistics(totalSessions);
            
        } catch (error) {
            console.error('❌ Error processing Turkish data:', error);
            throw error;
        }
    }
    
    /**
     * Generate enhanced output file with sessions
     */
    generateEnhancedOutput(categorizedData, allSessions) {
        const categoriesMetadata = {};
        
        // Generate category metadata
        Object.entries(this.advancedCategories).forEach(([categoryId, categoryInfo]) => {
            const wordCount = categorizedData[categoryId]?.length || 0;
            const sessionCount = allSessions[categoryId]?.length || 0;
            
            if (wordCount > 0) {
                categoriesMetadata[categoryId] = {
                    id: categoryId,
                    name: categoryInfo.name,
                    nameArabic: categoryInfo.nameArabic,
                    icon: categoryInfo.icon,
                    wordCount: wordCount,
                    sessionCount: sessionCount,
                    estimatedTime: sessionCount * 25 // 25 minutes per session average
                };
            }
        });
        
        const output = `// 🎯 Enhanced Turkish Vocabulary Database with Session System
// Generated with advanced categorization and 10-words-per-session structure
// Total words: ${this.stats.processedWords} | Categories: ${Object.keys(categoriesMetadata).length} | Sessions: ${Object.values(allSessions).flat().length}

// Enhanced vocabulary data organized by categories and sessions
const enhancedVocabularyData = ${JSON.stringify(categorizedData, null, 2)};

// Learning sessions (10 words each) organized by category
const vocabularySessions = ${JSON.stringify(allSessions, null, 2)};

// Category metadata with session information
const categoryMetadata = ${JSON.stringify(categoriesMetadata, null, 2)};

// Enhanced vocabulary metadata
const vocabularyMetadata = {
    totalWords: ${this.stats.processedWords},
    totalCategories: ${Object.keys(categoriesMetadata).length},
    totalSessions: ${Object.values(allSessions).flat().length},
    wordsPerSession: ${this.wordsPerSession},
    difficultyLevels: ${JSON.stringify(Object.fromEntries(this.stats.difficultyLevels))},
    vowelHarmonyTypes: ${JSON.stringify(Object.fromEntries(this.stats.vowelHarmonyTypes))},
    categoryDistribution: ${JSON.stringify(Object.fromEntries(this.stats.categories))},
    sessionDistribution: ${JSON.stringify(Object.fromEntries(this.stats.sessions))},
    generatedAt: '${new Date().toISOString()}',
    sourceFile: 'Turkish Language Data.csv',
    processingVersion: '2.0-sessions'
};

// Difficulty level information with session context
const difficultyLevels = {
    'A1': {
        name: 'Beginner',
        nameArabic: 'مبتدئ',
        description: 'Basic everyday expressions and vocabulary',
        color: '#4CAF50',
        sessionRecommendation: 'Complete 1-2 sessions per day'
    },
    'A2': {
        name: 'Elementary',
        nameArabic: 'أساسي',
        description: 'Common expressions and routine task vocabulary',
        color: '#8BC34A',
        sessionRecommendation: 'Complete 2-3 sessions per day'
    },
    'B1': {
        name: 'Intermediate',
        nameArabic: 'متوسط',
        description: 'Standard situations and personal interest topics',
        color: '#FF9800',
        sessionRecommendation: 'Complete 1-2 sessions per day with review'
    },
    'B2': {
        name: 'Upper Intermediate',
        nameArabic: 'فوق المتوسط',
        description: 'Complex texts and specialized topics',
        color: '#FF5722',
        sessionRecommendation: 'Complete 1 session per day with intensive review'
    },
    'C1': {
        name: 'Advanced',
        nameArabic: 'متقدم',
        description: 'Complex and demanding texts',
        color: '#E91E63',
        sessionRecommendation: 'Focus on contextual usage and nuances'
    },
    'C2': {
        name: 'Proficient',
        nameArabic: 'خبير',
        description: 'Native-like understanding and expression',
        color: '#9C27B0',
        sessionRecommendation: 'Master advanced expressions and idioms'
    }
};

// Vowel harmony rules with examples
const vowelHarmonyRules = {
    'I-type (back)': {
        description: 'Back vowels: a, ı, o, u',
        descriptionArabic: 'حروف العلة الخلفية',
        example: 'kitap → kitabım (my book)',
        exampleArabic: 'كتاب ← كتابي'
    },
    'E-type (front)': {
        description: 'Front vowels: e, i, ö, ü',
        descriptionArabic: 'حروف العلة الأمامية',
        example: 'ev → evim (my house)',
        exampleArabic: 'بيت ← بيتي'
    },
    'Mixed': {
        description: 'Words that do not follow standard vowel harmony',
        descriptionArabic: 'كلمات لا تتبع قواعد الانسجام الصوتي',
        example: 'elma → elmam (my apple)',
        exampleArabic: 'تفاحة ← تفاحتي'
    }
};

// Session management utilities
const SessionManager = {
    getSessionsByCategory: function(categoryId) {
        return vocabularySessions[categoryId] || [];
    },
    
    getSessionById: function(sessionId) {
        for (const categoryId in vocabularySessions) {
            const sessions = vocabularySessions[categoryId];
            const session = sessions.find(s => s.sessionId === sessionId);
            if (session) return session;
        }
        return null;
    },
    
    getNextSession: function(categoryId, currentSessionNumber) {
        const sessions = this.getSessionsByCategory(categoryId);
        return sessions.find(s => s.sessionNumber === currentSessionNumber + 1) || null;
    },
    
    getCategoryProgress: function(categoryId, completedSessions = []) {
        const sessions = this.getSessionsByCategory(categoryId);
        const completed = sessions.filter(s => completedSessions.includes(s.sessionId));
        return {
            totalSessions: sessions.length,
            completedSessions: completed.length,
            percentage: Math.round((completed.length / sessions.length) * 100),
            nextSession: sessions.find(s => !completedSessions.includes(s.sessionId))
        };
    }
};

// Export for use by learning modules
if (typeof window !== 'undefined') {
    window.enhancedVocabularyData = enhancedVocabularyData;
    window.vocabularySessions = vocabularySessions;
    window.categoryMetadata = categoryMetadata;
    window.vocabularyMetadata = vocabularyMetadata;
    window.difficultyLevels = difficultyLevels;
    window.vowelHarmonyRules = vowelHarmonyRules;
    window.SessionManager = SessionManager;
    
    console.log('🎯 Enhanced vocabulary database with sessions loaded:', vocabularyMetadata);
} else {
    module.exports = { 
        enhancedVocabularyData,
        vocabularySessions,
        categoryMetadata,
        vocabularyMetadata,
        difficultyLevels,
        vowelHarmonyRules,
        SessionManager
    };
}`;
        
        fs.writeFileSync(this.outputFile, output, 'utf-8');
    }
    
    /**
     * Print processing statistics
     */
    printStatistics(totalSessions) {
        console.log('\n📊 Processing Statistics:');
        console.log(`Total rows processed: ${this.stats.totalRows}`);
        console.log(`Words processed: ${this.stats.processedWords}`);
        console.log(`Duplicates removed: ${this.stats.duplicates}`);
        console.log(`Total sessions created: ${totalSessions}`);
        
        console.log('\n📂 Enhanced Categories:');
        [...this.stats.categories.entries()]
            .sort(([,a], [,b]) => b - a)
            .forEach(([category, count]) => {
                const categoryInfo = this.advancedCategories[category];
                const sessions = this.stats.sessions.get(category) || 0;
                console.log(`  ${categoryInfo?.nameArabic || category}: ${count} words (${sessions} sessions)`);
            });
        
        console.log('\n📈 Difficulty Levels:');
        ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].forEach(level => {
            const count = this.stats.difficultyLevels.get(level) || 0;
            if (count > 0) {
                console.log(`  ${level}: ${count} words`);
            }
        });
        
        console.log(`\n✅ Enhanced database with sessions saved to: ${this.outputFile}`);
        console.log('\n🎉 Enhanced categorization and session system completed successfully!');
        console.log(`🎯 Ready for session-based learning with ${this.wordsPerSession} words per session!`);
    }
}

// Execute the enhanced categorization
const categorizer = new EnhancedTurkishCategorizer();
categorizer.processData().catch(console.error);