#!/usr/bin/env node

/**
 * Database Setup Script
 * Supports both MySQL (production) and SQLite (development)
 */

import 'dotenv/config';
import { initializeSQLiteDatabase, checkSQLiteDatabase, resetSQLiteDatabase } from '../src/database/sqlite-db.js';

const command = process.argv[2];
const useMySQL = process.argv.includes('--mysql') || process.env.USE_MYSQL === 'true';

async function main() {
    console.log('🚀 Turkish Learning App - Database Setup');
    console.log('=====================================');
    
    if (useMySQL) {
        console.log('🐬 Using MySQL database...');
        console.log('⚠️ MySQL support requires manual installation and configuration.');
        console.log('Please install MySQL and update your .env file with connection details.');
        return;
    } else {
        console.log('📦 Using SQLite database for development...');
    }
    
    try {
        switch (command) {
            case 'init':
                console.log('📦 Initializing database...');
                const exists = await checkSQLiteDatabase();
                if (exists) {
                    console.log('ℹ️ Database already exists. Use "npm run db:reset" to recreate.');
                } else {
                    await initializeSQLiteDatabase();
                }
                break;
                
            case 'reset':
                console.log('🚨 Resetting database (ALL DATA WILL BE LOST)...');
                await resetSQLiteDatabase();
                break;
                
            case 'check':
                const isInitialized = await checkSQLiteDatabase();
                if (isInitialized) {
                    console.log('✅ SQLite database is ready!');
                } else {
                    console.log('❌ Database not found. Run "npm run db:init" to create it.');
                }
                break;
                
            default:
                console.log('Usage:');
                console.log('  npm run db:init   - Initialize database with schema and sample data');
                console.log('  npm run db:reset  - Reset database (development only)');
                console.log('  npm run db:check  - Check database status');
                console.log('');
                console.log('Options:');
                console.log('  --mysql          - Use MySQL instead of SQLite');
                break;
        }
        
        if (command && ['init', 'reset', 'check'].includes(command)) {
            console.log('🎉 Database operation completed successfully!');
        }
        
    } catch (error) {
        console.error('❌ Database operation failed:', error.message);
        process.exit(1);
    }
}

main();