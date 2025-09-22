/**
 * Database Migration Utilities
 * Handles database schema migrations and seeding
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { executeQuery, executeTransaction } from './db.js';

/**
 * Run the initial database schema
 */
export async function runMigrations(): Promise<void> {
    try {
        console.log('🔄 Running database migrations...');
        
        // Read the schema file
        const schemaPath = join(process.cwd(), 'database', 'schema.sql');
        const schema = readFileSync(schemaPath, 'utf8');
        
        // Split into individual statements
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        // Execute each statement
        for (const statement of statements) {
            if (statement.trim()) {
                await executeQuery(statement);
            }
        }
        
        console.log('✅ Database migrations completed successfully');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

/**
 * Seed the database with sample data
 */
export async function seedDatabase(): Promise<void> {
    try {
        console.log('🌱 Seeding database with sample data...');
        
        // Sample vocabulary data
        const sampleVocabulary = [
            // Greetings
            { category_id: 1, turkish_text: 'Merhaba', english_text: 'Hello', word_type: 'expression', difficulty_level: 'beginner' },
            { category_id: 1, turkish_text: 'Günaydın', english_text: 'Good morning', word_type: 'expression', difficulty_level: 'beginner' },
            { category_id: 1, turkish_text: 'İyi akşamlar', english_text: 'Good evening', word_type: 'expression', difficulty_level: 'beginner' },
            { category_id: 1, turkish_text: 'Hoşça kal', english_text: 'Goodbye', word_type: 'expression', difficulty_level: 'beginner' },
            { category_id: 1, turkish_text: 'Teşekkür ederim', english_text: 'Thank you', word_type: 'expression', difficulty_level: 'beginner' },
            
            // Family
            { category_id: 2, turkish_text: 'Anne', english_text: 'Mother', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 2, turkish_text: 'Baba', english_text: 'Father', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 2, turkish_text: 'Kardeş', english_text: 'Sibling', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 2, turkish_text: 'Çocuk', english_text: 'Child', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 2, turkish_text: 'Aile', english_text: 'Family', word_type: 'noun', difficulty_level: 'beginner' },
            
            // Food & Drink
            { category_id: 3, turkish_text: 'Su', english_text: 'Water', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 3, turkish_text: 'Ekmek', english_text: 'Bread', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 3, turkish_text: 'Çay', english_text: 'Tea', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 3, turkish_text: 'Kahve', english_text: 'Coffee', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 3, turkish_text: 'Yemek', english_text: 'Food/Meal', word_type: 'noun', difficulty_level: 'beginner' },
            
            // Numbers
            { category_id: 4, turkish_text: 'Bir', english_text: 'One', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 4, turkish_text: 'İki', english_text: 'Two', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 4, turkish_text: 'Üç', english_text: 'Three', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 4, turkish_text: 'Dört', english_text: 'Four', word_type: 'noun', difficulty_level: 'beginner' },
            { category_id: 4, turkish_text: 'Beş', english_text: 'Five', word_type: 'noun', difficulty_level: 'beginner' },
            
            // Colors
            { category_id: 5, turkish_text: 'Kırmızı', english_text: 'Red', word_type: 'adjective', difficulty_level: 'beginner' },
            { category_id: 5, turkish_text: 'Mavi', english_text: 'Blue', word_type: 'adjective', difficulty_level: 'beginner' },
            { category_id: 5, turkish_text: 'Yeşil', english_text: 'Green', word_type: 'adjective', difficulty_level: 'beginner' },
            { category_id: 5, turkish_text: 'Sarı', english_text: 'Yellow', word_type: 'adjective', difficulty_level: 'beginner' },
            { category_id: 5, turkish_text: 'Beyaz', english_text: 'White', word_type: 'adjective', difficulty_level: 'beginner' },
        ];
        
        // Insert vocabulary
        for (const vocab of sampleVocabulary) {
            await executeQuery(
                `INSERT INTO vocabulary (category_id, turkish_text, english_text, word_type, difficulty_level, is_active, created_at) 
                 VALUES (?, ?, ?, ?, ?, 1, NOW())`,
                [vocab.category_id, vocab.turkish_text, vocab.english_text, vocab.word_type, vocab.difficulty_level]
            );
        }
        
        // Sample lessons
        const sampleLessons = [
            { category_id: 1, title: 'Basic Greetings', title_tr: 'Temel Selamlaşma', difficulty_level: 'beginner', estimated_duration: 5 },
            { category_id: 2, title: 'Family Members', title_tr: 'Aile Üyeleri', difficulty_level: 'beginner', estimated_duration: 8 },
            { category_id: 3, title: 'Basic Food & Drinks', title_tr: 'Temel Yiyecek ve İçecekler', difficulty_level: 'beginner', estimated_duration: 10 },
            { category_id: 4, title: 'Numbers 1-10', title_tr: 'Sayılar 1-10', difficulty_level: 'beginner', estimated_duration: 6 },
            { category_id: 5, title: 'Basic Colors', title_tr: 'Temel Renkler', difficulty_level: 'beginner', estimated_duration: 7 },
        ];
        
        for (const lesson of sampleLessons) {
            await executeQuery(
                `INSERT INTO lessons (category_id, title, title_tr, difficulty_level, estimated_duration, is_active, created_at) 
                 VALUES (?, ?, ?, ?, ?, 1, NOW())`,
                [lesson.category_id, lesson.title, lesson.title_tr, lesson.difficulty_level, lesson.estimated_duration]
            );
        }
        
        console.log('✅ Database seeding completed successfully');
    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        throw error;
    }
}

/**
 * Check if database needs to be initialized
 */
export async function isDatabaseInitialized(): Promise<boolean> {
    try {
        // Check if users table exists
        const result = await executeQuery(
            "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'"
        );
        return result[0].count > 0;
    } catch (error) {
        return false;
    }
}

/**
 * Initialize database if needed
 */
export async function initializeDatabase(): Promise<void> {
    try {
        const isInitialized = await isDatabaseInitialized();
        
        if (!isInitialized) {
            console.log('📦 Database not initialized. Running setup...');
            await runMigrations();
            await seedDatabase();
            console.log('🎉 Database initialization completed!');
        } else {
            console.log('✅ Database already initialized');
        }
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
}

/**
 * Reset database (DROP ALL DATA - Use with caution!)
 */
export async function resetDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Cannot reset database in production environment');
    }
    
    try {
        console.log('🚨 RESETTING DATABASE - ALL DATA WILL BE LOST!');
        
        // Get all table names
        const tables = await executeQuery(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()"
        );
        
        // Disable foreign key checks
        await executeQuery('SET FOREIGN_KEY_CHECKS = 0');
        
        // Drop all tables
        for (const table of tables) {
            await executeQuery(`DROP TABLE IF EXISTS ${table.table_name}`);
        }
        
        // Re-enable foreign key checks
        await executeQuery('SET FOREIGN_KEY_CHECKS = 1');
        
        // Run migrations and seeding
        await runMigrations();
        await seedDatabase();
        
        console.log('✅ Database reset completed');
    } catch (error) {
        console.error('❌ Database reset failed:', error);
        throw error;
    }
}

/**
 * Backup database to SQL file
 */
export async function backupDatabase(backupPath?: string): Promise<string> {
    // This would typically use mysqldump command
    // For now, we'll just export the schema
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = backupPath || `backup-${timestamp}.sql`;
    
    console.log(`📦 Database backup functionality would create: ${filename}`);
    console.log('💡 Use mysqldump command for full backups in production');
    
    return filename;
}