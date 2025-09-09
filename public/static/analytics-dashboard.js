// Advanced Analytics Dashboard for Turkish Learning App
// Preserves glass morphism theme and Turkish/Arabic color scheme

class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#4A90E2',     // Rosetta Blue
            secondary: '#6BA3E8',   // Rosetta Blue Light
            accent: '#FFD700',      // Primary Yellow
            success: '#10B981',     // Primary Green
            warning: '#F59E0B',     // Warning
            error: '#EF4444',       // Error
            gradient: ['#4A90E2', '#6BA3E8', '#10B981', '#FFD700']
        };
        
        // Real-time data integration
        this.realTimeData = null;
        this.isRealTimeEnabled = false;
        this.updateQueue = [];
        
        this.initializeAnalytics();
        this.setupRealTimeIntegration();
    }
    
    initializeAnalytics() {
        console.log('Initializing Advanced Analytics Dashboard...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnalytics());
        } else {
            this.setupAnalytics();
        }
    }
    
    setupAnalytics() {
        this.generateLearningHeatmap();
        this.createPerformanceTrendChart();
        this.createCategoryRadarChart();
        this.createLearningVelocityChart();
        this.generateAIRecommendations();
        this.createRealTimeStatsCards();
    }
    
    setupRealTimeIntegration() {
        // Listen for real-time analytics updates
        document.addEventListener('analyticsUpdate', (event) => {
            this.handleRealTimeUpdate(event.detail);
        });
        
        // Listen for learning events
        document.addEventListener('learningModeEvent', (event) => {
            this.handleLearningEvent(event.detail);
        });
        
        // Listen for milestone events
        document.addEventListener('milestoneReached', (event) => {
            this.handleMilestone(event.detail);
        });
        
        // Listen for level up events
        document.addEventListener('levelUp', (event) => {
            this.handleLevelUp(event.detail);
        });
        
        // Check if real-time analytics is available
        if (window.realTimeAnalytics) {
            this.isRealTimeEnabled = true;
            this.realTimeData = window.getRealTimeAnalytics();
            console.log('📊 Real-time analytics integration enabled');
        }
        
        // Start live updates
        this.startLiveUpdates();
    }
    
    startLiveUpdates() {
        // Update every 30 seconds
        setInterval(() => {
            if (this.isRealTimeEnabled && window.getRealTimeAnalytics) {
                this.realTimeData = window.getRealTimeAnalytics();
                this.updateRealTimeElements();
            }
        }, 30000);
    }
    
    handleRealTimeUpdate(updateData) {
        this.realTimeData = updateData.liveData;
        this.updateRealTimeElements();
        
        // Queue chart updates (throttled)
        if (this.updateQueue.length === 0) {
            setTimeout(() => {
                this.processUpdateQueue();
            }, 2000);
        }
        this.updateQueue.push(updateData);
    }
    
    handleLearningEvent(eventData) {
        // Handle specific learning events for real-time feedback
        // This now correctly accesses the nested 'data' property from the new event structure
        switch (eventData.event) {
            case 'question_answered':
                this.showLiveAccuracy(eventData.data);
                break;
            case 'session_completed':
                this.updateSessionCompletionStats(eventData.data);
                break;
        }
    }
    
    handleMilestone(milestone) {
        this.showMilestoneNotification(milestone);
    }
    
    handleLevelUp(levelData) {
        this.showLevelUpNotification(levelData);
    }
    
    updateSessionCompletionStats(sessionData) {
        console.log('📊 Updating session completion stats:', sessionData);
        
        // Update real-time stats
        const currentStats = this.getRealTimeStats();
        
        // Update daily progress
        if (sessionData.completed) {
            currentStats.dailyProgress = (currentStats.dailyProgress || 0) + sessionData.completed;
        }
        
        // Update streak if session was successful
        if (sessionData.accuracy && sessionData.accuracy > 60) {
            currentStats.currentStreak = Math.max(currentStats.currentStreak, 1);
        }
        
        // Update weekly progress
        if (sessionData.totalWords) {
            currentStats.weeklyProgress = (currentStats.weeklyProgress || 0) + sessionData.totalWords;
        }
        
        // Save updated stats
        localStorage.setItem('realTimeAnalytics', JSON.stringify(currentStats));
        
        // Update UI elements
        this.updateStatsDisplay(currentStats);
        
        // Show completion feedback
        this.showSessionCompletionFeedback(sessionData);
    }
    
    updateStatsDisplay(stats) {
        // Update daily progress
        const dailyProgressValue = document.getElementById('daily-progress-value');
        if (dailyProgressValue) {
            dailyProgressValue.textContent = stats.dailyProgress || 0;
        }
        
        // Update streak
        const streakValue = document.getElementById('streak-value');
        if (streakValue) {
            streakValue.textContent = stats.currentStreak || 0;
        }
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill && stats.dailyGoal) {
            const percentage = Math.min((stats.dailyProgress / stats.dailyGoal) * 100, 100);
            progressFill.style.width = percentage + '%';
        }
    }
    
    showSessionCompletionFeedback(sessionData) {
        // Show a brief success message
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            z-index: 1000;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
            direction: rtl;
        `;
        
        const accuracy = sessionData.accuracy || 0;
        const emoji = accuracy >= 90 ? '🎆' : accuracy >= 70 ? '🎉' : '💪';
        
        feedback.innerHTML = `
            ${emoji} جلسة مكتملة!<br>
            <small>دقة: ${accuracy}% | كلمات: ${sessionData.totalWords || 0}</small>
        `;
        
        document.body.appendChild(feedback);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 3000);
    }
    
    processUpdateQueue() {
        if (this.updateQueue.length > 0) {
            // Process the most recent update
            const latestUpdate = this.updateQueue[this.updateQueue.length - 1];
            this.updateChartsWithRealTimeData(latestUpdate.liveData);
            this.updateQueue = [];
        }
    }
    
    // Generate Learning Heatmap
    generateLearningHeatmap() {
        const heatmapContainer = document.getElementById('learning-heatmap');
        if (!heatmapContainer) return;
        
        // Generate last 365 days of data
        const today = new Date();
        const startDate = new Date(today.getTime() - (365 * 24 * 60 * 60 * 1000));
        const learningData = this.generateHeatmapData(startDate, today);
        
        heatmapContainer.innerHTML = `
            <div class="heatmap-header" style="margin-bottom: 1rem; text-align: center;">
                <h5 style="color: var(--gray-700); margin-bottom: 0.5rem;">نشاط التعلم - آخر سنة</h5>
            </div>
            <div class="heatmap-grid" id="heatmap-grid"></div>
            <div class="heatmap-legend">
                <span style="margin-left: 1rem;">أقل</span>
                <div class="heatmap-legend-item">
                    <div class="heatmap-legend-color level-0"></div>
                </div>
                <div class="heatmap-legend-item">
                    <div class="heatmap-legend-color level-1"></div>
                </div>
                <div class="heatmap-legend-item">
                    <div class="heatmap-legend-color level-2"></div>
                </div>
                <div class="heatmap-legend-item">
                    <div class="heatmap-legend-color level-3"></div>
                </div>
                <div class="heatmap-legend-item">
                    <div class="heatmap-legend-color level-4"></div>
                </div>
                <span style="margin-right: 1rem;">أكثر</span>
            </div>
        `;
        
        const grid = document.getElementById('heatmap-grid');
        learningData.forEach(day => {
            const cell = document.createElement('div');
            cell.className = `heatmap-cell level-${day.level}`;
            cell.title = `${day.date}: ${day.count} كلمة مُتعلمة`;
            cell.addEventListener('mouseenter', (e) => this.showHeatmapTooltip(e, day));
            grid.appendChild(cell);
        });
    }
    
    generateHeatmapData(startDate, endDate) {
        const data = [];
        const currentDate = new Date(startDate);
        
        // Get learning sessions from localStorage
        const learningHistory = JSON.parse(localStorage.getItem('learningHistory') || '{}');
        
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const count = learningHistory[dateStr] || Math.floor(Math.random() * 15); // Simulate data
            
            // Store simulated data for future use
            if (!learningHistory[dateStr] && Math.random() < 0.3) {
                learningHistory[dateStr] = count;
            }
            
            data.push({
                date: dateStr,
                count: count,
                level: this.getHeatmapLevel(count)
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Save updated history
        localStorage.setItem('learningHistory', JSON.stringify(learningHistory));
        return data;
    }
    
    getHeatmapLevel(count) {
        if (count === 0) return 0;
        if (count <= 3) return 1;
        if (count <= 6) return 2;
        if (count <= 10) return 3;
        return 4;
    }
    
    showHeatmapTooltip(event, day) {
        // Simple tooltip implementation
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            left: ${event.pageX + 10}px;
            top: ${event.pageY - 30}px;
        `;
        tooltip.textContent = `${day.date}: ${day.count} كلمة`;
        document.body.appendChild(tooltip);
        
        setTimeout(() => tooltip.remove(), 2000);
    }
    
    // Performance Trend Chart
    createPerformanceTrendChart() {
        const ctx = document.getElementById('performance-trend-chart');
        if (!ctx) return;
        
        const performanceData = this.generatePerformanceData();
        
        this.charts.performanceTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: performanceData.labels,
                datasets: [{
                    label: 'معدل الدقة',
                    data: performanceData.accuracy,
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: { family: 'Noto Sans Arabic' },
                            color: '#374151'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            font: { family: 'Noto Sans Arabic' },
                            color: '#6B7280',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            font: { family: 'Noto Sans Arabic' },
                            color: '#6B7280'
                        }
                    }
                }
            }
        });
    }
    
    createRealTimeStatsCards() {
        const statsContainer = document.getElementById('realtime-stats');
        if (!statsContainer) return;
        
        const stats = this.getRealTimeStats();
        
        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card" id="daily-progress-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-content">
                        <div class="stat-value" id="daily-progress-value">${stats.dailyProgress}</div>
                        <div class="stat-label">كلمات اليوم</div>
                        <div class="stat-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(stats.dailyProgress / stats.dailyGoal) * 100}%"></div>
                            </div>
                            <span class="progress-text">${stats.dailyGoal} هدف</span>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card" id="streak-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-content">
                        <div class="stat-value" id="streak-value">${stats.currentStreak}</div>
                        <div class="stat-label">أيام متتالية</div>
                        <div class="stat-subtitle">الأفضل: ${stats.bestStreak} يوم</div>
                    </div>
                </div>
                
                <div class="stat-card" id="accuracy-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-content">
                        <div class="stat-value" id="accuracy-value">${Math.round(stats.averageAccuracy * 100)}%</div>
                        <div class="stat-label">معدل الدقة</div>
                        <div class="stat-trend ${stats.accuracyTrend}">
                            ${stats.accuracyTrend === 'up' ? '↗️' : stats.accuracyTrend === 'down' ? '↘️' : '➡️'}
                        </div>
                    </div>
                </div>
                
                <div class="stat-card" id="level-card">
                    <div class="stat-icon">👑</div>
                    <div class="stat-content">
                        <div class="stat-value" id="level-value">${stats.level}</div>
                        <div class="stat-label">المستوى</div>
                        <div class="stat-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${stats.xpProgress}%"></div>
                            </div>
                            <span class="progress-text">${stats.totalXP} XP</span>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card" id="session-card">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-content">
                        <div class="stat-value" id="session-value">${stats.sessionTime}</div>
                        <div class="stat-label">وقت الجلسة</div>
                        <div class="stat-subtitle">${stats.totalSessions} جلسة</div>
                    </div>
                </div>
                
                <div class="stat-card" id="velocity-card">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-content">
                        <div class="stat-value" id="velocity-value">${stats.wordsPerMinute}</div>
                        <div class="stat-label">كلمة/دقيقة</div>
                        <div class="stat-subtitle">السرعة الحالية</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getRealTimeStats() {
        const defaultStats = {
            dailyProgress: 0,
            dailyGoal: 20,
            currentStreak: 0,
            bestStreak: 0,
            averageAccuracy: 0,
            accuracyTrend: 'stable',
            level: 1,
            totalXP: 0,
            xpProgress: 0,
            sessionTime: '0m',
            totalSessions: 0,
            wordsPerMinute: 0
        };
        
        if (!this.realTimeData) {
            return defaultStats;
        }
        
        const nextLevelXP = this.realTimeData.level * 100;
        const currentLevelXP = (this.realTimeData.level - 1) * 100;
        const xpInLevel = this.realTimeData.totalXP - currentLevelXP;
        const xpProgress = (xpInLevel / (nextLevelXP - currentLevelXP)) * 100;
        
        // Calculate session time from current session
        const sessionData = window.getSessionData ? window.getSessionData() : {};
        const sessionTime = sessionData.startTime ? 
            this.formatTime(Date.now() - sessionData.startTime) : '0m';
        
        // Calculate words per minute
        const wordsPerMinute = this.calculateWordsPerMinute();
        
        return {
            ...defaultStats,
            dailyProgress: this.realTimeData.dailyProgress || 0,
            dailyGoal: this.realTimeData.dailyGoal || 20,
            currentStreak: this.realTimeData.currentStreak || 0,
            bestStreak: this.realTimeData.bestStreak || 0,
            averageAccuracy: this.realTimeData.averageAccuracy || 0,
            level: this.realTimeData.level || 1,
            totalXP: this.realTimeData.totalXP || 0,
            xpProgress: Math.min(100, Math.max(0, xpProgress)),
            sessionTime,
            wordsPerMinute
        };
    }

    generatePerformanceData() {
        // Use real-time data if available
        if (this.realTimeData && this.realTimeData.performanceHistory.length > 0) {
            const history = this.realTimeData.performanceHistory.slice(-30);
            const labels = history.map(entry => 
                new Date(entry.timestamp).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })
            );
            const accuracy = history.map(entry => entry.accuracy * 100);
            
            return { labels, accuracy };
        }
        
        // Fallback to generated data
        const days = 30;
        const labels = [];
        const accuracy = [];
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }));
            
            // Simulate improving accuracy over time with some variation
            const baseAccuracy = 60 + (days - i) * 0.8;
            const variation = (Math.random() - 0.5) * 10;
            accuracy.push(Math.min(100, Math.max(0, baseAccuracy + variation)));
        }
        
        return { labels, accuracy };
    }
    
    // Category Mastery Radar Chart
    createCategoryRadarChart() {
        const ctx = document.getElementById('category-radar-chart');
        if (!ctx) return;
        
        const categories = [
            'التحيات', 'السفر', 'الطعام', 'التسوق',
            'الاتجاهات', 'الطوارئ', 'الوقت', 'الأرقام'
        ];
        
        const masteryData = this.getCategoryMasteryData();
        
        this.charts.categoryRadar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'مستوى الإتقان',
                    data: masteryData,
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '30',
                    borderWidth: 2,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: { family: 'Noto Sans Arabic' },
                            color: '#374151'
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        pointLabels: {
                            font: { family: 'Noto Sans Arabic', size: 11 },
                            color: '#374151'
                        },
                        ticks: {
                            font: { family: 'Noto Sans Arabic' },
                            color: '#6B7280',
                            stepSize: 20,
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    getCategoryMasteryData() {
        // Get actual progress data from app or simulate
        const userProgress = JSON.parse(localStorage.getItem('turkishLearningProgress') || '{}');
        const categories = ['greetings', 'travel', 'food', 'shopping', 'directions', 'emergency', 'time', 'numbers'];
        
        return categories.map(category => {
            const progress = userProgress[category];
            if (progress && progress.wordsLearned) {
                return Math.min(100, (progress.wordsLearned / 6) * 100); // 6 words per category
            }
            // Simulate some progress
            return Math.floor(Math.random() * 80) + 20;
        });
    }
    
    // Learning Velocity Chart
    createLearningVelocityChart() {
        const ctx = document.getElementById('learning-velocity-chart');
        if (!ctx) return;
        
        const velocityData = this.generateVelocityData();
        
        this.charts.learningVelocity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: velocityData.labels,
                datasets: [{
                    label: 'كلمات جديدة',
                    data: velocityData.newWords,
                    backgroundColor: this.colors.primary + '80',
                    borderColor: this.colors.primary,
                    borderWidth: 1,
                    borderRadius: 6
                }, {
                    label: 'كلمات مراجعة',
                    data: velocityData.reviewWords,
                    backgroundColor: this.colors.accent + '80',
                    borderColor: this.colors.accent,
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: { family: 'Noto Sans Arabic' },
                            color: '#374151'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            font: { family: 'Noto Sans Arabic' },
                            color: '#6B7280'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { family: 'Noto Sans Arabic' },
                            color: '#6B7280'
                        }
                    }
                }
            }
        });
    }
    
    generateVelocityData() {
        // Use real-time data if available
        if (this.realTimeData && this.realTimeData.learningVelocity.length > 0) {
            const velocity = this.realTimeData.learningVelocity.slice(-7);
            const labels = velocity.map(v => v.date);
            const newWords = velocity.map(v => v.words);
            const reviewWords = velocity.map(v => Math.floor(v.words * 0.3)); // Estimate review words
            
            return { labels, newWords, reviewWords };
        }
        
        // Fallback to generated data
        const sessions = ['الجلسة 1', 'الجلسة 2', 'الجلسة 3', 'الجلسة 4', 'الجلسة 5', 'الجلسة 6', 'الجلسة 7'];
        const newWords = sessions.map(() => Math.floor(Math.random() * 8) + 2);
        const reviewWords = sessions.map(() => Math.floor(Math.random() * 6) + 1);
        
        return {
            labels: sessions,
            newWords,
            reviewWords
        };
    }
    
    updateRealTimeElements() {
        if (!this.realTimeData) return;
        
        // Update stat cards
        this.updateStatCard('daily-progress-value', this.realTimeData.dailyProgress || 0);
        this.updateStatCard('streak-value', this.realTimeData.currentStreak || 0);
        this.updateStatCard('accuracy-value', `${Math.round((this.realTimeData.averageAccuracy || 0) * 100)}%`);
        this.updateStatCard('level-value', this.realTimeData.level || 1);
        
        // Update progress bars
        this.updateProgressBar('daily-progress-card', 
            (this.realTimeData.dailyProgress || 0) / (this.realTimeData.dailyGoal || 20) * 100);
        
        const nextLevelXP = this.realTimeData.level * 100;
        const currentLevelXP = (this.realTimeData.level - 1) * 100;
        const xpInLevel = this.realTimeData.totalXP - currentLevelXP;
        const xpProgress = (xpInLevel / (nextLevelXP - currentLevelXP)) * 100;
        this.updateProgressBar('level-card', Math.min(100, Math.max(0, xpProgress)));
        
        // Update session time
        const sessionData = window.getSessionData ? window.getSessionData() : {};
        if (sessionData.startTime) {
            const sessionTime = this.formatTime(Date.now() - sessionData.startTime);
            this.updateStatCard('session-value', sessionTime);
        }
        
        // Update words per minute
        const wpm = this.calculateWordsPerMinute();
        this.updateStatCard('velocity-value', wpm);
    }
    
    updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
            element.classList.add('stat-updated');
            setTimeout(() => {
                element.classList.remove('stat-updated');
            }, 500);
        }
    }
    
    updateProgressBar(cardId, percentage) {
        const card = document.getElementById(cardId);
        if (card) {
            const progressFill = card.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
            }
        }
    }
    
    calculateWordsPerMinute() {
        const sessionData = window.getSessionData ? window.getSessionData() : {};
        if (sessionData.startTime && sessionData.metrics.totalWords > 0) {
            const sessionTimeMinutes = (Date.now() - sessionData.startTime) / 60000;
            return Math.round(sessionData.metrics.totalWords / Math.max(sessionTimeMinutes, 1));
        }
        return 0;
    }
    
    updateChartsWithRealTimeData(liveData) {
        // Update performance trend chart
        if (this.charts.performanceTrend && liveData.performanceHistory) {
            const newData = this.generatePerformanceData();
            this.charts.performanceTrend.data.labels = newData.labels;
            this.charts.performanceTrend.data.datasets[0].data = newData.accuracy;
            this.charts.performanceTrend.update('none'); // Smooth update
        }
        
        // Update category radar chart
        if (this.charts.categoryRadar) {
            const newMasteryData = this.getCategoryMasteryDataRealTime(liveData);
            this.charts.categoryRadar.data.datasets[0].data = newMasteryData;
            this.charts.categoryRadar.update('none');
        }
        
        // Update velocity chart
        if (this.charts.learningVelocity) {
            const newVelocityData = this.generateVelocityData();
            this.charts.learningVelocity.data.labels = newVelocityData.labels;
            this.charts.learningVelocity.data.datasets[0].data = newVelocityData.newWords;
            this.charts.learningVelocity.data.datasets[1].data = newVelocityData.reviewWords;
            this.charts.learningVelocity.update('none');
        }
        
        // Regenerate heatmap with new data
        this.generateLearningHeatmapRealTime(liveData);
    }
    
    getCategoryMasteryDataRealTime(liveData) {
        if (liveData.categoryProgress && Object.keys(liveData.categoryProgress).length > 0) {
            const categories = ['greetings', 'travel', 'food', 'shopping', 'directions', 'emergency', 'time', 'numbers'];
            return categories.map(category => {
                const progress = liveData.categoryProgress[category];
                if (progress && progress.wordsLearned) {
                    return Math.min(100, (progress.wordsLearned / 10) * 100); // Assuming 10 words per category
                }
                return Math.floor(Math.random() * 80) + 20; // Fallback
            });
        }
        
        return this.getCategoryMasteryData();
    }
    
    generateLearningHeatmapRealTime(liveData) {
        // Enhanced heatmap with real-time data
        const heatmapContainer = document.getElementById('learning-heatmap');
        if (!heatmapContainer) return;
        
        this.generateLearningHeatmap(); // Use existing method with real-time enhancement
    }
    
    showLiveAccuracy(answerData) {
        if (answerData.isCorrect) {
            this.showNotification('إجابة صحيحة! ✅', 'success', 2000);
        } else {
            this.showNotification('إجابة خاطئة ❌', 'warning', 2000);
        }
    }
    
    showMilestoneNotification(milestone) {
        this.showNotification(
            `🏆 إنجاز جديد: ${milestone.message}`, 
            'success', 
            5000
        );
    }
    
    showLevelUpNotification(levelData) {
        this.showNotification(
            `🎉 تهانينا! وصلت للمستوى ${levelData.newLevel}`, 
            'success', 
            5000
        );
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `analytics-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : '#4A90E2'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-family: 'Noto Sans Arabic', sans-serif;
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.onclick = () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        };
        
        // Auto close
        setTimeout(() => {
            if (document.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
    
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return `${seconds}s`;
        }
    }
    
    // AI-Powered Recommendations
    generateAIRecommendations() {
        const container = document.getElementById('ai-recommendations');
        if (!container) return;
        
        const recommendations = this.analyzeWeaknesses();
        
        const recommendationsHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="recommendation-priority ${rec.priority}">${rec.priorityText}</div>
                <div class="recommendation-text">${rec.text}</div>
                <div class="recommendation-action" onclick="window.${rec.action}">
                    <i class="fas fa-arrow-left"></i>
                    ${rec.actionText}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = recommendationsHTML;
    }
    
    analyzeWeaknesses() {
        const userProgress = JSON.parse(localStorage.getItem('turkishLearningProgress') || '{}');
        const totalXP = parseInt(localStorage.getItem('userXP') || '0');
        const currentStreak = this.getCurrentStreak();
        
        const recommendations = [];
        
        // Analyze category performance
        const categoryPerformance = this.getCategoryMasteryData();
        const weakestCategory = Math.min(...categoryPerformance);
        
        if (weakestCategory < 50) {
            recommendations.push({
                priority: 'high',
                priorityText: 'أولوية عالية',
                text: 'يبدو أن لديك صعوبة في إحدى الفئات. ننصحك بالتركيز على الكلمات الأساسية والمراجعة المتكررة.',
                action: 'startQuickLearn("greetings")',
                actionText: 'ابدأ المراجعة المكثفة'
            });
        }
        
        // Streak analysis
        if (currentStreak < 3) {
            recommendations.push({
                priority: 'medium',
                priorityText: 'أولوية متوسطة',
                text: 'حافظ على الاستمرارية! التعلم اليومي لمدة قصيرة أفضل من جلسات طويلة متقطعة.',
                action: 'showSection("learn")',
                actionText: 'ابدأ جلسة سريعة'
            });
        }
        
        // XP-based recommendation
        if (totalXP < 100) {
            recommendations.push({
                priority: 'low',
                priorityText: 'أولوية منخفضة',
                text: 'أنت في بداية رحلة التعلم. ننصح بالتركيز على فئة واحدة حتى تتقنها قبل الانتقال للتالية.',
                action: 'showSection("learn")',
                actionText: 'تعلم كلمات جديدة'
            });
        }
        
        // Advanced learner recommendations
        if (totalXP > 500) {
            recommendations.push({
                priority: 'medium',
                priorityText: 'تحدي متقدم',
                text: 'مستواك ممتاز! حان الوقت لتحدي نفسك بالمراجعة السريعة والتركيز على النطق المثالي.',
                action: 'startReview("all")',
                actionText: 'تحدي المراجعة السريعة'
            });
        }
        
        // Default recommendation if no specific issues
        if (recommendations.length === 0) {
            recommendations.push({
                priority: 'low',
                priorityText: 'استمر كذلك',
                text: 'أداؤك ممتاز! استمر في الممارسة اليومية والمراجعة المنتظمة للحفاظ على مستواك.',
                action: 'showSection("review")',
                actionText: 'مراجعة منتظمة'
            });
        }
        
        return recommendations.slice(0, 3); // Show max 3 recommendations
    }
    
    getCurrentStreak() {
        const lastStudyDate = localStorage.getItem('lastStudyDate');
        if (!lastStudyDate) return 0;
        
        const today = new Date().toDateString();
        const lastDate = new Date(lastStudyDate).toDateString();
        
        if (today === lastDate) {
            return parseInt(localStorage.getItem('currentStreak') || '0');
        }
        
        return 0;
    }
    
    // Update analytics when profile is shown
    updateAnalytics() {
        // Update real-time data
        if (this.isRealTimeEnabled && window.getRealTimeAnalytics) {
            this.realTimeData = window.getRealTimeAnalytics();
        }
        
        if (this.charts.performanceTrend) {
            const newData = this.generatePerformanceData();
            this.charts.performanceTrend.data.labels = newData.labels;
            this.charts.performanceTrend.data.datasets[0].data = newData.accuracy;
            this.charts.performanceTrend.update();
        }
        
        if (this.charts.categoryRadar) {
            const newMasteryData = this.realTimeData ? 
                this.getCategoryMasteryDataRealTime(this.realTimeData) : 
                this.getCategoryMasteryData();
            this.charts.categoryRadar.data.datasets[0].data = newMasteryData;
            this.charts.categoryRadar.update();
        }
        
        if (this.charts.learningVelocity) {
            const newVelocityData = this.generateVelocityData();
            this.charts.learningVelocity.data.datasets[0].data = newVelocityData.newWords;
            this.charts.learningVelocity.data.datasets[1].data = newVelocityData.reviewWords;
            this.charts.learningVelocity.update();
        }
        
        this.generateLearningHeatmap();
        this.generateAIRecommendations();
        this.updateRealTimeElements();
    }
    
    // Method to be called by real-time analytics
    updateWithRealTimeData(liveData) {
        this.realTimeData = liveData;
        this.updateRealTimeElements();
        
        // Throttled chart updates
        if (!this.chartUpdatePending) {
            this.chartUpdatePending = true;
            setTimeout(() => {
                this.updateChartsWithRealTimeData(liveData);
                this.chartUpdatePending = false;
            }, 1000);
        }
    }
    
    // Destroy charts when needed
    destroyAnalytics() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Initialize Analytics Dashboard
window.analyticsDashboard = new AnalyticsDashboard();

// Make analytics update function globally available
window.updateAnalytics = function() {
    if (window.analyticsDashboard) {
        window.analyticsDashboard.updateAnalytics();
    }
};

console.log('Advanced Analytics Dashboard loaded successfully!');