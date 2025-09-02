// 💬 Conversation Practice System
// Enhanced Turkish conversation learning with dialogue practice

class ConversationSystem {
    constructor() {
        this.conversations = [];
        this.currentConversation = null;
        this.currentDialogueIndex = 0;
        this.audioQueue = [];
        this.isPlayingDialogue = false;
        
        this.init();
    }

    async init() {
        try {
            await this.loadConversations();
            await this.loadDailyTip();
            this.setupEventListeners();
            console.log('💬 Conversation System initialized');
        } catch (error) {
            console.error('Failed to initialize conversation system:', error);
        }
    }

    async loadConversations() {
        try {
            const response = await axios.get('/api/conversations');
            this.conversations = response.data.conversations;
            this.renderConversationSelection();
        } catch (error) {
            console.error('Failed to load conversations:', error);
            this.showError('فشل في تحميل المحادثات');
        }
    }

    async loadDailyTip() {
        try {
            const response = await axios.get('/api/daily-tip');
            const tip = response.data.tip;
            const date = new Date(response.data.date).toLocaleDateString('ar-EG');
            
            const tipCard = document.getElementById('daily-tip-card');
            const tipDate = document.getElementById('daily-tip-date');
            const tipContent = document.getElementById('daily-tip-content');
            
            if (tipDate) tipDate.textContent = date;
            if (tipContent) {
                tipContent.innerHTML = `
                    <div class="tip-category">${this.getTipCategoryArabic(tip.category)}</div>
                    <div class="tip-text">${tip.arabic}</div>
                    <div class="tip-example">${tip.example}</div>
                `;
            }
        } catch (error) {
            console.error('Failed to load daily tip:', error);
        }
    }

    getTipCategoryArabic(category) {
        const categories = {
            pronunciation: 'النطق',
            grammar: 'القواعد',
            culture: 'الثقافة',
            vocabulary: 'المفردات'
        };
        return categories[category] || category;
    }

    renderConversationSelection() {
        const container = document.getElementById('conversation-types');
        if (!container) return;

        container.innerHTML = this.conversations.map(conv => `
            <div class="conversation-card" onclick="window.conversationSystem.selectConversation('${conv.id}')">
                <div class="conversation-icon">
                    ${this.getConversationIcon(conv.id)}
                </div>
                <div class="conversation-title">${conv.name}</div>
                <div class="conversation-title-arabic">${conv.nameArabic}</div>
                <div class="conversation-meta">
                    <span class="difficulty-badge difficulty-${conv.difficulty}">${this.getDifficultyArabic(conv.difficulty)}</span>
                </div>
            </div>
        `).join('');
    }

    getConversationIcon(type) {
        const icons = {
            hotel: '🏨',
            restaurant: '🍽️',
            taxi: '🚕',
            shopping: '🛒',
            directions: '🧭'
        };
        return icons[type] || '💬';
    }

    getDifficultyArabic(difficulty) {
        const levels = {
            beginner: 'مبتدئ',
            intermediate: 'متوسط',
            advanced: 'متقدم'
        };
        return levels[difficulty] || difficulty;
    }

    async selectConversation(conversationId) {
        try {
            const response = await axios.get(`/api/conversations/${conversationId}`);
            this.currentConversation = response.data;
            this.currentDialogueIndex = 0;
            this.showConversationPractice();
        } catch (error) {
            console.error('Failed to load conversation:', error);
            this.showError('فشل في تحميل المحادثة');
        }
    }

    showConversationPractice() {
        const selectionSection = document.querySelector('.conversation-selection');
        const practiceSection = document.getElementById('conversation-practice');
        
        if (selectionSection) selectionSection.style.display = 'none';
        if (practiceSection) {
            practiceSection.style.display = 'block';
            practiceSection.classList.remove('hidden');
            practiceSection.classList.add('entering');
        }

        this.renderConversationHeader();
        this.renderDialogue();
        this.renderKeyPhrases();
    }

    showConversationSelection() {
        const selectionSection = document.querySelector('.conversation-selection');
        const practiceSection = document.getElementById('conversation-practice');
        
        if (selectionSection) selectionSection.style.display = 'block';
        if (practiceSection) {
            practiceSection.style.display = 'none';
            practiceSection.classList.add('hidden');
        }
        
        this.currentConversation = null;
    }

    renderConversationHeader() {
        if (!this.currentConversation) return;

        const titleElement = document.getElementById('conversation-title');
        const difficultyElement = document.getElementById('conversation-difficulty');
        const participantsElement = document.getElementById('conversation-participants');

        if (titleElement) {
            titleElement.textContent = this.currentConversation.titleArabic;
        }

        if (difficultyElement) {
            difficultyElement.textContent = this.getDifficultyArabic(this.currentConversation.difficulty);
            difficultyElement.className = `difficulty-badge difficulty-${this.currentConversation.difficulty}`;
        }

        if (participantsElement) {
            participantsElement.textContent = `المشاركون: ${this.currentConversation.participants.join(' و ')}`;
        }
    }

    renderDialogue() {
        if (!this.currentConversation || !this.currentConversation.dialogue) return;

        const container = document.getElementById('dialogue-container');
        if (!container) return;

        container.innerHTML = this.currentConversation.dialogue.map((line, index) => `
            <div class="dialogue-line ${line.speaker.toLowerCase()} entering" style="animation-delay: ${index * 0.2}s">
                <div class="dialogue-message">
                    <div class="dialogue-speaker">${this.getSpeakerArabic(line.speaker)}</div>
                    <div class="dialogue-turkish">${line.turkish}</div>
                    <div class="dialogue-pronunciation">[${line.pronunciation}]</div>
                    <div class="dialogue-arabic">${line.arabic}</div>
                    <div class="dialogue-english">${line.english}</div>
                    <button class="dialogue-audio" onclick="window.conversationSystem.playDialogueLine(${index})" title="استمع للنطق">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getSpeakerArabic(speaker) {
        const speakers = {
            'Guest': 'النزيل',
            'Receptionist': 'موظف الاستقبال',
            'Customer': 'الزبون',
            'Waiter': 'النادل',
            'Passenger': 'الراكب',
            'Driver': 'السائق'
        };
        return speakers[speaker] || speaker;
    }

    renderKeyPhrases() {
        if (!this.currentConversation || !this.currentConversation.keyPhrases) return;

        const container = document.getElementById('key-phrases-grid');
        if (!container) return;

        container.innerHTML = this.currentConversation.keyPhrases.map((phrase, index) => `
            <div class="key-phrase-card">
                <button class="key-phrase-audio" onclick="window.conversationSystem.playKeyPhrase('${phrase.turkish}')" title="استمع للنطق">
                    <i class="fas fa-volume-up"></i>
                </button>
                <div class="key-phrase-turkish">${phrase.turkish}</div>
                <div class="key-phrase-arabic">${phrase.arabic}</div>
                <div class="key-phrase-english">${phrase.english}</div>
            </div>
        `).join('');
    }

    async playDialogueLine(index) {
        if (!this.currentConversation || !this.currentConversation.dialogue[index]) return;
        
        const line = this.currentConversation.dialogue[index];
        await this.speakText(line.turkish, 'tr-TR');
    }

    async playKeyPhrase(turkish) {
        await this.speakText(turkish, 'tr-TR');
    }

    async playFullDialogue() {
        if (!this.currentConversation || this.isPlayingDialogue) return;

        this.isPlayingDialogue = true;
        const playButton = document.getElementById('btn-listen-dialogue');
        if (playButton) {
            playButton.disabled = true;
            playButton.innerHTML = '<i class="fas fa-pause"></i> جاري التشغيل...';
        }

        try {
            for (let i = 0; i < this.currentConversation.dialogue.length; i++) {
                const line = this.currentConversation.dialogue[i];
                await this.speakText(line.turkish, 'tr-TR');
                await this.delay(1000); // Pause between lines
            }
        } catch (error) {
            console.error('Error playing dialogue:', error);
        } finally {
            this.isPlayingDialogue = false;
            if (playButton) {
                playButton.disabled = false;
                playButton.innerHTML = '<i class="fas fa-volume-up"></i> استمع للمحادثة كاملة';
            }
        }
    }

    async speakText(text, lang = 'tr-TR') {
        return new Promise((resolve, reject) => {
            if (!window.speechSynthesis) {
                console.warn('Speech synthesis not supported');
                resolve();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;

            utterance.onend = () => resolve();
            utterance.onerror = (error) => {
                console.error('Speech synthesis error:', error);
                resolve(); // Still resolve to continue
            };

            // Try to find a Turkish voice
            const voices = window.speechSynthesis.getVoices();
            const turkishVoice = voices.find(voice => voice.lang.startsWith('tr'));
            if (turkishVoice) {
                utterance.voice = turkishVoice;
            }

            window.speechSynthesis.speak(utterance);
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setupEventListeners() {
        // Practice dialogue button
        const practiceBtn = document.getElementById('btn-practice-dialogue');
        if (practiceBtn) {
            practiceBtn.addEventListener('click', () => this.startDialoguePractice());
        }

        // Listen to full dialogue button
        const listenBtn = document.getElementById('btn-listen-dialogue');
        if (listenBtn) {
            listenBtn.addEventListener('click', () => this.playFullDialogue());
        }

        // Global function for showing conversation selection
        window.showConversationSelection = () => this.showConversationSelection();
    }

    startDialoguePractice() {
        // This could open a modal for recording and comparing pronunciation
        this.showNotification('ميزة التدريب على المحادثة قريباً!', 'info');
    }

    showNotification(message, type = 'success') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: var(--glass-bg-light);
            border: 1px solid var(--glass-border-light);
            border-radius: var(--border-radius);
            padding: 1rem 1.5rem;
            backdrop-filter: blur(20px);
            box-shadow: var(--glass-shadow-light);
            color: var(--text-primary);
            font-weight: 500;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
            direction: rtl;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }
}

// Animation styles for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize conversation system when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the main app to be ready
    setTimeout(() => {
        window.conversationSystem = new ConversationSystem();
    }, 1000);
});

// Export for use in other scripts
window.ConversationSystem = ConversationSystem;