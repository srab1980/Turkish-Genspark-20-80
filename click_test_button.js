// Script to click the debug test button
console.log('🧪 Looking for debug test button...');

// Wait for the page to load completely
setTimeout(() => {
    // Try to find the debug test button
    const buttons = document.querySelectorAll('button');
    let testButton = null;
    
    for (let button of buttons) {
        if (button.textContent.includes('اختبار شاشة الإتمام')) {
            testButton = button;
            break;
        }
    }
    
    if (testButton) {
        console.log('✅ Found debug test button, clicking...');
        testButton.click();
    } else {
        console.log('❌ Debug test button not found');
        // Try alternative approach - call the function directly
        console.log('🔄 Trying to call testCompletionScreenDebug directly...');
        if (typeof window.testCompletionScreenDebug === 'function') {
            window.testCompletionScreenDebug();
        } else {
            console.log('❌ testCompletionScreenDebug function not available');
        }
    }
}, 3000);

// Also try to call diagnostic functions directly
setTimeout(() => {
    console.log('🔍 Running additional diagnostics...');
    
    if (typeof window.checkLearningSystem === 'function') {
        console.log('📋 Running checkLearningSystem...');
        window.checkLearningSystem();
    }
    
    if (typeof window.startNewFlashcardSession === 'function') {
        console.log('🚀 Testing startNewFlashcardSession...');
        try {
            const result = window.startNewFlashcardSession({ categoryId: 'greetings' });
            console.log('✅ startNewFlashcardSession result:', result);
        } catch (error) {
            console.error('❌ startNewFlashcardSession error:', error);
        }
    }
}, 5000);