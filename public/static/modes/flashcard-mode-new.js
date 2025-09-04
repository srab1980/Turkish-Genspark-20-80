/**
 * 🎯 NEW ENHANCED FLASHCARD MODE - SIMPLIFIED AND WORKING VERSION
 * Created to fix persistent caching and visibility issues
 */

// Use a unique class name to avoid conflicts
class FlashcardModeEnhanced extends LearningModeBase {
    constructor(config = {}) {
        super(config);
        
        this.currentIndex = 0;
        this.words = [];
        this.responses = [];
        this.isFlipped = false;
        this.sessionStats = {
            startTime: Date.now(),
            correct: 0,
            incorrect: 0,
            totalWords: 0,
            completed: 0,
            accuracy: 0,
            timeSpent: 0
        };
        
        // Store this instance as current flashcard mode for global access
        window.currentFlashcardMode = this;
        
        console.log('🎯 NEW Flashcard Mode initialized');
    }
    
    // Required by LearningModeBase - initialize the flashcard mode
    async init() {
        try {
            console.log('🚀 Initializing FlashcardModeEnhanced...');
            
            // Initialize with data from the manager if available
            if (this.data && this.data.words) {
                this.words = this.data.words;
                console.log('📚 Loaded words from manager data:', this.words.length);
            }
            
            // Set up session information
            if (this.data && this.data.session) {
                this.sessionInfo = this.data.session;
                console.log('📋 Session info loaded:', this.sessionInfo);
            }
            
            // Initialize session stats
            this.sessionStats.startTime = Date.now();
            this.sessionStats.totalWords = this.words.length;
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Mark as initialized but not active yet (will be activated when started)
            this.isInitialized = true;
            this.isActive = false;
            
            console.log('✅ FlashcardModeEnhanced initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize FlashcardModeEnhanced:', error);
            throw error;
        }
    }
    
    // Set up event listeners for flashcard interactions
    setupEventListeners() {
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isActive) {
                switch(e.key) {
                    case ' ':
                    case 'Enter':
                        e.preventDefault();
                        this.flipCard();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextCard();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousCard();
                        break;
                }
            }
        });
    }
    
    async start(options = {}) {
        try {
            console.log('🎯 Starting NEW flashcard mode with options:', options);
            
            // Store session information for next session progression
            this.data = options;
            if (options.sessionInfo) {
                this.data.sessionInfo = options.sessionInfo;
            } else {
                // Create basic session info if not provided
                this.data.sessionInfo = {
                    sessionId: options.sessionId || (options.categoryId + '_session_' + (options.sessionNumber || 1)),
                    categoryId: options.categoryId || options.category || 'family',
                    sessionNumber: options.sessionNumber || 1,
                    totalSessions: options.totalSessions || 10 // Default estimate
                };
            }
            
            console.log('📊 Session info stored:', this.data.sessionInfo);
            
            // Get words for the session
            this.words = await this.getWordsForSession(options);
            this.sessionStats.totalWords = this.words.length;
            this.sessionStats.startTime = Date.now();
            
            if (!this.words || this.words.length === 0) {
                throw new Error('No words available for flashcard session');
            }
            
            // Reset session state
            this.currentIndex = 0;
            this.responses = [];
            this.isFlipped = false;
            
            // Shuffle words for better learning
            this.shuffleWords();
            
            // Activate the mode
            this.isActive = true;
            
            console.log(`📚 Flashcard session started with ${this.words.length} words`);
            
            // Render the first card
            this.render();
            
            // Auto-pronounce the first word after a brief delay
            setTimeout(() => {
                this.autoPronounceTurkishWord();
            }, 1000); // 1 second delay to let UI settle
            
            // Track session start
            this.trackEvent('session_started', {
                category: options.category || options.categoryId,
                wordCount: this.words.length,
                mode: 'flashcard'
            });
            
        } catch (error) {
            console.error('❌ Error starting flashcard session:', error);
            this.showError('حدث خطأ في بدء جلسة البطاقات التعليمية');
        }
    }
    
    async getWordsForSession(options) {
        // Enhanced vocabulary database integration
        if (window.enhancedVocabularyData && options.category) {
            const categoryData = Object.values(window.enhancedVocabularyData)
                .find(cat => cat.id === options.category);
            
            if (categoryData && categoryData.words) {
                console.log(`📚 Using enhanced vocabulary: ${categoryData.words.length} words from ${categoryData.nameArabic}`);
                return categoryData.words.slice(0, 10); // Limit to 10 words per session
            }
        }
        
        // Fallback to basic vocabulary
        const vocabulary = await this.loadVocabulary();
        if (vocabulary && vocabulary[options.category]) {
            return vocabulary[options.category].slice(0, 10);
        }
        
        throw new Error(`No words found for category: ${options.category}`);
    }
    
    shuffleWords() {
        for (let i = this.words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
        }
    }
    
    render() {
        if (!this.container) {
            console.error('❌ Container not found for flashcard mode');
            return;
        }
        
        const word = this.words[this.currentIndex];
        if (!word) {
            this.completeSession();
            return;
        }
        
        // Get word-specific icon
        const iconHTML = this.getWordIcon(word);
        
        const html = `
            <div class="flashcard-session">
                <div class="session-header">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentIndex + 1) / this.words.length) * 100}%"></div>
                    </div>
                    <div class="session-counter">
                        <span class="current">${this.currentIndex + 1}</span>
                        <span class="separator">من</span>
                        <span class="total">${this.words.length}</span>
                    </div>
                </div>
                
                <div class="flashcard-container">
                    <div class="flashcard ${this.isFlipped ? 'flipped' : ''}" onclick="window.flashcardModeNew.flipCard()">
                        <div class="card-face card-front">
                            <div class="word-icon">
                                ${iconHTML}
                            </div>
                            <div class="word-turkish">
                                ${word.turkish}
                            </div>
                            <div class="flip-hint">
                                اضغط لرؤية المعنى
                            </div>
                        </div>
                        <div class="card-face card-back">
                            <div class="word-arabic">
                                ${word.arabic}
                            </div>
                            <div class="word-english">
                                ${word.english}
                            </div>
                            <div class="word-pronunciation">
                                ${word.pronunciation || ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flashcard-controls">
                    <button class="btn-difficulty btn-hard" onclick="window.flashcardModeNew.recordResponse('incorrect')">
                        <i class="fas fa-times"></i>
                        <span>صعب</span>
                    </button>
                    <button class="btn-difficulty btn-medium" onclick="window.flashcardModeNew.recordResponse('medium')">
                        <i class="fas fa-minus"></i>
                        <span>متوسط</span>
                    </button>
                    <button class="btn-difficulty btn-easy" onclick="window.flashcardModeNew.recordResponse('correct')">
                        <i class="fas fa-check"></i>
                        <span>سهل</span>
                    </button>
                </div>
                
                <div class="pronunciation-controls">
                    <button class="btn-pronunciation" onclick="window.flashcardModeNew.playPronunciation()" title="استمع للنطق">
                        <i class="fas fa-volume-up"></i>
                        <span>استمع للنطق</span>
                    </button>
                </div>
                
                <div class="session-actions">
                    <button class="btn-secondary" onclick="window.flashcardModeNew.pauseSession()">
                        <i class="fas fa-pause"></i> إيقاف مؤقت
                    </button>
                    <button class="btn-secondary" onclick="window.flashcardModeNew.endSession()">
                        <i class="fas fa-stop"></i> إنهاء الجلسة
                    </button>
                </div>
            </div>
            
            <style>
                .flashcard-session {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                
                .session-header {
                    margin-bottom: 2rem;
                    text-align: center;
                }
                
                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #e2e8f0;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4f46e5, #7c3aed);
                    transition: width 0.3s ease;
                }
                
                .session-counter {
                    font-size: 1.1rem;
                    color: #64748b;
                    font-weight: 600;
                }
                
                .flashcard-container {
                    perspective: 1000px;
                    margin-bottom: 2rem;
                }
                
                .flashcard {
                    position: relative;
                    width: 100%;
                    height: 400px;
                    transform-style: preserve-3d;
                    transition: transform 0.6s;
                    cursor: pointer;
                }
                
                .flashcard.flipped {
                    transform: rotateY(180deg);
                }
                
                .card-face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 20px;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                
                .card-front {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .card-back {
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                    color: white;
                    transform: rotateY(180deg);
                }
                
                .word-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
                }
                
                .word-turkish {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }
                
                .word-arabic {
                    font-size: 2rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    direction: rtl;
                }
                
                .word-english {
                    font-size: 1.5rem;
                    opacity: 0.9;
                    margin-bottom: 1rem;
                }
                
                .word-pronunciation {
                    font-size: 1rem;
                    opacity: 0.7;
                    font-style: italic;
                }
                
                .flip-hint {
                    font-size: 0.9rem;
                    opacity: 0.8;
                    margin-top: auto;
                }
                
                .flashcard-controls {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }
                
                .btn-difficulty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    border: none;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-width: 80px;
                    min-height: 80px;
                    color: white;
                }
                
                .btn-difficulty i {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                
                .btn-hard {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }
                
                .btn-medium {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                }
                
                .btn-easy {
                    background: linear-gradient(135deg, #10b981, #059669);
                }
                
                .btn-difficulty:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }
                
                .session-actions {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                }
                
                .btn-secondary {
                    padding: 0.75rem 1.5rem;
                    border: 2px solid #e2e8f0;
                    background: white;
                    color: #64748b;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .btn-secondary:hover {
                    border-color: #cbd5e1;
                    background: #f8fafc;
                }
                
                .pronunciation-controls {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                }
                
                .btn-pronunciation {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    border-radius: 25px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                    min-width: 140px;
                    justify-content: center;
                }
                
                .btn-pronunciation:hover {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
                    background: linear-gradient(135deg, #2563eb, #1e40af);
                }
                
                .btn-pronunciation:active {
                    transform: translateY(0) scale(0.98);
                    box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
                }
                
                .btn-pronunciation i {
                    font-size: 1.1rem;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            </style>
        `;
        
        this.container.innerHTML = html;
    }
    
    getWordIcon(word) {
        console.log('🎨 Getting icon for word:', word.turkish, '- ID:', word.id);
        
        // PRIORITY 1: Use word-specific SVG icons
        if (window.wordSVGIcons && window.wordSVGIcons.getIconForWord) {
            try {
                const svgIcon = window.wordSVGIcons.getIconForWord(word);
                if (svgIcon) {
                    console.log('✅ Using word-specific SVG icon for:', word.turkish);
                    return `<div style="width: 64px; height: 64px; color: white;">${svgIcon}</div>`;
                } else {
                    console.log('⚠️ No word-specific SVG icon found for:', word.turkish);
                }
            } catch (error) {
                console.warn('❌ Error getting word-specific icon for', word.turkish, ':', error);
            }
        } else {
            console.log('❌ wordSVGIcons system not available');
        }
        
        // Fallback to emoji or simple icon
        return word.emoji || word.icon || '📝';
    }
    
    flipCard() {
        this.isFlipped = !this.isFlipped;
        const flashcard = document.querySelector('.flashcard');
        if (flashcard) {
            flashcard.classList.toggle('flipped', this.isFlipped);
        }
    }
    
    recordResponse(difficulty) {
        const word = this.words[this.currentIndex];
        if (!word) return;
        
        // Record the response
        this.responses.push({
            word: word,
            response: difficulty,
            timestamp: Date.now()
        });
        
        // Update stats
        if (difficulty === 'correct') {
            this.sessionStats.correct++;
        } else {
            this.sessionStats.incorrect++;
        }
        
        this.sessionStats.completed++;
        
        // Track the event
        this.trackEvent('word_response', {
            word: word.turkish,
            difficulty: difficulty,
            index: this.currentIndex
        });
        
        // Show brief feedback animation
        this.showDifficultyFeedback(difficulty);
        
        // Auto-advance to next word after a short delay
        setTimeout(() => {
            this.nextWord();
        }, 800); // 800ms delay for visual feedback
    }
    
    nextWord() {
        this.currentIndex++;
        this.isFlipped = false;
        
        if (this.currentIndex >= this.words.length) {
            this.completeSession();
        } else {
            this.render();
            // Auto-pronounce the new word after rendering
            setTimeout(() => {
                this.autoPronounceTurkishWord();
            }, 500); // 500ms delay to let the card render
        }
    }
    
    completeSession() {
        // Calculate final stats
        const endTime = Date.now();
        const totalTime = Math.round((endTime - this.sessionStats.startTime) / 1000 / 60); // minutes
        const totalAnswers = this.sessionStats.correct + this.sessionStats.incorrect;
        const accuracy = totalAnswers > 0 ? Math.round((this.sessionStats.correct / totalAnswers) * 100) : 0;
        
        this.sessionStats.timeSpent = totalTime;
        this.sessionStats.accuracy = accuracy;
        
        console.log('📊 Session completed with stats:', this.sessionStats);
        
        // Show NEW completion screen
        this.showNewCompletionScreen(this.sessionStats);
        
        // Track completion
        this.trackEvent('session_completed', this.sessionStats);
        
        // Trigger analytics update
        if (window.simpleAnalytics) {
            window.simpleAnalytics.trackSessionCompletion(this.sessionStats);
        }
        
        // Dispatch custom event for analytics
        document.dispatchEvent(new CustomEvent('flashcard_session_completed', {
            detail: this.sessionStats
        }));
    }
    
    showNewCompletionScreen(stats) {
        console.log('🎉 Showing NEW completion screen');
        
        // Calculate performance level
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
        
        // Create the NEW completion screen with HIGH VISIBILITY
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
                z-index: 10000;
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
                        0 25px 50px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1);
                    animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    position: relative;
                    overflow: hidden;
                    margin: 1rem 0;
                ">
                    <!-- Decorative top bar -->
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
                    
                    <!-- Celebration emoji -->
                    <div style="
                        font-size: 4rem;
                        margin-bottom: 1rem;
                        animation: bounceIn 1s ease-out;
                    ">🎉</div>
                    
                    <!-- Main title -->
                    <h2 style="
                        font-size: 2.2rem;
                        margin-bottom: 0.5rem;
                        font-weight: 800;
                        color: #1e293b;
                        letter-spacing: -0.025em;
                    ">أحسنت! تم إكمال الجلسة</h2>
                    
                    <!-- Subtitle -->
                    <p style="
                        font-size: 1.2rem;
                        color: #64748b;
                        margin-bottom: 2rem;
                        font-weight: 600;
                    ">لقد أكملت جلسة تعلم رائعة!</p>
                    
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
                            ">${stats.totalWords || 10}</div>
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
                            ">${stats.completed || 10}</div>
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
                            ">${stats.timeSpent || 5}</div>
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
                        <button onclick="
                            console.log('🚀 New Session button clicked');
                            if (window.flashcardModeNew && typeof window.flashcardModeNew.startNextSession === 'function') {
                                console.log('✅ Calling startNextSession...');
                                window.flashcardModeNew.startNextSession();
                            } else {
                                console.log('❌ flashcardModeNew not available, trying fallback...');
                                if (window.currentFlashcardMode && typeof window.currentFlashcardMode.startNextSession === 'function') {
                                    console.log('✅ Using currentFlashcardMode...');
                                    window.currentFlashcardMode.startNextSession();
                                } else if (window.startNewFlashcardSession) {
                                    console.log('✅ Using startNewFlashcardSession fallback...');
                                    window.startNewFlashcardSession({categoryId:'family',sessionNumber:2,wordCount:10});
                                } else {
                                    console.log('❌ No session functions available');
                                }
                            }
                        " style="
                            background: linear-gradient(135deg, #10b981, #059669);
                            color: white;
                            border: none;
                            padding: 1rem 2rem;
                            border-radius: 12px;
                            font-size: 1rem;
                            font-weight: 700;
                            cursor: pointer;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
                            min-width: 160px;
                            margin: 0.5rem;
                        " onmouseover="this.style.transform='translateY(-2px) scale(1.02)'; this.style.boxShadow='0 12px 35px rgba(16, 185, 129, 0.4)'" 
                           onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.3)'">
                            <i class="fas fa-plus-circle" style="margin-left: 0.5rem;"></i>
                            جلسة جديدة
                        </button>

                        <button onclick="
                            console.log('🔄 Restart Session button clicked');
                            if (window.flashcardModeNew && typeof window.flashcardModeNew.restart === 'function') {
                                console.log('✅ Calling restart...');
                                window.flashcardModeNew.restart();
                            } else {
                                console.log('❌ flashcardModeNew not available, trying fallback...');
                                if (window.currentFlashcardMode && typeof window.currentFlashcardMode.restart === 'function') {
                                    console.log('✅ Using currentFlashcardMode...');
                                    window.currentFlashcardMode.restart();
                                } else if (window.startNewFlashcardSession) {
                                    console.log('✅ Using startNewFlashcardSession fallback...');
                                    window.startNewFlashcardSession({categoryId:'family',sessionNumber:1,wordCount:10});
                                } else {
                                    console.log('❌ No restart functions available');
                                }
                            }
                        " style="
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
                        
                        <button onclick="window.showSection && window.showSection('dashboard')" style="
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
        
        // Clear container and show completion screen
        this.container.innerHTML = completionHTML;
    }
    
    restart() {
        console.log('🔄 Restarting flashcard session...');
        this.currentIndex = 0;
        this.responses = [];
        this.isFlipped = false;
        this.sessionStats = {
            startTime: Date.now(),
            correct: 0,
            incorrect: 0,
            totalWords: this.words.length,
            completed: 0,
            accuracy: 0,
            timeSpent: 0
        };
        
        this.shuffleWords();
        this.render();
    }
    
    pauseSession() {
        // Implement pause functionality
        console.log('⏸️ Session paused');
    }
    
    endSession() {
        if (confirm('هل أنت متأكد من إنهاء الجلسة؟')) {
            this.completeSession();
        }
    }
    
    /**
     * Start next session in the same category with proper session ID management
     */
    async startNextSession() {
        console.log('🎯 Starting next session...');
        
        // Get current session information from data
        const sessionInfo = this.data && this.data.sessionInfo;
        
        if (!sessionInfo) {
            console.log('❌ No session info available, falling back to new session');
            // Fallback to starting a new session
            if (window.startNewFlashcardSession) {
                return window.startNewFlashcardSession({
                    categoryId: 'family',
                    sessionNumber: 1,
                    wordCount: 10
                });
            }
            return;
        }
        
        if (sessionInfo.sessionNumber >= sessionInfo.totalSessions) {
            console.log('❌ No next session available');
            return;
        }
        
        // Calculate next session ID and number
        const nextSessionNumber = sessionInfo.sessionNumber + 1;
        const nextSessionId = sessionInfo.categoryId + '_session_' + nextSessionNumber;
        
        // Show loading state
        if (this.container) {
            this.container.innerHTML = `
                <div class="loading-next-session" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 400px;
                    text-align: center;
                ">
                    <div class="loading-content">
                        <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #4f46e5; margin-bottom: 1rem;"></i>
                        <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">جارٍ تحضير الجلسة التالية...</h3>
                        <p style="color: #64748b;">الجلسة ${nextSessionNumber} من ${sessionInfo.totalSessions}</p>
                        <p style="font-size: 0.9rem; color: #4f46e5; margin-top: 0.5rem;">معرف الجلسة: ${nextSessionId}</p>
                    </div>
                </div>
            `;
        }
        
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
        
        console.log('❌ Failed to start next session');
    }
    
    // 🔊 AUTO-PRONUNCIATION FEATURE - Automatically pronounce Turkish words
    autoPronounceTurkishWord() {
        const word = this.words[this.currentIndex];
        if (!word || !word.turkish) {
            console.log('🔇 No word to pronounce');
            return;
        }
        
        try {
            // Check if TTS is supported
            if (!('speechSynthesis' in window)) {
                console.log('🔇 Text-to-Speech not supported in this browser');
                return;
            }
            
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            // Create utterance
            const utterance = new SpeechSynthesisUtterance(word.turkish);
            
            // Configure Turkish language settings
            utterance.lang = 'tr-TR'; // Turkish language code
            utterance.rate = 0.7;     // Slightly slower for learning
            utterance.pitch = 1.0;    // Normal pitch
            utterance.volume = 0.8;   // Comfortable volume
            
            // Try to find Turkish voice
            const voices = window.speechSynthesis.getVoices();
            const turkishVoice = voices.find(voice => 
                voice.lang.includes('tr') || voice.lang.includes('TR')
            );
            
            if (turkishVoice) {
                utterance.voice = turkishVoice;
                console.log(`🔊 Using Turkish voice: ${turkishVoice.name}`);
            } else {
                console.log('🔊 No Turkish voice found, using default voice');
            }
            
            // Add event listeners for debugging
            utterance.onstart = () => {
                console.log(`🔊 Started pronouncing: "${word.turkish}"`);
            };
            
            utterance.onend = () => {
                console.log(`✅ Finished pronouncing: "${word.turkish}"`);
            };
            
            utterance.onerror = (event) => {
                console.error('🔇 TTS Error:', event.error);
            };
            
            // Speak the word
            window.speechSynthesis.speak(utterance);
            
        } catch (error) {
            console.error('🔇 Error in auto-pronunciation:', error);
        }
    }
    
    // 🎯 DIFFICULTY FEEDBACK - Show visual feedback when difficulty is selected
    showDifficultyFeedback(difficulty) {
        // Find the clicked button and show feedback animation
        const buttons = document.querySelectorAll('.btn-difficulty');
        buttons.forEach(btn => btn.style.transform = 'scale(1)');
        
        // Find the correct button based on difficulty
        let targetButton;
        if (difficulty === 'correct') {
            targetButton = document.querySelector('.btn-easy');
        } else if (difficulty === 'medium') {
            targetButton = document.querySelector('.btn-medium');
        } else if (difficulty === 'incorrect') {
            targetButton = document.querySelector('.btn-hard');
        }
        
        if (targetButton) {
            // Add selection animation
            targetButton.style.transform = 'scale(0.95)';
            targetButton.style.opacity = '0.7';
            
            // Reset after animation
            setTimeout(() => {
                targetButton.style.transform = 'scale(1)';
                targetButton.style.opacity = '1';
            }, 200);
        }
        
        // Show difficulty feedback message
        this.showTemporaryMessage(difficulty);
    }
    
    // 💬 TEMPORARY MESSAGE - Show brief feedback messages
    showTemporaryMessage(difficulty) {
        const messages = {
            'correct': { text: '✅ سهل!', color: '#22c55e' },
            'medium': { text: '⚡ متوسط', color: '#f59e0b' },
            'incorrect': { text: '💪 صعب - سنراجعها', color: '#ef4444' }
        };
        
        const message = messages[difficulty] || messages['medium'];
        
        // Create floating message element
        const messageEl = document.createElement('div');
        messageEl.innerHTML = message.text;
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            background: ${message.color};
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 1500);
    }
    
    // 🎵 MANUAL PRONUNCIATION - Allow users to replay pronunciation
    playPronunciation() {
        this.autoPronounceTurkishWord();
    }
}

// Register the NEW flashcard mode with proper error handling
function registerFlashcardMode() {
    if (!window.learningModeManager) {
        console.warn('⚠️ Learning Mode Manager not found, retrying...');
        return false;
    }
    
    try {
        // Create instance for global access
        window.flashcardModeNew = new FlashcardModeEnhanced();
        
        // Register using proper method signature
        const config = {
            name: 'البطاقات التعليمية',
            icon: '📱',
            description: 'تعلم الكلمات باستخدام البطاقات التفاعلية',
            containerId: 'flashcard-mode-container',
            dependencies: [],
            enabled: true,
            version: '3.0.0'
        };
        
        console.log('🔧 Registering flashcard mode with config:', config);
        window.learningModeManager.registerMode('flashcard', FlashcardModeEnhanced, config);
        
        // Verify registration
        const registered = window.learningModeManager.modes.get('flashcard');
        console.log('🔍 Registration result:', {
            exists: !!registered,
            enabled: registered?.enabled,
            name: registered?.name
        });
        
        if (registered && registered.enabled) {
            console.log('✅ NEW Enhanced Flashcard Mode registered successfully');
            return true;
        } else {
            console.error('❌ Flashcard mode registration failed - mode disabled');
            return false;
        }
    } catch (error) {
        console.error('❌ Error registering flashcard mode:', error);
        return false;
    }
}

// Attempt registration
if (!registerFlashcardMode()) {
    // Retry after delay if initial registration fails
    setTimeout(() => {
        if (!registerFlashcardMode()) {
            console.error('❌ Failed to register flashcard mode after retry');
        }
    }, 1000);
}

// Store the class globally for backward compatibility
window.FlashcardModeNew = FlashcardModeEnhanced;

console.log('🎯 NEW Enhanced Flashcard Mode loaded successfully!');