// Auto Test Learning Functionality
console.log('🧪 Auto Test Learning Script Loaded');

// Wait for everything to be ready, then test learning
setTimeout(() => {
    console.log('🔬 Auto-testing learning functionality...');
    
    // Test 1: Check if everything is loaded
    console.log('📋 System Check:', {
        enhancedVocabularyData: !!window.enhancedVocabularyData,
        learningModeManager: !!window.learningModeManager,
        startLearningSession: !!window.startLearningSession,
        TurkishLearningApp: !!window.TurkishLearningApp
    });
    
    // Test 2: Check available categories
    if (window.enhancedVocabularyData) {
        const categoryKeys = Object.keys(window.enhancedVocabularyData);
        console.log('📚 Available categories:', categoryKeys.slice(0, 5));
        
        if (categoryKeys.length > 0) {
            const testCategory = categoryKeys[0];
            const categoryData = window.enhancedVocabularyData[testCategory];
            console.log('🔍 Test category data:', {
                category: testCategory,
                name: categoryData.name,
                wordCount: categoryData.words?.length || 0,
                sampleWords: categoryData.words?.slice(0, 2) || []
            });
            
            // Test 3: Try to start learning with this category
            if (categoryData.words && categoryData.words.length > 0) {
                console.log('🚀 Attempting to start learning session...');
                
                const learningData = {
                    category: testCategory,
                    words: categoryData.words
                };
                
                try {
                    if (window.startLearningSession) {
                        console.log('📱 Calling startLearningSession...');
                        const result = window.startLearningSession(learningData, 'flashcard');
                        console.log('✅ Learning session result:', result);
                        
                        // Check if learning content is visible
                        setTimeout(() => {
                            const learningContent = document.getElementById('learning-content');
                            const flashcardContainer = document.getElementById('flashcard-mode-container');
                            
                            console.log('👀 Container visibility check:', {
                                learningContent: learningContent ? {
                                    exists: true,
                                    hidden: learningContent.classList.contains('hidden'),
                                    display: getComputedStyle(learningContent).display,
                                    visibility: getComputedStyle(learningContent).visibility
                                } : { exists: false },
                                flashcardContainer: flashcardContainer ? {
                                    exists: true,
                                    display: getComputedStyle(flashcardContainer).display,
                                    visibility: getComputedStyle(flashcardContainer).visibility
                                } : { exists: false }
                            });
                            
                            // Check if any mode containers exist
                            const allModeContainers = document.querySelectorAll('.learning-mode-container');
                            console.log('🎯 Mode containers found:', allModeContainers.length);
                            allModeContainers.forEach((container, index) => {
                                console.log(`Container ${index}:`, {
                                    id: container.id,
                                    display: getComputedStyle(container).display,
                                    innerHTML: container.innerHTML.length > 0 ? 'Has content' : 'Empty'
                                });
                            });
                            
                        }, 2000);
                        
                    } else {
                        console.error('❌ startLearningSession function not available');
                    }
                } catch (error) {
                    console.error('❌ Error starting learning session:', error);
                }
            }
        }
    }
    
    // Test 4: Try to directly test the learning mode manager
    if (window.learningModeManager) {
        console.log('🎯 Testing learning mode manager...');
        const availableModes = window.learningModeManager.getAvailableModes();
        console.log('Available modes:', availableModes);
        
        // Check if flashcard mode is properly registered with a class
        const flashcardMode = availableModes.find(m => m.id === 'flashcard');
        if (flashcardMode) {
            console.log('📱 Flashcard mode details:', {
                id: flashcardMode.id,
                name: flashcardMode.name,
                hasClass: !!flashcardMode.class,
                className: flashcardMode.class?.name || 'undefined'
            });
        }
    }
    
}, 5000); // Wait 5 seconds for everything to load

console.log('⏱️ Auto-test will run in 5 seconds...');