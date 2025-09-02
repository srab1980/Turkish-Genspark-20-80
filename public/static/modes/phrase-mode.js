// 📝 Phrase Learning Mode - Containerized
// Independent common phrases and expressions learning system
// 
// 🎯 MODULE PURPOSE: Display Turkish SENTENCES/PHRASES for conversational learning
// This module prioritizes: word.turkishSentence || word.example || word.turkish
// Phrase mode = Sentences | Flashcard mode = Individual words

class PhraseMode extends LearningModeBase {
    constructor(config = {}) {
        super(config);
        
        // Phrase-specific properties
        this.phrases = [];
        this.currentIndex = 0;
        this.responses = [];
        this.selectedCategory = 'all';
        this.isFlipped = false;
        
        // Phrase settings
        this.settings = {
            showContext: true,
            enableTTS: true,
            autoPlay: false,
            showUsageExamples: true,
            difficultyFilter: 'all',
            ...this.options.settings
        };
        
        console.log('📝 Phrase Mode container created');
    }
    
    /**
     * Initialize phrase mode
     */
    async init() {
        try {
            // Load phrases data - check for vocabulary words first
            if (this.data.words && this.data.words.length > 0) {
                // Convert vocabulary words to phrase format for phrase mode
                this.phrases = this.convertWordsToPhases(this.data.words);
            } else if (this.data.phrases) {
                this.phrases = this.data.phrases;
            } else {
                await this.loadPhrases();
            }
            
            if (this.phrases.length === 0) {
                throw new Error('No phrases available');
            }
            
            // Apply initial filters
            this.applyFilters();
            
            // Initialize state
            this.updateState({
                totalPhrases: this.phrases.length,
                currentIndex: 0,
                learned: 0,
                accuracy: 0
            });
            
            console.log(`📝 Phrase mode initialized with ${this.phrases.length} phrases`);
            
        } catch (error) {
            console.error('❌ Failed to initialize phrase mode:', error);
            throw error;
        }
    }
    
    /**
     * Load phrases from data or fallback
     */
    async loadPhrases() {
        // Try to load from enhanced content system first
        if (window.enhancedContentSystem && window.enhancedContentSystem.phrases) {
            this.phrases = window.enhancedContentSystem.phrases;
        } else {
            // Fallback to built-in phrases
            this.phrases = this.getBuiltInPhrases();
        }
    }
    
    /**
     * Convert vocabulary words to phrase format
     * 
     * IMPORTANT: Phrase mode displays Turkish SENTENCES for contextual learning
     * This is different from flashcard mode which displays individual words
     * 
     * Phrase structure:
     * - Primary: Turkish sentence (word.turkishSentence) 
     * - Fallback: Example or individual word if no sentence available
     */
    convertWordsToPhases(words) {
        return words.map(word => ({
            id: `phrase_${word.id}`,
            turkish: word.turkishSentence || word.example || word.turkish,
            arabic: word.arabicSentence || word.exampleArabic || word.arabic,
            english: word.english,
            pronunciation: word.pronunciation || null,
            category: this.data.category || 'general',
            difficulty: word.difficultyLevel ? (word.difficultyLevel.includes('A') ? 'beginner' : word.difficultyLevel.includes('B') ? 'intermediate' : 'advanced') : 'beginner',
            context: 'conversational',
            usage: `Using "${word.turkish}" in everyday conversation`,
            word: word.turkish,
            wordMeaning: word.arabic,
            examples: word.turkishSentence ? [{
                situation: 'Everyday usage',
                turkish: word.turkishSentence,
                arabic: word.arabicSentence || word.arabic
            }] : (word.example ? [{
                situation: 'Everyday usage', 
                turkish: word.example,
                arabic: word.exampleArabic || word.arabic
            }] : []),
            icon: word.icon,
            emoji: word.emoji
        }));
    }
    
    /**
     * Get built-in phrase data
     */
    getBuiltInPhrases() {
        return [
            {
                id: 'greeting_1',
                turkish: 'Nasılsınız?',
                arabic: 'كيف حالك؟ (رسمي)',
                english: 'How are you? (formal)',
                pronunciation: 'na-sıl-sı-NIZ',
                category: 'greetings',
                difficulty: 'beginner',
                context: 'formal',
                usage: 'Used in formal situations or with people you don\'t know well',
                examples: [
                    {
                        situation: 'Meeting someone for the first time',
                        turkish: 'Merhaba! Ben Ali. Nasılsınız?',
                        arabic: 'مرحبا! أنا علي. كيف حالك؟'
                    },
                    {
                        situation: 'In a business meeting',
                        turkish: 'Günaydın! Nasılsınız bugün?',
                        arabic: 'صباح الخير! كيف حالك اليوم؟'
                    }
                ],
                commonResponses: [
                    { turkish: 'İyiyim, teşekkürler.', arabic: 'أنا بخير، شكراً.' },
                    { turkish: 'Çok iyiyim, siz nasılsınız?', arabic: 'أنا بخير جداً، وأنت كيف حالك؟' }
                ]
            },
            {
                id: 'greeting_2',
                turkish: 'Nasılsın?',
                arabic: 'كيف حالك؟ (غير رسمي)',
                english: 'How are you? (informal)',
                pronunciation: 'na-sıl-SIN',
                category: 'greetings',
                difficulty: 'beginner',
                context: 'informal',
                usage: 'Used with friends, family, or people you know well',
                examples: [
                    {
                        situation: 'Meeting a friend',
                        turkish: 'Selam! Nasılsın?',
                        arabic: 'سلام! كيف حالك؟'
                    },
                    {
                        situation: 'Casual conversation',
                        turkish: 'Hey! Bugün nasılsın?',
                        arabic: 'هاي! كيف حالك اليوم؟'
                    }
                ],
                commonResponses: [
                    { turkish: 'İyiyim, sen nasılsın?', arabic: 'أنا بخير، وأنت كيف حالك؟' },
                    { turkish: 'Harika! Sen?', arabic: 'رائع! وأنت؟' }
                ]
            },
            {
                id: 'polite_1',
                turkish: 'Affedersiniz',
                arabic: 'عفواً / المعذرة',
                english: 'Excuse me / I\'m sorry',
                pronunciation: 'af-fe-der-si-NIZ',
                category: 'polite',
                difficulty: 'beginner',
                context: 'polite',
                usage: 'Used to get attention or apologize for minor inconveniences',
                examples: [
                    {
                        situation: 'Getting someone\'s attention',
                        turkish: 'Affedersiniz, saat kaç?',
                        arabic: 'عفواً، كم الساعة؟'
                    },
                    {
                        situation: 'Apologizing for bumping into someone',
                        turkish: 'Affedersiniz, çok özür dilerim.',
                        arabic: 'عفواً، أعتذر بشدة.'
                    }
                ]
            },
            {
                id: 'travel_1',
                turkish: 'Nerede?',
                arabic: 'أين؟',
                english: 'Where?',
                pronunciation: 'ne-re-DE',
                category: 'travel',
                difficulty: 'beginner',
                context: 'question',
                usage: 'Basic question word for asking about location',
                examples: [
                    {
                        situation: 'Looking for a place',
                        turkish: 'Tuvalet nerede?',
                        arabic: 'أين الحمام؟'
                    },
                    {
                        situation: 'Asking for directions',
                        turkish: 'Otobüs durağı nerede?',
                        arabic: 'أين محطة الباص؟'
                    }
                ]
            },
            {
                id: 'food_1',
                turkish: 'Ne yiyorsun?',
                arabic: 'ماذا تأكل؟',
                english: 'What are you eating?',
                pronunciation: 'ne yi-yor-SUN',
                category: 'food',
                difficulty: 'intermediate',
                context: 'casual',
                usage: 'Asking about what someone is eating in casual conversation',
                examples: [
                    {
                        situation: 'At lunch with friends',
                        turkish: 'Mmm, çok lezzetli görünüyor! Ne yiyorsun?',
                        arabic: 'مممم، يبدو لذيذاً جداً! ماذا تأكل؟'
                    }
                ]
            },
            {
                id: 'shopping_1',
                turkish: 'Bu ne kadar?',
                arabic: 'كم سعر هذا؟',
                english: 'How much is this?',
                pronunciation: 'bu ne ka-DAR',
                category: 'shopping',
                difficulty: 'beginner',
                context: 'shopping',
                usage: 'Essential phrase for asking prices while shopping',
                examples: [
                    {
                        situation: 'At a market',
                        turkish: 'Bu çanta çok güzel. Bu ne kadar?',
                        arabic: 'هذه الحقيبة جميلة جداً. كم سعرها؟'
                    },
                    {
                        situation: 'In a store',
                        turkish: 'Affedersiniz, bu ayakkabı ne kadar?',
                        arabic: 'عفواً، كم سعر هذا الحذاء؟'
                    }
                ]
            },
            {
                id: 'time_1',
                turkish: 'Saat kaç?',
                arabic: 'كم الساعة؟',
                english: 'What time is it?',
                pronunciation: 'sa-AT kaç',
                category: 'time',
                difficulty: 'beginner',
                context: 'everyday',
                usage: 'Basic phrase for asking about time',
                examples: [
                    {
                        situation: 'Checking the time',
                        turkish: 'Affedersiniz, saat kaç?',
                        arabic: 'عفواً، كم الساعة؟'
                    }
                ]
            }
        ];
    }
    
    /**
     * Apply category and difficulty filters
     */
    applyFilters() {
        let filteredPhrases = [...this.phrases];
        
        // Apply category filter
        if (this.selectedCategory !== 'all') {
            filteredPhrases = filteredPhrases.filter(phrase => phrase.category === this.selectedCategory);
        }
        
        // Apply difficulty filter
        if (this.settings.difficultyFilter !== 'all') {
            filteredPhrases = filteredPhrases.filter(phrase => phrase.difficulty === this.settings.difficultyFilter);
        }
        
        this.phrases = filteredPhrases;
        this.currentIndex = 0;
        this.isFlipped = false;
        
        this.updateState({
            totalPhrases: this.phrases.length,
            currentIndex: 0
        });
    }
    
    /**
     * Render phrase interface
     */
    render() {
        if (!this.container) {
            throw new Error('Container not available for phrase mode');
        }
        
        this.clearContainer();
        
        if (this.phrases.length === 0) {
            this.renderNoPhrasesMessage();
            return;
        }
        
        // Create main phrase interface
        const phraseInterface = this.createElement('div', ['phrase-mode-interface'], {}, `
            ${this.renderPhraseHeader()}
            ${this.renderFilters()}
            ${this.renderProgressSection()}
            <div class="phrase-container-wrapper">
                ${this.renderPhraseCard()}
            </div>
            ${this.renderPhraseControls()}
        `);
        
        this.appendToContainer(phraseInterface);
        
        // Setup phrase-specific event listeners
        this.setupPhraseEvents();
        
        // Auto-pronounce if enabled
        if (this.settings.autoPlay && this.settings.enableTTS) {
            this.pronounceCurrentPhrase();
        }
    }
    
    /**
     * Render phrase header
     */
    renderPhraseHeader() {
        return `
            <div class="phrase-header">
                <div class="phrase-title">
                    <i class="fas fa-comment-dots"></i>
                    <h2>العبارات والتعابير الشائعة</h2>
                </div>
                <div class="phrase-description">
                    <p>تعلم العبارات التركية المفيدة للحياة اليومية</p>
                </div>
            </div>
        `;
    }
    
    /**
     * Render filter controls
     */
    renderFilters() {
        const categories = [...new Set(this.phrases.map(p => p.category))];
        const difficulties = ['beginner', 'intermediate', 'advanced'];
        
        return `
            <div class="phrase-filters">
                <div class="filter-group">
                    <label class="filter-label">الفئة:</label>
                    <select class="filter-select" data-filter="category">
                        <option value="all">جميع الفئات</option>
                        ${categories.map(cat => `
                            <option value="${cat}" ${this.selectedCategory === cat ? 'selected' : ''}>
                                ${this.getCategoryName(cat)}
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">المستوى:</label>
                    <select class="filter-select" data-filter="difficulty">
                        <option value="all">جميع المستويات</option>
                        ${difficulties.map(diff => `
                            <option value="${diff}" ${this.settings.difficultyFilter === diff ? 'selected' : ''}>
                                ${this.getDifficultyName(diff)}
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="filter-actions">
                    <button class="filter-btn" data-action="reset-filters">
                        <i class="fas fa-undo"></i>
                        إعادة تعيين
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Render progress section
     */
    renderProgressSection() {
        const progress = this.state.totalPhrases > 0 ? (this.currentIndex / this.state.totalPhrases) * 100 : 0;
        
        return `
            <div class="phrase-progress-section">
                <div class="phrase-progress-info">
                    <span class="progress-text">العبارة ${this.currentIndex + 1} من ${this.state.totalPhrases}</span>
                    <span class="category-text">${this.getCurrentPhraseCategory()}</span>
                </div>
                <div class="phrase-progress-bar">
                    <div class="phrase-progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render phrase card
     */
    renderPhraseCard() {
        const currentPhrase = this.getCurrentPhrase();
        if (!currentPhrase) {
            return '<div class="no-phrases-message">لا توجد عبارات متاحة</div>';
        }
        
        return `
            <div class="phrase-card-container">
                <div class="phrase-card ${this.isFlipped ? 'flipped' : ''}" id="phrase-card">
                    <!-- Front Side -->
                    <div class="phrase-front">
                        <div class="phrase-turkish-section">
                            <div class="phrase-turkish">${currentPhrase.turkish}</div>
                            ${currentPhrase.pronunciation ? `<div class="phrase-pronunciation">[${currentPhrase.pronunciation}]</div>` : ''}
                        </div>
                        
                        <div class="phrase-context-badges">
                            <span class="context-badge ${currentPhrase.context}">${this.getContextName(currentPhrase.context)}</span>
                            <span class="difficulty-badge ${currentPhrase.difficulty}">${this.getDifficultyName(currentPhrase.difficulty)}</span>
                        </div>
                        
                        <div class="phrase-tts-controls">
                            <button class="tts-btn phrase-tts-btn" data-action="speak-phrase" title="استمع للعبارة">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        
                        <div class="phrase-hint">اضغط لرؤية الترجمة والأمثلة</div>
                    </div>
                    
                    <!-- Back Side -->
                    <div class="phrase-back">
                        <div class="phrase-translation-section">
                            <div class="phrase-arabic">${currentPhrase.arabic}</div>
                            <div class="phrase-english">${currentPhrase.english}</div>
                        </div>
                        
                        ${currentPhrase.usage ? `
                            <div class="phrase-usage-section">
                                <h4>الاستخدام:</h4>
                                <p>${currentPhrase.usage}</p>
                            </div>
                        ` : ''}
                        
                        ${this.settings.showUsageExamples && currentPhrase.examples ? `
                            <div class="phrase-examples-section">
                                <h4>أمثلة الاستخدام:</h4>
                                ${currentPhrase.examples.map(example => `
                                    <div class="usage-example">
                                        <div class="example-situation">${example.situation}</div>
                                        <div class="example-turkish">
                                            ${example.turkish}
                                            <button class="tts-btn example-tts-btn" data-action="speak-example" data-text="${example.turkish}">
                                                <i class="fas fa-volume-up"></i>
                                            </button>
                                        </div>
                                        <div class="example-arabic">${example.arabic}</div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        ${currentPhrase.commonResponses ? `
                            <div class="phrase-responses-section">
                                <h4>ردود شائعة:</h4>
                                ${currentPhrase.commonResponses.map(response => `
                                    <div class="common-response">
                                        <div class="response-turkish">
                                            ${response.turkish}
                                            <button class="tts-btn response-tts-btn" data-action="speak-response" data-text="${response.turkish}">
                                                <i class="fas fa-volume-up"></i>
                                            </button>
                                        </div>
                                        <div class="response-arabic">${response.arabic}</div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <div class="phrase-hint">اضغط للعودة للجهة الأمامية</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render phrase controls
     */
    renderPhraseControls() {
        return `
            <div class="phrase-controls">
                <div class="navigation-controls">
                    <button class="phrase-control-btn" data-action="previous" ${this.currentIndex === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                        <span>السابق</span>
                    </button>
                    
                    <button class="phrase-control-btn flip-btn" data-action="flip">
                        <i class="fas fa-sync-alt"></i>
                        <span>اقلب البطاقة</span>
                    </button>
                    
                    <button class="phrase-control-btn" data-action="next" ${this.currentIndex >= this.phrases.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                        <span>التالي</span>
                    </button>
                </div>
                
                <div class="learning-controls">
                    <button class="learning-btn known" data-action="mark-known">
                        <i class="fas fa-check-circle"></i>
                        <span>أعرفها</span>
                    </button>
                    
                    <button class="learning-btn learning" data-action="mark-learning">
                        <i class="fas fa-book"></i>
                        <span>أتعلمها</span>
                    </button>
                    
                    <button class="learning-btn difficult" data-action="mark-difficult">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>صعبة</span>
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Render no phrases message
     */
    renderNoPhrasesMessage() {
        const noPhrasesHTML = `
            <div class="no-phrases-available">
                <div class="no-phrases-icon">
                    <i class="fas fa-comment-slash text-6xl text-gray-400"></i>
                </div>
                <h3 class="no-phrases-title">لا توجد عبارات متاحة</h3>
                <p class="no-phrases-description">
                    لا توجد عبارات تتطابق مع المرشحات المحددة
                </p>
                <div class="no-phrases-actions">
                    <button class="btn-action btn-primary" data-action="reset-filters">
                        <i class="fas fa-undo"></i>
                        إعادة تعيين المرشحات
                    </button>
                    <button class="btn-action btn-secondary" data-action="home">
                        <i class="fas fa-home"></i>
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        `;
        
        this.container.innerHTML = noPhrasesHTML;
    }
    
    /**
     * Setup phrase-specific event listeners
     */
    setupPhraseEvents() {
        if (!this.container) return;
        
        // Unified event delegation
        this.container.addEventListener('click', (event) => {
            event.stopPropagation();
            
            const action = event.target.closest('[data-action]')?.getAttribute('data-action');
            const text = event.target.closest('[data-text]')?.getAttribute('data-text');
            
            if (action) {
                this.handleAction(action, event, text);
            } else if (event.target.closest('.phrase-card')) {
                this.handlePhraseCardClick(event);
            }
        });
        
        // Filter change events
        this.container.addEventListener('change', (event) => {
            const filter = event.target.getAttribute('data-filter');
            if (filter) {
                this.handleFilterChange(filter, event.target.value);
            }
        });
    }
    
    /**
     * Handle action button clicks
     */
    handleAction(action, event, text) {
        switch (action) {
            case 'previous':
                this.previousPhrase();
                break;
            case 'next':
                this.nextPhrase();
                break;
            case 'flip':
                this.flipCard();
                break;
            case 'speak-phrase':
                this.pronounceCurrentPhrase();
                break;
            case 'speak-example':
            case 'speak-response':
                if (text) {
                    this.speakText(text);
                }
                break;
            case 'mark-known':
                this.markPhraseStatus('known');
                break;
            case 'mark-learning':
                this.markPhraseStatus('learning');
                break;
            case 'mark-difficult':
                this.markPhraseStatus('difficult');
                break;
            case 'reset-filters':
                this.resetFilters();
                break;
            case 'home':
                this.goHome();
                break;
        }
    }
    
    /**
     * Handle phrase card click for flipping
     */
    handlePhraseCardClick(event) {
        const phraseCard = event.target.closest('.phrase-card');
        if (!phraseCard || phraseCard.classList.contains('transitioning')) {
            return;
        }
        
        this.flipCard();
    }
    
    /**
     * Handle filter changes
     */
    handleFilterChange(filterType, value) {
        switch (filterType) {
            case 'category':
                this.selectedCategory = value;
                break;
            case 'difficulty':
                this.settings.difficultyFilter = value;
                break;
        }
        
        // Re-apply filters and re-render
        this.applyFilters();
        this.render();
        
        this.trackEvent('filter_changed', { filterType, value });
    }
    
    /**
     * Flip the phrase card
     */
    flipCard() {
        const phraseCard = this.container.querySelector('.phrase-card');
        if (!phraseCard || phraseCard.classList.contains('transitioning')) {
            return;
        }
        
        // Add transitioning state
        phraseCard.classList.add('transitioning');
        
        // Toggle flip state
        this.isFlipped = !this.isFlipped;
        phraseCard.classList.toggle('flipped', this.isFlipped);
        
        // Play appropriate audio
        if (this.settings.enableTTS && window.turkishTTS) {
            setTimeout(() => {
                if (this.isFlipped) {
                    // On back side, speak the phrase again for reinforcement
                    this.pronounceCurrentPhrase();
                } else {
                    // On front side, speak the phrase
                    this.pronounceCurrentPhrase();
                }
            }, 200);
        }
        
        // Remove transitioning state
        setTimeout(() => {
            phraseCard.classList.remove('transitioning');
        }, 600);
        
        this.trackEvent('card_flipped', { 
            direction: this.isFlipped ? 'to_back' : 'to_front',
            phraseId: this.getCurrentPhrase()?.id 
        });
    }
    
    /**
     * Move to next phrase
     */
    nextPhrase() {
        if (this.currentIndex < this.phrases.length - 1) {
            this.currentIndex++;
            this.isFlipped = false;
            this.updateState({ currentIndex: this.currentIndex });
            this.render();
            this.trackEvent('phrase_advanced', { newIndex: this.currentIndex });
        }
    }
    
    /**
     * Move to previous phrase
     */
    previousPhrase() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.isFlipped = false;
            this.updateState({ currentIndex: this.currentIndex });
            this.render();
            this.trackEvent('phrase_previous', { newIndex: this.currentIndex });
        }
    }
    
    /**
     * Mark phrase learning status
     */
    markPhraseStatus(status) {
        const currentPhrase = this.getCurrentPhrase();
        if (!currentPhrase) return;
        
        // Record the status
        this.responses.push({
            phraseId: currentPhrase.id,
            phrase: currentPhrase.turkish,
            status: status,
            timestamp: Date.now(),
            mode: 'phrase'
        });
        
        // Update metrics
        this.metrics.interactions++;
        if (status === 'known') {
            this.updateState({ learned: this.state.learned + 1 });
        }
        
        // Show feedback
        const feedbackMessages = {
            known: 'ممتاز! أتقنت هذه العبارة! 🎉',
            learning: 'جيد! استمر في التعلم! 📚',
            difficult: 'لا بأس، العبارات الصعبة تحتاج وقت أكثر 💪'
        };
        
        const feedbackTypes = {
            known: 'success',
            learning: 'info',
            difficult: 'warning'
        };
        
        this.showNotification(feedbackMessages[status], feedbackTypes[status]);
        
        // Update progress
        this.updateProgress({
            phraseId: currentPhrase.id,
            status,
            isKnown: status === 'known'
        });
        
        // Auto-advance after marking
        setTimeout(() => {
            if (this.currentIndex < this.phrases.length - 1) {
                this.nextPhrase();
            } else {
                this.completeSession();
            }
        }, 1500);
        
        this.trackEvent('phrase_marked', {
            phraseId: currentPhrase.id,
            status
        });
    }
    
    /**
     * Reset all filters
     */
    resetFilters() {
        this.selectedCategory = 'all';
        this.settings.difficultyFilter = 'all';
        
        // Reload original phrases
        this.loadPhrases().then(() => {
            this.applyFilters();
            this.render();
            this.trackEvent('filters_reset');
        });
    }
    
    /**
     * Pronounce current phrase
     */
    async pronounceCurrentPhrase() {
        const currentPhrase = this.getCurrentPhrase();
        if (currentPhrase && this.settings.enableTTS && window.speakTurkishSentence) {
            try {
                await window.speakTurkishSentence(currentPhrase.turkish);
            } catch (error) {
                console.log('Phrase pronunciation failed:', error);
            }
        }
    }
    
    /**
     * Speak any text
     */
    async speakText(text) {
        if (this.settings.enableTTS && window.speakTurkishSentence) {
            try {
                await window.speakTurkishSentence(text);
            } catch (error) {
                console.log('Text pronunciation failed:', error);
            }
        }
    }
    
    /**
     * Complete phrase session
     */
    completeSession() {
        const sessionStats = {
            mode: 'phrase',
            totalPhrases: this.phrases.length,
            reviewed: this.responses.length,
            learned: this.state.learned,
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
            <div class="phrase-completion">
                <div class="completion-header">
                    <i class="fas fa-comment-dots text-6xl text-purple-500 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">أحسنت! تمت مراجعة العبارات! 🎉</h2>
                    <p class="text-gray-600">جلسة تعلم العبارات</p>
                </div>
                
                <div class="completion-stats">
                    <div class="stat-item">
                        <span class="stat-label">إجمالي العبارات:</span>
                        <span class="stat-value">${stats.totalPhrases}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">تمت مراجعتها:</span>
                        <span class="stat-value">${stats.reviewed}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">أتقنتها:</span>
                        <span class="stat-value known-text">${stats.learned}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">الوقت المستغرق:</span>
                        <span class="stat-value">${stats.timeSpent} دقيقة</span>
                    </div>
                </div>
                
                <div class="completion-actions">
                    <button class="btn-action btn-primary" data-action="restart-phrases">
                        <i class="fas fa-redo"></i>
                        مراجعة العبارات مرة أخرى
                    </button>
                    <button class="btn-action btn-secondary" data-action="new-category">
                        <i class="fas fa-plus"></i>
                        فئة أخرى
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
                case 'restart-phrases':
                    this.restart();
                    break;
                case 'new-category':
                    this.resetFilters();
                    break;
                case 'home':
                    this.goHome();
                    break;
            }
        });
    }
    
    /**
     * Restart phrase session
     */
    async restart() {
        this.currentIndex = 0;
        this.responses = [];
        this.isFlipped = false;
        
        this.updateState({
            currentIndex: 0,
            learned: 0
        });
        
        this.render();
        this.trackEvent('session_restarted');
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
     * Get current phrase
     */
    getCurrentPhrase() {
        return this.phrases[this.currentIndex] || null;
    }
    
    /**
     * Get current phrase category name
     */
    getCurrentPhraseCategory() {
        const phrase = this.getCurrentPhrase();
        return phrase ? this.getCategoryName(phrase.category) : '';
    }
    
    /**
     * Get category name in Arabic
     */
    getCategoryName(category) {
        const names = {
            greetings: 'التحيات',
            travel: 'السفر',
            food: 'الطعام',
            shopping: 'التسوق',
            polite: 'الأدب والاحترام',
            time: 'الوقت',
            directions: 'الاتجاهات',
            emergency: 'الطوارئ'
        };
        return names[category] || category;
    }
    
    /**
     * Get difficulty name in Arabic
     */
    getDifficultyName(difficulty) {
        const names = {
            beginner: 'مبتدئ',
            intermediate: 'متوسط',
            advanced: 'متقدم'
        };
        return names[difficulty] || difficulty;
    }
    
    /**
     * Get context name in Arabic
     */
    getContextName(context) {
        const names = {
            formal: 'رسمي',
            informal: 'غير رسمي',
            casual: 'عادي',
            polite: 'مهذب',
            everyday: 'يومي',
            business: 'عمل',
            shopping: 'تسوق',
            question: 'سؤال'
        };
        return names[context] || context;
    }
    
    /**
     * Cleanup phrase mode
     */
    async cleanup() {
        // Stop any ongoing TTS
        if (window.turkishTTS) {
            window.turkishTTS.stop();
        }
        
        console.log('📝 Phrase mode cleaned up');
    }
    
    /**
     * Handle key press events
     */
    handleKeyPress(event) {
        super.handleKeyPress(event);
        
        // Phrase-specific keyboard shortcuts
        switch (event.key.toLowerCase()) {
            case ' ': // Spacebar to flip
                event.preventDefault();
                this.flipCard();
                break;
            case 'arrowleft': // Left arrow for previous
                event.preventDefault();
                this.previousPhrase();
                break;
            case 'arrowright': // Right arrow for next
                event.preventDefault();
                this.nextPhrase();
                break;
            case '1': // Number keys for marking status
                event.preventDefault();
                this.markPhraseStatus('difficult');
                break;
            case '2':
                event.preventDefault();
                this.markPhraseStatus('learning');
                break;
            case '3':
                event.preventDefault();
                this.markPhraseStatus('known');
                break;
        }
    }
    
    /**
     * Get help content for phrase mode
     */
    getHelpContent() {
        return `
            <div style="text-align: right; line-height: 1.6;">
                <h4>📝 نمط العبارات والتعابير</h4>
                <p><strong>كيفية الاستخدام:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>اقرأ العبارة التركية واستمع لنطقها</li>
                    <li>اقلب البطاقة لرؤية الترجمة والأمثلة</li>
                    <li>اقرأ أمثلة الاستخدام والردود الشائعة</li>
                    <li>قيّم مستوى معرفتك بالعبارة</li>
                </ul>
                
                <p><strong>المرشحات المتاحة:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>تصنيف حسب الفئة (تحيات، سفر، طعام، إلخ)</li>
                    <li>تصنيف حسب المستوى (مبتدئ، متوسط، متقدم)</li>
                </ul>
                
                <p><strong>اختصارات لوحة المفاتيح:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>مسطرة المسافة: قلب البطاقة</li>
                    <li>← →: التنقل بين العبارات</li>
                    <li>1، 2، 3: تقييم صعب، أتعلم، أتقن</li>
                    <li>Ctrl+H: عرض المساعدة</li>
                    <li>Escape: الخروج من النمط</li>
                </ul>
                
                <p><strong>نصائح للتعلم:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>ركز على السياق والاستخدام</li>
                    <li>تدرب على العبارات في جمل مختلفة</li>
                    <li>انتبه للفرق بين الرسمي وغير الرسمي</li>
                    <li>استمع للردود الشائعة لتتعلم التفاعل</li>
                </ul>
            </div>
        `;
    }
}

// Register phrase mode with the manager when loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.learningModeManager) {
        window.learningModeManager.registerMode('phrase', PhraseMode, {
            name: 'العبارات والتعابير',
            icon: '📝',
            description: 'تعلم العبارات التركية الشائعة والمفيدة',
            containerId: 'phrase-mode-container',
            dependencies: [],
            version: '2.0.0'
        });
        
        console.log('📝 Phrase Mode registered successfully');
    }
});

// Export for direct use
window.PhraseMode = PhraseMode;