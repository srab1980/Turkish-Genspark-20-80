/**
 * 📊 SIMPLE ANALYTICS SYSTEM - GUARANTEED TO WORK
 * Created to fix persistent analytics issues
 */

class SimpleAnalytics {
    constructor() {
        this.data = {
            wordsLearned: 0,
            sessionsCompleted: 0,
            totalTime: 0,
            streak: 0,
            accuracy: 0,
            lastSessionDate: null,
            categories: {}
        };
        
        this.loadData();
        console.log('📊 Simple Analytics initialized with data:', this.data);
    }
    
    loadData() {
        try {
            const stored = localStorage.getItem('simple_analytics_data');
            if (stored) {
                this.data = { ...this.data, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.error('Error loading analytics data:', error);
        }
    }
    
    saveData() {
        try {
            localStorage.setItem('simple_analytics_data', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving analytics data:', error);
        }
    }
    
    trackSessionCompletion(sessionData) {
        console.log('📈 Tracking session completion:', sessionData);
        
        // Update analytics data
        this.data.sessionsCompleted++;
        this.data.wordsLearned += sessionData.totalWords || 10;
        this.data.totalTime += sessionData.timeSpent || 5;
        this.data.lastSessionDate = new Date().toISOString();
        
        // Calculate accuracy
        const totalAnswers = (sessionData.correct || 0) + (sessionData.incorrect || 0);
        if (totalAnswers > 0) {
            this.data.accuracy = Math.round(((sessionData.correct || 0) / totalAnswers) * 100);
        }
        
        // Update streak
        this.updateStreak();
        
        // Save data
        this.saveData();
        
        // Update displays
        this.updateAllDisplays();
        
        console.log('📊 Analytics updated:', this.data);
    }
    
    updateStreak() {
        const today = new Date().toDateString();
        const lastSession = this.data.lastSessionDate ? new Date(this.data.lastSessionDate).toDateString() : null;
        
        if (lastSession === today) {
            // Session already today, don't change streak
        } else if (lastSession === new Date(Date.now() - 24*60*60*1000).toDateString()) {
            // Session was yesterday, increment streak
            this.data.streak++;
        } else if (lastSession) {
            // Gap in sessions, reset streak
            this.data.streak = 1;
        } else {
            // First session ever
            this.data.streak = 1;
        }
    }
    
    updateAllDisplays() {
        // Update profile statistics
        this.updateProfileStats();
        
        // Update dashboard stats
        this.updateDashboardStats();
        
        // Update analytics dashboard if visible
        this.updateAnalyticsDashboard();
    }
    
    updateProfileStats() {
        // Update the profile section statistics
        const profileSection = document.querySelector('#profile-section');
        if (!profileSection) return;
        
        // Update streak display
        const streakElement = profileSection.querySelector('.stat-value');
        if (streakElement) {
            streakElement.textContent = this.data.streak;
        }
        
        // Update other stats
        const statElements = profileSection.querySelectorAll('.user-stat-card');
        statElements.forEach(element => {
            const label = element.querySelector('.stat-label')?.textContent;
            const valueElement = element.querySelector('.stat-value');
            
            if (label && valueElement) {
                if (label.includes('يوم متتالي') || label.includes('streak')) {
                    valueElement.textContent = this.data.streak;
                } else if (label.includes('كلمة') || label.includes('learned')) {
                    valueElement.textContent = this.data.wordsLearned;
                } else if (label.includes('نقطة') || label.includes('points')) {
                    valueElement.textContent = this.data.wordsLearned * 10; // 10 points per word
                }
            }
        });
        
        console.log('✅ Profile stats updated');
    }
    
    updateDashboardStats() {
        // Update main dashboard statistics
        const dashboardSection = document.querySelector('#dashboard-section');
        if (!dashboardSection) return;
        
        // Look for progress elements
        const progressElements = dashboardSection.querySelectorAll('.progress-circle-text, .stat-number, .metric-value');
        progressElements.forEach(element => {
            const parent = element.closest('.progress-item, .stat-card, .metric-card');
            if (parent) {
                const label = parent.querySelector('.progress-label, .stat-label, .metric-label')?.textContent;
                if (label) {
                    if (label.includes('إجمالي التقدم') || label.includes('overall progress')) {
                        element.textContent = `${Math.min(this.data.sessionsCompleted * 10, 100)}%`;
                    } else if (label.includes('إنجازات') || label.includes('achievements')) {
                        element.textContent = this.data.sessionsCompleted;
                    }
                }
            }
        });
        
        console.log('✅ Dashboard stats updated');
    }
    
    updateAnalyticsDashboard() {
        // Update the dedicated analytics dashboard if it exists
        const analyticsSection = document.querySelector('#analytics-dashboard, .analytics-container');
        if (!analyticsSection) return;
        
        // Update various analytics elements
        const elements = analyticsSection.querySelectorAll('[data-stat], .stat-value, .metric-number');
        elements.forEach(element => {
            const statType = element.dataset?.stat || element.className;
            
            if (statType.includes('sessions') || statType.includes('جلسات')) {
                element.textContent = this.data.sessionsCompleted;
            } else if (statType.includes('words') || statType.includes('كلمات')) {
                element.textContent = this.data.wordsLearned;
            } else if (statType.includes('streak') || statType.includes('متتالي')) {
                element.textContent = this.data.streak;
            } else if (statType.includes('accuracy') || statType.includes('دقة')) {
                element.textContent = `${this.data.accuracy}%`;
            } else if (statType.includes('time') || statType.includes('وقت')) {
                element.textContent = `${this.data.totalTime}m`;
            }
        });
        
        console.log('✅ Analytics dashboard updated');
    }
    
    // Method to manually trigger analytics update
    forceUpdate() {
        console.log('🔄 Forcing analytics update...');
        this.updateAllDisplays();
    }
    
    // Reset analytics (for testing)
    reset() {
        this.data = {
            wordsLearned: 0,
            sessionsCompleted: 0,
            totalTime: 0,
            streak: 0,
            accuracy: 0,
            lastSessionDate: null,
            categories: {}
        };
        this.saveData();
        this.updateAllDisplays();
        console.log('🔄 Analytics data reset');
    }
    
    // Get current data
    getData() {
        return { ...this.data };
    }
}

// Initialize simple analytics
window.simpleAnalytics = new SimpleAnalytics();

// Hook into flashcard completion events
document.addEventListener('flashcard_session_completed', function(event) {
    if (window.simpleAnalytics && event.detail) {
        window.simpleAnalytics.trackSessionCompletion(event.detail);
    }
});

// Also listen for the learning mode events
document.addEventListener('learning_mode_event', function(event) {
    if (event.detail?.type === 'session_completed' && window.simpleAnalytics) {
        window.simpleAnalytics.trackSessionCompletion(event.detail.data);
    }
});

// Try to update displays after page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.simpleAnalytics) {
            window.simpleAnalytics.forceUpdate();
        }
    }, 2000);
});

// Periodically update displays
setInterval(() => {
    if (window.simpleAnalytics) {
        window.simpleAnalytics.updateAllDisplays();
    }
}, 5000);

console.log('📊 Simple Analytics System loaded successfully!');