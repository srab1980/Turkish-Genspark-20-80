// Debug Learning Functionality
console.log('🐛 Debug Learning Script Loaded');

// Test function to debug learning startup
window.debugLearningStartup = function() {
    console.log('🔍 Debugging Learning Startup...');
    
    // Check if required elements exist
    const categorySelect = document.getElementById('category-select');
    const modeSelect = document.getElementById('learning-mode');
    const startBtn = document.getElementById('start-learning');
    const learningContent = document.getElementById('learning-content');
    
    console.log('📋 Element Check:', {
        categorySelect: !!categorySelect,
        modeSelect: !!modeSelect,  
        startBtn: !!startBtn,
        learningContent: !!learningContent
    });
    
    if (categorySelect) {
        console.log('📂 Category options:', categorySelect.innerHTML.substring(0, 200) + '...');
        console.log('📂 Selected category:', categorySelect.value);
    }
    
    if (modeSelect) {
        console.log('🎯 Mode options:', modeSelect.innerHTML.substring(0, 200) + '...');
        console.log('🎯 Selected mode:', modeSelect.value);
    }
    
    // Check data availability
    console.log('📊 Data Check:', {
        TurkishLearningApp: !!window.TurkishLearningApp,
        enhancedVocabularyData: !!window.enhancedVocabularyData,
        vocabularySessions: !!window.vocabularySessions,
        vocabularyMetadata: !!window.vocabularyMetadata
    });
    
    if (window.TurkishLearningApp && window.TurkishLearningApp.vocabularyData) {
        const categoryKeys = Object.keys(window.TurkishLearningApp.vocabularyData);
        console.log('📚 Available categories in TurkishLearningApp:', categoryKeys.slice(0, 10));
        
        if (categoryKeys.length > 0) {
            const firstCategory = categoryKeys[0];
            const categoryData = window.TurkishLearningApp.vocabularyData[firstCategory];
            console.log('📖 Sample category data structure:', {
                category: firstCategory,
                hasWords: !!(categoryData && categoryData.words),
                isArray: Array.isArray(categoryData),
                structure: categoryData ? Object.keys(categoryData).slice(0, 5) : 'undefined'
            });
        }
    }
};

// Test function to force start learning
window.forceStartLearning = function(categoryId = null, mode = 'flashcard') {
    console.log('🚀 Force Starting Learning...');
    
    // Navigate to learn section first
    if (window.showSection) {
        console.log('📍 Navigating to learn section');
        window.showSection('learn');
    }
    
    setTimeout(() => {
        const categorySelect = document.getElementById('category-select');
        const modeSelect = document.getElementById('learning-mode'); 
        const startBtn = document.getElementById('start-learning');
        
        if (categorySelect && !categoryId) {
            // Use first available category if none specified
            const firstOption = categorySelect.querySelector('option[value]:not([value=""])');
            if (firstOption) {
                categoryId = firstOption.value;
            }
        }
        
        if (categorySelect && categoryId) {
            console.log('🎯 Setting category to:', categoryId);
            categorySelect.value = categoryId;
            
            // Trigger change event
            categorySelect.dispatchEvent(new Event('change'));
        }
        
        if (modeSelect) {
            console.log('🎮 Setting mode to:', mode);
            modeSelect.value = mode;
        }
        
        if (startBtn) {
            console.log('🚀 Enabling and clicking start button');
            startBtn.disabled = false;
            
            // Try clicking the button
            setTimeout(() => {
                startBtn.click();
            }, 500);
        }
    }, 1000);
};

// Test direct modular learning system
window.testModularLearning = function(categoryId = 'food', mode = 'flashcard') {
    console.log('🧪 Testing Modular Learning System...');
    
    // Check if enhanced vocabulary data is available
    if (!window.enhancedVocabularyData) {
        console.error('❌ Enhanced vocabulary data not available');
        return;
    }
    
    // Check if learning mode manager is available
    if (!window.learningModeManager) {
        console.error('❌ Learning mode manager not available');
        return;
    }
    
    // Check if the category exists
    if (!window.enhancedVocabularyData[categoryId]) {
        console.error('❌ Category not found:', categoryId);
        console.log('Available categories:', Object.keys(window.enhancedVocabularyData));
        return;
    }
    
    const categoryData = window.enhancedVocabularyData[categoryId];
    console.log('✅ Category data found:', {
        category: categoryId,
        wordCount: categoryData.words?.length || 0,
        name: categoryData.name
    });
    
    // Prepare learning data
    const learningData = {
        category: categoryId,
        words: categoryData.words || []
    };
    
    console.log('🎯 Starting modular learning session...');
    console.log('Data:', learningData);
    console.log('Mode:', mode);
    
    // Test the modular integration startLearningSession function
    if (window.startLearningSession) {
        try {
            const result = window.startLearningSession(learningData, mode);
            console.log('✅ Learning session started:', result);
        } catch (error) {
            console.error('❌ Failed to start learning session:', error);
        }
    } else {
        console.error('❌ startLearningSession function not available');
    }
};

// Test learning mode manager directly
window.testLearningModeManager = function(categoryId = 'food') {
    console.log('🔬 Testing Learning Mode Manager Directly...');
    
    if (!window.learningModeManager) {
        console.error('❌ Learning mode manager not available');
        return;
    }
    
    // Check available modes
    const availableModes = window.learningModeManager.getAvailableModes();
    console.log('📋 Available modes:', availableModes.map(m => ({ id: m.id, name: m.name })));
    
    // Get category data
    const categoryData = window.enhancedVocabularyData[categoryId];
    if (!categoryData) {
        console.error('❌ Category not found:', categoryId);
        return;
    }
    
    const testData = {
        words: categoryData.words || [],
        category: categoryId
    };
    
    console.log('🎯 Testing flashcard mode with data:', testData);
    
    // Try starting flashcard mode directly
    window.learningModeManager.startMode('flashcard', testData)
        .then(result => {
            console.log('✅ Learning mode started successfully:', result);
        })
        .catch(error => {
            console.error('❌ Failed to start learning mode:', error);
        });
};

console.log('🛠️ Debug functions available:');
console.log('   - debugLearningStartup(): Check learning setup');
console.log('   - forceStartLearning(categoryId, mode): Force start learning');
console.log('   - testModularLearning(categoryId, mode): Test modular learning system');
console.log('   - testLearningModeManager(categoryId): Test learning mode manager directly');