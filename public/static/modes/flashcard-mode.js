// 📱 Flashcard Learning Mode - Containerized
// Independent, self-contained flashcard learning system
// 
// ⚠️  CRITICAL MODULE SEPARATION ⚠️
// This module MUST display individual Turkish WORDS only (word.turkish)
// DO NOT modify to show sentences (word.turkishSentence) - that's for phrase-mode.js
// Flashcard = Individual words | Phrase = Full sentences

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
        
        // Store this instance as current flashcard mode for global access
        window.currentFlashcardMode = this;
        
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
        
        // Create main flashcard interface with two-column layout
        const flashcardInterface = this.createElement('div', ['flashcard-mode-interface'], {}, `
            ${this.settings.showProgress ? this.renderProgressBar() : ''}
            <div class="flashcard-main-layout">
                <!-- Left Column: Vertical Difficulty Buttons -->
                <div class="flashcard-difficulty-column">
                    ${this.renderDifficultyButtons()}
                </div>
                
                <!-- Right Column: Flashcard with Navigation -->
                <div class="flashcard-content-column">
                    <div class="flashcard-container-wrapper">
                        ${this.renderFlashcard()}
                    </div>
                    ${this.renderControls()}
                </div>
            </div>
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
        
        // Check if session information is available
        const sessionInfo = this.data.sessionInfo;
        

        
        let progressText = `الكلمة ${this.currentIndex + 1} من ${this.state.totalWords}`;
        let sessionText = this.getCategoryName();
        
        if (sessionInfo) {
            progressText = `الكلمة ${this.currentIndex + 1} من ${sessionInfo.wordsInSession}`;
            sessionText = `الجلسة ${sessionInfo.sessionNumber} من ${sessionInfo.totalSessions} • ${this.getCategoryName()}`;
        }
        
        return `
            <div class="flashcard-progress-section">
                <div class="flashcard-progress-info">
                    <span class="progress-text">${progressText}</span>
                    <span class="category-text">${sessionText}</span>
                </div>
                <div class="flashcard-progress-bar">
                    <div class="flashcard-progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render individual flashcard
     * 
     * 🚨 CRITICAL: FLASHCARD MODE ONLY DISPLAYS INDIVIDUAL TURKISH WORDS
     * 🚨 This mode is for VOCABULARY LEARNING, NOT sentence learning
     * 🚨 Front side: Turkish WORD ONLY (word.turkish)
     * 🚨 Back side: Arabic translation + English meaning + optional example
     * 
     * ⚠️ DO NOT display turkishSentence as main content - that's for phrase mode!
     */
    renderFlashcard() {
        const currentWord = this.getCurrentWord();
        if (!currentWord) {
            return '<div class="no-words-message">لا توجد كلمات متاحة</div>';
        }
        
        // 🔍 VERIFY: We're showing individual WORD, not sentence
        console.log('📱 FLASHCARD MODE: Rendering WORD (not sentence):', {
            displayingWord: currentWord.turkish,  // ← This is what appears on flashcard
            arabicTranslation: currentWord.arabic,
            hasExample: !!(currentWord.turkishSentence || currentWord.example),
            difficultyLevel: currentWord.difficultyLevel
        });
        
        // 🚨 ENSURE we're displaying the WORD, not a sentence
        const wordToDisplay = currentWord.turkish;  // Individual Turkish word
        const arabicTranslation = currentWord.arabic;  // Arabic meaning
        
        const hasExample = currentWord.turkishSentence && currentWord.arabicSentence;
        const icon = currentWord.icon || 'fas fa-language';
        const emoji = currentWord.emoji || '📚';
        
        return `
            <div class="flashcard-container" id="flashcard-container">
                <!-- Left Navigation Button -->
                <button class="flashcard-nav-button flashcard-nav-prev ${this.currentIndex === 0 ? 'disabled' : ''}" data-action="previous" title="السابق">
                    <i class="fas fa-chevron-right"></i>
                </button>
                
                <div class="flashcard ${this.isFlipped ? 'flipped' : ''}" id="flashcard" data-word-id="${currentWord.id}">
                    <!-- FRONT: Individual Turkish Word Only -->
                    <div class="flashcard-front">
                        <div class="flashcard-icon-container">
                            <div class="word-icon emoji">${emoji}</div>
                        </div>
                        <!-- 🚨 MAIN CONTENT: Turkish WORD (not sentence) -->
                        <div class="flashcard-turkish">${wordToDisplay}</div>
                        ${currentWord.pronunciation && currentWord.pronunciation !== 'undefined' ? 
                            `<div class="flashcard-pronunciation">[${currentWord.pronunciation}]</div>` :
                            currentWord.vowelHarmony && currentWord.vowelHarmony !== 'undefined' ? 
                                `<div class="flashcard-vowel-harmony">${currentWord.vowelHarmony}</div>` :
                                ''
                        }
                        <div class="tts-controls">
                            <button class="tts-btn tts-word-btn" data-action="speak-word" title="استمع للكلمة">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        <div class="flashcard-hint">اضغط لرؤية الترجمة</div>
                    </div>
                    
                    <!-- BACK: Translation + Optional Example -->
                    <div class="flashcard-back">
                        <div class="flashcard-back-header">
                            <div class="flashcard-icon-container-small">
                                ${currentWord.icon ? 
                                    `<i class="word-meaning-icon ${currentWord.icon}"></i>` : 
                                    `<div class="word-icon emoji">${emoji}</div>`
                                }
                            </div>
                            <!-- 🚨 TRANSLATION: Arabic meaning of the word -->
                            <div class="flashcard-arabic-main">${arabicTranslation}</div>
                            ${currentWord.english && currentWord.english !== 'word' ? 
                                `<div class="flashcard-english-main">${currentWord.english}</div>` :
                                ''
                            }
                            ${currentWord.difficultyLevel ? 
                                `<div class="flashcard-difficulty-level">${currentWord.difficultyLevel}</div>` :
                                ''
                            }
                        </div>
                        
                        ${hasExample ? `
                            <div class="flashcard-example">
                                <h4 class="example-title">مثال الاستخدام:</h4>
                                <div class="turkish-example">
                                    <div class="example-text">${currentWord.turkishSentence || currentWord.example || ''}</div>
                                    ${currentWord.turkishSentence || currentWord.example ? `
                                        <button class="tts-btn tts-example" data-action="speak-sentence" title="استمع للمثال">
                                            <i class="fas fa-volume-up"></i>
                                        </button>
                                    ` : ''}
                                </div>
                                
                                <div class="arabic-translation">
                                    <div class="example-arabic">${currentWord.arabicSentence || currentWord.exampleArabic || ''}</div>
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="flashcard-hint">اضغط للعودة للكلمة</div>
                    </div>
                </div>
                
                <!-- Right Navigation Button -->
                <button class="flashcard-nav-button flashcard-nav-next ${this.currentIndex >= this.words.length - 1 ? 'disabled' : ''}" data-action="next" title="التالي">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>
        `;
    }
    
    /**
     * Render control buttons
     */
    renderControls() {
        // Controls are now integrated into the flashcard as side navigation buttons
        return '';
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
                <div class="difficulty-buttons vertical-layout">
                    <button class="btn-difficulty btn-hard" data-difficulty="hard">
                        <i class="fas fa-times-circle"></i>
                        <span>صعب</span>
                        <small>مراجعة</small>
                    </button>
                    <button class="btn-difficulty btn-medium" data-difficulty="medium">
                        <i class="fas fa-minus-circle"></i>
                        <span>متوسط</span>
                        <small>تكرار</small>
                    </button>
                    <button class="btn-difficulty btn-easy" data-difficulty="easy">
                        <i class="fas fa-check-circle"></i>
                        <span>سهل</span>
                        <small>أتقنت</small>
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
     * Handle flashcard click for flipping
     */
    handleFlashcardClick(event) {
        console.log('👆 Flashcard clicked! Settings flipOnClick:', this.settings.flipOnClick);
        
        if (!this.settings.flipOnClick) {
            console.log('🚫 Flip on click is disabled');
            return;
        }
        
        const flashcard = event.target.closest('.flashcard');
        console.log('📱 Flashcard element found:', !!flashcard);
        
        if (!flashcard || flashcard.classList.contains('transitioning')) {
            console.log('🚫 Cannot flip: no flashcard or transitioning');
            return;
        }
        
        console.log('✅ Calling flipCard()');
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
            console.log('🚫 Flip blocked: flashcard not found or transitioning');
            return;
        }
        
        console.log('🔄 Flipping flashcard - current state:', this.isFlipped ? 'flipped' : 'front');
        
        // Add transitioning state
        flashcard.classList.add('transitioning');
        
        // Toggle flip state
        this.isFlipped = !this.isFlipped;
        flashcard.classList.toggle('flipped', this.isFlipped);
        
        console.log('✅ Flip complete - new state:', this.isFlipped ? 'flipped' : 'front');
        
        // Auto-play audio when flipping to back side
        setTimeout(() => {
            if (this.isFlipped && this.settings.enableTTS) {
                const currentWord = this.getCurrentWord();
                const hasExampleSentence = currentWord?.turkishSentence || currentWord?.example;
                
                if (hasExampleSentence) {
                    // Auto-play example sentence when card is flipped to back side
                    console.log('🔊 Auto-playing example sentence audio...');
                    this.pronounceCurrentSentence();
                } else {
                    // Fallback to Turkish word if no example sentence exists
                    console.log('🔊 Auto-playing Turkish word pronunciation...');
                    this.pronounceCurrentWord();
                }
            }
        }, 300);
        
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
        if (!currentWord?.turkish) {
            console.log('⚠️ FLASHCARD: No Turkish word found to pronounce');
            return;
        }
        
        // 🚨 FLASHCARD MODE: Always pronounce the INDIVIDUAL WORD
        const individualWord = currentWord.turkish;  // Single Turkish word
        console.log('📱 FLASHCARD TTS: Pronouncing individual word:', individualWord);
        
        try {
            // Try multiple TTS approaches for the individual word
            if (window.speakTurkishWord) {
                await window.speakTurkishWord(individualWord);
                console.log('🔊 FLASHCARD: Playing individual word with Turkish TTS:', individualWord);
            } else {
                // Always use browser TTS as fallback for the word
                this.speakWithBrowserTTS(individualWord);
            }
        } catch (error) {
            console.log('FLASHCARD: Primary TTS failed, using browser fallback:', error);
            this.speakWithBrowserTTS(individualWord);
        }
    }
    
    /**
     * Speak text using browser's Speech Synthesis API
     */
    speakWithBrowserTTS(text) {
        if (!text || !window.speechSynthesis) {
            console.log('Browser TTS not available');
            return;
        }
        
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        
        // Adjust rate based on text length for better comprehension
        if (text.length > 20) {
            utterance.rate = 0.7; // Slower for longer sentences
        } else {
            utterance.rate = 0.8; // Standard rate for single words
        }
        
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Add event listeners for debugging
        utterance.onstart = () => {
            const textType = text.length > 20 ? 'sentence' : 'word';
            console.log(`🔊 Browser TTS started playing ${textType}:`, text.substring(0, 50) + (text.length > 50 ? '...' : ''));
        };
        
        utterance.onend = () => {
            console.log('✅ Browser TTS finished playing');
        };
        
        utterance.onerror = (error) => {
            console.log('❌ Browser TTS error:', error.error || error);
        };
        
        window.speechSynthesis.speak(utterance);
    }
    
    /**
     * Pronounce current sentence
     */
    async pronounceCurrentSentence() {
        const currentWord = this.getCurrentWord();
        // Prioritize Excel data field (turkishSentence) over legacy field (example)
        const sentence = currentWord?.turkishSentence || currentWord?.example;
        
        if (!sentence) {
            console.log('⚠️ No Turkish sentence example found for this word');
            return;
        }
        
        console.log('🎯 Playing Turkish example sentence:', sentence);
        
        try {
            // Try multiple TTS approaches for the sentence
            if (window.speakTurkishSentence) {
                await window.speakTurkishSentence(sentence);
                console.log('🔊 Sentence played with Turkish TTS service');
            } else if (window.speakTurkishWord) {
                await window.speakTurkishWord(sentence);
                console.log('🔊 Sentence played with Turkish word TTS');
            } else {
                // Always use browser TTS as fallback for sentences
                this.speakWithBrowserTTS(sentence);
            }
        } catch (error) {
            console.log('Primary sentence TTS failed, using browser fallback:', error);
            this.speakWithBrowserTTS(sentence);
        }
    }
    
    /**
     * Show hint for current word
     */
    showHint() {
        const currentWord = this.getCurrentWord();
        if (!currentWord) return;
        
        let hintText = '';
        
        // Build hint based on available data
        if (currentWord.difficultyLevel) {
            hintText += `📊 المستوى: ${currentWord.difficultyLevel}\n`;
        }
        
        if (currentWord.vowelHarmony) {
            hintText += `🎵 قاعدة الصوت: ${currentWord.vowelHarmony}\n`;
        }
        
        if (currentWord.pronunciation) {
            hintText += `🔊 النطق: [${currentWord.pronunciation}]\n`;
        }
        
        // Show first few letters of Arabic as additional hint
        if (currentWord.arabic) {
            const arabicHint = currentWord.arabic.substring(0, Math.ceil(currentWord.arabic.length / 2)) + '...';
            hintText += `💡 تلميح الترجمة: ${arabicHint}`;
        }
        
        if (!hintText) {
            hintText = '💡 لا توجد تلميحات إضافية متاحة لهذه الكلمة';
        }
        
        // Show hint in notification
        this.showNotification(hintText, 'info');
        
        // Also pronounce the word as an audio hint
        this.pronounceCurrentWord();
        
        this.trackEvent('hint_used', { 
            wordId: currentWord?.id,
            turkish: currentWord?.turkish 
        });
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
            responses: this.responses,
            sessionInfo: this.data.sessionInfo // Include session information
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
        // Check if there are more sessions available
        const sessionInfo = stats.sessionInfo;
        const hasNextSession = sessionInfo && sessionInfo.sessionNumber < sessionInfo.totalSessions;
        
        // Calculate performance metrics
        const accuracy = stats.accuracy || 0;
        let performanceLevel = 'جيد';
        let performanceColor = '#22c55e';
        let performanceIcon = '👍';
        let performanceBg = '#22c55e15';
        
        if (accuracy >= 90) {
            performanceLevel = 'ممتاز';
            performanceColor = '#10b981';
            performanceIcon = '🌟';
            performanceBg = '#10b98115';
        } else if (accuracy >= 70) {
            performanceLevel = 'جيد جداً';
            performanceColor = '#22c55e';
            performanceIcon = '👍';
            performanceBg = '#22c55e15';
        } else if (accuracy >= 50) {
            performanceLevel = 'مقبول';
            performanceColor = '#f59e0b';
            performanceIcon = '⚡';
            performanceBg = '#f59e0b15';
        } else {
            performanceLevel = 'يحتاج تحسين';
            performanceColor = '#ef4444';
            performanceIcon = '💪';
            performanceBg = '#ef444415';
        }
        
        // Create session progress display
        let sessionProgressHTML = '';
        if (sessionInfo) {
            sessionProgressHTML = `
                <div style="
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 16px;
                    margin: 1.5rem 0;
                    text-align: center;
                    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                ">
                    <p style="font-size: 1.2rem; font-weight: 700; margin: 0 0 0.5rem 0;">
                        تم إكمال الجلسة ${sessionInfo.sessionNumber} من ${sessionInfo.totalSessions}
                    </p>
                    ${hasNextSession ? 
                        `<p style="font-size: 1rem; margin: 0; opacity: 0.9;">الجلسة التالية متاحة الآن! 🚀</p>` : 
                        `<p style="font-size: 1.1rem; font-weight: 600; margin: 0;">🎉 تم إكمال جميع الجلسات في هذه الفئة!</p>`
                    }
                </div>
            `;
        }
        
        // Create next session button if available
        let nextSessionButton = '';
        if (hasNextSession) {
            nextSessionButton = `
                <button class="btn-action btn-success" data-action="next-session" style="
                    background: linear-gradient(135deg, #10b981, #059669) !important;
                    color: white !important;
                    border: none !important;
                    padding: 1rem 2rem !important;
                    border-radius: 12px !important;
                    font-size: 1rem !important;
                    font-weight: 700 !important;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3) !important;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    min-width: 200px;
                    margin: 0.5rem;
                " onmouseover="this.style.transform='translateY(-2px) scale(1.02)'; this.style.boxShadow='0 12px 35px rgba(16, 185, 129, 0.4)'" 
                   onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.3)'">
                    <i class="fas fa-arrow-left" style="margin-left: 0.5rem;"></i>
                    بدء الجلسة التالية (${sessionInfo.sessionNumber + 1}/${sessionInfo.totalSessions})
                </button>
            `;
        }
        
        const completionHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 1rem;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Arabic', sans-serif;
                overflow-y: auto;
            ">
                <div style="
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 2.5rem;
                    text-align: center;
                    max-width: 600px;
                    width: 100%;
                    box-shadow: 
                        0 25px 50px rgba(0, 0, 0, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.1);
                    animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    position: relative;
                    overflow: hidden;
                    margin: 1rem 0;
                ">
                    <!-- Decorative gradient overlay -->
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 6px;
                        background: linear-gradient(90deg, #4f46e5, #7c3aed, #ec4899, #f59e0b, #10b981);
                        background-size: 300% 100%;
                        animation: shimmer 3s ease-in-out infinite;
                    "></div>
                    
                    <div style="
                        font-size: 4rem;
                        margin-bottom: 1rem;
                        animation: bounceIn 1s ease-out;
                    ">🎉</div>
                    
                    <h2 style="
                        font-size: 2.2rem;
                        margin-bottom: 0.5rem;
                        font-weight: 800;
                        color: #1e293b;
                        letter-spacing: -0.025em;
                    ">أحسنت! تم إكمال الجلسة</h2>
                    
                    <p style="
                        font-size: 1.2rem;
                        color: #64748b;
                        margin-bottom: 1rem;
                        font-weight: 600;
                    ">فئة: ${this.getCategoryName()}</p>
                    
                    ${sessionProgressHTML}
                    
                    <!-- Performance Badge -->
                    <div style="
                        background: ${performanceBg};
                        border: 2px solid ${performanceColor}40;
                        border-radius: 16px;
                        padding: 1.5rem;
                        margin: 1.5rem 0 2rem 0;
                        display: inline-block;
                        min-width: 200px;
                    ">
                        <div style="
                            font-size: 2.5rem;
                            margin-bottom: 0.5rem;
                        ">${performanceIcon}</div>
                        <div style="
                            font-size: 1rem;
                            color: #64748b;
                            margin-bottom: 0.25rem;
                            font-weight: 600;
                        ">مستوى الأداء</div>
                        <div style="
                            font-size: 1.6rem;
                            font-weight: 800;
                            color: ${performanceColor};
                        ">${performanceLevel}</div>
                    </div>
                    
                    <!-- Stats Grid -->
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                        margin: 2rem 0;
                        direction: rtl;
                    ">
                        <div style="
                            background: linear-gradient(135deg, #10b98115, #10b98125);
                            border: 1px solid #10b98130;
                            border-radius: 12px;
                            padding: 1.25rem;
                            text-align: center;
                        ">
                            <div style="
                                font-size: 2rem;
                                font-weight: 800;
                                color: #10b981;
                                margin-bottom: 0.25rem;
                            ">${stats.totalWords}</div>
                            <div style="
                                font-size: 0.9rem;
                                color: #64748b;
                                font-weight: 600;
                            ">كلمات الجلسة</div>
                        </div>
                        
                        <div style="
                            background: linear-gradient(135deg, #4f46e515, #4f46e525);
                            border: 1px solid #4f46e530;
                            border-radius: 12px;
                            padding: 1.25rem;
                            text-align: center;
                        ">
                            <div style="
                                font-size: 2rem;
                                font-weight: 800;
                                color: #4f46e5;
                                margin-bottom: 0.25rem;
                            ">${stats.completed}</div>
                            <div style="
                                font-size: 0.9rem;
                                color: #64748b;
                                font-weight: 600;
                            ">تم إكمالها</div>
                        </div>
                        
                        <div style="
                            background: linear-gradient(135deg, ${performanceBg}, ${performanceColor}25);
                            border: 1px solid ${performanceColor}30;
                            border-radius: 12px;
                            padding: 1.25rem;
                            text-align: center;
                        ">
                            <div style="
                                font-size: 2rem;
                                font-weight: 800;
                                color: ${performanceColor};
                                margin-bottom: 0.25rem;
                            ">${accuracy}%</div>
                            <div style="
                                font-size: 0.9rem;
                                color: #64748b;
                                font-weight: 600;
                            ">الدقة</div>
                        </div>
                        
                        <div style="
                            background: linear-gradient(135deg, #06b6d415, #06b6d425);
                            border: 1px solid #06b6d430;
                            border-radius: 12px;
                            padding: 1.25rem;
                            text-align: center;
                        ">
                            <div style="
                                font-size: 2rem;
                                font-weight: 800;
                                color: #06b6d4;
                                margin-bottom: 0.25rem;
                            ">${stats.timeSpent}</div>
                            <div style="
                                font-size: 0.9rem;
                                color: #64748b;
                                font-weight: 600;
                            ">دقيقة</div>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                        flex-wrap: wrap;
                        margin-top: 2.5rem;
                        direction: rtl;
                    ">
                        ${nextSessionButton}
                        
                        <button data-action="restart" style="
                            background: linear-gradient(135deg, #4f46e5, #7c3aed);
                            color: white;
                            border: none;
                            padding: 1rem 2rem;
                            border-radius: 12px;
                            font-size: 1rem;
                            font-weight: 700;
                            cursor: pointer;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
                            min-width: 140px;
                            margin: 0.5rem;
                        " onmouseover="this.style.transform='translateY(-2px) scale(1.02)'; this.style.boxShadow='0 12px 35px rgba(79, 70, 229, 0.4)'" 
                           onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 25px rgba(79, 70, 229, 0.3)'">
                            <i class="fas fa-redo" style="margin-left: 0.5rem;"></i>
                            إعادة الجلسة
                        </button>
                        
                        <button data-action="review" style="
                            background: #f8fafc;
                            color: #475569;
                            border: 2px solid #e2e8f0;
                            padding: 1rem 2rem;
                            border-radius: 12px;
                            font-size: 1rem;
                            font-weight: 700;
                            cursor: pointer;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            min-width: 140px;
                            margin: 0.5rem;
                        " onmouseover="this.style.transform='translateY(-2px)'; this.style.borderColor='#cbd5e1'; this.style.background='#f1f5f9'" 
                           onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#e2e8f0'; this.style.background='#f8fafc'">
                            <i class="fas fa-repeat" style="margin-left: 0.5rem;"></i>
                            بدء المراجعة
                        </button>
                        
                        <button data-action="home" style="
                            background: #f8fafc;
                            color: #475569;
                            border: 2px solid #e2e8f0;
                            padding: 1rem 2rem;
                            border-radius: 12px;
                            font-size: 1rem;
                            font-weight: 700;
                            cursor: pointer;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            min-width: 140px;
                            margin: 0.5rem;
                        " onmouseover="this.style.transform='translateY(-2px)'; this.style.borderColor='#cbd5e1'; this.style.background='#f1f5f9'" 
                           onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#e2e8f0'; this.style.background='#f8fafc'">
                            <i class="fas fa-home" style="margin-left: 0.5rem;"></i>
                            العودة للرئيسية
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(60px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes bounceIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.1);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes shimmer {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            </style>
        `;
        
        this.clearContainer();
        this.container.innerHTML = completionHTML;
        
        // Setup completion actions
        this.container.addEventListener('click', (event) => {
            const action = event.target.closest('[data-action]')?.getAttribute('data-action');
            
            switch (action) {
                case 'next-session':
                    this.startNextSession();
                    break;
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
     * Start next session in the same category with proper session ID management
     */
    async startNextSession() {
        const sessionInfo = this.data.sessionInfo;
        
        if (!sessionInfo || sessionInfo.sessionNumber >= sessionInfo.totalSessions) {
            console.log('❌ No next session available');
            return;
        }
        
        // Mark current session as completed
        this.markSessionCompleted(sessionInfo);
        
        // Calculate next session ID and number
        const nextSessionNumber = sessionInfo.sessionNumber + 1;
        const nextSessionId = sessionInfo.categoryId + '_session_' + nextSessionNumber;
        
        // Show enhanced loading state
        this.container.innerHTML = '<div class="loading-next-session"><div class="loading-content"><i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i><h3 class="text-xl font-bold mb-2">جارٍ تحضير الجلسة التالية...</h3><p class="text-gray-600">الجلسة ' + nextSessionNumber + ' من ' + sessionInfo.totalSessions + '</p><p class="text-sm text-blue-600 mt-2">معرف الجلسة: ' + nextSessionId + '</p></div></div>';
        
        // Wait for visual feedback
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Use enhanced session function with specific session details
        if (window.startNewFlashcardSession) {
            console.log('🎯 Starting next session with ID:', nextSessionId);
            
            try {
                const result = await window.startNewFlashcardSession({
                    categoryId: sessionInfo.categoryId,
                    sessionNumber: nextSessionNumber,
                    sessionId: nextSessionId,
                    wordCount: 10
                });
                
                if (result !== false) {
                    console.log('✅ Next session started successfully with ID:', nextSessionId);
                    return;
                }
            } catch (error) {
                console.error('❌ Enhanced next session failed:', error);
            }
        }
        
        // Fallback to legacy method
        if (window.TurkishLearningApp && window.TurkishLearningApp.startLearning) {
            console.log('🔄 Falling back to legacy method for category:', this.data.categoryId);
            
            // Set the category in the UI
            const categorySelect = document.getElementById('category-select');
            const modeSelect = document.getElementById('learning-mode');
            
            if (categorySelect && modeSelect) {
                categorySelect.value = this.data.category;
                modeSelect.value = 'flashcard';
                
                // Trigger the learning flow
                window.TurkishLearningApp.startLearning();
            }
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
            
            // Save progress
            localStorage.setItem('turkishLearningProgress', JSON.stringify(progress));
            
            console.log(`✅ Session ${sessionInfo.sessionNumber} marked as completed for ${sessionInfo.categoryId}`);
            
        } catch (error) {
            console.error('❌ Error saving session progress:', error);
        }
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