/**
 * SQLite Database Setup for Development
 * This provides a quick start alternative to MySQL
 */

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';
import fs from 'fs';

// SQLite database path
const DB_PATH = join(process.cwd(), 'data', 'turkish_learning.db');

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Open SQLite database connection
 */
export async function openDatabase() {
    return open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });
}

/**
 * Initialize SQLite database with schema
 */
export async function initializeSQLiteDatabase() {
    try {
        console.log('🔄 Initializing SQLite database...');
        
        const db = await openDatabase();
        
        // Enable foreign keys
        await db.exec('PRAGMA foreign_keys = ON');
        
        // Create tables
        await createTables(db);
        
        // Insert sample data
        await insertSampleData(db);
        
        await db.close();
        
        console.log('✅ SQLite database initialized successfully!');
        console.log(`📍 Database location: ${DB_PATH}`);
        
    } catch (error) {
        console.error('❌ SQLite initialization failed:', error);
        throw error;
    }
}

/**
 * Create database tables
 */
async function createTables(db) {
    const tables = [
        // Users table
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email VARCHAR(255) NOT NULL UNIQUE,
            username VARCHAR(50) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            password_hash VARCHAR(255),
            avatar_url TEXT,
            native_language VARCHAR(10) DEFAULT 'en',
            target_language VARCHAR(10) DEFAULT 'tr',
            level TEXT DEFAULT 'beginner',
            daily_goal INTEGER DEFAULT 10,
            notifications_enabled BOOLEAN DEFAULT 1,
            sound_enabled BOOLEAN DEFAULT 1,
            email_verified BOOLEAN DEFAULT 0,
            is_active BOOLEAN DEFAULT 1,
            is_premium BOOLEAN DEFAULT 0,
            premium_expires_at DATETIME,
            google_id VARCHAR(255) UNIQUE,
            facebook_id VARCHAR(255) UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login_at DATETIME
        )`,
        
        // Categories table
        `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            name_tr VARCHAR(100) NOT NULL,
            description TEXT,
            description_tr TEXT,
            icon VARCHAR(50),
            color VARCHAR(7),
            sort_order INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        
        // Vocabulary table
        `CREATE TABLE IF NOT EXISTS vocabulary (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            turkish_text VARCHAR(255) NOT NULL,
            turkish_pronunciation VARCHAR(255),
            english_text VARCHAR(255),
            english_definition TEXT,
            arabic_text VARCHAR(255),
            example_sentence_tr TEXT,
            example_sentence_en TEXT,
            example_sentence_ar TEXT,
            word_type TEXT DEFAULT 'noun',
            difficulty_level TEXT DEFAULT 'beginner',
            audio_url VARCHAR(255),
            image_url VARCHAR(255),
            svg_icon TEXT,
            frequency_score INTEGER DEFAULT 0,
            tags TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )`,
        
        // User stats table
        `CREATE TABLE IF NOT EXISTS user_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            total_xp INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            coins INTEGER DEFAULT 0,
            sessions_completed INTEGER DEFAULT 0,
            total_study_time_seconds INTEGER DEFAULT 0,
            words_learned INTEGER DEFAULT 0,
            words_mastered INTEGER DEFAULT 0,
            current_streak_days INTEGER DEFAULT 0,
            longest_streak_days INTEGER DEFAULT 0,
            last_activity_date DATE,
            total_questions_answered INTEGER DEFAULT 0,
            total_correct_answers INTEGER DEFAULT 0,
            overall_accuracy REAL DEFAULT 0.0,
            achievements_unlocked INTEGER DEFAULT 0,
            badges_earned INTEGER DEFAULT 0,
            weekly_rank INTEGER,
            monthly_rank INTEGER,
            all_time_rank INTEGER,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
        
        // User vocabulary progress table
        `CREATE TABLE IF NOT EXISTS user_vocabulary_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            vocabulary_id INTEGER NOT NULL,
            mastery_level TEXT DEFAULT 'new',
            confidence_score REAL DEFAULT 0.0,
            times_seen INTEGER DEFAULT 0,
            times_correct INTEGER DEFAULT 0,
            times_incorrect INTEGER DEFAULT 0,
            streak_count INTEGER DEFAULT 0,
            best_streak INTEGER DEFAULT 0,
            next_review_at DATETIME,
            ease_factor REAL DEFAULT 2.5,
            interval_days INTEGER DEFAULT 1,
            first_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            mastered_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id),
            UNIQUE(user_id, vocabulary_id)
        )`,
        
        // Learning sessions table
        `CREATE TABLE IF NOT EXISTS learning_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            session_type TEXT NOT NULL,
            category_id INTEGER,
            lesson_id INTEGER,
            total_questions INTEGER DEFAULT 0,
            correct_answers INTEGER DEFAULT 0,
            incorrect_answers INTEGER DEFAULT 0,
            skipped_answers INTEGER DEFAULT 0,
            accuracy_percentage REAL DEFAULT 0.0,
            duration_seconds INTEGER DEFAULT 0,
            xp_earned INTEGER DEFAULT 0,
            coins_earned INTEGER DEFAULT 0,
            session_data TEXT,
            started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )`
    ];
    
    for (const table of tables) {
        await db.exec(table);
    }
    
    console.log('✅ Tables created successfully');
}

/**
 * Insert sample data
 */
async function insertSampleData(db) {
    // Insert categories
    const categories = [
        ['Greetings', 'Selamlaşma', 'Basic greetings and introductions', 'wave', '#4F46E5', 1],
        ['Family', 'Aile', 'Family members and relationships', 'users', '#059669', 2],
        ['Food & Drink', 'Yemek ve İçecek', 'Food, drinks, and dining', 'utensils', '#DC2626', 3],
        ['Numbers', 'Sayılar', 'Numbers and counting', 'hash', '#7C2D12', 4],
        ['Colors', 'Renkler', 'Colors and descriptions', 'palette', '#9333EA', 5],
        ['Time', 'Zaman', 'Time, dates, and calendar', 'clock', '#0891B2', 6],
        ['Travel', 'Seyahat', 'Travel and transportation', 'plane', '#EA580C', 7],
        ['Shopping', 'Alışveriş', 'Shopping and commerce', 'shopping-cart', '#16A34A', 8],
        ['Work', 'İş', 'Work and professional life', 'briefcase', '#374151', 9],
        ['Daily Life', 'Günlük Yaşam', 'Daily activities and routines', 'home', '#6366F1', 10]
    ];
    
    for (const category of categories) {
        await db.run(
            `INSERT OR IGNORE INTO categories (name, name_tr, description, icon, color, sort_order) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            category
        );
    }
    
    // Insert sample vocabulary
    const vocabulary = [
        // Greetings (category_id: 1)
        [1, 'Merhaba', 'مرحبا', 'Hello', 'expression', 'beginner', 'Merhaba, nasılsın?', 'Hi, how are you?', 'مرحبا، كيف حالك؟', 'fas fa-hand-peace'],
        [1, 'Günaydın', 'صباح الخير', 'Good morning', 'expression', 'beginner', 'Günaydın, iyi misin?', 'Good morning, are you well?', 'صباح الخير، كيف حالك؟', 'fas fa-sun'],
        [1, 'İyi akşamlar', 'مساء الخير', 'Good evening', 'expression', 'beginner', 'İyi akşamlar, nasılsınız?', 'Good evening, how are you?', 'مساء الخير، كيف حالكم؟', 'fas fa-moon'],
        [1, 'Hoşça kal', 'مع السلامة', 'Goodbye', 'expression', 'beginner', 'Hoşça kal, görüşürüz!', 'Goodbye, see you later!', 'مع السلامة، نراكم لاحقاً!', 'fas fa-hand-wave'],
        [1, 'Teşekkür ederim', 'شكراً', 'Thank you', 'expression', 'beginner', 'Teşekkür ederim, çok yardımcı oldun.', 'Thank you, you were very helpful.', 'شكراً لك، لقد كنت مفيداً جداً.', 'fas fa-heart'],
        
        // Family (category_id: 2)
        [2, 'Anne', 'أم', 'Mother', 'noun', 'beginner', 'Annem çok güzel yemek yapar.', 'My mother cooks very well.', 'أمي تطبخ بشكل جميل جداً.', 'fas fa-user'],
        [2, 'Baba', 'أب', 'Father', 'noun', 'beginner', 'Babam her gün gazete okur.', 'My father reads the newspaper every day.', ' papam يقرأ الجريدة كل يوم.', 'fas fa-user'],
        [2, 'Kardeş', 'أخ/أخت', 'Sibling', 'noun', 'beginner', 'Kardeşimle çok iyi anlaşıyorum.', 'I get along very well with my sibling.', 'أتفهم أخي/أختي جيداً.', 'fas fa-users'],
        [2, 'Çocuk', 'طفل', 'Child', 'noun', 'beginner', 'Çocuklar oyun oynamayı sever.', 'Children love to play games.', 'الأطفال يحبون لعب الألعاب.', 'fas fa-child'],
        [2, 'Aile', 'عائلة', 'Family', 'noun', 'beginner', 'Ailemle her hafta sonu buluşuruz.', 'We meet with my family every weekend.', 'نتقابل مع عائلتي كل عطلة نهاية أسبوع.', 'fas fa-home'],
        
        // Food & Drink (category_id: 3)
        [3, 'Su', 'ماء', 'Water', 'noun', 'beginner', 'Su içmek önemlidir.', 'It is important to drink water.', 'من المهم شرب الماء.', 'fas fa-tint'],
        [3, 'Ekmek', 'خبز', 'Bread', 'noun', 'beginner', 'Her sabah ekmek yerim.', 'I eat bread every morning.', 'آكل الخبز كل صباح.', 'fas fa-bread-slice'],
        [3, 'Çay', 'شاي', 'Tea', 'noun', 'beginner', 'Çay içmek çok yaygındır.', 'Drinking tea is very common.', 'شرب الشاي أمر شائع جداً.', 'fas fa-mug-hot'],
        [3, 'Kahve', 'قهوة', 'Coffee', 'noun', 'beginner', 'Kahve sabahları harikadır.', 'Coffee is great in the mornings.', 'القهوة رائعة في الصباح.', 'fas fa-coffee'],
        [3, 'Yemek', 'طعام', 'Food/Meal', 'noun', 'beginner', 'Bugün ne yemek yapmalıyım?', 'What should I cook today?', 'ماذا يجب أن أطبخ اليوم؟', 'fas fa-utensils'],
        
        // Numbers (category_id: 4)
        [4, 'Bir', 'واحد', 'One', 'noun', 'beginner', 'Bir elma alabilir miyim?', 'Can I have an apple?', 'هل يمكنني الحصول على تفاحة؟', 'fas fa-dice-one'],
        [4, 'İki', 'اثنان', 'Two', 'noun', 'beginner', 'İki kitap okudum.', 'I read two books.', 'قرأت كتابين.', 'fas fa-dice-two'],
        [4, 'Üç', 'ثلاثة', 'Three', 'noun', 'beginner', 'Üç çocuk sahibiyim.', 'I have three children.', 'لدي ثلاثة أطفال.', 'fas fa-dice-three'],
        [4, 'Dört', 'أربعة', 'Four', 'noun', 'beginner', 'Dört mevsim vardır.', 'There are four seasons.', 'هناك أربعة فصول.', 'fas fa-dice-four'],
        [4, 'Beş', 'خمسة', 'Five', 'noun', 'beginner', 'Beş dakika bekle.', 'Wait five minutes.', 'انتظر خمس دقائق.', 'fas fa-dice-five'],
        
        // Colors (category_id: 5)
        [5, 'Kırmızı', 'أحمر', 'Red', 'adjective', 'beginner', 'Kırmızı elbise çok güzel.', 'The red dress is very beautiful.', 'الفستان الأحمر جميل جداً.', 'fas fa-circle'],
        [5, 'Mavi', 'أزرق', 'Blue', 'adjective', 'beginner', 'Gökyüzü mavi.', 'The sky is blue.', 'السماء زرقاء.', 'fas fa-circle'],
        [5, 'Yeşil', 'أخضر', 'Green', 'adjective', 'beginner', 'Yeşil renk doğayı andırır.', 'Green color reminds of nature.', 'اللون الأخضر يذكرنا بالطبيعة.', 'fas fa-circle'],
        [5, 'Sarı', 'أصفر', 'Yellow', 'adjective', 'beginner', 'Sarı çiçekler baharı getirir.', 'Yellow flowers bring spring.', 'الزهور الصفراء تجلب الربيع.', 'fas fa-circle'],
        [5, 'Beyaz', 'أبيض', 'White', 'adjective', 'beginner', 'Beyaz kar çok güzel.', 'White snow is very beautiful.', 'الثلج الأبيض جميل جداً.', 'fas fa-circle']
    ];
    
    for (const vocab of vocabulary) {
        await db.run(
            `INSERT OR IGNORE INTO vocabulary (category_id, turkish_text, arabic_text, english_text, word_type, difficulty_level, example_sentence_tr, example_sentence_en, example_sentence_ar, svg_icon) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            vocab
        );
    }
    
    console.log('✅ Sample data inserted successfully');
}

/**
 * Check if SQLite database exists and is initialized
 */
export async function checkSQLiteDatabase() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            return false;
        }
        
        const db = await openDatabase();
        const result = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
        await db.close();
        
        return !!result;
    } catch (error) {
        return false;
    }
}

/**
 * Reset SQLite database
 */
export async function resetSQLiteDatabase() {
    try {
        if (fs.existsSync(DB_PATH)) {
            fs.unlinkSync(DB_PATH);
            console.log('🗑️ Old database deleted');
        }
        
        await initializeSQLiteDatabase();
        console.log('✅ Database reset completed');
    } catch (error) {
        console.error('❌ Database reset failed:', error);
        throw error;
    }
}