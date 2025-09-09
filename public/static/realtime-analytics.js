// 📊 Real-Time Analytics System for Turkish Learning App
// This system is a passive recipient of analytics data from a real-time source.

class RealTimeAnalytics {
    constructor() {
        this.isActive = false;
        this.sessionData = {};
        this.liveData = {};
        this.updateInterval = null;

        this.init();
        console.log('📊 Real-Time Analytics System initialized');
    }

    init() {
        this.resetAllData();
        this.registerGlobalFunctions();
        this.startRealTimeTracking();
    }

    startRealTimeTracking() {
        // This interval is to ensure the dashboard is updated periodically
        // even if no new data is coming in.
        this.updateInterval = setInterval(() => {
            this.broadcastUpdate();
        }, 10000);

        this.isActive = true;
        console.log('📊 Real-time tracking started');
    }

    updateData(newData) {
        if (newData.liveData) {
            this.liveData = { ...this.liveData, ...newData.liveData };
        }
        if (newData.sessionData) {
            this.sessionData = { ...this.sessionData, ...newData.sessionData };
        }
        this.broadcastUpdate();
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
            sessionId: null,
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
        window.updateAnalyticsData = (newData) => this.updateData(newData);
    }

    exportData() {
        const exportData = {
            liveData: this.liveData,
            sessionData: this.sessionData,
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
        this.broadcastUpdate();
        console.log('🔄 Analytics data reset');
    }

    destroy() {
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