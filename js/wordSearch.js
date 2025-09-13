/**
 * Word Search Game Module - Enhanced with fixes
 * - Fixed shuffling and word placement
 * - Added pronunciation support
 * - Better visual presentation as cliff bridge building
 * - Proper wrong answer handling
 */

class WordSearchGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.grid = [];
        this.gridSize = 12;
        this.words = { t: [], d: [], id: [] };
        this.foundWords = new Set();
        this.selectedCells = [];
        this.currentMode = 't';  // Current pronunciation mode
        this.questionsCorrect = { t: 0, d: 0, id: 0 }; // Track correct answers per category
        this.requiredCorrect = 3; // Need 3 correct per category

        this.directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical  
            [1, 1],   // diagonal down-right
            [-1, 1]   // diagonal up-right
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeBoard();
        this.updateWordLists();
        this.updateBridgeDisplay();
    }

    setupEventListeners() {
        // Sound mode selection
        document.querySelectorAll('.color-mode-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectSoundMode(e.target.dataset.sound);
            });
        });

        // Game controls
        document.getElementById('confirmWord')?.addEventListener('click', () => this.confirmSelection());
        document.getElementById('clearSelection')?.addEventListener('click', () => this.clearSelection());
        document.getElementById('pronounceWord')?.addEventListener('click', () => this.pronounceSelected());

        // Listen for game initialization
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'wordSearch') {
                this.startGame();
            }
        });
    }

    selectSoundMode(sound) {
        this.currentMode = sound;

        // Update button states
        document.querySelectorAll('.color-mode-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sound === sound);
        });

        // Update selected sound display
        const selectedDisplay = document.getElementById('selectedSound');
        if (selectedDisplay) {
            selectedDisplay.textContent = `/${sound}/`;
        }

        // Clear current selection
        this.clearSelection();

        // Play sound
        if (window.SoundSystem) {
            window.SoundSystem.play('click');
        }
    }

    startGame() {
        this.generateWords();
        this.createGrid();
        this.placeWords();
        this.fillEmptyCells();
        this.renderGrid();
        this.updateWordLists();
        this.showBridgeScene();
    }

    generateWords() {
        // Get words from database and shuffle them
        const categories = ['t', 'd', 'id'];

        categories.forEach(category => {
            if (wordDatabase[category]) {
                // Shuffle the word array
                const shuffledWords = this.shuffleArray([...wordDatabase[category]]);
                // Take 5 random words for each category
                this.words[category] = shuffledWords.slice(0, 5);
            }
        });
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    createGrid() {
        this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(''));
    }

    placeWords() {
        const allWords = [...this.words.t, ...this.words.d, ...this.words.id];
        const placedWords = [];

        // Shuffle the word list
        const shuffledWords = this.shuffleArray(allWords);

        shuffledWords.forEach(word => {
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < 100) {
                const direction = this.directions[Math.floor(Math.random() * this.directions.length)];
                const startRow = Math.floor(Math.random() * this.gridSize);
                const startCol = Math.floor(Math.random() * this.gridSize);

                if (this.canPlaceWord(word, startRow, startCol, direction)) {
                    this.placeWordInGrid(word, startRow, startCol, direction);
                    placedWords.push({
                        word: word,
                        start: [startRow, startCol],
                        direction: direction,
                        category: this.getWordCategory(word)
                    });
                    placed = true;
                }
                attempts++;
            }
        });

        this.placedWords = placedWords;
        console.log('Placed words:', placedWords);
    }

    canPlaceWord(word, startRow, startCol, direction) {
        for (let i = 0; i < word.length; i++) {
            const row = startRow + direction[0] * i;
            const col = startCol + direction[1] * i;

            // Check bounds
            if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
                return false;
            }

            // Check if cell is empty or contains the same letter
            if (this.grid[row][col] !== '' && this.grid[row][col] !== word[i]) {
                return false;
            }
        }
        return true;
    }

    placeWordInGrid(word, startRow, startCol, direction) {
        for (let i = 0; i < word.length; i++) {
            const row = startRow + direction[0] * i;
            const col = startCol + direction[1] * i;
            this.grid[row][col] = word[i].toUpperCase();
        }
    }

    fillEmptyCells() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === '') {
                    this.grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    }

    renderGrid() {
        const board = document.getElementById('wordSearchBoard');
        if (!board) return;

        board.innerHTML = '';

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = this.grid[row][col];
                cell.dataset.row = row;
                cell.dataset.col = col;

                cell.addEventListener('click', () => this.toggleCell(row, col, cell));

                board.appendChild(cell);
            }
        }
    }

    toggleCell(row, col, cellElement) {
        const cellIndex = `${row}-${col}`;
        const existingIndex = this.selectedCells.findIndex(cell => cell.index === cellIndex);

        if (existingIndex >= 0) {
            // Remove from selection
            this.selectedCells.splice(existingIndex, 1);
            cellElement.classList.remove('selected');
        } else {
            // Add to selection
            this.selectedCells.push({
                index: cellIndex,
                row: row,
                col: col,
                letter: this.grid[row][col],
                element: cellElement
            });
            cellElement.classList.add('selected');
        }

        this.updateSelectedWordDisplay();

        // Play selection sound
        if (window.SoundSystem) {
            window.SoundSystem.play('click', 0.3);
        }
    }

    updateSelectedWordDisplay() {
        const selectedWord = this.selectedCells.map(cell => cell.letter).join('');
        const display = document.getElementById('selectedWord');
        if (display) {
            display.textContent = selectedWord;
        }
    }

    confirmSelection() {
        if (this.selectedCells.length === 0) {
            this.showFeedback(false, '請先選擇字母組成單詞');
            return;
        }

        const selectedWord = this.selectedCells.map(cell => cell.letter).join('').toLowerCase();
        const correctCategory = this.getWordCategory(selectedWord);

        if (correctCategory) {
            // Check if word matches current mode
            if (correctCategory === this.currentMode) {
                this.handleCorrectAnswer(selectedWord, correctCategory);
            } else {
                this.handleWrongCategory(selectedWord, correctCategory);
            }
        } else {
            this.handleInvalidWord(selectedWord);
        }
    }

    handleCorrectAnswer(word, category) {
        // Mark word as found
        this.foundWords.add(word);
        this.questionsCorrect[category]++;

        // Mark cells as found
        this.selectedCells.forEach(cell => {
            cell.element.classList.remove('selected');
            cell.element.classList.add('found');
        });

        // Update score
        this.gameSystem.updateScore('wordSearch', 10, false);

        // Update word list display
        this.updateWordInList(word, true);

        // Show feedback
        const explanation = this.getExplanation(category);
        this.showFeedback(true, '正確！', `"${word}" 的結尾發音是 /${category}/ ${explanation}`);

        // Update bridge
        this.updateBridge(category);

        // Check completion
        this.checkGameCompletion();

        this.clearSelection();
    }

    handleWrongCategory(word, correctCategory) {
        // Must clear selection before trying again
        this.clearSelection();

        const explanation = this.getExplanation(correctCategory);
        this.showFeedback(false, '發音類型不正確', 
            `"${word}" 的正確發音是 /${correctCategory}/, ${explanation}\n請先清除選擇，然後選擇正確的發音類型。`);

        // Force user to clear selection
        this.selectedCells.forEach(cell => {
            cell.element.classList.add('wrong-selection');
        });
    }

    handleInvalidWord(word) {
        this.showFeedback(false, '無效單詞', `"${word}" 不在單詞列表中，請重新選擇。`);
        this.clearSelection();
    }

    clearSelection() {
        this.selectedCells.forEach(cell => {
            cell.element.classList.remove('selected', 'wrong-selection');
        });
        this.selectedCells = [];
        this.updateSelectedWordDisplay();
    }

    pronounceSelected() {
        const selectedWord = this.selectedCells.map(cell => cell.letter).join('').toLowerCase();
        if (selectedWord && window.SoundSystem) {
            window.SoundSystem.speakWord(selectedWord);
        }
    }

    getWordCategory(word) {
        for (const [category, words] of Object.entries(this.words)) {
            if (words.includes(word)) {
                return category;
            }
        }
        return null;
    }

    getExplanation(category) {
        const explanations = {
            t: '因為結尾是無聲輔音',
            d: '因為結尾是有聲輔音或元音',
            id: '因為結尾已經是 /t/ 或 /d/ 音'
        };
        return explanations[category] || '';
    }

    updateWordLists() {
        ['t', 'd', 'id'].forEach(category => {
            const container = document.getElementById(`${category}Words`);
            if (container && this.words[category]) {
                container.innerHTML = this.words[category].map(word => 
                    `<div class="word-item" id="word-${word}" data-word="${word}">${word}</div>`
                ).join('');
            }
        });
    }

    updateWordInList(word, found) {
        const wordElement = document.getElementById(`word-${word}`);
        if (wordElement) {
            wordElement.classList.toggle('found', found);
        }
    }

    showBridgeScene() {
        const cutscene = document.getElementById('game1Cutscene');
        if (cutscene) {
            // Initialize bridge stones
            const bridgeContainer = document.getElementById('stoneBridges');
            if (bridgeContainer) {
                bridgeContainer.innerHTML = '';

                // Create bridge stones for each category
                ['t', 'd', 'id'].forEach((category, index) => {
                    for (let i = 0; i < 3; i++) {
                        const stone = document.createElement('div');
                        stone.className = `bridge-stone stone-${category}`;
                        stone.style.left = `${index * 30 + i * 10}%`;
                        stone.dataset.category = category;
                        stone.dataset.index = i;
                        bridgeContainer.appendChild(stone);
                    }
                });
            }

            cutscene.classList.add('active');

            // Auto-hide after 8 seconds
            setTimeout(() => {
                cutscene.classList.remove('active');
            }, 8000);
        }
    }

    updateBridge(category) {
        const stones = document.querySelectorAll(`.bridge-stone.stone-${category}`);
        const correctCount = this.questionsCorrect[category];

        stones.forEach((stone, index) => {
            if (index < correctCount) {
                stone.classList.add('active');
            }
        });
    }

    checkGameCompletion() {
        const totalRequired = this.requiredCorrect * 3; // 3 categories × 3 correct each
        const totalCorrect = Object.values(this.questionsCorrect).reduce((a, b) => a + b, 0);

        if (totalCorrect >= totalRequired) {
            // Show completion cutscene
            this.showCompletionScene();

            // Check if score is high enough for artifact
            this.gameSystem.checkLevelCompletion('wordSearch');
        }
    }

    showCompletionScene() {
        const message = '太棒了！你成功建造了石橋，可以安全通過懸崖了！';
        this.showFeedback(true, '關卡完成！', message, 5000);

        // Animate bridge completion
        const allStones = document.querySelectorAll('.bridge-stone');
        allStones.forEach((stone, index) => {
            setTimeout(() => {
                stone.classList.add('active');
            }, index * 200);
        });
    }

    showFeedback(isCorrect, title, message, duration = 3000) {
        const feedback = document.getElementById('feedback');
        if (!feedback) return;

        feedback.className = `feedback show ${isCorrect ? 'correct' : 'wrong'}`;
        feedback.innerHTML = `
            <div class="feedback-title">${title}</div>
            <div class="feedback-message">${message}</div>
        `;

        setTimeout(() => {
            feedback.classList.remove('show');
        }, duration);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for game system to be ready
    const checkGameSystem = () => {
        if (window.gameSystem) {
            window.wordSearchGame = new WordSearchGame(window.gameSystem);
            console.log('Word Search game initialized');
        } else {
            setTimeout(checkGameSystem, 100);
        }
    };
    checkGameSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordSearchGame;
}