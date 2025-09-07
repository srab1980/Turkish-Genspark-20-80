// 🔍 Examine Learning Mode - Containerized
// Independent vocabulary examination system

class ExamineMode extends LearningModeBase {
    constructor(config = {}) {
        super(config);
        this.words = [];
        console.log('🔍 Examine Mode container created');
    }

    async init() {
        if (this.data && this.data.words) {
            this.words = this.data.words;
        }
        console.log(`🔍 Examine mode initialized with ${this.words.length} words.`);
    }

    render() {
        if (!this.container) {
            throw new Error('Container not available for examine mode');
        }
        this.clearContainer();

        if (this.words.length === 0) {
            this.container.innerHTML = `<div class="p-4 text-center">No words found for this category.</div>`;
            return;
        }

        const categoryName = this.data.category || 'Vocabulary';

        this.container.innerHTML = `
            <div class="examine-mode p-4">
                <h2 class="text-2xl font-bold mb-4">Examine Mode: ${categoryName}</h2>
                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="py-2 px-4 border-b">Turkish</th>
                                <th class="py-2 px-4 border-b">Arabic</th>
                                <th class="py-2 px-4 border-b">English</th>
                                <th class="py-2 px-4 border-b">Pronunciation</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.words.map(word => `
                                <tr class="hover:bg-gray-50">
                                    <td class="py-2 px-4 border-b">${word.turkish}</td>
                                    <td class="py-2 px-4 border-b">${word.arabic}</td>
                                    <td class="py-2 px-4 border-b">${word.english}</td>
                                    <td class="py-2 px-4 border-b">${word.pronunciation || ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    async cleanup() {
        console.log('🔍 Examine mode cleaned up');
    }
}

// Function to register the mode safely
function registerExamineMode() {
    if (window.learningModeManager) {
        window.learningModeManager.registerMode('examine', ExamineMode, {
            name: 'Examine Mode',
            icon: '🔍',
            description: 'Examine and study vocabulary in detail.',
            containerId: 'examine-mode-container',
            dependencies: [],
            version: '1.0.0'
        });
        console.log('🔍 Examine Mode registered successfully');
    } else {
        // If the manager is not ready, try again in 100ms
        setTimeout(registerExamineMode, 100);
    }
}

// Start the registration process
registerExamineMode();

window.ExamineMode = ExamineMode;
