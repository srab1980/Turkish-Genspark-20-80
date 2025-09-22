/**
 * Database Configuration for Turkish Learning App
 * MySQL connection and query utilities
 */

import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'turkish_learning_app',
    charset: 'utf8mb4',
    timezone: '+00:00',
    
    // Connection pool settings
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
    acquireTimeout: 60000,
    timeout: 60000,
    
    // MySQL specific settings
    supportBigNumbers: true,
    bigNumberStrings: true,
    dateStrings: false,
    
    // SSL configuration (enable for production)
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: true
    } : undefined
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Execute a query with parameters
 * @param {string} query - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export async function executeQuery(query: string, params: any[] = []): Promise<any> {
    try {
        const [rows] = await pool.execute(query, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * Execute multiple queries in a transaction
 * @param {Array} queries - Array of {query, params} objects
 * @returns {Promise<Array>} Array of query results
 */
export async function executeTransaction(queries: Array<{query: string, params?: any[]}>): Promise<any[]> {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const results = [];
        for (const {query, params = []} of queries) {
            const [rows] = await connection.execute(query, params);
            results.push(rows);
        }
        
        await connection.commit();
        return results;
    } catch (error) {
        await connection.rollback();
        console.error('Transaction error:', error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Get a single row by ID
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @param {Array} columns - Columns to select
 * @returns {Promise<Object|null>} Single record or null
 */
export async function findById(table: string, id: number, columns: string[] = ['*']): Promise<any> {
    const columnList = columns.join(', ');
    const query = `SELECT ${columnList} FROM ${table} WHERE id = ? AND is_active = 1 LIMIT 1`;
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? rows[0] : null;
}

/**
 * Get multiple rows with pagination
 * @param {string} table - Table name
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Paginated results
 */
export async function findMany(table: string, options: {
    where?: string,
    params?: any[],
    columns?: string[],
    orderBy?: string,
    limit?: number,
    offset?: number
} = {}): Promise<{data: any[], total: number}> {
    const {
        where = '',
        params = [],
        columns = ['*'],
        orderBy = 'id DESC',
        limit = 20,
        offset = 0
    } = options;
    
    const columnList = columns.join(', ');
    const whereClause = where ? `WHERE ${where}` : '';
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM ${table} ${whereClause}`;
    const countResult = await executeQuery(countQuery, params);
    const total = countResult[0].total;
    
    // Get paginated data
    const dataQuery = `
        SELECT ${columnList} 
        FROM ${table} 
        ${whereClause} 
        ORDER BY ${orderBy} 
        LIMIT ? OFFSET ?
    `;
    const data = await executeQuery(dataQuery, [...params, limit, offset]);
    
    return { data, total };
}

/**
 * Insert a new record
 * @param {string} table - Table name
 * @param {Object} data - Data to insert
 * @returns {Promise<number>} Inserted record ID
 */
export async function insert(table: string, data: Record<string, any>): Promise<number> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => '?').join(', ');
    
    const query = `
        INSERT INTO ${table} (${columns.join(', ')}) 
        VALUES (${placeholders})
    `;
    
    const result: any = await executeQuery(query, values);
    return result.insertId;
}

/**
 * Update a record by ID
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @param {Object} data - Data to update
 * @returns {Promise<boolean>} Success status
 */
export async function updateById(table: string, id: number, data: Record<string, any>): Promise<boolean> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    
    const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    const result: any = await executeQuery(query, [...values, id]);
    
    return result.affectedRows > 0;
}

/**
 * Soft delete a record by ID
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @returns {Promise<boolean>} Success status
 */
export async function softDelete(table: string, id: number): Promise<boolean> {
    return updateById(table, id, { is_active: false });
}

/**
 * Hard delete a record by ID
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteById(table: string, id: number): Promise<boolean> {
    const query = `DELETE FROM ${table} WHERE id = ?`;
    const result: any = await executeQuery(query, [id]);
    return result.affectedRows > 0;
}

/**
 * Check database connection
 * @returns {Promise<boolean>} Connection status
 */
export async function checkConnection(): Promise<boolean> {
    try {
        await executeQuery('SELECT 1');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

/**
 * Close database connection pool
 */
export async function closeConnection(): Promise<void> {
    await pool.end();
}

// Database utility functions for the Turkish Learning App

/**
 * User-specific database operations
 */
export const UserDB = {
    async findByEmail(email: string) {
        const query = 'SELECT * FROM users WHERE email = ? AND is_active = 1';
        const rows = await executeQuery(query, [email]);
        return rows.length > 0 ? rows[0] : null;
    },
    
    async findByGoogleId(googleId: string) {
        const query = 'SELECT * FROM users WHERE google_id = ? AND is_active = 1';
        const rows = await executeQuery(query, [googleId]);
        return rows.length > 0 ? rows[0] : null;
    },
    
    async createUser(userData: any) {
        return insert('users', {
            ...userData,
            created_at: new Date(),
            updated_at: new Date()
        });
    },
    
    async updateLastLogin(userId: number) {
        return updateById('users', userId, { 
            last_login_at: new Date(),
            updated_at: new Date()
        });
    }
};

/**
 * Learning progress database operations
 */
export const ProgressDB = {
    async getUserStats(userId: number) {
        return findById('user_stats', userId);
    },
    
    async updateUserStats(userId: number, stats: any) {
        const existing = await this.getUserStats(userId);
        if (existing) {
            return updateById('user_stats', userId, stats);
        } else {
            return insert('user_stats', { user_id: userId, ...stats });
        }
    },
    
    async getVocabularyProgress(userId: number, vocabularyId: number) {
        const query = `
            SELECT * FROM user_vocabulary_progress 
            WHERE user_id = ? AND vocabulary_id = ?
        `;
        const rows = await executeQuery(query, [userId, vocabularyId]);
        return rows.length > 0 ? rows[0] : null;
    },
    
    async updateVocabularyProgress(userId: number, vocabularyId: number, progress: any) {
        const existing = await this.getVocabularyProgress(userId, vocabularyId);
        if (existing) {
            const query = `
                UPDATE user_vocabulary_progress 
                SET ${Object.keys(progress).map(k => `${k} = ?`).join(', ')}, last_seen_at = NOW()
                WHERE user_id = ? AND vocabulary_id = ?
            `;
            return executeQuery(query, [...Object.values(progress), userId, vocabularyId]);
        } else {
            return insert('user_vocabulary_progress', {
                user_id: userId,
                vocabulary_id: vocabularyId,
                ...progress
            });
        }
    }
};

/**
 * Session database operations
 */
export const SessionDB = {
    async createSession(sessionData: any) {
        return insert('learning_sessions', {
            ...sessionData,
            started_at: new Date()
        });
    },
    
    async completeSession(sessionId: number, completionData: any) {
        return updateById('learning_sessions', sessionId, {
            ...completionData,
            completed_at: new Date()
        });
    },
    
    async addSessionResponse(sessionId: number, responseData: any) {
        return insert('session_responses', {
            session_id: sessionId,
            ...responseData
        });
    }
};

export default pool;