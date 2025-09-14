/**
 * Word Search Game - Complete Version with Bridge Building
 * Player searches for words in a grid to build stone bridges
 */
class WordSearchGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.isGameActive = false;
        this.selectedSound = null;
        this.score = 0;
        this.currentSelection = [];
        this.foundWords = { t: [], d: [], id: [] };
        this.requiredWords = { t: 3, d: 3, id: 3 };
        
        // Game board
        this.gridSize = 12;
        this.grid = [];
        this.selectedCells = [];
        
        // Word database
        this.wordDatabase = {
            t: ['watched', 'crossed', 'kicked', 'danced', 'jumped', 'helped'],
            d: ['played', 'lived', 'moved', 'called', 'loved', 'saved'],
            id: ['wanted', 'needed', 'decided', 'started', 'ended', 'visited']
        };
        
        // Bridge building progress
        this.bridgeSegments = { t: false, d: false, id: false };
        
        this.init();
    }
    
    init() {
        console.log('Initializing Word Search Bridge Building Game');
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
        this.showCutscene();
    }
    
    showCutscene() {
        const gameContainer = document.getElementById('wordSearch');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = `
            <div class="bridge-cutscene" style="
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000;
                background: linear-gradient(180deg, #87ceeb 0%, #4682b4 50%, #2e8b57 100%);
                display: flex; align-items: center; justify-content: center;">
                
                <div class="cliff-scene" style="width: 90%; max-width: 1000px; position: relative; height: 80%;">
                    
                    <!-- Sky and mountains background -->
                    <div class="landscape-background" style="
                        position: absolute; width: 100%; height: 100%;
                        background: linear-gradient(180deg, #87ceeb 0%, #f0e68c 70%, #2e8b57 100%);
                        border-radius: 20px; overflow: hidden;">
                        
                        <!-- Mountain silhouettes -->
                        <div style="position: absolute; bottom: 30%; left: 0; right: 0; height: 40%;
                                    background: linear-gradient(45deg, #696969, #2f4f4f);
                                    clip-path: polygon(0% 100%, 15% 60%, 30% 80%, 45% 40%, 60% 70%, 75% 30%, 90% 60%, 100% 45%, 100% 100%);"></div>
                        
                        <!-- Clouds -->
                        <div style="position: absolute; top: 15%; left: 20%; width: 80px; height: 30px; 
                                    background: rgba(255,255,255,0.8); border-radius: 50px;"></div>
                        <div style="position: absolute; top: 25%; right: 30%; width: 60px; height: 25px; 
                                    background: rgba(255,255,255,0.6); border-radius: 50px;"></div>
                    </div>
                    
                    <!-- Left cliff -->
                    <div class="left-cliff" style="
                        position: absolute; left: 0; bottom: 0; width: 35%; height: 50%;
                        background: linear-gradient(45deg, #8b4513, #a0522d);
                        clip-path: polygon(0% 100%, 0% 0%, 90% 0%, 100% 100%);"></div>
                    
                    <!-- Right cliff -->
                    <div class="right-cliff" style="
                        position: absolute; right: 0; bottom: 0; width: 35%; height: 50%;
                        background: linear-gradient(-45deg, #8b4513, #a0522d);
                        clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%);"></div>
                    
                    <!-- Broken bridge pieces -->
                    <div class="broken-bridge" style="position: absolute; bottom: 40%; left: 35%; right: 35%; height: 10%;">
                        <!-- Left bridge piece -->
                        <div style="position: absolute; left: 0; bottom: 0; width: 30%; height: 80%; 
                                    background: linear-gradient(90deg, #696969, #2f4f4f); 
                                    border-radius: 5px 0 0 5px; transform: rotate(-15deg) translateY(20px);"></div>
                        <!-- Right bridge piece -->
                        <div style="position: absolute; right: 0; bottom: 0; width: 30%; height: 80%; 
                                    background: linear-gradient(90deg, #2f4f4f, #696969); 
                                    border-radius: 0 5px 5px 0; transform: rotate(15deg) translateY(20px);"></div>
                        
                        <!-- Falling stones -->
                        <div style="position: absolute; left: 45%; bottom: -50px; width: 8px; height: 8px; 
                                    background: #696969; border-radius: 50%; animation: fall1 3s ease-in infinite;"></div>
                        <div style="position: absolute; left: 55%; bottom: -30px; width: 6px; height: 6px; 
                                    background: #2f4f4f; border-radius: 50%; animation: fall2 2.5s ease-in infinite 0.5s;"></div>
                    </div>
                    
                    <!-- Player character -->
                    <div class="player-character" style="
                        position: absolute; left: 15%; bottom: 50%; width: 60px; height: 80px;">
                        
                        <!-- Player body -->
                        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); 
                                    width: 35px; height: 50px; background: #4ecca3; border-radius: 18px 18px 5px 5px;"></div>
                        
                        <!-- Player head -->
                        <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); 
                                    width: 25px; height: 25px; background: #fdbcb4; border-radius: 50%;"></div>
                        
                        <!-- Player eyes (worried) -->
                        <div style="position: absolute; top: 18px; left: 45%; width: 3px; height: 3px; 
                                    background: #1f2937; border-radius: 50%;"></div>
                        <div style="position: absolute; top: 18px; right: 45%; width: 3px; height: 3px; 
                                    background: #1f2937; border-radius: 50%;"></div>
                        
                        <!-- Backpack -->
                        <div style="position: absolute; top: 25px; left: 70%; width: 15px; height: 20px; 
                                    background: #8b4513; border-radius: 3px;"></div>
                    </div>
                    
                    <!-- Magic word particles -->
                    <div class="word-magic" style="position: absolute; left: 40%; right: 40%; top: 30%; bottom: 50%;">
                        <div class="word-particle" style="position: absolute; left: 20%; top: 20%; 
                                                          color: #3498db; font-size: 16px; font-weight: bold;
                                                          animation: wordFloat1 4s ease-in-out infinite;">
                            /t/
                        </div>
                        <div class="word-particle" style="position: absolute; right: 10%; top: 40%; 
                                                          color: #e74c3c; font-size: 16px; font-weight: bold;
                                                          animation: wordFloat2 4s ease-in-out infinite 1s;">
                            /d/
                        </div>
                        <div class="word-particle" style="position: absolute; left: 40%; bottom: 20%; 
                                                          color: #2ecc71; font-size: 16px; font-weight: bold;
                                                          animation: wordFloat3 4s ease-in-out infinite 2s;">
                            /ɪd/
                        </div>
                    </div>
                    
                    <!-- Story text -->
                    <div class="cutscene-text" style="
                        position: absolute; top: 5%; left: 50%; transform: translateX(-50%); 
                        background: rgba(0,0,0,0.85); color: white; padding: 25px; 
                        border-radius: 20px; max-width: 650px; text-align: center; border: 2px solid #4ecca3;">
                        
                        <h3 style="color: #4ecca3; margin-top: 0; font-size: 24px;">🌉 斷橋危機</h3>
                        <p style="font-size: 18px; line-height: 1.5; margin: 15px 0;">
                            你來到了一個深谷邊，橋樑已經斷裂！要想安全通過，必須用正確的發音知識重建石橋。
                        </p>
                        <div style="background: rgba(76, 204, 163, 0.2); padding: 18px; border-radius: 12px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold; color: #4ecca3; font-size: 18px;">
                                🔧 修橋任務：
                            </p>
                            <ul style="text-align: left; padding-left: 25px; margin: 10px 0; font-size: 16px;">
                                <li>在字母網格中找到過去式單詞</li>
                                <li>每種發音類型需要找到 <strong>3個單詞</strong></li>
                                <li>找齊所有單詞就能重建完整的石橋</li>
                                <li>/t/ 音 - 藍色橋段 | /d/ 音 - 紅色橋段 | /ɪd/ 音 - 綠色橋段</li>
                            </ul>
                        </div>
                        <p style="color: #fbbf24; font-size: 16px; margin: 15px 0;">
                            用你的語音知識，建造一座通往成功的橋樑吧！
                        </p>
                        <button onclick="window.wordSearchGame.startMainGame()" style="
                            background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                            padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                            cursor: pointer; margin-top: 25px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);">
                            🔧 開始修橋任務
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
            @keyframes fall1 {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
            }
            @keyframes fall2 {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(180px) rotate(-360deg); opacity: 0; }
            }
            @keyframes wordFloat1 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
                50% { transform: translateY(-20px) rotate(15deg); opacity: 1; }
            }
            @keyframes wordFloat2 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
                50% { transform: translateY(-15px) rotate(-10deg); opacity: 1; }
            }
            @keyframes wordFloat3 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
                50% { transform: translateY(-25px) rotate(20deg); opacity: 1; }
            }
            </style>
        `;
    }
    
    startMainGame() {
        this.setupGameInterface();
        this.resetGame();
        this.generateGrid();
        this.updateDisplay();
    }
    
    setupGameInterface() {
        const gameContainer = document.getElementById('wordSearch');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = `
            <div class="word-search-game" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh; padding: 20px; position: relative;">
                
                <!-- Game Header -->
                <div class="game-header" style="text-align: center; color: white; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 28px;">🌉 石橋修復挑戰</h2>
                    <p style="margin: 10px 0; font-size: 16px;">在網格中找到單詞，修復通往成功的橋樑</p>
                </div>
                
                <!-- Bridge Progress Display -->
                <div class="bridge-progress" style="
                    background: rgba(0,0,0,0.6); padding: 20px; border-radius: 15px; 
                    margin: 20px auto; max-width: 600px; text-align: center;">
                    
                    <h3 style="color: white; margin-top: 0;">橋樑修復進度</h3>
                    <div class="bridge-segments" style="display: flex; justify-content: space-around; margin: 20px 0;">
                        
                        <div class="bridge-segment" data-type="t">
                            <div style="color: #3498db; font-size: 20px; font-weight: bold;">藍色橋段</div>
                            <div style="color: #3498db; font-size: 16px;">/t/ 音</div>
                            <div class="progress-bar" style="
                                width: 120px; height: 15px; background: rgba(52, 152, 219, 0.3); 
                                border-radius: 8px; margin: 8px auto; overflow: hidden;">
                                <div id="progressT" style="
                                    width: 0%; height: 100%; background: #3498db; 
                                    transition: width 0.8s ease; border-radius: 8px;"></div>
                            </div>
                            <div id="countT" style="color: white;">0/3</div>
                        </div>
                        
                        <div class="bridge-segment" data-type="d">
                            <div style="color: #e74c3c; font-size: 20px; font-weight: bold;">紅色橋段</div>
                            <div style="color: #e74c3c; font-size: 16px;">/d/ 音</div>
                            <div class="progress-bar" style="
                                width: 120px; height: 15px; background: rgba(231, 76, 60, 0.3); 
                                border-radius: 8px; margin: 8px auto; overflow: hidden;">
                                <div id="progressD" style="
                                    width: 0%; height: 100%; background: #e74c3c; 
                                    transition: width 0.8s ease; border-radius: 8px;"></div>
                            </div>
                            <div id="countD" style="color: white;">0/3</div>
                        </div>
                        
                        <div class="bridge-segment" data-type="id">
                            <div style="color: #2ecc71; font-size: 20px; font-weight: bold;">綠色橋段</div>
                            <div style="color: #2ecc71; font-size: 16px;">/ɪd/ 音</div>
                            <div class="progress-bar" style="
                                width: 120px; height: 15px; background: rgba(46, 204, 113, 0.3); 
                                border-radius: 8px; margin: 8px auto; overflow: hidden;">
                                <div id="progressId" style="
                                    width: 0%; height: 100%; background: #2ecc71; 
                                    transition: width 0.8s ease; border-radius: 8px;"></div>
                            </div>
                            <div id="countId" style="color: white;">0/3</div>
                        </div>
                    </div>
                    
                    <div style="color: #94a3b8; font-size: 16px; margin: 15px 0;">
                        總分數: <span id="wordSearchScore" style="color: #fbbf24; font-weight: bold;">0</span>
                    </div>
                </div>
                
                <!-- Sound Selection -->
                <div class="sound-selection" style="
                    text-align: center; margin: 20px auto; max-width: 500px;">
                    
                    <div style="color: white; font-size: 18px; margin-bottom: 15px;">
                        選擇要尋找的發音類型：
                    </div>
                    <div class="sound-buttons" style="display: flex; justify-content: center; gap: 15px;">
                        <button class="sound-btn" data-sound="t" style="
                            background: #3498db; color: white; border: none; padding: 15px 25px; 
                            border-radius: 10px; font-size: 18px; cursor: pointer; font-weight: bold;">
                            /t/ 音
                        </button>
                        <button class="sound-btn" data-sound="d" style="
                            background: #e74c3c; color: white; border: none; padding: 15px 25px; 
                            border-radius: 10px; font-size: 18px; cursor: pointer; font-weight: bold;">
                            /d/ 音
                        </button>
                        <button class="sound-btn" data-sound="id" style="
                            background: #2ecc71; color: white; border: none; padding: 15px 25px; 
                            border-radius: 10px; font-size: 18px; cursor: pointer; font-weight: bold;">
                            /ɪd/ 音
                        </button>
                    </div>
                    <div id="selectedSoundDisplay" style="
                        color: #fbbf24; font-size: 16px; margin: 10px 0; font-weight: bold;">
                        請選擇發音類型開始尋找單詞
                    </div>
                </div>
                
                <!-- Word Search Grid -->
                <div class="grid-container" style="
                    display: flex; justify-content: center; margin: 30px auto; max-width: 1200px; gap: 30px;">
                    
                    <!-- Grid -->
                    <div style="flex: 1; max-width: 600px;">
                        <div id="wordGrid" style="
                            display: grid; grid-template-columns: repeat(12, 1fr); gap: 3px; 
                            background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;
                            max-width: 480px; margin: 0 auto;">
                            <!-- Grid will be populated by JavaScript -->
                        </div>
                    </div>
                    
                    <!-- Found Words Lists -->
                    <div class="found-words" style="flex: 1; max-width: 400px;">
                        <div style="background: rgba(0,0,0,0.6); padding: 20px; border-radius: 15px;">
                            <h3 style="color: white; text-align: center; margin-top: 0;">已找到的單詞</h3>
                            
                            <div class="word-list" data-type="t" style="margin: 20px 0;">
                                <h4 style="color: #3498db; margin-bottom: 10px;">/t/ 音 (0/3)</h4>
                                <div id="foundWordsT" class="found-word-items" style="
                                    display: flex; flex-wrap: wrap; gap: 8px; min-height: 40px;">
                                    <!-- Found words will appear here -->
                                </div>
                            </div>
                            
                            <div class="word-list" data-type="d" style="margin: 20px 0;">
                                <h4 style="color: #e74c3c; margin-bottom: 10px;">/d/ 音 (0/3)</h4>
                                <div id="foundWordsD" class="found-word-items" style="
                                    display: flex; flex-wrap: wrap; gap: 8px; min-height: 40px;">
                                    <!-- Found words will appear here -->
                                </div>
                            </div>
                            
                            <div class="word-list" data-type="id" style="margin: 20px 0;">
                                <h4 style="color: #2ecc71; margin-bottom: 10px;">/ɪd/ 音 (0/3)</h4>
                                <div id="foundWordsId" class="found-word-items" style="
                                    display: flex; flex-wrap: wrap; gap: 8px; min-height: 40px;">
                                    <!-- Found words will appear here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Game Controls -->
                <div class="game-controls" style="
                    text-align: center; margin: 20px auto; max-width: 600px; 
                    background: rgba(0,0,0,0.6); padding: 15px; border-radius: 10px;">
                    
                    <div style="color: white; margin: 10px 0;">
                        當前選中: <span id="currentWord" style="color: #4ecca3; font-weight: bold;">無</span>
                    </div>
                    <div style="margin: 15px 0;">
                        <button id="confirmWord" disabled style="
                            background: #2ecc71; color: white; border: none; padding: 12px 25px; 
                            border-radius: 8px; cursor: pointer; margin: 0 10px; font-weight: bold;">
                            ✓ 確認單詞
                        </button>
                        <button id="clearSelection" style="
                            background: #e74c3c; color: white; border: none; padding: 12px 25px; 
                            border-radius: 8px; cursor: pointer; margin: 0 10px; font-weight: bold;">
                            ✗ 清除選擇
                        </button>
                    </div>
                </div>
                
                <!-- Back Button -->
                <button class="back-btn" onclick="window.gameSystem.showGameMenu()" style="
                    position: fixed; bottom: 20px; left: 20px; background: rgba(76, 204, 163, 0.8); 
                    color: white; border: none; padding: 12px 20px; border-radius: 25px; 
                    cursor: pointer; font-weight: bold;">
                    ← 返回選單
                </button>
            </div>
            
            <style>
            .grid-cell {
                aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
                background: rgba(255,255,255,0.8); border-radius: 4px; 
                font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.2s ease;
            }
            
            .grid-cell:hover {
                background: rgba(76, 204, 163, 0.8); color: white; transform: scale(1.1);
            }
            
            .grid-cell.selected {
                background: #4ecca3; color: white; transform: scale(1.05);
            }
            
            .grid-cell.found {
                background: #2ecc71; color: white;
            }
            
            .sound-btn {
                transition: all 0.3s ease;
            }
            
            .sound-btn:hover {
                transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            }
            
            .sound-btn.active {
                transform: scale(1.1); box-shadow: 0 0 20px rgba(255,255,255,0.5);
            }
            
            .found-word-item {
                background: rgba(76, 204, 163, 0.8); color: white; padding: 5px 10px; 
                border-radius: 15px; font-size: 14px; font-weight: bold;
            }
            
            button:disabled {
                opacity: 0.5; cursor: not-allowed;
            }
            </style>
        `;
        
        this.setupGridControls();
    }
    
    setupGridControls() {
        // Sound selection buttons
        const soundButtons = document.querySelectorAll('.sound-btn');
        soundButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sound = e.target.dataset.sound;
                this.selectSound(sound);
            });
        });
        
        // Control buttons
        document.getElementById('confirmWord').addEventListener('click', () => this.confirmWord());
        document.getElementById('clearSelection').addEventListener('click', () => this.clearSelection());
    }
    
    resetGame() {
        this.isGameActive = true;
        this.selectedSound = null;
        this.score = 0;
        this.currentSelection = [];
        this.selectedCells = [];
        this.foundWords = { t: [], d: [], id: [] };
        this.bridgeSegments = { t: false, d: false, id: false };
        
        this.updateDisplay();
    }
    
    generateGrid() {
        this.grid = [];
        
        // Initialize empty grid
        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.gridSize; j++) {
                this.grid[i][j] = '';
            }
        }
        
        // Place words in grid
        const wordsToPlace = [
            ...this.wordDatabase.t.slice(0, 3),
            ...this.wordDatabase.d.slice(0, 3), 
            ...this.wordDatabase.id.slice(0, 3)
        ];
        
        wordsToPlace.forEach(word => {
            this.placeWordInGrid(word);
        });
        
        // Fill empty cells with random letters
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === '') {
                    this.grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
        
        this.renderGrid();
    }
    
    placeWordInGrid(word) {
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1], // horizontal, vertical, diagonal
            [0, -1], [-1, 0], [-1, -1], [-1, 1]
        ];
        
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 50) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const startRow = Math.floor(Math.random() * this.gridSize);
            const startCol = Math.floor(Math.random() * this.gridSize);
            
            if (this.canPlaceWord(word, startRow, startCol, direction)) {
                this.placeWord(word, startRow, startCol, direction);
                placed = true;
            }
            
            attempts++;
        }
    }
    
    canPlaceWord(word, row, col, direction) {
        const [dRow, dCol] = direction;
        
        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            
            if (newRow < 0 || newRow >= this.gridSize || 
                newCol < 0 || newCol >= this.gridSize) {
                return false;
            }
            
            if (this.grid[newRow][newCol] !== '' && 
                this.grid[newRow][newCol] !== word[i].toUpperCase()) {
                return false;
            }
        }
        
        return true;
    }
    
    placeWord(word, row, col, direction) {
        const [dRow, dCol] = direction;
        
        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            this.grid[newRow][newCol] = word[i].toUpperCase();
        }
    }
    
    renderGrid() {
        const gridContainer = document.getElementById('wordGrid');
        if (!gridContainer) return;
        
        gridContainer.innerHTML = '';
        
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = this.grid[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', (e) => {
                    this.toggleCellSelection(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col));
                });
                
                gridContainer.appendChild(cell);
            }
        }
    }
    
    selectSound(sound) {
        this.selectedSound = sound;
        
        // Update button states
        const soundButtons = document.querySelectorAll('.sound-btn');
        soundButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sound === sound);
        });
        
        // Update display
        const soundNames = { t: '/t/ 音', d: '/d/ 音', id: '/ɪd/ 音' };
        const display = document.getElementById('selectedSoundDisplay');
        if (display) {
            display.textContent = `正在尋找: ${soundNames[sound]}`;
        }
        
        this.clearSelection();
    }
    
    toggleCellSelection(row, col) {
        if (!this.selectedSound) {
            alert('請先選擇要尋找的發音類型！');
            return;
        }
        
        const cellIndex = this.selectedCells.findIndex(cell => cell.row === row && cell.col === col);
        
        if (cellIndex >= 0) {
            // Remove from selection
            this.selectedCells.splice(cellIndex, 1);
        } else {
            // Add to selection
            this.selectedCells.push({ row, col });
        }
        
        this.updateGridDisplay();
        this.updateCurrentWord();
    }
    
    updateGridDisplay() {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach((cell, index) => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            cell.classList.remove('selected', 'found');
            
            // Check if selected
            if (this.selectedCells.some(selected => selected.row === row && selected.col === col)) {
                cell.classList.add('selected');
            }
            
            // Check if part of found word
            if (this.isPartOfFoundWord(row, col)) {
                cell.classList.add('found');
            }
        });
    }
    
    isPartOfFoundWord(row, col) {
        // This would check if the cell is part of any found word
        // Implementation depends on how you track found word positions
        return false;
    }
    
    updateCurrentWord() {
        const word = this.getSelectedWord();
        const currentWordDisplay = document.getElementById('currentWord');
        const confirmButton = document.getElementById('confirmWord');
        
        if (currentWordDisplay) {
            currentWordDisplay.textContent = word || '無';
        }
        
        if (confirmButton) {
            confirmButton.disabled = !word || word.length < 3;
        }
    }
    
    getSelectedWord() {
        if (this.selectedCells.length === 0) return '';
        
        // Sort cells to form word (this is simplified)
        this.selectedCells.sort((a, b) => {
            if (a.row === b.row) return a.col - b.col;
            return a.row - b.row;
        });
        
        return this.selectedCells.map(cell => this.grid[cell.row][cell.col]).join('');
    }
    
    confirmWord() {
        const selectedWord = this.getSelectedWord().toLowerCase();
        
        if (!this.selectedSound) {
            alert('請先選擇發音類型！');
            return;
        }
        
        // Check if word is valid for selected sound
        const validWords = this.wordDatabase[this.selectedSound];
        
        if (validWords.includes(selectedWord)) {
            if (!this.foundWords[this.selectedSound].includes(selectedWord)) {
                this.foundWords[this.selectedSound].push(selectedWord);
                this.score += 15;
                
                if (window.SoundSystem) {
                    window.SoundSystem.play('correct');
                }
                
                this.updateDisplay();
                this.checkBridgeProgress();
                
                // Show success message
                this.showWordFoundMessage(selectedWord, this.selectedSound);
            } else {
                alert('這個單詞已經找到了！');
            }
        } else {
            alert(`"${selectedWord}" 不是 ${this.selectedSound} 音的單詞！`);
            
            if (window.SoundSystem) {
                window.SoundSystem.play('wrong');
            }
        }
        
        this.clearSelection();
    }
    
    showWordFoundMessage(word, soundType) {
        const colors = { t: '#3498db', d: '#e74c3c', id: '#2ecc71' };
        const soundNames = { t: '/t/ 音', d: '/d/ 音', id: '/ɪd/ 音' };
        
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: ${colors[soundType]}; color: white; padding: 20px 30px; 
                        border-radius: 15px; font-size: 20px; font-weight: bold; text-align: center; 
                        z-index: 10000; box-shadow: 0 8px 25px rgba(0,0,0,0.3); 
                        animation: wordFound 1.5s ease-out;">
                ✅ 找到單詞！<br>
                <span style="font-size: 24px; margin: 10px 0; display: block;">${word}</span>
                <span style="font-size: 16px;">${soundNames[soundType]}</span>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                document.body.removeChild(messageDiv);
            }
        }, 1500);
        
        // Add CSS for animation
        if (!document.getElementById('wordFoundAnimation')) {
            const style = document.createElement('style');
            style.id = 'wordFoundAnimation';
            style.textContent = `
                @keyframes wordFound {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    clearSelection() {
        this.selectedCells = [];
        this.updateGridDisplay();
        this.updateCurrentWord();
    }
    
    checkBridgeProgress() {
        Object.keys(this.foundWords).forEach(soundType => {
            if (this.foundWords[soundType].length >= this.requiredWords[soundType]) {
                if (!this.bridgeSegments[soundType]) {
                    this.bridgeSegments[soundType] = true;
                    this.showBridgeSegmentComplete(soundType);
                }
            }
        });
        
        // Check if all segments complete
        if (this.bridgeSegments.t && this.bridgeSegments.d && this.bridgeSegments.id) {
            setTimeout(() => {
                this.completeBridge();
            }, 1000);
        }
    }
    
    showBridgeSegmentComplete(soundType) {
        const colors = { t: '#3498db', d: '#e74c3c', id: '#2ecc71' };
        const names = { t: '藍色橋段', d: '紅色橋段', id: '綠色橋段' };
        
        this.gameSystem.showMessage(
            `🌉 ${names[soundType]}修復完成！`, 
            2000
        );
    }
    
    completeBridge() {
        this.isGameActive = false;
        
        // Add completion bonus
        this.score += 30;
        this.gameSystem.updateScore('wordSearch', this.score);
        
        // Show bridge completion animation
        this.showBridgeCompletionCutscene();
    }
    
    showBridgeCompletionCutscene() {
        const container = document.getElementById('wordSearch');
        if (container) {
            container.innerHTML = `
                <div class="bridge-completion" style="
                    background: linear-gradient(180deg, #87ceeb 0%, #4682b4 50%, #2e8b57 100%);
                    min-height: 100vh; display: flex; align-items: center; justify-content: center;
                    position: relative;">
                    
                    <div class="completion-scene" style="width: 90%; max-width: 800px; text-align: center; color: white;">
                        
                        <!-- Completed bridge -->
                        <div style="margin: 30px 0; position: relative;">
                            <div style="font-size: 80px; margin: 20px 0; animation: bridgeGlow 2s ease-in-out infinite;">
                                🌉✨
                            </div>
                            
                            <!-- Bridge visual -->
                            <div style="margin: 30px auto; width: 400px; height: 60px; position: relative;">
                                <div style="background: linear-gradient(90deg, #3498db, #e74c3c, #2ecc71); 
                                           width: 100%; height: 20px; border-radius: 10px; 
                                           position: absolute; top: 50%; transform: translateY(-50%);
                                           box-shadow: 0 5px 15px rgba(0,0,0,0.3);"></div>
                            </div>
                        </div>
                        
                        <h1 style="font-size: 42px; margin: 30px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                            🎉 橋樑修復成功！
                        </h1>
                        
                        <p style="font-size: 24px; margin: 25px 0; line-height: 1.5;">
                            你已經成功重建了通往成功的橋樑！<br>
                            獲得探險者之眼 👁，繼續你的語音冒險之旅！
                        </p>
                        
                        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; margin: 30px auto; max-width: 400px;">
                            <h3>完成統計</h3>
                            <div style="font-size: 18px; margin: 8px 0;">
                                找到的單詞: <strong>${Object.values(this.foundWords).flat().length}</strong>
                            </div>
                            <div style="font-size: 18px; margin: 8px 0;">
                                最終分數: <strong style="color: #fbbf24;">${this.score}</strong>
                            </div>
                        </div>
                        
                        <div style="margin: 40px 0;">
                            <button onclick="window.gameSystem.showGameMenu()" style="
                                background: #4ecca3; color: white; border: none; padding: 18px 35px; 
                                border-radius: 12px; font-size: 18px; cursor: pointer; font-weight: bold;">
                                繼續冒險 →
                            </button>
                        </div>
                    </div>
                    
                    <style>
                    @keyframes bridgeGlow {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    </style>
                </div>
            `;
        }
        
        // Complete the level
        setTimeout(() => {
            this.gameSystem.checkLevelCompletion('wordSearch');
        }, 2000);
    }
    
    updateDisplay() {
        // Update progress bars and counters
        Object.keys(this.foundWords).forEach(soundType => {
            const count = this.foundWords[soundType].length;
            const required = this.requiredWords[soundType];
            const percentage = (count / required) * 100;
            
            // Update progress bar
            const progressBar = document.getElementById(`progress${soundType.charAt(0).toUpperCase() + soundType.slice(1)}`);
            if (progressBar) {
                progressBar.style.width = percentage + '%';
            }
            
            // Update counter
            const counter = document.getElementById(`count${soundType.charAt(0).toUpperCase() + soundType.slice(1)}`);
            if (counter) {
                counter.textContent = `${count}/${required}`;
            }
            
            // Update found words list
            const foundWordsContainer = document.getElementById(`foundWords${soundType.charAt(0).toUpperCase() + soundType.slice(1)}`);
            if (foundWordsContainer) {
                foundWordsContainer.innerHTML = this.foundWords[soundType]
                    .map(word => `<div class="found-word-item">${word}</div>`)
                    .join('');
            }
            
            // Update list headers
            const listHeader = document.querySelector(`[data-type="${soundType}"] h4`);
            if (listHeader) {
                const soundNames = { t: '/t/ 音', d: '/d/ 音', id: '/ɪd/ 音' };
                listHeader.textContent = `${soundNames[soundType]} (${count}/${required})`;
            }
        });
        
        // Update score
        const scoreElement = document.getElementById('wordSearchScore');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }
    
    stopGame() {
        this.isGameActive = false;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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
