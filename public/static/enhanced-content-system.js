// 📚 Enhanced Content & Learning System for Turkish Learning App

class EnhancedContentSystem {
  constructor() {
    this.difficultyLevels = ['beginner', 'intermediate', 'advanced'];
    this.currentDifficulty = localStorage.getItem('turkish-app-difficulty') || 'beginner';
    this.phraseMode = false;
    
    this.enhancedVocabulary = this.initializeEnhancedVocabulary();
    this.phrases = this.initializePhrases();
    this.culturalNotes = this.initializeCulturalNotes();
    
    this.init();
  }

  init() {
    this.createDifficultySelector();
    this.createPhraseModeToggle();
    this.setupNavigationEnhancements();
    this.initializeContentFiltering();
    
    console.log('📚 Enhanced Content & Learning System initialized successfully!');
  }

  // 🎓 Enhanced Vocabulary with Multiple Examples and Difficulty Levels
  initializeEnhancedVocabulary() {
    return {
      greetings: [
        {
          id: 1, turkish: "Merhaba", arabic: "مرحبا", english: "Hello", 
          pronunciation: "mer-ha-BA", difficulty: "beginner",
          examples: [
            { sentence: "Merhaba, nasılsınız?", arabic: "مرحبا، كيف حالك؟", context: "formal" },
            { sentence: "Merhaba arkadaşlar!", arabic: "مرحبا أيها الأصدقاء!", context: "informal" },
            { sentence: "Merhaba, benim adım Ali.", arabic: "مرحبا، اسمي علي.", context: "introduction" }
          ],
          culturalNote: "Used at any time of day. More casual than 'Selam'.",
          regionalVariations: [
            { region: "Istanbul", variant: "Merhaba", usage: "Standard" },
            { region: "Ankara", variant: "Selam", usage: "More common in capital" },
            { region: "Izmir", variant: "Merhaba canım", usage: "Warmer, friendly" }
          ],
          icon: "fas fa-hand-wave", emoji: "👋"
        },
        {
          id: 2, turkish: "Günaydın", arabic: "صباح الخير", english: "Good morning", 
          pronunciation: "gün-ay-DIN", difficulty: "beginner",
          examples: [
            { sentence: "Günaydın! Bugün hava çok güzel.", arabic: "صباح الخير! الطقس جميل جداً اليوم.", context: "weather" },
            { sentence: "Günaydın efendim.", arabic: "صباح الخير سيدي.", context: "formal" },
            { sentence: "Günaydın anne!", arabic: "صباح الخير أمي!", context: "family" }
          ],
          culturalNote: "Used until approximately 12 PM. Shows respect and politeness.",
          regionalVariations: [
            { region: "Standard", variant: "Günaydın", usage: "Most common" },
            { region: "Eastern Turkey", variant: "Günaydın be", usage: "Informal addition" }
          ],
          icon: "fas fa-sun", emoji: "☀️"
        },
        {
          id: 3, turkish: "Nasılsınız?", arabic: "كيف حالك؟", english: "How are you?", 
          pronunciation: "na-sıl-sı-nız", difficulty: "intermediate",
          examples: [
            { sentence: "Nasılsınız? İyi misiniz?", arabic: "كيف حالك؟ هل أنت بخير؟", context: "formal concern" },
            { sentence: "Nasılsın kardeşim?", arabic: "كيف حالك يا أخي؟", context: "informal friend" },
            { sentence: "Aile nasıl?", arabic: "كيف العائلة؟", context: "family inquiry" }
          ],
          culturalNote: "Formal 'sınız', informal 'sın'. Shows genuine interest in wellbeing.",
          regionalVariations: [
            { region: "Standard", variant: "Nasılsınız?", usage: "Formal" },
            { region: "Black Sea", variant: "Nasıl gidiyor?", usage: "How's it going?" },
            { region: "Southeast", variant: "Keyfiniz nasıl?", usage: "How are your spirits?" }
          ],
          icon: "fas fa-question-circle", emoji: "🤔"
        }
      ],
      
      travel: [
        {
          id: 7, turkish: "Havaalanı", arabic: "المطار", english: "Airport", 
          pronunciation: "ha-va-a-la-NI", difficulty: "beginner",
          examples: [
            { sentence: "Havaalanına taksiyle gittim.", arabic: "ذهبت إلى المطار بالتاكسي.", context: "transportation" },
            { sentence: "Havaalanında kayboldum.", arabic: "تهت في المطار.", context: "problem" },
            { sentence: "Havaalanı çok büyük.", arabic: "المطار كبير جداً.", context: "description" }
          ],
          culturalNote: "Turkish airports are known for their hospitality and duty-free shopping.",
          regionalVariations: [
            { region: "Standard", variant: "Havaalanı", usage: "Universal" },
            { region: "Old Turkish", variant: "Tayyare meydanı", usage: "Historical term" }
          ],
          icon: "fas fa-plane", emoji: "✈️"
        },
        {
          id: 8, turkish: "Otel", arabic: "فندق", english: "Hotel", 
          pronunciation: "o-TEL", difficulty: "beginner",
          examples: [
            { sentence: "Bu otel çok güzel.", arabic: "هذا الفندق جميل جداً.", context: "compliment" },
            { sentence: "Otelde kalıyorum.", arabic: "أنا أقيم في الفندق.", context: "accommodation" },
            { sentence: "Otel rezervasyonu yapmak istiyorum.", arabic: "أريد أن أحجز في الفندق.", context: "booking" }
          ],
          culturalNote: "Turkish hospitality in hotels is legendary. Expect warm welcome and tea.",
          regionalVariations: [
            { region: "Standard", variant: "Otel", usage: "Modern term" },
            { region: "Traditional", variant: "Han", usage: "Historical inns" },
            { region: "Boutique", variant: "Konak", usage: "Boutique hotels" }
          ],
          icon: "fas fa-bed", emoji: "🏨"
        }
      ],

      // Advanced vocabulary for intermediate/advanced learners
      business: [
        {
          id: 100, turkish: "Müzakere", arabic: "مفاوضة", english: "Negotiation", 
          pronunciation: "mü-za-ke-re", difficulty: "advanced",
          examples: [
            { sentence: "Müzakere süreci çok uzun sürdü.", arabic: "استغرقت عملية التفاوض وقتاً طويلاً.", context: "business" },
            { sentence: "Başarılı bir müzakere yaptık.", arabic: "أجرينا مفاوضات ناجحة.", context: "success" },
            { sentence: "Müzakerelere devam ediyoruz.", arabic: "نواصل المفاوضات.", context: "ongoing" }
          ],
          culturalNote: "Turkish business culture values relationship-building before formal negotiations.",
          regionalVariations: [
            { region: "Business", variant: "Müzakere", usage: "Formal negotiations" },
            { region: "Diplomatic", variant: "Görüşme", usage: "Political discussions" }
          ],
          icon: "fas fa-handshake", emoji: "🤝"
        }
      ],

      culture: [
        {
          id: 200, turkish: "Misafirperverlik", arabic: "كرم الضيافة", english: "Hospitality", 
          pronunciation: "mi-sa-fir-per-ver-lik", difficulty: "intermediate",
          examples: [
            { sentence: "Türk misafirperverliği çok ünlüdür.", arabic: "كرم الضيافة التركية مشهور جداً.", context: "cultural trait" },
            { sentence: "Misafirperverliklerinden çok etkilendim.", arabic: "تأثرت كثيراً من كرم ضيافتهم.", context: "appreciation" },
            { sentence: "Bu kadar misafirperverlik görmedim.", arabic: "لم أر مثل هذا الكرم في الضيافة.", context: "amazement" }
          ],
          culturalNote: "Core Turkish value. Guests are considered gifts from God.",
          regionalVariations: [
            { region: "Anatolia", variant: "Konukseverlik", usage: "Guest-loving" },
            { region: "Ottoman", variant: "Misafirperverlik", usage: "Classical term" }
          ],
          icon: "fas fa-home", emoji: "🏠"
        }
      ]
    };
  }

  // 💬 Common Turkish Phrases System
  initializePhrases() {
    return {
      daily: {
        title: "Daily Phrases",
        titleArabic: "العبارات اليومية",
        difficulty: "beginner",
        phrases: [
          {
            id: 1, turkish: "Nasıl gidiyor?", arabic: "كيف تسير الأمور؟", 
            english: "How's it going?", pronunciation: "na-sıl gi-di-yor",
            usage: "Casual greeting between friends",
            culturalNote: "More casual than 'Nasılsınız?' - shows familiarity",
            examples: [
              { sentence: "Selam! Nasıl gidiyor işler?", arabic: "مرحباً! كيف تسير الأعمال؟" },
              { sentence: "Nasıl gidiyor okul?", arabic: "كيف تسير المدرسة؟" }
            ]
          },
          {
            id: 2, turkish: "Çok güzel!", arabic: "جميل جداً!", 
            english: "Very beautiful/nice!", pronunciation: "chok gü-zel",
            usage: "Expressing admiration or approval",
            culturalNote: "Universal positive expression, very commonly used",
            examples: [
              { sentence: "Bu manzara çok güzel!", arabic: "هذا المنظر جميل جداً!" },
              { sentence: "Yemeğin çok güzel!", arabic: "الطعام لذيذ جداً!" }
            ]
          }
        ]
      },
      
      restaurant: {
        title: "Restaurant Phrases",
        titleArabic: "عبارات المطعم",
        difficulty: "intermediate",
        phrases: [
          {
            id: 10, turkish: "Hesap, lütfen", arabic: "الحساب، من فضلك", 
            english: "The bill, please", pronunciation: "he-sap lüt-fen",
            usage: "Requesting the check at restaurants",
            culturalNote: "Polite way to ask for bill. Tipping 10-15% is customary",
            examples: [
              { sentence: "Afedersiniz, hesap lütfen.", arabic: "عذراً، الحساب من فضلك." },
              { sentence: "Hesabı ayırabilir misiniz?", arabic: "هل يمكنكم تقسيم الحساب؟" }
            ]
          },
          {
            id: 11, turkish: "Afiyet olsun", arabic: "بالهناء والشفاء", 
            english: "Bon appetit", pronunciation: "a-fi-yet ol-sun",
            usage: "Wishing good health while eating",
            culturalNote: "Said when someone is eating, response: 'Elinize sağlık'",
            examples: [
              { sentence: "Afiyet olsun, güzel görünüyor.", arabic: "بالهناء والشفاء، يبدو لذيذاً." },
              { sentence: "Size de afiyet olsun.", arabic: "وأنتم بالهناء والشفاء." }
            ]
          }
        ]
      },

      shopping: {
        title: "Shopping Phrases", 
        titleArabic: "عبارات التسوق",
        difficulty: "intermediate",
        phrases: [
          {
            id: 20, turkish: "Bu ne kadar?", arabic: "بكم هذا؟", 
            english: "How much is this?", pronunciation: "bu ne ka-dar",
            usage: "Asking for prices while shopping",
            culturalNote: "Bargaining is common in markets but not in regular stores",
            examples: [
              { sentence: "Bu çanta ne kadar?", arabic: "بكم هذه الحقيبة؟" },
              { sentence: "Şu ayakkabılar ne kadar?", arabic: "بكم تلك الأحذية؟" }
            ]
          }
        ]
      },

      advanced: {
        title: "Advanced Expressions",
        titleArabic: "التعبيرات المتقدمة", 
        difficulty: "advanced",
        phrases: [
          {
            id: 30, turkish: "Başınız sağ olsun", arabic: "البقاء في حياتكم", 
            english: "My condolences", pronunciation: "ba-şı-nız sağ ol-sun",
            usage: "Expressing condolences for loss",
            culturalNote: "Deep cultural expression of sympathy and support",
            examples: [
              { sentence: "Başınız sağ olsun, Allah rahmet eylesin.", arabic: "البقاء في حياتكم، رحمه الله." }
            ]
          }
        ]
      }
    };
  }

  // 🏛️ Cultural Notes System
  initializeCulturalNotes() {
    return {
      greetings: {
        general: "Turkish greetings vary by time, formality, and relationship. Always respond appropriately to show respect.",
        tips: [
          "Use 'efendim' to show extra respect",
          "Physical contact depends on gender and relationship",
          "Eye contact shows sincerity and respect"
        ]
      },
      dining: {
        general: "Turkish dining culture emphasizes hospitality, sharing, and taking time to enjoy meals together.",
        tips: [
          "Wait for the eldest to start eating",
          "Keep hands visible on the table",
          "Compliment the food - it's expected and appreciated",
          "Tea is offered after every meal"
        ]
      },
      business: {
        general: "Turkish business culture values personal relationships, respect for hierarchy, and patience.",
        tips: [
          "Build personal relationships before business",
          "Dress conservatively and professionally",
          "Expect multiple meetings before decisions",
          "Show respect for age and seniority"
        ]
      }
    };
  }

  // 🎚️ Difficulty Level Management
  createDifficultySelector() {
    const selector = document.createElement('div');
    selector.className = 'difficulty-selector';
    selector.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <label style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.5rem; display: block;">
          <i class="fas fa-layer-group"></i> Difficulty Level
        </label>
        <select id="difficulty-level" style="width: 100%; padding: 0.5rem; border-radius: 0.5rem; background: var(--glass-bg-light); border: 1px solid var(--glass-border-light); color: var(--text-primary);">
          <option value="beginner">🟢 Beginner (A1-A2)</option>
          <option value="intermediate">🟡 Intermediate (B1-B2)</option>
          <option value="advanced">🔴 Advanced (C1-C2)</option>
        </select>
      </div>
    `;

    // Find customization panel and add difficulty selector
    setTimeout(() => {
      const customPanel = document.querySelector('.customization-panel');
      if (customPanel) {
        const settingsGroups = customPanel.querySelectorAll('.setting-group');
        if (settingsGroups.length > 0) {
          settingsGroups[0].parentNode.insertBefore(selector, settingsGroups[0]);
          
          const difficultySelect = document.getElementById('difficulty-level');
          difficultySelect.value = this.currentDifficulty;
          difficultySelect.addEventListener('change', (e) => {
            this.setDifficulty(e.target.value);
          });
        }
      }
    }, 1000);
  }

  setDifficulty(level) {
    this.currentDifficulty = level;
    localStorage.setItem('turkish-app-difficulty', level);
    this.filterContentByDifficulty();
    
    if (window.visualUXSystem) {
      window.visualUXSystem.showNotification(`📚 Switched to ${level} level!`);
    }
  }

  filterContentByDifficulty() {
    // Filter vocabulary based on difficulty
    const filteredVocab = {};
    Object.keys(this.enhancedVocabulary).forEach(category => {
      filteredVocab[category] = this.enhancedVocabulary[category].filter(word => {
        if (this.currentDifficulty === 'beginner') return word.difficulty === 'beginner';
        if (this.currentDifficulty === 'intermediate') return ['beginner', 'intermediate'].includes(word.difficulty);
        return true; // Advanced shows all
      });
    });
    
    // Update the global vocabulary if the learning system exists
    if (window.TurkishLearningApp && window.TurkishLearningApp.categories) {
      // Refresh the categories with filtered content
      this.refreshLearningContent(filteredVocab);
    }
  }

  refreshLearningContent(filteredVocab) {
    // Update the main app with filtered vocabulary
    Object.keys(filteredVocab).forEach(category => {
      if (window.TurkishLearningApp.vocabularyData && window.TurkishLearningApp.vocabularyData[category]) {
        window.TurkishLearningApp.vocabularyData[category] = filteredVocab[category];
      }
    });
    
    // Refresh UI if in learning section
    const currentSection = document.querySelector('.section.active');
    if (currentSection && currentSection.id === 'learning-section') {
      window.TurkishLearningApp.populateCategories();
    }
  }

  // 💬 Phrase Learning Mode
  createPhraseModeToggle() {
    const toggle = document.createElement('div');
    toggle.className = 'phrase-mode-toggle';
    toggle.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <label style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
          <span><i class="fas fa-comments"></i> Phrase Learning</span>
          <input type="checkbox" id="phrase-mode-toggle" style="transform: scale(1.2);">
        </label>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.25rem;">
          Learn common Turkish phrases and expressions
        </p>
      </div>
    `;

    // Add to customization panel
    setTimeout(() => {
      const customPanel = document.querySelector('.customization-panel');
      if (customPanel) {
        const difficultySelector = customPanel.querySelector('.difficulty-selector');
        if (difficultySelector) {
          difficultySelector.parentNode.insertBefore(toggle, difficultySelector.nextSibling);
          
          const phraseModeCheckbox = document.getElementById('phrase-mode-toggle');
          phraseModeCheckbox.addEventListener('change', (e) => {
            this.togglePhraseMode(e.target.checked);
          });
        }
      }
    }, 1100);
  }

  togglePhraseMode(enabled) {
    this.phraseMode = enabled;
    
    if (enabled) {
      this.showPhraseContent();
    } else {
      this.showWordContent();
    }
    
    if (window.visualUXSystem) {
      window.visualUXSystem.showNotification(`💬 Phrase mode ${enabled ? 'enabled' : 'disabled'}!`);
    }
  }

  showPhraseContent() {
    // Create phrase learning interface
    this.createPhraseLearningInterface();
  }

  showWordContent() {
    // Return to word learning interface
    if (window.TurkishLearningApp) {
      window.TurkishLearningApp.populateCategories();
    }
  }

  createPhraseLearningInterface() {
    const learningSection = document.getElementById('learning-section');
    if (!learningSection) return;

    const phrasesContainer = learningSection.querySelector('.categories-grid');
    if (!phrasesContainer) return;

    phrasesContainer.innerHTML = Object.keys(this.phrases).map(categoryKey => {
      const category = this.phrases[categoryKey];
      const difficultyColor = this.getDifficultyColor(category.difficulty);
      
      return `
        <div class="phrase-category-card glass-card interactive-element" data-category="${categoryKey}">
          <div class="category-header">
            <div class="category-icon">💬</div>
            <div class="category-name">${category.title}</div>
            <div class="category-name-arabic">${category.titleArabic}</div>
          </div>
          <div class="difficulty-badge" style="background: ${difficultyColor}; color: white; padding: 0.25rem 0.5rem; border-radius: 1rem; font-size: 0.75rem; margin: 0.5rem 0;">
            ${category.difficulty.toUpperCase()}
          </div>
          <div class="category-stats">
            <span>${category.phrases.length} phrases</span>
          </div>
        </div>
      `;
    }).join('');

    // Add click events to phrase categories
    phrasesContainer.querySelectorAll('.phrase-category-card').forEach(card => {
      card.addEventListener('click', () => {
        const categoryKey = card.getAttribute('data-category');
        this.startPhraseLearning(categoryKey);
      });
    });
  }

  getDifficultyColor(difficulty) {
    switch(difficulty) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  }

  startPhraseLearning(categoryKey) {
    const category = this.phrases[categoryKey];
    if (!category) return;

    // Create phrase learning interface similar to flashcards
    this.createPhraseFlashcards(category.phrases);
  }

  createPhraseFlashcards(phrases) {
    const learningSection = document.getElementById('learning-section');
    if (!learningSection) return;

    learningSection.innerHTML = `
      <div class="phrase-learning-container">
        <div class="session-header glass-card">
          <h2 style="color: var(--text-primary);">
            <i class="fas fa-comments"></i> Phrase Learning Session
          </h2>
          <div class="session-progress">
            <div class="session-progress-fill" style="width: 0%"></div>
          </div>
        </div>
        
        <div class="phrase-flashcard-container" id="phrase-flashcard-container">
          ${this.createPhraseFlashcard(phrases[0])}
        </div>
        
        <div class="phrase-navigation">
          <button class="btn-animated" id="prev-phrase" disabled>
            <i class="fas fa-arrow-left"></i> Previous
          </button>
          <span class="phrase-counter">1 / ${phrases.length}</span>
          <button class="btn-animated" id="next-phrase">
            Next <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;

    this.setupPhraseNavigation(phrases);
  }

  createPhraseFlashcard(phrase) {
    return `
      <div class="phrase-flashcard glass-card">
        <div class="phrase-front">
          <div class="phrase-turkish">${phrase.turkish}</div>
          <div class="phrase-pronunciation">[${phrase.pronunciation}]</div>
          <div class="phrase-usage">${phrase.usage}</div>
        </div>
        
        <div class="phrase-back" style="display: none;">
          <div class="phrase-arabic">${phrase.arabic}</div>
          <div class="phrase-english">${phrase.english}</div>
          
          <div class="cultural-note">
            <h4><i class="fas fa-lightbulb"></i> Cultural Note:</h4>
            <p>${phrase.culturalNote}</p>
          </div>
          
          <div class="phrase-examples">
            <h4><i class="fas fa-list"></i> Examples:</h4>
            ${phrase.examples.map(ex => `
              <div class="example-item">
                <div class="example-turkish">${ex.sentence}</div>
                <div class="example-arabic">${ex.arabic}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <button class="flip-phrase-btn" onclick="this.closest('.phrase-flashcard').classList.toggle('flipped')">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    `;
  }

  setupPhraseNavigation(phrases) {
    let currentIndex = 0;
    
    const prevBtn = document.getElementById('prev-phrase');
    const nextBtn = document.getElementById('next-phrase');
    const counter = document.querySelector('.phrase-counter');
    const container = document.getElementById('phrase-flashcard-container');
    
    const updateNavigation = () => {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === phrases.length - 1;
      counter.textContent = `${currentIndex + 1} / ${phrases.length}`;
      
      // Update progress
      const progress = ((currentIndex + 1) / phrases.length) * 100;
      document.querySelector('.session-progress-fill').style.width = `${progress}%`;
    };
    
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        container.innerHTML = this.createPhraseFlashcard(phrases[currentIndex]);
        updateNavigation();
      }
    });
    
    nextBtn.addEventListener('click', () => {
      if (currentIndex < phrases.length - 1) {
        currentIndex++;
        container.innerHTML = this.createPhraseFlashcard(phrases[currentIndex]);
        updateNavigation();
      }
    });
    
    updateNavigation();
  }

  // 🌍 Regional Variations Display
  showRegionalVariations(word) {
    if (!word.regionalVariations) return '';
    
    return `
      <div class="regional-variations">
        <h4><i class="fas fa-globe"></i> Regional Variations:</h4>
        ${word.regionalVariations.map(variation => `
          <div class="variation-item">
            <span class="region-name">${variation.region}:</span>
            <span class="variant">${variation.variant}</span>
            <span class="usage-note">(${variation.usage})</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 📖 Multiple Examples Display
  showMultipleExamples(word) {
    if (!word.examples) return '';
    
    return `
      <div class="multiple-examples">
        <h4><i class="fas fa-list"></i> Examples:</h4>
        ${word.examples.map((example, index) => `
          <div class="example-item" style="margin-bottom: 0.75rem;">
            <div class="example-context">${example.context}:</div>
            <div class="example-turkish">${example.sentence}</div>
            <div class="example-arabic">${example.arabic}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 🏛️ Cultural Context Display
  showCulturalContext(word) {
    if (!word.culturalNote) return '';
    
    return `
      <div class="cultural-context">
        <h4><i class="fas fa-mosque"></i> Cultural Context:</h4>
        <p>${word.culturalNote}</p>
      </div>
    `;
  }

  // 🔄 Enhanced Navigation Setup
  setupNavigationEnhancements() {
    // Add phrase learning to existing navigation if needed
    setTimeout(() => {
      const navContainer = document.querySelector('.nav-container');
      if (navContainer) {
        // Check if phrases nav item exists
        const existingPhrasesNav = navContainer.querySelector('[data-section="phrases"]');
        if (!existingPhrasesNav) {
          this.addPhrasesNavigation();
        }
      }
    }, 2000);
  }

  addPhrasesNavigation() {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    const navList = navContainer.querySelector('.nav-list, .nav-pills, nav');
    if (!navList) return;

    const phrasesNavItem = document.createElement('div');
    phrasesNavItem.className = 'nav-item nav-link interactive-element';
    phrasesNavItem.setAttribute('data-section', 'phrases');
    phrasesNavItem.innerHTML = `
      <i class="fas fa-comments"></i>
      <span>Phrases</span>
      <span class="nav-arabic">العبارات</span>
    `;

    // Insert after learning nav item
    const learningNavItem = navList.querySelector('[data-section="learning"]');
    if (learningNavItem && learningNavItem.nextSibling) {
      navList.insertBefore(phrasesNavItem, learningNavItem.nextSibling);
    } else {
      navList.appendChild(phrasesNavItem);
    }

    // Add click handler
    phrasesNavItem.addEventListener('click', () => {
      this.showPhrasesSection();
    });
  }

  showPhrasesSection() {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    // Remove active from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // Create or show phrases section
    let phrasesSection = document.getElementById('phrases-section');
    if (!phrasesSection) {
      phrasesSection = this.createPhrasesSection();
      document.querySelector('.main-content, body').appendChild(phrasesSection);
    }

    phrasesSection.classList.add('active');
    phrasesSection.style.display = 'block';

    // Activate nav item
    document.querySelector('[data-section="phrases"]').classList.add('active');
  }

  createPhrasesSection() {
    const section = document.createElement('div');
    section.id = 'phrases-section';
    section.className = 'section';
    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h1 style="color: var(--text-primary);">
            <i class="fas fa-comments"></i> Turkish Phrases
          </h1>
          <p style="color: var(--text-secondary);">
            Learn common Turkish phrases and expressions with cultural context
          </p>
        </div>
        
        <div class="phrases-categories-grid categories-grid">
          ${Object.keys(this.phrases).map(categoryKey => {
            const category = this.phrases[categoryKey];
            const difficultyColor = this.getDifficultyColor(category.difficulty);
            
            return `
              <div class="phrase-category-card glass-card interactive-element" data-category="${categoryKey}">
                <div class="category-header">
                  <div class="category-icon">💬</div>
                  <div class="category-name">${category.title}</div>
                  <div class="category-name-arabic">${category.titleArabic}</div>
                </div>
                <div class="difficulty-badge" style="background: ${difficultyColor}; color: white; padding: 0.25rem 0.5rem; border-radius: 1rem; font-size: 0.75rem; margin: 0.5rem 0;">
                  ${category.difficulty.toUpperCase()}
                </div>
                <div class="category-stats">
                  <span>${category.phrases.length} phrases</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Add click events
    section.querySelectorAll('.phrase-category-card').forEach(card => {
      card.addEventListener('click', () => {
        const categoryKey = card.getAttribute('data-category');
        this.startPhraseLearning(categoryKey);
      });
    });

    return section;
  }

  // 📊 Enhanced Content Statistics
  getContentStatistics() {
    const stats = {
      totalWords: 0,
      totalPhrases: 0,
      byDifficulty: { beginner: 0, intermediate: 0, advanced: 0 }
    };

    // Count words
    Object.values(this.enhancedVocabulary).forEach(category => {
      category.forEach(word => {
        stats.totalWords++;
        stats.byDifficulty[word.difficulty]++;
      });
    });

    // Count phrases
    Object.values(this.phrases).forEach(category => {
      stats.totalPhrases += category.phrases.length;
    });

    return stats;
  }

  // 🔄 Integration with existing systems
  integrateWithLearningSystem() {
    // Enhance existing flashcards with new features
    if (window.TurkishLearningApp) {
      const originalCreateFlashcard = window.TurkishLearningApp.createFlashcardElement;
      if (originalCreateFlashcard) {
        window.TurkishLearningApp.createFlashcardElement = (word) => {
          const card = originalCreateFlashcard.call(window.TurkishLearningApp, word);
          
          // Enhance with new features if available
          const enhancedWord = this.findEnhancedWord(word.id);
          if (enhancedWord) {
            this.enhanceFlashcardWithExtendedContent(card, enhancedWord);
          }
          
          return card;
        };
      }
    }
  }

  findEnhancedWord(wordId) {
    for (const category of Object.values(this.enhancedVocabulary)) {
      const word = category.find(w => w.id === wordId);
      if (word) return word;
    }
    return null;
  }

  enhanceFlashcardWithExtendedContent(card, enhancedWord) {
    // Add additional content to existing flashcard
    const backFace = card.querySelector('.card-back');
    if (backFace && enhancedWord) {
      const additionalContent = `
        ${this.showMultipleExamples(enhancedWord)}
        ${this.showCulturalContext(enhancedWord)}
        ${this.showRegionalVariations(enhancedWord)}
      `;
      
      backFace.innerHTML += additionalContent;
    }
  }

  // 🔄 Content Filtering and Initialization
  initializeContentFiltering() {
    // Apply current difficulty filter
    this.filterContentByDifficulty();
    
    // Integrate with existing learning system
    setTimeout(() => {
      this.integrateWithLearningSystem();
    }, 2000);
  }
}

// Initialize the Enhanced Content System
window.enhancedContentSystem = new EnhancedContentSystem();

// Expose methods for other scripts
window.getEnhancedContent = () => window.enhancedContentSystem;
window.refreshEnhancedContent = () => {
  if (window.enhancedContentSystem) {
    window.enhancedContentSystem.filterContentByDifficulty();
  }
};

console.log('📚 Enhanced Content & Learning System loaded successfully!');