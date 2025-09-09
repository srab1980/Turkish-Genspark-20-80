// 📊 Real-Time Analytics System for Turkish Learning App
// Collects and processes live learning data with performance tracking

class RealTimeAnalytics {
    constructor() {
        this.isActive = false;
        this.sessionData = {
            startTime: null,
            endTime: null,
            currentMode: null,
            sessionId: this.generateSessionId(),
            events: [],
            metrics: {
                totalWords: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                hintsUsed: 0,
                totalTime: 0,
                interactions: 0,
                modesSwitched: 0
            }
        };
        
        // Real-time data storage
        this.liveData = {
            currentStreak: 0,
            dailyGoal: 20, // words per day
            dailyProgress: 0,
            weeklyProgress: 0,
            monthlyProgress: 0,
            averageAccuracy: 0,
            bestStreak: 0,
            totalXP: 0,
            level: 1,
            categoryProgress: {},
            difficultyProgress: {},
            modeUsage: {},
            learningVelocity: [],
            performanceHistory: [],
            milestones: []
        };
        
        // Event listeners for mode events
        this.eventCallbacks = new Map();
        
        // Performance tracking intervals
        this.trackingInterval = null;
        this.updateInterval = null;
        
        this.init();
        console.log('📊 Real-Time Analytics System initialized');
    }
    
    init() {
        this.loadStoredData();
        this.setupEventListeners();
        this.startRealTimeTracking();
        this.registerGlobalFunctions();
    }
    
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    loadStoredData() {
        // Load existing analytics data
        const stored = localStorage.getItem('turkishAnalyticsData');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.liveData = { ...this.liveData, ...data };
            } catch (error) {
                console.warn('Failed to load analytics data:', error);
            }
        }
        
        // Load today's progress
        const today = new Date().toDateString();
        const dailyProgress = localStorage.getItem(`dailyProgress_${today}`);
        if (dailyProgress) {
            this.liveData.dailyProgress = parseInt(dailyProgress) || 0;
        }
        
        // Load current streak
        this.updateStreak();
        
        console.log('📈 Analytics data loaded:', this.liveData);
    }
    
    setupEventListeners() {
        // Listen for learning mode events
        document.addEventListener('learningModeEvent', (event) => {
            this.handleModeEvent(event.detail);
        });
        
        // Listen for progress updates
        document.addEventListener('progressUpdated', (event) => {
            this.handleProgressUpdate(event.detail);
        });
        
        // Listen for session events from learning modes
        window.addEventListener('beforeunload', () => {
            this.endSession();
        });
        
        // Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseTracking();
            } else {
                this.resumeTracking();
            }
        });
    }
    
    startRealTimeTracking() {
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
        }
        
        // Track every 5 seconds
        this.trackingInterval = setInterval(() => {
            this.updateLiveMetrics();
        }, 5000);
        
        // Update dashboard every 10 seconds
        this.updateInterval = setInterval(() => {
            this.broadcastUpdate();
        }, 10000);
        
        this.isActive = true;
        console.log('📊 Real-time tracking started');
    }
    
    pauseTracking() {
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
            this.trackingInterval = null;
        }
        console.log('⏸️ Analytics tracking paused');
    }
    
    resumeTracking() {
        if (!this.trackingInterval && this.isActive) {
            this.startRealTimeTracking();
            console.log('▶️ Analytics tracking resumed');
        }
    }
    
    handleModeEvent(eventData) {
        // Refactored to match the new explicit event structure from LearningModeBase
        const { event, mode, timestamp, data } = eventData;
        
        // Record the event
        this.sessionData.events.push({
            event,
            mode,
            timestamp: timestamp || Date.now(),
            data: data || {}
        });
        
        // Update metrics based on event type
        switch (event) {
            case 'mode_started':
                this.startSession(mode);
                break;
                
            case 'mode_stopped':
                this.endSession();
                break;
                
            case 'question_answered':
            case 'card_flipped':
                this.recordAnswer(data);
                break;
                
            case 'hint_requested':
                this.sessionData.metrics.hintsUsed++;
                break;
                
            case 'word_advanced':
            case 'phrase_advanced':
                this.sessionData.metrics.interactions++;
                break;
                
            case 'session_completed':
                this.recordSessionCompletion(data);
                break;
        }
        
        this.saveData();
    }
    
    handleProgressUpdate(progressData) {
        const { mode, progress } = progressData;
        
        // Update live metrics
        if (progress.wordId) {
            this.updateWordProgress(progress.wordId, progress.isCorrect);
        }
        
        if (progress.accuracy !== undefined) {
            this.updateAccuracy(progress.accuracy);
        }
        
        // Update XP and level
        if (progress.isCorrect) {
            this.addXP(10); // 10 XP per correct answer
        }
        
        this.updateDailyProgress();
        this.saveData();
    }
    
    startSession(mode) {
        this.sessionData.startTime = Date.now();
        this.sessionData.currentMode = mode;
        this.sessionData.sessionId = this.generateSessionId();
        
        // Update mode usage
        if (!this.liveData.modeUsage[mode]) {
            this.liveData.modeUsage[mode] = { count: 0, totalTime: 0 };
        }
        this.liveData.modeUsage[mode].count++;
        
        console.log(`📊 Session started: ${mode}`);
    }
    
    endSession() {
        if (!this.sessionData.startTime) return;
        
        this.sessionData.endTime = Date.now();
        const sessionTime = this.sessionData.endTime - this.sessionData.startTime;
        this.sessionData.metrics.totalTime = sessionTime;
        
        // Update mode usage time
        if (this.sessionData.currentMode && this.liveData.modeUsage[this.sessionData.currentMode]) {
            this.liveData.modeUsage[this.sessionData.currentMode].totalTime += sessionTime;
        }
        
        // Record session in history
        this.recordSessionInHistory();
        
        // Reset session data
        this.resetSessionData();
        
        console.log(`📊 Session ended, duration: ${this.formatTime(sessionTime)}`);
    }
    
    recordAnswer(data) {
        this.sessionData.metrics.interactions++;
        
        if (data.isCorrect) {
            this.sessionData.metrics.correctAnswers++;
            this.liveData.dailyProgress++;
            
            // Update streak
            this.updateStreakOnCorrect();
        } else {
            this.sessionData.metrics.incorrectAnswers++;
            
            // Reset streak on wrong answer (optional - could be modified)
            // this.resetStreak();
        }
        
        // Update total words attempted
        this.sessionData.metrics.totalWords++;
        
        // Update performance history
        this.updatePerformanceHistory();
    }
    
    recordSessionCompletion(data) {
        if (data.accuracy !== undefined) {
            this.updateAccuracy(data.accuracy / 100);
        }
        
        if (data.correct) {
            this.addXP(data.correct * 15); // Bonus XP for completing session
        }
        
        // Check for milestones
        this.checkMilestones();
    }
    
    updateWordProgress(wordId, isCorrect) {
        const today = new Date().toDateString();
        
        // Track word-specific progress
        const wordProgress = JSON.parse(localStorage.getItem('wordProgress') || '{}');
        if (!wordProgress[wordId]) {
            wordProgress[wordId] = { attempts: 0, correct: 0, dates: [] };
        }
        
        wordProgress[wordId].attempts++;
        if (isCorrect) {
            wordProgress[wordId].correct++;
        }
        
        if (!wordProgress[wordId].dates.includes(today)) {
            wordProgress[wordId].dates.push(today);
        }
        
        localStorage.setItem('wordProgress', JSON.stringify(wordProgress));
    }
    
    updateAccuracy(accuracy) {
        // Moving average calculation
        const currentCount = this.liveData.performanceHistory.length;
        this.liveData.averageAccuracy = (this.liveData.averageAccuracy * currentCount + accuracy) / (currentCount + 1);
    }
    
    addXP(amount) {
        this.liveData.totalXP += amount;
        
        // Calculate level (every 100 XP = 1 level)
        const newLevel = Math.floor(this.liveData.totalXP / 100) + 1;
        if (newLevel > this.liveData.level) {
            this.liveData.level = newLevel;
            this.triggerLevelUp(newLevel);
        }
    }
    
    triggerLevelUp(newLevel) {
        // Trigger level up notification
        const event = new CustomEvent('levelUp', {
            detail: { newLevel, totalXP: this.liveData.totalXP }
        });
        document.dispatchEvent(event);
        
        console.log(`🎉 Level up! New level: ${newLevel}`);
    }
    
    updateStreak() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const todayStr = today.toDateString();
        const yesterdayStr = yesterday.toDateString();
        
        const lastStudyDate = localStorage.getItem('lastStudyDate');
        const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
        
        if (lastStudyDate === todayStr) {
            // Already studied today
            this.liveData.currentStreak = currentStreak;
        } else if (lastStudyDate === yesterdayStr) {
            // Studied yesterday, continue streak
            this.liveData.currentStreak = currentStreak;
        } else {
            // Streak broken
            this.liveData.currentStreak = 0;
        }
    }
    
    updateStreakOnCorrect() {
        const today = new Date().toDateString();
        const lastStudyDate = localStorage.getItem('lastStudyDate');
        
        if (lastStudyDate !== today) {
            // First correct answer today
            this.liveData.currentStreak++;
            this.liveData.bestStreak = Math.max(this.liveData.bestStreak, this.liveData.currentStreak);
            
            localStorage.setItem('lastStudyDate', today);
            localStorage.setItem('currentStreak', this.liveData.currentStreak.toString());
        }
    }
    
    updateDailyProgress() {
        const today = new Date().toDateString();
        localStorage.setItem(`dailyProgress_${today}`, this.liveData.dailyProgress.toString());
        
        // Check if daily goal is reached
        if (this.liveData.dailyProgress >= this.liveData.dailyGoal) {
            this.triggerGoalReached();
        }
    }
    
    triggerGoalReached() {
        const event = new CustomEvent('dailyGoalReached', {
            detail: { 
                goal: this.liveData.dailyGoal, 
                progress: this.liveData.dailyProgress 
            }
        });
        document.dispatchEvent(event);
        
        console.log('🎯 Daily goal reached!');
    }
    
    updatePerformanceHistory() {
        const accuracy = this.sessionData.metrics.correctAnswers / 
                        Math.max(this.sessionData.metrics.totalWords, 1);
        
        this.liveData.performanceHistory.push({
            timestamp: Date.now(),
            accuracy: accuracy,
            totalWords: this.sessionData.metrics.totalWords,
            correctAnswers: this.sessionData.metrics.correctAnswers
        });
        
        // Keep only last 100 entries
        if (this.liveData.performanceHistory.length > 100) {
            this.liveData.performanceHistory.shift();
        }
    }
    
    recordSessionInHistory() {
        const sessionHistory = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
        
        const sessionRecord = {
            ...this.sessionData,
            performance: {
                accuracy: this.sessionData.metrics.correctAnswers / 
                         Math.max(this.sessionData.metrics.totalWords, 1),
                wordsPerMinute: this.sessionData.metrics.totalWords / 
                               Math.max(this.sessionData.metrics.totalTime / 60000, 1),
                hintsPerWord: this.sessionData.metrics.hintsUsed / 
                             Math.max(this.sessionData.metrics.totalWords, 1)
            }
        };
        
        sessionHistory.push(sessionRecord);
        
        // Keep only last 50 sessions
        if (sessionHistory.length > 50) {
            sessionHistory.shift();
        }
        
        localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
    }
    
    checkMilestones() {
        const milestones = [
            { id: 'first_word', threshold: 1, message: 'كلمتك الأولى! 🎉' },
            { id: 'ten_words', threshold: 10, message: 'عشر كلمات! 📚' },
            { id: 'fifty_words', threshold: 50, message: 'خمسون كلمة! 🌟' },
            { id: 'hundred_words', threshold: 100, message: 'مئة كلمة! 🏆' },
            { id: 'five_hundred_words', threshold: 500, message: 'خمسمئة كلمة! 👑' }
        ];
        
        milestones.forEach(milestone => {
            if (this.liveData.dailyProgress >= milestone.threshold && 
                !this.liveData.milestones.includes(milestone.id)) {
                
                this.liveData.milestones.push(milestone.id);
                this.triggerMilestone(milestone);
            }
        });
    }
    
    triggerMilestone(milestone) {
        const event = new CustomEvent('milestoneReached', {
            detail: milestone
        });
        document.dispatchEvent(event);
        
        console.log(`🏆 Milestone reached: ${milestone.message}`);
    }
    
    updateLiveMetrics() {
        // Calculate real-time metrics
        const sessionHistory = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
        
        if (sessionHistory.length > 0) {
            // Calculate learning velocity (words per session over last 7 sessions)
            const recentSessions = sessionHistory.slice(-7);
            this.liveData.learningVelocity = recentSessions.map(session => ({
                date: new Date(session.startTime).toLocaleDateString(),
                words: session.metrics.totalWords,
                accuracy: session.performance.accuracy
            }));
            
            // Update weekly and monthly progress
            this.updatePeriodProgress();
        }
    }
    
    updatePeriodProgress() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        let weeklyWords = 0;
        let monthlyWords = 0;
        
        // Check daily progress for the last 7 and 30 days
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = checkDate.toDateString();
            const dayProgress = parseInt(localStorage.getItem(`dailyProgress_${dateStr}`) || '0');
            
            monthlyWords += dayProgress;
            
            if (i < 7) {
                weeklyWords += dayProgress;
            }
        }
        
        this.liveData.weeklyProgress = weeklyWords;
        this.liveData.monthlyProgress = monthlyWords;
    }
    
    broadcastUpdate() {
        // Broadcast real-time data to dashboard
        const event = new CustomEvent('analyticsUpdate', {
            detail: {
                liveData: this.liveData,
                sessionData: this.sessionData,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
        
        // Update analytics dashboard if available
        if (window.analyticsDashboard && typeof window.analyticsDashboard.updateWithRealTimeData === 'function') {
            window.analyticsDashboard.updateWithRealTimeData(this.liveData);
        }
    }
    
    resetSessionData() {
        this.sessionData = {
            startTime: null,
            endTime: null,
            currentMode: null,
            sessionId: this.generateSessionId(),
            events: [],
            metrics: {
                totalWords: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                hintsUsed: 0,
                totalTime: 0,
                interactions: 0,
                modesSwitched: 0
            }
        };
    }
    
    saveData() {
        try {
            localStorage.setItem('turkishAnalyticsData', JSON.stringify(this.liveData));
        } catch (error) {
            console.warn('Failed to save analytics data:', error);
        }
    }
    
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    registerGlobalFunctions() {
        // Make analytics functions globally available
        window.getRealTimeAnalytics = () => this.liveData;
        window.getSessionData = () => this.sessionData;
        window.exportAnalytics = () => this.exportData();
        window.resetAnalytics = () => this.resetAllData();
    }
    
    exportData() {
        const exportData = {
            liveData: this.liveData,
            sessionHistory: JSON.parse(localStorage.getItem('sessionHistory') || '[]'),
            wordProgress: JSON.parse(localStorage.getItem('wordProgress') || '{}'),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `turkish_learning_analytics_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        console.log('📊 Analytics data exported');
    }
    
    resetAllData() {
        if (confirm('هل أنت متأكد من حذف جميع بيانات التحليل؟')) {
            localStorage.removeItem('turkishAnalyticsData');
            localStorage.removeItem('sessionHistory');
            localStorage.removeItem('wordProgress');
            
            // Reset daily progress for all dates
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('dailyProgress_')) {
                    localStorage.removeItem(key);
                }
            });
            
            // Reset to defaults
            this.liveData = {
                currentStreak: 0,
                dailyGoal: 20,
                dailyProgress: 0,
                weeklyProgress: 0,
                monthlyProgress: 0,
                averageAccuracy: 0,
                bestStreak: 0,
                totalXP: 0,
                level: 1,
                categoryProgress: {},
                difficultyProgress: {},
                modeUsage: {},
                learningVelocity: [],
                performanceHistory: [],
                milestones: []
            };
            
            this.resetSessionData();
            this.saveData();
            
            console.log('🔄 Analytics data reset');
        }
    }
    
    destroy() {
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
        }
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.isActive = false;
        console.log('📊 Real-Time Analytics System destroyed');
    }
}

// Initialize real-time analytics
window.realTimeAnalytics = new RealTimeAnalytics();

// Make it globally accessible
window.RealTimeAnalytics = RealTimeAnalytics;

console.log('📊 Real-Time Analytics System loaded successfully!');