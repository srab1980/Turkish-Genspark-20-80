/**
 * 🔐 Authentication UI Components for Turkish Learning App
 * Modern glassmorphism-styled login/register modals
 */

class AuthUI {
    constructor() {
        this.currentView = 'login'; // 'login' or 'register'
        this.isVisible = false;
        this.init();
    }

    init() {
        this.createAuthModal();
        this.attachEventListeners();
        console.log('🔐 Auth UI Components initialized');
    }

    /**
     * Create the main authentication modal
     */
    createAuthModal() {
        const modalHTML = `
            <div id="auth-modal" class="auth-modal" style="display: none;">
                <div class="auth-modal-overlay" onclick="window.authUI.hide()"></div>
                <div class="auth-modal-container">
                    <div class="auth-modal-header">
                        <button class="auth-close-btn" onclick="window.authUI.hide()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="auth-content">
                        <!-- Login Form -->
                        <div id="login-form" class="auth-form">
                            <div class="auth-title">
                                <h2>مرحباً بعودتك!</h2>
                                <p>أدخل بياناتك للمتابعة</p>
                            </div>
                            
                            <form id="login-form-element" class="auth-form-element">
                                <div class="form-group">
                                    <label for="login-email">البريد الإلكتروني</label>
                                    <input type="email" id="login-email" required 
                                           placeholder="example@email.com">
                                </div>
                                
                                <div class="form-group">
                                    <label for="login-password">كلمة المرور</label>
                                    <input type="password" id="login-password" required 
                                           placeholder="••••••••">
                                </div>
                                
                                <button type="submit" class="auth-submit-btn">
                                    <i class="fas fa-sign-in-alt"></i>
                                    تسجيل الدخول
                                </button>
                            </form>
                            
                            <!-- Divider -->
                            <div class="auth-divider">
                                <span>أو</span>
                            </div>
                            
                            <!-- Google Sign-In Button -->
                            <div class="google-signin-container">
                                <button type="button" class="google-signin-btn" onclick="window.authUI.handleGoogleSignIn()">
                                    <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    الدخول باستخدام Google
                                </button>
                                
                                <!-- Hidden Google button for API integration -->
                                <div id="google-signin-button" style="display: none;"></div>
                            </div>
                            
                            <div class="auth-switch">
                                <p>ليس لديك حساب؟ 
                                   <a href="#" onclick="window.authUI.switchView('register')">أنشئ حساب جديد</a>
                                </p>
                            </div>
                        </div>
                        
                        <!-- Register Form -->
                        <div id="register-form" class="auth-form" style="display: none;">
                            <div class="auth-title">
                                <h2>أنشئ حساب جديد</h2>
                                <p>ابدأ رحلتك في تعلم التركية</p>
                            </div>
                            
                            <form id="register-form-element" class="auth-form-element">
                                <div class="form-group">
                                    <label for="register-name">الاسم الكامل</label>
                                    <input type="text" id="register-name" required 
                                           placeholder="أدخل اسمك الكامل">
                                </div>
                                
                                <div class="form-group">
                                    <label for="register-email">البريد الإلكتروني</label>
                                    <input type="email" id="register-email" required 
                                           placeholder="example@email.com">
                                </div>
                                
                                <div class="form-group">
                                    <label for="register-password">كلمة المرور</label>
                                    <input type="password" id="register-password" required 
                                           placeholder="••••••••" minlength="6">
                                </div>
                                
                                <div class="form-group">
                                    <label for="register-language">اللغة المفضلة</label>
                                    <select id="register-language">
                                        <option value="arabic">العربية</option>
                                        <option value="english">English</option>
                                        <option value="turkish">Türkçe</option>
                                    </select>
                                </div>
                                
                                <button type="submit" class="auth-submit-btn">
                                    <i class="fas fa-user-plus"></i>
                                    إنشاء الحساب
                                </button>
                            </form>
                            
                            <div class="auth-switch">
                                <p>لديك حساب بالفعل؟ 
                                   <a href="#" onclick="window.authUI.switchView('login')">تسجيل الدخول</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="auth-footer">
                        <button class="guest-continue-btn" onclick="window.authUI.continueAsGuest()">
                            <i class="fas fa-user"></i>
                            المتابعة كضيف
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Login form submission
        document.getElementById('login-form-element').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Register form submission
        document.getElementById('register-form-element').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister();
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    /**
     * Show authentication modal
     */
    show(view = 'login') {
        this.currentView = view;
        this.isVisible = true;
        
        const modal = document.getElementById('auth-modal');
        modal.style.display = 'flex';
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        this.switchView(view);
    }

    /**
     * Hide authentication modal
     */
    hide() {
        const modal = document.getElementById('auth-modal');
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.style.display = 'none';
            this.isVisible = false;
        }, 300);
    }

    /**
     * Switch between login and register views
     */
    switchView(view) {
        this.currentView = view;
        
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (view === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    }

    /**
     * Handle login form submission
     */
    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const submitBtn = document.querySelector('#login-form .auth-submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
        submitBtn.disabled = true;
        
        try {
            const result = await window.authService.login({ email, password });
            
            if (result.success) {
                this.showMessage('تم تسجيل الدخول بنجاح!', 'success');
                this.hide();
                
                // Refresh page or trigger auth update
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل في تسجيل الدخول', 'error');
            }
        } catch (error) {
            this.showMessage('حدث خطأ. حاول مرة أخرى.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Handle register form submission
     */
    async handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const language = document.getElementById('register-language').value;
        
        const submitBtn = document.querySelector('#register-form .auth-submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
        submitBtn.disabled = true;
        
        try {
            const result = await window.authService.register({ 
                name, email, password, language 
            });
            
            if (result.success) {
                this.showMessage('تم إنشاء الحساب بنجاح!', 'success');
                this.hide();
                
                // Refresh page or trigger auth update
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                this.showMessage(result.message || 'فشل في إنشاء الحساب', 'error');
            }
        } catch (error) {
            this.showMessage('حدث خطأ. حاول مرة أخرى.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Continue as guest
     */
    continueAsGuest() {
        window.authService.initGuestUser();
        this.hide();
        this.showMessage('مرحباً! يمكنك البدء بالتعلم الآن', 'info');
    }

    /**
     * Handle Google Sign-In
     */
    async handleGoogleSignIn() {
        try {
            console.log('🔐 Starting Google Sign-In process...');
            
            if (!window.authService) {
                throw new Error('خدمة المصادقة غير متاحة');
            }
            
            // Check Google Auth readiness
            console.log('🔍 Checking Google Auth status:', {
                isGoogleAuthReady: window.authService.isGoogleAuthReady,
                hasGoogleClientId: !!window.authService.googleClientId,
                googleAuthError: window.authService.googleAuthError
            });
            
            if (!window.authService.isGoogleAuthReady) {
                this.showMessage('تهيئة جوجل... يرجى الانتظار', 'info');
                
                console.log('🔄 Google Auth not ready, attempting initialization...');
                
                // Wait for Google Auth to initialize
                try {
                    await window.authService.initGoogleAuth();
                } catch (initError) {
                    console.error('❌ Google Auth initialization failed:', initError);
                    
                    // Provide specific error messages based on the actual error
                    let errorMessage = 'فشل في تهيئة خدمات Google';
                    
                    if (initError.message.includes('تحتاج إلى تكوين')) {
                        errorMessage = 'تحتاج إلى تكوين معرف Google صحيح. يرجى مراجعة إعدادات التطبيق.';
                    } else if (initError.message.includes('لم يتم تحميل')) {
                        errorMessage = 'فشل في تحميل خدمات Google. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.';
                    } else if (initError.message.includes('configuration not available')) {
                        errorMessage = 'إعدادات Google غير متاحة. يرجى المحاولة لاحقاً أو استخدام التسجيل العادي.';
                    }
                    
                    throw new Error(errorMessage);
                }
                
                if (!window.authService.isGoogleAuthReady) {
                    throw new Error('فشل في تهيئة خدمات Google. يرجى المحاولة لاحقاً.');
                }
            }
            
            // Show loading state
            const googleBtn = document.querySelector('.google-signin-btn');
            const originalText = googleBtn ? googleBtn.innerHTML : '';
            if (googleBtn) {
                googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاتصال بجوجل...';
                googleBtn.disabled = true;
            }
            
            console.log('🚀 Triggering Google Sign-In...');
            
            // Trigger Google Sign-In
            await window.authService.signInWithGoogle();
            
        } catch (error) {
            console.error('❌ Google Sign-In error:', error);

            // Provide specific error messages
            let errorMessage = 'فشل في الاتصال بجوجل. حاول مرة أخرى.';
            
            if (error.message && error.message.includes('خدمة المصادقة')) {
                errorMessage = 'خدمة المصادقة غير متاحة. يرجى إعادة تحميل الصفحة.';
            } else if (error.message && (error.message.includes('تحتاج إلى') || error.message.includes('فشل في تحميل') || error.message.includes('إعدادات'))) {
                errorMessage = error.message;
            } else if (error.message && error.message.includes('not loaded')) {
                errorMessage = 'فشل في تحميل خدمات جوجل. تأكد من اتصالك بالإنترنت.';
            }
            
            this.showMessage(errorMessage, 'error');
            
            // Reset button
            const googleBtn = document.querySelector('.google-signin-btn');
            if (googleBtn) {
                googleBtn.innerHTML = `
                    <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    الدخول باستخدام Google
                `;
                googleBtn.disabled = false;
            }
        }
    }

    /**
     * Show message notification
     */
    showMessage(message, type = 'info') {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        const notification = document.createElement('div');
        notification.className = 'auth-notification';
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            font-weight: 500;
            font-size: 0.875rem;
            max-width: 350px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            direction: rtl;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                              type === 'error' ? 'fa-exclamation-circle' : 
                              type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize global auth UI
window.authUI = new AuthUI();

// Global helper functions
window.showLogin = () => window.authUI.show('login');
window.showRegister = () => window.authUI.show('register');
window.showAuth = (view) => window.authUI.show(view);

console.log('🔐 Authentication UI Components loaded successfully!');