// 💬 Conversation Learning Mode - Containerized
// Independent dialogue practice system

class ConversationMode extends LearningModeBase {
    constructor(config = {}) {
        super(config);
        
        // Conversation-specific properties
        this.conversations = [];
        this.currentConversation = null;
        this.currentDialogueIndex = 0;
        this.userResponses = [];
        this.isPlayingDialogue = false;
        
        // Conversation settings
        this.settings = {
            autoPlay: true,
            showTranslation: true,
            playbackSpeed: 1.0,
            enableTTS: true,
            showHints: true,
            ...this.options.settings
        };
        
        console.log('💬 Conversation Mode container created');
    }
    
    /**
     * Initialize conversation mode
     */
    async init() {
        try {
            // Load conversations data
            if (this.data.conversations) {
                this.conversations = this.data.conversations;
            } else {
                await this.loadConversations();
            }
            
            if (this.conversations.length === 0) {
                throw new Error('No conversations available');
            }
            
            // Initialize state
            this.updateState({
                totalConversations: this.conversations.length,
                currentConversation: null,
                completed: 0,
                accuracy: 0
            });
            
            console.log(`💬 Conversation mode initialized with ${this.conversations.length} conversations`);
            
        } catch (error) {
            console.error('❌ Failed to initialize conversation mode:', error);
            throw error;
        }
    }
    
    /**
     * Load conversations from API or fallback data
     */
    async loadConversations() {
        // Always use the built-in conversations for now.
        this.conversations = this.getBuiltInConversations();
    }
    
    /**
     * Get built-in conversation data
     */
    getBuiltInConversations() {
        return [
            {
                id: 'greeting_restaurant',
                title: 'في المطعم',
                titleArabic: 'في المطعم',
                category: 'food',
                difficulty: 'beginner',
                description: 'محادثة أساسية في مطعم تركي',
                dialogues: [
                    {
                        id: 1,
                        speaker: 'waiter',
                        speakerName: 'النادل',
                        turkish: 'Merhaba! Hoş geldiniz. Kaç kişilik masa istiyorsunuz?',
                        arabic: 'مرحباً! أهلاً وسهلاً. لكم شخص تريدون طاولة؟',
                        english: 'Hello! Welcome. For how many people do you want a table?',
                        pronunciation: 'mer-ha-BA! hoş gel-di-NIZ. kaç ki-şi-LİK ma-sa is-ti-yo-ru-NUZ?'
                    },
                    {
                        id: 2,
                        speaker: 'customer',
                        speakerName: 'الزبون',
                        turkish: 'İki kişilik masa istiyoruz, lütfen.',
                        arabic: 'نريد طاولة لشخصين، من فضلك.',
                        english: 'We want a table for two people, please.',
                        pronunciation: 'i-ki ki-şi-LİK ma-sa is-ti-yo-ruz, lüt-FEN.',
                        isUserTurn: true
                    },
                    {
                        id: 3,
                        speaker: 'waiter',
                        speakerName: 'النادل',
                        turkish: 'Tabii! Bu masa size uygun mu?',
                        arabic: 'بالطبع! هل هذه الطاولة مناسبة لكم؟',
                        english: 'Of course! Is this table suitable for you?',
                        pronunciation: 'ta-Bİİ! bu ma-sa si-ze uy-GUN mu?'
                    },
                    {
                        id: 4,
                        speaker: 'customer',
                        speakerName: 'الزبون',
                        turkish: 'Evet, çok güzel. Teşekkür ederiz.',
                        arabic: 'نعم، جميلة جداً. شكراً لك.',
                        english: 'Yes, very nice. Thank you.',
                        pronunciation: 'e-VET, çok gü-ZEL. te-şek-KÜR e-de-RİZ.',
                        isUserTurn: true
                    }
                ]
            },
            {
                id: 'asking_directions',
                title: 'السؤال عن الاتجاهات',
                titleArabic: 'السؤال عن الاتجاهات',
                category: 'directions',
                difficulty: 'beginner',
                description: 'كيفية السؤال عن الطريق في تركيا',
                dialogues: [
                    {
                        id: 1,
                        speaker: 'tourist',
                        speakerName: 'السائح',
                        turkish: 'Affedersiniz, Taksim Meydanı\'na nasıl gidebilirim?',
                        arabic: 'عفواً، كيف يمكنني الذهاب إلى ميدان تقسيم؟',
                        english: 'Excuse me, how can I get to Taksim Square?',
                        pronunciation: 'af-fe-der-si-NIZ, tak-SİM mey-da-nı\'na na-sıl gi-de-bi-li-RİM?',
                        isUserTurn: true
                    },
                    {
                        id: 2,
                        speaker: 'local',
                        speakerName: 'المواطن المحلي',
                        turkish: 'Düz gidin, sonra sola dönün. Metro istasyonu orada.',
                        arabic: 'اذهب مستقيماً، ثم انعطف يساراً. محطة المترو هناك.',
                        english: 'Go straight, then turn left. The metro station is there.',
                        pronunciation: 'düz gi-DİN, son-ra so-la dö-NÜN. met-ro is-tas-yo-nu o-ra-DA.'
                    },
                    {
                        id: 3,
                        speaker: 'tourist',
                        speakerName: 'السائح',
                        turkish: 'Ne kadar sürer oraya gitmek?',
                        arabic: 'كم يستغرق الوصول إلى هناك؟',
                        english: 'How long does it take to get there?',
                        pronunciation: 'ne ka-dar sü-RER o-ra-ya git-MEK?',
                        isUserTurn: true
                    },
                    {
                        id: 4,
                        speaker: 'local',
                        speakerName: 'المواطن المحلي',
                        turkish: 'Metro ile yaklaşık on dakika sürer.',
                        arabic: 'بالمترو حوالي عشر دقائق.',
                        english: 'By metro it takes about ten minutes.',
                        pronunciation: 'met-ro i-le yak-la-şık on da-ki-ka sü-RER.'
                    }
                ]
            }
        ];
    }
    
    /**
     * Render conversation interface
     */
    render() {
        if (!this.container) {
            throw new Error('Container not available for conversation mode');
        }
        
        this.clearContainer();
        
        // Show conversation selection or active conversation
        if (!this.currentConversation) {
            this.renderConversationSelection();
        } else {
            this.renderActiveConversation();
        }
        
        // Setup conversation-specific event listeners
        this.setupConversationEvents();
    }
    
    /**
     * Render conversation selection screen
     */
    renderConversationSelection() {
        const selectionHTML = `
            <div class="conversation-selection">
                <div class="conversation-header">
                    <h2>💬 اختر محادثة للتدريب</h2>
                    <p class="conversation-description">
                        تدرب على المحادثات التركية الحقيقية في مواقف مختلفة
                    </p>
                </div>
                
                <div class="conversation-list">
                    ${this.conversations.map(conversation => this.renderConversationCard(conversation)).join('')}
                </div>
                
                <div class="conversation-tips">
                    <h3>💡 نصائح للمحادثة:</h3>
                    <ul>
                        <li>استمع جيداً لنطق كل جملة</li>
                        <li>كرر الجمل بصوت عالٍ</li>
                        <li>انتبه للنبرة والإيقاع</li>
                        <li>لا تتردد في إعادة تشغيل الحوار</li>
                    </ul>
                </div>
            </div>
        `;
        
        this.container.innerHTML = selectionHTML;
    }
    
    /**
     * Render conversation card
     */
    renderConversationCard(conversation) {
        const difficultyColors = {
            beginner: 'bg-green-100 text-green-800',
            intermediate: 'bg-yellow-100 text-yellow-800',
            advanced: 'bg-red-100 text-red-800'
        };
        
        const difficultyNames = {
            beginner: 'مبتدئ',
            intermediate: 'متوسط',
            advanced: 'متقدم'
        };
        
        return `
            <div class="conversation-card" data-conversation-id="${conversation.id}">
                <div class="conversation-card-header">
                    <h3 class="conversation-title">${conversation.titleArabic}</h3>
                    <span class="difficulty-badge ${difficultyColors[conversation.difficulty]}">
                        ${difficultyNames[conversation.difficulty]}
                    </span>
                </div>
                
                <div class="conversation-card-body">
                    <p class="conversation-description">${conversation.description}</p>
                    <div class="conversation-meta">
                        <span class="dialogue-count">
                            <i class="fas fa-comments"></i>
                            ${conversation.dialogues.length} جملة
                        </span>
                        <span class="category-tag">
                            ${this.getCategoryIcon(conversation.category)}
                            ${this.getCategoryName(conversation.category)}
                        </span>
                    </div>
                </div>
                
                <div class="conversation-card-actions">
                    <button class="btn-start-conversation" data-action="start-conversation" data-id="${conversation.id}">
                        <i class="fas fa-play"></i>
                        ابدأ المحادثة
                    </button>
                    <button class="btn-preview-conversation" data-action="preview-conversation" data-id="${conversation.id}">
                        <i class="fas fa-eye"></i>
                        معاينة
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Render active conversation
     */
    renderActiveConversation() {
        const conversation = this.currentConversation;
        const currentDialogue = conversation.dialogues[this.currentDialogueIndex];
        const progress = ((this.currentDialogueIndex + 1) / conversation.dialogues.length) * 100;
        
        const conversationHTML = `
            <div class="active-conversation">
                <!-- Conversation Header -->
                <div class="conversation-header">
                    <div class="conversation-info">
                        <h2>${conversation.titleArabic}</h2>
                        <p class="conversation-context">${conversation.description}</p>
                    </div>
                    <button class="btn-close-conversation" data-action="close-conversation">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Progress Bar -->
                <div class="conversation-progress">
                    <div class="progress-info">
                        <span>الجملة ${this.currentDialogueIndex + 1} من ${conversation.dialogues.length}</span>
                        <span>${Math.round(progress)}% مكتمل</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <!-- Dialogue Display -->
                <div class="dialogue-container">
                    ${this.renderCurrentDialogue(currentDialogue)}
                </div>
                
                <!-- Conversation Controls -->
                <div class="conversation-controls">
                    <button class="control-btn" data-action="previous-dialogue" ${this.currentDialogueIndex === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                        السابق
                    </button>
                    
                    <button class="control-btn play-btn" data-action="play-dialogue">
                        <i class="fas ${this.isPlayingDialogue ? 'fa-pause' : 'fa-play'}"></i>
                        ${this.isPlayingDialogue ? 'إيقاف' : 'تشغيل'}
                    </button>
                    
                    <button class="control-btn" data-action="repeat-dialogue">
                        <i class="fas fa-redo"></i>
                        إعادة
                    </button>
                    
                    ${currentDialogue.isUserTurn ? `
                        <button class="control-btn practice-btn" data-action="practice-response">
                            <i class="fas fa-microphone"></i>
                            تدرب
                        </button>
                    ` : ''}
                    
                    <button class="control-btn" data-action="next-dialogue" ${this.currentDialogueIndex >= conversation.dialogues.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                        التالي
                    </button>
                </div>
                
                <!-- Settings Panel -->
                ${this.renderConversationSettings()}
            </div>
        `;
        
        this.container.innerHTML = conversationHTML;
    }
    
    /**
     * Render current dialogue
     */
    renderCurrentDialogue(dialogue) {
        const speakerClass = dialogue.speaker === 'customer' || dialogue.speaker === 'tourist' ? 'user-speaker' : 'other-speaker';
        const isUserTurn = dialogue.isUserTurn;
        
        return `
            <div class="dialogue-bubble-container ${speakerClass}">
                <div class="speaker-info">
                    <div class="speaker-avatar ${dialogue.speaker}">
                        ${this.getSpeakerIcon(dialogue.speaker)}
                    </div>
                    <span class="speaker-name">${dialogue.speakerName}</span>
                    ${isUserTurn ? '<span class="user-turn-indicator">دورك!</span>' : ''}
                </div>
                
                <div class="dialogue-bubble ${isUserTurn ? 'user-turn' : ''}">
                    <!-- Turkish Text -->
                    <div class="dialogue-turkish">
                        ${dialogue.turkish}
                        <button class="tts-btn dialogue-tts" data-action="speak-dialogue" data-text="${dialogue.turkish}">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                    
                    <!-- Pronunciation -->
                    <div class="dialogue-pronunciation">
                        [${dialogue.pronunciation}]
                    </div>
                    
                    ${this.settings.showTranslation ? `
                        <!-- Arabic Translation -->
                        <div class="dialogue-arabic">
                            <i class="fas fa-language"></i>
                            ${dialogue.arabic}
                        </div>
                        
                        <!-- English Translation -->
                        <div class="dialogue-english">
                            <i class="fas fa-globe"></i>
                            ${dialogue.english}
                        </div>
                    ` : ''}
                    
                    ${isUserTurn ? `
                        <div class="user-response-area">
                            <p class="practice-instruction">
                                💡 الآن دورك! حاول قول هذه الجملة بصوت عالٍ
                            </p>
                            <div class="response-options">
                                <button class="response-btn confident" data-response="confident">
                                    <i class="fas fa-check-circle"></i>
                                    قلتها بثقة
                                </button>
                                <button class="response-btn struggling" data-response="struggling">
                                    <i class="fas fa-question-circle"></i>
                                    أحتاج تدريب أكثر
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    /**
     * Render conversation settings
     */
    renderConversationSettings() {
        return `
            <div class="conversation-settings" style="display: none;">
                <div class="settings-header">
                    <h3>إعدادات المحادثة</h3>
                    <button class="btn-toggle-settings" data-action="toggle-settings">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
                
                <div class="settings-content">
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" ${this.settings.showTranslation ? 'checked' : ''} data-setting="showTranslation">
                            <span>إظهار الترجمة</span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" ${this.settings.autoPlay ? 'checked' : ''} data-setting="autoPlay">
                            <span>تشغيل تلقائي</span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label class="setting-label">سرعة التشغيل:</label>
                        <input type="range" min="0.5" max="2" step="0.1" value="${this.settings.playbackSpeed}" data-setting="playbackSpeed">
                        <span class="speed-display">${this.settings.playbackSpeed}x</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Setup conversation-specific event listeners
     */
    setupConversationEvents() {
        if (!this.container) return;
        
        // Unified event delegation
        this.container.addEventListener('click', (event) => {
            event.stopPropagation();
            
            const action = event.target.closest('[data-action]')?.getAttribute('data-action');
            const conversationId = event.target.closest('[data-id]')?.getAttribute('data-id');
            const response = event.target.closest('[data-response]')?.getAttribute('data-response');
            const setting = event.target.closest('[data-setting]')?.getAttribute('data-setting');
            
            if (action) {
                this.handleAction(action, event, conversationId);
            } else if (response) {
                this.recordUserResponse(response);
            } else if (setting) {
                this.updateSetting(setting, event.target);
            }
        });
        
        // Settings input changes
        this.container.addEventListener('change', (event) => {
            const setting = event.target.getAttribute('data-setting');
            if (setting) {
                this.updateSetting(setting, event.target);
            }
        });
    }
    
    /**
     * Handle action button clicks
     */
    handleAction(action, event, conversationId) {
        switch (action) {
            case 'start-conversation':
                this.startConversation(conversationId);
                break;
            case 'preview-conversation':
                this.previewConversation(conversationId);
                break;
            case 'close-conversation':
                this.closeConversation();
                break;
            case 'previous-dialogue':
                this.previousDialogue();
                break;
            case 'next-dialogue':
                this.nextDialogue();
                break;
            case 'play-dialogue':
                this.playCurrentDialogue();
                break;
            case 'repeat-dialogue':
                this.repeatDialogue();
                break;
            case 'practice-response':
                this.practiceResponse();
                break;
            case 'speak-dialogue':
                const text = event.target.closest('[data-text]')?.getAttribute('data-text');
                if (text) {
                    this.speakText(text);
                }
                break;
            case 'toggle-settings':
                this.toggleSettings();
                break;
        }
    }
    
    /**
     * Start conversation by ID
     */
    startConversation(conversationId) {
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (!conversation) {
            this.showNotification('المحادثة غير موجودة', 'error');
            return;
        }
        
        this.currentConversation = conversation;
        this.currentDialogueIndex = 0;
        this.userResponses = [];
        
        this.updateState({
            currentConversation: conversationId,
            currentDialogue: 0
        });
        
        this.render();
        
        // Auto-play first dialogue if enabled
        if (this.settings.autoPlay) {
            setTimeout(() => {
                this.playCurrentDialogue();
            }, 500);
        }
        
        this.trackEvent('conversation_started', { conversationId });
    }
    
    /**
     * Preview conversation
     */
    previewConversation(conversationId) {
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (!conversation) return;
        
        const previewContent = `
            <div style="text-align: right; line-height: 1.8;">
                <h4>${conversation.titleArabic}</h4>
                <p style="color: #666; margin-bottom: 1rem;">${conversation.description}</p>
                
                <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 1rem; border-radius: 8px;">
                    ${conversation.dialogues.map((dialogue, index) => `
                        <div style="margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;">
                            <strong style="color: #2563eb;">${dialogue.speakerName}:</strong>
                            <div style="margin: 0.25rem 0;">${dialogue.turkish}</div>
                            <div style="color: #666; font-size: 0.9rem;">${dialogue.arabic}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 1rem; text-align: center;">
                    <button onclick="window.currentConversationMode?.startConversation('${conversationId}'); document.querySelector('.modal-close').click();" 
                            style="background: #2563eb; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">
                        ابدأ المحادثة
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('معاينة المحادثة', previewContent);
        this.trackEvent('conversation_previewed', { conversationId });
    }
    
    /**
     * Close current conversation
     */
    closeConversation() {
        if (this.currentConversation) {
            this.trackEvent('conversation_closed', {
                conversationId: this.currentConversation.id,
                progress: this.currentDialogueIndex / this.currentConversation.dialogues.length
            });
        }
        
        this.currentConversation = null;
        this.currentDialogueIndex = 0;
        this.isPlayingDialogue = false;
        
        this.updateState({
            currentConversation: null,
            currentDialogue: 0
        });
        
        this.render();
    }
    
    /**
     * Move to next dialogue
     */
    nextDialogue() {
        if (!this.currentConversation) return;
        
        if (this.currentDialogueIndex < this.currentConversation.dialogues.length - 1) {
            this.currentDialogueIndex++;
            this.updateState({ currentDialogue: this.currentDialogueIndex });
            this.render();
            
            // Auto-play if enabled
            if (this.settings.autoPlay) {
                setTimeout(() => {
                    this.playCurrentDialogue();
                }, 500);
            }
            
            this.trackEvent('dialogue_advanced', {
                conversationId: this.currentConversation.id,
                dialogueIndex: this.currentDialogueIndex
            });
        } else {
            // Conversation completed
            this.completeConversation();
        }
    }
    
    /**
     * Move to previous dialogue
     */
    previousDialogue() {
        if (!this.currentConversation || this.currentDialogueIndex === 0) return;
        
        this.currentDialogueIndex--;
        this.updateState({ currentDialogue: this.currentDialogueIndex });
        this.render();
        
        this.trackEvent('dialogue_previous', {
            conversationId: this.currentConversation.id,
            dialogueIndex: this.currentDialogueIndex
        });
    }
    
    /**
     * Play current dialogue
     */
    async playCurrentDialogue() {
        if (!this.currentConversation) return;
        
        const dialogue = this.currentConversation.dialogues[this.currentDialogueIndex];
        if (!dialogue) return;
        
        this.isPlayingDialogue = true;
        this.updatePlayButton();
        
        try {
            await this.speakText(dialogue.turkish);
        } catch (error) {
            console.log('Dialogue playback failed:', error);
        } finally {
            this.isPlayingDialogue = false;
            this.updatePlayButton();
        }
        
        this.trackEvent('dialogue_played', {
            conversationId: this.currentConversation.id,
            dialogueIndex: this.currentDialogueIndex
        });
    }
    
    /**
     * Repeat current dialogue
     */
    repeatDialogue() {
        this.playCurrentDialogue();
    }
    
    /**
     * Practice user response
     */
    practiceResponse() {
        const dialogue = this.currentConversation.dialogues[this.currentDialogueIndex];
        
        const practiceContent = `
            <div style="text-align: right; line-height: 1.6;">
                <h4>🎤 تدرب على النطق</h4>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <p><strong>الجملة التركية:</strong></p>
                    <p style="font-size: 1.2rem; color: #2563eb;">${dialogue.turkish}</p>
                    <p><strong>النطق:</strong></p>
                    <p style="font-style: italic; color: #666;">[${dialogue.pronunciation}]</p>
                    <p><strong>المعنى:</strong></p>
                    <p style="color: #059669;">${dialogue.arabic}</p>
                </div>
                
                <div style="text-align: center; margin: 1.5rem 0;">
                    <button onclick="window.currentConversationMode?.speakText('${dialogue.turkish.replace(/'/g, '\\\'')}')" 
                            style="background: #2563eb; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; margin: 0.5rem;">
                        <i class="fas fa-volume-up"></i> استمع مرة أخرى
                    </button>
                </div>
                
                <div style="background: #e0f2fe; padding: 1rem; border-radius: 8px;">
                    <h5>💡 نصائح للنطق:</h5>
                    <ul style="margin-right: 20px;">
                        <li>استمع للجملة عدة مرات</li>
                        <li>قسم الجملة إلى أجزاء صغيرة</li>
                        <li>ركز على النبرة والإيقاع</li>
                        <li>كرر النطق بصوت عالٍ</li>
                    </ul>
                </div>
            </div>
        `;
        
        this.showModal('تدرب على النطق', practiceContent);
        this.trackEvent('practice_requested', {
            conversationId: this.currentConversation.id,
            dialogueIndex: this.currentDialogueIndex
        });
    }
    
    /**
     * Record user response
     */
    recordUserResponse(responseType) {
        const dialogue = this.currentConversation.dialogues[this.currentDialogueIndex];
        
        const response = {
            dialogueId: dialogue.id,
            responseType: responseType,
            timestamp: Date.now(),
            conversationId: this.currentConversation.id
        };
        
        this.userResponses.push(response);
        
        // Update progress based on response
        this.updateProgress({
            dialogueId: dialogue.id,
            responseType,
            isConfident: responseType === 'confident'
        });
        
        // Show feedback
        const feedbackMessages = {
            confident: 'ممتاز! استمر هكذا! 🎉',
            struggling: 'لا بأس، التدريب يحسن الأداء! 💪'
        };
        
        this.showNotification(feedbackMessages[responseType], responseType === 'confident' ? 'success' : 'info');
        
        // Auto-advance after response
        setTimeout(() => {
            this.nextDialogue();
        }, 1500);
        
        this.trackEvent('user_response_recorded', {
            conversationId: this.currentConversation.id,
            dialogueIndex: this.currentDialogueIndex,
            responseType
        });
    }
    
    /**
     * Complete conversation
     */
    completeConversation() {
        const stats = this.calculateConversationStats();
        
        this.showCompletionScreen(stats);
        
        this.trackEvent('conversation_completed', {
            conversationId: this.currentConversation.id,
            stats
        });
        
        this.metrics.sessionsCompleted++;
    }
    
    /**
     * Calculate conversation statistics
     */
    calculateConversationStats() {
        const totalDialogues = this.currentConversation.dialogues.length;
        const userTurns = this.currentConversation.dialogues.filter(d => d.isUserTurn).length;
        const confidentResponses = this.userResponses.filter(r => r.responseType === 'confident').length;
        const strugglingResponses = this.userResponses.filter(r => r.responseType === 'struggling').length;
        
        return {
            conversationTitle: this.currentConversation.titleArabic,
            totalDialogues,
            userTurns,
            confidentResponses,
            strugglingResponses,
            accuracy: userTurns > 0 ? Math.round((confidentResponses / userTurns) * 100) : 0,
            timeSpent: Math.round((Date.now() - this.startTime) / 1000 / 60)
        };
    }
    
    /**
     * Show completion screen
     */
    showCompletionScreen(stats) {
        const completionHTML = `
            <div class="conversation-completion">
                <div class="completion-header">
                    <i class="fas fa-comments text-6xl text-blue-500 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">أحسنت! تمت المحادثة بنجاح! 🎉</h2>
                    <p class="text-gray-600">محادثة: ${stats.conversationTitle}</p>
                </div>
                
                <div class="completion-stats">
                    <div class="stat-item">
                        <span class="stat-label">إجمالي الجمل:</span>
                        <span class="stat-value">${stats.totalDialogues}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">جمل التدريب:</span>
                        <span class="stat-value">${stats.userTurns}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">إجابات واثقة:</span>
                        <span class="stat-value confident-text">${stats.confidentResponses}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">تحتاج تدريب:</span>
                        <span class="stat-value struggling-text">${stats.strugglingResponses}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">مستوى الثقة:</span>
                        <span class="stat-value">${stats.accuracy}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">الوقت المستغرق:</span>
                        <span class="stat-value">${stats.timeSpent} دقيقة</span>
                    </div>
                </div>
                
                <div class="completion-actions">
                    <button class="btn-action btn-primary" data-action="repeat-conversation">
                        <i class="fas fa-redo"></i>
                        إعادة المحادثة
                    </button>
                    <button class="btn-action btn-secondary" data-action="new-conversation">
                        <i class="fas fa-plus"></i>
                        محادثة جديدة
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
                case 'repeat-conversation':
                    this.startConversation(this.currentConversation.id);
                    break;
                case 'new-conversation':
                    this.closeConversation();
                    break;
                case 'home':
                    this.goHome();
                    break;
            }
        });
    }
    
    /**
     * Update setting
     */
    updateSetting(setting, element) {
        switch (setting) {
            case 'showTranslation':
                this.settings.showTranslation = element.checked;
                this.render(); // Re-render to show/hide translations
                break;
            case 'autoPlay':
                this.settings.autoPlay = element.checked;
                break;
            case 'playbackSpeed':
                this.settings.playbackSpeed = parseFloat(element.value);
                const speedDisplay = this.container.querySelector('.speed-display');
                if (speedDisplay) {
                    speedDisplay.textContent = `${this.settings.playbackSpeed}x`;
                }
                break;
        }
        
        this.trackEvent('setting_changed', { setting, value: element.value || element.checked });
    }
    
    /**
     * Toggle settings panel
     */
    toggleSettings() {
        const settingsPanel = this.container.querySelector('.conversation-settings');
        if (settingsPanel) {
            const isVisible = settingsPanel.style.display !== 'none';
            settingsPanel.style.display = isVisible ? 'none' : 'block';
        }
    }
    
    /**
     * Update play button state
     */
    updatePlayButton() {
        const playBtn = this.container.querySelector('.play-btn');
        if (playBtn) {
            const icon = playBtn.querySelector('i');
            const text = playBtn.querySelector('span') || playBtn;
            
            if (this.isPlayingDialogue) {
                icon.className = 'fas fa-pause';
                if (text) text.textContent = 'إيقاف';
            } else {
                icon.className = 'fas fa-play';
                if (text) text.textContent = 'تشغيل';
            }
        }
    }
    
    /**
     * Speak text using TTS
     */
    async speakText(text) {
        if (window.speakTurkishSentence) {
            try {
                await window.speakTurkishSentence(text);
            } catch (error) {
                console.log('TTS failed:', error);
            }
        }
    }
    
    /**
     * Get speaker icon
     */
    getSpeakerIcon(speaker) {
        const icons = {
            waiter: '👨‍🍳',
            customer: '👤',
            tourist: '🧳',
            local: '🏠',
            shopkeeper: '🛒',
            guide: '🗺️'
        };
        return icons[speaker] || '👤';
    }
    
    /**
     * Get category icon
     */
    getCategoryIcon(category) {
        const icons = {
            food: '🍽️',
            travel: '✈️',
            shopping: '🛒',
            directions: '🗺️',
            greetings: '👋',
            emergency: '🆘'
        };
        return icons[category] || '💬';
    }
    
    /**
     * Get category name in Arabic
     */
    getCategoryName(category) {
        const names = {
            food: 'الطعام',
            travel: 'السفر',
            shopping: 'التسوق',
            directions: 'الاتجاهات',
            greetings: 'التحيات',
            emergency: 'الطوارئ'
        };
        return names[category] || category;
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
     * Cleanup conversation mode
     */
    async cleanup() {
        // Stop any ongoing TTS
        if (window.turkishTTS) {
            window.turkishTTS.stop();
        }
        
        this.isPlayingDialogue = false;
        
        console.log('💬 Conversation mode cleaned up');
    }
    
    /**
     * Handle key press events
     */
    handleKeyPress(event) {
        super.handleKeyPress(event);
        
        // Conversation-specific keyboard shortcuts
        if (this.currentConversation) {
            switch (event.key.toLowerCase()) {
                case ' ': // Spacebar to play/pause
                    event.preventDefault();
                    this.playCurrentDialogue();
                    break;
                case 'arrowleft': // Left arrow for previous
                    event.preventDefault();
                    this.previousDialogue();
                    break;
                case 'arrowright': // Right arrow for next
                    event.preventDefault();
                    this.nextDialogue();
                    break;
                case 'r': // R to repeat
                    event.preventDefault();
                    this.repeatDialogue();
                    break;
            }
        }
    }
    
    /**
     * Get help content for conversation mode
     */
    getHelpContent() {
        return `
            <div style="text-align: right; line-height: 1.6;">
                <h4>💬 نمط المحادثة</h4>
                <p><strong>كيفية الاستخدام:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>استمع لكل جملة في المحادثة</li>
                    <li>عندما يأتي دورك، حاول قول الجملة بصوت عالٍ</li>
                    <li>قيّم مستوى ثقتك في النطق بصدق</li>
                    <li>استخدم أزرار التحكم للتنقل</li>
                </ul>
                
                <p><strong>اختصارات لوحة المفاتيح:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>مسطرة المسافة: تشغيل/إيقاف الحوار</li>
                    <li>← →: التنقل بين الجمل</li>
                    <li>R: إعادة تشغيل الجملة</li>
                    <li>Ctrl+H: عرض المساعدة</li>
                    <li>Escape: الخروج من النمط</li>
                </ul>
                
                <p><strong>نصائح للتدريب:</strong></p>
                <ul style="list-style-type: disc; margin-right: 20px;">
                    <li>استمع جيداً للنطق والنبرة</li>
                    <li>كرر الجمل عدة مرات</li>
                    <li>ركز على الكلمات الجديدة</li>
                    <li>تدرب على المحادثة كاملة عدة مرات</li>
                </ul>
            </div>
        `;
    }
}

// Register conversation mode with the manager when loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.learningModeManager) {
        window.learningModeManager.registerMode('conversation', ConversationMode, {
            name: 'المحادثات التفاعلية',
            icon: '💬',
            description: 'تدرب على المحادثات التركية الحقيقية',
            containerId: 'conversation-mode-container',
            dependencies: [],
            version: '2.0.0'
        });
        
        console.log('💬 Conversation Mode registered successfully');
    }
});

// Make available globally for modal callbacks
window.currentConversationMode = null;

// Export for direct use
window.ConversationMode = ConversationMode;