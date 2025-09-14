/**
 * Word Search Game - COMPLETELY FIXED VERSION
 * Ensures letter grid actually shows up and works properly
 */
class WordSearchGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.isGameActive = false;
        this.score = 0;
        this.selectedSound = null;
        this.selectedWords = [];
        this.targetWords = [];
        
        // Word database with pronunciation types
        this.wordDatabase = {
            t: ['watched', 'crossed', 'kicked', 'danced', 'jumped', 'helped', 'worked', 'washed'],
            d: ['played', 'lived', 'moved', 'called', 'loved', 'saved', 'opened', 'closed'],
            id: ['wanted', 'needed', 'decided', 'started', 'ended', 'visited', 'created', 'painted']
        };
        
        this.gameBoard = [];
        this.boardSize = 12;
        this.foundWords = [];
        this.currentSelection = [];
        this.placedWords = [];
        
        this.init();
    }
    
    init() {
        console.log('🎮 Initializing Word Search Stone Bridge Game');
        this.setupEventListeners();
        
        // Auto-start if the game container is visible
        setTimeout(() => {
            const gameContainer = document.getElementById('wordSearch');
            if (gameContainer && gameContainer.style.display !== 'none') {
                this.startGame();
            }
        }, 500);
    }
    
    setupEventListeners() {
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'wordSearch') {
                this.startGame();
            }
        });
        
        // Check if container becomes visible
        const observer = new MutationObserver(() => {
            const gameContainer = document.getElementById('wordSearch');
            if (gameContainer && gameContainer.style.display !== 'none' && !this.isGameActive) {
                console.log('🎯 Word search container is visible, starting game...');
                this.startGame();
            }
        });
        
        if (document.getElementById('wordSearch')) {
            observer.observe(document.getElementById('wordSearch'), { 
                attributes: true, 
                attributeFilter: ['style'] 
            });
        }
    }
    
    startGame() {
        console.log('🚀 Starting Word Search game');
        this.showCutscene();
    }
    
    log(message) {
        console.log('[WordSearch]', message);
    }
    
    showCutscene() {
        const gameContainer = document.getElementById('wordSearch');
        if (!gameContainer) {
            console.error('Game container not found!');
            return;
        }
        
        this.log('Showing cutscene');
        
        // Create complete cutscene interface
        gameContainer.innerHTML = `
            <div class="stone-bridge-cutscene" style="
                background: linear-gradient(180deg, #87ceeb 0%, #4682b4 50%, #2e8b57 100%);
                min-height: 100vh; position: relative; overflow: hidden;">
                
                <!-- Cutscene Story Section -->
                <div class="cutscene-story" style="
                    position: relative; z-index: 100; text-align: center; color: white; 
                    padding: 40px 20px; background: rgba(0,0,0,0.3);">
                    
                    <h2 style="font-size: 32px; margin: 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">
                        🌉 石橋修復挑戰
                    </h2>
                    
                    <!-- Cliff Scene Visual -->
                    <div class="cliff-visual" style="
                        background: linear-gradient(180deg, #87ceeb 0%, #8fbc8f 100%);
                        margin: 30px auto; padding: 40px; border-radius: 20px; max-width: 600px;
                        border: 3px solid rgba(255,255,255,0.3); position: relative;">
                        
                        <!-- Cliff edges -->
                        <div style="position: absolute; left: 0; top: 50%; width: 80px; height: 100px; 
                                    background: linear-gradient(45deg, #8b7355, #a0522d); 
                                    clip-path: polygon(0 0, 80% 0, 100% 100%, 0 100%);"></div>
                        <div style="position: absolute; right: 0; top: 50%; width: 80px; height: 100px; 
                                    background: linear-gradient(45deg, #8b7355, #a0522d); 
                                    clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%);"></div>
                        
                        <!-- Bridge stones (incomplete) -->
                        <div style="position: absolute; left: 50%; top: 60%; transform: translateX(-50%); 
                                    display: flex; gap: 5px;">
                            <div style="width: 30px; height: 20px; background: #696969; border-radius: 5px;"></div>
                            <div style="width: 30px; height: 20px; background: #696969; border-radius: 5px;"></div>
                            <div style="width: 30px; height: 20px; background: transparent; border: 2px dashed #fff;"></div>
                            <div style="width: 30px; height: 20px; background: transparent; border: 2px dashed #fff;"></div>
                            <div style="width: 30px; height: 20px; background: #696969; border-radius: 5px;"></div>
                        </div>
                        
                        <!-- Hero character -->
                        <div style="position: absolute; left: 20%; bottom: 20%; width: 40px; height: 50px;">
                            <div style="width: 25px; height: 25px; background: #fdbcb4; border-radius: 50%; margin: 0 auto;"></div>
                            <div style="width: 30px; height: 35px; background: #4ecca3; border-radius: 15px; margin-top: 5px;"></div>
                        </div>
                    </div>
                    
                    <div class="story-text" style="
                        background: rgba(0,0,0,0.6); padding: 25px; border-radius: 15px; 
                        margin: 30px auto; max-width: 650px; font-size: 18px; line-height: 1.6;">
                        
                        <p style="margin: 15px 0;">
                            你來到了一個深谷邊緣，古老的石橋已經破損。只有找到正確的過去式單詞，
                            才能修復橋樑繼續前行。
                        </p>
                        <p style="margin: 15px 0; color: #fbbf24; font-weight: bold;">
                            在字母網格中找到隱藏的過去式單詞，根據它們的發音分類來修復石橋！
                        </p>
                        
                        <div style="background: rgba(76, 204, 163, 0.2); padding: 15px; border-radius: 10px; margin: 20px 0;">
                            <strong style="color: #4ecca3;">遊戲規則：</strong>
                            <ul style="text-align: left; margin: 10px 0; padding-left: 20px;">
                                <li>在12×12網格中找到過去式單詞</li>
                                <li>選擇單詞的正確發音類型：/t/, /d/, 或 /ɪd/</li>
                                <li>正確分類的單詞會成為橋樑石塊</li>
                                <li>找到足夠的單詞完成石橋修復</li>
                            </ul>
                        </div>
                    </div>
                    
                    <button id="startMainGameBtn" style="
                        background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                        padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                        cursor: pointer; margin: 25px 10px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);
                        animation: buttonPulse 2s ease-in-out infinite;">
                        🌉 開始修復石橋
                    </button>
                    
                    <button id="backToMenuBtn" style="
                        background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.5); 
                        padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                        cursor: pointer; margin: 25px 10px;">
                        🏠 返回選單
                    </button>
                </div>
            </div>
            
            <style>
            @keyframes buttonPulse {
                0%, 100% { box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4); }
                50% { box-shadow: 0 12px 35px rgba(76, 204, 163, 0.7); }
            }
            </style>
        `;
        
        // Add event listeners
        document.getElementById('startMainGameBtn').onclick = () => this.startMainGame();
        document.getElementById('backToMenuBtn').onclick = () => {
            if (this.gameSystem) {
                this.gameSystem.showGameMenu();
            }
        };
    }
    
    startMainGame() {
        this.log('🎯 Starting main word search game with letter grid generation');
        this.setupGameInterface();
        this.resetGame();
        this.generateGameBoard();
        this.setupGameControls();
        this.updateDisplay();
    }
    
    setupGameInterface() {
        const gameContainer = document.getElementById('wordSearch');
        if (!gameContainer) {
            console.error('Game container not found for interface setup!');
            return;
        }
        
        this.log('Setting up complete game interface');
        
        // Create complete game interface with NO background images that can get stuck
        gameContainer.innerHTML = `
            <div class="word-search-game" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh; padding: 20px; color: white; position: relative;">
                
                <!-- Game Header -->
                <div class="game-header" style="text-align: center; margin-bottom: 30px;">
                    <h2 style="font-size: 28px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">
                        🔍 單詞搜索遊戲
                    </h2>
                    <p style="font-size: 16px; margin: 10px 0;">在網格中找到過去式單詞，選擇正確的發音類型</p>
                </div>
                
                <!-- Game Stats -->
                <div class="game-stats" style="
                    display: flex; justify-content: center; gap: 30px; margin-bottom: 25px;">
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                        <strong>分數: <span id="wordSearchScore" style="color: #4ecca3;">0</span></strong>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                        <strong>找到單詞: <span id="wordsFound" style="color: #fbbf24;">0</span>/15</strong>
                    </div>
                </div>
                
                <!-- Sound Selection -->
                <div class="sound-selection" style="
                    text-align: center; margin-bottom: 25px; 
                    background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
                    
                    <div class="sound-buttons" style="display: flex; justify-content: center; gap: 15px; margin: 15px 0;">
                        <button class="sound-btn" data-sound="t" style="
                            background: linear-gradient(45deg, #3498db, #2980b9); color: white; border: none; 
                            padding: 15px 25px; border-radius: 10px; font-size: 16px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease;">
                            /t/
                        </button>
                        <button class="sound-btn" data-sound="d" style="
                            background: linear-gradient(45deg, #e74c3c, #c0392b); color: white; border: none; 
                            padding: 15px 25px; border-radius: 10px; font-size: 16px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease;">
                            /d/
                        </button>
                        <button class="sound-btn" data-sound="id" style="
                            background: linear-gradient(45deg, #2ecc71, #27ae60); color: white; border: none; 
                            padding: 15px 25px; border-radius: 10px; font-size: 16px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease;">
                            /ɪd/
                        </button>
                    </div>
                    <div style="margin: 15px 0; font-size: 16px;">
                        選擇的發音類型: <span id="selectedSoundDisplay" style="color: #4ecca3; font-weight: bold;">none</span>
                    </div>
                </div>
                
                <!-- MAIN GAME BOARD - This is where letters will appear -->
                <div class="game-board-container" style="
                    display: flex; justify-content: center; margin-bottom: 25px;">
                    <div id="wordSearchBoard" class="word-search-board" style="
                        display: grid; grid-template-columns: repeat(12, 1fr); gap: 3px; 
                        background: rgba(0,0,0,0.4); padding: 20px; border-radius: 15px; 
                        border: 3px solid rgba(255,255,255,0.3); max-width: 500px;">
                        <!-- Letter grid cells will be generated here -->
                    </div>
                </div>
                
                <!-- Word Lists -->
                <div class="word-lists" style="
                    display: flex; justify-content: space-around; margin-bottom: 25px; gap: 15px;">
                    
                    <div class="word-list" style="
                        background: rgba(52, 152, 219, 0.2); padding: 15px; border-radius: 10px; 
                        border: 2px solid #3498db; flex: 1; max-width: 200px;">
                        <h4 style="margin-top: 0; color: #3498db; text-align: center;">/t/ 音</h4>
                        <div class="word-items" id="tWords"></div>
                    </div>
                    
                    <div class="word-list" style="
                        background: rgba(231, 76, 60, 0.2); padding: 15px; border-radius: 10px; 
                        border: 2px solid #e74c3c; flex: 1; max-width: 200px;">
                        <h4 style="margin-top: 0; color: #e74c3c; text-align: center;">/d/ 音</h4>
                        <div class="word-items" id="dWords"></div>
                    </div>
                    
                    <div class="word-list" style="
                        background: rgba(46, 204, 113, 0.2); padding: 15px; border-radius: 10px; 
                        border: 2px solid #2ecc71; flex: 1; max-width: 200px;">
                        <h4 style="margin-top: 0; color: #2ecc71; text-align: center;">/ɪd/ 音</h4>
                        <div class="word-items" id="idWords"></div>
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
            .word-search-board .cell {
                width: 35px;
                height: 35px;
                background: rgba(255,255,255,0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 16px;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.2s ease;
                user-select: none;
                border: 2px solid transparent;
                color: #333;
            }
            
            .word-search-board .cell:hover {
                background: rgba(76, 204, 163, 0.8);
                color: white;
                transform: scale(1.1);
                border-color: #4ecca3;
            }
            
            .word-search-board .cell.selected {
                background: #4ecca3 !important;
                color: white;
                border-color: #2ecc71;
                transform: scale(1.05);
            }
            
            .word-search-board .cell.found {
                background: #2ecc71 !important;
                color: white;
                border-color: #27ae60;
                animation: foundPulse 0.5s ease-in-out;
            }
            
            @keyframes foundPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1.05); }
            }
            
            .sound-btn:hover, .control-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            }
            
            .sound-btn.selected {
                transform: scale(1.1);
                box-shadow: 0 0 20px currentColor;
                border: 3px solid rgba(255,255,255,0.5);
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
                animation: wordFound 0.5s ease-in-out;
            }
            
            @keyframes wordFound {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            </style>
        `;
        
        this.log('Game interface created successfully');
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
            } else {
                // Fallback
                const gameContainer = document.getElementById('wordSearch');
                if (gameContainer) {
                    gameContainer.style.display = 'none';
                }
                const gameMenu = document.getElementById('gameMenu');
                if (gameMenu) {
                    gameMenu.style.display = 'block';
                }
            }
        });
        
        this.log('Game controls set up successfully');
    }
    
    resetGame() {
        this.log('Resetting game state');
        this.score = 0;
        this.foundWords = [];
        this.selectedWords = [];
        this.currentSelection = [];
        this.selectedSound = null;
        this.isGameActive = true;
        this.placedWords = [];
        
        // Select 5 words from each category for this game
        this.targetWords = [];
        Object.keys(this.wordDatabase).forEach(type => {
            const words = this.wordDatabase[type].slice(0, 5);
            words.forEach(word => {
                this.targetWords.push({ word, type });
            });
        });
        
        this.log(`Game reset complete. Target words: ${this.targetWords.length}`);
    }
    
    generateGameBoard() {
        this.log('🎯 Starting game board generation');
        
        // Create empty board
        this.gameBoard = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(''));
        
        // Place target words on board
        let wordsPlaced = 0;
        this.targetWords.forEach(wordObj => {
            if (this.placeWordOnBoard(wordObj.word.toUpperCase())) {
                wordsPlaced++;
                this.log(`Placed word: ${wordObj.word}`);
            }
        });
        
        this.log(`Successfully placed ${wordsPlaced} words on board`);
        
        // Fill empty cells with random letters
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.gameBoard[row][col] === '') {
                    this.gameBoard[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
        
        this.log('Empty cells filled with random letters');
        this.renderBoard();
    }
    
    placeWordOnBoard(word) {
        const directions = [
            [0, 1],   // horizontal right
            [1, 0],   // vertical down
            [1, 1],   // diagonal down-right
            [-1, 1]   // diagonal up-right
        ];
        
        let attempts = 0;
        const maxAttempts = 100;
        
        while (attempts < maxAttempts) {
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
                return true;
            }
            
            attempts++;
        }
        
        this.log(`Could not place word: ${word} after ${attempts} attempts`);
        return false;
    }
    
    canPlaceWord(word, startRow, startCol, direction) {
        for (let i = 0; i < word.length; i++) {
            const row = startRow + direction[0] * i;
            const col = startCol + direction[1] * i;
            
            // Check bounds
            if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
                return false;
            }
            
            // Check if cell is empty or already has the same letter
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
        if (!boardElement) {
            console.error('Board element not found!');
            return;
        }
        
        this.log('🎨 Rendering game board with letters');
        
        // Clear existing board
        boardElement.innerHTML = '';
        
        // Create grid cells
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = this.gameBoard[row][col];
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Add click event for cell selection
                cell.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.selectCell(row, col, e);
                });
                
                // Add hover events for better UX
                cell.addEventListener('mouseenter', () => this.highlightCell(row, col));
                
                boardElement.appendChild(cell);
            }
        }
        
        this.log(`✅ Game board rendered successfully with ${this.boardSize}x${this.boardSize} letters`);
        
        // Verify letters are actually showing
        const cellsWithText = boardElement.querySelectorAll('.cell').length;
        this.log(`Board verification: ${cellsWithText} cells created`);
    }
    
    selectCell(row, col, event) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (!cell) return;
        
        if (event.shiftKey && this.currentSelection.length > 0) {
            // Multi-select: create line from first to current cell
            this.selectLine(this.currentSelection[0], { row, col });
        } else if (cell.classList.contains('selected')) {
            // Deselect cell
            cell.classList.remove('selected');
            this.currentSelection = this.currentSelection.filter(c => !(c.row === row && c.col === col));
        } else {
            // Single select or add to selection
            if (!event.ctrlKey && !event.metaKey) {
                this.clearSelection();
            }
            cell.classList.add('selected');
            this.currentSelection.push({ row, col });
        }
        
        this.updateSelectedWord();
        this.log(`Cell selected: (${row}, ${col}). Current selection length: ${this.currentSelection.length}`);
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
            if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
                cells.push({ row, col });
            }
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
            this.showMessage('請先選擇發音類型！', 'warning');
            return;
        }
        
        const selectedWord = this.getSelectedWord();
        const wordObj = this.targetWords.find(w => w.word.toUpperCase() === selectedWord);
        
        if (wordObj && !this.foundWords.includes(selectedWord)) {
            if (wordObj.type === this.selectedSound) {
                // Correct classification
                this.foundWords.push(selectedWord);
                this.score += 10;
                
                // Mark cells as found
                this.currentSelection.forEach(cell => {
                    const cellElement = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                    if (cellElement) {
                        cellElement.classList.add('found');
                        cellElement.classList.remove('selected');
                    }
                });
                
                // Add to appropriate word list
                this.addWordToList(wordObj.word, wordObj.type);
                
                this.showMessage(`✅ 正確！${wordObj.word} 是 /${wordObj.type}/ 音`, 'success');
                
                this.log(`Correct word found: ${wordObj.word} (${wordObj.type})`);
            } else {
                this.showMessage(`❌ 錯誤！${wordObj.word} 不是 /${this.selectedSound}/ 音`, 'error');
                this.log(`Wrong classification: ${wordObj.word} is ${wordObj.type}, not ${this.selectedSound}`);
            }
        } else if (wordObj && this.foundWords.includes(selectedWord)) {
            this.showMessage('這個單詞已經找過了！', 'warning');
        } else {
            this.showMessage('這不是一個有效的單詞', 'error');
        }
        
        this.clearSelection();
        this.updateDisplay();
        
        // Check win condition
        if (this.foundWords.length >= 15) {
            this.completeGame();
        }
    }
    
    addWordToList(word, type) {
        const listElement = document.getElementById(`${type}Words`);
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
    
    highlightCell(row, col) {
        // Optional: Add hover effects or path highlighting
    }
    
    pronounceSelectedWord() {
        const selectedWord = this.getSelectedWord().toLowerCase();
        if (window.speechSynthesis && selectedWord) {
            const utterance = new SpeechSynthesisUtterance(selectedWord);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    }
    
    updateDisplay() {
        document.getElementById('wordSearchScore').textContent = this.score;
        document.getElementById('wordsFound').textContent = this.foundWords.length;
        
        if (this.gameSystem) {
            this.gameSystem.updateScore('wordSearch', this.score, true);
        }
    }
    
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#2ecc71' : 
                        type === 'error' ? '#e74c3c' : 
                        type === 'warning' ? '#f39c12' : '#3498db'}; 
            color: white; padding: 20px 30px; border-radius: 10px; font-size: 18px; 
            font-weight: bold; z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: messageSlide 0.3s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 300);
            }
        }, 2000);
    }
    
    completeGame() {
        this.isGameActive = false;
        this.showMessage('🎉 恭喜！石橋修復完成！你找到了所有單詞！', 'success');
        
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
    console.log('📋 Word Search game script loaded');
    
    const checkGameSystem = () => {
        if (window.gameSystem) {
            window.wordSearchGame = new WordSearchGame(window.gameSystem);
            console.log('✅ Word Search Stone Bridge game initialized successfully');
        } else {
            // Fallback initialization
            setTimeout(checkGameSystem, 100);
        }
    };
    
    // Start checking immediately
    checkGameSystem();
    
    // Also check when container becomes visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.id === 'wordSearch' && target.style.display !== 'none') {
                    if (!window.wordSearchGame) {
                        console.log('🎯 Word search container became visible, initializing...');
                        window.wordSearchGame = new WordSearchGame(window.gameSystem);
                    }
                }
            }
        });
    });
    
    const wordSearchContainer = document.getElementById('wordSearch');
    if (wordSearchContainer) {
        observer.observe(wordSearchContainer, { attributes: true, attributeFilter: ['style'] });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordSearchGame;
}
