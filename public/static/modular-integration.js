// 🔗 Modular Learning System Integration
// Connects the new containerized learning modes with the existing app

// Integration manager
class ModularIntegration {
    constructor() {
        this.isIntegrated = false;
        this.legacyFunctions = {};
        
        console.log('🔗 Modular Integration initialized');
    }
    
    /**
     * Initialize integration when DOM is ready
     */
    init() {
        if (this.isIntegrated) {
            console.log('Integration already complete');
            return;
        }
        
        // Store references to legacy functions
        this.storeLegacyFunctions();
        
        // Override legacy functions with modular versions
        this.overrideLegacyFunctions();
        
        // Setup event listeners for seamless integration
        this.setupIntegrationEvents();
        
        this.isIntegrated = true;
        console.log('✅ Modular integration complete');
    }
    
    /**
     * Store references to existing legacy functions
     */
    storeLegacyFunctions() {
        // Store existing global functions that we're replacing
        if (window.startLearningSession) {
            this.legacyFunctions.startLearningSession = window.startLearningSession;
        }
        
        if (window.startReview) {
            this.legacyFunctions.startReview = window.startReview;
        }
        
        // Store existing LearningSession if it exists
        if (window.LearningSession) {
            this.legacyFunctions.LearningSession = window.LearningSession;
        }
        
        console.log('📦 Legacy functions stored:', Object.keys(this.legacyFunctions));
    }
    
    /**
     * Override legacy functions with modular versions
     */
    overrideLegacyFunctions() {
        // Override global learning session starter
        window.startLearningSession = (categoryData, mode = 'flashcard') => {
            console.log('🔄 Starting modular learning session:', mode, categoryData);
            console.log('🔍 Category data:', categoryData);
            console.log('🔍 Mode manager available:', !!window.learningModeManager);
            
            if (!window.learningModeManager) {
                console.error('Learning mode manager not available, falling back to legacy');
                if (this.legacyFunctions.startLearningSession) {
                    return this.legacyFunctions.startLearningSession(categoryData, mode);
                }
                return;
            }
            
            // Map legacy mode names to new mode IDs
            const modeMap = {
                flashcard: 'flashcard',
                conversation: 'conversation',
                phrase: 'phrase'
            };
            
            const modeId = modeMap[mode] || 'flashcard';
            try {

                
                // Pass all the data, not just words and category
                return window.learningModeManager.startMode(modeId, categoryData);
            } catch (error) {
                console.error('Failed to start modular learning session, falling back:', error);
                if (this.legacyFunctions.startLearningSession) {
                    return this.legacyFunctions.startLearningSession(categoryData, mode);
                }
            }
        };
        
        // Override global review starter
        window.startReview = (type = 'all') => {
            console.log('🔄 Starting modular review session:', type);
            console.log('🔍 Mode manager available:', !!window.learningModeManager);
            console.log('🔍 Available modes:', window.learningModeManager ? window.learningModeManager.getAvailableModes() : 'none');
            
            if (!window.learningModeManager) {
                console.error('Learning mode manager not available, falling back to legacy');
                if (this.legacyFunctions.startReview) {
                    return this.legacyFunctions.startReview(type);
                }
                return;
            }
            
            try {
                return window.learningModeManager.startMode('review', { type });
            } catch (error) {
                console.error('Failed to start modular review session, falling back:', error);
                if (this.legacyFunctions.startReview) {
                    return this.legacyFunctions.startReview(type);
                }
            }
        };
        
        // Add new global functions for additional modes
        window.startConversationMode = (conversationId = null) => {
            if (window.learningModeManager) {
                return window.learningModeManager.startMode('conversation', { 
                    conversationId 
                });
            }
        };
        
        window.startPhraseMode = (category = 'all') => {
            if (window.learningModeManager) {
                return window.learningModeManager.startMode('phrase', { 
                    category 
                });
            }
        };
        
        console.log('🔀 Legacy functions overridden with modular versions');
    }
    
    /**
     * Setup integration event listeners
     */
    setupIntegrationEvents() {
        // Listen for app navigation events
        if (window.TurkishLearningApp) {
            const originalShowSection = window.TurkishLearningApp.showSection;
            
            window.TurkishLearningApp.showSection = function(sectionName) {
                console.log('📍 Navigation to section:', sectionName);
                
                // Stop any active learning mode when navigating away from learn section
                if (window.learningModeManager && window.learningModeManager.currentMode && sectionName !== 'learn') {
                    window.learningModeManager.stopMode().catch(console.error);
                }
                
                // Call original function
                return originalShowSection.call(this, sectionName);
            };
        }
        
        // Listen for mode manager events
        if (window.learningModeManager) {
            window.learningModeManager.globalEventBus.addEventListener('modeStarted', (event) => {
                console.log('🚀 Mode started:', event.detail.modeId);
                
                // Update UI state
                this.updateUIForActiveMode(event.detail.modeId);
            });
            
            window.learningModeManager.globalEventBus.addEventListener('modeStopped', (event) => {
                console.log('🛑 Mode stopped:', event.detail.modeId);
                
                // Reset UI state
                this.resetUIState();
            });
            
            window.learningModeManager.globalEventBus.addEventListener('modeError', (event) => {
                console.error('❌ Mode error:', event.detail);
                
                // Show user-friendly error and fallback
                this.handleModeError(event.detail);
            });
        }
        
        // Listen for progress updates from modular modes
        window.addEventListener('progressUpdated', (event) => {
            console.log('📊 Progress updated from modular mode:', event.detail);
            
            // Update main app statistics
            if (window.TurkishLearningApp && window.TurkishLearningApp.updateUserStats) {
                window.TurkishLearningApp.updateUserStats();
            }
        });
        
        console.log('🔗 Integration event listeners setup complete');
    }
    
    /**
     * Update UI for active mode
     */
    updateUIForActiveMode(modeId) {
        // Hide any conflicting UI elements
        const conflictingElements = document.querySelectorAll('.legacy-learning-ui');
        conflictingElements.forEach(element => {
            element.style.display = 'none';
        });
        
        // Show learning content area
        const learningContent = document.getElementById('learning-content');
        if (learningContent) {
            learningContent.classList.remove('hidden');
        }
        
        // Update navigation if needed
        const learnNavLink = document.querySelector('[data-section="learn"]');
        if (learnNavLink) {
            learnNavLink.classList.add('active');
        }
    }
    
    /**
     * Reset UI state
     */
    resetUIState() {
        // Show any hidden UI elements
        const hiddenElements = document.querySelectorAll('.legacy-learning-ui');
        hiddenElements.forEach(element => {
            element.style.display = '';
        });
        
        // Hide learning content area
        const learningContent = document.getElementById('learning-content');
        if (learningContent) {
            learningContent.classList.add('hidden');
        }
    }
    
    /**
     * Handle mode errors
     */
    handleModeError(errorDetail) {
        const { modeId, error } = errorDetail;
        
        console.error(`Mode ${modeId} failed:`, error);
        
        // Try to fallback to legacy system
        if (modeId === 'flashcard' && this.legacyFunctions.startLearningSession) {
            console.log('🔄 Falling back to legacy learning system');
            
            // Show notification
            this.showNotification('تم التبديل إلى النظام التقليدي للتعلم', 'warning');
            
            // You could attempt to restart with legacy system here
        } else {
            // Show error to user
            this.showNotification(`خطأ في نمط التعلم: ${error.message}`, 'error');
        }
    }
    
    /**
     * Show notification to user
     */
    showNotification(message, type = 'info') {
        // Use existing app notification system if available
        if (window.TurkishLearningApp && window.TurkishLearningApp.showError) {
            window.TurkishLearningApp.showError(message);
            return;
        }
        
        // Fallback notification
        const notification = document.createElement('div');
        notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 ${
            type === 'error' ? 'bg-red-500' : 
            type === 'warning' ? 'bg-yellow-500' : 
            'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    /**
     * Add navigation shortcuts for new modes
     */
    addNavigationShortcuts() {
        // Add conversation mode shortcut
        const conversationShortcut = document.createElement('button');
        conversationShortcut.className = 'quick-mode-btn conversation-mode-btn';
        conversationShortcut.innerHTML = '<i class="fas fa-comments"></i> محادثة';
        conversationShortcut.addEventListener('click', () => {
            window.startConversationMode();
        });
        
        // Add phrase mode shortcut
        const phraseShortcut = document.createElement('button');
        phraseShortcut.className = 'quick-mode-btn phrase-mode-btn';
        phraseShortcut.innerHTML = '<i class="fas fa-comment-dots"></i> عبارات';
        phraseShortcut.addEventListener('click', () => {
            window.startPhraseMode();
        });
        
        // Add to navigation if there's a place for them
        const navContainer = document.querySelector('.navigation-shortcuts');
        if (navContainer) {
            navContainer.appendChild(conversationShortcut);
            navContainer.appendChild(phraseShortcut);
        }
    }
    
    /**
     * Get integration status
     */
    getStatus() {
        return {
            isIntegrated: this.isIntegrated,
            modeManagerAvailable: !!window.learningModeManager,
            modesRegistered: window.learningModeManager ? window.learningModeManager.getAvailableModes().length : 0,
            legacyFunctionsStored: Object.keys(this.legacyFunctions).length,
            currentMode: window.learningModeManager ? window.learningModeManager.getCurrentMode() : null
        };
    }
    
    /**
     * Restore legacy functions (for testing/debugging)
     */
    restoreLegacyFunctions() {
        Object.entries(this.legacyFunctions).forEach(([name, func]) => {
            window[name] = func;
        });
        
        console.log('🔄 Legacy functions restored');
    }
}

// Initialize integration when everything is loaded
let integrationManager = null;

function initializeModularIntegration() {
    if (!integrationManager) {
        integrationManager = new ModularIntegration();
    }
    
    // Wait for both the mode manager and the main app to be ready
    const checkReady = () => {
        if (window.learningModeManager && window.TurkishLearningApp) {
            integrationManager.init();
            console.log('🚀 Modular learning system fully integrated!');
            
            // Make status available globally for debugging
            window.getModularIntegrationStatus = () => integrationManager.getStatus();
        } else {
            console.log('⏳ Waiting for dependencies...');
            setTimeout(checkReady, 500);
        }
    };
    
    checkReady();
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('📚 Initializing modular learning system integration...');
    initializeModularIntegration();
});

// Also initialize after a delay to catch late-loaded scripts
setTimeout(() => {
    if (!integrationManager) {
        initializeModularIntegration();
    }
}, 2000);

// Export for debugging
window.ModularIntegration = ModularIntegration;
window.integrationManager = integrationManager;

// Add debug functions for testing
window.debugLearningFlow = function(categoryId = 'greetings') {
    console.log('🔍 Debug: Testing learning flow for category:', categoryId);
    
    if (!window.vocabularyData) {
        console.error('❌ vocabularyData not available');
        return;
    }
    
    const words = window.vocabularyData[categoryId] || [];
    console.log('📚 Found words:', words.length);
    
    const learningData = {
        category: categoryId,
        words: words
    };
    
    console.log('🎯 Calling startLearningSession with:', learningData);
    
    if (window.startLearningSession) {
        try {
            window.startLearningSession(learningData, 'flashcard');
        } catch (error) {
            console.error('❌ Error in startLearningSession:', error);
        }
    } else {
        console.error('❌ startLearningSession function not available');
    }
};

window.debugReviewFlow = function() {
    console.log('🔍 Debug: Testing review flow');
    
    if (window.startReview) {
        try {
            window.startReview('all');
        } catch (error) {
            console.error('❌ Error in startReview:', error);
        }
    } else {
        console.error('❌ startReview function not available');
    }
};

console.log('🔗 Modular Integration system loaded!');
console.log('🛠️ Debug functions available: debugLearningFlow(), debugReviewFlow()');