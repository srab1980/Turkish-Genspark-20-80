/**
 * 🔐 Authentication Service for Turkish Learning App
 * Handles user authentication, token management, and auth state
 */

class AuthService {
    constructor() {
        this.currentUser = null;
        this.authListeners = [];
        this.isInitialized = false;
        this.googleAuth = null;
        this.googleClientId = null;
        this.isGoogleAuthReady = false; // Track Google Auth readiness
        this.init();
    }

    /**
     * Initialize authentication service
     */
    async init() {
        try {
            // Check for existing authentication
            await this.checkAuthStatus();
            
            // Initialize Google Sign-In
            await this.initGoogleAuth();
            
            this.isInitialized = true;
            console.log('🔐 Auth Service initialized');
        } catch (error) {
            console.error('❌ Auth Service initialization failed:', error);
            this.isInitialized = true;
        }
    }

    /**
     * Initialize Google Authentication
     */
    async initGoogleAuth() {
        try {
            console.log('🔄 Starting Google Auth initialization...');
            
            // Get Google OAuth configuration
            const response = await fetch('/api/auth/google/config');
            const config = await response.json();
            
            console.log('📝 Google config received:', {
                success: config.success,
                hasClientId: !!config.clientId,
                clientIdStart: config.clientId ? config.clientId.substring(0, 10) + '...' : 'None'
            });
            
            if (!config.success || !config.clientId) {
                throw new Error('Google OAuth configuration not available from server');
            }
            
            this.googleClientId = config.clientId;
            
            // Check if we have a valid client ID
            if (this.googleClientId.includes('demo-client-id')) {
                console.warn('⚠️ Demo Google Client ID detected. Google Sign-In will not work properly.');
                this.isGoogleAuthReady = false;
                throw new Error('تحتاج إلى تكوين معرف عميل Google صحيح في إعدادات التطبيق');
            }
            
            // Load Google Identity Services
            console.log('📦 Loading Google Identity Services...');
            if (!window.google) {
                await this.loadGoogleScript();
                
                // Wait a bit more to ensure Google APIs are fully loaded
                console.log('⏳ Waiting for Google APIs to fully load...');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Check if Google APIs are properly loaded
            console.log('🔍 Checking Google APIs availability:', {
                google: !!window.google,
                accounts: !!(window.google && window.google.accounts),
                id: !!(window.google && window.google.accounts && window.google.accounts.id)
            });
            
            if (!window.google || !window.google.accounts || !window.google.accounts.id) {
                throw new Error('لم يتم تحميل خدمات Google Identity بشكل صحيح. تحقق من اتصالك بالإنترنت.');
            }
            
            // Initialize Google Auth
            console.log('🔐 Initializing Google Auth with client ID...');
            window.google.accounts.id.initialize({
                client_id: this.googleClientId,
                callback: this.handleGoogleSignIn.bind(this),
                auto_select: false,
                cancel_on_tap_outside: false
            });
            
            // Verify initialization
            await new Promise(resolve => setTimeout(resolve, 500));
            
            console.log('✅ Google Auth initialized successfully');
            this.isGoogleAuthReady = true;
        } catch (error) {
            console.error('❌ Google Auth initialization failed:', error);
            this.isGoogleAuthReady = false;
            
            // Store the actual error for debugging
            this.googleAuthError = error.message;
            
            // Provide user-friendly error message
            if (error.message && error.message.includes('client ID')) {
                console.warn('🔧 Please configure a valid Google OAuth Client ID in the environment variables');
            } else if (error.message && error.message.includes('Google Identity')) {
                console.warn('🌐 Google Identity Services failed to load. Check internet connection.');
            }
            
            // Re-throw with Arabic message for UI
            throw new Error(error.message.includes('تحتاج إلى') || error.message.includes('لم يتم') ? 
                error.message : 'فشل في تهيئة خدمات Google. تحقق من الإعدادات والاتصال بالإنترنت.');
        }
    }

    /**
     * Load Google Identity Services script
     */
    loadGoogleScript() {
        return new Promise((resolve, reject) => {
            if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Register a new user
     */
    async register(userData) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include' // Include cookies
            });

            const result = await response.json();

            if (result.success) {
                this.currentUser = result.user;
                
                // Store token in localStorage for backup
                if (result.token) {
                    localStorage.setItem('auth_token', result.token);
                }
                
                // Store user data
                localStorage.setItem('user_data', JSON.stringify(result.user));
                
                // Notify listeners
                this.notifyAuthListeners('login', result.user);
                
                console.log('✅ Registration successful:', result.user.name);
                return { success: true, user: result.user, message: result.message };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('❌ Registration error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    /**
     * Login user
     */
    async login(credentials) {
        try {
            // Add some basic validation to prevent empty requests
            if (!credentials || !credentials.email || !credentials.password) {
                console.warn('⚠️ Login attempted with incomplete credentials');
                return { success: false, message: 'Email and password are required' };
            }
            
            console.log('🔐 Attempting login for:', credentials.email);
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include' // Include cookies
            });

            const result = await response.json();

            if (result.success) {
                this.currentUser = result.user;
                
                // Store token in localStorage for backup
                if (result.token) {
                    localStorage.setItem('auth_token', result.token);
                }
                
                // Store user data
                localStorage.setItem('user_data', JSON.stringify(result.user));
                
                // Merge with any existing local data
                await this.mergeLocalDataWithUser();
                
                // Notify listeners
                this.notifyAuthListeners('login', result.user);
                
                console.log('✅ Login successful:', result.user.name);
                return { success: true, user: result.user, message: result.message };
            } else {
                console.warn('❌ Login failed:', result.message);
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    /**
     * Google Sign-In handler
     */
    async handleGoogleSignIn(response) {
        try {
            console.log('🔐 Google Sign-In response received');
            
            const result = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credential: response.credential,
                    clientId: this.googleClientId
                }),
                credentials: 'include'
            });

            const authResult = await result.json();

            if (authResult.success) {
                this.currentUser = authResult.user;
                
                // Store token in localStorage for backup
                if (authResult.token) {
                    localStorage.setItem('auth_token', authResult.token);
                }
                
                // Store user data
                localStorage.setItem('user_data', JSON.stringify(authResult.user));
                
                // Merge with any existing local data
                await this.mergeLocalDataWithUser();
                
                // Notify listeners
                this.notifyAuthListeners('login', authResult.user);
                
                console.log('✅ Google Sign-In successful:', authResult.user.name);
                
                // Close any open auth modals
                if (window.authUI) {
                    window.authUI.hide();
                }
                
                return { success: true, user: authResult.user, message: authResult.message };
            } else {
                console.error('❌ Google Sign-In failed:', authResult.message);
                return { success: false, message: authResult.message };
            }
        } catch (error) {
            console.error('❌ Google Sign-In error:', error);
            return { success: false, message: 'Google authentication failed. Please try again.' };
        }
    }

    /**
     * Trigger Google Sign-In popup
     */
    async signInWithGoogle() {
        try {
            if (!this.isGoogleAuthReady || !window.google) {
                // Try to reinitialize Google Auth
                await this.initGoogleAuth();
                
                if (!this.isGoogleAuthReady || !window.google) {
                    throw new Error('Google Identity Services not loaded');
                }
            }
            
            // Show Google One Tap or popup
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // Fallback to popup if One Tap is not available
                    this.showGooglePopup();
                }
            });
            
        } catch (error) {
            console.error('❌ Google Sign-In trigger error:', error);
            throw error;
        }
    }

    /**
     * Show Google popup signin
     */
    showGooglePopup() {
        try {
            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
                {
                    theme: 'outline',
                    size: 'large',
                    type: 'standard',
                    text: 'signin_with',
                    shape: 'rectangular',
                    logo_alignment: 'left'
                }
            );
        } catch (error) {
            console.error('❌ Google popup error:', error);
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('❌ Logout error:', error);
        }

        // Clear local data
        this.currentUser = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        // Notify listeners
        this.notifyAuthListeners('logout', null);
        
        console.log('✅ Logout successful');
        return { success: true, message: 'Logged out successfully' };
    }

    /**
     * Check current authentication status
     */
    async checkAuthStatus() {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                // Try to get user data from localStorage for offline mode
                const userData = localStorage.getItem('user_data');
                if (userData) {
                    this.currentUser = JSON.parse(userData);
                    console.log('🔄 Using cached user data (offline mode)');
                    return this.currentUser;
                }
                return null;
            }

            const response = await fetch('/api/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                this.currentUser = result.user;
                localStorage.setItem('user_data', JSON.stringify(result.user));
                return result.user;
            } else {
                // Invalid token, clear data
                console.log('❌ Invalid token detected, clearing auth data');
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
                this.currentUser = null;
                return null;
            }
        } catch (error) {
            console.error('❌ Auth status check failed:', error);
            
            // Clear potentially corrupted token data
            if (error.name === 'TypeError' || error.message.includes('401')) {
                console.log('🧹 Clearing corrupted auth data');
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
                this.currentUser = null;
            }
            
            // Try to use cached data in case of network error
            const userData = localStorage.getItem('user_data');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                console.log('🔄 Using cached user data (network error)');
                return this.currentUser;
            }
            
            return null;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(updates) {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                return { success: false, message: 'Not authenticated' };
            }

            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates),
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                this.currentUser = result.user;
                localStorage.setItem('user_data', JSON.stringify(result.user));
                
                // Notify listeners
                this.notifyAuthListeners('profileUpdate', result.user);
                
                return { success: true, user: result.user, message: result.message };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('❌ Profile update error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    /**
     * Change password
     */
    async changePassword(passwordData) {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                return { success: false, message: 'Not authenticated' };
            }

            const response = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(passwordData),
                credentials: 'include'
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('❌ Password change error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    /**
     * Merge local learning data with authenticated user
     */
    async mergeLocalDataWithUser() {
        try {
            // Get local learning progress
            const localStats = localStorage.getItem('simple_user_stats');
            const learningHistory = localStorage.getItem('learningHistory');
            const sessionHistory = localStorage.getItem('sessionHistory');
            
            if (localStats || learningHistory || sessionHistory) {
                const updates = {};
                
                if (localStats) {
                    const stats = JSON.parse(localStats);
                    updates.stats = {
                        sessionsCompleted: Math.max(this.currentUser.stats.sessionsCompleted, stats.sessionsCompleted || 0),
                        wordsLearned: Math.max(this.currentUser.stats.wordsLearned, stats.wordsLearned || 0),
                        streak: Math.max(this.currentUser.stats.streak, stats.streak || 0),
                        accuracy: Math.max(this.currentUser.stats.accuracy, stats.accuracy || 0),
                        totalTime: Math.max(this.currentUser.stats.totalTime, stats.totalTime || 0),
                        xp: Math.max(this.currentUser.stats.xp, stats.xp || 0)
                    };
                }
                
                // Update profile if there's data to merge
                if (Object.keys(updates).length > 0) {
                    await this.updateProfile(updates);
                    console.log('🔄 Merged local data with user profile');
                }
            }
        } catch (error) {
            console.error('❌ Error merging local data:', error);
        }
    }

    /**
     * Add authentication event listener
     */
    addAuthListener(callback) {
        this.authListeners.push(callback);
    }

    /**
     * Remove authentication event listener
     */
    removeAuthListener(callback) {
        this.authListeners = this.authListeners.filter(listener => listener !== callback);
    }

    /**
     * Notify authentication listeners
     */
    notifyAuthListeners(event, user) {
        this.authListeners.forEach(listener => {
            try {
                listener(event, user);
            } catch (error) {
                console.error('❌ Auth listener error:', error);
            }
        });
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }
    
    /**
     * Check if current user is admin
     */
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
    
    /**
     * Get user stats
     */
    getUserStats() {
        if (this.currentUser) {
            return this.currentUser.stats;
        }
        
        // Fallback to local stats for guest users
        try {
            const localStats = localStorage.getItem('simple_user_stats');
            if (localStats) {
                return JSON.parse(localStats);
            }
        } catch (error) {
            console.error('❌ Error getting local stats:', error);
        }
        
        // Default stats
        return {
            sessionsCompleted: 0,
            wordsLearned: 0,
            streak: 0,
            accuracy: 0,
            totalTime: 0,
            xp: 0
        };
    }

    /**
     * Update user stats (both local and server)
     */
    async updateUserStats(statsUpdate) {
        try {
            if (this.isAuthenticated()) {
                // Update server
                await this.updateProfile({ stats: statsUpdate });
            } else {
                // Update local storage for guest users
                localStorage.setItem('simple_user_stats', JSON.stringify(statsUpdate));
            }
        } catch (error) {
            console.error('❌ Error updating user stats:', error);
        }
    }

    /**
     * Initialize guest user with default data
     */
    initGuestUser() {
        const guestStats = {
            sessionsCompleted: 0,
            wordsLearned: 0,
            streak: 0,
            accuracy: 0,
            totalTime: 0,
            xp: 0
        };
        
        // Only set if no existing stats
        if (!localStorage.getItem('simple_user_stats')) {
            localStorage.setItem('simple_user_stats', JSON.stringify(guestStats));
        }
        
        console.log('👤 Guest user initialized');
    }
}

// Initialize global auth service
window.authService = new AuthService();

// Global helper functions for easy access
window.login = (credentials) => window.authService.login(credentials);
window.register = (userData) => window.authService.register(userData);
window.logout = () => window.authService.logout();
window.isAuthenticated = () => window.authService.isAuthenticated();
window.getCurrentUser = () => window.authService.getCurrentUser();
window.signInWithGoogle = () => window.authService.signInWithGoogle();

console.log('🔐 Authentication Service loaded successfully!');