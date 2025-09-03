/**
 * 🎯 NEW ENHANCED FLASHCARD MODE - SIMPLIFIED AND WORKING VERSION
 * Created to fix persistent caching and visibility issues
 */

class FlashcardModeNew extends LearningModeBase {
    constructor() {
        super('flashcard', 'البطاقات التعليمية', '📱', 'تعلم الكلمات باستخدام البطاقات التفاعلية');
        
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
        
        console.log('🎯 NEW Flashcard Mode initialized');
    }
    
    async start(options = {}) {
        try {
            console.log('🎯 Starting NEW flashcard mode with options:', options);
            
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
            
            console.log(`📚 Flashcard session started with ${this.words.length} words`);
            
            // Render the first card
            this.render();
            
            // Track session start
            this.trackEvent('session_started', {
                category: options.category,
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
            </style>
        `;
        
        this.container.innerHTML = html;
    }
    
    getWordIcon(word) {
        // Use word-specific SVG icons if available
        if (window.wordSVGIcons && window.wordSVGIcons.getIconForWord) {
            try {
                const svgIcon = window.wordSVGIcons.getIconForWord(word);
                if (svgIcon) {
                    return `<div style="width: 64px; height: 64px; color: white;">${svgIcon}</div>`;
                }
            } catch (error) {
                console.warn('Error getting word-specific icon:', error);
            }
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
        
        // Move to next word
        this.nextWord();
    }
    
    nextWord() {
        this.currentIndex++;
        this.isFlipped = false;
        
        if (this.currentIndex >= this.words.length) {
            this.completeSession();
        } else {
            this.render();
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
                        <button onclick="window.flashcardModeNew && window.flashcardModeNew.restart()" style="
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
}

// Register the NEW flashcard mode
if (window.learningModeManager) {
    window.flashcardModeNew = new FlashcardModeNew();
    window.learningModeManager.registerMode(window.flashcardModeNew);
    console.log('✅ NEW Flashcard Mode registered successfully');
} else {
    console.warn('⚠️ Learning Mode Manager not found, will retry...');
    setTimeout(() => {
        if (window.learningModeManager) {
            window.flashcardModeNew = new FlashcardModeNew();
            window.learningModeManager.registerMode(window.flashcardModeNew);
            console.log('✅ NEW Flashcard Mode registered successfully (delayed)');
        }
    }, 1000);
}

console.log('🎯 NEW Enhanced Flashcard Mode loaded successfully!');