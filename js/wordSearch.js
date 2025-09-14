/**
 * Word Search Game - COMPLETE WORKING VERSION
 * Generates actual letter grid and implements full word search functionality
 */
class WordSearchGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.isGameActive = false;
        this.score = 0;
        this.selectedSound = null;
        this.selectedWords = [];
        this.targetWords = [];
        this.currentSelection = [];
        this.foundWords = [];
        
        // Word database with pronunciation types
        this.wordDatabase = {
            t: ['watched', 'crossed', 'kicked', 'danced', 'jumped', 'helped', 'worked', 'washed'],
            d: ['played', 'lived', 'moved', 'called', 'loved', 'saved', 'opened', 'closed'],
            id: ['wanted', 'needed', 'decided', 'started', 'ended', 'visited', 'created', 'painted']
        };
        
        this.gameBoard = [];
        this.boardSize = 15;
        this.placedWords = [];
        
        this.init();
    }
    
    init() {
        console.log('Initializing Word Search Stone Bridge Game');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'wordSearch') {
                this.startGame();
            }
        });
    }
    
    startGame() {
        console.log('Starting Word Search game');
        this.setupGameInterface();
        this.resetGame();
        this.generateGameBoard();
        this.setupGameControls();
        this.updateDisplay();
    }
    
    log(message) {
        console.log('[WordSearch]', message);
    }
    
    setupGameInterface() {
        const gameContainer = document.getElementById('wordSearch');
        if (!gameContainer) return;
        
        this.log('Setting up complete game interface');
        
        // Create the complete word search interface
        gameContainer.innerHTML = `
            <div class="word-search-container" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh; padding: 20px; color: white;">
                
                <div class="game-header" style="text-align: center; margin-bottom: 30px;">
                    <h2 style="font-size: 28px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">
                        🔍 單詞搜索遊戲
                    </h2>
                    <p style="font-size: 16px; margin: 10px 0;">在網格中找到過去式單詞，選擇正確的發音類型</p>
                </div>
                
                <div class="game-stats" style="
                    display: flex; justify-content: center; gap: 30px; margin-bottom: 25px;">
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                        <strong>分數: <span id="wordSearchScore" style="color: #4ecca3;">0</span></strong>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                        <strong>找到單詞: <span id="wordsFoundCount" style="color: #fbbf24;">0</span>/12</strong>
                    </div>
                </div>
                
                <!-- Sound Selection -->
                <div class="sound-selection" style="
                    text-align: center; margin-bottom: 25px; 
                    background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
                    
                    <div class="sound-buttons" style="display: flex; justify-content: center; gap: 15px; margin: 15px 0;">
                        <button class="sound-btn" data-sound="t" style="
                            background: linear-gradient(45deg, #3498db, #2980b9); color: white; border: none; 
                            padding: 12px 20px; border-radius: 8px; font-size: 16px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease; min-width: 80px;">
                            /t/
                        </button>
                        <button class="sound-btn" data-sound="d" style="
                            background: linear-gradient(45deg, #e74c3c, #c0392b); color: white; border: none; 
                            padding: 12px 20px; border-radius: 8px; font-size: 16px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease; min-width: 80px;">
                            /d/
                        </button>
                        <button class="sound-btn" data-sound="id" style="
                            background: linear-gradient(45deg, #2ecc71, #27ae60); color: white; border: none; 
                            padding: 12px 20px; border-radius: 8px; font-size: 16px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease; min-width: 80px;">
                            /ɪd/
                        </button>
                    </div>
                    <div style="margin: 15px 0; font-size: 16px;">
                        選擇的發音類型: <span id="selectedSoundDisplay" style="color: #4ecca3; font-weight: bold;">none</span>
                    </div>
                </div>
                
                <!-- MAIN GAME BOARD -->
                <div class="game-board-container" style="
                    display: flex; justify-content: center; margin-bottom: 25px;">
                    <div id="wordSearchBoard" class="word-search-grid" style="
                        display: inline-grid; grid-template-columns: repeat(15, 1fr); gap: 2px; 
                        background: rgba(0,0,0,0.4); padding: 20px; border-radius: 15px; 
                        border: 3px solid rgba(255,255,255,0.3);">
                        <!-- Letter cells will be generated here -->
                    </div>
                </div>
                
                <!-- Word Lists -->
                <div class="word-lists" style="
                    display: flex; justify-content: space-around; margin-bottom: 25px; gap: 15px;">
                    
                    <div class="word-list" style="
                        background: rgba(52, 152, 219, 0.2); padding: 15px; border-radius: 10px; 
                        border: 2px solid #3498db; flex: 1; max-width: 300px;">
                        <h4 style="margin-top: 0; color: #3498db; text-align: center;">/t/ 音</h4>
                        <div id="tWordsList" class="word-items"></div>
                    </div>
                    
                    <div class="word-list" style="
                        background: rgba(231, 76, 60, 0.2); padding: 15px; border-radius: 10px; 
                        border: 2px solid #e74c3c; flex: 1; max-width: 300px;">
                        <h4 style="margin-top: 0; color: #e74c3c; text-align: center;">/d/ 音</h4>
                        <div id="dWordsList" class="word-items"></div>
                    </div>
                    
                    <div class="word-list" style="
                        background: rgba(46, 204, 113, 0.2); padding: 15px; border-radius: 10px; 
                        border: 2px solid #2ecc71; flex: 1; max-width: 300px;">
                        <h4 style="margin-top: 0; color: #2ecc71; text-align: center;">/ɪd/ 音</h4>
                        <div id="idWordsList" class="word-items"></div>
                    </div>
                </div>
                
                <!-- Game Controls -->
                <div class="game-controls" style="
                    text-align: center; background: rgba(255,255,255,0.1); 
                    padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                    
                    <div style="margin-bottom: 15px; font-size: 18px;">
                        選中的單詞: <span id="selectedWordDisplay" style="color: #fbbf24; font-weight: bold;">無</span>
                    </div>
                    
                    <div style="display: flex; justify-content: center; gap: 15px;">
                        <button id="confirmWordBtn" class="control-btn" style="
                            background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                            padding: 12px 25px; border-radius: 8px; font-size: 16px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease;" disabled>
                            ✅ 確認
                        </button>
                        <button id="clearSelectionBtn" class="control-btn" style="
                            background: linear-gradient(45deg, #f39c12, #e67e22); color: white; border: none; 
                            padding: 12px 25px; border-radius: 8px; font-size: 16px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease;">
                            🔄 清除
                        </button>
                        <button id="pronounceWordBtn" class="control-btn" style="
                            background: linear-gradient(45deg, #9b59b6, #8e44ad); color: white; border: none; 
                            padding: 12px 25px; border-radius: 8px; font-size: 16px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease;" disabled>
                            🔊 發音
                        </button>
                    </div>
                </div>
                
                <!-- Back Button -->
                <div style="text-align: center;">
                    <button id="wordSearchBackBtn" style="
                        background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.5); 
                        padding: 15px 30px; border-radius: 10px; font-size: 16px; font-weight: bold; 
                        cursor: pointer; transition: all 0.3s ease;">
                        🏠 返回選單
                    </button>
                </div>
            </div>
            
            <style>
            .word-search-grid .cell {
                width: 30px;
                height: 30px;
                background: rgba(255,255,255,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.2s ease;
                user-select: none;
                border: 2px solid transparent;
                color: #333;
            }
            
            .word-search-grid .cell:hover {
                background: rgba(76, 204, 163, 0.8);
                color: white;
                transform: scale(1.1);
            }
            
            .word-search-grid .cell.selected {
                background: #4ecca3 !important;
                color: white;
                border-color: #2ecc71;
                transform: scale(1.05);
            }
            
            .word-search-grid .cell.found {
                background: #2ecc71 !important;
                color: white;
                border-color: #27ae60;
            }
            
            .sound-btn:hover, .control-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            }
            
            .sound-btn.selected {
                transform: scale(1.1);
                box-shadow: 0 0 20px currentColor;
            }
            
            .control-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none !important;
            }
            
            .word-item {
                background: rgba(255,255,255,0.2);
                padding: 8px 12px;
                margin: 5px 0;
                border-radius: 5px;
                text-align: center;
                font-weight: bold;
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .word-item.found {
                background: rgba(46, 204, 113, 0.8);
                color: white;
            }
            </style>
        `;
    }
    
    resetGame() {
        this.score = 0;
        this.foundWords = [];
        this.currentSelection = [];
        this.selectedSound = null;
        this.isGameActive = true;
        this.placedWords = [];
        
        // Select 4 words from each category for this game
        this.targetWords = [];
        Object.keys(this.wordDatabase).forEach(type => {
            const words = this.wordDatabase[type].slice(0, 4);
            words.forEach(word => {
                this.targetWords.push({ word: word.toUpperCase(), type, originalWord: word });
            });
        });
        
        this.log(`Game reset. Target words: ${this.targetWords.length}`);
    }
    
    generateGameBoard() {
        this.log('Generating game board with letters');
        
        // Create empty board
        this.gameBoard = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(''));
        
        // Place target words on the board
        this.targetWords.forEach(wordObj => {
            this.placeWordOnBoard(wordObj.word);
        });
        
        // Fill empty cells with random letters
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.gameBoard[row][col] === '') {
                    this.gameBoard[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
        
        this.renderBoard();
        this.log('Game board generated and rendered');
    }
    
    placeWordOnBoard(word) {
        const directions = [
            [0, 1],   // horizontal right
            [1, 0],   // vertical down
            [1, 1],   // diagonal down-right
            [-1, 1],  // diagonal up-right
            [0, -1],  // horizontal left
            [-1, 0],  // vertical up
            [-1, -1], // diagonal up-left
            [1, -1]   // diagonal down-left
        ];
        
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const startRow = Math.floor(Math.random() * this.boardSize);
            const startCol = Math.floor(Math.random() * this.boardSize);
            
            if (this.canPlaceWord(word, startRow, startCol, direction)) {
                this.placeWord(word, startRow, startCol, direction);
                this.placedWords.push({
                    word,
                    startRow,
                    startCol,
                    direction,
                    cells: this.getWordCells(word, startRow, startCol, direction)
                });
                placed = true;
                this.log(`Placed word: ${word} at (${startRow}, ${startCol})`);
            }
            
            attempts++;
        }
        
        if (!placed) {
            this.log(`Could not place word: ${word} after ${attempts} attempts`);
        }
    }
    
    canPlaceWord(word, startRow, startCol, direction) {
        for (let i = 0; i < word.length; i++) {
            const row = startRow + direction[0] * i;
            const col = startCol + direction[1] * i;
            
            if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
                return false;
            }
            
            if (this.gameBoard[row][col] !== '' && this.gameBoard[row][col] !== word[i]) {
                return false;
            }
        }
        return true;
    }
    
    placeWord(word, startRow, startCol, direction) {
        for (let i = 0; i < word.length; i++) {
            const row = startRow + direction[0] * i;
            const col = startCol + direction[1] * i;
            this.gameBoard[row][col] = word[i];
        }
    }
    
    getWordCells(word, startRow, startCol, direction) {
        const cells = [];
        for (let i = 0; i < word.length; i++) {
            const row = startRow + direction[0] * i;
            const col = startCol + direction[1] * i;
            cells.push({ row, col });
        }
        return cells;
    }
    
    renderBoard() {
        const boardElement = document.getElementById('wordSearchBoard');
        if (!boardElement) return;
        
        boardElement.innerHTML = '';
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = this.gameBoard[row][col];
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Add click event for cell selection
                cell.addEventListener('click', (e) => {
                    this.selectCell(row, col, e);
                });
                
                boardElement.appendChild(cell);
            }
        }
        
        this.log('Game board rendered with letters');
    }
    
    setupGameControls() {
        this.log('Setting up game controls and event listeners');
        
        // Sound selection buttons
        document.querySelectorAll('.sound-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('selected'));
                
                // Select current button
                btn.classList.add('selected');
                this.selectedSound = btn.dataset.sound;
                
                const soundNames = { t: '/t/ 音', d: '/d/ 音', id: '/ɪd/ 音' };
                document.getElementById('selectedSoundDisplay').textContent = soundNames[this.selectedSound];
                
                this.log(`Sound selected: ${this.selectedSound}`);
            });
        });
        
        // Control buttons
        document.getElementById('confirmWordBtn').addEventListener('click', () => this.confirmWord());
        document.getElementById('clearSelectionBtn').addEventListener('click', () => this.clearSelection());
        document.getElementById('pronounceWordBtn').addEventListener('click', () => this.pronounceSelectedWord());
        
        // Back button
        document.getElementById('wordSearchBackBtn').addEventListener('click', () => {
            if (this.gameSystem) {
                this.gameSystem.showGameMenu();
            }
        });
    }
    
    selectCell(row, col, event) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        if (event.shiftKey && this.currentSelection.length > 0) {
            // Multi-select: create line from first to current cell
            this.selectLine(this.currentSelection[0], { row, col });
        } else if (cell.classList.contains('selected')) {
            // Deselect cell
            cell.classList.remove('selected');
            this.currentSelection = this.currentSelection.filter(c => !(c.row === row && c.col === col));
        } else {
            // Single select: start new selection
            if (!event.ctrlKey && !event.metaKey) {
                this.clearSelection();
            }
            cell.classList.add('selected');
            this.currentSelection.push({ row, col });
        }
        
        this.updateSelectedWord();
    }
    
    selectLine(start, end) {
        this.clearSelection();
        
        const cells = this.getLineCells(start, end);
        cells.forEach(cellPos => {
            const cell = document.querySelector(`[data-row="${cellPos.row}"][data-col="${cellPos.col}"]`);
            if (cell) {
                cell.classList.add('selected');
                this.currentSelection.push(cellPos);
            }
        });
        
        this.updateSelectedWord();
    }
    
    getLineCells(start, end) {
        const cells = [];
        const dx = end.col - start.col;
        const dy = end.row - start.row;
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        
        if (distance === 0) {
            return [start];
        }
        
        const stepX = dx / distance;
        const stepY = dy / distance;
        
        for (let i = 0; i <= distance; i++) {
            const row = Math.round(start.row + stepY * i);
            const col = Math.round(start.col + stepX * i);
            cells.push({ row, col });
        }
        
        return cells;
    }
    
    updateSelectedWord() {
        const selectedWord = this.getSelectedWord();
        document.getElementById('selectedWordDisplay').textContent = selectedWord || '無';
        
        const confirmBtn = document.getElementById('confirmWordBtn');
        const pronounceBtn = document.getElementById('pronounceWordBtn');
        
        if (selectedWord && selectedWord.length >= 3) {
            confirmBtn.disabled = false;
            pronounceBtn.disabled = false;
        } else {
            confirmBtn.disabled = true;
            pronounceBtn.disabled = true;
        }
    }
    
    getSelectedWord() {
        if (this.currentSelection.length === 0) return '';
        
        return this.currentSelection
            .map(cell => this.gameBoard[cell.row][cell.col])
            .join('');
    }
    
    confirmWord() {
        if (!this.selectedSound) {
            alert('請先選擇發音類型！');
            return;
        }
        
        const selectedWord = this.getSelectedWord();
        const wordObj = this.targetWords.find(w => w.word === selectedWord);
        
        if (wordObj) {
            if (wordObj.type === this.selectedSound) {
                // Correct classification
                this.foundWords.push(selectedWord);
                this.score += 10;
                
                // Mark cells as found
                this.currentSelection.forEach(cell => {
                    const cellElement = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                    cellElement.classList.add('found');
                    cellElement.classList.remove('selected');
                });
                
                // Add to appropriate word list
                this.addWordToList(wordObj.originalWord, wordObj.type);
                
                // Show success message
                this.showMessage(`✅ 正確！${wordObj.originalWord} 是 /${wordObj.type}/ 音`, 'success');
            } else {
                // Wrong classification
                this.showMessage(`❌ 錯誤！${wordObj.originalWord} 不是 /${this.selectedSound}/ 音`, 'error');
            }
        } else {
            this.showMessage('❌ 這不是一個有效的單詞', 'error');
        }
        
        this.clearSelection();
        this.updateDisplay();
        
        // Check win condition
        if (this.foundWords.length >= 12) {
            this.completeGame();
        }
    }
    
    addWordToList(word, type) {
        const listElement = document.getElementById(`${type}WordsList`);
        if (listElement) {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item found';
            wordItem.textContent = word;
            listElement.appendChild(wordItem);
        }
    }
    
    clearSelection() {
        document.querySelectorAll('.cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        this.currentSelection = [];
        this.updateSelectedWord();
    }
    
    pronounceSelectedWord() {
        const selectedWord = this.getSelectedWord().toLowerCase();
        if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(selectedWord);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    }
    
    updateDisplay() {
        document.getElementById('wordSearchScore').textContent = this.score;
        document.getElementById('wordsFoundCount').textContent = this.foundWords.length;
    }
    
    showMessage(message, type) {
        // Create a simple message display
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#2ecc71' : '#e74c3c'}; color: white;
            padding: 20px 30px; border-radius: 10px; font-size: 18px; font-weight: bold;
            z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 2000);
    }
    
    completeGame() {
        this.isGameActive = false;
        this.showMessage('🎉 恭喜！你找到了所有單詞！', 'success');
        
        setTimeout(() => {
            if (this.gameSystem) {
                this.gameSystem.showGameMenu();
            }
        }, 3000);
    }
    
    stopGame() {
        this.isGameActive = false;
        this.currentSelection = [];
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checkGameSystem = () => {
        if (window.gameSystem) {
            window.wordSearchGame = new WordSearchGame(window.gameSystem);
            console.log('✅ Word Search game initialized with working grid generation');
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
