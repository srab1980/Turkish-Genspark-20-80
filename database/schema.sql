-- =====================================================
-- Turkish Learning App - MySQL Database Schema
-- =====================================================
-- Created: 2024
-- Description: Complete database schema for Turkish language learning application
-- Features: User management, authentication, learning content, progress tracking, gamification

-- Set charset and collation for Turkish language support
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create database
CREATE DATABASE IF NOT EXISTS turkish_learning_app 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE turkish_learning_app;

-- =====================================================
-- 1. USERS AND AUTHENTICATION
-- =====================================================

-- Users table
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NULL, -- NULL for OAuth-only users
    avatar_url TEXT NULL,
    
    -- Profile information
    native_language VARCHAR(10) DEFAULT 'en',
    target_language VARCHAR(10) DEFAULT 'tr',
    level ENUM('beginner', 'elementary', 'intermediate', 'advanced') DEFAULT 'beginner',
    
    -- Preferences
    daily_goal INT DEFAULT 10, -- minutes per day
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE,
    
    -- Status
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP NULL,
    
    -- OAuth providers
    google_id VARCHAR(255) NULL UNIQUE,
    facebook_id VARCHAR(255) NULL UNIQUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_google_id (google_id),
    INDEX idx_active (is_active),
    INDEX idx_premium (is_premium),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- User sessions for JWT token management
CREATE TABLE user_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    device_info TEXT NULL,
    ip_address VARCHAR(45) NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB;

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB;

-- =====================================================
-- 2. LEARNING CONTENT
-- =====================================================

-- Categories for organizing content
CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_tr VARCHAR(100) NOT NULL, -- Turkish translation
    description TEXT NULL,
    description_tr TEXT NULL,
    icon VARCHAR(50) NULL,
    color VARCHAR(7) NULL, -- hex color
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB;

-- Vocabulary words and phrases
CREATE TABLE vocabulary (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    
    -- Turkish content
    turkish_text VARCHAR(255) NOT NULL,
    turkish_pronunciation VARCHAR(255) NULL,
    
    -- English content
    english_text VARCHAR(255) NOT NULL,
    english_definition TEXT NULL,
    
    -- Additional information
    word_type ENUM('noun', 'verb', 'adjective', 'adverb', 'phrase', 'expression') DEFAULT 'noun',
    difficulty_level ENUM('beginner', 'elementary', 'intermediate', 'advanced') DEFAULT 'beginner',
    
    -- Usage examples
    example_sentence_tr TEXT NULL,
    example_sentence_en TEXT NULL,
    
    -- Media
    audio_url VARCHAR(255) NULL,
    image_url VARCHAR(255) NULL,
    
    -- Metadata
    frequency_score INT DEFAULT 0, -- how common the word is
    tags JSON NULL, -- additional tags
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category_id (category_id),
    INDEX idx_difficulty_level (difficulty_level),
    INDEX idx_word_type (word_type),
    INDEX idx_active (is_active),
    INDEX idx_frequency_score (frequency_score),
    FULLTEXT idx_search (turkish_text, english_text, english_definition)
) ENGINE=InnoDB;

-- Lessons structure
CREATE TABLE lessons (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    title_tr VARCHAR(200) NOT NULL,
    description TEXT NULL,
    difficulty_level ENUM('beginner', 'elementary', 'intermediate', 'advanced') DEFAULT 'beginner',
    estimated_duration INT DEFAULT 10, -- minutes
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category_id (category_id),
    INDEX idx_difficulty_level (difficulty_level),
    INDEX idx_active (is_active),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB;

-- Lesson vocabulary mapping
CREATE TABLE lesson_vocabulary (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT UNSIGNED NOT NULL,
    vocabulary_id BIGINT UNSIGNED NOT NULL,
    sort_order INT DEFAULT 0,
    is_required BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id) ON DELETE CASCADE,
    UNIQUE KEY unique_lesson_vocab (lesson_id, vocabulary_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_vocabulary_id (vocabulary_id)
) ENGINE=InnoDB;

-- =====================================================
-- 3. USER PROGRESS AND LEARNING ANALYTICS
-- =====================================================

-- User learning progress for vocabulary
CREATE TABLE user_vocabulary_progress (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    vocabulary_id BIGINT UNSIGNED NOT NULL,
    
    -- Progress metrics
    mastery_level ENUM('new', 'learning', 'familiar', 'mastered') DEFAULT 'new',
    confidence_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
    
    -- Practice statistics
    times_seen INT DEFAULT 0,
    times_correct INT DEFAULT 0,
    times_incorrect INT DEFAULT 0,
    streak_count INT DEFAULT 0,
    best_streak INT DEFAULT 0,
    
    -- Spaced repetition
    next_review_at TIMESTAMP NULL,
    ease_factor DECIMAL(3,2) DEFAULT 2.50, -- spaced repetition algorithm
    interval_days INT DEFAULT 1,
    
    -- Timestamps
    first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mastered_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_vocab (user_id, vocabulary_id),
    INDEX idx_user_id (user_id),
    INDEX idx_vocabulary_id (vocabulary_id),
    INDEX idx_mastery_level (mastery_level),
    INDEX idx_next_review_at (next_review_at),
    INDEX idx_confidence_score (confidence_score)
) ENGINE=InnoDB;

-- User lesson progress
CREATE TABLE user_lesson_progress (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    lesson_id INT UNSIGNED NOT NULL,
    
    -- Progress status
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    score DECIMAL(5,2) NULL, -- percentage score
    
    -- Time tracking
    time_spent_seconds INT DEFAULT 0,
    
    -- Attempts
    attempts_count INT DEFAULT 0,
    best_score DECIMAL(5,2) NULL,
    
    -- Timestamps
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id),
    INDEX idx_user_id (user_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_status (status),
    INDEX idx_completion_percentage (completion_percentage)
) ENGINE=InnoDB;

-- Daily learning sessions
CREATE TABLE learning_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    
    -- Session details
    session_type ENUM('flashcard', 'lesson', 'quiz', 'review') NOT NULL,
    category_id INT UNSIGNED NULL,
    lesson_id INT UNSIGNED NULL,
    
    -- Performance metrics
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    incorrect_answers INT DEFAULT 0,
    skipped_answers INT DEFAULT 0,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Time tracking
    duration_seconds INT DEFAULT 0,
    
    -- XP and rewards
    xp_earned INT DEFAULT 0,
    coins_earned INT DEFAULT 0,
    
    -- Session metadata
    session_data JSON NULL, -- store detailed session information
    
    -- Timestamps
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_session_type (session_type),
    INDEX idx_started_at (started_at),
    INDEX idx_category_id (category_id),
    INDEX idx_lesson_id (lesson_id)
) ENGINE=InnoDB;

-- Detailed question responses within sessions
CREATE TABLE session_responses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT UNSIGNED NOT NULL,
    vocabulary_id BIGINT UNSIGNED NOT NULL,
    
    -- Response details
    question_type ENUM('translation', 'multiple_choice', 'audio', 'typing') NOT NULL,
    user_answer TEXT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    
    -- Time tracking
    response_time_ms INT NULL, -- milliseconds to answer
    
    -- Context
    question_data JSON NULL, -- store question options, etc.
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES learning_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_vocabulary_id (vocabulary_id),
    INDEX idx_is_correct (is_correct),
    INDEX idx_question_type (question_type)
) ENGINE=InnoDB;

-- =====================================================
-- 4. GAMIFICATION AND ACHIEVEMENTS
-- =====================================================

-- User statistics and metrics
CREATE TABLE user_stats (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    
    -- Learning metrics
    total_xp INT DEFAULT 0,
    level INT DEFAULT 1,
    coins INT DEFAULT 0,
    
    -- Session statistics
    sessions_completed INT DEFAULT 0,
    total_study_time_seconds BIGINT DEFAULT 0,
    words_learned INT DEFAULT 0,
    words_mastered INT DEFAULT 0,
    
    -- Streaks
    current_streak_days INT DEFAULT 0,
    longest_streak_days INT DEFAULT 0,
    last_activity_date DATE NULL,
    
    -- Accuracy metrics
    total_questions_answered INT DEFAULT 0,
    total_correct_answers INT DEFAULT 0,
    overall_accuracy DECIMAL(5,2) DEFAULT 0.00,
    
    -- Achievements
    achievements_unlocked INT DEFAULT 0,
    badges_earned INT DEFAULT 0,
    
    -- Rankings
    weekly_rank INT NULL,
    monthly_rank INT NULL,
    all_time_rank INT NULL,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_total_xp (total_xp),
    INDEX idx_level (level),
    INDEX idx_current_streak (current_streak_days),
    INDEX idx_weekly_rank (weekly_rank),
    INDEX idx_words_mastered (words_mastered)
) ENGINE=InnoDB;

-- Achievements system
CREATE TABLE achievements (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NULL,
    
    -- Requirements
    achievement_type ENUM('xp', 'streak', 'words', 'sessions', 'accuracy', 'time', 'special') NOT NULL,
    requirement_value INT NOT NULL,
    requirement_condition VARCHAR(100) NULL, -- e.g., 'weekly', 'category:greetings'
    
    -- Rewards
    xp_reward INT DEFAULT 0,
    coins_reward INT DEFAULT 0,
    badge_reward VARCHAR(50) NULL,
    
    -- Metadata
    difficulty ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_achievement_type (achievement_type),
    INDEX idx_difficulty (difficulty),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- User achievements tracking
CREATE TABLE user_achievements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    achievement_id INT UNSIGNED NOT NULL,
    
    -- Progress tracking
    current_progress INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    
    -- Rewards claimed
    xp_claimed INT DEFAULT 0,
    coins_claimed INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id),
    INDEX idx_user_id (user_id),
    INDEX idx_achievement_id (achievement_id),
    INDEX idx_is_completed (is_completed)
) ENGINE=InnoDB;

-- Leaderboards
CREATE TABLE leaderboards (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    
    -- Leaderboard type and period
    leaderboard_type ENUM('weekly', 'monthly', 'all_time') NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NULL,
    
    -- Metrics
    total_xp INT DEFAULT 0,
    sessions_completed INT DEFAULT 0,
    words_learned INT DEFAULT 0,
    study_time_seconds INT DEFAULT 0,
    
    -- Ranking
    rank_position INT NULL,
    total_participants INT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_leaderboard_period (user_id, leaderboard_type, period_start),
    INDEX idx_user_id (user_id),
    INDEX idx_leaderboard_type (leaderboard_type),
    INDEX idx_period_start (period_start),
    INDEX idx_rank_position (rank_position),
    INDEX idx_total_xp (total_xp)
) ENGINE=InnoDB;

-- =====================================================
-- 5. SYSTEM AND ADMIN TABLES
-- =====================================================

-- Application settings
CREATE TABLE app_settings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT NULL,
    is_public BOOLEAN DEFAULT FALSE, -- whether setting can be accessed by frontend
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key),
    INDEX idx_is_public (is_public)
) ENGINE=InnoDB;

-- Activity logs for admin monitoring
CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    
    -- Activity details
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NULL, -- 'user', 'vocabulary', 'session', etc.
    entity_id BIGINT UNSIGNED NULL,
    
    -- Context
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    additional_data JSON NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity_type (entity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =====================================================
-- 6. INITIAL DATA SEEDING
-- =====================================================

-- Insert default categories
INSERT INTO categories (name, name_tr, description, icon, color, sort_order) VALUES
('Greetings', 'Selamlaşma', 'Basic greetings and introductions', 'wave', '#4F46E5', 1),
('Family', 'Aile', 'Family members and relationships', 'users', '#059669', 2),
('Food & Drink', 'Yemek ve İçecek', 'Food, drinks, and dining', 'utensils', '#DC2626', 3),
('Numbers', 'Sayılar', 'Numbers and counting', 'hash', '#7C2D12', 4),
('Colors', 'Renkler', 'Colors and descriptions', 'palette', '#9333EA', 5),
('Time', 'Zaman', 'Time, dates, and calendar', 'clock', '#0891B2', 6),
('Travel', 'Seyahat', 'Travel and transportation', 'plane', '#EA580C', 7),
('Shopping', 'Alışveriş', 'Shopping and commerce', 'shopping-cart', '#16A34A', 8),
('Work', 'İş', 'Work and professional life', 'briefcase', '#374151', 9),
('Daily Life', 'Günlük Yaşam', 'Daily activities and routines', 'home', '#6366F1', 10);

-- Insert default achievements
INSERT INTO achievements (name, description, achievement_type, requirement_value, xp_reward, coins_reward, difficulty) VALUES
('First Steps', 'Complete your first learning session', 'sessions', 1, 50, 10, 'bronze'),
('Word Collector', 'Learn 10 new words', 'words', 10, 100, 25, 'bronze'),
('Streak Starter', 'Maintain a 3-day learning streak', 'streak', 3, 150, 30, 'bronze'),
('Dedicated Learner', 'Complete 10 learning sessions', 'sessions', 10, 200, 50, 'silver'),
('Vocabulary Master', 'Learn 50 new words', 'words', 50, 300, 75, 'silver'),
('Week Warrior', 'Maintain a 7-day learning streak', 'streak', 7, 400, 100, 'silver'),
('Scholar', 'Earn 1000 XP', 'xp', 1000, 500, 125, 'gold'),
('Perfectionist', 'Achieve 95% accuracy in a session', 'accuracy', 95, 250, 60, 'gold'),
('Marathon Learner', 'Study for 1 hour total', 'time', 3600, 300, 80, 'gold'),
('Legendary', 'Maintain a 30-day learning streak', 'streak', 30, 1000, 250, 'platinum');

-- Insert default app settings
INSERT INTO app_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('app_version', '1.0.0', 'string', 'Current application version', TRUE),
('daily_xp_bonus', '50', 'number', 'Bonus XP for daily login', FALSE),
('max_daily_streak_bonus', '200', 'number', 'Maximum XP bonus for streaks', FALSE),
('words_per_lesson', '10', 'number', 'Default number of words per lesson', FALSE),
('spaced_repetition_enabled', 'true', 'boolean', 'Enable spaced repetition algorithm', FALSE),
('leaderboard_enabled', 'true', 'boolean', 'Enable leaderboard feature', TRUE),
('achievements_enabled', 'true', 'boolean', 'Enable achievements system', TRUE),
('premium_features_enabled', 'true', 'boolean', 'Enable premium features', TRUE);

-- =====================================================
-- END OF SCHEMA
-- =====================================================