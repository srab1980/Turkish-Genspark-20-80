// 🎯 Learning Mode Manager - Modular Container System
// Manages independent learning mode containers for scalable architecture

class LearningModeManager {
    constructor() {
        this.modes = new Map();
        this.currentMode = null;
        this.activeContainer = null;
        this.globalEventBus = new EventTarget();
        
        this.init();
    }
    
    init() {
        console.log('🎯 Learning Mode Manager initialized');
        this.setupGlobalEventHandlers();
        this.registerCoreModes();
    }
    
    // Register a new learning mode container
    registerMode(modeId, modeClass, config = {}) {
        if (this.modes.has(modeId)) {
            console.warn(`Mode ${modeId} already registered, overriding...`);
        }
        
        const modeConfig = {
            id: modeId,
            class: modeClass,
            name: config.name || modeId,
            icon: config.icon || '📚',
            description: config.description || '',
            containerId: config.containerId || `${modeId}-container`,
            dependencies: config.dependencies || [],
            enabled: config.enabled !== false,
            version: config.version || '1.0.0'
        };
        
        this.modes.set(modeId, modeConfig);
        console.log(`✅ Registered learning mode: ${modeId}`, modeConfig);
        
        // Trigger mode registration event
        this.globalEventBus.dispatchEvent(new CustomEvent('modeRegistered', {
            detail: { modeId, config: modeConfig }
        }));
        
        return modeConfig;
    }
    
    // Unregister a learning mode
    unregisterMode(modeId) {
        if (this.modes.has(modeId)) {
            // Clean up active instance if this mode is currently active
            if (this.currentMode === modeId) {
                this.stopMode();
            }
            
            this.modes.delete(modeId);
            console.log(`❌ Unregistered learning mode: ${modeId}`);
            
            this.globalEventBus.dispatchEvent(new CustomEvent('modeUnregistered', {
                detail: { modeId }
            }));
        }
    }
    
    // Start a specific learning mode
    async startMode(modeId, data = {}, options = {}) {
        try {
            // Stop current mode if running
            if (this.currentMode) {
                await this.stopMode();
            }
            
            // Check if mode exists
            if (!this.modes.has(modeId)) {
                throw new Error(`Learning mode '${modeId}' not found`);
            }
            
            const modeConfig = this.modes.get(modeId);
            
            // Check if mode is enabled
            if (!modeConfig.enabled) {
                throw new Error(`Learning mode '${modeId}' is disabled`);
            }
            
            // Check dependencies
            await this.checkDependencies(modeConfig.dependencies);
            
            // Create container element if it doesn't exist
            const containerId = options.containerId || modeConfig.containerId;
            let container = document.getElementById(containerId);
            
            if (!container) {
                container = this.createModeContainer(containerId, modeConfig);
            }
            
            // Process session data if available
            const enhancedData = this.processSessionData(data);
            const enhancedOptions = { 
                ...options, 
                sessionBased: !!enhancedData.session,
                sessionId: enhancedData.session?.sessionId,
                categoryId: enhancedData.session?.categoryId
            };
            
            // Initialize mode instance
            console.log(`🚀 Starting learning mode: ${modeId}`, {
                sessionBased: enhancedOptions.sessionBased,
                wordsCount: enhancedData.words?.length || 0
            });
            
            const ModeClass = modeConfig.class;
            this.activeContainer = new ModeClass({
                data: enhancedData,
                options: enhancedOptions,
                container,
                eventBus: this.globalEventBus,
                manager: this
            });
            
            // Initialize the mode
            if (typeof this.activeContainer.init === 'function') {
                await this.activeContainer.init();
            }
            
            // Render the mode interface
            if (typeof this.activeContainer.render === 'function') {
                this.activeContainer.render();
            }
            
            this.currentMode = modeId;
            
            // Show container and hide others
            this.showModeContainer(containerId);
            
            // Trigger mode start event
            this.globalEventBus.dispatchEvent(new CustomEvent('modeStarted', {
                detail: { modeId, data, options }
            }));
            
            console.log(`✅ Successfully started learning mode: ${modeId}`);
            return this.activeContainer;
            
        } catch (error) {
            console.error(`❌ Failed to start learning mode '${modeId}':`, error);
            this.handleModeError(modeId, error);
            throw error;
        }
    }
    
    // Stop current learning mode
    async stopMode() {
        if (!this.currentMode || !this.activeContainer) {
            return;
        }
        
        try {
            console.log(`🛑 Stopping learning mode: ${this.currentMode}`);
            
            // Call mode cleanup if available
            if (typeof this.activeContainer.cleanup === 'function') {
                await this.activeContainer.cleanup();
            }
            
            // Trigger mode stop event
            this.globalEventBus.dispatchEvent(new CustomEvent('modeStopped', {
                detail: { modeId: this.currentMode }
            }));
            
            // Hide current container
            this.hideModeContainers();
            
            const stoppedMode = this.currentMode;
            this.currentMode = null;
            this.activeContainer = null;
            
            console.log(`✅ Successfully stopped learning mode: ${stoppedMode}`);
            
        } catch (error) {
            console.error(`❌ Error stopping learning mode:`, error);
            throw error;
        }
    }
    
    // Switch between modes
    async switchMode(newModeId, data = {}, options = {}) {
        console.log(`🔄 Switching from '${this.currentMode}' to '${newModeId}'`);
        
        // Save current mode state if needed
        if (this.activeContainer && typeof this.activeContainer.saveState === 'function') {
            const savedState = await this.activeContainer.saveState();
            options.previousState = savedState;
        }
        
        return await this.startMode(newModeId, data, options);
    }
    
    // Get list of available modes
    getAvailableModes() {
        return Array.from(this.modes.values()).filter(mode => mode.enabled);
    }
    
    // Get current active mode info
    getCurrentMode() {
        return this.currentMode ? {
            id: this.currentMode,
            config: this.modes.get(this.currentMode),
            instance: this.activeContainer
        } : null;
    }
    
    // Check if a mode is available
    isModeAvailable(modeId) {
        const mode = this.modes.get(modeId);
        return mode && mode.enabled;
    }
    
    // Create container element for mode
    createModeContainer(containerId, modeConfig) {
        const container = document.createElement('div');
        container.id = containerId;
        container.className = `learning-mode-container mode-${modeConfig.id}`;
        container.style.display = 'none';
        
        // Add container to learning content area
        const learningContent = document.getElementById('learning-content') || document.body;
        learningContent.appendChild(container);
        
        return container;
    }
    
    // Show specific mode container and hide others
    showModeContainer(containerId) {
        // Hide all mode containers
        this.hideModeContainers();
        
        // Show target container
        const container = document.getElementById(containerId);
        if (container) {
            container.style.display = 'block';
            container.classList.add('active-mode');
        }
        
        // Show learning content area
        const learningContent = document.getElementById('learning-content');
        if (learningContent) {
            learningContent.classList.remove('hidden');
        }
    }
    
    // Hide all mode containers
    hideModeContainers() {
        const containers = document.querySelectorAll('.learning-mode-container');
        containers.forEach(container => {
            container.style.display = 'none';
            container.classList.remove('active-mode');
        });
    }
    
    // Check mode dependencies
    async checkDependencies(dependencies) {
        if (!dependencies || dependencies.length === 0) {
            return true;
        }
        
        for (const dep of dependencies) {
            if (typeof dep === 'string') {
                // Check if global object exists
                if (!window[dep]) {
                    throw new Error(`Missing dependency: ${dep}`);
                }
            } else if (typeof dep === 'function') {
                // Run dependency check function
                const result = await dep();
                if (!result) {
                    throw new Error(`Dependency check failed`);
                }
            }
        }
        
        return true;
    }
    
    // Handle mode errors
    handleModeError(modeId, error) {
        console.error(`Mode error in '${modeId}':`, error);
        
        // Trigger error event
        this.globalEventBus.dispatchEvent(new CustomEvent('modeError', {
            detail: { modeId, error }
        }));
        
        // Show user-friendly error
        this.showErrorMessage(`خطأ في نظام التعلم: ${error.message}`);
    }
    
    // Show error message to user
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    // Setup global event handlers
    setupGlobalEventHandlers() {
        // Listen for navigation events
        window.addEventListener('beforeunload', () => {
            if (this.currentMode) {
                this.stopMode();
            }
        });
        
        // Listen for app navigation
        this.globalEventBus.addEventListener('navigationChanged', (event) => {
            if (event.detail.section !== 'learn' && this.currentMode) {
                this.stopMode();
            }
        });
    }
    
    // Register core learning modes
    registerCoreModes() {
        // These will be registered by individual mode files when they load
        console.log('📝 Core modes will be registered by individual modules');
    }
    
    // Advanced mode management methods
    
    // Get mode performance metrics
    getModeMetrics(modeId) {
        // Implementation for tracking mode usage and performance
        const usage = JSON.parse(localStorage.getItem(`mode-metrics-${modeId}`) || '{}');
        return {
            totalSessions: usage.sessions || 0,
            totalTime: usage.time || 0,
            averageAccuracy: usage.accuracy || 0,
            lastUsed: usage.lastUsed || null
        };
    }
    
    // Update mode metrics
    updateModeMetrics(modeId, metrics) {
        const current = this.getModeMetrics(modeId);
        const updated = { ...current, ...metrics, lastUsed: Date.now() };
        localStorage.setItem(`mode-metrics-${modeId}`, JSON.stringify(updated));
    }
    
    // Get recommended next mode
    getRecommendedMode(userProgress = {}) {
        const modes = this.getAvailableModes();
        
        // Simple recommendation logic - can be enhanced with ML
        if (userProgress.strugglingWords && userProgress.strugglingWords.length > 0) {
            return modes.find(m => m.id === 'review') || modes[0];
        }
        
        if (userProgress.totalWordsLearned < 10) {
            return modes.find(m => m.id === 'flashcard') || modes[0];
        }
        
        return modes.find(m => m.id === 'quiz') || modes[0];
    }
    
    // Process session data for enhanced learning modes
    processSessionData(data) {
        // If session is provided, extract words from session
        if (data.session && data.session.words) {
            return {
                ...data,
                words: data.session.words,
                category: data.session.categoryId,
                sessionInfo: {
                    sessionId: data.session.sessionId,
                    sessionNumber: data.session.sessionNumber,
                    categoryId: data.session.categoryId,
                    totalWords: data.session.wordCount,
                    difficultyRange: data.session.difficultyRange,
                    estimatedTime: data.session.estimatedTime
                }
            };
        }
        
        // If category is provided without session, get all words from category
        if (data.category && window.enhancedVocabularyData) {
            const categoryData = window.enhancedVocabularyData[data.category];
            const categoryWords = categoryData?.words || [];
            return {
                ...data,
                words: categoryWords,
                categoryInfo: {
                    id: data.category,
                    name: categoryData?.name || data.category,
                    nameArabic: categoryData?.nameArabic || '',
                    totalWords: categoryWords.length
                },
                sessionInfo: null
            };
        }
        
        return data;
    }
    
    // Start session-based learning
    async startSessionMode(modeId, sessionId, options = {}) {
        if (!window.SessionManager) {
            throw new Error('SessionManager not available');
        }
        
        const session = window.SessionManager.getSessionById(sessionId);
        if (!session) {
            throw new Error(`Session not found: ${sessionId}`);
        }
        
        const sessionData = {
            session: session,
            words: session.words,
            category: session.categoryId
        };
        
        return await this.startMode(modeId, sessionData, {
            ...options,
            sessionBased: true,
            sessionId: sessionId
        });
    }
    
    // Start category review with completed sessions
    async startCategoryReview(categoryId, completedSessionIds = []) {
        if (!window.SessionManager || !window.enhancedVocabularyData) {
            throw new Error('Session data not available');
        }
        
        // Get all words from completed sessions in this category
        const reviewWords = [];
        completedSessionIds.forEach(sessionId => {
            const session = window.SessionManager.getSessionById(sessionId);
            if (session && session.words) {
                reviewWords.push(...session.words);
            }
        });
        
        if (reviewWords.length === 0) {
            throw new Error('No words available for review');
        }
        
        const reviewData = {
            words: reviewWords,
            category: categoryId,
            reviewMode: true,
            completedSessions: completedSessionIds
        };
        
        return await this.startMode('review', reviewData, {
            reviewMode: true,
            categoryId: categoryId
        });
    }
}

// Global instance
window.learningModeManager = new LearningModeManager();

// Make it available globally
window.LearningModeManager = LearningModeManager;

console.log('🎯 Learning Mode Manager loaded successfully!');