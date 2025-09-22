#!/usr/bin/env node

/**
 * Database Test Script
 * Tests basic database operations
 */

import 'dotenv/config';
import { User, Vocabulary, Category, Progress, Session, DB_PATH } from '../src/database/db-connector.js';

console.log('🧪 Testing Turkish Learning App Database');
console.log('=====================================');
console.log(`📍 Database: ${DB_PATH}`);
console.log('');

async function testDatabase() {
    try {
        // Test 1: Get all categories
        console.log('📁 Testing Categories...');
        const categories = await Category.getAll();
        console.log(`✅ Found ${categories.length} categories:`);
        categories.slice(0, 3).forEach(cat => {
            console.log(`   - ${cat.name} (${cat.name_tr})`);
        });
        console.log('');

        // Test 2: Get vocabulary from a category
        console.log('📚 Testing Vocabulary...');
        const vocabulary = await Vocabulary.getByCategory(1, 5); // Greetings
        console.log(`✅ Found ${vocabulary.length} words in Greetings category:`);
        vocabulary.forEach(word => {
            console.log(`   - ${word.turkish_text} = ${word.english_text}`);
        });
        console.log('');

        // Test 3: Get random vocabulary
        console.log('🎲 Testing Random Vocabulary...');
        const randomWords = await Vocabulary.getRandom(3);
        console.log(`✅ Found ${randomWords.length} random words:`);
        randomWords.forEach(word => {
            console.log(`   - ${word.turkish_text} = ${word.english_text}`);
        });
        console.log('');

        // Test 4: Search functionality
        console.log('🔍 Testing Search...');
        const searchResults = await Vocabulary.search('mer');
        console.log(`✅ Search for "mer" found ${searchResults.length} results:`);
        searchResults.forEach(word => {
            console.log(`   - ${word.turkish_text} = ${word.english_text}`);
        });
        console.log('');

        // Test 5: Create a test user
        console.log('👤 Testing User Operations...');
        try {
            const userId = await User.create({
                email: 'test@example.com',
                username: 'testuser',
                name: 'Test User',
                password_hash: 'dummy_hash'
            });
            console.log(`✅ Created test user with ID: ${userId}`);

            // Get user stats
            const stats = await Progress.getUserStats(userId);
            console.log(`✅ User stats: Level ${stats.level}, XP: ${stats.total_xp}`);

            // Update user stats
            await Progress.updateUserStats(userId, {
                total_xp: 100,
                level: 2,
                words_learned: 5
            });
            console.log('✅ Updated user stats');

            // Test vocabulary progress
            await Progress.updateVocabularyProgress(userId, 1, {
                mastery_level: 'learning',
                confidence_score: 0.75,
                times_seen: 3,
                times_correct: 2
            });
            console.log('✅ Updated vocabulary progress');

            // Create a learning session
            const sessionId = await Session.create({
                user_id: userId,
                session_type: 'flashcard',
                category_id: 1,
                total_questions: 5,
                correct_answers: 4,
                incorrect_answers: 1,
                accuracy_percentage: 80.0,
                duration_seconds: 120,
                xp_earned: 40,
                coins_earned: 10
            });
            console.log(`✅ Created learning session with ID: ${sessionId}`);

            // Get user sessions
            const sessions = await Session.getUserSessions(userId, 5);
            console.log(`✅ Found ${sessions.length} user sessions`);

        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                console.log('ℹ️ Test user already exists (this is normal)');
            } else {
                throw error;
            }
        }

        console.log('');
        console.log('🎉 All database tests passed successfully!');
        console.log('✅ Your Turkish Learning App database is ready to use!');

    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        process.exit(1);
    }
}

testDatabase();