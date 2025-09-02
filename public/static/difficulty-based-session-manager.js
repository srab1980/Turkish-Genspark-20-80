// 🎯 Difficulty-Based Session Management System
// Organizes words by CEFR difficulty levels: A1 → A2 → B1 → B2 → C1 → C2
// Creates sessions with 10 words each, last session gets remaining words

class DifficultyBasedSessionManager {
    constructor() {
        this.difficultyOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        this.wordsPerSession = 10;
        
        console.log('🎯 Difficulty-Based Session Manager initialized');
    }
    
    /**
     * Sort words by CEFR difficulty level
     */
    sortWordsByDifficulty(words) {
        return words.sort((a, b) => {
            const levelA = this.difficultyOrder.indexOf(a.difficultyLevel || 'A1');
            const levelB = this.difficultyOrder.indexOf(b.difficultyLevel || 'A1');
            
            // Primary sort: by difficulty level
            if (levelA !== levelB) {
                return levelA - levelB;
            }
            
            // Secondary sort: alphabetically by Turkish word
            return a.turkish.localeCompare(b.turkish, 'tr-TR');
        });
    }
    
    /**
     * Create sessions from sorted words
     * Each session has 10 words, last session gets remaining words
     */
    createSessionsFromWords(words, categoryId) {
        if (!words || words.length === 0) {
            return [];
        }
        
        // Sort words by difficulty first
        const sortedWords = this.sortWordsByDifficulty(words);
        
        const sessions = [];
        let sessionNumber = 1;
        
        // Create sessions with 10 words each
        for (let i = 0; i < sortedWords.length; i += this.wordsPerSession) {
            const sessionWords = sortedWords.slice(i, i + this.wordsPerSession);
            
            // Calculate difficulty distribution for this session
            const difficultyCount = this.calculateDifficultyDistribution(sessionWords);
            const primaryDifficulty = this.getPrimaryDifficulty(difficultyCount);
            
            const session = {
                id: `${categoryId}_session_${sessionNumber}`,
                categoryId: categoryId,
                sessionNumber: sessionNumber,
                words: sessionWords,
                wordCount: sessionWords.length,
                difficultyDistribution: difficultyCount,
                primaryDifficulty: primaryDifficulty,
                difficultyRange: this.getDifficultyRange(sessionWords),
                completed: false,
                accuracy: 0,
                timeSpent: 0
            };
            
            sessions.push(session);
            sessionNumber++;
        }
        
        console.log(`📚 Created ${sessions.length} sessions for ${categoryId}:`, this.getSessionsSummary(sessions));
        return sessions;
    }
    
    /**
     * Calculate difficulty level distribution in a session
     */
    calculateDifficultyDistribution(words) {
        const distribution = {};
        
        words.forEach(word => {
            const level = word.difficultyLevel || 'A1';
            distribution[level] = (distribution[level] || 0) + 1;
        });
        
        return distribution;
    }
    
    /**
     * Get the primary difficulty level for a session
     */
    getPrimaryDifficulty(difficultyCount) {
        let maxCount = 0;
        let primaryLevel = 'A1';
        
        for (const [level, count] of Object.entries(difficultyCount)) {
            if (count > maxCount) {
                maxCount = count;
                primaryLevel = level;
            }
        }
        
        return primaryLevel;
    }
    
    /**
     * Get difficulty range for a session (e.g., "A1-A2" or "B1")
     */
    getDifficultyRange(words) {
        const levels = [...new Set(words.map(w => w.difficultyLevel || 'A1'))]
            .sort((a, b) => this.difficultyOrder.indexOf(a) - this.difficultyOrder.indexOf(b));
        
        if (levels.length === 1) {
            return levels[0];
        } else if (levels.length === 2) {
            return `${levels[0]}-${levels[1]}`;
        } else {
            return `${levels[0]}-${levels[levels.length - 1]}`;
        }
    }
    
    /**
     * Get a summary of all sessions
     */
    getSessionsSummary(sessions) {
        return sessions.map(session => ({
            session: session.sessionNumber,
            words: session.wordCount,
            difficulty: session.difficultyRange,
            primary: session.primaryDifficulty
        }));
    }
    
    /**
     * Process an entire category and create difficulty-based sessions
     */
    processCategoryWithDifficulty(categoryData) {
        if (!categoryData || !categoryData.words) {
            return categoryData;
        }
        
        // Create new sessions based on difficulty ordering
        const sessions = this.createSessionsFromWords(categoryData.words, categoryData.id);
        
        // Calculate category statistics
        const stats = this.calculateCategoryStats(categoryData.words, sessions);
        
        return {
            ...categoryData,
            sessions: sessions,
            sessionCount: sessions.length,
            totalWords: categoryData.words.length,
            difficultyStats: stats.difficultyDistribution,
            sessionsSummary: this.getSessionsSummary(sessions),
            difficultyProgression: stats.progression
        };
    }
    
    /**
     * Calculate category statistics
     */
    calculateCategoryStats(words, sessions) {
        const difficultyDistribution = {};
        const progression = [];
        
        // Count words by difficulty
        words.forEach(word => {
            const level = word.difficultyLevel || 'A1';
            difficultyDistribution[level] = (difficultyDistribution[level] || 0) + 1;
        });
        
        // Track progression through sessions
        sessions.forEach(session => {
            progression.push({
                session: session.sessionNumber,
                primary: session.primaryDifficulty,
                range: session.difficultyRange,
                words: session.wordCount
            });
        });
        
        return {
            difficultyDistribution,
            progression
        };
    }
    
    /**
     * Process entire vocabulary database with difficulty-based sessions
     */
    processVocabularyDatabase(vocabularyData) {
        console.log('🔄 Processing vocabulary database with difficulty-based sessions...');
        
        const processedData = {};
        let totalSessions = 0;
        
        for (const [categoryId, categoryData] of Object.entries(vocabularyData)) {
            const processedCategory = this.processCategoryWithDifficulty(categoryData);
            processedData[categoryId] = processedCategory;
            totalSessions += processedCategory.sessions.length;
            
            console.log(`   ✅ ${categoryId}: ${processedCategory.words.length} words → ${processedCategory.sessions.length} sessions`);
        }
        
        console.log(`🎯 Difficulty-based processing complete: ${totalSessions} total sessions`);
        return processedData;
    }
    
    /**
     * Get next session based on difficulty progression
     */
    getNextSessionForUser(categoryData, userProgress = {}) {
        if (!categoryData.sessions || categoryData.sessions.length === 0) {
            return null;
        }
        
        const completedSessions = userProgress.completedSessions || [];
        const categoryCompleted = completedSessions.filter(s => s.startsWith(categoryData.id));
        
        // Find first incomplete session
        for (const session of categoryData.sessions) {
            if (!categoryCompleted.includes(session.id)) {
                return session;
            }
        }
        
        // All sessions completed, return first session for review
        return categoryData.sessions[0];
    }
    
    /**
     * Get session by ID
     */
    getSessionById(vocabularyData, sessionId) {
        for (const categoryData of Object.values(vocabularyData)) {
            if (categoryData.sessions) {
                const session = categoryData.sessions.find(s => s.id === sessionId);
                if (session) {
                    return session;
                }
            }
        }
        return null;
    }
    
    /**
     * Get recommended difficulty level for user
     */
    getRecommendedDifficultyLevel(userProgress = {}) {
        const completedSessions = userProgress.completedSessions || [];
        
        if (completedSessions.length === 0) {
            return 'A1'; // Start with beginner level
        }
        
        // Analyze completed sessions to recommend next level
        // This is a simple implementation - can be enhanced with accuracy tracking
        if (completedSessions.length < 5) return 'A1';
        if (completedSessions.length < 15) return 'A2';
        if (completedSessions.length < 30) return 'B1';
        if (completedSessions.length < 50) return 'B2';
        if (completedSessions.length < 80) return 'C1';
        return 'C2';
    }
}

// Global instance
window.difficultyBasedSessionManager = new DifficultyBasedSessionManager();

console.log('🎯 Difficulty-Based Session Manager loaded successfully!');