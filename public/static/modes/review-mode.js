// 🔄 Review Learning Mode - Containerized
// Spaced repetition review system using the ReviewSystem

class ReviewMode extends LearningModeBase {
    constructor(config = {}) {
        super(config);
        
        // Review-specific properties
        this.words = [];
        this.currentIndex = 0;
        this.responses = [];
        this.isFlipped = false;
        this.isAdvancing = false;
        
        // Review settings
        this.settings = {
            autoFlip: false,
            autoAdvance: false,
            showProgress: true,
            enableTTS: true,
            flipOnClick: true,
            ...this.options.settings
        };
        
        console.log('🔄 Review Mode container created');
    }

    /**
     * Initialize review mode
     */
    async init() {
        try {
            // Validate required data
            this.validateData(['words']);
            
            // Setup review data
            this.words = [...this.data.words];
            
            // Initialize state
            this.updateState({
                totalWords: this.words.length,
                currentIndex: 0,
                completed: 0,
                accuracy: 0
            });
            
            console.log(`🔄 Review mode initialized with ${this.words.length} words`);
            
        } catch (error) {
            console.error('❌ Failed to initialize review mode:', error);
            throw error;
        }
    }

    /**
     * Render review interface
     */
    render() {
        if (!this.container) {
            throw new Error('Container not available for review mode');
        }
        
        this.clearContainer();
        
        // Create main review interface with two-column layout
        const reviewInterface = this.createElement('div', ['review-mode-interface'], {}, `
            ${this.settings.showProgress ? this.renderProgressBar() : ''}
            <div class="review-main-layout">
                <!-- Left Column: Vertical Difficulty Buttons -->
                <div class="review-difficulty-column">
                    ${this.renderDifficultyButtons()}
                </div>
                
                <!-- Right Column: Review Card with Navigation -->
                <div class="review-content-column">
                    <div class="review-container-wrapper">
                        ${this.renderReviewCard()}
                    </div>
                    ${this.renderControls()}
                </div>
            </div>
        `);
        
        this.appendToContainer(reviewInterface);
        
        // Setup review-specific event listeners
        this.setupReviewEvents();
    }

    /**
     * Render progress bar
     */
    renderProgressBar() {
        const progress = this.state.totalWords > 0 ? (this.currentIndex / this.state.totalWords) * 100 : 0;
        
        // Check if session information is available
        const sessionInfo = this.data.sessionInfo;
        
        let progressText = `الكلمة ${this.currentIndex + 1} من ${this.state.totalWords}`;
        let sessionText = this.getCategoryName();
        
        if (sessionInfo) {
            progressText = `الكلمة ${this.currentIndex + 1} من ${sessionInfo.wordsInSession}`;
            sessionText = `الجلسة ${sessionInfo.sessionNumber} من ${sessionInfo.totalSessions} • ${this.getCategoryName()}`;
        }
        
        return `
            <div class="review-progress-section">
                <div class="review-progress-info">
                    <span class="progress-text">${progressText}</span>
                    <span class="category-text">${sessionText}</span>
                </div>
                <div class="review-progress-bar">
                    <div class="review-progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }

    /**
     * Render individual review card
     */
    renderReviewCard() {
        const currentWord = this.getCurrentWord();
        if (!currentWord) {
            return '<div class="no-words-message">لا توجد كلمات متاحة للمراجعة</div>';
        }
        
        const wordToDisplay = currentWord.turkish;
        const arabicTranslation = currentWord.arabic;
        
        const hasExample = currentWord.turkishSentence && currentWord.arabicSentence;
        const icon = currentWord.icon || 'fas fa-redo';
        const emoji = currentWord.emoji || '🔁';
        
        return `
            <div class="review-container" id="review-container">
                <!-- Left Navigation Button -->
                <button class="review-nav-button review-nav-prev ${this.currentIndex === 0 ? 'disabled' : ''}" data-action="previous" title="السابق">
                    <i class="fas fa-chevron-right"></i>
                </button>
                
                <div class="review-card ${this.isFlipped ? 'flipped' : ''}" id="review-card" data-word-id="${currentWord.id}">
                    <!-- FRONT: Individual Turkish Word Only -->
                    <div class="review-front">
                        <div class="review-icon-container">
                            <div class="word-icon emoji">${emoji}</div>
                        </div>
                        <div class="review-turkish">${wordToDisplay}</div>
                        ${currentWord.pronunciation && currentWord.pronunciation !== 'undefined' ? 
                            `<div class="review-pronunciation">[${currentWord.pronunciation}]</div>` :
                            currentWord.vowelHarmony && currentWord.vowelHarmony !== 'undefined' ? 
                                `<div class="review-vowel-harmony">${currentWord.vowelHarmony}</div>` :
                                ''
                        }
                        <div class="tts-controls">
                            <button class="tts-btn tts-word-btn" data-action="speak-word" title="استمع للكلمة">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        <div class="review-hint">اضغط لرؤية الترجمة</div>
                    </div>
                    
                    <!-- BACK: Translation + Optional Example -->
                    <div class="review-back">
                        <div class="review-back-header">
                            <div class="review-icon-container">
                                <div class="word-icon emoji">${emoji}</div>
                            </div>
                            <div class="review-turkish">${wordToDisplay}</div>
                        </div>
                        
                        <div class="review-translation-section">
                            <div class="review-arabic">${arabicTranslation}</div>
                            <div class="review-english">${currentWord.english}</div>
                        </div>
                        
                        ${hasExample ? `
                            <div class="review-example-section">
                                <div class="review-turkish-example">${currentWord.turkishSentence}</div>
                                <div class="review-arabic-example">${currentWord.arabicSentence}</div>
                            </div>
                        ` : ''}
                        
                        ${currentWord.difficultyLevel ? `
                            <div class="review-difficulty-badge" data-difficulty="${currentWord.difficultyLevel}">
                                ${currentWord.difficultyLevel}
                            </div>
                        ` : ''}
                        
                        <div class="review-back-controls">
                            <button class="tts-btn tts-example-btn" data-action="speak-example" title="استمع للجملة">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Right Navigation Button -->
                <button class="review-nav-button review-nav-next ${this.currentIndex >= this.words.length - 1 ? 'disabled' : ''}" data-action="next" title="التالي">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>
        `;
    }

    /**
     * Render control buttons
     */
    renderControls() {
        return `
            <div class="review-controls">
                <div class="review-response-buttons">
                    <button class="btn-difficulty btn-hard" data-response="incorrect" title="صعبة">
                        <i class="fas fa-times"></i>
                        <span>صعبة</span>
                    </button>
                    <button class="btn-difficulty btn-medium" data-response="medium" title="متوسطة">
                        <i class="fas fa-minus"></i>
                        <span>متوسطة</span>
                    </button>
                    <button class="btn-difficulty btn-easy" data-response="correct" title="سهلة">
                        <i class="fas fa-check"></i>
                        <span>سهلة</span>
                    </button>
                </div>
                
                <div class="review-action-buttons">
                    <button class="btn-secondary" data-action="pause" title="إيقاف مؤقت">
                        <i class="fas fa-pause"></i>
                        <span>إيقاف مؤقت</span>
                    </button>
                    <button class="btn-secondary" data-action="end" title="إنهاء الجلسة">
                        <i class="fas fa-stop"></i>
                        <span>إنهاء الجلسة</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render difficulty buttons for rating responses
     */
    renderDifficultyButtons() {
        return `
            <div class="review-difficulty-buttons">
                <button class="difficulty-btn difficulty-1" data-difficulty="1" title="صعبة جداً">
                    <i class="fas fa-times"></i>
                </button>
                <button class="difficulty-btn difficulty-2" data-difficulty="2" title="صعبة">
                    <i class="fas fa-times"></i>
                </button>
                <button class="difficulty-btn difficulty-3" data-difficulty="3" title="متوسطة">
                    <i class="fas fa-minus"></i>
                </button>
                <button class="difficulty-btn difficulty-4" data-difficulty="4" title="سهلة">
                    <i class="fas fa-check"></i>
                </button>
                <button class="difficulty-btn difficulty-5" data-difficulty="5" title="سهلة جداً">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        `;
    }

    /**
     * Setup event listeners for review mode
     */
    setupReviewEvents() {
        if (!this.container) return;
        
        // Navigation buttons
        this.container.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            const response = e.target.closest('[data-response]')?.dataset.response;
            const difficulty = e.target.closest('[data-difficulty]')?.dataset.difficulty;
            
            if (action) {
                this.handleAction(action);
            }
            
            if (response) {
                this.recordResponse(response);
            }
            
            if (difficulty) {
                this.recordDifficulty(parseInt(difficulty));
            }
            
            // Flip card on click
            if (e.target.closest('#review-card') && this.settings.flipOnClick) {
                this.flipCard();
            }
        });
    }

    /**
     * Handle action buttons
     */
    handleAction(action) {
        switch (action) {
            case 'previous':
                this.previousWord();
                break;
            case 'next':
                this.nextWord();
                break;
            case 'speak-word':
                this.pronounceCurrentWord();
                break;
            case 'speak-example':
                this.pronounceCurrentExample();
                break;
            case 'pause':
                this.pauseSession();
                break;
            case 'end':
                this.endSession();
                break;
        }
    }

    /**
     * Record user response for spaced repetition
     */
    recordResponse(response) {
        const currentWord = this.getCurrentWord();
        if (!currentWord) return;
        
        const isCorrect = response === 'correct';
        const easeFactor = this.getEaseFactorFromResponse(response);
        
        // Update review system
        if (window.reviewSystem) {
            window.reviewSystem.updateWordReview(currentWord.id, isCorrect, easeFactor);
        }
        
        // Move to next word
        this.nextWord();
    }

    /**
     * Get ease factor based on user response
     */
    getEaseFactorFromResponse(response) {
        switch (response) {
            case 'incorrect': return 1.3;
            case 'medium': return 2.0;
            case 'correct': return 2.5;
            default: return 2.5;
        }
    }

    /**
     * Flip the review card
     */
    flipCard() {
        this.isFlipped = !this.isFlipped;
        const card = this.container?.querySelector('#review-card');
        if (card) {
            card.classList.toggle('flipped', this.isFlipped);
        }
    }

    /**
     * Move to next word
     */
    nextWord() {
        if (this.currentIndex < this.words.length - 1) {
            this.currentIndex++;
            this.isFlipped = false;
            this.render();
            this.updateProgress();
            
            // Auto-pronounce if enabled
            if (this.settings.enableTTS && window.turkishTTS && window.turkishTTS.settings.autoPlay) {
                this.pronounceCurrentWord();
            }
        } else {
            // End of session
            this.endSession();
        }
    }

    /**
     * Move to previous word
     */
    previousWord() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.isFlipped = false;
            this.render();
            this.updateProgress();
        }
    }

    /**
     * Update progress tracking
     */
    updateProgress() {
        const completed = this.currentIndex;
        const total = this.words.length;
        const accuracy = total > 0 ? (this.responses.filter(r => r === 'correct').length / completed) * 100 : 0;
        
        this.updateState({
            currentIndex: this.currentIndex,
            completed,
            accuracy
        });
    }

    /**
     * Pronounce current word
     */
    pronounceCurrentWord() {
        const currentWord = this.getCurrentWord();
        if (currentWord && window.turkishTTS) {
            window.turkishTTS.speak(currentWord.turkish);
        }
    }

    /**
     * Pronounce current example
     */
    pronounceCurrentExample() {
        const currentWord = this.getCurrentWord();
        if (currentWord && currentWord.turkishSentence && window.turkishTTS) {
            window.turkishTTS.speak(currentWord.turkishSentence);
        }
    }

    /**
     * Get current word
     */
    getCurrentWord() {
        return this.words[this.currentIndex];
    }

    /**
     * Get category name
     */
    getCategoryName() {
        if (this.data.category) {
            return this.data.category.nameArabic || this.data.category.name || 'غير مصنف';
        }
        return 'غير مصنف';
    }

    /**
     * Pause the session
     */
    pauseSession() {
        this.emit('sessionPaused', { mode: 'review', state: this.state });
        console.log('⏸️ Review session paused');
    }

    /**
     * End the session
     */
    endSession() {
        this.emit('sessionEnded', { mode: 'review', state: this.state, metrics: this.metrics });
        console.log('⏹️ Review session ended');
    }

    /**
     * Clean up resources
     */
    async cleanup() {
        console.log('🔄 Review mode cleaned up');
    }
}

// Register review mode with the manager when loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.learningModeManager) {
        window.learningModeManager.registerMode('review', ReviewMode, {
            name: 'Review Mode',
            icon: '🔄',
            description: 'Spaced repetition review system for long-term retention.',
            containerId: 'review-mode-container',
            dependencies: ['reviewSystem'],
            version: '1.0.0'
        });
        console.log('🔄 Review Mode registered successfully');
    }
});

window.ReviewMode = ReviewMode;