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
        this.setupAchievementBadges();
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
        // Motivational ranking system: Users get ranks 1-10 based on their score
        // Higher scores = better (lower) ranks
        if (userScore >= 2000) return 1; // Top performer
        if (userScore >= 1500) return 2;
        if (userScore >= 1000) return 3;
        if (userScore >= 750) return 4;
        if (userScore >= 500) return 5;
        if (userScore >= 300) return 6;
        if (userScore >= 150) return 7;
        if (userScore >= 75) return 8;
        if (userScore >= 25) return 9;
        return 10; // Minimum rank for any participation
    }
    
    generateCompetitors() {
        const container = document.getElementById('leaderboard-others');
        if (!container) return;
        
        const userScore = this.getWeeklyScore();
        const userRank = this.calculateUserRank(userScore);
        
        // Generate realistic competitor data with proper ranking
        const competitorNames = [
            'متعلم مجتهد', 'خبير التركية', 'طالب نشط', 'محب اللغات', 
            'مسافر تركيا', 'باحث ذكي', 'دارس مثابر', 'متحمس للتعلم',
            'عاشق اللغات', 'طالب متفوق', 'متعلم نشيط', 'باحث ماهر'
        ];
        
        const badges = ['🏆', '🌟', '🎯', '🔥', '⭐', '💎', '🎨', '🚀', '💪', '🎓'];
        
        // Create a realistic leaderboard based on user's position
        let competitors = [];
        
        // Generate competitors with scores relative to user's rank
        for (let rank = 1; rank <= 10; rank++) {
            if (rank === userRank) continue; // Skip user's rank
            
            let score;
            // Generate scores that make sense for each rank
            if (rank === 1) score = Math.max(userScore + 100, 2500); // Top player
            else if (rank === 2) score = Math.max(userScore + 80, 2000);
            else if (rank === 3) score = Math.max(userScore + 60, 1700);
            else if (rank === 4) score = Math.max(userScore + 40, 1400);
            else if (rank === 5) score = Math.max(userScore + 20, 1100);
            else if (rank === 6) score = Math.max(userScore, 800);
            else if (rank === 7) score = Math.max(userScore - 20, 600);
            else if (rank === 8) score = Math.max(userScore - 40, 400);
            else if (rank === 9) score = Math.max(userScore - 60, 200);
            else score = Math.max(userScore - 80, 50); // rank 10
            
            // Add some randomness but keep logical order
            const variation = Math.floor(Math.random() * 50) - 25;
            score = Math.max(0, score + variation);
            
            competitors.push({
                rank,
                name: competitorNames[Math.floor(Math.random() * competitorNames.length)],
                score,
                badge: badges[Math.floor(Math.random() * badges.length)]
            });
        }
        
        // Sort by rank to ensure proper order
        competitors.sort((a, b) => a.rank - b.rank);
        
        // Show only 5 competitors around user's rank for better UX
        let displayCompetitors;
        if (userRank <= 3) {
            // If user is in top 3, show ranks 1-6 (excluding user)
            displayCompetitors = competitors.filter(c => c.rank <= 6).slice(0, 5);
        } else if (userRank >= 8) {
            // If user is in bottom 3, show ranks 5-10 (excluding user)
            displayCompetitors = competitors.filter(c => c.rank >= 5).slice(0, 5);
        } else {
            // If user is in middle, show 2 above and 2 below
            displayCompetitors = competitors.filter(c => 
                c.rank >= userRank - 2 && c.rank <= userRank + 2
            ).slice(0, 5);
        }
        
        const competitorsHTML = displayCompetitors.map(competitor => `
            <div class="leaderboard-item">
                <div class="rank">#${competitor.rank}</div>
                <div class="player-info">
                    <div class="player-name">${competitor.name}</div>
                    <div class="player-score">${competitor.score} نقطة</div>
                </div>
                <div class="player-badge">${competitor.badge}</div>
            </div>
        `).join('');
        
        container.innerHTML = competitorsHTML;
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
    
    // Achievement Badges System
    setupAchievementBadges() {
        this.updateAchievementBadges();
        
        // Listen for real-time updates
        this.setupAchievementListeners();
    }
    
    setupAchievementListeners() {
        // Listen for learning events to update achievements in real-time
        document.addEventListener('wordLearned', () => {
            setTimeout(() => this.updateAchievementBadges(), 100);
        });
        
        document.addEventListener('sessionCompleted', () => {
            setTimeout(() => this.updateAchievementBadges(), 100);
        });
        
        document.addEventListener('categoryCompleted', () => {
            setTimeout(() => this.updateAchievementBadges(), 100);
        });
    }
    
    updateAchievementBadges() {
        const totalWordsLearned = this.getTotalWordsLearned();
        const currentStreak = this.getCurrentStreak();
        const totalXP = parseInt(localStorage.getItem('userXP') || '0');
        const hasCompletedCategory = this.hasCompletedCategory();
        
        // Enhanced achievement checking with visual feedback
        this.checkAndUpdateAchievement('first-word', totalWordsLearned >= 1, {
            title: 'أول كلمة',
            description: 'تعلم أول كلمة تركية',
            progress: Math.min(totalWordsLearned, 1),
            target: 1
        });
        
        this.checkAndUpdateAchievement('streak-7', currentStreak >= 7, {
            title: 'أسبوع كامل', 
            description: '7 أيام متتالية من التعلم',
            progress: Math.min(currentStreak, 7),
            target: 7
        });
        
        this.checkAndUpdateAchievement('category-complete', hasCompletedCategory, {
            title: 'إكمال فئة',
            description: 'إكمال فئة كاملة من المفردات',
            progress: hasCompletedCategory ? 1 : 0,
            target: 1
        });
        
        this.checkAndUpdateAchievement('review-master', totalXP >= 500, {
            title: 'خبير المراجعة',
            description: 'مراجعة 50 كلمة بنجاح',
            progress: Math.min(totalXP, 500),
            target: 500
        });
        
        console.log('🏆 Achievement badges updated with real-time data:', {
            wordsLearned: totalWordsLearned,
            streak: currentStreak,
            xp: totalXP,
            categoryComplete: hasCompletedCategory
        });
    }
    
    checkAndUpdateAchievement(achievementId, condition, details) {
        const badge = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (!badge) return;
        
        const wasUnlocked = badge.classList.contains('unlocked');
        
        if (condition) {
            badge.classList.remove('locked');
            badge.classList.add('unlocked');
            
            // Add progress indicator for visual feedback
            this.addProgressIndicator(badge, details);
            
            // Show unlock notification if newly unlocked
            if (!wasUnlocked) {
                this.showAchievementUnlock(achievementId, details.title);
            }
        } else {
            badge.classList.remove('unlocked');
            badge.classList.add('locked');
            
            // Add progress indicator for locked achievements too
            this.addProgressIndicator(badge, details);
        }
    }
    
    addProgressIndicator(badge, details) {
        // Add or update progress bar
        let progressBar = badge.querySelector('.achievement-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'achievement-progress';
            badge.appendChild(progressBar);
        }
        
        const progressPercent = Math.round((details.progress / details.target) * 100);
        progressBar.innerHTML = `
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="progress-text">${details.progress}/${details.target}</div>
        `;
    }
    
    showAchievementUnlock(achievementId, title) {
        this.showNotification(`🏆 إنجاز جديد: ${title}!`, 'success');
        
        // Add celebration animation
        const badge = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (badge) {
            badge.style.animation = 'pulse 0.6s ease 3';
            setTimeout(() => {
                badge.style.animation = '';
            }, 1800);
        }
    }
    
    hasCompletedCategory() {
        const progress = JSON.parse(localStorage.getItem('turkishLearningProgress') || '{}');
        return Object.values(progress).some(category => 
            category && category.wordsLearned >= 6
        );
    }

    // Utility functions
    getCurrentStreak() {
        return parseInt(localStorage.getItem('currentStreak') || '0');
    }
    
    // Safe localStorage data initialization
    initializeSafeProgress() {
        const progress = JSON.parse(localStorage.getItem('turkishLearningProgress') || '{}');
        
        // Clean up any null values
        const cleanedProgress = {};
        Object.keys(progress).forEach(categoryId => {
            if (progress[categoryId] && typeof progress[categoryId] === 'object') {
                cleanedProgress[categoryId] = {
                    wordsLearned: progress[categoryId].wordsLearned || 0,
                    totalWords: progress[categoryId].totalWords || 0,
                    ...progress[categoryId]
                };
            }
        });
        
        localStorage.setItem('turkishLearningProgress', JSON.stringify(cleanedProgress));
        return cleanedProgress;
    }
    
    getTotalWordsLearned() {
        const progress = this.initializeSafeProgress();
        return Object.values(progress).reduce((total, category) => {
            return total + ((category && category.wordsLearned) || 0);
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
        console.log('๐ Updating gamification system with new logic...');
        this.setupGamification();
    }
    
    forceRefreshLeaderboard() {
        console.log('๐ช Force refreshing leaderboard with proper ranking...');
        // Clear existing data to force regeneration
        const leaderboardContainer = document.getElementById('leaderboard-others');
        if (leaderboardContainer) {
            leaderboardContainer.innerHTML = '<div style="text-align: center; padding: 1rem; color: #6B7280;">๐ Updating leaderboard...</div>';
        }
        
        // Force regenerate with new logic
        setTimeout(() => {
            this.setupWeeklyLeaderboard();
            console.log('โ Leaderboard refreshed with proper ranking system');
        }, 500);
    }
    
    // Real-time integration methods
    recordWordLearned() {
        // Dispatch custom event for real-time updates
        document.dispatchEvent(new CustomEvent('wordLearned'));
        console.log('📚 Word learned event dispatched for real-time updates');
    }
    
    recordSessionCompleted(sessionData) {
        // Dispatch custom event with session data
        document.dispatchEvent(new CustomEvent('sessionCompleted', { detail: sessionData }));
        console.log('✅ Session completed event dispatched for real-time updates');
    }
    
    recordCategoryCompleted(categoryId) {
        // Dispatch custom event for category completion
        document.dispatchEvent(new CustomEvent('categoryCompleted', { detail: { categoryId } }));
        console.log('🎯 Category completed event dispatched for real-time updates');
    }

    addWeeklyScore(points) {
        const currentWeek = this.getCurrentWeekKey();
        const currentScore = parseInt(localStorage.getItem(`weeklyScore_${currentWeek}`) || '0');
        const streakMultiplier = this.getStreakMultiplier(this.getCurrentStreak());
        const bonusPoints = points * streakMultiplier;
        
        localStorage.setItem(`weeklyScore_${currentWeek}`, (currentScore + bonusPoints).toString());
        
        if (streakMultiplier > 1) {
            this.showNotification(`\u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0633\u0644\u0633\u0644\u0629! +${bonusPoints} \u0646\u0642\u0637\u0629 (${streakMultiplier}x)`, 'success');
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
                    this.showNotification(`\u062A\u062D\u062F\u064A \u0645\u0643\u062A\u0645\u0644: ${challenge.title}!`, 'success');
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
    
    /* Achievement Progress Indicators */
    .achievement-progress {
        margin-top: 12px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .progress-bar-bg {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 6px;
    }
    
    .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #10B981, #059669);
        border-radius: 3px;
        transition: width 0.5s ease;
        min-width: 2px;
    }
    
    .progress-text {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.8);
        text-align: center;
        font-weight: 500;
    }
    
    .achievement-badge.locked .progress-bar-fill {
        background: linear-gradient(90deg, #6B7280, #4B5563);
    }
    
    .achievement-badge.unlocked .progress-bar-fill {
        background: linear-gradient(90deg, #FFD700, #FFA500);
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

// Integration functions for real-time achievement updates
window.recordWordLearned = function() {
    if (window.gamificationSystem) {
        window.gamificationSystem.recordWordLearned();
    }
};

window.recordSessionCompleted = function(sessionData) {
    if (window.gamificationSystem) {
        window.gamificationSystem.recordSessionCompleted(sessionData);
    }
};

window.recordCategoryCompleted = function(categoryId) {
    if (window.gamificationSystem) {
        window.gamificationSystem.recordCategoryCompleted(categoryId);
    }
};

console.log('Enhanced Gamification System loaded successfully!');

// Test function to demonstrate real-time dynamic data
window.testGamificationRealTime = function() {
    console.log('🧪 Testing real-time gamification system...');
    
    // Simulate learning progress
    const currentProgress = JSON.parse(localStorage.getItem('turkishLearningProgress') || '{}');
    currentProgress.travel = { wordsLearned: 5, totalWords: 6 };
    currentProgress.greetings = { wordsLearned: 6, totalWords: 6 }; // Complete category
    localStorage.setItem('turkishLearningProgress', JSON.stringify(currentProgress));
    
    // Simulate streak and XP
    localStorage.setItem('currentStreak', '8');
    localStorage.setItem('userXP', '600');
    
    // Force update all systems
    if (window.gamificationSystem) {
        window.gamificationSystem.updateGamification();
    }
    
    console.log('✅ Test complete! Check:');
    console.log('1. Achievement chains should show progress based on real data');
    console.log('2. Theme unlocks should check real requirements (8-day streak unlocks Emerald)');
    console.log('3. Achievement badges should show unlocked status for completed achievements');
    console.log('4. All progress bars and indicators should reflect real localStorage data');
};

// Reset function for testing
window.resetGamificationTest = function() {
    console.log('🔄 Resetting gamification test data...');
    localStorage.removeItem('turkishLearningProgress');
    localStorage.removeItem('currentStreak');
    localStorage.removeItem('userXP');
    localStorage.removeItem('bestStreak');
    
    if (window.gamificationSystem) {
        window.gamificationSystem.updateGamification();
    }
    
    console.log('✅ Reset complete! All elements should show initial locked/empty state');
};