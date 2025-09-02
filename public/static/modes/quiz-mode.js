// 🎯 Quiz Learning Mode - Containerized
// Independent, self-contained quiz learning system

class QuizMode extends LearningModeBase {
    constructor(config = {}) {
        super(config);
        
        // Quiz-specific properties
        this.words = [];
        this.currentIndex = 0;
        this.responses = [];
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.currentOptions = [];
        
        // Quiz settings
        this.settings = {
            optionsCount: 4,
            showFeedback: true,
            autoAdvance: true,
            enableTTS: true,
            shuffleOptions: true,
            timeLimit: null, // No time limit by default
            ...this.options.settings
        };
        
        // Timer properties
        this.timeRemaining = null;
        this.timerInterval = null;
        
        console.log('🎯 Quiz Mode container created');
    }
    
    /**
     * Initialize quiz mode
     */
    async init() {
        try {
            // Validate required data
            this.validateData(['words', 'category']);
            
            // Setup quiz data
            this.words = [...this.data.words];
            this.shuffleWords();
            
            // Initialize state
            this.updateState({
                totalWords: this.words.length,
                currentIndex: 0,
                correct: 0,
                incorrect: 0,
                accuracy: 0
            });
            
            // Setup timer if enabled
            if (this.settings.timeLimit) {
                this.timeRemaining = this.settings.timeLimit;
            }
            
            console.log(`🎯 Quiz mode initialized with ${this.words.length} words`);
            
        } catch (error) {
            console.error('❌ Failed to initialize quiz mode:', error);
            throw error;
        }
    }
    
    /**
     * Render quiz interface
     */
    render() {
        if (!this.container) {
            throw new Error('Container not available for quiz mode');
        }
        
        this.clearContainer();
        
        // Create main quiz interface
        const quizInterface = this.createElement('div', ['quiz-mode-interface'], {}, `
            ${this.renderProgressSection()}
            <div class="quiz-container-wrapper">
                ${this.renderQuizQuestion()}
            </div>
            ${this.renderControls()}
        `);
        
        this.appendToContainer(quizInterface);
        
        // Setup quiz-specific event listeners
        this.setupQuizEvents();
        
        // Start timer if enabled
        if (this.settings.timeLimit) {
            this.startTimer();
        }
        
        // Auto-pronounce question if enabled
        if (this.settings.enableTTS && window.turkishTTS && window.turkishTTS.settings.autoPlay) {
            this.pronounceCurrentWord();
        }
    }
    
    /**
     * Render progress section
     */
    renderProgressSection() {
        const progress = this.state.totalWords > 0 ? (this.currentIndex / this.state.totalWords) * 100 : 0;
        
        // Check if session information is available
        const sessionInfo = this.data.sessionInfo;
        let progressText = `السؤال ${this.currentIndex + 1} من ${this.state.totalWords}`;
        let categoryText = this.getCategoryName();
        
        if (sessionInfo) {
            progressText = `السؤال ${this.currentIndex + 1} من ${sessionInfo.wordsInSession}`;
            categoryText = `الجلسة ${sessionInfo.sessionNumber} من ${sessionInfo.totalSessions} • ${this.getCategoryName()}`;
        }
        
        return `
            <div class="quiz-progress-section">
                <div class="quiz-progress-info">
                    <div class="progress-text">${progressText}</div>
                    <div class="category-text">${categoryText}</div>
                </div>
                <div class="quiz-progress-bar">
                    <div class="quiz-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="quiz-stats">
                    <span class="correct-count">✅ ${this.state.correct}</span>
                    <span class="incorrect-count">❌ ${this.state.incorrect}</span>
                    <span class="accuracy">📊 ${Math.round(this.state.accuracy)}%</span>
                    ${this.settings.timeLimit ? `<span class="timer">⏱️ ${this.formatTime(this.timeRemaining)}</span>` : ''}
                </div>
            </div>
        `;
    }
    
    /**
     * Render quiz question
     */
    renderQuizQuestion() {
        const currentWord = this.getCurrentWord();
        if (!currentWord) {
            return '<div class="no-words-message">لا توجد أسئلة متاحة</div>';
        }
        
        // Generate options for this question
        this.currentOptions = this.generateOptions(currentWord);
        
        return `
            <div class="quiz-question-container">
                <div class="quiz-question">
                    <div class="question-header">
                        <h3>ما معنى هذه الكلمة؟</h3>
                    </div>
                    
                    <div class="quiz-word-section">
                        <div class="quiz-word-container">
                            <div class="quiz-word-icon">
                                ${this.getWordIcon(currentWord)}
                            </div>
                            <div class="quiz-word-content">
                                <div class="quiz-word">${currentWord.turkish}</div>
                                <div class="quiz-pronunciation">[${currentWord.pronunciation}]</div>
                            </div>
                        </div>
                        <div class="tts-controls">
                            <button class="tts-btn tts-question-btn" data-action="speak-word" title="استمع للكلمة">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="quiz-instruction">
                        <p>اختر الترجمة الصحيحة:</p>
                    </div>
                </div>
                
                <div class="quiz-options-container">
                    ${this.renderOptions()}
                </div>
                
                ${this.isAnswered ? this.renderFeedback() : ''}
            </div>
        `;
    }
    
    /**
     * Render quiz options
     */
    renderOptions() {
        return this.currentOptions.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            let optionClass = 'quiz-option';
            
            if (this.isAnswered) {
                if (option.isCorrect) {
                    optionClass += ' correct';
                } else if (option.text === this.selectedAnswer && !option.isCorrect) {
                    optionClass += ' incorrect';
                }
            }
            
            return `
                <button class="${optionClass}" 
                        data-option="${option.text}" 
                        data-correct="${option.isCorrect}"
                        data-index="${index}"
                        ${this.isAnswered ? 'disabled' : ''}>
                    <span class="option-letter">${letter}</span>
                    <span class="option-text">${option.text}</span>
                </button>
            `;
        }).join('');
    }
    
    /**
     * Render feedback after answer
     */
    renderFeedback() {
        const currentWord = this.getCurrentWord();
        const isCorrect = this.selectedAnswer === currentWord.arabic;
        
        return `
            <div class="quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="feedback-header">
                    <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    <span>${isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}</span>
                </div>
                
                <div class="feedback-content">
                    <div class="correct-answer">
                        <strong>الإجابة الصحيحة:</strong> ${currentWord.arabic}
                    </div>
                    
                    ${currentWord.example ? `
                        <div class="example-sentence">
                            <strong>مثال:</strong>
                            <div class="turkish-example">${currentWord.example}</div>
                            <div class="arabic-example">${currentWord.exampleArabic || ''}</div>
                            <button class="tts-btn tts-example-btn" data-action="speak-sentence" title="استمع للمثال">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    /**
     * Render control buttons
     */
    renderControls() {
        return `
            <div class="quiz-controls">
                <button class="quiz-control-btn" data-action="previous" ${this.currentIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                    <span>السابق</span>
                </button>
                
                <button class="quiz-control-btn hint-btn" data-action="hint" ${this.isAnswered ? 'disabled' : ''}>
                    <i class="fas fa-lightbulb"></i>
                    <span>تلميح</span>
                </button>
                
                <button class="quiz-control-btn next-btn" data-action="next" 
                        ${!this.isAnswered || this.currentIndex >= this.words.length - 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                    <span>التالي</span>
                </button>
            </div>
        `;
    }
    
    /**
     * Setup quiz-specific event listeners
     */
    setupQuizEvents() {
        if (!this.container) return;
        
        // Unified event delegation
        this.container.addEventListener('click', (event) => {
            event.stopPropagation();
            
            const action = event.target.closest('[data-action]')?.getAttribute('data-action');
            const option = event.target.closest('[data-option]');
            
            if (action) {
                this.handleAction(action, event);
            } else if (option && !this.isAnswered) {
                this.selectOption(option);
            }
        });
    }
    
    /**
     * Handle action button clicks
     */
    handleAction(action, event) {
        switch (action) {
            case 'previous':
                this.previousQuestion();
                break;
            case 'next':
                this.nextQuestion();
                break;
            case 'hint':
                this.showHint();
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
     * Select an option
     */
    selectOption(optionElement) {
        if (this.isAnswered) return;
        
        const selectedText = optionElement.getAttribute('data-option');
        const isCorrect = optionElement.getAttribute('data-correct') === 'true';
        const currentWord = this.getCurrentWord();
        
        // Record selection
        this.selectedAnswer = selectedText;
        this.isAnswered = true;
        
        // Record response
        const response = {
            wordId: currentWord.id,
            word: currentWord.turkish,
            selectedAnswer: selectedText,
            correctAnswer: currentWord.arabic,
            isCorrect: isCorrect,
            timestamp: Date.now(),
            mode: 'quiz',
            timeToAnswer: this.settings.timeLimit ? (this.settings.timeLimit - this.timeRemaining) : null
        };
        
        this.responses.push(response);
        
        // Update state
        if (isCorrect) {
            this.updateState({ correct: this.state.correct + 1 });
        } else {
            this.updateState({ incorrect: this.state.incorrect + 1 });
        }
        
        // Update accuracy
        const totalAnswered = this.state.correct + this.state.incorrect;
        const accuracy = totalAnswered > 0 ? (this.state.correct / totalAnswered) * 100 : 0;
        this.updateState({ accuracy });
        
        // Update metrics
        this.metrics.interactions++;
        this.metrics.accuracy = accuracy / 100;
        
        // Update review system
        if (window.reviewSystem) {
            window.reviewSystem.updateWordReview(currentWord.id, isCorrect);
        }
        
        // Stop timer for this question
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Re-render to show feedback
        this.render();
        
        // Update progress
        this.updateProgress({
            wordId: currentWord.id,
            isCorrect,
            accuracy: this.metrics.accuracy
        });
        
        // Auto-advance if enabled
        if (this.settings.autoAdvance) {
            setTimeout(() => {
                if (this.currentIndex < this.words.length - 1) {
                    this.nextQuestion();
                } else {
                    this.completeSession();
                }
            }, 2000);
        }
        
        this.trackEvent('question_answered', {
            wordId: currentWord.id,
            isCorrect,
            timeToAnswer: response.timeToAnswer
        });
    }
    
    /**
     * Move to next question
     */
    nextQuestion() {
        if (this.currentIndex < this.words.length - 1) {
            this.currentIndex++;
            this.selectedAnswer = null;
            this.isAnswered = false;
            
            // Reset timer
            if (this.settings.timeLimit) {
                this.timeRemaining = this.settings.timeLimit;
            }
            
            this.updateState({ currentIndex: this.currentIndex });
            this.render();
            this.trackEvent('question_advanced', { newIndex: this.currentIndex });
        }
    }
    
    /**
     * Move to previous question
     */
    previousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.selectedAnswer = null;
            this.isAnswered = false;
            
            // Reset timer
            if (this.settings.timeLimit) {
                this.timeRemaining = this.settings.timeLimit;
            }
            
            this.updateState({ currentIndex: this.currentIndex });
            this.render();
            this.trackEvent('question_previous', { newIndex: this.currentIndex });
        }
    }
    
    /**
     * Show hint for current question
     */
    showHint() {
        const currentWord = this.getCurrentWord();
        if (!currentWord) return;
        
        const hintContent = `
            <div style="text-align: right; line-height: 1.6;">
                <h4>💡 تلميح</h4>
                ${currentWord.example ? `
                    <p><strong>مثال:</strong></p>
                    <p style="font-style: italic; color: #555;">${currentWord.example}</p>
                    ${currentWord.exampleArabic ? `
                        <p style="color: #007acc;">${currentWord.exampleArabic}</p>
                    ` : ''}
                ` : ''}
                <p><strong>نصيحة:</strong></p>
                <p>ابحث عن الكلمة التي تبدأ بالحرف "${currentWord.arabic.charAt(0)}"</p>
            </div>
        `;
        
        this.showModal('تلميح', hintContent);
        this.trackEvent('hint_requested', { wordId: currentWord.id });
    }
    
    /**
     * Generate quiz options
     */
    generateOptions(correctWord) {
        const options = [{ text: correctWord.arabic, isCorrect: true }];
        
        // Get wrong options from other words
        const otherWords = this.words.filter(word => 
            word.id !== correctWord.id && word.arabic !== correctWord.arabic
        );
        
        // Add random wrong options
        const wrongOptionsNeeded = this.settings.optionsCount - 1;
        const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < wrongOptionsNeeded && i < shuffledOthers.length; i++) {
            options.push({ text: shuffledOthers[i].arabic, isCorrect: false });
        }
        
        // Fill with generic wrong options if needed
        const genericWrongs = ['خيار خاطئ', 'إجابة غير صحيحة', 'ليس صحيحاً'];
        while (options.length < this.settings.optionsCount) {
            const genericOption = genericWrongs[options.length - 1] || `خيار ${options.length}`;
            options.push({ text: genericOption, isCorrect: false });
        }
        
        // Shuffle options if enabled
        if (this.settings.shuffleOptions) {
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }
        }
        
        return options;
    }
    
    /**
     * Start question timer
     */
    startTimer() {
        if (!this.settings.timeLimit || this.timerInterval) return;
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            
            // Update timer display
            const timerElement = this.container.querySelector('.timer');
            if (timerElement) {
                timerElement.textContent = `⏱️ ${this.formatTime(this.timeRemaining)}`;
            }
            
            // Time's up
            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimeUp();
            }
        }, 1000);
    }
    
    /**
     * Handle time up
     */
    handleTimeUp() {
        if (this.isAnswered) return;
        
        // Auto-select wrong answer to mark as incorrect
        this.selectedAnswer = 'لم يتم الإجابة في الوقت المحدد';
        this.isAnswered = true;
        
        const currentWord = this.getCurrentWord();
        const response = {
            wordId: currentWord.id,
            word: currentWord.turkish,
            selectedAnswer: this.selectedAnswer,
            correctAnswer: currentWord.arabic,
            isCorrect: false,
            timestamp: Date.now(),
            mode: 'quiz',
            timeUp: true
        };
        
        this.responses.push(response);
        
        // Update state
        this.updateState({ incorrect: this.state.incorrect + 1 });
        
        // Re-render to show timeout feedback
        this.render();
        
        this.showNotification('انتهى الوقت! ⏰', 'warning');
        this.trackEvent('question_timeout', { wordId: currentWord.id });
        
        // Auto-advance after showing timeout
        setTimeout(() => {
            if (this.currentIndex < this.words.length - 1) {
                this.nextQuestion();
            } else {
                this.completeSession();
            }
        }, 2000);
    }
    
    /**
     * Format time in MM:SS
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
     * Complete quiz session
     */
    completeSession() {
        const accuracy = this.responses.length > 0 ? 
            (this.responses.filter(r => r.isCorrect).length / this.responses.length) * 100 : 0;
        
        const sessionStats = {
            mode: 'quiz',
            category: this.data.category,
            totalQuestions: this.words.length,
            answered: this.responses.length,
            correct: this.state.correct,
            incorrect: this.state.incorrect,
            accuracy: Math.round(accuracy),
            timeSpent: Math.round((Date.now() - this.startTime) / 1000 / 60),
            responses: this.responses
        };
        
        // Clear any active timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
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
        const grade = this.calculateGrade(stats.accuracy);
        
        const completionHTML = `
            <div class="quiz-completion">
                <div class="completion-header">
                    <div class="grade-display ${grade.class}">
                        <div class="grade-letter">${grade.letter}</div>
                        <div class="grade-percentage">${stats.accuracy}%</div>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">${grade.message}</h2>
                    <p class="text-gray-600">اختبار فئة: ${this.getCategoryName()}</p>
                </div>
                
                <div class="completion-stats">
                    <div class="stat-row">
                        <span class="stat-label">إجمالي الأسئلة:</span>
                        <span class="stat-value">${stats.totalQuestions}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">الإجابات الصحيحة:</span>
                        <span class="stat-value correct-text">${stats.correct}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">الإجابات الخاطئة:</span>
                        <span class="stat-value incorrect-text">${stats.incorrect}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">الوقت المستغرق:</span>
                        <span class="stat-value">${stats.timeSpent} دقيقة</span>
                    </div>
                </div>
                
                <div class="completion-actions">
                    <button class="btn-action btn-primary" data-action="restart">
                        <i class="fas fa-redo"></i>
                        إعادة الاختبار
                    </button>
                    <button class="btn-action btn-secondary" data-action="review-mistakes">
                        <i class="fas fa-exclamation-triangle"></i>
                        مراجعة الأخطاء
                    </button>
                    <button class="btn-action btn-secondary" data-action="flashcard">
                        <i class="fas fa-cards-blank"></i>
                        وضع البطاقات
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
                case 'review-mistakes':
                    this.reviewMistakes();
                    break;
                case 'flashcard':
                    this.switchToFlashcard();
                    break;
                case 'home':
                    this.goHome();
                    break;
            }
        });
    }
    
    /**
     * Calculate grade based on accuracy
     */
    calculateGrade(accuracy) {
        if (accuracy >= 90) {
            return { letter: 'A', class: 'grade-a', message: 'ممتاز! أداء رائع! 🎉' };
        } else if (accuracy >= 80) {
            return { letter: 'B', class: 'grade-b', message: 'جيد جداً! 👏' };
        } else if (accuracy >= 70) {
            return { letter: 'C', class: 'grade-c', message: 'جيد، يمكنك تحسين أدائك 👍' };
        } else if (accuracy >= 60) {
            return { letter: 'D', class: 'grade-d', message: 'مقبول، استمر في التدريب 📚' };
        } else {
            return { letter: 'F', class: 'grade-f', message: 'تحتاج للمزيد من المراجعة 💪' };
        }
    }
    
    /**
     * Restart quiz session
     */
    async restart() {
        this.currentIndex = 0;
        this.responses = [];
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.shuffleWords();
        
        // Reset state
        this.updateState({
            currentIndex: 0,
            correct: 0,
            incorrect: 0,
            accuracy: 0
        });
        
        this.render();
        this.trackEvent('session_restarted');
    }
    
    /**
     * Review mistakes
     */
    reviewMistakes() {
        const wrongAnswers = this.responses.filter(r => !r.isCorrect);
        
        if (wrongAnswers.length === 0) {
            this.showNotification('ممتاز! لم ترتكب أي أخطاء! 🎉', 'success');
            return;
        }
        
        // Create review data with only wrong answers
        const reviewWords = wrongAnswers.map(response => 
            this.words.find(word => word.id === response.wordId)
        ).filter(Boolean);
        
        if (this.manager) {
            this.manager.switchMode('review', {
                words: reviewWords,
                category: this.data.category,
                type: 'mistakes',
                previousMode: 'quiz'
            });
        }
    }
    
    /**
     * Switch to flashcard mode
     */
    switchToFlashcard() {
        if (this.manager) {
            this.manager.switchMode('flashcard', {
                words: this.words,
                category: this.data.category,
                previousMode: 'quiz'
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
     * Cleanup quiz mode
     */
    async cleanup() {
        // Clear timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Stop any ongoing TTS
        if (window.turkishTTS) {
            window.turkishTTS.stop();
        }
        
        console.log('🎯 Quiz mode cleaned up');
    }
    
    /**
     * Handle key press events
     */
    handleKeyPress(event) {
        super.handleKeyPress(event);
        
        // Quiz-specific keyboard shortcuts
        if (!this.isAnswered) {
            switch (event.key.toLowerCase()) {
                case 'a':
                case '1':
                    event.preventDefault();
                    this.selectOptionByIndex(0);
                    break;
                case 'b':
                case '2':
                    event.preventDefault();
                    this.selectOptionByIndex(1);
                    break;
                case 'c':
                case '3':
                    event.preventDefault();
                    this.selectOptionByIndex(2);
                    break;
                case 'd':
                case '4':
                    event.preventDefault();
                    this.selectOptionByIndex(3);
                    break;
            }
        }
        
        // Navigation shortcuts
        switch (event.key.toLowerCase()) {
            case 'arrowleft':
                event.preventDefault();
                this.previousQuestion();
                break;
            case 'arrowright':
                event.preventDefault();
                if (this.isAnswered) {
                    this.nextQuestion();
                }
                break;
        }
    }
    
    /**
     * Select option by index using keyboard
     */
    selectOptionByIndex(index) {
        const optionButtons = this.container.querySelectorAll('.quiz-option');
        if (optionButtons[index] && !this.isAnswered) {
            this.selectOption(optionButtons[index]);
        }
    }
    
    /**
     * Get help content for quiz mode
     */
    getHelpContent() {
        return `
            <div style="text-align: right; line-height: 1.6;">
                <h4>🎯 نمط الاختبار</h4>
                <p><strong>كيفية الاستخدام:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>اقرأ الكلمة التركية واستمع لنطقها</li>
                    <li>اختر الترجمة الصحيحة من الخيارات المتاحة</li>
                    <li>استخدم زر التلميح إذا كنت محتاراً</li>
                    <li>استخدم الأسهم للتنقل بين الأسئلة</li>
                </ul>
                <p><strong>اختصارات لوحة المفاتيح:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>A/1، B/2، C/3، D/4: اختيار الإجابة</li>
                    <li>← →: التنقل بين الأسئلة</li>
                    <li>Ctrl+H: عرض المساعدة</li>
                    <li>Escape: الخروج من النمط</li>
                </ul>
                ${this.settings.timeLimit ? `
                    <p><strong>⏰ وضع الوقت المحدود:</strong></p>
                    <p>لديك ${this.settings.timeLimit} ثانية للإجابة على كل سؤال</p>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Get SVG icon for the current word
     */
    getWordIcon(word) {
        if (window.wordSVGIcons) {
            return window.wordSVGIcons.getIconForWord(word);
        }
        
        // Fallback to emoji if SVG icons are not available
        if (word.emoji) {
            return `<div class="word-emoji">${word.emoji}</div>`;
        }
        
        // Default fallback icon
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`;
    }
}

// Register quiz mode with the manager when loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.learningModeManager) {
        window.learningModeManager.registerMode('quiz', QuizMode, {
            name: 'الاختبارات التفاعلية',
            icon: '🎯',
            description: 'اختبر معرفتك بالكلمات التركية',
            containerId: 'quiz-mode-container',
            dependencies: [],
            version: '2.0.0'
        });
        
        console.log('🎯 Quiz Mode registered successfully');
    }
});

// Export for direct use
window.QuizMode = QuizMode;