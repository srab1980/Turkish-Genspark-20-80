// Simple test to debug session issue
console.log('🧪 Testing session creation...');

// Wait for page to load
setTimeout(() => {
    console.log('🔍 Checking vocabulary data...');
    if (window.enhancedVocabularyData) {
        const categories = Object.keys(window.enhancedVocabularyData);
        console.log('✅ Categories available:', categories.slice(0, 5));
        
        // Test family category specifically
        const familyData = window.enhancedVocabularyData.family;
        if (familyData) {
            console.log('✅ Family category data:', {
                hasWords: !!familyData.words,
                wordsCount: familyData.words ? familyData.words.length : 0,
                sampleWord: familyData.words && familyData.words[0] ? familyData.words[0] : null
            });
            
            if (familyData.words && familyData.words.length > 0) {
                console.log('✅ Sample words from family:');
                familyData.words.slice(0, 3).forEach((word, i) => {
                    console.log(`  ${i + 1}. ${word.turkish} = ${word.arabic}`);
                });
                
                // Test the function directly
                console.log('🚀 Testing startNewFlashcardSession function...');
                if (window.startNewFlashcardSession) {
                    window.startNewFlashcardSession({
                        categoryId: 'family',
                        sessionNumber: 1,
                        wordCount: 5
                    }).then(result => {
                        console.log('✅ Function result:', result);
                    }).catch(error => {
                        console.error('❌ Function error:', error);
                    });
                } else {
                    console.log('❌ startNewFlashcardSession function not available');
                }
            } else {
                console.log('❌ Family category has no words');
            }
        } else {
            console.log('❌ Family category not found');
        }
    } else {
        console.log('❌ No vocabulary data available');
    }
}, 5000);