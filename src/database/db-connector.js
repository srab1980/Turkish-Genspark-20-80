/**
 * Database Connector - Universal database interface
 * Supports both SQLite (development) and MySQL (production)
 */

import { openDatabase } from './sqlite-db.js';
import { join } from 'path';

const USE_MYSQL = process.env.USE_MYSQL === 'true';
const DB_PATH = join(process.cwd(), 'data', 'turkish_learning.db');

let db = null;

/**
 * Get database connection
 */
export async function getDatabase() {
    if (!db) {
        if (USE_MYSQL) {
            // TODO: Implement MySQL connection when needed
            throw new Error('MySQL support not yet implemented in this connector');
        } else {
            db = await openDatabase();
        }
    }
    return db;
}

/**
 * Execute a query
 */
export async function query(sql, params = []) {
    const database = await getDatabase();
    
    if (sql.trim().toLowerCase().startsWith('select')) {
        return await database.all(sql, params);
    } else {
        return await database.run(sql, params);
    }
}

/**
 * Get a single row
 */
export async function get(sql, params = []) {
    const database = await getDatabase();
    return await database.get(sql, params);
}

/**
 * Get all rows
 */
export async function all(sql, params = []) {
    const database = await getDatabase();
    return await database.all(sql, params);
}

/**
 * Run a query (for INSERT, UPDATE, DELETE)
 */
export async function run(sql, params = []) {
    const database = await getDatabase();
    return await database.run(sql, params);
}

/**
 * Close database connection
 */
export async function close() {
    if (db) {
        await db.close();
        db = null;
    }
}

// Database utility functions for the Turkish Learning App

/**
 * User operations
 */
export const User = {
    async findByEmail(email) {
        return await get('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
    },
    
    async findById(id) {
        return await get('SELECT * FROM users WHERE id = ? AND is_active = 1', [id]);
    },
    
    async create(userData) {
        const result = await run(
            `INSERT INTO users (email, username, name, password_hash, google_id, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [userData.email, userData.username, userData.name, userData.password_hash, userData.google_id]
        );
        return result.lastID;
    },
    
    async updateLastLogin(userId) {
        return await run(
            'UPDATE users SET last_login_at = datetime("now"), updated_at = datetime("now") WHERE id = ?',
            [userId]
        );
    }
};

/**
 * Vocabulary operations
 */
export const Vocabulary = {
    async getByCategory(categoryId, limit = 20) {
        return await all(
            `SELECT * FROM vocabulary 
             WHERE category_id = ? AND is_active = 1 
             ORDER BY frequency_score DESC, id ASC 
             LIMIT ?`,
            [categoryId, limit]
        );
    },
    
    async getRandom(limit = 10) {
        return await all(
            `SELECT * FROM vocabulary 
             WHERE is_active = 1 
             ORDER BY RANDOM() 
             LIMIT ?`,
            [limit]
        );
    },
    
    async search(searchTerm) {
        const term = `%${searchTerm}%`;
        return await all(
            `SELECT * FROM vocabulary 
             WHERE (turkish_text LIKE ? OR english_text LIKE ?) 
             AND is_active = 1 
             ORDER BY frequency_score DESC`,
            [term, term]
        );
    }
};

/**
 * Categories operations
 */
export const Category = {
    async getAll() {
        return await all(
            'SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC'
        );
    },
    
    async getById(id) {
        return await get('SELECT * FROM categories WHERE id = ? AND is_active = 1', [id]);
    }
};

/**
 * User progress operations
 */
export const Progress = {
    async getUserStats(userId) {
        let stats = await get('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
        
        if (!stats) {
            // Create default stats for new user
            await run(
                `INSERT INTO user_stats (user_id, total_xp, level, coins, updated_at) 
                 VALUES (?, 0, 1, 0, datetime('now'))`,
                [userId]
            );
            stats = await get('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
        }
        
        return stats;
    },
    
    async updateUserStats(userId, updates) {
        const updateFields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), userId];
        
        return await run(
            `UPDATE user_stats SET ${updateFields}, updated_at = datetime('now') WHERE user_id = ?`,
            values
        );
    },
    
    async getVocabularyProgress(userId, vocabularyId) {
        return await get(
            'SELECT * FROM user_vocabulary_progress WHERE user_id = ? AND vocabulary_id = ?',
            [userId, vocabularyId]
        );
    },
    
    async updateVocabularyProgress(userId, vocabularyId, progress) {
        const existing = await this.getVocabularyProgress(userId, vocabularyId);
        
        if (existing) {
            const updateFields = Object.keys(progress).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(progress), userId, vocabularyId];
            
            return await run(
                `UPDATE user_vocabulary_progress 
                 SET ${updateFields}, last_seen_at = datetime('now') 
                 WHERE user_id = ? AND vocabulary_id = ?`,
                values
            );
        } else {
            const fields = ['user_id', 'vocabulary_id', ...Object.keys(progress)];
            const placeholders = fields.map(() => '?').join(', ');
            const values = [userId, vocabularyId, ...Object.values(progress)];
            
            return await run(
                `INSERT INTO user_vocabulary_progress (${fields.join(', ')}) 
                 VALUES (${placeholders})`,
                values
            );
        }
    }
};

/**
 * Learning sessions operations
 */
export const Session = {
    async create(sessionData) {
        const result = await run(
            `INSERT INTO learning_sessions 
             (user_id, session_type, category_id, total_questions, correct_answers, 
              incorrect_answers, accuracy_percentage, duration_seconds, xp_earned, 
              coins_earned, started_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
            [
                sessionData.user_id,
                sessionData.session_type,
                sessionData.category_id,
                sessionData.total_questions,
                sessionData.correct_answers,
                sessionData.incorrect_answers,
                sessionData.accuracy_percentage,
                sessionData.duration_seconds,
                sessionData.xp_earned,
                sessionData.coins_earned
            ]
        );
        return result.lastID;
    },
    
    async complete(sessionId, completionData) {
        const updateFields = Object.keys(completionData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(completionData), sessionId];
        
        return await run(
            `UPDATE learning_sessions 
             SET ${updateFields}, completed_at = datetime('now') 
             WHERE id = ?`,
            values
        );
    },
    
    async getUserSessions(userId, limit = 10) {
        return await all(
            `SELECT ls.*, c.name as category_name 
             FROM learning_sessions ls 
             LEFT JOIN categories c ON ls.category_id = c.id 
             WHERE ls.user_id = ? 
             ORDER BY ls.started_at DESC 
             LIMIT ?`,
            [userId, limit]
        );
    }
};

// Export database path for debugging
export { DB_PATH };