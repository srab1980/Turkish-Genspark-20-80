// 🏗️ Base Learning Mode Class
// Abstract base class for all learning mode containers

class LearningModeBase {
    constructor(config = {}) {
        // Core properties
        this.data = config.data || {};
        this.options = config.options || {};
        this.container = config.container;
        this.eventBus = config.eventBus;
        this.manager = config.manager;
        
        // Mode state
        this.isInitialized = false;
        this.isActive = false;
        this.state = {};
        this.startTime = Date.now();
        
        // Performance tracking
        this.metrics = {
            sessionsCompleted: 0,
            totalTime: 0,
            accuracy: 0,
            interactions: 0
        };
        
        // Event handlers storage
        this.eventHandlers = new Map();
        
        // Bind methods to maintain context
        this.handleContainerClick = this.handleContainerClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        
        console.log(`🏗️ Base learning mode created:`, this.constructor.name);
    }
    
    // Abstract methods that must be implemented by subclasses
    
    /**
     * Initialize the learning mode
     * @abstract
     */
    async init() {
        throw new Error('init() method must be implemented by subclass');
    }
    
    /**
     * Render the mode's UI
     * @abstract
     */
    render() {
        throw new Error('render() method must be implemented by subclass');
    }
    
    /**
     * Clean up resources when mode is stopped
     * @abstract
     */
    async cleanup() {
        throw new Error('cleanup() method must be implemented by subclass');
    }
    
    // Common implementation methods
    
    /**
     * Start the learning mode
     */
    async start() {
        if (this.isActive) {
            console.warn('Mode is already active');
            return;
        }
        
        try {
            if (!this.isInitialized) {
                await this.init();
                this.isInitialized = true;
            }
            
            this.isActive = true;
            this.startTime = Date.now();
            
            // Setup common event listeners
            this.setupEventListeners();
            
            // Render the UI
            this.render();
            
            // Track mode start
            this.trackEvent('mode_started', {
                mode: this.constructor.name,
                timestamp: this.startTime
            });
            
            console.log(`✅ ${this.constructor.name} started successfully`);
            
        } catch (error) {
            console.error(`❌ Failed to start ${this.constructor.name}:`, error);
            throw error;
        }
    }
    
    /**
     * Stop the learning mode
     */
    async stop() {
        if (!this.isActive) {
            return;
        }
        
        try {
            // Calculate session time
            const sessionTime = Date.now() - this.startTime;
            this.metrics.totalTime += sessionTime;
            
            // Clean up event listeners
            this.removeEventListeners();
            
            // Call subclass cleanup
            await this.cleanup();
            
            this.isActive = false;
            
            // Track mode stop
            this.trackEvent('mode_stopped', {
                mode: this.constructor.name,
                sessionTime,
                metrics: this.metrics
            });
            
            console.log(`🛑 ${this.constructor.name} stopped`);
            
        } catch (error) {
            console.error(`❌ Error stopping ${this.constructor.name}:`, error);
        }
    }
    
    /**
     * Save current state for mode switching
     */
    async saveState() {
        return {
            ...this.state,
            metrics: this.metrics,
            timestamp: Date.now()
        };
    }
    
    /**
     * Restore state from previous session
     */
    async restoreState(savedState) {
        if (savedState) {
            this.state = { ...this.state, ...savedState };
            this.metrics = { ...this.metrics, ...(savedState.metrics || {}) };
            
            console.log(`🔄 State restored for ${this.constructor.name}`);
        }
    }
    
    /**
     * Update mode state
     */
    updateState(newState) {
        this.state = { ...this.state, ...newState };
        
        // Trigger state change event
        this.emit('stateChanged', { state: this.state });
    }
    
    /**
     * Setup common event listeners
     */
    setupEventListeners() {
        if (this.container) {
            // Container click events
            this.container.addEventListener('click', this.handleContainerClick);
            
            // Store reference for cleanup
            this.eventHandlers.set('containerClick', this.handleContainerClick);
        }
        
        // Global key events
        document.addEventListener('keydown', this.handleKeyPress);
        this.eventHandlers.set('keyPress', this.handleKeyPress);
        
        // Visibility change for pause/resume
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        this.eventHandlers.set('visibilityChange', this.handleVisibilityChange);
    }
    
    /**
     * Remove all event listeners
     */
    removeEventListeners() {
        if (this.container && this.eventHandlers.has('containerClick')) {
            this.container.removeEventListener('click', this.eventHandlers.get('containerClick'));
        }
        
        if (this.eventHandlers.has('keyPress')) {
            document.removeEventListener('keydown', this.eventHandlers.get('keyPress'));
        }
        
        if (this.eventHandlers.has('visibilityChange')) {
            document.removeEventListener('visibilitychange', this.eventHandlers.get('visibilityChange'));
        }
        
        this.eventHandlers.clear();
    }
    
    /**
     * Handle container click events
     * Can be overridden by subclasses
     */
    handleContainerClick(event) {
        // Default implementation - can be overridden
        this.metrics.interactions++;
    }
    
    /**
     * Handle key press events
     * Can be overridden by subclasses
     */
    handleKeyPress(event) {
        // Common keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key.toLowerCase()) {
                case 'escape':
                    event.preventDefault();
                    this.stop();
                    break;
                case 'h':
                    event.preventDefault();
                    this.showHelp();
                    break;
            }
        }
    }
    
    /**
     * Handle visibility change (tab switching)
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.onPause();
        } else {
            this.onResume();
        }
    }
    
    /**
     * Called when mode is paused (tab hidden)
     */
    onPause() {
        console.log(`⏸️ ${this.constructor.name} paused`);
        this.trackEvent('mode_paused');
    }
    
    /**
     * Called when mode is resumed (tab visible)
     */
    onResume() {
        console.log(`▶️ ${this.constructor.name} resumed`);
        this.trackEvent('mode_resumed');
    }
    
    /**
     * Show help for current mode
     */
    showHelp() {
        const helpContent = this.getHelpContent();
        if (helpContent) {
            this.showModal('مساعدة', helpContent);
        }
    }
    
    /**
     * Get help content for mode
     * Should be overridden by subclasses
     */
    getHelpContent() {
        return `
            <div style="text-align: right; line-height: 1.6;">
                <h4>كيفية الاستخدام:</h4>
                <p>هذا هو نمط التعلم ${this.constructor.name}</p>
                <p>استخدم لوحة المفاتيح أو الماوس للتفاعل</p>
                <p>اضغط Ctrl+H لعرض هذه المساعدة</p>
                <p>اضغط Escape للخروج</p>
            </div>
        `;
    }
    
    /**
     * Show modal dialog
     */
    showModal(title, content, actions = []) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold text-gray-800">${title}</h3>
                    <button class="modal-close text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content text-gray-700">
                    ${content}
                </div>
                <div class="flex justify-end gap-2 mt-4">
                    ${actions.length > 0 ? actions.map(action => `
                        <button class="px-4 py-2 rounded ${action.class || 'bg-blue-500 text-white hover:bg-blue-600'}"
                                onclick="${action.onClick || ''}">
                            ${action.text}
                        </button>
                    `).join('') : `
                        <button class="modal-close px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                            إغلاق
                        </button>
                    `}
                </div>
            </div>
        `;
        
        // Close modal functionality
        const closeModal = () => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        };
        
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        document.body.appendChild(modal);
    }
    
    /**
     * Show notification message
     */
    showNotification(message, type = 'info', duration = 3000) {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        const notification = document.createElement('div');
        notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${colors[type]} text-white p-4 rounded-lg shadow-lg z-50 transition-opacity`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    /**
     * Emit event to event bus
     */
    emit(eventName, data = {}) {
        if (this.eventBus) {
            this.eventBus.dispatchEvent(new CustomEvent(eventName, {
                detail: {
                    mode: this.constructor.name,
                    ...data
                }
            }));
        }
    }
    
    /**
     * Listen to event bus events
     */
    on(eventName, handler) {
        if (this.eventBus) {
            this.eventBus.addEventListener(eventName, handler);
        }
    }
    
    /**
     * Track analytics event
     */
    trackEvent(eventName, data = {}) {
        const eventData = {
            mode: this.constructor.name,
            timestamp: Date.now(),
            ...data
        };
        
        // Store in localStorage for analytics
        const events = JSON.parse(localStorage.getItem('learningModeEvents') || '[]');
        events.push({ event: eventName, ...eventData });
        
        // Keep only last 1000 events
        if (events.length > 1000) {
            events.splice(0, events.length - 1000);
        }
        
        localStorage.setItem('learningModeEvents', JSON.stringify(events));
        
        // Emit to event bus
        this.emit('analyticsEvent', eventData);
        
        // Emit global event for real-time analytics system
        const globalEvent = new CustomEvent('learningModeEvent', {
            detail: { event: eventName, mode: this.constructor.name, ...eventData }
        });
        document.dispatchEvent(globalEvent);
        
        console.log(`📊 Tracked event: ${eventName}`, eventData);
    }
    
    /**
     * Update progress and trigger progress event
     */
    updateProgress(progressData) {
        // Emit progress update
        this.emit('progressUpdated', {
            mode: this.constructor.name,
            progress: progressData,
            timestamp: Date.now()
        });
        
        // Emit global progress event for real-time analytics
        const globalProgressEvent = new CustomEvent('progressUpdated', {
            detail: {
                mode: this.constructor.name,
                progress: progressData,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(globalProgressEvent);
        
        // Update global progress
        if (window.TurkishLearningApp && window.TurkishLearningApp.updateUserStats) {
            window.TurkishLearningApp.updateUserStats();
        }
    }
    
    /**
     * Get mode configuration
     */
    getConfig() {
        return {
            name: this.constructor.name,
            isActive: this.isActive,
            isInitialized: this.isInitialized,
            metrics: this.metrics,
            state: this.state
        };
    }
    
    /**
     * Validate required data
     */
    validateData(requiredFields = []) {
        const missing = requiredFields.filter(field => !this.data[field]);
        if (missing.length > 0) {
            throw new Error(`Missing required data fields: ${missing.join(', ')}`);
        }
        return true;
    }
    
    /**
     * Create HTML element with classes and attributes
     */
    createElement(tag, classes = [], attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        if (classes.length > 0) {
            element.className = classes.join(' ');
        }
        
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    }
    
    /**
     * Safely clear container content
     */
    clearContainer() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
    
    /**
     * Append element to container
     */
    appendToContainer(element) {
        if (this.container && element) {
            this.container.appendChild(element);
        }
    }
}

// Export for use by other modules
window.LearningModeBase = LearningModeBase;

console.log('🏗️ Learning Mode Base class loaded successfully!');