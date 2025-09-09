/**
 * 🚀 JULES'S NEW FLASHCARD MODE - MULTIPLE CHOICE
 * Built from scratch to implement a multiple-choice quiz format.
 */

class FlashcardModeJules extends LearningModeBase {
    constructor(config = {}) {
        super(config);

        this.words = [];
        this.currentIndex = 0;
        this.responses = [];
        this.isAnswered = false;

        console.log("🚀 Jules's Flashcard Mode engaged!");
    }

    /**
     * Initialize the mode
     */
    async init() {
        console.log("🚀 Initializing Jules's Flashcard Mode");
        this.words = [...this.data.words];
        this.shuffleWords();
        this.render();
    }

    /**
     * Render the flashcard interface
     */
    render() {
        if (!this.container) {
            throw new Error("Container not available for flashcard mode");
        }

        this.clearContainer();
        const currentWord = this.getCurrentWord();
        if (!currentWord) {
            this.completeSession();
            return;
        }

        this.isAnswered = false;
        const options = this.generateOptions(currentWord);

        const flashcardInterface = this.createElement('div', ['flashcard-mode-jules'], {}, `
            <div class="flashcard-jules-container">
                <div class="flashcard-jules-card">
                    <div class="flashcard-jules-word">${currentWord.turkish}</div>
                    <div class="flashcard-jules-icon">${currentWord.emoji || '🇹🇷'}</div>
                </div>
                <div class="flashcard-jules-options">
                    ${options.map(option => `
                        <button class="flashcard-jules-option" data-word-id="${option.id}">
                            ${option.arabic}
                        </button>
                    `).join('')}
                </div>
            </div>
        `);

        this.appendToContainer(flashcardInterface);
        this.addOptionListeners();
    }

    /**
     * Generate four multiple-choice options
     */
    generateOptions(correctWord) {
        const options = [correctWord];
        const distractors = this.words.filter(word => word.id !== correctWord.id);

        while (options.length < 4 && distractors.length > 0) {
            const randomIndex = Math.floor(Math.random() * distractors.length);
            const distractor = distractors.splice(randomIndex, 1)[0];
            options.push(distractor);
        }

        return this.shuffleOptions(options);
    }

    /**
     * Shuffle the multiple-choice options
     */
    shuffleOptions(options) {
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        return options;
    }

    /**
     * Add event listeners to the option buttons
     */
    addOptionListeners() {
        const optionButtons = this.container.querySelectorAll('.flashcard-jules-option');
        optionButtons.forEach(button => {
            button.addEventListener('click', (event) => this.handleOptionClick(event));
        });
    }

    /**
     * Handle user's choice
     */
    handleOptionClick(event) {
        if (this.isAnswered) return;
        this.isAnswered = true;

        const selectedOptionId = event.target.dataset.wordId;
        const correctWord = this.getCurrentWord();
        const isCorrect = selectedOptionId == correctWord.id;

        // Visual feedback
        const optionButtons = this.container.querySelectorAll('.flashcard-jules-option');
        optionButtons.forEach(button => {
            button.disabled = true;
            if (button.dataset.wordId == correctWord.id) {
                button.classList.add('correct');
            } else if (button.dataset.wordId == selectedOptionId) {
                button.classList.add('incorrect');
            }
        });

        // Record the response
        this.responses.push({
            wordId: correctWord.id,
            isCorrect: isCorrect
        });

        // Integrate with review system
        if (window.reviewSystem) {
            window.reviewSystem.updateWordReview(correctWord.id, isCorrect);
        }

        // Move to the next word after a delay
        setTimeout(() => {
            this.currentIndex++;
            this.render();
        }, 1500);
    }

    /**
     * Shuffle words array
     */
    shuffleWords() {
        for (let i = this.words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
        }
    }

    /**
     * Get current word
     */
    getCurrentWord() {
        return this.words[this.currentIndex] || null;
    }

    /**
     * Complete the session
     */
    completeSession() {
        this.container.innerHTML = '<h2>Session Complete!</h2>';
    }
}

// Register the new flashcard mode
document.addEventListener('DOMContentLoaded', () => {
    if (window.learningModeManager) {
        window.learningModeManager.registerMode('interactive-examination', FlashcardModeJules, {
            name: "Interactive Examination",
            icon: '❓',
            description: 'A multiple-choice quiz to test your knowledge.',
            containerId: 'flashcard-mode-container',
        });
        console.log("🚀 Interactive Examination Mode registered!");
    }
});

window.FlashcardModeJules = FlashcardModeJules;

// Add some basic styling for the new mode
const style = document.createElement('style');
style.innerHTML = `
    .flashcard-mode-jules {
        text-align: center;
    }
    .flashcard-jules-card {
        background: #fff;
        border-radius: 10px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .flashcard-jules-word {
        font-size: 2.5rem;
        font-weight: bold;
    }
    .flashcard-jules-icon {
        font-size: 2rem;
        margin-top: 1rem;
    }
    .flashcard-jules-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    .flashcard-jules-option {
        background: #fff;
        border: 2px solid #ddd;
        border-radius: 10px;
        padding: 1.5rem;
        font-size: 1.2rem;
        cursor: pointer;
    }
    .flashcard-jules-option.correct {
        background: #d4edda;
        border-color: #c3e6cb;
    }
    .flashcard-jules-option.incorrect {
        background: #f8d7da;
        border-color: #f5c6cb;
    }
`;
document.head.appendChild(style);
