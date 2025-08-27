// Turkish Learning Review System - Spaced Repetition Algorithm (Modified SM-2)

// Review System Class - Manages spaced repetition and review scheduling
function ReviewSystem() {
    this.reviewData = this.loadReviewData();
    this.intervals = [1, 3, 7, 14, 30, 60, 120]; // Days for spaced repetition
    this.init();
}

ReviewSystem.prototype = {
    init: function() {
        this.setupReviewScheduler();
        console.log('Review System initialized with', Object.keys(this.reviewData).length, 'words');
    },
    
    loadReviewData: function() {
        return JSON.parse(localStorage.getItem('turkishReviewData') || '{}');
    },
    
    saveReviewData: function() {
        localStorage.setItem('turkishReviewData', JSON.stringify(this.reviewData));
    },
    
    // Add or update word in review system
    updateWordReview: function(wordId, isCorrect, easeFactor = null) {
        const now = Date.now();
        
        if (!this.reviewData[wordId]) {
            // New word
            this.reviewData[wordId] = {
                id: wordId,
                difficulty: 'new',
                easeFactor: 2.5,
                interval: 0,
                repetitions: 0,
                nextReview: now,
                lastReview: now,
                streak: 0,
                totalReviews: 0,
                correctReviews: 0,
                createdAt: now
            };
        }
        
        const word = this.reviewData[wordId];
        word.lastReview = now;
        word.totalReviews++;
        
        if (isCorrect) {
            word.correctReviews++;
            word.streak++;
            word.repetitions++;
            
            // Calculate new ease factor (SM-2 algorithm modification)
            if (easeFactor !== null) {
                word.easeFactor = easeFactor;
            } else {
                // Auto-calculate based on performance
                const quality = this.calculateQuality(word);
                word.easeFactor = Math.max(1.3, word.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
            }
            
            // Calculate next interval
            if (word.repetitions === 1) {
                word.interval = 1;
            } else if (word.repetitions === 2) {
                word.interval = 6;
            } else {
                word.interval = Math.round(word.interval * word.easeFactor);
            }
            
            // Update difficulty based on performance
            word.difficulty = this.calculateDifficulty(word);
            
        } else {
            // Incorrect answer - reset to struggling
            word.streak = 0;
            word.repetitions = 0;
            word.interval = 0;
            word.difficulty = 'struggling';
            word.easeFactor = Math.max(1.3, word.easeFactor - 0.2);
        }
        
        // Calculate next review date
        word.nextReview = now + (word.interval * 24 * 60 * 60 * 1000);
        
        this.saveReviewData();
        
        // Trigger review stats update
        this.updateReviewStats();
        
        console.log(`Word ${wordId} updated:`, {
            difficulty: word.difficulty,
            interval: word.interval,
            nextReview: new Date(word.nextReview).toLocaleDateString('ar-SA')
        });
        
        return word;
    },
    
    calculateQuality: function(word) {
        // Calculate quality score (0-5) based on performance
        const accuracy = word.totalReviews > 0 ? word.correctReviews / word.totalReviews : 0;
        const streakBonus = Math.min(word.streak / 10, 1); // Max bonus for 10+ streak
        
        let quality = Math.round(accuracy * 4 + streakBonus); // 0-5 scale
        return Math.max(0, Math.min(5, quality));
    },
    
    calculateDifficulty: function(word) {
        const accuracy = word.totalReviews > 0 ? word.correctReviews / word.totalReviews : 0;
        
        if (word.repetitions >= 5 && accuracy >= 0.8) {
            return 'mastered';
        } else if (word.repetitions >= 2 && accuracy >= 0.6) {
            return 'maintenance';
        } else if (word.totalReviews >= 1 && accuracy < 0.5) {
            return 'struggling';
        } else {
            return 'learning';
        }
    },
    
    // Get words due for review
    getWordsForReview: function(type = 'all') {
        const now = Date.now();
        const dueWords = [];
        
        Object.values(this.reviewData).forEach(word => {
            const isDue = word.nextReview <= now;
            
            if (type === 'all' && isDue) {
                dueWords.push(word);
            } else if (type === 'struggling' && word.difficulty === 'struggling' && isDue) {
                dueWords.push(word);
            } else if (type === 'maintenance' && word.difficulty === 'maintenance' && isDue) {
                dueWords.push(word);
            }
        });
        
        // Sort by priority (struggling first, then by due date)
        dueWords.sort((a, b) => {
            const priorityOrder = { 'struggling': 0, 'learning': 1, 'maintenance': 2, 'mastered': 3 };
            const aPriority = priorityOrder[a.difficulty] || 99;
            const bPriority = priorityOrder[b.difficulty] || 99;
            
            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }
            
            return a.nextReview - b.nextReview; // Earlier due dates first
        });
        
        return dueWords;
    },
    
    // Get review statistics
    getReviewStats: function() {
        const now = Date.now();
        const stats = {
            total: 0,
            struggling: 0,
            maintenance: 0,
            mastered: 0,
            dueToday: 0,
            totalReviews: 0
        };
        
        Object.values(this.reviewData).forEach(word => {
            stats.total++;
            stats.totalReviews += word.totalReviews;
            
            if (word.difficulty === 'struggling') stats.struggling++;
            else if (word.difficulty === 'maintenance') stats.maintenance++;
            else if (word.difficulty === 'mastered') stats.mastered++;
            
            if (word.nextReview <= now) {
                stats.dueToday++;
            }
        });
        
        return stats;
    },
    
    updateReviewStats: function() {
        const stats = this.getReviewStats();
        
        // Update UI elements
        const totalElement = document.getElementById('review-total');
        const strugglingElement = document.getElementById('review-struggling');
        const maintenanceElement = document.getElementById('review-maintenance');
        
        if (totalElement) totalElement.textContent = stats.dueToday;
        if (strugglingElement) strugglingElement.textContent = stats.struggling;
        if (maintenanceElement) maintenanceElement.textContent = stats.maintenance;
    },
    
    setupReviewScheduler: function() {
        // Update stats on page load
        setTimeout(() => this.updateReviewStats(), 1000);
        
        // Update stats every minute
        setInterval(() => this.updateReviewStats(), 60000);
    }
};

// Review Session Class - Manages active review sessions
function ReviewSession(wordsToReview, mode = 'flashcard') {
    this.words = wordsToReview || [];
    this.mode = mode;
    this.currentIndex = 0;
    this.responses = [];
    this.startTime = Date.now();
    this.correctAnswers = 0;
    this.totalAnswered = 0;
    
    this.init();
}

ReviewSession.prototype = {
    init: function() {
        if (this.words.length === 0) {
            this.showNoWordsMessage();
            return;
        }
        
        this.renderSession();
        this.bindEvents();
    },
    
    showNoWordsMessage: function() {
        const container = document.getElementById('review-content');
        container.innerHTML = `
            <div class="no-review-words">
                <div class="no-review-card">
                    <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">لا توجد كلمات للمراجعة!</h3>
                    <p class="text-gray-600 mb-4">أحسنت! لقد راجعت جميع الكلمات المستحقة اليوم.</p>
                    <button id="return-dashboard" class="btn-primary">
                        <i class="fas fa-home"></i>
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('return-dashboard').addEventListener('click', () => {
            window.showSection('dashboard');
        });
    },
    
    renderSession: function() {
        const container = document.getElementById('review-content');
        const currentWord = this.getCurrentWordData();
        
        if (!currentWord) {
            this.completeSession();
            return;
        }
        
        container.innerHTML = `
            <div class="review-progress">
                <div class="review-info">
                    <span>المراجعة ${this.currentIndex + 1} من ${this.words.length}</span>
                    <span>صعوبة: ${this.getDifficultyLabel(this.words[this.currentIndex].difficulty)}</span>
                </div>
                <div class="session-progress-bar">
                    <div class="session-progress-fill" style="width: ${(this.currentIndex / this.words.length) * 100}%"></div>
                </div>
            </div>
            
            <div class="review-flashcard-container">
                ${this.renderReviewFlashcard(currentWord)}
            </div>
            
            <div class="review-response-buttons">
                <button class="review-btn review-btn-hard" data-response="hard">
                    <i class="fas fa-times"></i>
                    <span>صعب</span>
                    <small>أعد خلال دقائق</small>
                </button>
                <button class="review-btn review-btn-medium" data-response="medium">
                    <i class="fas fa-minus"></i>
                    <span>متوسط</span>
                    <small>أعد خلال يوم</small>
                </button>
                <button class="review-btn review-btn-easy" data-response="easy">
                    <i class="fas fa-check"></i>
                    <span>سهل</span>
                    <small>أعد خلال عدة أيام</small>
                </button>
                <button class="review-btn review-btn-perfect" data-response="perfect">
                    <i class="fas fa-star"></i>
                    <span>ممتاز</span>
                    <small>أعد خلال أسبوع</small>
                </button>
            </div>
        `;
        
        this.bindReviewEvents();
    },
    
    renderReviewFlashcard: function(wordData) {
        // Check if example sentences are available
        const hasExample = wordData.example && wordData.exampleArabic;
        
        // Get icon (FontAwesome or emoji)
        const icon = wordData.icon || 'fas fa-language';
        const emoji = wordData.emoji || '📚';
        
        return `
            <div class="flashcard-container" id="review-flashcard-container">
                <div class="flashcard" id="review-flashcard">
                    <div class="flashcard-front">
                        <div class="flashcard-icon-container">
                            <div class="word-icon emoji">${emoji}</div>
                        </div>
                        <div class="flashcard-turkish">${wordData.turkish}</div>
                        <div class="flashcard-pronunciation">[${wordData.pronunciation}]</div>
                        <div class="tts-controls">
                            <button class="tts-btn tts-word-btn" onclick="window.speakTurkishWord('${wordData.turkish.replace(/'/g, '\\\'')}')" title="استمع للكلمة">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        <div class="review-stats">
                            <small>مراجعات: ${this.words[this.currentIndex].totalReviews}</small>
                            <small>نسبة النجاح: ${this.getAccuracy(this.words[this.currentIndex])}%</small>
                        </div>
                        <div class="flashcard-hint">اضغط لرؤية الترجمة</div>
                    </div>
                    <div class="flashcard-back">
                        <div class="flashcard-icon-container">
                            <i class="${icon} word-icon"></i>
                        </div>
                        <div class="flashcard-arabic">${wordData.arabic}</div>
                        <div class="flashcard-english">${wordData.english}</div>
                        ${hasExample ? `
                        <div class="flashcard-examples">
                            <div class="example-divider">
                                <i class="fas fa-quote-left"></i>
                                <span>مثال</span>
                                <i class="fas fa-quote-right"></i>
                            </div>
                            <div class="flashcard-example-turkish">${wordData.example}</div>
                            <div class="flashcard-example-arabic">${wordData.exampleArabic}</div>
                            <div class="tts-controls" style="justify-content: center; margin: 0.5rem 0 0.25rem 0;">
                                <button class="tts-btn tts-sentence-btn" onclick="window.speakTurkishSentence('${wordData.example.replace(/'/g, '\\\'')}')" title="استمع للمثال">
                                    <i class="fas fa-play"></i>
                                </button>
                            </div>
                        </div>
                        ` : ''}
                        <div class="review-difficulty">
                            صعوبة: <span class="difficulty-badge ${wordData.difficulty}">${this.getDifficultyLabel(this.words[this.currentIndex].difficulty)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    getCurrentWordData: function() {
        const reviewWord = this.words[this.currentIndex];
        if (!reviewWord || !window.vocabularyData) return null;
        
        // Find the word data in vocabulary
        for (const category of Object.values(window.vocabularyData)) {
            const word = category.find(w => w.id === reviewWord.id);
            if (word) return word;
        }
        
        return null;
    },
    
    bindReviewEvents: function() {
        // Flashcard flip with audio
        const flashcard = document.getElementById('review-flashcard');
        if (flashcard) {
            flashcard.addEventListener('click', () => {
                const wasFlipped = flashcard.classList.contains('flipped');
                flashcard.classList.toggle('flipped');
                const isNowFlipped = flashcard.classList.contains('flipped');
                
                // Play audio based on the new state
                const currentWordData = this.getCurrentWordData();
                if (window.turkishTTS && currentWordData) {
                    setTimeout(() => {
                        if (isNowFlipped && !wasFlipped) {
                            // Just flipped to back - play word + example
                            console.log('Review: Playing audio for flipped card (back side)');
                            window.speakTurkishWord(currentWordData.turkish).then(() => {
                                if (currentWordData.example) {
                                    setTimeout(() => {
                                        window.speakTurkishSentence(currentWordData.example).catch(err => {
                                            console.log('Review: Example pronunciation failed:', err);
                                        });
                                    }, 300);
                                }
                            }).catch(err => {
                                console.log('Review: Word pronunciation failed:', err);
                            });
                        } else if (!isNowFlipped && wasFlipped) {
                            // Just flipped back to front - play word only
                            console.log('Review: Playing audio for front side');
                            window.speakTurkishWord(currentWordData.turkish).catch(err => {
                                console.log('Review: Word pronunciation failed:', err);
                            });
                        }
                    }, 200); // Small delay to allow flip animation to start
                }
            });
        }
        
        // Response buttons
        document.querySelectorAll('.review-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const response = btn.getAttribute('data-response');
                this.recordReviewResponse(response);
            });
        });
    },
    
    recordReviewResponse: function(response) {
        const reviewWord = this.words[this.currentIndex];
        const currentWordData = this.getCurrentWordData();
        
        if (!reviewWord || !currentWordData) return;
        
        // Map response to correctness and ease factor
        const responseMap = {
            'hard': { isCorrect: false, easeFactor: 1.3 },
            'medium': { isCorrect: true, easeFactor: 2.0 },
            'easy': { isCorrect: true, easeFactor: 2.5 },
            'perfect': { isCorrect: true, easeFactor: 3.0 }
        };
        
        const responseData = responseMap[response];
        
        // Update review system
        if (window.reviewSystem) {
            window.reviewSystem.updateWordReview(
                reviewWord.id, 
                responseData.isCorrect, 
                responseData.easeFactor
            );
        }
        
        // Record response
        this.responses.push({
            wordId: reviewWord.id,
            word: currentWordData.turkish,
            response: response,
            isCorrect: responseData.isCorrect,
            timestamp: Date.now(),
            previousDifficulty: reviewWord.difficulty
        });
        
        // Update stats
        if (responseData.isCorrect) {
            this.correctAnswers++;
        }
        this.totalAnswered++;
        
        // Show feedback and advance
        this.showReviewFeedback(response, currentWordData);
        
        setTimeout(() => {
            if (this.currentIndex < this.words.length - 1) {
                this.currentIndex++;
                this.renderSession();
            } else {
                this.completeSession();
            }
        }, 1500);
    },
    
    showReviewFeedback: function(response, wordData) {
        const feedbackMap = {
            'hard': { color: 'bg-red-500', message: 'سنراجعها قريباً', icon: '🔄' },
            'medium': { color: 'bg-yellow-500', message: 'جيد!', icon: '👍' },
            'easy': { color: 'bg-green-500', message: 'ممتاز!', icon: '✅' },
            'perfect': { color: 'bg-blue-500', message: 'رائع!', icon: '⭐' }
        };
        
        const feedback = feedbackMap[response];
        
        const notification = document.createElement('div');
        notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${feedback.color} text-white p-4 rounded-lg shadow-lg z-50`;
        notification.innerHTML = `
            <div class="text-center font-bold">
                ${feedback.icon} ${feedback.message}
            </div>
            <div class="text-sm opacity-90">${wordData.turkish} - ${wordData.arabic}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 1500);
    },
    
    completeSession: function() {
        const sessionStats = {
            totalWords: this.words.length,
            correctAnswers: this.correctAnswers,
            accuracy: this.totalAnswered > 0 ? Math.round((this.correctAnswers / this.totalAnswered) * 100) : 0,
            timeSpent: Math.round((Date.now() - this.startTime) / 1000 / 60),
            responses: this.responses
        };
        
        const container = document.getElementById('review-content');
        container.innerHTML = `
            <div class="review-complete">
                <div class="completion-card">
                    <div class="completion-header">
                        <i class="fas fa-medal text-6xl text-blue-500 mb-4"></i>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">مراجعة مكتملة!</h2>
                        <p class="text-gray-600">أحسنت في مراجعة الكلمات</p>
                    </div>
                    
                    <div class="completion-stats">
                        <div class="stat-row">
                            <span class="stat-label">الكلمات المراجعة:</span>
                            <span class="stat-value">${sessionStats.totalWords}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">الإجابات الجيدة:</span>
                            <span class="stat-value">${sessionStats.correctAnswers}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">الأداء:</span>
                            <span class="stat-value">${sessionStats.accuracy}%</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">الوقت:</span>
                            <span class="stat-value">${sessionStats.timeSpent} دقيقة</span>
                        </div>
                    </div>
                    
                    <div class="completion-actions">
                        <button id="return-home-review" class="btn-primary">
                            <i class="fas fa-home"></i>
                            العودة للرئيسية
                        </button>
                        <button id="continue-learning" class="btn-secondary">
                            <i class="fas fa-graduation-cap"></i>
                            متابعة التعلم
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('return-home-review').addEventListener('click', () => {
            window.showSection('dashboard');
        });
        
        document.getElementById('continue-learning').addEventListener('click', () => {
            window.showSection('learn');
        });
        
        // Update XP
        const xpGained = sessionStats.correctAnswers * 5; // 5 XP per correct review
        const currentXP = parseInt(localStorage.getItem('userXP') || '0');
        const newXP = currentXP + xpGained;
        localStorage.setItem('userXP', newXP.toString());
        
        // Update UI
        const xpElement = document.getElementById('user-xp');
        if (xpElement) {
            xpElement.textContent = newXP;
        }
    },
    
    getDifficultyLabel: function(difficulty) {
        const labels = {
            'new': 'جديد',
            'learning': 'تعلم',
            'struggling': 'صعب',
            'maintenance': 'مراجعة',
            'mastered': 'متقن'
        };
        
        return labels[difficulty] || difficulty;
    },
    
    getAccuracy: function(word) {
        return word.totalReviews > 0 ? Math.round((word.correctReviews / word.totalReviews) * 100) : 0;
    }
};

// CSS for review system
const reviewStyles = `
<style>
.review-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border: 2px solid transparent;
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    min-width: 0;
}

.review-btn i {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.review-btn span {
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.review-btn small {
    font-size: 0.75rem;
    opacity: 0.8;
    text-align: center;
}

.review-btn-hard {
    background: linear-gradient(135deg, #EF4444, #DC2626);
    color: white;
}

.review-btn-medium {
    background: linear-gradient(135deg, #F59E0B, #D97706);
    color: white;
}

.review-btn-easy {
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
}

.review-btn-perfect {
    background: linear-gradient(135deg, #3B82F6, #2563EB);
    color: white;
}

.review-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.review-response-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    justify-content: center;
}

.review-stats {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
    font-size: 0.875rem;
    color: #6B7280;
}

.review-difficulty {
    margin: 1rem 0;
    text-align: center;
}

.difficulty-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.difficulty-badge.new {
    background: #E5E7EB;
    color: #374151;
}

.difficulty-badge.learning {
    background: #DBEAFE;
    color: #1E40AF;
}

.difficulty-badge.struggling {
    background: #FEE2E2;
    color: #DC2626;
}

.difficulty-badge.maintenance {
    background: #FEF3C7;
    color: #D97706;
}

.difficulty-badge.mastered {
    background: #D1FAE5;
    color: #059669;
}

.no-review-words {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
}

.no-review-card {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 1.5rem;
    padding: 3rem;
    text-align: center;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    max-width: 400px;
}

.review-progress {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 1rem;
    padding: 1rem;
    margin-bottom: 2rem;
}

.review-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #4B5563;
}

@media (max-width: 768px) {
    .review-response-buttons {
        flex-direction: column;
    }
    
    .review-btn {
        margin-bottom: 0.5rem;
    }
    
    .review-stats {
        flex-direction: column;
        gap: 0.25rem;
        text-align: center;
    }
}
</style>
`;

// Inject styles
if (!document.querySelector('#review-system-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'review-system-styles';
    styleElement.innerHTML = reviewStyles;
    document.head.appendChild(styleElement);
}

// Initialize global review system
window.reviewSystem = new ReviewSystem();

// Global function to start review
window.startReview = function(type = 'all') {
    const wordsToReview = window.reviewSystem.getWordsForReview(type);
    const reviewContent = document.getElementById('review-content');
    
    if (!reviewContent) {
        console.error('Review content container not found');
        return;
    }
    
    reviewContent.classList.remove('hidden');
    window.showSection('review');
    
    window.currentReviewSession = new ReviewSession(wordsToReview);
};

console.log('Review System loaded successfully!');