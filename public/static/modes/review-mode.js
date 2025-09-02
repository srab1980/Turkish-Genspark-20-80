// 🔄 Review Learning Mode - Containerized
// Independent spaced repetition review system

class ReviewMode extends LearningModeBase {
    constructor(config = {}) {
        super(config);
        
        // Review-specific properties
        this.reviewWords = [];
        this.currentIndex = 0;
        this.responses = [];
        this.reviewType = 'all'; // 'all', 'struggling', 'maintenance', 'mistakes'
        
        // Review settings
        this.settings = {
            showDifficulty: true,
            enableTTS: true,
            autoFlip: false,
            spacedRepetition: true,
            showProgress: true,
            ...this.options.settings
        };
        
        // Spaced repetition intervals (in days)
        this.intervals = [1, 3, 7, 14, 30, 60, 120];
        
        console.log('🔄 Review Mode container created');
    }
    
    /**
     * Initialize review mode
     */
    async init() {
        try {
            // Determine review type and words
            this.reviewType = this.data.type || 'all';
            
            if (this.data.words) {
                // Use provided words (e.g., from mistakes review)
                this.reviewWords = this.prepareReviewWords(this.data.words);
            } else {
                // Load words from review system
                this.reviewWords = await this.loadReviewWords();
            }
            
            if (this.reviewWords.length === 0) {
                throw new Error('No words available for review');
            }
            
            // Sort by priority (struggling first, then by due date)
            this.sortWordsByPriority();
            
            // Initialize state
            this.updateState({
                totalWords: this.reviewWords.length,
                currentIndex: 0,
                reviewed: 0,
                correct: 0,
                accuracy: 0
            });
            
            console.log(`🔄 Review mode initialized with ${this.reviewWords.length} words for review type: ${this.reviewType}`);
            
        } catch (error) {
            console.error('❌ Failed to initialize review mode:', error);
            throw error;
        }
    }
    
    /**
     * Load words for review from review system
     */
    async loadReviewWords() {
        if (!window.reviewSystem) {
            throw new Error('Review system not available');
        }
        
        const reviewWords = window.reviewSystem.getWordsForReview(this.reviewType);
        
        if (reviewWords.length === 0) {
            throw new Error('No words due for review');
        }
        
        // Get vocabulary data to combine with review data
        const vocabularyWords = [];
        Object.values(window.vocabularyData || {}).forEach(categoryWords => {
            if (Array.isArray(categoryWords)) {
                vocabularyWords.push(...categoryWords);
            }
        });
        
        // Combine review data with vocabulary data
        return reviewWords.map(reviewWord => {
            const vocabWord = vocabularyWords.find(word => word.id === reviewWord.id);
            return vocabWord ? { ...vocabWord, reviewData: reviewWord } : null;
        }).filter(Boolean);
    }
    
    /**
     * Prepare review words from provided array
     */
    prepareReviewWords(words) {
        return words.map(word => ({
            ...word,
            reviewData: this.getOrCreateReviewData(word.id)
        }));
    }
    
    /**
     * Get or create review data for a word
     */
    getOrCreateReviewData(wordId) {
        if (window.reviewSystem && window.reviewSystem.reviewData[wordId]) {
            return window.reviewSystem.reviewData[wordId];
        }
        
        // Create minimal review data
        return {
            id: wordId,
            difficulty: 'learning',
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            nextReview: Date.now(),
            lastReview: Date.now(),
            streak: 0,
            totalReviews: 0,
            correctReviews: 0,
            createdAt: Date.now()
        };
    }
    
    /**
     * Sort words by review priority
     */
    sortWordsByPriority() {
        const priorityOrder = { 'struggling': 0, 'learning': 1, 'maintenance': 2, 'mastered': 3 };
        
        this.reviewWords.sort((a, b) => {
            const aPriority = priorityOrder[a.reviewData.difficulty] || 99;
            const bPriority = priorityOrder[b.reviewData.difficulty] || 99;
            
            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }
            
            // If same priority, sort by next review date (earlier first)
            return a.reviewData.nextReview - b.reviewData.nextReview;
        });
    }
    
    /**
     * Render review interface
     */
    render() {
        if (!this.container) {
            throw new Error('Container not available for review mode');
        }
        
        this.clearContainer();
        
        if (this.reviewWords.length === 0) {
            this.renderNoWordsMessage();
            return;
        }
        
        // Create main review interface
        const reviewInterface = this.createElement('div', ['review-mode-interface'], {}, `
            ${this.renderReviewHeader()}
            ${this.settings.showProgress ? this.renderProgressSection() : ''}
            <div class="review-container-wrapper">
                ${this.renderReviewCard()}
            </div>
            ${this.renderReviewControls()}
        `);
        
        this.appendToContainer(reviewInterface);
        
        // Setup review-specific event listeners
        this.setupReviewEvents();
        
        // Auto-pronounce if enabled
        if (this.settings.enableTTS && window.turkishTTS && window.turkishTTS.settings.autoPlay) {
            this.pronounceCurrentWord();
        }
    }
    
    /**
     * Render review header
     */
    renderReviewHeader() {
        const typeNames = {
            all: 'مراجعة شاملة',
            struggling: 'مراجعة الكلمات الصعبة',
            maintenance: 'مراجعة دورية',
            mistakes: 'مراجعة الأخطاء'
        };
        
        return `
            <div class="review-header">
                <div class="review-title">
                    <i class="fas fa-repeat"></i>
                    <h2>${typeNames[this.reviewType] || 'مراجعة'}</h2>
                </div>
                <div class="review-stats-summary">
                    <span class="total-count">${this.reviewWords.length} كلمة للمراجعة</span>
                </div>
            </div>
        `;
    }
    
    /**
     * Render progress section
     */
    renderProgressSection() {
        const progress = this.state.totalWords > 0 ? (this.currentIndex / this.state.totalWords) * 100 : 0;
        
        return `
            <div class="review-progress-section">
                <div class="review-progress-info">
                    <span class="progress-text">الكلمة ${this.currentIndex + 1} من ${this.state.totalWords}</span>
                    <span class="accuracy-text">الدقة: ${Math.round(this.state.accuracy)}%</span>
                </div>
                <div class="review-progress-bar">
                    <div class="review-progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render review card
     */
    renderReviewCard() {
        const currentWord = this.getCurrentWord();
        if (!currentWord) {
            return '<div class="no-words-message">لا توجد كلمات للمراجعة</div>';
        }
        
        const reviewData = currentWord.reviewData;
        const hasExample = currentWord.example && currentWord.exampleArabic;
        const emoji = currentWord.emoji || '📚';
        
        // Calculate next review date
        const nextReviewDate = new Date(reviewData.nextReview).toLocaleDateString('ar-SA');
        const daysSinceLastReview = Math.floor((Date.now() - reviewData.lastReview) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="review-card-container">
                <div class="review-card" id="review-card">
                    <!-- Review Info Panel -->
                    ${this.settings.showDifficulty ? `
                        <div class="review-info-panel">
                            <div class="difficulty-indicator ${reviewData.difficulty}">
                                ${this.getDifficultyIcon(reviewData.difficulty)}
                                <span>${this.getDifficultyName(reviewData.difficulty)}</span>
                            </div>
                            <div class="review-stats">
                                <span class="stat">المراجعات: ${reviewData.totalReviews}</span>
                                <span class="stat">السلسلة: ${reviewData.streak}</span>
                                <span class="stat">آخر مراجعة: ${daysSinceLastReview} يوم</span>
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- Word Card -->
                    <div class="word-card">
                        <div class="word-front">
                            <div class="word-icon-container">
                                <div class="word-icon emoji">${emoji}</div>
                            </div>
                            <div class="word-turkish">${currentWord.turkish}</div>
                            <div class="word-pronunciation">[${currentWord.pronunciation}]</div>
                            <div class="tts-controls">
                                <button class="tts-btn" data-action="speak-word" title="استمع للكلمة">
                                    <i class="fas fa-volume-up"></i>
                                </button>
                            </div>
                            <div class="review-hint">فكر في المعنى، ثم اضغط "إظهار الإجابة"</div>
                        </div>
                        
                        <div class="word-back" style="display: none;">
                            <div class="word-back-header">
                                <div class="word-icon emoji small">${emoji}</div>
                                <div class="word-arabic">${currentWord.arabic}</div>
                            </div>
                            
                            ${hasExample ? `
                                <div class="word-example">
                                    <div class="turkish-example">
                                        <div class="example-text">${currentWord.example}</div>
                                        <button class="tts-btn" data-action="speak-sentence" title="استمع للمثال">
                                            <i class="fas fa-volume-up"></i>
                                        </button>
                                    </div>
                                    <div class="arabic-example">${currentWord.exampleArabic}</div>
                                </div>
                            ` : ''}
                            
                            <div class="review-performance-question">
                                <p>كيف كان أداؤك في تذكر هذه الكلمة؟</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render review controls
     */
    renderReviewControls() {
        const currentWord = this.getCurrentWord();
        const isShowingBack = this.isShowingAnswer();
        
        return `
            <div class="review-controls">
                ${!isShowingBack ? `
                    <!-- Show Answer Controls -->
                    <div class="show-answer-controls">
                        <button class="review-btn primary" data-action="show-answer">
                            <i class="fas fa-eye"></i>
                            إظهار الإجابة
                        </button>
                        <button class="review-btn secondary" data-action="hint" title="تلميح">
                            <i class="fas fa-lightbulb"></i>
                        </button>
                    </div>
                ` : `
                    <!-- Performance Assessment Controls -->
                    <div class="performance-controls">
                        <button class="review-difficulty-btn forgot" data-performance="forgot">
                            <i class="fas fa-times-circle"></i>
                            <span>نسيت تماماً</span>
                            <small>سأراجعها قريباً</small>
                        </button>
                        <button class="review-difficulty-btn partial" data-performance="partial">
                            <i class="fas fa-minus-circle"></i>
                            <span>تذكرت جزئياً</span>
                            <small>أحتاج مراجعة</small>
                        </button>
                        <button class="review-difficulty-btn remembered" data-performance="remembered">
                            <i class="fas fa-check-circle"></i>
                            <span>تذكرت جيداً</span>
                            <small>المراجعة القادمة بعد فترة</small>
                        </button>
                        <button class="review-difficulty-btn easy" data-performance="easy">
                            <i class="fas fa-star"></i>
                            <span>سهل جداً</span>
                            <small>أتقنتها تماماً</small>
                        </button>
                    </div>
                `}
                
                <!-- Navigation Controls -->
                <div class="review-navigation">
                    <button class="review-nav-btn" data-action="previous" ${this.currentIndex === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                        السابق
                    </button>
                    <span class="review-counter">${this.currentIndex + 1} / ${this.reviewWords.length}</span>
                    <button class="review-nav-btn" data-action="skip">
                        <i class="fas fa-forward"></i>
                        تخطي
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Render no words message
     */
    renderNoWordsMessage() {
        const messages = {
            all: 'ممتاز! لا توجد كلمات تحتاج للمراجعة حالياً 🎉',
            struggling: 'رائع! لا توجد كلمات صعبة للمراجعة 👏',
            maintenance: 'جيد! جميع الكلمات في المستوى المطلوب ✅',
            mistakes: 'لم ترتكب أي أخطاء للمراجعة! 🏆'
        };
        
        const noWordsHTML = `
            <div class="no-words-review">
                <div class="no-words-icon">
                    <i class="fas fa-trophy text-6xl text-yellow-500"></i>
                </div>
                <h3 class="no-words-title">${messages[this.reviewType] || messages.all}</h3>
                <p class="no-words-description">
                    ${this.reviewType === 'all' ? 
                        'تعلم المزيد من الكلمات لتبدأ نظام المراجعة المتباعدة' :
                        'عد لاحقاً أو جرب نوع مراجعة آخر'
                    }
                </p>
                <div class="no-words-actions">
                    <button class="btn-action btn-primary" data-action="learn-new">
                        <i class="fas fa-plus"></i>
                        تعلم كلمات جديدة
                    </button>
                    <button class="btn-action btn-secondary" data-action="home">
                        <i class="fas fa-home"></i>
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        `;
        
        this.container.innerHTML = noWordsHTML;
        
        // Setup no words actions
        this.container.addEventListener('click', (event) => {
            const action = event.target.closest('[data-action]')?.getAttribute('data-action');
            
            switch (action) {
                case 'learn-new':
                    this.goToLearning();
                    break;
                case 'home':
                    this.goHome();
                    break;
            }
        });
    }
    
    /**
     * Setup review-specific event listeners
     */
    setupReviewEvents() {
        if (!this.container) return;
        
        // Unified event delegation
        this.container.addEventListener('click', (event) => {
            event.stopPropagation();
            
            const action = event.target.closest('[data-action]')?.getAttribute('data-action');
            const performance = event.target.closest('[data-performance]')?.getAttribute('data-performance');
            
            if (action) {
                this.handleAction(action, event);
            } else if (performance) {
                this.recordPerformance(performance);
            }
        });
    }
    
    /**
     * Handle action button clicks
     */
    handleAction(action, event) {
        switch (action) {
            case 'show-answer':
                this.showAnswer();
                break;
            case 'hint':
                this.showHint();
                break;
            case 'previous':
                this.previousWord();
                break;
            case 'skip':
                this.skipWord();
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
     * Show answer (flip card)
     */
    showAnswer() {
        const wordCard = this.container.querySelector('.word-card');
        if (!wordCard) return;
        
        const frontSide = wordCard.querySelector('.word-front');
        const backSide = wordCard.querySelector('.word-back');
        
        if (frontSide && backSide) {
            frontSide.style.display = 'none';
            backSide.style.display = 'block';
            
            // Re-render controls to show performance buttons
            this.updateControls();
            
            // Auto-pronounce example if available
            if (this.settings.enableTTS && window.turkishTTS) {
                setTimeout(() => {
                    this.pronounceCurrentSentence();
                }, 300);
            }
            
            this.trackEvent('answer_shown', { wordId: this.getCurrentWord()?.id });
        }
    }
    
    /**
     * Show hint for current word
     */
    showHint() {
        const currentWord = this.getCurrentWord();
        if (!currentWord) return;
        
        const reviewData = currentWord.reviewData;
        
        const hintContent = `
            <div style="text-align: right; line-height: 1.6;">
                <h4>💡 تلميح</h4>
                <p><strong>الكلمة:</strong> ${currentWord.turkish}</p>
                <p><strong>النطق:</strong> [${currentWord.pronunciation}]</p>
                ${currentWord.example ? `
                    <p><strong>في جملة:</strong></p>
                    <p style="font-style: italic; color: #555;">${currentWord.example}</p>
                ` : ''}
                <p><strong>مستوى الصعوبة:</strong> ${this.getDifficultyName(reviewData.difficulty)}</p>
                <p><strong>عدد المراجعات:</strong> ${reviewData.totalReviews}</p>
                <hr style="margin: 1rem 0;">
                <p style="color: #666; font-size: 0.9rem;">
                    💡 فكر في السياق الذي قد تستخدم فيه هذه الكلمة
                </p>
            </div>
        `;
        
        this.showModal('تلميح', hintContent);
        this.trackEvent('hint_requested', { wordId: currentWord.id });
    }
    
    /**
     * Record performance assessment
     */
    recordPerformance(performance) {
        const currentWord = this.getCurrentWord();
        if (!currentWord) return;
        
        const reviewData = currentWord.reviewData;
        
        // Map performance to quality scores (SM-2 algorithm)
        const performanceMap = {
            forgot: { quality: 0, isCorrect: false },
            partial: { quality: 2, isCorrect: false },
            remembered: { quality: 4, isCorrect: true },
            easy: { quality: 5, isCorrect: true }
        };
        
        const performanceData = performanceMap[performance];
        
        // Record response
        const response = {
            wordId: currentWord.id,
            word: currentWord.turkish,
            performance: performance,
            quality: performanceData.quality,
            isCorrect: performanceData.isCorrect,
            timestamp: Date.now(),
            mode: 'review',
            previousDifficulty: reviewData.difficulty
        };
        
        this.responses.push(response);
        
        // Update review system
        if (window.reviewSystem) {
            const easeFactor = this.calculateEaseFactor(performanceData.quality, reviewData.easeFactor);
            window.reviewSystem.updateWordReview(currentWord.id, performanceData.isCorrect, easeFactor);
        }
        
        // Update state
        if (performanceData.isCorrect) {
            this.updateState({ correct: this.state.correct + 1 });
        }
        
        const totalReviewed = this.state.reviewed + 1;
        const accuracy = totalReviewed > 0 ? (this.state.correct / totalReviewed) * 100 : 0;
        this.updateState({ 
            reviewed: totalReviewed,
            accuracy: accuracy
        });
        
        // Update metrics
        this.metrics.interactions++;
        this.metrics.accuracy = accuracy / 100;
        
        // Show performance feedback
        this.showPerformanceFeedback(performance);
        
        // Update progress
        this.updateProgress({
            wordId: currentWord.id,
            performance,
            accuracy: this.metrics.accuracy
        });
        
        // Auto-advance after delay
        setTimeout(() => {
            if (this.currentIndex < this.reviewWords.length - 1) {
                this.nextWord();
            } else {
                this.completeSession();
            }
        }, 1500);
        
        this.trackEvent('performance_recorded', {
            wordId: currentWord.id,
            performance,
            quality: performanceData.quality
        });
    }
    
    /**
     * Calculate ease factor using SM-2 algorithm
     */
    calculateEaseFactor(quality, currentEaseFactor) {
        const newEaseFactor = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        return Math.max(1.3, newEaseFactor);
    }
    
    /**
     * Show performance feedback
     */
    showPerformanceFeedback(performance) {
        const feedbackMap = {
            forgot: { message: 'سنراجعها قريباً 📚', type: 'error' },
            partial: { message: 'تحسن جيد! 👍', type: 'warning' },
            remembered: { message: 'ممتاز! 🎉', type: 'success' },
            easy: { message: 'رائع! أتقنتها تماماً! ⭐', type: 'success' }
        };
        
        const feedback = feedbackMap[performance];
        if (feedback) {
            this.showNotification(feedback.message, feedback.type);
        }
    }
    
    /**
     * Move to next word
     */
    nextWord() {
        if (this.currentIndex < this.reviewWords.length - 1) {
            this.currentIndex++;
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
            this.updateState({ currentIndex: this.currentIndex });
            this.render();
            this.trackEvent('word_previous', { newIndex: this.currentIndex });
        }
    }
    
    /**
     * Skip current word
     */
    skipWord() {
        const currentWord = this.getCurrentWord();
        
        // Record as skipped
        this.responses.push({
            wordId: currentWord.id,
            word: currentWord.turkish,
            performance: 'skipped',
            isCorrect: false,
            timestamp: Date.now(),
            mode: 'review'
        });
        
        this.trackEvent('word_skipped', { wordId: currentWord.id });
        
        if (this.currentIndex < this.reviewWords.length - 1) {
            this.nextWord();
        } else {
            this.completeSession();
        }
    }
    
    /**
     * Update controls based on current state
     */
    updateControls() {
        const controlsContainer = this.container.querySelector('.review-controls');
        if (controlsContainer) {
            controlsContainer.innerHTML = this.renderReviewControls().match(/<div class="review-controls">([\s\S]*)<\/div>/)[1];
        }
    }
    
    /**
     * Check if currently showing answer
     */
    isShowingAnswer() {
        const backSide = this.container.querySelector('.word-back');
        return backSide && backSide.style.display !== 'none';
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
     * Complete review session
     */
    completeSession() {
        const sessionStats = {
            mode: 'review',
            reviewType: this.reviewType,
            totalWords: this.reviewWords.length,
            reviewed: this.responses.length,
            correct: this.state.correct,
            accuracy: Math.round(this.state.accuracy),
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
            <div class="review-completion">
                <div class="completion-header">
                    <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">تمت المراجعة بنجاح! 🎉</h2>
                    <p class="text-gray-600">نوع المراجعة: ${this.getReviewTypeName()}</p>
                </div>
                
                <div class="completion-stats">
                    <div class="stat-item">
                        <span class="stat-label">الكلمات المراجعة:</span>
                        <span class="stat-value">${stats.reviewed}/${stats.totalWords}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">الإجابات الصحيحة:</span>
                        <span class="stat-value">${stats.correct}</span>
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
                    <button class="btn-action btn-primary" data-action="review-again">
                        <i class="fas fa-redo"></i>
                        مراجعة أخرى
                    </button>
                    <button class="btn-action btn-secondary" data-action="learn-new">
                        <i class="fas fa-plus"></i>
                        تعلم كلمات جديدة
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
                case 'review-again':
                    this.startAnotherReview();
                    break;
                case 'learn-new':
                    this.goToLearning();
                    break;
                case 'home':
                    this.goHome();
                    break;
            }
        });
    }
    
    /**
     * Start another review session
     */
    startAnotherReview() {
        if (this.manager) {
            this.manager.switchMode('review', { type: 'all' });
        }
    }
    
    /**
     * Go to learning mode
     */
    goToLearning() {
        if (window.showSection) {
            window.showSection('learn');
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
     * Get current word
     */
    getCurrentWord() {
        return this.reviewWords[this.currentIndex] || null;
    }
    
    /**
     * Get difficulty icon
     */
    getDifficultyIcon(difficulty) {
        const icons = {
            struggling: '🔴',
            learning: '🟡',
            maintenance: '🟢',
            mastered: '⭐'
        };
        return icons[difficulty] || '❓';
    }
    
    /**
     * Get difficulty name in Arabic
     */
    getDifficultyName(difficulty) {
        const names = {
            struggling: 'صعب',
            learning: 'في التعلم',
            maintenance: 'صيانة',
            mastered: 'متقن'
        };
        return names[difficulty] || difficulty;
    }
    
    /**
     * Get review type name in Arabic
     */
    getReviewTypeName() {
        const names = {
            all: 'مراجعة شاملة',
            struggling: 'الكلمات الصعبة',
            maintenance: 'مراجعة دورية',
            mistakes: 'مراجعة الأخطاء'
        };
        return names[this.reviewType] || this.reviewType;
    }
    
    /**
     * Cleanup review mode
     */
    async cleanup() {
        // Stop any ongoing TTS
        if (window.turkishTTS) {
            window.turkishTTS.stop();
        }
        
        console.log('🔄 Review mode cleaned up');
    }
    
    /**
     * Handle key press events
     */
    handleKeyPress(event) {
        super.handleKeyPress(event);
        
        // Review-specific keyboard shortcuts
        const isShowingAnswer = this.isShowingAnswer();
        
        if (!isShowingAnswer) {
            switch (event.key.toLowerCase()) {
                case ' ': // Spacebar to show answer
                    event.preventDefault();
                    this.showAnswer();
                    break;
            }
        } else {
            switch (event.key.toLowerCase()) {
                case '1': // Performance shortcuts
                    event.preventDefault();
                    this.recordPerformance('forgot');
                    break;
                case '2':
                    event.preventDefault();
                    this.recordPerformance('partial');
                    break;
                case '3':
                    event.preventDefault();
                    this.recordPerformance('remembered');
                    break;
                case '4':
                    event.preventDefault();
                    this.recordPerformance('easy');
                    break;
            }
        }
        
        // General navigation
        switch (event.key.toLowerCase()) {
            case 'arrowleft':
                event.preventDefault();
                this.previousWord();
                break;
            case 'arrowright':
                event.preventDefault();
                this.skipWord();
                break;
        }
    }
    
    /**
     * Get help content for review mode
     */
    getHelpContent() {
        return `
            <div style="text-align: right; line-height: 1.6;">
                <h4>🔄 نمط المراجعة</h4>
                <p><strong>المراجعة المتباعدة:</strong></p>
                <p>نظام ذكي يعرض الكلمات بناءً على صعوبتها وآخر مراجعة لها</p>
                
                <p><strong>كيفية الاستخدام:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>انظر للكلمة وحاول تذكر معناها</li>
                    <li>اضغط "إظهار الإجابة" أو مسطرة المسافة</li>
                    <li>قيّم أداءك بصدق (هذا يؤثر على المراجعات المستقبلية)</li>
                    <li>استخدم أزرار الصوت لسماع النطق</li>
                </ul>
                
                <p><strong>مستويات الأداء:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>🔴 نسيت تماماً: ستظهر قريباً</li>
                    <li>🟡 تذكرت جزئياً: مراجعة قريبة</li>
                    <li>🟢 تذكرت جيداً: مراجعة بعد فترة أطول</li>
                    <li>⭐ سهل جداً: مراجعة بعد فترة طويلة</li>
                </ul>
                
                <p><strong>اختصارات لوحة المفاتيح:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>مسطرة المسافة: إظهار الإجابة</li>
                    <li>1، 2، 3، 4: تقييم الأداء</li>
                    <li>← →: السابق / تخطي</li>
                </ul>
            </div>
        `;
    }
}

// Register review mode with the manager when loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.learningModeManager) {
        window.learningModeManager.registerMode('review', ReviewMode, {
            name: 'المراجعة المتباعدة',
            icon: '🔄',
            description: 'راجع الكلمات بنظام التكرار المتباعد الذكي',
            containerId: 'review-mode-container',
            dependencies: ['reviewSystem'],
            version: '2.0.0'
        });
        
        console.log('🔄 Review Mode registered successfully');
    }
});

// Export for direct use
window.ReviewMode = ReviewMode;