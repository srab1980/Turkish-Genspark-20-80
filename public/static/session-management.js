// 🎯 Session Management System
// Handles session-based learning with 10 words per session

class SessionManagementUI {
    constructor() {
        this.currentCategory = null;
        this.currentSession = null;
        this.userProgress = {
            completedSessions: [],
            currentSession: null,
            categoryProgress: {}
        };
        
        this.init();
    }
    
    init() {
        console.log('🎯 Session Management UI initialized');
        this.loadUserProgress();
        this.setupEventListeners();
    }
    
    /**
     * Load user progress from localStorage
     */
    loadUserProgress() {
        const saved = localStorage.getItem('turkishLearningProgress');
        if (saved) {
            this.userProgress = { ...this.userProgress, ...JSON.parse(saved) };
        }
        console.log('📊 Loaded user progress:', this.userProgress);
    }
    
    /**
     * Save user progress to localStorage
     */
    saveUserProgress() {
        localStorage.setItem('turkishLearningProgress', JSON.stringify(this.userProgress));
        console.log('💾 Saved user progress');
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for category selection
        document.addEventListener('categorySelected', (event) => {
            this.showCategorySessions(event.detail.categoryId);
        });
        
        // Listen for session completion
        document.addEventListener('sessionCompleted', (event) => {
            this.markSessionCompleted(event.detail.sessionId);
        });
    }
    
    /**
     * Render session overview for all categories
     */
    renderSessionOverview() {
        if (!window.categoryMetadata) {
            console.warn('⚠️  Category metadata not available');
            return;
        }
        
        const container = document.getElementById('learning-content');
        if (!container) return;
        
        const overviewHTML = `
            <div class="session-overview-container">
                <div class="session-overview-header">
                    <h2 class="session-overview-title">اختر فئة للتعلم</h2>
                    <p class="session-overview-subtitle">كل فئة مقسمة إلى جلسات من 10 كلمات لتسهيل التعلم</p>
                </div>
                
                <div class="session-overview">
                    ${this.generateCategoryCards()}
                </div>
                
                <div class="session-progress-summary">
                    <h3>📊 ملخص التقدم</h3>
                    <div class="progress-summary-stats">
                        ${this.generateProgressSummary()}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = overviewHTML;
        this.attachCategoryEventListeners();
    }
    
    /**
     * Generate category cards with session information
     */
    generateCategoryCards() {
        const categories = Object.entries(window.categoryMetadata);
        
        return categories.map(([categoryId, categoryData]) => {
            const progress = this.getCategoryProgress(categoryId);
            const statusClass = this.getCategoryStatusClass(progress);
            
            return `
                <div class="session-category-card ${statusClass}" data-category="${categoryId}">
                    <div class="session-category-header">
                        <div class="session-category-icon">${categoryData.icon}</div>
                        <div class="session-category-info">
                            <h3>${categoryData.name}</h3>
                            <div class="session-category-arabic">${categoryData.nameArabic}</div>
                        </div>
                    </div>
                    
                    <div class="session-stats">
                        <div class="session-stat">
                            <div class="session-stat-number">${categoryData.wordCount}</div>
                            <div class="session-stat-label">كلمة</div>
                        </div>
                        <div class="session-stat">
                            <div class="session-stat-number">${categoryData.sessionCount}</div>
                            <div class="session-stat-label">جلسة</div>
                        </div>
                        <div class="session-stat">
                            <div class="session-stat-number">${Math.round(categoryData.estimatedTime / 60)}د</div>
                            <div class="session-stat-label">وقت متوقع</div>
                        </div>
                    </div>
                    
                    <div class="session-progress-bar">
                        <div class="session-progress-fill" style="width: ${progress.percentage}%"></div>
                    </div>
                    
                    <div class="session-next-action">
                        <span>${this.getNextActionText(progress)}</span>
                        <i class="fas fa-arrow-left"></i>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Get category progress information
     */
    getCategoryProgress(categoryId) {
        if (!window.SessionManager) return { percentage: 0, completedSessions: 0, totalSessions: 0 };
        
        const completedSessions = this.userProgress.completedSessions.filter(
            sessionId => sessionId.startsWith(categoryId)
        );
        
        return window.SessionManager.getCategoryProgress(categoryId, this.userProgress.completedSessions);
    }
    
    /**
     * Get category status class for styling
     */
    getCategoryStatusClass(progress) {
        if (progress.percentage === 100) return 'completed';
        if (progress.percentage > 0) return 'in-progress';
        return '';
    }
    
    /**
     * Get next action text for category
     */
    getNextActionText(progress) {
        if (progress.percentage === 100) return 'مكتملة! ابدأ المراجعة';
        if (progress.percentage > 0) return `تابع - الجلسة ${progress.completedSessions + 1}`;
        return 'ابدأ الجلسة الأولى';
    }
    
    /**
     * Generate progress summary
     */
    generateProgressSummary() {
        const totalCategories = Object.keys(window.categoryMetadata || {}).length;
        const completedCategories = Object.entries(window.categoryMetadata || {}).filter(
            ([categoryId]) => this.getCategoryProgress(categoryId).percentage === 100
        ).length;
        
        const totalSessions = window.vocabularyMetadata?.totalSessions || 0;
        const completedSessionsCount = this.userProgress.completedSessions.length;
        
        return `
            <div class="progress-summary-item">
                <div class="progress-summary-number">${completedCategories}/${totalCategories}</div>
                <div class="progress-summary-label">فئات مكتملة</div>
            </div>
            <div class="progress-summary-item">
                <div class="progress-summary-number">${completedSessionsCount}/${totalSessions}</div>
                <div class="progress-summary-label">جلسات مكتملة</div>
            </div>
            <div class="progress-summary-item">
                <div class="progress-summary-number">${completedSessionsCount * 10}</div>
                <div class="progress-summary-label">كلمة متعلمة</div>
            </div>
        `;
    }
    
    /**
     * Show sessions for a specific category
     */
    showCategorySessions(categoryId) {
        this.currentCategory = categoryId;
        
        if (!window.SessionManager) {
            console.error('❌ SessionManager not available');
            return;
        }
        
        const sessions = window.SessionManager.getSessionsByCategory(categoryId);
        const categoryData = window.categoryMetadata[categoryId];
        
        if (!sessions || sessions.length === 0) {
            console.warn(`⚠️  No sessions found for category: ${categoryId}`);
            return;
        }
        
        const container = document.getElementById('learning-content');
        if (!container) return;
        
        const sessionsHTML = `
            <div class="session-selection">
                <div class="session-selection-header">
                    <button class="btn-back" onclick="sessionManagement.renderSessionOverview()">
                        <i class="fas fa-arrow-right"></i>
                        عودة للفئات
                    </button>
                    <div class="category-session-info">
                        <h2 class="session-selection-title">
                            ${categoryData.icon} ${categoryData.nameArabic}
                        </h2>
                        <p class="session-selection-subtitle">
                            ${sessions.length} جلسات • ${categoryData.wordCount} كلمة • حوالي ${Math.round(categoryData.estimatedTime / 60)} دقيقة
                        </p>
                    </div>
                </div>
                
                <div class="session-progress-indicator">
                    ${this.generateSessionProgressIndicator(categoryId)}
                </div>
                
                <div class="session-list">
                    ${this.generateSessionItems(sessions)}
                </div>
                
                <div class="session-controls">
                    <button class="session-control-btn primary" onclick="sessionManagement.startNextSession('${categoryId}')">
                        <i class="fas fa-play"></i>
                        ابدأ الجلسة التالية
                    </button>
                    <button class="session-control-btn" onclick="sessionManagement.reviewCompletedSessions('${categoryId}')">
                        <i class="fas fa-repeat"></i>
                        راجع الجلسات المكتملة
                    </button>
                </div>
            </div>
        `;
        
        container.innerHTML = sessionsHTML;
        this.attachSessionEventListeners();
    }
    
    /**
     * Generate session progress indicator
     */
    generateSessionProgressIndicator(categoryId) {
        const progress = this.getCategoryProgress(categoryId);
        
        return `
            <div class="session-progress-circle" style="background: conic-gradient(from 0deg, #3b82f6 ${progress.percentage * 3.6}deg, #e2e8f0 ${progress.percentage * 3.6}deg)">
                ${progress.percentage}%
            </div>
            <div class="session-progress-info">
                <div class="session-progress-title">التقدم في هذه الفئة</div>
                <div class="session-progress-subtitle">
                    ${progress.completedSessions} من ${progress.totalSessions} جلسات مكتملة
                </div>
            </div>
        `;
    }
    
    /**
     * Generate session items
     */
    generateSessionItems(sessions) {
        return sessions.map(session => {
            const isCompleted = this.userProgress.completedSessions.includes(session.sessionId);
            const isUnlocked = this.isSessionUnlocked(session);
            const isCurrent = this.getCurrentSession(session.categoryId)?.sessionId === session.sessionId;
            
            let statusClass = '';
            let statusIcon = '';
            
            if (isCompleted) {
                statusClass = 'completed';
                statusIcon = '✅';
            } else if (isCurrent) {
                statusClass = 'current';
                statusIcon = '▶️';
            } else if (!isUnlocked) {
                statusClass = 'locked';
                statusIcon = '🔒';
            } else {
                statusIcon = '⭕';
            }
            
            return `
                <div class="session-item ${statusClass}" data-session="${session.sessionId}" ${!isUnlocked ? 'data-locked="true"' : ''}>
                    <div class="session-header">
                        <div class="session-number">الجلسة ${session.sessionNumber}</div>
                        <div class="session-status-icon">${statusIcon}</div>
                    </div>
                    
                    <div class="session-details">
                        <div class="session-word-count">${session.wordCount} كلمات للتعلم</div>
                        <div class="session-difficulty">${session.difficultyRange}</div>
                        <div class="session-time-estimate">⏱️ حوالي ${session.estimatedTime} دقيقة</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Check if session is unlocked
     */
    isSessionUnlocked(session) {
        if (session.sessionNumber === 1) return true; // First session always unlocked
        
        // Check if previous session is completed
        const previousSessionId = `${session.categoryId}_session_${session.sessionNumber - 1}`;
        return this.userProgress.completedSessions.includes(previousSessionId);
    }
    
    /**
     * Get current session for category
     */
    getCurrentSession(categoryId) {
        if (!window.SessionManager) return null;
        
        const sessions = window.SessionManager.getSessionsByCategory(categoryId);
        return sessions.find(session => 
            !this.userProgress.completedSessions.includes(session.sessionId) && 
            this.isSessionUnlocked(session)
        ) || sessions[0];
    }
    
    /**
     * Start next available session
     */
    startNextSession(categoryId) {
        const nextSession = this.getCurrentSession(categoryId);
        if (nextSession) {
            this.startSession(nextSession.sessionId);
        }
    }
    
    /**
     * Start a specific session
     */
    startSession(sessionId) {
        if (!window.SessionManager) {
            console.error('❌ SessionManager not available');
            return;
        }
        
        const session = window.SessionManager.getSessionById(sessionId);
        if (!session) {
            console.error(`❌ Session not found: ${sessionId}`);
            return;
        }
        
        this.currentSession = session;
        
        // Trigger learning mode with session data
        const event = new CustomEvent('startSessionLearning', {
            detail: {
                session: session,
                words: session.words,
                sessionId: sessionId,
                categoryId: session.categoryId
            }
        });
        
        document.dispatchEvent(event);
        console.log(`🎯 Started session: ${sessionId}`);
    }
    
    /**
     * Mark session as completed
     */
    markSessionCompleted(sessionId) {
        if (!this.userProgress.completedSessions.includes(sessionId)) {
            this.userProgress.completedSessions.push(sessionId);
            this.saveUserProgress();
            
            // Trigger progress update event
            const event = new CustomEvent('progressUpdated', {
                detail: {
                    sessionId: sessionId,
                    completedSessions: this.userProgress.completedSessions.length,
                    totalWords: this.userProgress.completedSessions.length * 10
                }
            });
            
            document.dispatchEvent(event);
            console.log(`✅ Session completed: ${sessionId}`);
        }
    }
    
    /**
     * Review completed sessions
     */
    reviewCompletedSessions(categoryId) {
        const completedSessions = this.userProgress.completedSessions.filter(
            sessionId => sessionId.startsWith(categoryId)
        );
        
        if (completedSessions.length === 0) {
            alert('لا توجد جلسات مكتملة للمراجعة في هذه الفئة');
            return;
        }
        
        // Trigger review mode with completed sessions
        const event = new CustomEvent('startSessionReview', {
            detail: {
                categoryId: categoryId,
                completedSessions: completedSessions,
                reviewMode: true
            }
        });
        
        document.dispatchEvent(event);
    }
    
    /**
     * Attach event listeners for category cards
     */
    attachCategoryEventListeners() {
        document.querySelectorAll('.session-category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.dataset.category;
                this.showCategorySessions(categoryId);
            });
        });
    }
    
    /**
     * Attach event listeners for session items
     */
    attachSessionEventListeners() {
        document.querySelectorAll('.session-item').forEach(item => {
            if (!item.dataset.locked) {
                item.addEventListener('click', () => {
                    const sessionId = item.dataset.session;
                    this.startSession(sessionId);
                });
            }
        });
    }
    
    /**
     * Get session management statistics
     */
    getStatistics() {
        return {
            totalCategories: Object.keys(window.categoryMetadata || {}).length,
            totalSessions: window.vocabularyMetadata?.totalSessions || 0,
            completedSessions: this.userProgress.completedSessions.length,
            totalWords: window.vocabularyMetadata?.totalWords || 0,
            learnedWords: this.userProgress.completedSessions.length * 10,
            progressPercentage: Math.round((this.userProgress.completedSessions.length / (window.vocabularyMetadata?.totalSessions || 1)) * 100)
        };
    }
}

// Initialize session management
let sessionManagement;

document.addEventListener('DOMContentLoaded', () => {
    // Wait for enhanced database to load
    setTimeout(() => {
        if (window.SessionManager) {
            sessionManagement = new SessionManagementUI();
            window.sessionManagement = sessionManagement; // Make globally available
            console.log('🎯 Session Management UI ready');
        } else {
            console.warn('⚠️  SessionManager not available, session management disabled');
        }
    }, 1000);
});

console.log('🎯 Session Management System loaded successfully!');