#!/usr/bin/env node

/**
 * Reset User Statistics
 * Resets user stats to 0 for accurate testing
 */

import 'dotenv/config';
import { run } from '../src/database/db-connector.js';

async function resetUserStats() {
    try {
        console.log('🔄 Resetting user statistics to zero...');
        
        // Update user stats to start fresh
        await run(`
            UPDATE user_stats SET 
                total_xp = 0,
                level = 1,
                coins = 0,
                sessions_completed = 0,
                total_study_time_seconds = 0,
                words_learned = 0,
                words_mastered = 0,
                current_streak_days = 0,
                longest_streak_days = 0,
                last_activity_date = NULL,
                total_questions_answered = 0,
                total_correct_answers = 0,
                overall_accuracy = 0,
                achievements_unlocked = 0,
                badges_earned = 0,
                weekly_rank = NULL,
                monthly_rank = NULL,
                all_time_rank = NULL,
                updated_at = datetime('now')
            WHERE user_id = 1
        `);
        
        console.log('✅ User statistics reset successfully!');
        console.log('📊 All stats are now set to 0 for accurate testing');
        
    } catch (error) {
        console.error('❌ Failed to reset user stats:', error);
    }
}

resetUserStats();