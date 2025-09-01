// 📱 Flashcard Learning Mode - Containerized
// Independent, self-contained flashcard learning system

class FlashcardMode extends LearningModeBase {
    constructor(config = {}) {
        super(config);
        
        // Flashcard-specific properties
        this.words = [];
        this.currentIndex = 0;
        this.responses = [];
        this.isFlipped = false;
        this.isAdvancing = false;
        
        // Flashcard settings
        this.settings = {
            autoFlip: false,
            autoAdvance: false,
            showProgress: true,
            enableTTS: true,
            flipOnClick: true,
            ...this.options.settings
        };
        
        console.log('📱 Flashcard Mode container created');
    }
    
    /**
     * Initialize flashcard mode
     */
    async init() {
        try {
            // Validate required data
            this.validateData(['words', 'category']);
            
            // Setup flashcard data
            this.words = [...this.data.words];
            this.shuffleWords();
            
            // Initialize state
            this.updateState({
                totalWords: this.words.length,
                currentIndex: 0,
                completed: 0,
                accuracy: 0
            });
            
            console.log(`📱 Flashcard mode initialized with ${this.words.length} words`);
            
        } catch (error) {
            console.error('❌ Failed to initialize flashcard mode:', error);
            throw error;
        }
    }
    
    /**
     * Render flashcard interface
     */
    render() {
        if (!this.container) {
            throw new Error('Container not available for flashcard mode');
        }
        
        this.clearContainer();
        
        // Create main flashcard interface
        const flashcardInterface = this.createElement('div', ['flashcard-mode-interface'], {}, `
            ${this.settings.showProgress ? this.renderProgressBar() : ''}
            <div class="flashcard-container-wrapper">
                ${this.renderFlashcard()}
            </div>
            ${this.renderControls()}
            ${this.renderDifficultyButtons()}
        `);
        
        this.appendToContainer(flashcardInterface);
        
        // Setup flashcard-specific event listeners
        this.setupFlashcardEvents();
        
        // Auto-pronounce if enabled
        if (this.settings.enableTTS && window.turkishTTS && window.turkishTTS.settings.autoPlay) {
            this.pronounceCurrentWord();
        }
    }
    
    /**
     * Render progress bar
     */
    renderProgressBar() {
        const progress = this.state.totalWords > 0 ? (this.currentIndex / this.state.totalWords) * 100 : 0;
        
        return `
            <div class="flashcard-progress-section">
                <div class="flashcard-progress-info">
                    <span class="progress-text">الكلمة ${this.currentIndex + 1} من ${this.state.totalWords}</span>
                    <span class="category-text">${this.getCategoryName()}</span>
                </div>
                <div class="flashcard-progress-bar">
                    <div class="flashcard-progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render individual flashcard
     */
    renderFlashcard() {
        const currentWord = this.getCurrentWord();
        if (!currentWord) {
            return '<div class="no-words-message">لا توجد كلمات متاحة</div>';
        }
        
        const hasExample = currentWord.example && currentWord.exampleArabic;
        const icon = currentWord.icon || 'fas fa-language';
        const emoji = currentWord.emoji || '📚';
        
        return `
            <div class="flashcard-container" id="flashcard-container">
                <div class="flashcard ${this.isFlipped ? 'flipped' : ''}" id="flashcard" data-word-id="${currentWord.id}">
                    <!-- Front side -->
                    <div class="flashcard-front">
                        <div class="flashcard-icon-container">
                            <div class="word-icon emoji">${emoji}</div>
                        </div>
                        <div class="flashcard-turkish">${currentWord.turkish}</div>
                        <div class="flashcard-pronunciation">[${currentWord.pronunciation}]</div>
                        <div class="tts-controls">
                            <button class="tts-btn tts-word-btn" data-action="speak-word" title="استمع للكلمة">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        <div class="flashcard-hint">اضغط لرؤية الترجمة والأمثلة</div>
                    </div>
                    
                    <!-- Back side -->
                    <div class="flashcard-back">
                        <div class="flashcard-back-header">
                            <div class="flashcard-icon-container-small">
                                ${currentWord.icon ? 
                                    `<i class="word-meaning-icon ${currentWord.icon}"></i>` : 
                                    `<div class="word-icon emoji">${emoji}</div>`
                                }
                            </div>
                            <div class="flashcard-arabic-main">${currentWord.arabic}</div>
                        </div>
                        
                        ${hasExample ? `
                            <div class="flashcard-example-elevated">
                                <div class="turkish-example-elevated">
                                    <div class="example-text-elevated">${currentWord.example}</div>
                                    <button class="tts-btn tts-example-elevated" data-action="speak-sentence" title="استمع للمثال">
                                        <i class="fas fa-volume-up"></i>
                                    </button>
                                </div>
                                
                                <div class="arabic-translation-elevated">
                                    <div class="example-arabic-elevated">${currentWord.exampleArabic}</div>
                                </div>
                            </div>
                        ` : `
                            <div class="no-example-message-elevated">
                                <i class="fas fa-info-circle"></i>
                                <span class="no-example-text">لا يوجد مثال متاح</span>
                            </div>
                        `}
                        
                        <div class="flashcard-hint">اضغط للعودة للجهة الأمامية</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render control buttons
     */
    renderControls() {
        return `
            <div class="flashcard-controls">
                <button class="btn-flashcard-control" data-action="previous" ${this.currentIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                    <span>السابق</span>
                </button>
                
                <button class="btn-flashcard-control flip-btn" data-action="flip">
                    <i class="fas fa-sync-alt"></i>
                    <span>اقلب البطاقة</span>
                </button>
                
                <button class="btn-flashcard-control" data-action="next" ${this.currentIndex >= this.words.length - 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                    <span>التالي</span>
                </button>
            </div>
        `;
    }
    
    /**
     * Render difficulty assessment buttons
     */
    renderDifficultyButtons() {
        return `
            <div class="flashcard-difficulty-section">
                <div class="difficulty-instruction">
                    <p>كيف كانت صعوبة تذكر هذه الكلمة؟</p>
                </div>
                <div class="difficulty-buttons">
                    <button class="btn-difficulty btn-hard" data-difficulty="hard">
                        <i class="fas fa-times-circle"></i>
                        <span>صعب</span>
                        <small>سأراجعها قريباً</small>
                    </button>
                    <button class="btn-difficulty btn-medium" data-difficulty="medium">
                        <i class="fas fa-minus-circle"></i>
                        <span>متوسط</span>
                        <small>أحتاج مراجعة</small>
                    </button>
                    <button class="btn-difficulty btn-easy" data-difficulty="easy">
                        <i class="fas fa-check-circle"></i>
                        <span>سهل</span>
                        <small>أتقنتها!</small>
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Setup flashcard-specific event listeners
     */
    setupFlashcardEvents() {
        if (!this.container) return;
        
        // Unified event delegation
        this.container.addEventListener('click', (event) => {
            event.stopPropagation();
            
            const action = event.target.closest('[data-action]')?.getAttribute('data-action');
            const difficulty = event.target.closest('[data-difficulty]')?.getAttribute('data-difficulty');
            
            if (action) {
                this.handleAction(action, event);
            } else if (difficulty) {
                this.handleDifficultyResponse(difficulty);
            } else if (event.target.closest('.flashcard')) {
                this.handleFlashcardClick(event);
            }
        });
    }
    
    /**
     * Handle action button clicks
     */
    handleAction(action, event) {
        switch (action) {
            case 'previous':
                this.previousWord();
                break;
            case 'next':
                this.nextWord();
                break;
            case 'flip':
                this.flipCard();
                break;
            case 'speak-word':
                this.pronounceCurrentWord();
                break;
            case 'speak-sentence':
                this.pronounceCurrentSentence();
                break;
        }
    }
    
    /**
     * Handle flashcard click for flipping
     */
    handleFlashcardClick(event) {
        if (!this.settings.flipOnClick) return;
        
        const flashcard = event.target.closest('.flashcard');
        if (!flashcard || flashcard.classList.contains('transitioning')) {
            return;
        }
        
        this.flipCard();
    }
    
    /**
     * Handle difficulty button responses
     */
    handleDifficultyResponse(difficulty) {
        if (this.isAdvancing) return;
        
        this.isAdvancing = true;
        const currentWord = this.getCurrentWord();
        
        // Record response
        const response = {
            wordId: currentWord.id,
            word: currentWord.turkish,
            difficulty: difficulty,
            isCorrect: difficulty === 'easy',
            timestamp: Date.now(),
            mode: 'flashcard'
        };
        
        this.responses.push(response);
        
        // Update metrics
        this.metrics.interactions++;
        if (response.isCorrect) {
            this.metrics.accuracy = (this.metrics.accuracy * (this.responses.length - 1) + 1) / this.responses.length;
        } else {
            this.metrics.accuracy = (this.metrics.accuracy * (this.responses.length - 1)) / this.responses.length;
        }
        
        // Update review system
        if (window.reviewSystem) {
            window.reviewSystem.updateWordReview(currentWord.id, response.isCorrect);
        }
        
        // Show feedback
        this.showFeedback(difficulty);
        
        // Update progress
        this.updateProgress({
            wordId: currentWord.id,
            difficulty,
            accuracy: this.metrics.accuracy
        });
        
        // Auto-advance after delay
        setTimeout(() => {
            if (this.currentIndex < this.words.length - 1) {
                this.nextWord();
            } else {
                this.completeSession();
            }
            this.isAdvancing = false;
        }, 1500);
    }
    
    /**
     * Flip the flashcard
     */
    flipCard() {
        const flashcard = this.container.querySelector('.flashcard');
        if (!flashcard || flashcard.classList.contains('transitioning')) {
            return;
        }
        
        // Add transitioning state
        flashcard.classList.add('transitioning');
        
        // Toggle flip state
        this.isFlipped = !this.isFlipped;
        flashcard.classList.toggle('flipped', this.isFlipped);
        
        // Play appropriate audio
        if (this.settings.enableTTS && window.turkishTTS) {
            setTimeout(() => {
                if (this.isFlipped) {
                    this.pronounceCurrentSentence();
                } else {
                    this.pronounceCurrentWord();
                }
            }, 200);
        }
        
        // Remove transitioning state
        setTimeout(() => {
            flashcard.classList.remove('transitioning');
        }, 600);
        
        this.trackEvent('card_flipped', { 
            direction: this.isFlipped ? 'to_back' : 'to_front',
            wordId: this.getCurrentWord()?.id 
        });
    }
    
    /**
     * Move to next word
     */
    nextWord() {
        if (this.currentIndex < this.words.length - 1) {
            this.currentIndex++;
            this.isFlipped = false;
            this.updateState({ currentIndex: this.currentIndex });
            this.render();
            this.trackEvent('word_advanced', { newIndex: this.currentIndex });
        }
    }
    
    /**
     * Move to previous word
     */
    previousWord() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.isFlipped = false;
            this.updateState({ currentIndex: this.currentIndex });
            this.render();
            this.trackEvent('word_previous', { newIndex: this.currentIndex });
        }
    }
    
    /**
     * Pronounce current word
     */
    async pronounceCurrentWord() {
        const currentWord = this.getCurrentWord();
        if (currentWord && window.speakTurkishWord) {
            try {
                await window.speakTurkishWord(currentWord.turkish);
            } catch (error) {
                console.log('Word pronunciation failed:', error);
            }
        }
    }
    
    /**
     * Pronounce current sentence
     */
    async pronounceCurrentSentence() {
        const currentWord = this.getCurrentWord();
        if (currentWord && currentWord.example && window.speakTurkishSentence) {
            try {
                await window.speakTurkishSentence(currentWord.example);
            } catch (error) {
                console.log('Sentence pronunciation failed:', error);
            }
        }
    }
    
    /**
     * Show difficulty feedback
     */
    showFeedback(difficulty) {
        const messages = {
            easy: { text: 'ممتاز! 🎉', color: 'bg-green-500' },
            medium: { text: 'جيد! 👍', color: 'bg-yellow-500' },
            hard: { text: 'سنراجع هذه الكلمة لاحقاً 📚', color: 'bg-red-500' }
        };
        
        const feedback = messages[difficulty];
        if (feedback) {
            this.showNotification(feedback.text, difficulty === 'easy' ? 'success' : difficulty === 'medium' ? 'warning' : 'error');
        }
    }
    
    /**
     * Complete flashcard session
     */
    completeSession() {
        const accuracy = this.responses.length > 0 ? 
            (this.responses.filter(r => r.isCorrect).length / this.responses.length) * 100 : 0;
        
        const sessionStats = {
            mode: 'flashcard',
            category: this.data.category,
            totalWords: this.words.length,
            completed: this.responses.length,
            accuracy: Math.round(accuracy),
            timeSpent: Math.round((Date.now() - this.startTime) / 1000 / 60),
            responses: this.responses
        };
        
        // Show completion screen
        this.showCompletionScreen(sessionStats);
        
        // Track completion
        this.trackEvent('session_completed', sessionStats);
        
        // Update metrics
        this.metrics.sessionsCompleted++;
    }
    
    /**
     * Show session completion screen
     */
    showCompletionScreen(stats) {
        const completionHTML = `
            <div class="flashcard-completion">
                <div class="completion-header">
                    <i class="fas fa-trophy text-6xl text-yellow-500 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">أحسنت! تم إكمال الجلسة</h2>
                    <p class="text-gray-600">فئة: ${this.getCategoryName()}</p>
                </div>
                
                <div class="completion-stats">
                    <div class="stat-item">
                        <span class="stat-label">إجمالي الكلمات:</span>
                        <span class="stat-value">${stats.totalWords}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">تم إكمالها:</span>
                        <span class="stat-value">${stats.completed}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">الدقة:</span>
                        <span class="stat-value">${stats.accuracy}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">الوقت المستغرق:</span>
                        <span class="stat-value">${stats.timeSpent} دقيقة</span>
                    </div>
                </div>
                
                <div class="completion-actions">
                    <button class="btn-action btn-primary" data-action="restart">
                        <i class="fas fa-redo"></i>
                        إعادة الجلسة
                    </button>
                    <button class="btn-action btn-secondary" data-action="review">
                        <i class="fas fa-repeat"></i>
                        بدء المراجعة
                    </button>
                    <button class="btn-action btn-secondary" data-action="home">
                        <i class="fas fa-home"></i>
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        `;
        
        this.clearContainer();
        this.container.innerHTML = completionHTML;
        
        // Setup completion actions
        this.container.addEventListener('click', (event) => {
            const action = event.target.closest('[data-action]')?.getAttribute('data-action');
            
            switch (action) {
                case 'restart':
                    this.restart();
                    break;
                case 'review':
                    this.startReview();
                    break;
                case 'home':
                    this.goHome();
                    break;
            }
        });
    }
    
    /**
     * Restart flashcard session
     */
    async restart() {
        this.currentIndex = 0;
        this.responses = [];
        this.isFlipped = false;
        this.shuffleWords();
        this.render();
        this.trackEvent('session_restarted');
    }
    
    /**
     * Start review session
     */
    startReview() {
        if (this.manager) {
            this.manager.switchMode('review', { 
                type: 'struggling',
                previousMode: 'flashcard' 
            });
        }
    }
    
    /**
     * Go to home
     */
    goHome() {
        if (window.showSection) {
            window.showSection('dashboard');
        }
    }
    
    /**
     * Shuffle words array
     */
    shuffleWords() {
        for (let i = this.words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
        }
    }
    
    /**
     * Get current word
     */
    getCurrentWord() {
        return this.words[this.currentIndex] || null;
    }
    
    /**
     * Get category name in Arabic
     */
    getCategoryName() {
        const names = {
            greetings: 'التحيات',
            travel: 'السفر',
            food: 'الطعام',
            shopping: 'التسوق',
            directions: 'الاتجاهات',
            emergency: 'الطوارئ',
            time: 'الوقت',
            numbers: 'الأرقام'
        };
        
        return names[this.data.category] || this.data.category;
    }
    
    /**
     * Cleanup flashcard mode
     */
    async cleanup() {
        // Stop any ongoing TTS
        if (window.turkishTTS) {
            window.turkishTTS.stop();
        }
        
        // Clear any timeouts
        this.isAdvancing = false;
        
        console.log('📱 Flashcard mode cleaned up');
    }
    
    /**
     * Handle key press events
     */
    handleKeyPress(event) {
        super.handleKeyPress(event);
        
        // Flashcard-specific keyboard shortcuts
        switch (event.key.toLowerCase()) {
            case ' ': // Spacebar to flip
                event.preventDefault();
                this.flipCard();
                break;
            case 'arrowleft': // Left arrow for previous
                event.preventDefault();
                this.previousWord();
                break;
            case 'arrowright': // Right arrow for next
                event.preventDefault();
                this.nextWord();
                break;
            case '1': // Number keys for difficulty
                event.preventDefault();
                this.handleDifficultyResponse('hard');
                break;
            case '2':
                event.preventDefault();
                this.handleDifficultyResponse('medium');
                break;
            case '3':
                event.preventDefault();
                this.handleDifficultyResponse('easy');
                break;
        }
    }
    
    /**
     * Get help content for flashcard mode
     */
    getHelpContent() {
        return `
            <div style="text-align: right; line-height: 1.6;">
                <h4>🎯 نمط البطاقات التعليمية</h4>
                <p><strong>كيفية الاستخدام:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>اضغط على البطاقة أو مسطرة المسافة لقلبها</li>
                    <li>استخدم الأسهم (← →) للتنقل بين الكلمات</li>
                    <li>استخدم الأرقام (1، 2، 3) لتقييم الصعوبة</li>
                    <li>اضغط على أزرار الصوت لسماع النطق</li>
                </ul>
                <p><strong>اختصارات لوحة المفاتيح:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>مسطرة المسافة: قلب البطاقة</li>
                    <li>← →: التنقل بين الكلمات</li>
                    <li>1، 2، 3: تقييم صعب، متوسط، سهل</li>
                    <li>Ctrl+H: عرض المساعدة</li>
                    <li>Escape: الخروج من النمط</li>
                </ul>
            </div>
        `;
    }
}

// Register flashcard mode with the manager when loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.learningModeManager) {
        window.learningModeManager.registerMode('flashcard', FlashcardMode, {
            name: 'البطاقات التعليمية',
            icon: '📱',
            description: 'تعلم الكلمات باستخدام البطاقات التفاعلية',
            containerId: 'flashcard-mode-container',
            dependencies: [],
            version: '2.0.0'
        });
        
        console.log('📱 Flashcard Mode registered successfully');
    }
});

// Export for direct use
window.FlashcardMode = FlashcardMode;