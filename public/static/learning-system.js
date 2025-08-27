// Turkish Learning System - Interactive Learning with Flashcards and Quiz

// Learning Session Class - Manages the complete learning experience
function LearningSession(categoryData, mode = 'flashcard') {
    this.category = categoryData.category;
    this.words = categoryData.words || [];
    this.mode = mode; // 'flashcard' or 'quiz'
    this.currentIndex = 0;
    this.responses = [];
    this.startTime = Date.now();
    
    // Track learning progress
    this.correctAnswers = 0;
    this.totalAnswered = 0;
    
    // Prevent multiple simultaneous advances
    this.isAdvancing = false;
    
    this.init();
}

LearningSession.prototype = {
    init: function() {
        this.shuffleWords();
        this.renderSession();
        // bindEvents is called from renderSession via setupEventDelegation
    },
    
    shuffleWords: function() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
        }
    },
    
    renderSession: function() {
        const container = document.getElementById('learning-content');
        if (!container) return;
        
        container.innerHTML = `
            <div class="session-progress">
                <div class="session-info">
                    <span>الكلمة ${this.currentIndex + 1} من ${this.words.length}</span>
                    <span>الفئة: ${this.getCategoryName()}</span>
                </div>
                <div class="session-progress-bar">
                    <div class="session-progress-fill" style="width: ${(this.currentIndex / this.words.length) * 100}%"></div>
                </div>
            </div>
            
            <div class="learning-mode-container">
                ${this.mode === 'flashcard' ? this.renderFlashcard() : this.renderQuiz()}
            </div>
            

        `;
        
        this.updateProgress();
        
        // Set up event delegation for all interactions
        this.setupEventDelegation();
        
        // Auto-pronounce only Turkish word when flashcard first appears (front side)
        if (this.mode === 'flashcard' && window.turkishTTS && window.turkishTTS.settings.autoPlay) {
            const currentWord = this.words[this.currentIndex];
            if (currentWord && currentWord.turkish) {
                setTimeout(() => {
                    console.log('Auto-pronouncing word on card appearance:', currentWord.turkish);
                    window.speakTurkishWord(currentWord.turkish).catch(err => {
                        console.log('Auto-pronunciation failed:', err);
                    });
                }, 800); // Delay to allow card animation to complete
            }
        }
    },
    
    renderFlashcard: function() {
        const currentWord = this.words[this.currentIndex];
        if (!currentWord) return '<div>لا توجد كلمات متاحة</div>';
        
        // Check if example sentences are available
        const hasExample = currentWord.example && currentWord.exampleArabic;
        
        // Get icon (FontAwesome or emoji)
        const icon = currentWord.icon || 'fas fa-language';
        const emoji = currentWord.emoji || '📚';
        
        return `
            <div class="flashcard-container" id="flashcard-container">
                <div class="flashcard" id="flashcard">
                    <div class="flashcard-front">
                        <div class="flashcard-icon-container">
                            <div class="word-icon emoji">${emoji}</div>
                        </div>
                        <div class="flashcard-turkish">${currentWord.turkish}</div>
                        <div class="flashcard-pronunciation">[${currentWord.pronunciation}]</div>
                        <div class="tts-controls">
                            <button class="tts-btn tts-word-btn" onclick="window.speakTurkishWord('${currentWord.turkish.replace(/'/g, '\\\'')}')" title="استمع للكلمة">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        <div class="flashcard-hint">اضغط لرؤية الترجمة</div>
                    </div>
                    <div class="flashcard-back">
                        <div class="flashcard-icon-container">
                            <i class="${icon} word-icon"></i>
                        </div>
                        <div class="flashcard-arabic">${currentWord.arabic}</div>
                        <div class="flashcard-english">${currentWord.english}</div>
                        ${hasExample ? `
                        <div class="flashcard-examples">
                            <div class="example-divider">
                                <i class="fas fa-quote-left"></i>
                                <span>مثال</span>
                                <i class="fas fa-quote-right"></i>
                            </div>
                            <div class="flashcard-example-turkish">${currentWord.example}</div>
                            <div class="flashcard-example-arabic">${currentWord.exampleArabic}</div>
                            <div class="tts-controls" style="justify-content: center; margin: 0.5rem 0 0.25rem 0;">
                                <button class="tts-btn tts-sentence-btn" onclick="window.speakTurkishSentence('${currentWord.example.replace(/'/g, '\\\'')}')" title="استمع للمثال">
                                    <i class="fas fa-play"></i>
                                </button>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="flashcard-controls mt-4">
                <div class="difficulty-instruction" style="text-align: center; margin-top: 2rem; margin-bottom: 1rem;">
                    <p style="font-size: 1.1rem; color: var(--gray-600); font-weight: 500;">
                        كيف كانت صعوبة تذكر هذه الكلمة؟
                    </p>
                </div>
                <div class="difficulty-buttons" style="display: flex; justify-content: center; gap: 1.5rem; margin-top: 1rem;">
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
    },
    
    renderQuiz: function() {
        const currentWord = this.words[this.currentIndex];
        if (!currentWord) return '<div>لا توجد كلمات متاحة</div>';
        
        // Generate wrong options
        const wrongOptions = this.generateWrongOptions(currentWord);
        const allOptions = [...wrongOptions, currentWord.arabic];
        
        // Shuffle options
        for (let i = allOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
        }
        
        return `
            <div class="quiz-container">
                <div class="quiz-question">
                    <div class="quiz-word">${currentWord.turkish}</div>
                    <div class="quiz-pronunciation">[${currentWord.pronunciation}]</div>
                    <div class="quiz-instruction">اختر الترجمة الصحيحة:</div>
                </div>
                
                <div class="quiz-options">
                    ${allOptions.map((option, index) => `
                        <button class="quiz-option" data-option="${option}" data-correct="${option === currentWord.arabic}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    generateWrongOptions: function(correctWord) {
        // Get random words from other categories/words
        const allWords = [];
        Object.values(window.vocabularyData || {}).forEach(categoryWords => {
            if (Array.isArray(categoryWords)) {
                allWords.push(...categoryWords);
            }
        });
        
        // Filter out the correct answer and get 3 random wrong answers
        const wrongWords = allWords.filter(word => 
            word.id !== correctWord.id && word.arabic !== correctWord.arabic
        );
        
        const wrongOptions = [];
        while (wrongOptions.length < 3 && wrongWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * wrongWords.length);
            const randomWord = wrongWords.splice(randomIndex, 1)[0];
            wrongOptions.push(randomWord.arabic);
        }
        
        // Fill with fallback options if needed
        while (wrongOptions.length < 3) {
            wrongOptions.push(`خيار ${wrongOptions.length + 1}`);
        }
        
        return wrongOptions;
    },
    


    setupEventDelegation: function() {
        // Use event delegation on the container to handle all clicks
        const container = document.getElementById('learning-content');
        if (container) {
            // Remove existing delegation listener
            const existingHandler = container._learningHandler;
            if (existingHandler) {
                container.removeEventListener('click', existingHandler);
                delete container._learningHandler;
            }
            
            // Add new unified delegation listener with better event handling
            const newHandler = (event) => {
                // Prevent event bubbling issues
                event.stopPropagation();
                
                // Handle flashcard clicks - more specific targeting
                const flashcard = event.target.closest('.flashcard');
                if (flashcard && (flashcard.id === 'flashcard' || flashcard.id === 'review-flashcard')) {
                    // Prevent multiple rapid clicks
                    if (flashcard.classList.contains('transitioning')) {
                        console.log('Flashcard is transitioning, ignoring click');
                        return;
                    }
                    
                    const cardIndex = this.currentIndex;
                    const currentState = flashcard.classList.contains('flipped') ? 'flipped' : 'front';
                    console.log(`Card ${cardIndex}: Flashcard clicked (ID: ${flashcard.id}), current state: ${currentState}, toggling...`);
                    
                    // Add transitioning class to prevent rapid clicks
                    flashcard.classList.add('transitioning');
                    
                    // Toggle flip state
                    flashcard.classList.toggle('flipped');
                    const newState = flashcard.classList.contains('flipped') ? 'flipped' : 'front';
                    
                    // Play audio based on the new state
                    const currentWord = this.words[this.currentIndex];
                    if (window.turkishTTS && currentWord) {
                        setTimeout(() => {
                            if (newState === 'flipped') {
                                // Just flipped to back - play example sentence only
                                console.log('Playing sentence audio for flipped card (back side)');
                                if (currentWord.example) {
                                    window.speakTurkishSentence(currentWord.example).catch(err => {
                                        console.log('Example pronunciation failed:', err);
                                    });
                                } else {
                                    // Fallback to word if no example
                                    window.speakTurkishWord(currentWord.turkish).catch(err => {
                                        console.log('Word pronunciation failed:', err);
                                    });
                                }
                            } else {
                                // Just flipped back to front - play word only
                                console.log('Playing word audio for front side');
                                window.speakTurkishWord(currentWord.turkish).catch(err => {
                                    console.log('Word pronunciation failed:', err);
                                });
                            }
                        }, 200); // Small delay to allow flip animation to start
                    }
                    
                    // Remove transitioning class after animation completes
                    setTimeout(() => {
                        flashcard.classList.remove('transitioning');
                    }, 600); // Match CSS transition duration
                    
                    console.log(`Card ${cardIndex}: New state: ${newState}`);
                    return;
                }
                
                // Handle difficulty button clicks
                const difficultyBtn = event.target.closest('.btn-difficulty');
                if (difficultyBtn) {
                    event.preventDefault();
                    const difficulty = difficultyBtn.getAttribute('data-difficulty');
                    console.log('Difficulty button clicked via delegation:', difficulty, 'on card index:', this.currentIndex);
                    this.recordFlashcardResponse(difficulty);
                    return;
                }
                
                // Handle quiz option clicks
                const quizOption = event.target.closest('.quiz-option');
                if (quizOption) {
                    event.preventDefault();
                    console.log('Quiz option clicked via delegation');
                    this.selectQuizOption(quizOption);
                    return;
                }
            };
            
            container.addEventListener('click', newHandler.bind(this));
            container._learningHandler = newHandler; // Store reference for cleanup
        }
    },
    
    bindEvents: function() {
        // All events are now handled via delegation in setupEventDelegation()
        console.log('Using event delegation for all interactions on card index:', this.currentIndex);
    },
    
    recordFlashcardResponse: function(difficulty) {
        // Prevent multiple simultaneous responses
        if (this.isAdvancing) {
            console.log('Already advancing, ignoring duplicate response');
            return;
        }
        
        this.isAdvancing = true;
        const currentWord = this.words[this.currentIndex];
        const isCorrect = difficulty === 'easy';
        
        console.log('Recording flashcard response:', difficulty, 'for word:', currentWord.turkish);
        
        // Record response
        this.responses.push({
            wordId: currentWord.id,
            word: currentWord.turkish,
            difficulty: difficulty,
            isCorrect: isCorrect,
            timestamp: Date.now(),
            mode: 'flashcard'
        });
        
        // Update stats
        if (isCorrect) {
            this.correctAnswers++;
        }
        this.totalAnswered++;
        
        // Update user progress
        this.updateUserProgress();
        
        // Update review system - send struggling words to review
        if (window.reviewSystem && !isCorrect) {
            window.reviewSystem.updateWordReview(currentWord.id, false);
        }
        
        // Show feedback
        this.showFeedback(difficulty);
        
        // Auto advance after feedback (faster since no manual navigation)
        setTimeout(() => {
            if (this.currentIndex < this.words.length - 1) {
                console.log('Advancing to next word from index:', this.currentIndex, 'to:', this.currentIndex + 1);
                this.nextWord();
            } else {
                console.log('Session complete, showing completion screen');
                this.completeSession();
            }
            this.isAdvancing = false;
        }, 1000);
    },
    
    selectQuizOption: function(selectedBtn) {
        // Prevent multiple simultaneous responses
        if (this.isAdvancing) {
            console.log('Already advancing, ignoring duplicate quiz response');
            return;
        }
        
        this.isAdvancing = true;
        const isCorrect = selectedBtn.getAttribute('data-correct') === 'true';
        const currentWord = this.words[this.currentIndex];
        
        console.log('Recording quiz response:', isCorrect, 'for word:', currentWord.turkish);
        
        // Disable all options
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.disabled = true;
            if (btn.getAttribute('data-correct') === 'true') {
                btn.classList.add('correct');
            } else if (btn === selectedBtn && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        // Record response
        this.responses.push({
            wordId: currentWord.id,
            word: currentWord.turkish,
            selectedAnswer: selectedBtn.getAttribute('data-option'),
            correctAnswer: currentWord.arabic,
            isCorrect: isCorrect,
            timestamp: Date.now(),
            mode: 'quiz'
        });
        
        // Update stats
        if (isCorrect) {
            this.correctAnswers++;
        }
        this.totalAnswered++;
        
        // Update user progress
        this.updateUserProgress();
        
        // Update review system - send incorrect answers to review
        if (window.reviewSystem && !isCorrect) {
            window.reviewSystem.updateWordReview(currentWord.id, false);
        }
        
        // Show next button or complete button
        setTimeout(() => {
            if (this.currentIndex < this.words.length - 1) {
                console.log('Advancing to next quiz word from index:', this.currentIndex, 'to:', this.currentIndex + 1);
                this.nextWord();
            } else {
                console.log('Quiz session complete, showing completion screen');
                this.completeSession();
            }
            this.isAdvancing = false;
        }, 2000);
    },
    
    showFeedback: function(difficulty) {
        const colors = {
            'easy': 'text-green-600',
            'medium': 'text-yellow-600', 
            'hard': 'text-red-600'
        };
        
        const messages = {
            'easy': 'ممتاز! 🎉',
            'medium': 'جيد! 👍',
            'hard': 'سنراجع هذه الكلمة لاحقاً 📚'
        };
        
        // Create feedback overlay
        const feedback = document.createElement('div');
        feedback.className = `fixed top-4 left-1/2 transform -translate-x-1/2 bg-white border-2 ${colors[difficulty]} rounded-lg p-4 z-50 animate-bounce`;
        feedback.innerHTML = `
            <div class="text-center ${colors[difficulty]} font-bold">
                ${messages[difficulty]}
            </div>
        `;
        
        document.body.appendChild(feedback);
        
        // Remove feedback after animation
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 1500);
    },
    
    nextWord: function() {
        if (this.currentIndex < this.words.length - 1) {
            this.currentIndex++;
            console.log('Moving to next word, currentIndex now:', this.currentIndex);
            
            // Clear any existing flashcard state before rendering new one
            const container = document.getElementById('learning-content');
            if (container) {
                const existingFlashcard = container.querySelector('.flashcard');
                if (existingFlashcard) {
                    existingFlashcard.classList.remove('flipped', 'transitioning');
                    existingFlashcard.style.transform = '';
                }
            }
            
            // Small delay to ensure DOM cleanup before re-rendering
            setTimeout(() => {
                this.renderSession();
            }, 50);
        } else {
            console.log('Reached end of words, completing session');
            this.completeSession();
        }
    },
    
    previousWord: function() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderSession();
        }
    },
    
    updateProgress: function() {
        const progressFill = document.querySelector('.session-progress-fill');
        if (progressFill) {
            const progress = (this.currentIndex / this.words.length) * 100;
            progressFill.style.width = `${progress}%`;
        }
    },
    
    updateUserProgress: function() {
        const progress = {
            category: this.category,
            wordsLearned: this.correctAnswers,
            totalWords: this.words.length,
            accuracy: this.totalAnswered > 0 ? (this.correctAnswers / this.totalAnswered) * 100 : 0,
            timeSpent: Date.now() - this.startTime,
            responses: this.responses
        };
        
        // Save to localStorage
        const savedProgress = JSON.parse(localStorage.getItem('turkishLearningProgress') || '{}');
        savedProgress[this.category] = progress;
        localStorage.setItem('turkishLearningProgress', JSON.stringify(savedProgress));
        
        // Update XP
        const xpGained = this.correctAnswers * 10;
        const currentXP = parseInt(localStorage.getItem('userXP') || '0');
        const newXP = currentXP + xpGained;
        localStorage.setItem('userXP', newXP.toString());
        
        // Track learning session for analytics
        this.trackLearningSession();
        
        // Update UI
        const xpElement = document.getElementById('user-xp');
        if (xpElement) {
            xpElement.textContent = newXP;
        }
        
        // Trigger custom event for app to update stats
        window.dispatchEvent(new CustomEvent('progressUpdated', { 
            detail: progress 
        }));
    },
    
    // Track learning session for analytics
    trackLearningSession: function() {
        const today = new Date().toISOString().split('T')[0];
        
        // Update daily learning history
        const learningHistory = JSON.parse(localStorage.getItem('learningHistory') || '{}');
        learningHistory[today] = (learningHistory[today] || 0) + this.words.length;
        localStorage.setItem('learningHistory', JSON.stringify(learningHistory));
        
        // Update session statistics
        const totalSessions = parseInt(localStorage.getItem('totalSessions') || '0') + 1;
        const totalAnswers = parseInt(localStorage.getItem('totalAnswers') || '0') + this.words.length;
        const correctAnswers = parseInt(localStorage.getItem('correctAnswers') || '0') + this.correctAnswers;
        
        localStorage.setItem('totalSessions', totalSessions.toString());
        localStorage.setItem('totalAnswers', totalAnswers.toString());
        localStorage.setItem('correctAnswers', correctAnswers.toString());
        
        // Update current streak
        const lastStudyDate = localStorage.getItem('lastStudyDate');
        const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
        const bestStreak = parseInt(localStorage.getItem('bestStreak') || '0');
        
        if (lastStudyDate === today) {
            // Already studied today, no streak change
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (lastStudyDate === yesterdayStr) {
                // Continuing streak
                const newStreak = currentStreak + 1;
                localStorage.setItem('currentStreak', newStreak.toString());
                if (newStreak > bestStreak) {
                    localStorage.setItem('bestStreak', newStreak.toString());
                }
            } else {
                // Starting new streak
                localStorage.setItem('currentStreak', '1');
            }
        }
        
        localStorage.setItem('lastStudyDate', today);
        
        // Update session timing using existing startTime
        const sessionDuration = Math.round((Date.now() - this.startTime) / 1000);
        const totalTime = parseInt(localStorage.getItem('totalTime') || '0') + sessionDuration;
        localStorage.setItem('totalTime', totalTime.toString());
        
        console.log('Analytics data updated for learning session');
    },
    
    completeSession: function() {
        const sessionStats = {
            category: this.category,
            totalWords: this.words.length,
            correctAnswers: this.correctAnswers,
            accuracy: this.totalAnswered > 0 ? Math.round((this.correctAnswers / this.totalAnswered) * 100) : 0,
            timeSpent: Math.round((Date.now() - this.startTime) / 1000 / 60), // minutes
            mode: this.mode,
            responses: this.responses
        };
        
        // Show completion screen
        const container = document.getElementById('learning-content');
        container.innerHTML = `
            <div class="session-complete">
                <div class="completion-card">
                    <div class="completion-header">
                        <i class="fas fa-trophy text-6xl text-yellow-500 mb-4"></i>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">أحسنت! تم إكمال الجلسة</h2>
                        <p class="text-gray-600">فئة: ${this.getCategoryName()}</p>
                    </div>
                    
                    <div class="completion-stats">
                        <div class="stat-row">
                            <span class="stat-label">إجمالي الكلمات:</span>
                            <span class="stat-value">${sessionStats.totalWords}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">الإجابات الصحيحة:</span>
                            <span class="stat-value">${sessionStats.correctAnswers}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">الدقة:</span>
                            <span class="stat-value">${sessionStats.accuracy}%</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">الوقت المستغرق:</span>
                            <span class="stat-value">${sessionStats.timeSpent} دقيقة</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">النقاط المكتسبة:</span>
                            <span class="stat-value">+${sessionStats.correctAnswers * 10} XP</span>
                        </div>
                    </div>
                    
                    <div class="completion-actions">
                        <button id="return-home" class="btn-primary">
                            <i class="fas fa-home"></i>
                            العودة للرئيسية
                        </button>
                        <button id="start-review" class="btn-secondary">
                            <i class="fas fa-repeat"></i>
                            بدء المراجعة
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Bind completion actions
        document.getElementById('return-home').addEventListener('click', () => {
            window.showSection('dashboard');
        });
        
        document.getElementById('start-review').addEventListener('click', () => {
            window.startReview();
        });
        
        // Update overall app progress
        this.updateUserProgress();
        
        // Show notification
        this.showCompletionNotification(sessionStats);
    },
    
    showCompletionNotification: function(stats) {
        // Create completion notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse';
        notification.innerHTML = `
            <div class="font-bold">جلسة مكتملة!</div>
            <div>${stats.correctAnswers}/${stats.totalWords} صحيح</div>
            <div>+${stats.correctAnswers * 10} XP</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    },
    
    getCategoryName: function() {
        const categoryNames = {
            'greetings': 'التحيات',
            'travel': 'السفر',
            'food': 'الطعام',
            'shopping': 'التسوق',
            'directions': 'الاتجاهات',
            'emergency': 'الطوارئ',
            'time': 'الوقت',
            'numbers': 'الأرقام'
        };
        
        return categoryNames[this.category] || this.category;
    }
};

// CSS for completion screen and additional styles
const learningStyles = `
<style>
.btn-difficulty {
    padding: 1.25rem 2rem;
    border-radius: 1rem;
    border: none;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 120px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-difficulty i {
    font-size: 2rem;
    margin-bottom: 0.25rem;
}

.btn-difficulty span {
    font-size: 1.1rem;
    font-weight: 700;
}

.btn-difficulty small {
    font-size: 0.75rem;
    opacity: 0.9;
    text-align: center;
    line-height: 1.2;
}

.btn-easy {
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
}

.btn-medium {
    background: linear-gradient(135deg, #F59E0B, #D97706);
    color: white;
}

.btn-hard {
    background: linear-gradient(135deg, #EF4444, #DC2626);
    color: white;
}

.btn-difficulty:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
}

.btn-difficulty:active {
    transform: translateY(-2px) scale(1.02);
    transition: all 0.1s ease;
}

.session-complete {
    max-width: 500px;
    margin: 0 auto;
}

.completion-card {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 1.5rem;
    padding: 2.5rem;
    text-align: center;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.completion-header {
    margin-bottom: 2rem;
}

.completion-stats {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-row:last-child {
    border-bottom: none;
}

.stat-label {
    color: #6B7280;
    font-weight: 500;
}

.stat-value {
    color: #2563EB;
    font-weight: 700;
    font-size: 1.1rem;
}

.completion-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.quiz-pronunciation {
    font-size: 1rem;
    color: #6B7280;
    font-style: italic;
    margin-bottom: 1rem;
}

/* Button entrance animation */
.btn-difficulty:nth-child(1) {
    animation: slideInUp 0.6s ease-out 0.2s both;
}

.btn-difficulty:nth-child(2) {
    animation: slideInUp 0.6s ease-out 0.4s both;
}

.btn-difficulty:nth-child(3) {
    animation: slideInUp 0.6s ease-out 0.6s both;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Example sentence styles */
.flashcard-examples {
    margin: 1rem 0 0.5rem 0;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.example-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    color: #6366f1;
    font-weight: 600;
    font-size: 0.9rem;
}

.example-divider i {
    font-size: 0.8rem;
    opacity: 0.7;
}

.flashcard-example-turkish {
    font-size: 1rem;
    color: #1f2937;
    font-weight: 500;
    margin-bottom: 0.5rem;
    text-align: center;
    font-style: italic;
}

.flashcard-example-arabic {
    font-size: 1rem;
    color: #059669;
    font-weight: 600;
    text-align: center;
    direction: rtl;
    line-height: 1.4;
}

@media (max-width: 480px) {
    .completion-actions {
        flex-direction: column;
    }
    
    .btn-difficulty {
        padding: 1rem 1.5rem;
        font-size: 0.9rem;
        min-width: 100px;
    }
    
    .difficulty-buttons {
        flex-direction: column !important;
        gap: 1rem !important;
    }
    
    .btn-difficulty i {
        font-size: 1.5rem;
    }
    
    .flashcard-examples {
        margin: 0.75rem 0 0.5rem 0;
        padding: 0.5rem;
    }
    
    .flashcard-example-turkish,
    .flashcard-example-arabic {
        font-size: 0.9rem;
    }
}
</style>
`;

// Inject styles
if (!document.querySelector('#learning-system-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'learning-system-styles';
    styleElement.innerHTML = learningStyles;
    document.head.appendChild(styleElement);
}

// Global function to start learning session
window.startLearningSession = function(categoryData, mode) {
    const learningContent = document.getElementById('learning-content');
    if (!learningContent) {
        console.error('Learning content container not found');
        return;
    }
    
    learningContent.classList.remove('hidden');
    window.currentLearningSession = new LearningSession(categoryData, mode);
};

console.log('Learning System loaded successfully!');