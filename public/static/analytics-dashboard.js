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
        
        this.initializeAnalytics();
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
    
    generatePerformanceData() {
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
        const sessions = ['الجلسة 1', 'الجلسة 2', 'الجلسة 3', 'الجلسة 4', 'الجلسة 5', 'الجلسة 6', 'الجلسة 7'];
        const newWords = sessions.map(() => Math.floor(Math.random() * 8) + 2);
        const reviewWords = sessions.map(() => Math.floor(Math.random() * 6) + 1);
        
        return {
            labels: sessions,
            newWords,
            reviewWords
        };
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
        if (this.charts.performanceTrend) {
            const newData = this.generatePerformanceData();
            this.charts.performanceTrend.data.labels = newData.labels;
            this.charts.performanceTrend.data.datasets[0].data = newData.accuracy;
            this.charts.performanceTrend.update();
        }
        
        if (this.charts.categoryRadar) {
            const newMasteryData = this.getCategoryMasteryData();
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