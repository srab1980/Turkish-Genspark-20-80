// 📋 Side Menu Filters - Turkish Learning App
// Advanced filtering system with responsive side menu

class SideMenuFilters {
    constructor() {
        this.isInitialized = false;
        this.isMenuOpen = false;
        this.selectedCategories = new Set();
        this.selectedModes = new Set(['flashcard']); // Default mode
        this.selectedDifficulties = new Set();
        this.searchQuery = '';
        
        // Filter data
        this.categories = [];
        this.learningModes = [
            {
                id: 'flashcard',
                name: 'البطاقات التعليمية',
                description: 'تعلم الكلمات باستخدام البطاقات التفاعلية',
                icon: '📱'
            },
            {
                id: 'quiz',
                name: 'الاختبارات التفاعلية',
                description: 'اختبر معرفتك بالكلمات التركية',
                icon: '🎯'
            },
            {
                id: 'phrase',
                name: 'العبارات والتعابير',
                description: 'تعلم العبارات التركية الشائعة والمفيدة',
                icon: '📝'
            },
            {
                id: 'examine',
                name: 'Examine Mode',
                description: 'Examine and study vocabulary in detail.',
                icon: '🔍'
            },
            {
                id: 'conversation',
                name: 'المحادثات التفاعلية',
                description: 'تدرب على المحادثات التركية الحقيقية',
                icon: '💬'
            },
            {
                id: 'review',
                name: 'المراجعة المتباعدة',
                description: 'راجع الكلمات بنظام التكرار المتباعد الذكي',
                icon: '🔄'
            }
        ];
        
        this.difficultyLevels = [
            { id: 'A1', name: 'مبتدئ', color: '#22c55e' },
            { id: 'A2', name: 'أساسي', color: '#3b82f6' },
            { id: 'B1', name: 'متوسط', color: '#f59e0b' },
            { id: 'B2', name: 'متقدم', color: '#ef4444' },
            { id: 'C1', name: 'خبير', color: '#8b5cf6' },
            { id: 'C2', name: 'محترف', color: '#1f2937' }
        ];
        
        // Bind methods
        this.toggleMenu = this.toggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.handleEscapeKey = this.handleEscapeKey.bind(this);
        
        console.log('📋 Side Menu Filters initialized');
    }
    
    /**
     * Initialize the side menu system
     */
    async init() {
        try {
            await this.loadCategories();
            this.createSideMenu();
            this.setupEventListeners();
            this.isInitialized = true;
            
            console.log('✅ Side Menu Filters ready');
        } catch (error) {
            console.error('❌ Side Menu initialization failed:', error);
        }
    }
    
    /**
     * Load categories from vocabulary database
     */
    async loadCategories() {
        try {
            // Wait for vocabulary database to be available
            let retries = 0;
            while (!window.enhancedVocabularyDatabase && retries < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                retries++;
            }
            
            if (window.enhancedVocabularyDatabase && window.enhancedVocabularyDatabase.data) {
                this.categories = window.enhancedVocabularyDatabase.data.map(category => ({
                    id: category.id,
                    name: category.nameArabic || category.name,
                    wordCount: category.words ? category.words.length : 0,
                    sessionCount: category.sessionCount || Math.ceil((category.words ? category.words.length : 0) / 10),
                    icon: this.getCategoryIcon(category.id)
                }));
            } else {
                // Fallback data
                this.categories = [
                    { id: 'adjective', name: 'الصفات', wordCount: 77, sessionCount: 8, icon: '📝' },
                    { id: 'animal', name: 'الحيوانات', wordCount: 54, sessionCount: 6, icon: '🐾' },
                    { id: 'body', name: 'أجزاء الجسم', wordCount: 78, sessionCount: 8, icon: '👤' },
                    { id: 'clothes', name: 'الملابس', wordCount: 20, sessionCount: 2, icon: '👕' },
                    { id: 'color', name: 'الألوان', wordCount: 18, sessionCount: 2, icon: '🎨' }
                ];
            }
            
            console.log(`📂 Loaded ${this.categories.length} categories for filters`);
        } catch (error) {
            console.error('❌ Failed to load categories:', error);
        }
    }
    
    /**
     * Get icon for category
     */
    getCategoryIcon(categoryId) {
        const icons = {
            'adjective': '📝',
            'animal': '🐾',
            'body': '👤',
            'clothes': '👕',
            'color': '🎨',
            'direction': '🧭',
            'emotion': '😊',
            'family': '👨‍👩‍👧‍👦',
            'food': '🍽️',
            'greeting': '👋',
            'health': '🏥',
            'house': '🏠',
            'job': '💼',
            'nature': '🌿',
            'number': '🔢',
            'place': '📍',
            'pronoun': '👤',
            'question': '❓',
            'sport': '⚽',
            'time': '⏰',
            'transport': '🚗',
            'verb': '⚡',
            'weather': '🌤️'
        };
        return icons[categoryId] || '📚';
    }
    
    /**
     * Create the side menu HTML structure
     */
    createSideMenu() {
        // Remove existing menu if any
        const existingMenu = document.getElementById('side-menu-filters');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'side-menu-toggle';
        toggleButton.innerHTML = '<i class="fas fa-sliders-h"></i>';
        toggleButton.onclick = this.toggleMenu;
        toggleButton.title = 'فتح إعدادات التعلم';
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'side-menu-overlay';
        overlay.onclick = this.handleOverlayClick;
        
        // Create side menu
        const sideMenu = document.createElement('div');
        sideMenu.id = 'side-menu-filters';
        sideMenu.className = 'side-menu';
        
        sideMenu.innerHTML = `
            <div class="side-menu-header">
                <h3 class="side-menu-title">
                    <i class="fas fa-sliders-h"></i>
                    إعدادات التعلم
                </h3>
                <p class="side-menu-subtitle">اختر فئة ونمط التعلم المفضل لديك</p>
                <button class="side-menu-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Categories Filter -->
            <div class="filter-section">
                <h4 class="filter-section-title">
                    <i class="fas fa-folder-open icon"></i>
                    الفئات
                </h4>
                <div class="category-filter">
                    <input type="text" class="category-search" placeholder="ابحث عن فئة..." id="category-search">
                    <div class="category-list" id="category-list">
                        ${this.renderCategories()}
                    </div>
                </div>
            </div>
            
            <!-- Learning Modes Filter -->
            <div class="filter-section">
                <h4 class="filter-section-title">
                    <i class="fas fa-graduation-cap icon"></i>
                    نمط التعلم
                </h4>
                <div class="learning-modes" id="learning-modes">
                    ${this.renderLearningModes()}
                </div>
            </div>
            
            <!-- Difficulty Filter -->
            <div class="filter-section">
                <h4 class="filter-section-title">
                    <i class="fas fa-chart-line icon"></i>
                    مستوى الصعوبة
                </h4>
                <div class="difficulty-levels" id="difficulty-levels">
                    ${this.renderDifficultyLevels()}
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="filter-actions">
                <button class="filter-button primary" id="apply-filters">
                    <i class="fas fa-play"></i>
                    ابدأ جلسة التعلم
                </button>
                <button class="filter-button secondary" id="reset-filters">
                    <i class="fas fa-refresh"></i>
                    إعادة تعيين الفلاتر
                </button>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(toggleButton);
        document.body.appendChild(overlay);
        document.body.appendChild(sideMenu);
        
        // Setup internal event listeners
        this.setupInternalEventListeners();
    }
    
    /**
     * Render categories list
     */
    renderCategories() {
        return this.categories.map(category => `
            <div class="category-item" data-category="${category.id}">
                <input type="checkbox" class="category-checkbox" id="cat-${category.id}">
                <div class="category-info">
                    <div class="category-name">${category.icon} ${category.name}</div>
                    <div class="category-stats">
                        <span class="category-count">
                            <i class="fas fa-book"></i>
                            ${category.wordCount} كلمة
                        </span>
                        <span class="category-count">
                            <i class="fas fa-layer-group"></i>
                            ${category.sessionCount} جلسة
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Render learning modes
     */
    renderLearningModes() {
        return this.learningModes.map(mode => `
            <div class="mode-option ${this.selectedModes.has(mode.id) ? 'selected' : ''}" data-mode="${mode.id}">
                <input type="radio" name="learning-mode" class="mode-radio" id="mode-${mode.id}" ${this.selectedModes.has(mode.id) ? 'checked' : ''}>
                <div class="mode-content">
                    <div class="mode-header">
                        <span class="mode-icon">${mode.icon}</span>
                        <span class="mode-name">${mode.name}</span>
                    </div>
                    <div class="mode-description">${mode.description}</div>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Render difficulty levels
     */
    renderDifficultyLevels() {
        return this.difficultyLevels.map(level => `
            <div class="difficulty-badge ${level.id} ${this.selectedDifficulties.has(level.id) ? 'selected' : ''}" 
                 data-difficulty="${level.id}">
                ${level.id}
            </div>
        `).join('');
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Escape key to close menu
        document.addEventListener('keydown', this.handleEscapeKey);
        
        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                // Auto-close on desktop if needed
            }
        });
    }
    
    /**
     * Setup internal event listeners for menu interactions
     */
    setupInternalEventListeners() {
        // Close button
        const closeBtn = document.querySelector('.side-menu-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', this.closeMenu);
        }
        
        // Category search
        const categorySearch = document.getElementById('category-search');
        if (categorySearch) {
            categorySearch.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.filterCategories();
            });
        }
        
        // Category selection
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const categoryId = item.dataset.category;
                const checkbox = item.querySelector('.category-checkbox');
                
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
                
                this.handleCategorySelection(categoryId, checkbox.checked);
            });
        });
        
        // Learning mode selection
        const modeOptions = document.querySelectorAll('.mode-option');
        modeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const modeId = option.dataset.mode;
                this.handleModeSelection(modeId);
            });
        });
        
        // Difficulty selection
        const difficultyBadges = document.querySelectorAll('.difficulty-badge');
        difficultyBadges.forEach(badge => {
            badge.addEventListener('click', () => {
                const difficultyId = badge.dataset.difficulty;
                this.handleDifficultySelection(difficultyId);
            });
        });
        
        // Action buttons
        const applyBtn = document.getElementById('apply-filters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }
    
    /**
     * Toggle menu visibility
     */
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    /**
     * Open side menu
     */
    openMenu() {
        const menu = document.getElementById('side-menu-filters');
        const overlay = document.querySelector('.side-menu-overlay');
        
        if (menu && overlay) {
            menu.classList.add('active');
            overlay.classList.add('active');
            this.isMenuOpen = true;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }
    
    /**
     * Close side menu
     */
    closeMenu() {
        const menu = document.getElementById('side-menu-filters');
        const overlay = document.querySelector('.side-menu-overlay');
        
        if (menu && overlay) {
            menu.classList.remove('active');
            overlay.classList.remove('active');
            this.isMenuOpen = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }
    
    /**
     * Handle overlay click
     */
    handleOverlayClick(e) {
        if (e.target.classList.contains('side-menu-overlay')) {
            this.closeMenu();
        }
    }
    
    /**
     * Handle escape key
     */
    handleEscapeKey(e) {
        if (e.key === 'Escape' && this.isMenuOpen) {
            this.closeMenu();
        }
    }
    
    /**
     * Filter categories based on search
     */
    filterCategories() {
        const categoryItems = document.querySelectorAll('.category-item');
        const query = this.searchQuery.toLowerCase();
        
        categoryItems.forEach(item => {
            const categoryName = item.querySelector('.category-name').textContent.toLowerCase();
            const isVisible = categoryName.includes(query);
            item.style.display = isVisible ? 'flex' : 'none';
        });
    }
    
    /**
     * Handle category selection
     */
    handleCategorySelection(categoryId, isSelected) {
        if (isSelected) {
            this.selectedCategories.add(categoryId);
        } else {
            this.selectedCategories.delete(categoryId);
        }
        
        // Update UI
        const item = document.querySelector(`[data-category="${categoryId}"]`);
        if (item) {
            item.classList.toggle('selected', isSelected);
        }
        
        console.log('📂 Categories selected:', Array.from(this.selectedCategories));
    }
    
    /**
     * Handle learning mode selection
     */
    handleModeSelection(modeId) {
        // Clear previous selection (single selection)
        this.selectedModes.clear();
        this.selectedModes.add(modeId);
        
        // Update UI
        document.querySelectorAll('.mode-option').forEach(option => {
            const isSelected = option.dataset.mode === modeId;
            option.classList.toggle('selected', isSelected);
            const radio = option.querySelector('.mode-radio');
            if (radio) {
                radio.checked = isSelected;
            }
        });
        
        console.log('🎯 Learning mode selected:', modeId);
    }
    
    /**
     * Handle difficulty selection
     */
    handleDifficultySelection(difficultyId) {
        const isSelected = this.selectedDifficulties.has(difficultyId);
        
        if (isSelected) {
            this.selectedDifficulties.delete(difficultyId);
        } else {
            this.selectedDifficulties.add(difficultyId);
        }
        
        // Update UI
        const badge = document.querySelector(`[data-difficulty="${difficultyId}"]`);
        if (badge) {
            badge.classList.toggle('selected', !isSelected);
        }
        
        console.log('📊 Difficulties selected:', Array.from(this.selectedDifficulties));
    }
    
    /**
     * Apply filters and start learning session
     */
    applyFilters() {
        const filters = {
            categories: Array.from(this.selectedCategories),
            mode: Array.from(this.selectedModes)[0] || 'flashcard',
            difficulties: Array.from(this.selectedDifficulties)
        };
        
        console.log('✨ Applying filters:', filters);
        
        // Validate selection
        if (filters.categories.length === 0) {
            this.showNotification('يرجى اختيار فئة واحدة على الأقل', 'warning');
            return;
        }
        
        // Close menu
        this.closeMenu();
        
        // Trigger learning session with filters
        this.startLearningSession(filters);
        
        this.showNotification('تم بدء جلسة التعلم بنجاح!', 'success');
    }
    
    /**
     * Reset all filters
     */
    resetFilters() {
        this.selectedCategories.clear();
        this.selectedModes.clear();
        this.selectedModes.add('flashcard'); // Default mode
        this.selectedDifficulties.clear();
        this.searchQuery = '';
        
        // Update UI
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('selected');
            const checkbox = item.querySelector('.category-checkbox');
            if (checkbox) checkbox.checked = false;
        });
        
        document.querySelectorAll('.mode-option').forEach(option => {
            const isDefault = option.dataset.mode === 'flashcard';
            option.classList.toggle('selected', isDefault);
            const radio = option.querySelector('.mode-radio');
            if (radio) radio.checked = isDefault;
        });
        
        document.querySelectorAll('.difficulty-badge').forEach(badge => {
            badge.classList.remove('selected');
        });
        
        const categorySearch = document.getElementById('category-search');
        if (categorySearch) {
            categorySearch.value = '';
        }
        
        this.filterCategories();
        
        console.log('🔄 Filters reset');
        this.showNotification('تم إعادة تعيين الفلاتر', 'info');
    }
    
    /**
     * Start learning session with applied filters
     */
    startLearningSession(filters) {
        // Integrate with existing learning system
        if (window.learningModeManager && filters.categories.length > 0) {
            const primaryCategory = filters.categories[0];
            
            // Get category data
            const categoryData = this.categories.find(cat => cat.id === primaryCategory);
            if (categoryData) {
                // Use the learning mode manager to start session
                window.learningModeManager.startMode(filters.mode, {
                    category: primaryCategory,
                    categories: filters.categories,
                    difficulties: filters.difficulties
                });
                
                // Navigate to learn section
                if (window.showSection) {
                    window.showSection('learn');
                }
            }
        } else {
            console.warn('Learning mode manager not available or no categories selected');
        }
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        if (window.visualUXSystem && window.visualUXSystem.showNotification) {
            window.visualUXSystem.showNotification(message, type);
        } else {
            console.log(`📢 ${type.toUpperCase()}: ${message}`);
        }
    }
    
    /**
     * Get current filter state
     */
    getFilters() {
        return {
            categories: Array.from(this.selectedCategories),
            mode: Array.from(this.selectedModes)[0] || 'flashcard',
            difficulties: Array.from(this.selectedDifficulties),
            searchQuery: this.searchQuery
        };
    }
    
    /**
     * Set filter state
     */
    setFilters(filters) {
        if (filters.categories) {
            this.selectedCategories = new Set(filters.categories);
        }
        if (filters.mode) {
            this.selectedModes = new Set([filters.mode]);
        }
        if (filters.difficulties) {
            this.selectedDifficulties = new Set(filters.difficulties);
        }
        if (filters.searchQuery !== undefined) {
            this.searchQuery = filters.searchQuery;
        }
        
        // Update UI if menu exists
        if (this.isInitialized) {
            // Refresh the menu content
            this.createSideMenu();
        }
    }
}

// Initialize side menu filters when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sideMenuFilters = new SideMenuFilters();
    
    // Wait for other systems to be ready
    setTimeout(() => {
        window.sideMenuFilters.init();
    }, 1000);
});

console.log('📋 Side Menu Filters system loaded');