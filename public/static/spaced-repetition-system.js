/**
 * 🧠 SPACED REPETITION SYSTEM
 * Manages word review scheduling based on difficulty levels
 */

class SpacedRepetitionSystem {
    constructor() {
        this.difficultyLevels = {
            easy: {
                name: 'سهل',
                nameEnglish: 'Easy',
                reviewInterval: 7, // 7 days
                color: '#10b981',
                icon: '✅'
            },
            medium: {
                name: 'متوسط', 
                nameEnglish: 'Medium',
                reviewInterval: 3, // 3 days
                color: '#f59e0b',
                icon: '⚡'
            },
            hard: {
                name: 'صعب',
                nameEnglish: 'Hard/Advanced', 
                reviewInterval: 1, // 1 day (most frequent)
                color: '#ef4444',
                icon: '🔥'
            }
        };
        
        console.log('🧠 Spaced Repetition System initialized');
    }
    
    /**
     * Record word difficulty and schedule next review
     */
    recordWordDifficulty(word, difficulty, sessionId = null) {
        try {
            const wordReviews = this.getWordReviews();
            const wordId = word.id || word.turkish;
            
            const reviewRecord = {
                id: wordId,
                word: word,
                difficulty: difficulty,
                lastReviewed: new Date().toISOString(),
                nextReview: this.calculateNextReview(difficulty),
                reviewCount: (wordReviews[wordId]?.reviewCount || 0) + 1,
                sessionId: sessionId,
                history: [
                    ...(wordReviews[wordId]?.history || []),
                    {
                        date: new Date().toISOString(),
                        difficulty: difficulty,
                        sessionId: sessionId
                    }
                ]
            };
            
            wordReviews[wordId] = reviewRecord;
            localStorage.setItem('word_reviews', JSON.stringify(wordReviews));
            
            console.log(`📝 Word "${word.turkish}" scheduled for ${difficulty} review in ${this.difficultyLevels[difficulty].reviewInterval} days`);
            
            return reviewRecord;
            
        } catch (error) {
            console.error('Error recording word difficulty:', error);
            return null;
        }
    }
    
    /**
     * Calculate next review date based on difficulty
     */
    calculateNextReview(difficulty) {
        const interval = this.difficultyLevels[difficulty]?.reviewInterval || 3;
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);
        return nextReview.toISOString();
    }
    
    /**
     * Get words due for review by difficulty level
     */
    getWordsForReview(difficulty = 'all', limit = 10) {
        try {
            const wordReviews = this.getWordReviews();
            const now = new Date();
            
            let dueWords = Object.values(wordReviews).filter(review => {
                const nextReviewDate = new Date(review.nextReview);
                const isDue = nextReviewDate <= now;
                const matchesDifficulty = difficulty === 'all' || review.difficulty === difficulty;
                
                return isDue && matchesDifficulty;
            });
            
            // Sort by next review date (most overdue first)
            dueWords.sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));
            
            // Limit results
            if (limit > 0) {
                dueWords = dueWords.slice(0, limit);
            }
            
            console.log(`🔄 Found ${dueWords.length} words due for ${difficulty} review`);
            return dueWords.map(review => review.word);
            
        } catch (error) {
            console.error('Error getting words for review:', error);
            return [];
        }
    }
    
    /**
     * Get review statistics by difficulty
     */
    getReviewStats() {
        try {
            const wordReviews = this.getWordReviews();
            const now = new Date();
            
            const stats = {
                easy: { total: 0, due: 0, upcoming: 0 },
                medium: { total: 0, due: 0, upcoming: 0 },
                hard: { total: 0, due: 0, upcoming: 0 }
            };
            
            Object.values(wordReviews).forEach(review => {
                const difficulty = review.difficulty;
                const nextReviewDate = new Date(review.nextReview);
                const isDue = nextReviewDate <= now;
                const isUpcoming = nextReviewDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next 24 hours
                
                if (stats[difficulty]) {
                    stats[difficulty].total++;
                    if (isDue) stats[difficulty].due++;
                    if (isUpcoming && !isDue) stats[difficulty].upcoming++;
                }
            });
            
            return stats;
            
        } catch (error) {
            console.error('Error getting review stats:', error);
            return { easy: { total: 0, due: 0, upcoming: 0 }, medium: { total: 0, due: 0, upcoming: 0 }, hard: { total: 0, due: 0, upcoming: 0 } };
        }
    }
    
    /**
     * Get all completed sessions to avoid repetition
     */
    getCompletedSessions() {
        try {
            return JSON.parse(localStorage.getItem('completed_sessions') || '[]');
        } catch (error) {
            console.error('Error getting completed sessions:', error);
            return [];
        }
    }
    
    /**
     * Mark session as completed
     */
    markSessionCompleted(sessionId, category, words) {
        try {
            const completedSessions = this.getCompletedSessions();
            
            const sessionRecord = {
                id: sessionId,
                category: category,
                words: words.map(w => ({ id: w.id, turkish: w.turkish })),
                completedDate: new Date().toISOString(),
                wordCount: words.length
            };
            
            completedSessions.push(sessionRecord);
            localStorage.setItem('completed_sessions', JSON.stringify(completedSessions));
            
            console.log(`✅ Session ${sessionId} marked as completed`);
            return sessionRecord;
            
        } catch (error) {
            console.error('Error marking session completed:', error);
            return null;
        }
    }
    
    /**
     * Check if session was already completed
     */
    isSessionCompleted(sessionId) {
        const completedSessions = this.getCompletedSessions();
        return completedSessions.some(session => session.id === sessionId);
    }
    
    /**
     * Get available (not completed) sessions for a category
     */
    getAvailableSessions(category) {
        try {
            // Get all sessions for category from enhanced database
            if (window.enhancedVocabularyData && window.enhancedVocabularyData[category]) {
                const categoryData = window.enhancedVocabularyData[category];
                const allSessions = categoryData.sessions || [];
                const completedSessions = this.getCompletedSessions();
                
                // Filter out completed sessions
                const availableSessions = allSessions.filter(session => {
                    return !completedSessions.some(completed => completed.id === session.id);
                });
                
                console.log(`📚 Category ${category}: ${availableSessions.length} available, ${completedSessions.length} completed`);
                return availableSessions;
            }
            
            return [];
            
        } catch (error) {
            console.error('Error getting available sessions:', error);
            return [];
        }
    }
    
    /**
     * Get word reviews data
     */
    getWordReviews() {
        try {
            return JSON.parse(localStorage.getItem('word_reviews') || '{}');
        } catch (error) {
            console.error('Error getting word reviews:', error);
            return {};
        }
    }
    
    /**
     * Reset all review data (for testing)
     */
    resetReviewData() {
        localStorage.removeItem('word_reviews');
        localStorage.removeItem('completed_sessions');
        console.log('🔄 All review data reset');
        
        return {
            message: 'Review data reset successfully',
            wordReviews: 0,
            completedSessions: 0
        };
    }
    
    /**
     * Get next session to study
     */
    getNextSessionToStudy(category = null) {
        try {
            if (category) {
                // Get next available session for specific category
                const availableSessions = this.getAvailableSessions(category);
                return availableSessions.length > 0 ? availableSessions[0] : null;
            }
            
            // Get next available session from any category
            if (window.enhancedVocabularyData) {
                for (const [catId, catData] of Object.entries(window.enhancedVocabularyData)) {
                    const availableSessions = this.getAvailableSessions(catId);
                    if (availableSessions.length > 0) {
                        return {
                            ...availableSessions[0],
                            category: catId,
                            categoryName: catData.nameArabic
                        };
                    }
                }
            }
            
            return null;
            
        } catch (error) {
            console.error('Error getting next session:', error);
            return null;
        }
    }
}

// Initialize the spaced repetition system
window.spacedRepetitionSystem = new SpacedRepetitionSystem();

// Global convenience functions
window.getReviewStats = function() {
    return window.spacedRepetitionSystem?.getReviewStats() || {};
};

window.getWordsForReview = function(difficulty = 'all', limit = 10) {
    return window.spacedRepetitionSystem?.getWordsForReview(difficulty, limit) || [];
};

window.resetReviewData = function() {
    return window.spacedRepetitionSystem?.resetReviewData() || {};
};

console.log('🧠 Spaced Repetition System loaded successfully!');
console.log('🔄 Global functions: getReviewStats(), getWordsForReview(difficulty, limit), resetReviewData()');

// Global function to start review mode
window.startReview = function(difficulty = 'all') {
    if (window.learningModeManager && window.reviewMode) {
        window.learningModeManager.startMode('review', { difficulty: difficulty });
    } else {
        console.error('❌ Review mode not available');
    }
};