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
        if (this.settings.enableTTS && window.turkishTTS) {
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
            <div class="quiz-main-layout">
                <!-- Left Column: Word Card -->
                <div class="quiz-word-card">
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
                </div>
                
                <!-- Right Column: Quiz Options -->
                <div class="quiz-options-column">
                    <div class="question-header">
                        <h3 style="text-align: center; margin-bottom: 25px; font-size: 24px; color: #1E293B;">اختر الترجمة الصحيحة:</h3>
                    </div>
                    
                    <div class="quiz-options-container">
                        ${this.renderOptions()}
                    </div>
                </div>
            </div>
            
            ${this.isAnswered ? this.renderFeedback() : ''}
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
        const isPreviousDisabled = this.currentIndex === 0;
        const isHintDisabled = this.isAnswered;
        const isNextDisabled = !this.isAnswered || this.currentIndex >= this.words.length - 1;
        
        return `
            <div class="quiz-controls">
                <button class="quiz-control-btn" 
                        data-action="previous" 
                        ${isPreviousDisabled ? 'disabled' : ''}
                        title="${isPreviousDisabled ? 'لا يوجد سؤال سابق' : 'العودة للسؤال السابق'}"
                        aria-label="السؤال السابق">
                    <i class="fas fa-chevron-left"></i>
                    <span>السابق</span>
                </button>
                
                <button class="quiz-control-btn hint-btn" 
                        data-action="hint" 
                        ${isHintDisabled ? 'disabled' : ''}
                        title="${isHintDisabled ? 'التلميح غير متاح بعد الإجابة' : 'احصل على تلميح للسؤال الحالي'}"
                        aria-label="طلب تلميح">
                    <i class="fas fa-lightbulb"></i>
                    <span>تلميح</span>
                </button>
                
                <button class="quiz-control-btn next-btn" 
                        data-action="next"
                        ${isNextDisabled ? 'disabled' : ''}
                        title="${isNextDisabled ? (this.currentIndex >= this.words.length - 1 ? 'آخر سؤال في الاختبار' : 'يجب الإجابة أولاً') : 'الانتقال للسؤال التالي'}"
                        aria-label="السؤال التالي">
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
            responses: this.responses,
            sessionInfo: this.data.sessionInfo // Include session information
        };
        
        // Clear any active timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Mark session as completed BEFORE showing completion screen
        if (this.data.sessionInfo) {
            this.markSessionCompleted(this.data.sessionInfo);
        }
        
        // 🔄 REAL-TIME DASHBOARD INTEGRATION
        try {
            // Calculate session statistics for dashboard
            const duration = Date.now() - this.startTime;
            
            // Determine new words learned (words answered correctly for first time)
            const newWordsLearned = this.responses.filter(response => {
                const word = this.words.find(w => w.id === response.wordId);
                return response.isCorrect && word && !this.hasWordBeenLearnedBefore(word);
            }).length;
            
            // Create comprehensive session data for dashboard
            const dashboardSessionData = {
                mode: 'quiz',
                category: this.data.category,
                wordsCompleted: this.responses.length,
                correctAnswers: this.state.correct,
                accuracy: accuracy,
                duration: duration,
                newWordsLearned: newWordsLearned,
                bonusXP: this.calculateBonusXP(accuracy),
                responses: this.responses,
                timestamp: Date.now()
            };
            
            console.log('📊 Quiz session completed - Dashboard data:', dashboardSessionData);
            
            // Emit session completion event for dashboard
            const completionEvent = new CustomEvent('sessionCompleted', {
                detail: dashboardSessionData
            });
            document.dispatchEvent(completionEvent);
            
            // Update real-time dashboard if available
            if (window.dashboardRealTime) {
                window.dashboardRealTime.updateProgress(dashboardSessionData);
            }
            
            // Track individual word learning events for accuracy
            this.responses.forEach(response => {
                // Track answer submission for accuracy calculation
                const answerEvent = new CustomEvent('answerSubmitted', {
                    detail: {
                        isCorrect: response.isCorrect,
                        mode: 'quiz',
                        category: this.data.category
                    }
                });
                document.dispatchEvent(answerEvent);
                
                // Track word learning for correct answers
                if (response.isCorrect) {
                    const word = this.words.find(w => w.id === response.wordId);
                    if (word) {
                        const wordEvent = new CustomEvent('wordLearned', {
                            detail: {
                                word: word,
                                mode: 'quiz',
                                category: this.data.category,
                                isNew: !this.hasWordBeenLearnedBefore(word)
                            }
                        });
                        document.dispatchEvent(wordEvent);
                    }
                }
            });
            
        } catch (error) {
            console.error('⚠️ Error updating dashboard:', error);
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
        
        // Check if there are more sessions available
        const sessionInfo = stats.sessionInfo;
        const hasNextSession = sessionInfo && sessionInfo.sessionNumber < sessionInfo.totalSessions;
        
        const completionHTML = `
            <div class="quiz-completion">
                <div class="completion-header">
                    <div class="grade-display ${grade.class}">
                        <div class="grade-letter">${grade.letter}</div>
                        <div class="grade-percentage">${stats.accuracy}%</div>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">${grade.message}</h2>
                    <p class="text-gray-600">اختبار فئة: ${this.getCategoryName()}</p>
                    ${sessionInfo ? `<p class="text-gray-500">الجلسة ${sessionInfo.sessionNumber} من ${sessionInfo.totalSessions}</p>` : ''}
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
                    ${hasNextSession ? `
                        <button class="btn-action btn-primary" data-action="new-session">
                            <i class="fas fa-forward"></i>
                            الجلسة التالية
                        </button>
                    ` : `
                        <button class="btn-action btn-primary" data-action="new-session">
                            <i class="fas fa-play"></i>
                            جلسة جديدة
                        </button>
                    `}
                    <button class="btn-action btn-secondary" data-action="restart">
                        <i class="fas fa-redo"></i>
                        إعادة نفس الاختبار
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
                case 'new-session':
                    this.startNewSession();
                    break;
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
     * Start a new quiz session with fresh words
     */
    async startNewSession() {
        try {
            // Track the event
            this.trackEvent('new_session_started', {
                previousAccuracy: this.state.accuracy,
                category: this.data.category
            });
            
            // Mark current session as completed first
            if (this.data.sessionInfo) {
                this.markSessionCompleted(this.data.sessionInfo);
            }
            
            // Check if we have session information for progression
            const sessionInfo = this.data.sessionInfo;
            if (!sessionInfo) {
                console.log('⚠️ No session info available, starting fresh quiz...');
                this.startFreshQuiz();
                return;
            }
            
            // Check if there are more sessions in this category
            if (sessionInfo.sessionNumber >= sessionInfo.totalSessions) {
                // No more sessions in this category
                this.showCategoryCompletionScreen();
                return;
            }
            
            // Get next session using the same approach as flashcard mode
            const nextSessionNumber = sessionInfo.sessionNumber + 1;
            const categoryId = sessionInfo.categoryId;
            const categoryData = window.enhancedVocabularyData[categoryId];
            
            if (!categoryData || !categoryData.sessions || !categoryData.sessions[nextSessionNumber - 1]) {
                console.error(`❌ Data for next session (Category: ${categoryId}, Session: ${nextSessionNumber}) not found.`);
                this.showNotification('خطأ في تحميل الجلسة التالية', 'error');
                return;
            }
            
            const nextSession = categoryData.sessions[nextSessionNumber - 1];
            console.log(`🎯 Found next session: ${nextSession.id} (Session ${nextSession.sessionNumber})`);
            
            // Prepare learning data using the same format as flashcard mode
            const learningData = {
                words: nextSession.words,
                category: {
                    id: categoryId,
                    name: categoryData.nameArabic || categoryData.name,
                    ...categoryData
                },
                categoryId: categoryId,
                sessionInfo: {
                    sessionId: nextSession.id,
                    sessionNumber: nextSession.sessionNumber,
                    totalSessions: categoryData.sessions.length,
                    categoryId: categoryId,
                    wordsInSession: nextSession.words.length
                },
                session: nextSession
            };
            
            // Start with the next session using learning mode manager
            if (this.manager) {
                await this.manager.startMode('quiz', learningData);
                return;
            } else {
                console.error('❌ Learning Mode Manager not available');
                this.showNotification('خطأ: مدير نمط التعلم غير متوفر', 'error');
            }
            
            // Fallback: Get fresh words from the full category data
            this.startFreshQuiz();
            
        } catch (error) {
            console.error('❌ Error starting new session:', error);
            this.showNotification('خطأ في بدء جلسة جديدة', 'error');
            
            // Fallback to restart
            this.restart();
        }
    }
    
    /**
     * Show category completion celebration screen
     */
    showCategoryCompletionScreen() {
        this.showNotification('🎉 تهانينا! لقد أكملت جميع جلسات هذه الفئة!', 'success');
        
        const completionHTML = `
            <div class="category-completion-screen">
                <div class="completion-celebration">
                    <div class="trophy-icon">🏆</div>
                    <h2>تهانينا! فئة مكتملة</h2>
                    <p>لقد أكملت بنجاح جميع جلسات فئة ${this.getCategoryName()}</p>
                </div>
                
                <div class="completion-actions">
                    <button class="btn-primary" onclick="this.goHome()">
                        <i class="fas fa-home"></i>
                        العودة للرئيسية
                    </button>
                    <button class="btn-secondary" onclick="this.chooseDifferentCategory()">
                        <i class="fas fa-list"></i>
                        اختيار فئة أخرى
                    </button>
                </div>
            </div>
        `;
        
        this.clearContainer();
        this.container.innerHTML = completionHTML;
    }
    
    /**
     * Start a fresh quiz with random words from category
     */
    startFreshQuiz() {
        try {
            if (window.enhancedVocabularyData && this.data.category) {
                const categoryData = window.enhancedVocabularyData[this.data.category];
                
                if (categoryData && categoryData.words && categoryData.words.length > 0) {
                    // Get all words from category
                    const allCategoryWords = [...categoryData.words];
                    
                    // Shuffle the full word list
                    this.shuffleArray(allCategoryWords);
                    
                    // Select a random subset (same size as current session or 10 words)
                    const sessionSize = Math.min(this.words.length || 10, allCategoryWords.length);
                    const newWords = allCategoryWords.slice(0, sessionSize);
                    
                    // Update quiz with new words
                    this.words = newWords;
                    this.resetSessionData();
                    this.render();
                    
                    this.showNotification(`تم بدء جلسة جديدة مع ${newWords.length} كلمة جديدة من فئة ${this.getCategoryName()}! 🎆`, 'success');
                    return;
                }
            }
            
            // Final fallback: restart with shuffled existing words
            this.resetSessionData();
            this.shuffleWords();
            this.render();
            
            this.showNotification('تم بدء جلسة جديدة! 🎆', 'success');
            
        } catch (error) {
            console.error('❌ Error starting fresh quiz:', error);
            this.showNotification('خطأ في بدء جلسة جديدة', 'error');
            
            // Fallback to restart
            this.restart();
        }
    }
    
    /**
     * Utility method to shuffle any array
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    /**
     * Reset session data for new session
     */
    resetSessionData() {
        this.currentIndex = 0;
        this.responses = [];
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.startTime = Date.now();
        
        // Reset state with updated word count
        this.updateState({
            totalWords: this.words.length,
            currentIndex: 0,
            correct: 0,
            incorrect: 0,
            accuracy: 0
        });
        
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Reset timer if time limit is enabled
        if (this.settings.timeLimit) {
            this.timeRemaining = this.settings.timeLimit * 60;
            this.startTimer();
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
     * Mark session as completed and save progress
     */
    markSessionCompleted(sessionInfo) {
        try {
            // Get existing progress
            let progress = JSON.parse(localStorage.getItem('turkishLearningProgress') || '{}');
            
            // Initialize structure if needed
            if (!progress.categoryProgress) {
                progress.categoryProgress = {};
            }
            if (!progress.categoryProgress[sessionInfo.categoryId]) {
                progress.categoryProgress[sessionInfo.categoryId] = {
                    completedSessions: [],
                    currentSession: null
                };
            }
            
            // Mark session as completed
            const completedSessions = progress.categoryProgress[sessionInfo.categoryId].completedSessions;
            if (!completedSessions.includes(sessionInfo.sessionId)) {
                completedSessions.push(sessionInfo.sessionId);
            }
            
            localStorage.setItem('turkishLearningProgress', JSON.stringify(progress));
            
            console.log(`✅ Session ${sessionInfo.sessionNumber} marked as completed for ${sessionInfo.categoryId}`);
            
        } catch (error) {
            console.error('❌ Error marking session as completed:', error);
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
     * Check if a word has been learned before (for tracking new words)
     */
    hasWordBeenLearnedBefore(word) {
        try {
            const wordProgress = JSON.parse(localStorage.getItem('wordProgress') || '{}');
            return wordProgress[word.id] && wordProgress[word.id].correct > 0;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Calculate bonus XP based on accuracy
     */
    calculateBonusXP(accuracy) {
        if (accuracy >= 95) return 50;  // Perfect score bonus
        if (accuracy >= 90) return 30;  // Excellent bonus
        if (accuracy >= 80) return 20;  // Good bonus
        if (accuracy >= 70) return 10;  // Decent bonus
        return 0;  // No bonus
    }
    
    /**
     * Get SVG icon for the current word - Enhanced with better loading detection
     */
    getWordIcon(word) {
        console.log('🎨 Getting icon for quiz word:', word.turkish, '- ID:', word.id);
        
        // Enhanced check for WordSVGIcons availability
        const checkWordSVGIcons = () => {
            return window.wordSVGIcons && 
                   typeof window.wordSVGIcons.getIconForWord === 'function' &&
                   window.WordSVGIcons;
        };
        
        // If not available, try to initialize
        if (!checkWordSVGIcons() && window.WordSVGIcons) {
            console.log('🔧 Initializing wordSVGIcons for quiz mode...');
            try {
                window.wordSVGIcons = new window.WordSVGIcons();
                console.log('✅ wordSVGIcons initialized successfully for quiz');
            } catch (error) {
                console.warn('❌ Failed to initialize wordSVGIcons:', error);
            }
        }
        
        // PRIORITY 1: Use word-specific SVG icons
        if (checkWordSVGIcons()) {
            try {
                const svgIcon = window.wordSVGIcons.getIconForWord(word);
                if (svgIcon && svgIcon.trim()) {
                    console.log('✅ Using word-specific SVG icon for quiz:', word.turkish);
                    return `<div class="quiz-word-icon-svg" style="width: 64px; height: 64px; color: #4F46E5; display: flex; align-items: center; justify-content: center;">${svgIcon}</div>`;
                } else {
                    console.log('⚠️ No word-specific SVG icon found for quiz:', word.turkish);
                }
            } catch (error) {
                console.warn('❌ Error getting word-specific icon for quiz', word.turkish, ':', error);
            }
        } else {
            console.log('❌ wordSVGIcons system not available for quiz mode');
            console.log('Debug - window.wordSVGIcons:', !!window.wordSVGIcons);
            console.log('Debug - window.WordSVGIcons:', !!window.WordSVGIcons);
        }
        
        // PRIORITY 2: Try to get word-specific icons from enhanced vocabulary data
        if (window.enhancedVocabularyData && this.data.category) {
            try {
                const categoryData = Object.values(window.enhancedVocabularyData)
                    .find(cat => cat.id === this.data.category || cat.name === this.data.category);
                
                if (categoryData && categoryData.words) {
                    const wordData = categoryData.words.find(w => w.id === word.id || w.turkish === word.turkish);
                    if (wordData && wordData.emoji) {
                        console.log('✅ Using emoji from enhanced vocabulary for quiz:', word.turkish, '-', wordData.emoji);
                        return `<div class="quiz-word-emoji" style="font-size: 48px; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">${wordData.emoji}</div>`;
                    }
                }
            } catch (error) {
                console.warn('❌ Error getting emoji from enhanced vocabulary:', error);
            }
        }
        
        // PRIORITY 3: Fallback to word's own emoji if available
        if (word.emoji) {
            console.log('✅ Using word emoji for quiz:', word.turkish, '-', word.emoji);
            return `<div class="quiz-word-emoji" style="font-size: 48px; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">${word.emoji}</div>`;
        }
        
        // PRIORITY 4: Category-based generic icons
        const categoryIcons = {
            'greetings': '👋',
            'travel': '✈️', 
            'food': '🍽️',
            'shopping': '🛒',
            'directions': '🧭',
            'emergency': '🚨',
            'time': '⏰',
            'numbers': '🔢'
        };
        
        const categoryIcon = categoryIcons[this.data.category];
        if (categoryIcon) {
            console.log('✅ Using category icon for quiz:', word.turkish, '-', categoryIcon);
            return `<div class="quiz-category-emoji" style="font-size: 48px; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">${categoryIcon}</div>`;
        }
        
        // PRIORITY 5: Default fallback icon with enhanced styling
        console.log('⚠️ Using default fallback icon for quiz:', word.turkish);
        return `<div class="quiz-default-icon" style="width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 48px; height: 48px; color: #6B7280;">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
        </div>`;
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