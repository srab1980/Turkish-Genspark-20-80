// Enhanced Gamification System for Turkish Learning App
// Preserves glass morphism theme and Turkish/Arabic colors

class GamificationSystem {
    constructor() {
        this.colors = {
            primary: '#4A90E2',
            secondary: '#6BA3E8', 
            accent: '#FFD700',
            orange: '#FF9800',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444'
        };
        
        // Theme definitions
        this.themes = {
            default: {
                name: 'الكلاسيكية التركية',
                colors: { primary: '#4A90E2', accent: '#FFD700', success: '#10B981' },
                requirement: 'متاح افتراضياً',
                requirementMet: true,
                preview: '🇹🇷'
            },
            golden: {
                name: 'الذهبية الفاخرة',
                colors: { primary: '#FFD700', accent: '#FFA500', success: '#FF8C00' },
                requirement: '100 كلمة مُتعلمة',
                requirementMet: false,
                preview: '👑'
            },
            emerald: {
                name: 'الزمردية الطبيعية',
                colors: { primary: '#10B981', accent: '#059669', success: '#047857' },
                requirement: 'سلسلة 14 يوم',
                requirementMet: false,
                preview: '💚'
            },
            sunset: {
                name: 'غروب إسطنبول',
                colors: { primary: '#FF6B6B', accent: '#FF8E53', success: '#FF5722' },
                requirement: 'إكمال 3 فئات',
                requirementMet: false,
                preview: '🌅'
            },
            royal: {
                name: 'الملكية البيزنطية',
                colors: { primary: '#9C27B0', accent: '#673AB7', success: '#3F51B5' },
                requirement: '1000 نقطة خبرة',
                requirementMet: false,
                preview: '👑'
            }
        };
        
        // Achievement chains definition
        this.achievementChains = [
            {
                id: 'explorer',
                title: '🗺️ مستكشف التركية',
                description: 'اكتشف جميع فئات المفردات التركية',
                steps: [
                    { id: 'first-category', name: 'الفئة الأولى', description: 'تعلم من فئة واحدة' },
                    { id: 'three-categories', name: '3 فئات', description: 'تعلم من 3 فئات مختلفة' },
                    { id: 'five-categories', name: '5 فئات', description: 'تعلم من 5 فئات مختلفة' },
                    { id: 'all-categories', name: 'جميع الفئات', description: 'تعلم من جميع الـ8 فئات' }
                ]
            },
            {
                id: 'dedication',
                title: '🔥 التفاني والاستمرار',
                description: 'حافظ على الاستمرارية في التعلم',
                steps: [
                    { id: 'streak-3', name: '3 أيام', description: '3 أيام متتالية من التعلم' },
                    { id: 'streak-7', name: 'أسبوع كامل', description: '7 أيام متتالية' },
                    { id: 'streak-14', name: 'أسبوعان', description: '14 يوم متتالي' },
                    { id: 'streak-30', name: 'شهر كامل', description: '30 يوم متتالي' }
                ]
            },
            {
                id: 'mastery',
                title: '⭐ سيد المفردات',
                description: 'أتقن المفردات التركية بشكل مثالي',
                steps: [
                    { id: 'words-25', name: '25 كلمة', description: 'تعلم 25 كلمة تركية' },
                    { id: 'words-50', name: '50 كلمة', description: 'تعلم 50 كلمة تركية' },
                    { id: 'words-100', name: '100 كلمة', description: 'تعلم 100 كلمة تركية' },
                    { id: 'words-200', name: '200 كلمة', description: 'تعلم جميع الكلمات المتاحة' }
                ]
            }
        ];
        
        this.initializeGamification();
    }
    
    initializeGamification() {
        console.log('Initializing Enhanced Gamification System...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupGamification());
        } else {
            this.setupGamification();
        }
    }
    
    setupGamification() {
        this.generateDailyChallenges();
        this.setupWeeklyLeaderboard();
        this.generateAchievementChains();
        this.setupUnlockableThemes();
        this.updateStreakBonus();
        this.checkThemeUnlocks();
    }
    
    // Daily Challenges System
    generateDailyChallenges() {
        const challengesContainer = document.getElementById('daily-challenges');
        if (!challengesContainer) return;
        
        const challenges = this.getDailyChallenges();
        
        challengesContainer.innerHTML = challenges.map(challenge => `
            <div class="daily-challenge ${challenge.completed ? 'completed' : ''}">
                <div class="challenge-status ${challenge.completed ? 'completed' : 'pending'}">
                    ${challenge.completed ? '✓' : '○'}
                </div>
                <div class="challenge-title">
                    <span>${challenge.icon}</span>
                    ${challenge.title}
                </div>
                <div class="challenge-progress">
                    <div class="challenge-progress-bar">
                        <div class="challenge-progress-fill" style="width: ${challenge.progress}%"></div>
                    </div>
                    <div class="challenge-progress-text">${challenge.current}/${challenge.target}</div>
                </div>
                <div class="challenge-reward">
                    <i class="fas fa-gift"></i>
                    +${challenge.reward} نقطة خبرة
                </div>
            </div>
        `).join('');
    }
    
    getDailyChallenges() {
        const today = new Date().toISOString().split('T')[0];
        const savedChallenges = JSON.parse(localStorage.getItem(`dailyChallenges_${today}`) || 'null');
        
        if (savedChallenges) {
            return savedChallenges;
        }
        
        // Generate new daily challenges
        const challengeTemplates = [
            {
                id: 'daily-words',
                title: 'تعلم 5 كلمات جديدة',
                icon: '📚',
                target: 5,
                reward: 50,
                type: 'words-learned'
            },
            {
                id: 'category-focus',
                title: 'ادرس فئة السفر اليوم',
                icon: '✈️',
                target: 3,
                reward: 30,
                type: 'category-specific'
            },
            {
                id: 'review-session',
                title: 'راجع 10 كلمات',
                icon: '🔄',
                target: 10,
                reward: 40,
                type: 'review-words'
            },
            {
                id: 'accuracy-challenge',
                title: 'حقق دقة 80% في جلسة',
                icon: '🎯',
                target: 80,
                reward: 60,
                type: 'accuracy'
            }
        ];
        
        // Select 3 random challenges for today
        const todaysChallenges = this.shuffleArray([...challengeTemplates])
            .slice(0, 3)
            .map(template => {
                const progress = this.getChallengeProgress(template.type, template.target);
                return {
                    ...template,
                    current: progress.current,
                    progress: Math.min(100, (progress.current / template.target) * 100),
                    completed: progress.current >= template.target
                };
            });
        
        localStorage.setItem(`dailyChallenges_${today}`, JSON.stringify(todaysChallenges));
        return todaysChallenges;
    }
    
    getChallengeProgress(type, target) {
        const today = new Date().toISOString().split('T')[0];
        const todayStats = JSON.parse(localStorage.getItem(`dailyStats_${today}`) || '{}');
        
        switch (type) {
            case 'words-learned':
                return { current: todayStats.wordsLearned || 0 };
            case 'category-specific':
                return { current: todayStats.travelCategoryWords || 0 };
            case 'review-words':
                return { current: todayStats.reviewedWords || 0 };
            case 'accuracy':
                const totalAnswers = todayStats.totalAnswers || 0;
                const correctAnswers = todayStats.correctAnswers || 0;
                const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
                return { current: accuracy };
            default:
                return { current: 0 };
        }
    }
    
    // Weekly Competition Leaderboard
    setupWeeklyLeaderboard() {
        this.updateUserRanking();
        this.generateCompetitors();
    }
    
    updateUserRanking() {
        const userWeeklyScore = this.getWeeklyScore();
        const userRank = this.calculateUserRank(userWeeklyScore);
        
        const userRankEl = document.getElementById('user-rank');
        const userScoreEl = document.getElementById('user-weekly-score');
        
        if (userRankEl) userRankEl.textContent = userRank;
        if (userScoreEl) userScoreEl.textContent = userWeeklyScore;
    }
    
    getWeeklyScore() {
        const currentWeek = this.getCurrentWeekKey();
        return parseInt(localStorage.getItem(`weeklyScore_${currentWeek}`) || '0');
    }
    
    getCurrentWeekKey() {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        return startOfWeek.toISOString().split('T')[0];
    }
    
    calculateUserRank(userScore) {
        // Simulate competitive ranking based on score
        const competitors = this.generateCompetitorScores();
        const allScores = [...competitors, userScore].sort((a, b) => b - a);
        return allScores.indexOf(userScore) + 1;
    }
    
    generateCompetitors() {
        const container = document.getElementById('leaderboard-others');
        if (!container) return;
        
        const competitors = this.generateCompetitorScores();
        const userScore = this.getWeeklyScore();
        
        // Show top 5 competitors around user's rank
        const competitorNames = [
            'متعلم مجتهد', 'خبير التركية', 'طالب نشط', 'محب اللغات', 
            'مسافر تركيا', 'باحث ذكي', 'دارس مثابر', 'متحمس للتعلم'
        ];
        
        const competitorsHTML = competitors.slice(0, 5).map((score, index) => {
            const rank = index + (userScore > score ? 1 : 2);
            const randomName = competitorNames[Math.floor(Math.random() * competitorNames.length)];
            const badges = ['🌟', '🏆', '🎯', '🔥', '⭐', '💎', '🎨', '🚀'];
            const randomBadge = badges[Math.floor(Math.random() * badges.length)];
            
            return `
                <div class="leaderboard-item">
                    <div class="rank">#${rank}</div>
                    <div class="player-info">
                        <div class="player-name">${randomName}</div>
                        <div class="player-score">${score} نقطة</div>
                    </div>
                    <div class="player-badge">${randomBadge}</div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = competitorsHTML;
    }
    
    generateCompetitorScores() {
        const userScore = this.getWeeklyScore();
        const baseScore = Math.max(50, userScore);
        
        return Array(10).fill(0).map(() => {
            const variation = (Math.random() - 0.5) * 200;
            return Math.max(0, Math.round(baseScore + variation));
        }).sort((a, b) => b - a);
    }
    
    // Achievement Chains
    generateAchievementChains() {
        const container = document.getElementById('achievement-chains');
        if (!container) return;
        
        const chainsHTML = this.achievementChains.map(chain => {
            const progress = this.getChainProgress(chain);
            return `
                <div class="achievement-chain">
                    <div class="chain-title">
                        ${chain.title}
                    </div>
                    <div class="chain-progress">
                        ${chain.steps.map((step, index) => {
                            const stepStatus = this.getStepStatus(chain.id, step.id, index, progress.currentStep);
                            return `
                                <div class="chain-step ${stepStatus.class}" title="${step.description}">
                                    ${stepStatus.icon}
                                </div>
                                ${index < chain.steps.length - 1 ? 
                                    `<div class="chain-connector ${index < progress.currentStep ? 'completed' : ''}"></div>` 
                                    : ''
                                }
                            `;
                        }).join('')}
                    </div>
                    <div class="chain-description">
                        ${chain.description}
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = chainsHTML;
    }
    
    getChainProgress(chain) {
        switch (chain.id) {
            case 'explorer':
                const categoriesLearned = this.getCategoriesLearned();
                if (categoriesLearned >= 8) return { currentStep: 4 };
                if (categoriesLearned >= 5) return { currentStep: 3 };
                if (categoriesLearned >= 3) return { currentStep: 2 };
                if (categoriesLearned >= 1) return { currentStep: 1 };
                return { currentStep: 0 };
                
            case 'dedication':
                const currentStreak = this.getCurrentStreak();
                if (currentStreak >= 30) return { currentStep: 4 };
                if (currentStreak >= 14) return { currentStep: 3 };
                if (currentStreak >= 7) return { currentStep: 2 };
                if (currentStreak >= 3) return { currentStep: 1 };
                return { currentStep: 0 };
                
            case 'mastery':
                const wordsLearned = this.getTotalWordsLearned();
                if (wordsLearned >= 200) return { currentStep: 4 };
                if (wordsLearned >= 100) return { currentStep: 3 };
                if (wordsLearned >= 50) return { currentStep: 2 };
                if (wordsLearned >= 25) return { currentStep: 1 };
                return { currentStep: 0 };
                
            default:
                return { currentStep: 0 };
        }
    }
    
    getStepStatus(chainId, stepId, stepIndex, currentStep) {
        if (stepIndex < currentStep) {
            return { class: 'completed', icon: '✓' };
        } else if (stepIndex === currentStep) {
            return { class: 'current', icon: '●' };
        } else {
            return { class: '', icon: '○' };
        }
    }
    
    // Unlockable Themes
    setupUnlockableThemes() {
        const container = document.getElementById('unlockable-themes');
        if (!container) return;
        
        this.checkThemeUnlocks();
        const currentTheme = localStorage.getItem('selectedTheme') || 'default';
        
        const themesHTML = Object.entries(this.themes).map(([themeId, theme]) => {
            const isUnlocked = theme.requirementMet;
            const isActive = currentTheme === themeId;
            
            return `
                <div class="theme-card ${isUnlocked ? 'unlocked' : 'locked'} ${isActive ? 'active' : ''}" 
                     data-theme="${themeId}" onclick="window.gamificationSystem.selectTheme('${themeId}')">
                    <div class="theme-unlock-status ${isUnlocked ? 'unlocked' : 'locked'}">
                        ${isUnlocked ? '✓' : '🔒'}
                    </div>
                    <div class="theme-preview ${themeId}">
                        ${theme.preview}
                    </div>
                    <div class="theme-name">${theme.name}</div>
                    <div class="theme-requirement">${theme.requirement}</div>
                    ${isActive ? '<div style="color: var(--primary-green); font-weight: bold; font-size: 0.9rem;">مُفعّل</div>' : ''}
                </div>
            `;
        }).join('');
        
        container.innerHTML = themesHTML;
    }
    
    checkThemeUnlocks() {
        const wordsLearned = this.getTotalWordsLearned();
        const currentStreak = this.getCurrentStreak();
        const categoriesCompleted = this.getCompletedCategories();
        const totalXP = parseInt(localStorage.getItem('userXP') || '0');
        
        // Update theme requirements
        this.themes.golden.requirementMet = wordsLearned >= 100;
        this.themes.emerald.requirementMet = currentStreak >= 14;
        this.themes.sunset.requirementMet = categoriesCompleted >= 3;
        this.themes.royal.requirementMet = totalXP >= 1000;
    }
    
    selectTheme(themeId) {
        const theme = this.themes[themeId];
        if (!theme || !theme.requirementMet) {
            this.showNotification('هذا الثيم غير متاح بعد!', 'warning');
            return;
        }
        
        localStorage.setItem('selectedTheme', themeId);
        this.applyTheme(theme);
        this.setupUnlockableThemes(); // Refresh display
        this.showNotification(`تم تفعيل ثيم: ${theme.name}`, 'success');
    }
    
    applyTheme(theme) {
        // Apply theme colors to CSS variables
        const root = document.documentElement;
        root.style.setProperty('--rosetta-blue', theme.colors.primary);
        root.style.setProperty('--primary-yellow', theme.colors.accent);
        root.style.setProperty('--primary-green', theme.colors.success);
        
        console.log(`Applied theme: ${theme.name}`);
    }
    
    // Streak Bonus System
    updateStreakBonus() {
        const currentStreak = this.getCurrentStreak();
        const streakMultiplier = document.getElementById('streak-multiplier');
        
        if (streakMultiplier && currentStreak >= 3) {
            streakMultiplier.style.display = 'inline-block';
            streakMultiplier.textContent = `${this.getStreakMultiplier(currentStreak)}x نقاط!`;
        } else if (streakMultiplier) {
            streakMultiplier.style.display = 'none';
        }
    }
    
    getStreakMultiplier(streak) {
        if (streak >= 7) return 3;
        if (streak >= 3) return 2;
        return 1;
    }
    
    // Utility functions
    getCurrentStreak() {
        return parseInt(localStorage.getItem('currentStreak') || '0');
    }
    
    getTotalWordsLearned() {
        const progress = JSON.parse(localStorage.getItem('turkishLearningProgress') || '{}');
        return Object.values(progress).reduce((total, category) => {
            return total + (category.wordsLearned || 0);
        }, 0);
    }
    
    getCategoriesLearned() {
        const progress = JSON.parse(localStorage.getItem('turkishLearningProgress') || '{}');
        return Object.keys(progress).filter(category => 
            progress[category] && progress[category].wordsLearned > 0
        ).length;
    }
    
    getCompletedCategories() {
        const progress = JSON.parse(localStorage.getItem('turkishLearningProgress') || '{}');
        return Object.keys(progress).filter(category => 
            progress[category] && progress[category].wordsLearned >= 6
        ).length;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            animation: slideInRight 0.3s ease;
        `;
        
        const colors = {
            success: '#10B981',
            warning: '#F59E0B', 
            info: '#4A90E2',
            error: '#EF4444'
        };
        
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Public methods for integration
    updateGamification() {
        this.setupGamification();
    }
    
    addWeeklyScore(points) {
        const currentWeek = this.getCurrentWeekKey();
        const currentScore = parseInt(localStorage.getItem(`weeklyScore_${currentWeek}`) || '0');
        const streakMultiplier = this.getStreakMultiplier(this.getCurrentStreak());
        const bonusPoints = points * streakMultiplier;
        
        localStorage.setItem(`weeklyScore_${currentWeek}`, (currentScore + bonusPoints).toString());
        
        if (streakMultiplier > 1) {
            this.showNotification(`مكافأة السلسلة! +${bonusPoints} نقطة (${streakMultiplier}x)`, 'success');
        }
        
        return bonusPoints;
    }
    
    updateDailyChallengeProgress(type, amount = 1) {
        const today = new Date().toISOString().split('T')[0];
        const todayStats = JSON.parse(localStorage.getItem(`dailyStats_${today}`) || '{}');
        
        switch (type) {
            case 'words-learned':
                todayStats.wordsLearned = (todayStats.wordsLearned || 0) + amount;
                break;
            case 'review-words':
                todayStats.reviewedWords = (todayStats.reviewedWords || 0) + amount;
                break;
            case 'category-travel':
                todayStats.travelCategoryWords = (todayStats.travelCategoryWords || 0) + amount;
                break;
            case 'accuracy':
                todayStats.totalAnswers = (todayStats.totalAnswers || 0) + 1;
                if (amount > 0) {
                    todayStats.correctAnswers = (todayStats.correctAnswers || 0) + 1;
                }
                break;
        }
        
        localStorage.setItem(`dailyStats_${today}`, JSON.stringify(todayStats));
        this.checkCompletedChallenges();
    }
    
    checkCompletedChallenges() {
        const today = new Date().toISOString().split('T')[0];
        const challenges = JSON.parse(localStorage.getItem(`dailyChallenges_${today}`) || '[]');
        let updated = false;
        
        challenges.forEach(challenge => {
            if (!challenge.completed) {
                const progress = this.getChallengeProgress(challenge.type, challenge.target);
                if (progress.current >= challenge.target) {
                    challenge.completed = true;
                    challenge.progress = 100;
                    this.showNotification(`تحدي مكتمل: ${challenge.title}!`, 'success');
                    this.addWeeklyScore(challenge.reward);
                    updated = true;
                }
            }
        });
        
        if (updated) {
            localStorage.setItem(`dailyChallenges_${today}`, JSON.stringify(challenges));
            this.generateDailyChallenges();
        }
    }
}

// Add CSS animations
const gamificationStyles = document.createElement('style');
gamificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(gamificationStyles);

// Initialize Gamification System
window.gamificationSystem = new GamificationSystem();

// Global functions for integration
window.updateGamification = function() {
    if (window.gamificationSystem) {
        window.gamificationSystem.updateGamification();
    }
};

window.addGamificationScore = function(points) {
    if (window.gamificationSystem) {
        return window.gamificationSystem.addWeeklyScore(points);
    }
    return points;
};

window.updateChallengeProgress = function(type, amount = 1) {
    if (window.gamificationSystem) {
        window.gamificationSystem.updateDailyChallengeProgress(type, amount);
    }
};

console.log('Enhanced Gamification System loaded successfully!');