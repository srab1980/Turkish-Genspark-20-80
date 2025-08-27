// Turkish Learning App - Main Application Logic

// Main App Object
const TurkishLearningApp = {
    // App state
    currentSection: 'dashboard',
    categories: [],
    vocabularyData: {},
    userProgress: {},
    
    // Initialize the app
    init() {
        console.log('Initializing Turkish Learning App...');
        this.setupEventListeners();
        this.loadData();
        this.updateUserStats();
    },
    
    // Setup all event listeners
    setupEventListeners() {
        // Navigation events - Force refresh navigation bindings
        this.bindNavigationEvents();
        
        // Re-bind navigation events periodically to handle dynamic content
        setInterval(() => {
            this.bindNavigationEvents();
        }, 2000);
        
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
            });
        }
        
        // Learning interface events
        const categorySelect = document.getElementById('category-select');
        const startLearningBtn = document.getElementById('start-learning');
        
        if (categorySelect) {
            categorySelect.addEventListener('change', () => {
                startLearningBtn.disabled = !categorySelect.value;
            });
        }
        
        if (startLearningBtn) {
            startLearningBtn.addEventListener('click', () => {
                this.startLearning();
            });
        }
        
        // Review interface events
        const startReviewBtn = document.getElementById('start-review');
        const reviewAllBtn = document.getElementById('review-all');
        
        if (startReviewBtn) {
            startReviewBtn.addEventListener('click', () => {
                window.startReview('all');
            });
        }
        
        if (reviewAllBtn) {
            reviewAllBtn.addEventListener('click', () => {
                window.startReview('all');
            });
        }
        
        // Listen for progress updates
        window.addEventListener('progressUpdated', (e) => {
            this.updateUserStats();
            this.updateCategoryProgress();
        });
        
        console.log('Event listeners setup complete');
    },
    
    // Dedicated navigation binding function
    bindNavigationEvents() {
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            // Remove existing listener if any
            link.removeEventListener('click', this.navigationHandler);
            
            // Add fresh listener
            link.addEventListener('click', this.navigationHandler.bind(this));
        });
    },
    
    // Navigation click handler
    navigationHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const section = e.currentTarget.getAttribute('data-section');
        console.log('Navigation clicked:', section);
        
        if (section) {
            // Force hide any active learning/review sessions
            const learningContent = document.getElementById('learning-content');
            const reviewContent = document.getElementById('review-content');
            
            if (learningContent) {
                learningContent.classList.add('hidden');
            }
            if (reviewContent) {
                reviewContent.classList.add('hidden');
            }
            
            // Clear any active sessions
            if (window.currentLearningSession) {
                window.currentLearningSession = null;
            }
            if (window.currentReviewSession) {
                window.currentReviewSession = null;
            }
            
            this.showSection(section);
        }
    },
    
    // Load data from API
    async loadData() {
        try {
            console.log('Loading categories and vocabulary...');
            
            // Load categories
            const categoriesResponse = await axios.get('/api/categories');
            this.categories = categoriesResponse.data.categories;
            
            // Load all words
            const wordsResponse = await axios.get('/api/words');
            const allWords = wordsResponse.data.words;
            
            // Organize words by category
            this.vocabularyData = {};
            this.categories.forEach(category => {
                this.vocabularyData[category.id] = allWords.filter(word => {
                    // Match words to categories based on ID ranges or other logic
                    return this.getWordCategory(word.id) === category.id;
                });
            });
            
            // Make vocabulary data globally available
            window.vocabularyData = this.vocabularyData;
            
            // Load user progress
            this.loadUserProgress();
            
            // Populate UI
            this.populateCategories();
            this.populateCategorySelect();
            this.updateUserStats();
            
            // Hide loading screen after data is loaded
            this.hideLoadingScreen();
            
            console.log('Data loaded successfully:', {
                categories: this.categories.length,
                totalWords: allWords.length,
                vocabularyData: Object.keys(this.vocabularyData)
            });
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.');
        }
    },
    
    // Determine category for a word based on ID
    getWordCategory(wordId) {
        if (wordId <= 6) return 'greetings';
        if (wordId <= 12) return 'travel';
        if (wordId <= 18) return 'food';
        if (wordId <= 24) return 'shopping';
        if (wordId <= 30) return 'directions';
        if (wordId <= 36) return 'emergency';
        if (wordId <= 42) return 'time';
        if (wordId <= 48) return 'numbers';
        return 'greetings';
    },
    
    // Load user progress from localStorage
    loadUserProgress() {
        this.userProgress = JSON.parse(localStorage.getItem('turkishLearningProgress') || '{}');
        console.log('Loaded user progress:', this.userProgress);
    },
    
    // Populate categories in dashboard
    populateCategories() {
        const container = document.getElementById('categories-container');
        if (!container) {
            console.error('Categories container not found!');
            return;
        }
        
        console.log('Populating categories...', this.categories.length, 'categories found');
        
        container.innerHTML = this.categories.map(category => {
            const progress = this.getCategoryProgress(category.id);
            
            return `
                <div class="category-card" data-category="${category.id}">
                    <div class="category-header">
                        <div class="category-icon">${category.icon}</div>
                        <div class="category-name">${this.getCategoryName(category.id)}</div>
                    </div>
                    <div class="category-progress-bar">
                        <div class="category-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="category-stats">
                        <span>${Math.round(progress)}% مكتمل</span>
                        <span>${category.wordCount} كلمات</span>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click events to category cards
        container.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.getAttribute('data-category');
                this.selectCategoryAndLearn(categoryId);
            });
        });
    },
    
    // Populate category select dropdown
    populateCategorySelect() {
        const select = document.getElementById('category-select');
        if (!select) return;
        
        select.innerHTML = `
            <option value="">اختر فئة...</option>
            ${this.categories.map(category => `
                <option value="${category.id}">
                    ${category.icon} ${this.getCategoryName(category.id)} (${category.wordCount} كلمات)
                </option>
            `).join('')}
        `;
    },
    
    // Get category progress percentage
    getCategoryProgress(categoryId) {
        const categoryProgress = this.userProgress[categoryId];
        if (!categoryProgress) return 0;
        
        const totalWords = this.vocabularyData[categoryId]?.length || 0;
        if (totalWords === 0) return 0;
        
        return Math.round((categoryProgress.wordsLearned / totalWords) * 100);
    },
    
    // Get localized category name
    getCategoryName(categoryId) {
        const names = {
            'greetings': 'التحيات',
            'travel': 'السفر', 
            'food': 'الطعام',
            'shopping': 'التسوق',
            'directions': 'الاتجاهات',
            'emergency': 'الطوارئ',
            'time': 'الوقت',
            'numbers': 'الأرقام'
        };
        
        return names[categoryId] || categoryId;
    },
    
    // Show specific section
    showSection(sectionName) {
        console.log(`Switching to section: ${sectionName}`);
        
        // Force hide all learning/review sessions first
        const learningContent = document.getElementById('learning-content');
        const reviewContent = document.getElementById('review-content');
        
        if (learningContent) {
            learningContent.classList.add('hidden');
        }
        if (reviewContent) {
            reviewContent.classList.add('hidden');
        }
        
        // Clear any active sessions
        if (window.currentLearningSession) {
            window.currentLearningSession = null;
        }
        if (window.currentReviewSession) {
            window.currentReviewSession = null;
        }
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log(`Successfully activated section: ${sectionName}`);
        } else {
            console.error(`Section not found: ${sectionName}-section`);
        }
        
        // Update navigation
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionName) {
                link.classList.add('active');
            }
        });
        
        // Hide mobile menu
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
        
        // Reset mobile menu icon
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn i');
        if (mobileMenuBtn) {
            mobileMenuBtn.className = 'fas fa-bars';
        }
        
        this.currentSection = sectionName;
        
        // Section-specific initialization
        if (sectionName === 'progress') {
            this.updateProgressSection();
        }
        
        console.log(`Switched to section: ${sectionName}`);
    },
    
    // Start learning session
    startLearning() {
        const categorySelect = document.getElementById('category-select');
        const modeSelect = document.getElementById('learning-mode');
        
        if (!categorySelect.value) {
            this.showError('يرجى اختيار فئة للتعلم');
            return;
        }
        
        const categoryId = categorySelect.value;
        const mode = modeSelect.value;
        const categoryWords = this.vocabularyData[categoryId];
        
        if (!categoryWords || categoryWords.length === 0) {
            this.showError('لا توجد كلمات في هذه الفئة');
            return;
        }
        
        // Prepare data for learning session
        const learningData = {
            category: categoryId,
            words: categoryWords
        };
        
        // Start learning session
        if (window.startLearningSession) {
            window.startLearningSession(learningData, mode);
        } else {
            this.showError('نظام التعلم غير متوفر حالياً');
        }
        
        console.log(`Starting learning session: ${categoryId}, mode: ${mode}`);
    },
    
    // Select category and start learning directly
    selectCategoryAndLearn(categoryId) {
        this.showSection('learn');
        
        // Set category in select
        const categorySelect = document.getElementById('category-select');
        if (categorySelect) {
            categorySelect.value = categoryId;
            
            // Enable start button
            const startBtn = document.getElementById('start-learning');
            if (startBtn) {
                startBtn.disabled = false;
            }
        }
        
        // Auto-start learning after a short delay
        setTimeout(() => {
            this.startLearning();
        }, 500);
    },
    
    // Update user statistics in UI
    updateUserStats() {
        const totalXP = parseInt(localStorage.getItem('userXP') || '0');
        const totalWordsLearned = this.getTotalWordsLearned();
        const currentStreak = this.getCurrentStreak();
        
        // Update XP
        const xpElement = document.getElementById('user-xp');
        if (xpElement) {
            xpElement.textContent = totalXP;
        }
        
        // Update words learned
        const wordsElement = document.getElementById('words-learned');
        if (wordsElement) {
            wordsElement.textContent = totalWordsLearned;
        }
        
        // Update streak
        const streakElement = document.getElementById('streak-days');
        if (streakElement) {
            streakElement.textContent = currentStreak;
        }
        
        // Update overall progress
        const overallProgress = this.getOverallProgress();
        const progressElement = document.getElementById('overall-progress');
        if (progressElement) {
            progressElement.textContent = `${overallProgress}%`;
        }
    },
    
    // Get total words learned across all categories
    getTotalWordsLearned() {
        let total = 0;
        Object.values(this.userProgress).forEach(categoryProgress => {
            total += categoryProgress.wordsLearned || 0;
        });
        return total;
    },
    
    // Get current learning streak
    getCurrentStreak() {
        const lastStudyDate = localStorage.getItem('lastStudyDate');
        if (!lastStudyDate) return 0;
        
        const today = new Date().toDateString();
        const lastDate = new Date(lastStudyDate).toDateString();
        
        if (today === lastDate) {
            return parseInt(localStorage.getItem('currentStreak') || '0');
        }
        
        return 0;
    },
    
    // Get overall learning progress
    getOverallProgress() {
        const totalCategories = this.categories.length;
        if (totalCategories === 0) return 0;
        
        let totalProgress = 0;
        this.categories.forEach(category => {
            totalProgress += this.getCategoryProgress(category.id);
        });
        
        return Math.round(totalProgress / totalCategories);
    },
    
    // Update category progress in UI
    updateCategoryProgress() {
        this.populateCategories();
        
        // Update progress section if visible
        if (this.currentSection === 'progress') {
            this.updateProgressSection();
        }
    },
    
    // Update progress section
    updateProgressSection() {
        const categoryProgressContainer = document.getElementById('category-progress');
        if (!categoryProgressContainer) return;
        
        const progressHTML = `
            <h3 class="text-xl font-semibold mb-4 text-gray-800">تقدم الفئات</h3>
            <div class="category-progress-grid">
                ${this.categories.map(category => {
                    const progress = this.getCategoryProgress(category.id);
                    const categoryData = this.userProgress[category.id];
                    
                    return `
                        <div class="progress-category-card">
                            <div class="progress-category-header">
                                <span class="category-icon">${category.icon}</span>
                                <span class="category-name">${this.getCategoryName(category.id)}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="progress-details">
                                <span>${progress}% مكتمل</span>
                                <span>${categoryData?.wordsLearned || 0}/${category.wordCount} كلمات</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        categoryProgressContainer.innerHTML = progressHTML;
    },
    
    // Hide loading screen
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 800);
        }
    },
    
    // Show error message
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
};

// Additional CSS for progress section
const progressSectionStyles = `
<style>
.category-progress-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

.progress-category-card {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.progress-category-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.progress-category-header .category-icon {
    font-size: 1.5rem;
}

.progress-category-header .category-name {
    font-weight: 600;
    color: #374151;
}

.progress-bar {
    background: #E5E7EB;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.75rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2563EB, #10B981);
    transition: width 0.3s ease;
}

.progress-details {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #6B7280;
}

@media (max-width: 768px) {
    .category-progress-grid {
        grid-template-columns: 1fr;
    }
}
</style>
`;

// Inject progress section styles
if (!document.querySelector('#progress-section-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'progress-section-styles';
    styleElement.innerHTML = progressSectionStyles;
    document.head.appendChild(styleElement);
}

// Make showSection globally available for other modules
window.showSection = function(sectionName) {
    console.log(`Global showSection called for: ${sectionName}`);
    TurkishLearningApp.showSection(sectionName);
};

// Emergency navigation function - can be called anytime
window.forceNavigateTo = function(sectionName) {
    console.log(`Force navigation to: ${sectionName}`);
    
    // Force clear all session states
    const allSessions = document.querySelectorAll('.learning-session, .review-session');
    allSessions.forEach(session => session.classList.add('hidden'));
    
    // Force clear content areas
    const learningContent = document.getElementById('learning-content');
    const reviewContent = document.getElementById('review-content');
    
    if (learningContent) learningContent.classList.add('hidden');
    if (reviewContent) reviewContent.classList.add('hidden');
    
    // Clear session variables
    window.currentLearningSession = null;
    window.currentReviewSession = null;
    
    // Force navigation
    TurkishLearningApp.showSection(sectionName);
};

// Add keyboard shortcuts for navigation
document.addEventListener('keydown', (e) => {
    // Only trigger shortcuts if not in an input field
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            window.forceNavigateTo('dashboard');
        } else if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            window.forceNavigateTo('learn');
        } else if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            window.forceNavigateTo('review');
        } else if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            window.forceNavigateTo('progress');
        } else if (e.ctrlKey && e.key === 'd') {
            // Show navigation debug panel
            e.preventDefault();
            const debugPanel = document.getElementById('nav-debug');
            if (debugPanel) {
                debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
            }
        }
    }
});

// Make startReview globally available
window.startReview = function(type = 'all') {
    if (!window.reviewSystem) {
        console.error('Review system not available');
        TurkishLearningApp.showError('نظام المراجعة غير متوفر حالياً');
        return;
    }
    
    const wordsToReview = window.reviewSystem.getWordsForReview(type);
    
    if (wordsToReview.length === 0) {
        TurkishLearningApp.showError('لا توجد كلمات للمراجعة حالياً. تعلم بعض الكلمات أولاً!');
        return;
    }
    
    // Switch to review section
    TurkishLearningApp.showSection('review');
    
    // Start review session
    const reviewContent = document.getElementById('review-content');
    if (reviewContent) {
        reviewContent.classList.remove('hidden');
        
        if (window.ReviewSession) {
            window.currentReviewSession = new window.ReviewSession(wordsToReview);
        } else {
            TurkishLearningApp.showError('نظام المراجعة غير متوفر');
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Turkish Learning App...');
    TurkishLearningApp.init();
});

// Global function to update TTS status
window.updateTTSStatus = function(isAvailable) {
    const ttsButtons = document.querySelectorAll('.tts-btn');
    ttsButtons.forEach(btn => {
        if (isAvailable) {
            btn.classList.remove('disabled');
            btn.removeAttribute('disabled');
        } else {
            btn.classList.add('disabled');
            btn.setAttribute('disabled', 'true');
        }
    });
    
    console.log('TTS Status updated:', isAvailable ? 'Available' : 'Not Available');
};

// Add TTS settings toggle (can be expanded later)
window.toggleTTSAutoPlay = function() {
    if (window.turkishTTS) {
        const newAutoPlay = !window.turkishTTS.settings.autoPlay;
        window.turkishTTS.updateSettings({ autoPlay: newAutoPlay });
        
        // Update UI feedback
        const statusText = newAutoPlay ? 'تشغيل تلقائي مفعّل' : 'تشغيل تلقائي معطّل';
        console.log('TTS AutoPlay:', statusText);
        
        // Show brief notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg z-50';
        notification.textContent = statusText;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }
};

// Make app globally available for debugging
window.TurkishLearningApp = TurkishLearningApp;

console.log('Turkish Learning App script loaded successfully!');