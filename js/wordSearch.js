/**
 * WordSearch.js - Word Search Game Logic
 * Handles the bridge repair mini-game with reusable letters
 * Only uses 4 directions: left/right/up/down (no diagonals)
 */
class WordSearchGame {
    constructor() {
        this.selectedSound = null;
        this.selectedCells = [];
        this.foundWords = { t: [], d: [], id: [] };
        this.progress = { t: 0, d: 0, id: 0 };
        this.boardSize = 12;
        this.gameBoard = [];
        this.isSelecting = false;
        this.startCell = null;
        
        // Word database with past tense words
        this.wordDatabase = {
            t: ['WATCHED', 'KICKED', 'HELPED', 'WORKED', 'WASHED', 'PASSED', 'CROSSED', 'DANCED'],
            d: ['PLAYED', 'LIVED', 'MOVED', 'LOVED', 'OPENED', 'CLOSED', 'TURNED', 'LEARNED'],
            id: ['WANTED', 'NEEDED', 'DECIDED', 'STARTED', 'ENDED', 'VISITED', 'CREATED', 'PAINTED']
        };
        
        this.targetWords = [];
        this.foundWordPositions = []; // Track found word positions for visual feedback
        
        console.log('🔍 WordSearch game initialized');
    }
    
    /**
     * Initialize the word search game
     */
    init() {
        console.log('🎮 Starting Word Search game logic');
        this.generateBoard();
        this.renderBoard();
        this.setupControls();
        this.setupUI();
    }
    
    /**
     * Generate the game board with words placed only horizontally and vertically
     */
    generateBoard() {
        // Initialize empty board
        this.gameBoard = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(''));
        
        // Prepare target words (4 words per type)
        Object.keys(this.wordDatabase).forEach(type => {
            this.wordDatabase[type].slice(0, 4).forEach(word => {
                this.targetWords.push({ word, type });
            });
        });
        
        // Place words on the board
        let placedCount = 0;
        this.targetWords.forEach(wordObj => {
            if (this.placeWord(wordObj.word)) {
                placedCount++;
            }
        });
        
        // Fill empty cells with random letters
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.gameBoard[row][col] === '') {
                    this.gameBoard[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
        
        console.log(`✅ Board generated with ${placedCount} words placed`);
    }
    
    /**
     * Place a word on the board using only 4 directions
     */
    placeWord(word) {
        // Only 4 directions: left, right, up, down
        const directions = [
            [0, 1],   // Right →
            [0, -1],  // Left ←
            [1, 0],   // Down ↓
            [-1, 0]   // Up ↑
        ];
        
        for (let attempt = 0; attempt < 100; attempt++) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const row = Math.floor(Math.random() * this.boardSize);
            const col = Math.floor(Math.random() * this.boardSize);
            
            if (this.canPlaceWord(word, row, col, dir)) {
                // Place the word
                for (let i = 0; i < word.length; i++) {
                    const r = row + dir[0] * i;
                    const c = col + dir[1] * i;
                    this.gameBoard[r][c] = word[i];
                }
                return true;
            }
        }
        return false;
    }
    
    /**
     * Check if a word can be placed at the given position and direction
     */
    canPlaceWord(word, row, col, dir) {
        for (let i = 0; i < word.length; i++) {
            const r = row + dir[0] * i;
            const c = col + dir[1] * i;
            
            // Check bounds
            if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize) {
                return false;
            }
            
            // Check if cell is empty or already has the same letter
            if (this.gameBoard[r][c] !== '' && this.gameBoard[r][c] !== word[i]) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Render the game board to the DOM
     */
    renderBoard() {
        const grid = document.getElementById('letterGrid');
        if (!grid) {
            console.error('Letter grid element not found');
            return;
        }
        
        grid.innerHTML = '';
        grid.className = 'letter-grid';
        
        // Create grid cells
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = this.createCell(row, col, this.gameBoard[row][col]);
                grid.appendChild(cell);
            }
        }
        
        // Add global mouse events for selection
        document.addEventListener('mouseup', () => this.endSelection());
        
        console.log('✅ Board rendered successfully');
    }
    
    /**
     * Create a single letter cell
     */
    createCell(row, col, letter) {
        const cell = document.createElement('div');
        cell.className = 'letter-cell';
        cell.textContent = letter;
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        // Add mouse event listeners for selection
        cell.addEventListener('mousedown', (e) => this.startSelection(row, col, e));
        cell.addEventListener('mouseenter', (e) => this.continueSelection(row, col, e));
        cell.addEventListener('mouseup', (e) => this.endSelection(row, col, e));
        
        return cell;
    }
    
    /**
     * Start cell selection
     */
    startSelection(row, col, e) {
        e.preventDefault();
        this.isSelecting = true;
        this.startCell = { row, col };
        this.clearSelection();
        this.selectCell(row, col);
        
        // Play click sound
        if (window.audioManager) {
            window.audioManager.playClick();
        }
    }
    
    /**
     * Continue selection while dragging
     */
    continueSelection(row, col, e) {
        if (!this.isSelecting || !this.startCell) return;
        
        // Clear previous selection and select new line
        this.clearSelection();
        this.selectLine(this.startCell, { row, col });
    }
    
    /**
     * End selection
     */
    endSelection(row, col, e) {
        this.isSelecting = false;
    }
    
    /**
     * Select a line of cells (only horizontal or vertical)
     */
    selectLine(start, end) {
        const dx = end.col - start.col;
        const dy = end.row - start.row;
        
        // Force horizontal or vertical selection only
        if (Math.abs(dx) > 0 && Math.abs(dy) > 0) {
            // If diagonal, choose the dominant direction
            if (Math.abs(dx) > Math.abs(dy)) {
                end.row = start.row; // Make horizontal
            } else {
                end.col = start.col; // Make vertical
            }
        }
        
        const distance = Math.max(Math.abs(end.col - start.col), Math.abs(end.row - start.row));
        
        if (distance === 0) {
            this.selectCell(start.row, start.col);
            return;
        }
        
        const stepX = end.col === start.col ? 0 : (end.col - start.col) / distance;
        const stepY = end.row === start.row ? 0 : (end.row - start.row) / distance;
        
        // Select all cells in the line
        for (let i = 0; i <= distance; i++) {
            const row = start.row + Math.round(stepY * i);
            const col = start.col + Math.round(stepX * i);
            
            if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
                this.selectCell(row, col);
            }
        }
    }
    
    /**
     * Select a single cell (allows reuse of letters)
     */
    selectCell(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.add('selected');
            this.selectedCells.push({ row, col });
        }
        this.updateSelectedWord();
    }
    
    /**
     * Clear current selection
     */
    clearSelection() {
        document.querySelectorAll('.letter-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
        this.selectedCells = [];
        this.updateSelectedWord();
    }
    
    /**
     * Update the displayed selected word
     */
    updateSelectedWord() {
        const word = this.selectedCells.map(cell => this.gameBoard[cell.row][cell.col]).join('');
        const selectedWordEl = document.getElementById('selectedWord');
        
        if (selectedWordEl) {
            selectedWordEl.textContent = word || 'None';
        }
        
        // Enable/disable control buttons
        this.updateControlButtons(word.length >= 3);
    }
    
    /**
     * Update control button states
     */
    updateControlButtons(hasSelection) {
        const confirmBtn = document.getElementById('confirmBtn');
        const pronounceBtn = document.getElementById('pronounceBtn');
        
        if (confirmBtn) confirmBtn.disabled = !hasSelection;
        if (pronounceBtn) pronounceBtn.disabled = !hasSelection;
    }
    
    /**
     * Set up game controls and UI
     */
    setupControls() {
        // Sound selection buttons
        document.querySelectorAll('.sound-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectSound(btn.dataset.sound));
        });
        
        // Control buttons
        const confirmBtn = document.getElementById('confirmBtn');
        const clearBtn = document.getElementById('clearBtn');
        const pronounceBtn = document.getElementById('pronounceBtn');
        
        if (confirmBtn) confirmBtn.addEventListener('click', () => this.confirmWord());
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearSelection());
        if (pronounceBtn) pronounceBtn.addEventListener('click', () => this.pronounceWord());
    }
    
    /**
     * Set up the game UI elements
     */
    setupUI() {
        this.updateProgressBars();
        this.updateFoundWordsDisplay();
    }
    
    /**
     * Select a sound type (/t/, /d/, or /ɪd/)
     */
    selectSound(soundType) {
        this.selectedSound = soundType;
        
        // Update button visual states
        document.querySelectorAll('.sound-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-sound="${soundType}"]`).classList.add('selected');
        
        // Update display
        const selectedSoundEl = document.getElementById('selectedSound');
        if (selectedSoundEl) {
            const soundNames = { t: '/t/ sound', d: '/d/ sound', id: '/ɪd/ sound' };
            selectedSoundEl.textContent = soundNames[soundType];
        }
        
        if (window.audioManager) {
            window.audioManager.playClick();
        }
    }
    
    /**
     * Confirm the selected word
     */
    confirmWord() {
        if (!this.selectedSound) {
            this.showMessage('Please select a pronunciation type first!', 'warning');
            return;
        }
        
        const word = this.selectedCells.map(cell => this.gameBoard[cell.row][cell.col]).join('');
        const wordObj = this.targetWords.find(w => w.word === word);
        
        if (wordObj && wordObj.type === this.selectedSound && !this.foundWords[wordObj.type].includes(word)) {
            this.handleCorrectWord(wordObj, word);
        } else if (wordObj && this.foundWords[wordObj.type].includes(word)) {
            this.showMessage('This word has already been found!', 'warning');
        } else {
            this.handleIncorrectWord();
        }
        
        this.clearSelection();
    }
    
    /**
     * Handle correct word selection
     */
    handleCorrectWord(wordObj, word) {
        this.foundWords[wordObj.type].push(word);
        this.progress[wordObj.type]++;
        
        // Mark cells as part of a found word (but still selectable)
        this.selectedCells.forEach(cell => {
            const cellEl = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
            cellEl.classList.add('word-found');
            cellEl.classList.add('part-of-word');
        });
        
        // Update UI
        this.updateFoundWordsDisplay();
        this.updateProgressBars();
        
        // Show success message
        this.showMessage(`Correct! ${word.toLowerCase()} is /${wordObj.type}/ sound`, 'success');
        
        // Check for game completion
        if (this.progress.t >= 3 && this.progress.d >= 3 && this.progress.id >= 3) {
            setTimeout(() => {
                this.completeGame();
            }, 1000);
        }
    }
    
    /**
     * Handle incorrect word selection
     */
    handleIncorrectWord() {
        this.showMessage('Wrong! Please try again.', 'error');
        
        if (window.audioManager) {
            window.audioManager.playWrong();
        }
    }
    
    /**
     * Update progress bars
     */
    updateProgressBars() {
        ['t', 'd', 'id'].forEach(type => {
            const count = this.progress[type];
            const percentage = (count / 3) * 100;
            
            const progressBar = document.getElementById(`progress${type.toUpperCase()}`);
            const countEl = document.getElementById(`count${type.toUpperCase()}`);
            
            if (progressBar) progressBar.style.width = `${percentage}%`;
            if (countEl) countEl.textContent = `${count}/3`;
        });
    }
    
    /**
     * Update found words display
     */
    updateFoundWordsDisplay() {
        ['t', 'd', 'id'].forEach(type => {
            const container = document.getElementById(`foundWords${type.toUpperCase()}`);
            if (!container) return;
            
            container.innerHTML = '';
            this.foundWords[type].forEach(word => {
                const wordEl = document.createElement('div');
                wordEl.className = 'word-item found';
                wordEl.textContent = word.toLowerCase();
                container.appendChild(wordEl);
            });
        });
    }
    
    /**
     * Pronounce the selected word
     */
    pronounceWord() {
        const word = this.selectedCells.map(cell => this.gameBoard[cell.row][cell.col]).join('').toLowerCase();
        
        if (word && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    }
    
    /**
     * Complete the game
     */
    completeGame() {
        this.showMessage('🎉 Bridge repaired! Game completed!', 'success', 4000);
        
        // Notify game system
        if (window.gameSystem) {
            window.gameSystem.completeGame('wordSearch');
        }
        
        if (window.audioManager) {
            window.audioManager.playCorrect();
        }
    }
    
    /**
     * Show a message to the user
     */
    showMessage(text, type = 'success', duration = 3000) {
        if (window.gameSystem && window.gameSystem.showMessage) {
            window.gameSystem.showMessage(text, type, duration);
        } else {
            console.log(`${type.toUpperCase()}: ${text}`);
        }
    }
    
    /**
     * Reset the game
     */
    reset() {
        this.selectedSound = null;
        this.selectedCells = [];
        this.foundWords = { t: [], d: [], id: [] };
        this.progress = { t: 0, d: 0, id: 0 };
        this.targetWords = [];
        this.foundWordPositions = [];
        
        this.generateBoard();
        this.renderBoard();
        this.setupUI();
        
        console.log('🔄 Word search game reset');
    }
    
    /**
     * Get current game state
     */
    getState() {
        return {
            progress: this.progress,
            foundWords: this.foundWords,
            selectedSound: this.selectedSound,
            completed: this.progress.t >= 3 && this.progress.d >= 3 && this.progress.id >= 3
        };
    }
}

// Make the class available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordSearchGame;
}

window.WordSearchGame = WordSearchGame;
console.log('✅ WordSearch game loaded successfully');
