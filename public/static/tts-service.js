// Turkish Text-to-Speech Service
// Provides comprehensive TTS functionality for Turkish language learning

class TurkishTTSService {
    constructor() {
        this.isSupported = 'speechSynthesis' in window;
        this.voices = [];
        this.turkishVoice = null;
        this.isLoading = false;
        
        // TTS Settings
        this.settings = {
            rate: 0.8,          // Slightly slower for learning
            pitch: 1.0,         // Normal pitch
            volume: 1.0,        // Full volume
            autoPlay: true      // Auto-play words when card is shown
        };
        
        this.init();
    }
    
    init() {
        if (!this.isSupported) {
            console.warn('Speech Synthesis not supported in this browser');
            return;
        }
        
        // Load voices when they become available
        this.loadVoices();
        
        // Some browsers load voices asynchronously
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
        
        console.log('Turkish TTS Service initialized');
    }
    
    loadVoices() {
        this.voices = speechSynthesis.getVoices();
        
        // Find Turkish voices (prefer native Turkish voices)
        const turkishVoices = this.voices.filter(voice => 
            voice.lang.startsWith('tr') || 
            voice.name.toLowerCase().includes('turkish') ||
            voice.name.toLowerCase().includes('türk')
        );
        
        if (turkishVoices.length > 0) {
            // Prefer native Turkish voices
            this.turkishVoice = turkishVoices.find(voice => voice.localService) || turkishVoices[0];
            console.log('Turkish TTS voice found:', this.turkishVoice.name);
        } else {
            // Fallback to English or any available voice
            const fallbackVoices = this.voices.filter(voice => 
                voice.lang.startsWith('en') || voice.default
            );
            this.turkishVoice = fallbackVoices[0];
            console.log('Using fallback voice for Turkish:', this.turkishVoice?.name || 'None');
        }
        
        // Update UI if voices are loaded after initialization
        if (this.turkishVoice && window.updateTTSStatus) {
            window.updateTTSStatus(true);
        }

        // Dispatch a ready event
        window.dispatchEvent(new CustomEvent('tts-ready'));
    }
    
    // Speak Turkish text with appropriate settings
    speak(text, options = {}) {
        if (!this.isSupported || !this.turkishVoice) {
            console.warn('TTS not available');
            return Promise.reject('TTS not supported');
        }
        
        return new Promise((resolve, reject) => {
            // Cancel any ongoing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configure voice and settings
            utterance.voice = this.turkishVoice;
            utterance.rate = options.rate || this.settings.rate;
            utterance.pitch = options.pitch || this.settings.pitch;
            utterance.volume = options.volume || this.settings.volume;
            
            // Handle events
            utterance.onstart = () => {
                console.log('TTS started:', text);
                if (options.onStart) options.onStart();
            };
            
            utterance.onend = () => {
                console.log('TTS completed:', text);
                if (options.onEnd) options.onEnd();
                resolve();
            };
            
            utterance.onerror = (event) => {
                console.error('TTS error:', event.error);
                if (options.onError) options.onError(event.error);
                reject(event.error);
            };
            
            // Speak the text
            speechSynthesis.speak(utterance);
        });
    }
    
    // Speak Turkish word with automatic pronunciation
    speakWord(word, options = {}) {
        const ttsOptions = {
            rate: 0.7, // Slower for individual words
            ...options,
            onStart: () => {
                this.showAudioFeedback('word', true);
                if (options.onStart) options.onStart();
            },
            onEnd: () => {
                this.showAudioFeedback('word', false);
                if (options.onEnd) options.onEnd();
            },
            onError: (error) => {
                this.showAudioFeedback('word', false);
                if (options.onError) options.onError(error);
            }
        };
        
        return this.speak(word, ttsOptions);
    }
    
    // Speak Turkish sentence (example usage)
    speakSentence(sentence, options = {}) {
        const ttsOptions = {
            rate: 0.7, // Slightly slower for example sentences to aid comprehension
            ...options,
            onStart: () => {
                this.showAudioFeedback('sentence', true);
                if (options.onStart) options.onStart();
            },
            onEnd: () => {
                this.showAudioFeedback('sentence', false);
                if (options.onEnd) options.onEnd();
            },
            onError: (error) => {
                this.showAudioFeedback('sentence', false);
                if (options.onError) options.onError(error);
            }
        };
        
        return this.speak(sentence, ttsOptions);
    }
    
    // Show visual feedback during TTS playback
    showAudioFeedback(type, isPlaying) {
        const wordButton = document.querySelector('.tts-word-btn');
        const sentenceButton = document.querySelector('.tts-sentence-btn');
        
        if (type === 'word' && wordButton) {
            if (isPlaying) {
                wordButton.classList.add('playing');
                wordButton.innerHTML = '<i class=\"fas fa-volume-up\"></i>';
            } else {
                wordButton.classList.remove('playing');
                wordButton.innerHTML = '<i class=\"fas fa-volume-off\"></i>';
            }
        }
        
        if (type === 'sentence' && sentenceButton) {
            if (isPlaying) {
                sentenceButton.classList.add('playing');
                sentenceButton.innerHTML = '<i class=\"fas fa-volume-up\"></i>';
            } else {
                sentenceButton.classList.remove('playing');
                sentenceButton.innerHTML = '<i class=\"fas fa-volume-off\"></i>';
            }
        }
    }
    
    // Stop current speech
    stop() {
        if (this.isSupported) {
            speechSynthesis.cancel();
            this.showAudioFeedback('word', false);
            this.showAudioFeedback('sentence', false);
        }
    }
    
    // Check if TTS is currently speaking
    isSpeaking() {
        return this.isSupported && speechSynthesis.speaking;
    }
    
    // Get available Turkish voices
    getAvailableVoices() {
        return this.voices.filter(voice => 
            voice.lang.startsWith('tr') || 
            voice.name.toLowerCase().includes('turkish')
        );
    }
    
    // Update TTS settings
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        console.log('TTS settings updated:', this.settings);
    }
    
    // Test TTS functionality
    test() {
        if (!this.isSupported) {
            return 'Speech Synthesis not supported';
        }
        
        if (!this.turkishVoice) {
            return 'No Turkish voice available';
        }
        
        this.speak('Merhaba, test ediyoruz');
        return 'TTS test started';
    }
}

// CSS styles for TTS controls
const ttsStyles = `
<style>
/* TTS Control Buttons */
.tts-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.tts-btn {
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #3b82f6;
}

.tts-btn:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
    transform: scale(1.05);
}

.tts-btn.playing {
    background: #3b82f6;
    color: white;
    animation: pulse 1.5s infinite;
}

.tts-btn.disabled {
    background: rgba(156, 163, 175, 0.1);
    border-color: rgba(156, 163, 175, 0.3);
    color: #9ca3af;
    cursor: not-allowed;
}

.tts-btn.disabled:hover {
    transform: none;
}

/* TTS Visual Feedback */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

@keyframes soundWave {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
}

.tts-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8rem;
    color: #3b82f6;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.tts-indicator.active {
    opacity: 1;
}

.tts-wave {
    width: 3px;
    height: 12px;
    background: #3b82f6;
    border-radius: 2px;
    animation: soundWave 1s infinite ease-in-out;
}

.tts-wave:nth-child(2) { animation-delay: 0.1s; }
.tts-wave:nth-child(3) { animation-delay: 0.2s; }
.tts-wave:nth-child(4) { animation-delay: 0.3s; }

/* Icon Visual Enhancements */
.word-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #3b82f6;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
}

.word-icon.emoji {
    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif;
}

.flashcard-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    position: relative;
}

/* Responsive TTS Controls */
@media (max-width: 480px) {
    .tts-controls {
        justify-content: center;
        gap: 1rem;
    }
    
    .tts-btn {
        width: 3rem;
        height: 3rem;
        font-size: 1.1rem;
    }
}
</style>
`;

// Initialize global TTS service
window.turkishTTS = new TurkishTTSService();

// Global TTS functions for easy access
window.speakTurkishWord = (word, options) => {
    return window.turkishTTS.speakWord(word, options);
};

window.speakTurkishSentence = (sentence, options) => {
    return window.turkishTTS.speakSentence(sentence, options);
};

window.stopTTS = () => {
    window.turkishTTS.stop();
};

// Inject TTS styles
if (!document.querySelector('#tts-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'tts-styles';
    styleElement.innerHTML = ttsStyles;
    document.head.appendChild(styleElement);
}

console.log('Turkish TTS Service loaded successfully!');