// 🎨 Visual & UX Enhancement System for Turkish Learning App

class VisualUXSystem {
  constructor() {
    this.currentTheme = localStorage.getItem('turkish-app-theme') || 'light';
    this.settings = {
      fontSize: localStorage.getItem('turkish-app-font-size') || 'normal',
      cardSize: localStorage.getItem('turkish-app-card-size') || 'medium',
      animationsEnabled: localStorage.getItem('turkish-app-animations') !== 'false',
      gesturesEnabled: localStorage.getItem('turkish-app-gestures') !== 'false'
    };
    
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.isFlipping = false;
    this.loadingSkeletons = new Map();
    
    this.init();
  }

  init() {
    this.createThemeToggle();
    this.createCustomizationPanel();
    this.applyTheme();
    this.applySettings();
    this.setupGestureControls();
    this.enhanceExistingElements();
    this.setupLoadingStates();
    
    console.log('🎨 Visual & UX System initialized successfully!');
  }

  // 🌙 Dark Mode Implementation
  createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle tooltip';
    themeToggle.setAttribute('data-tooltip', this.currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    themeToggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => this.toggleTheme());
    
    document.body.appendChild(themeToggle);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    localStorage.setItem('turkish-app-theme', this.currentTheme);
    
    // Update toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('data-tooltip', this.currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    
    // Animate theme transition
    document.body.style.transition = 'all 0.5s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
    
    this.showNotification(`${this.currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated!`);
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  // ⚙️ Customization Panel
  createCustomizationPanel() {
    const panel = document.createElement('div');
    panel.className = 'customization-panel';
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h3 style="color: var(--text-primary); margin: 0; flex: 1; text-align: center;">
          <i class="fas fa-palette"></i> Customize Interface
        </h3>
        <button id="close-panel" style="background: var(--glass-bg-light); border: 1px solid var(--glass-border-light); border-radius: 50%; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); font-size: 0.875rem;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="setting-group" style="margin-bottom: 1.5rem;">
        <label style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.5rem; display: block;">
          <i class="fas fa-font"></i> Font Size
        </label>
        <select id="font-size-selector" style="width: 100%; padding: 0.5rem; border-radius: 0.5rem; background: var(--glass-bg-light); border: 1px solid var(--glass-border-light); color: var(--text-primary);">
          <option value="small">Small</option>
          <option value="normal" selected>Normal</option>
          <option value="large">Large</option>
          <option value="extra-large">Extra Large</option>
        </select>
      </div>
      
      <div class="setting-group" style="margin-bottom: 1.5rem;">
        <label style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.5rem; display: block;">
          <i class="fas fa-expand-arrows-alt"></i> Card Size
        </label>
        <select id="card-size-selector" style="width: 100%; padding: 0.5rem; border-radius: 0.5rem; background: var(--glass-bg-light); border: 1px solid var(--glass-border-light); color: var(--text-primary);">
          <option value="small">Small</option>
          <option value="medium" selected>Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      
      <div class="setting-group" style="margin-bottom: 1.5rem;">
        <label style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
          <span><i class="fas fa-magic"></i> Animations</span>
          <input type="checkbox" id="animations-toggle" checked style="transform: scale(1.2);">
        </label>
      </div>
      
      <div class="setting-group" style="margin-bottom: 1.5rem;">
        <label style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
          <span><i class="fas fa-hand-paper"></i> Gesture Controls</span>
          <input type="checkbox" id="gestures-toggle" checked style="transform: scale(1.2);">
        </label>
      </div>
      
      <div class="setting-group">
        <button id="reset-settings" style="width: 100%; padding: 0.75rem; background: var(--error); color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
          <i class="fas fa-undo"></i> Reset to Defaults
        </button>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'customization-toggle tooltip';
    toggleButton.setAttribute('data-tooltip', 'Customize Interface');
    toggleButton.innerHTML = '⚙️';
    toggleButton.addEventListener('click', () => this.toggleCustomizationPanel());
    
    document.body.appendChild(toggleButton);
    
    this.setupCustomizationControls();
  }

  toggleCustomizationPanel() {
    const panel = document.querySelector('.customization-panel');
    panel.classList.toggle('open');
  }

  setupCustomizationControls() {
    // Font size selector
    const fontSizeSelector = document.getElementById('font-size-selector');
    fontSizeSelector.value = this.settings.fontSize;
    fontSizeSelector.addEventListener('change', (e) => {
      this.settings.fontSize = e.target.value;
      this.applyFontSize();
      localStorage.setItem('turkish-app-font-size', this.settings.fontSize);
    });
    
    // Card size selector
    const cardSizeSelector = document.getElementById('card-size-selector');
    cardSizeSelector.value = this.settings.cardSize;
    cardSizeSelector.addEventListener('change', (e) => {
      this.settings.cardSize = e.target.value;
      this.applyCardSize();
      localStorage.setItem('turkish-app-card-size', this.settings.cardSize);
    });
    
    // Animations toggle
    const animationsToggle = document.getElementById('animations-toggle');
    animationsToggle.checked = this.settings.animationsEnabled;
    animationsToggle.addEventListener('change', (e) => {
      this.settings.animationsEnabled = e.target.checked;
      this.applyAnimationSettings();
      localStorage.setItem('turkish-app-animations', this.settings.animationsEnabled.toString());
    });
    
    // Gestures toggle
    const gesturesToggle = document.getElementById('gestures-toggle');
    gesturesToggle.checked = this.settings.gesturesEnabled;
    gesturesToggle.addEventListener('change', (e) => {
      this.settings.gesturesEnabled = e.target.checked;
      localStorage.setItem('turkish-app-gestures', this.settings.gesturesEnabled.toString());
    });
    
    // Reset button
    document.getElementById('reset-settings').addEventListener('click', () => {
      this.resetToDefaults();
    });
    
    // Close panel button
    document.getElementById('close-panel').addEventListener('click', () => {
      this.toggleCustomizationPanel();
    });
    
    // Close panel on outside click
    document.addEventListener('click', (e) => {
      const panel = document.querySelector('.customization-panel');
      const toggle = document.querySelector('.customization-toggle');
      if (panel && panel.classList.contains('open') && 
          !panel.contains(e.target) && !toggle.contains(e.target)) {
        this.toggleCustomizationPanel();
      }
    });
    
    // Close panel on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const panel = document.querySelector('.customization-panel');
        if (panel && panel.classList.contains('open')) {
          this.toggleCustomizationPanel();
        }
      }
    });
  }

  // 📱 Gesture Controls Implementation
  setupGestureControls() {
    if (!this.settings.gesturesEnabled) return;
    
    document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    
    // Add swipe indicators to cards
    this.addSwipeIndicators();
  }

  addSwipeIndicators() {
    const cards = document.querySelectorAll('.flashcard');
    cards.forEach(card => {
      if (!card.querySelector('.swipe-indicator')) {
        const leftIndicator = document.createElement('div');
        leftIndicator.className = 'swipe-indicator left';
        leftIndicator.innerHTML = '👈';
        leftIndicator.title = 'Swipe left for hard';
        
        const rightIndicator = document.createElement('div');
        rightIndicator.className = 'swipe-indicator right';
        rightIndicator.innerHTML = '👉';
        rightIndicator.title = 'Swipe right for easy';
        
        card.style.position = 'relative';
        card.appendChild(leftIndicator);
        card.appendChild(rightIndicator);
      }
    });
  }

  handleTouchStart(e) {
    if (!this.settings.gesturesEnabled) return;
    
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  }

  handleTouchEnd(e) {
    if (!this.settings.gesturesEnabled) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;
    
    // Check if it's a horizontal swipe (more horizontal than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      const flashcard = e.target.closest('.flashcard');
      if (flashcard) {
        if (deltaX > 0) {
          // Swipe right - Easy
          this.handleSwipeGesture('easy', flashcard);
        } else {
          // Swipe left - Hard
          this.handleSwipeGesture('hard', flashcard);
        }
      }
    }
    
    // Check for tap to flip
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      const flashcard = e.target.closest('.flashcard');
      if (flashcard && !this.isFlipping) {
        this.flipCard(flashcard);
      }
    }
  }

  handleSwipeGesture(difficulty, card) {
    // Add visual feedback
    card.style.transform = difficulty === 'easy' ? 'translateX(50px)' : 'translateX(-50px)';
    card.style.opacity = '0.7';
    
    setTimeout(() => {
      card.style.transform = '';
      card.style.opacity = '';
      
      // Trigger the existing rating system if available
      if (window.reviewSystem && typeof window.reviewSystem.rateWord === 'function') {
        const wordId = card.dataset.wordId;
        const rating = difficulty === 'easy' ? 5 : 1;
        window.reviewSystem.rateWord(wordId, rating);
      }
      
      this.showNotification(`Rated as ${difficulty === 'easy' ? '👍 Easy' : '👎 Hard'}!`);
    }, 200);
  }

  // ✨ Enhanced Card Animations
  flipCard(card) {
    if (this.isFlipping || !this.settings.animationsEnabled) return;
    
    this.isFlipping = true;
    card.classList.add('flipping');
    
    setTimeout(() => {
      card.classList.toggle('is-flipped');
    }, 250);
    
    setTimeout(() => {
      card.classList.remove('flipping');
      this.isFlipping = false;
    }, 500);
  }

  // 💀 Loading Skeletons
  createLoadingSkeleton(container, type = 'card') {
    const skeleton = document.createElement('div');
    
    if (type === 'card') {
      skeleton.className = 'skeleton skeleton-card';
      skeleton.innerHTML = `
        <div style="padding: 2rem;">
          <div class="skeleton skeleton-text large w-75" style="margin-bottom: 1rem;"></div>
          <div class="skeleton skeleton-text w-50" style="margin-bottom: 2rem;"></div>
          <div class="skeleton skeleton-text w-25"></div>
        </div>
      `;
    } else if (type === 'list') {
      skeleton.className = 'skeleton-list';
      skeleton.innerHTML = Array(5).fill().map(() => `
        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
          <div class="skeleton" style="width: 3rem; height: 3rem; border-radius: 50%; margin-right: 1rem;"></div>
          <div style="flex: 1;">
            <div class="skeleton skeleton-text w-75" style="margin-bottom: 0.5rem;"></div>
            <div class="skeleton skeleton-text w-50"></div>
          </div>
        </div>
      `).join('');
    }
    
    container.appendChild(skeleton);
    return skeleton;
  }

  showLoadingSkeleton(containerId, type = 'card') {
    const container = document.getElementById(containerId);
    if (container && !this.loadingSkeletons.has(containerId)) {
      const skeleton = this.createLoadingSkeleton(container, type);
      this.loadingSkeletons.set(containerId, skeleton);
    }
  }

  hideLoadingSkeleton(containerId) {
    const skeleton = this.loadingSkeletons.get(containerId);
    if (skeleton) {
      skeleton.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        skeleton.remove();
        this.loadingSkeletons.delete(containerId);
      }, 300);
    }
  }

  setupLoadingStates() {
    // Override existing loading functions if they exist
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const containerId = this.getContainerFromUrl(args[0]);
      if (containerId) {
        this.showLoadingSkeleton(containerId);
      }
      
      try {
        const response = await originalFetch.apply(this, args);
        if (containerId) {
          setTimeout(() => this.hideLoadingSkeleton(containerId), 500);
        }
        return response;
      } catch (error) {
        if (containerId) {
          this.hideLoadingSkeleton(containerId);
        }
        throw error;
      }
    };
  }

  getContainerFromUrl(url) {
    if (typeof url === 'string') {
      if (url.includes('/api/words')) return 'flashcard-container';
      if (url.includes('/api/categories')) return 'categories-list';
    }
    return null;
  }

  // 🎨 Apply Settings
  applySettings() {
    this.applyFontSize();
    this.applyCardSize();
    this.applyAnimationSettings();
  }

  applyFontSize() {
    document.body.className = document.body.className.replace(/font-\w+/g, '');
    document.body.classList.add(`font-${this.settings.fontSize}`);
  }

  applyCardSize() {
    document.body.className = document.body.className.replace(/card-\w+/g, '');
    document.body.classList.add(`card-${this.settings.cardSize}`);
    
    // Show notification when card size changes
    const sizeNames = { small: 'Small', medium: 'Medium', large: 'Large' };
    if (this.settings.cardSize !== 'medium') { // Don't show for initial medium size
      this.showNotification(`📏 Card size: ${sizeNames[this.settings.cardSize]}`);
    }
  }

  applyAnimationSettings() {
    if (!this.settings.animationsEnabled) {
      document.documentElement.style.setProperty('--animation-fast', '0ms');
      document.documentElement.style.setProperty('--animation-normal', '0ms');
      document.documentElement.style.setProperty('--animation-slow', '0ms');
      document.documentElement.style.setProperty('--animation-extra-slow', '0ms');
    } else {
      document.documentElement.style.removeProperty('--animation-fast');
      document.documentElement.style.removeProperty('--animation-normal');
      document.documentElement.style.removeProperty('--animation-slow');
      document.documentElement.style.removeProperty('--animation-extra-slow');
    }
  }

  resetToDefaults() {
    this.settings = {
      fontSize: 'normal',
      cardSize: 'medium',
      animationsEnabled: true,
      gesturesEnabled: true
    };
    
    this.currentTheme = 'light';
    
    // Clear localStorage
    localStorage.removeItem('turkish-app-theme');
    localStorage.removeItem('turkish-app-font-size');
    localStorage.removeItem('turkish-app-card-size');
    localStorage.removeItem('turkish-app-animations');
    localStorage.removeItem('turkish-app-gestures');
    
    // Apply defaults
    this.applyTheme();
    this.applySettings();
    
    // Update UI controls
    document.getElementById('font-size-selector').value = 'normal';
    document.getElementById('card-size-selector').value = 'medium';
    document.getElementById('animations-toggle').checked = true;
    document.getElementById('gestures-toggle').checked = true;
    
    // Update theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.innerHTML = '🌙';
    themeToggle.setAttribute('data-tooltip', 'Switch to Dark Mode');
    
    this.showNotification('🔄 Settings reset to defaults!');
  }

  // 🎯 Enhanced Existing Elements
  enhanceExistingElements() {
    // Add animations to existing buttons
    const buttons = document.querySelectorAll('button:not(.theme-toggle):not(.customization-toggle)');
    buttons.forEach(button => {
      button.classList.add('btn-animated', 'interactive-element');
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.glass-card, .category-card, .achievement-card');
    cards.forEach(card => {
      card.classList.add('interactive-element');
    });
    
    // Enhance navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.add('interactive-element');
    });
    
    // Add progress bar animations
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
      const fill = bar.querySelector('.progress-fill') || bar.querySelector('.bg-primary');
      if (fill) {
        fill.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });
  }

  // 📢 Notifications
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10000;
      background: var(--glass-bg-strong);
      border: 1px solid var(--glass-border-light);
      border-radius: 0.5rem;
      padding: 1rem 1.5rem;
      color: var(--text-primary);
      backdrop-filter: blur(20px);
      box-shadow: var(--glass-shadow-light);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // 🔄 Refresh enhancements for dynamic content
  refresh() {
    this.addSwipeIndicators();
    this.enhanceExistingElements();
  }

  // 📊 Performance monitoring
  measurePerformance(name, fn) {
    if (!this.settings.animationsEnabled) return fn();
    
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    if (end - start > 16) { // More than one frame
      console.warn(`🐌 Slow operation detected: ${name} took ${end - start}ms`);
    }
    
    return result;
  }
}

// Initialize the Visual & UX System
window.visualUXSystem = new VisualUXSystem();

// Expose refresh method for other scripts
window.refreshVisualUX = () => {
  if (window.visualUXSystem) {
    window.visualUXSystem.refresh();
  }
};

console.log('🎨 Visual & UX Enhancement System loaded successfully!');