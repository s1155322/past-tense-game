/**
 * Word Search Game - Bridge Repair Mission
 * Player needs to find 3 words for each pronunciation type (/t/, /d/, /id/) to repair the broken bridge
 */
class WordSearchGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.selectedSound = null;
        this.selectedCells = [];
        this.currentWord = '';
        this.foundWords = {
            t: [],    // Need 3 words for /t/ sound
            d: [],    // Need 3 words for /d/ sound  
            id: []    // Need 3 words for /id/ sound
        };
        this.score = 0;
        this.isGameActive = false;
        this.isSelecting = false;
        
        // Bridge repair progress
        this.bridgeSegments = {
            t: { completed: false, wordsNeeded: 3 },
            d: { completed: false, wordsNeeded: 3 },
            id: { completed: false, wordsNeeded: 3 }
        };
        
        // Game board properties
        this.gridSize = 12;
        this.grid = [];
        this.wordsToFind = {
            t: ['watched', 'crossed', 'kicked', 'danced', 'jumped', 'helped', 'worked', 'washed'],
            d: ['gained', 'waved', 'played', 'lived', 'filled', 'loved', 'moved', 'called'],
            id: ['guided', 'decided', 'folded', 'needed', 'hated', 'wanted', 'started', 'ended']
        };
        
        // Visual elements for bridge
        this.bridgePosition = { x: 150, y: 300, width: 500, height: 60 };
        this.playerPosition = { x: 50, y: 280 };
        
        this.init();
    }
    
    init() {
        console.log('Initializing Word Search Bridge Repair Game');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Initialize when game starts
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'wordSearch') {
                this.startGame();
            }
        });
        
        // Sound selection buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-mode-button') && e.target.closest('#wordSearch')) {
                this.selectSound(e.target.dataset.sound);
            }
        });
        
        // Game control buttons
        this.bindButton('confirmWord', () => this.confirmWord());
        this.bindButton('clearSelection', () => this.clearSelection());
        this.bindButton('pronounceWord', () => this.pronounceWord());
    }
    
    bindButton(id, callback) {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', callback);
        }
    }
    
    startGame() {
        console.log('Starting Word Search Bridge Repair');
        this.resetGame();
        this.showCutscene();
    }
    
    resetGame() {
        this.selectedSound = null;
        this.selectedCells = [];
        this.currentWord = '';
        this.foundWords = { t: [], d: [], id: [] };
        this.score = 0;
        this.isGameActive = true;
        
        // Reset bridge segments
        Object.keys(this.bridgeSegments).forEach(type => {
            this.bridgeSegments[type].completed = false;
        });
        
        this.generateWordGrid();
    }
    
    showCutscene() {
        const cutscene = document.getElementById('game1Cutscene');
        if (cutscene) {
            cutscene.style.display = 'flex';
            cutscene.innerHTML = `
                <div class="cutscene-content cliff-scene" style="
                    width: 100%; height: 100%; position: relative;
                    background: linear-gradient(to bottom, #87CEEB 0%, #4682B4 50%, #2F4F4F 100%);
                    display: flex; align-items: center; justify-content: center;">
                    
                    <div class="cliff-scene" style="width: 80%; height: 80%; position: relative;">
                        <!-- Left cliff -->
                        <div style="position: absolute; left: 0; bottom: 0; width: 30%; height: 40%; 
                                    background: #8B4513; border-radius: 10px 10px 0 0;"></div>
                        
                        <!-- Right cliff -->
                        <div style="position: absolute; right: 0; bottom: 0; width: 30%; height: 40%; 
                                    background: #8B4513; border-radius: 10px 10px 0 0;"></div>
                        
                        <!-- Broken bridge pieces -->
                        <div style="position: absolute; left: 28%; bottom: 40%; width: 15%; height: 8%; 
                                    background: #708090; transform: rotate(-10deg);"></div>
                        <div style="position: absolute; right: 28%; bottom: 40%; width: 15%; height: 8%; 
                                    background: #708090; transform: rotate(10deg);"></div>
                        
                        <!-- Player character -->
                        <div style="position: absolute; left: 25%; bottom: 45%; width: 40px; height: 60px; 
                                    background: #4ecca3; border-radius: 20px 20px 0 0;"></div>
                        
                        <!-- Gap in the middle -->
                        <div style="position: absolute; left: 30%; bottom: 20%; right: 30%; height: 40%; 
                                    background: radial-gradient(circle, rgba(70,130,180,0.5), transparent);
                                    border-radius: 50%;"></div>
                    </div>
                    
                    <div class="cutscene-text" style="position: absolute; top: 20px; left: 50%; 
                                                      transform: translateX(-50%); 
                                                      background: rgba(0,0,0,0.8); color: white; padding: 20px; 
                                                      border-radius: 15px; max-width: 500px; text-align: center;">
                        <h3>🌉 斷橋修復任務</h3>
                        <p>前方的石橋已經斷裂！你需要找出正確的過去式單詞來修復橋樑。</p>
                        <p><strong>任務目標：</strong></p>
                        <ul style="text-align: left; padding-left: 20px;">
                            <li>/t/ 音類型：找出 3 個單詞</li>
                            <li>/d/ 音類型：找出 3 個單詞</li> 
                            <li>/ɪd/ 音類型：找出 3 個單詞</li>
                        </ul>
                        <p>每完成一個類型，橋的一段就會修復好！</p>
                        <button onclick="window.wordSearchGame.startMainGame()" 
                                style="background: #4ecca3; color: white; border: none; 
                                       padding: 15px 30px; border-radius: 10px; font-size: 16px; 
                                       font-weight: bold; cursor: pointer; margin-top: 15px;">
                            開始修復橋樑 🔧
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    startMainGame() {
        // Hide cutscene and show game interface
        const cutscene = document.getElementById('game1Cutscene');
        const gameInterface = document.querySelector('#wordSearch .game-interface');
        
        if (cutscene) cutscene.style.display = 'none';
        if (gameInterface) gameInterface.style.display = 'block';
        
        this.setupGameInterface();
        this.updateBridgeVisual();
    }
    
    setupGameInterface() {
        const wordSearchContainer = document.getElementById('wordSearch');
        if (!wordSearchContainer) return;
        
        // Create game interface if doesn't exist
        let gameInterface = wordSearchContainer.querySelector('.game-interface');
        if (!gameInterface) {
            gameInterface = document.createElement('div');
            gameInterface.className = 'game-interface';
            gameInterface.innerHTML = this.createGameInterfaceHTML();
            wordSearchContainer.appendChild(gameInterface);
        }
        
        gameInterface.style.display = 'block';
        this.generateWordGrid();
        this.createVisualGrid();
        this.updateUI();
        this.updateBridgeVisual();
    }
    
    createGameInterfaceHTML() {
        return `
            <!-- Bridge Visual -->
            <div class="bridge-container" style="background: linear-gradient(to bottom, #87CEEB 0%, #4682B4 100%); 
                                                   height: 200px; position: relative; margin: 20px 0; 
                                                   border-radius: 15px; overflow: hidden;">
                <canvas id="bridgeCanvas" width="800" height="200" style="width: 100%; height: 100%;"></canvas>
            </div>
            
            <!-- Progress Display -->
            <div class="bridge-progress" style="display: flex; justify-content: space-around; margin: 20px 0; 
                                                 background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <div class="segment-progress" data-type="t">
                    <h4>/t/ 音段</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%; background: #3498db; height: 10px; border-radius: 5px; transition: width 0.5s;"></div>
                    </div>
                    <p>進度: <span class="word-count">0</span>/3</p>
                </div>
                <div class="segment-progress" data-type="d">
                    <h4>/d/ 音段</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%; background: #e74c3c; height: 10px; border-radius: 5px; transition: width 0.5s;"></div>
                    </div>
                    <p>進度: <span class="word-count">0</span>/3</p>
                </div>
                <div class="segment-progress" data-type="id">
                    <h4>/ɪd/ 音段</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%; background: #2ecc71; height: 10px; border-radius: 5px; transition: width 0.5s;"></div>
                    </div>
                    <p>進度: <span class="word-count">0</span>/3</p>
                </div>
            </div>
            
            <!-- Sound Selection -->
            <div class="sound-selection" style="text-align: center; margin: 20px 0; padding: 20px; 
                                                background: rgba(255,255,255,0.1); border-radius: 15px;">
                <h3>選擇發音類型來修復對應的橋段：</h3>
                <div class="sound-buttons" style="display: flex; justify-content: center; gap: 15px; margin: 20px 0;">
                    <button class="color-mode-button" data-sound="t" style="background: #3498db; color: white; border: none; 
                                                                           padding: 15px 25px; border-radius: 10px; font-size: 18px; 
                                                                           font-weight: bold; cursor: pointer; transition: all 0.3s;">
                        /t/ 音 (無聲音)
                    </button>
                    <button class="color-mode-button" data-sound="d" style="background: #e74c3c; color: white; border: none; 
                                                                           padding: 15px 25px; border-radius: 10px; font-size: 18px; 
                                                                           font-weight: bold; cursor: pointer; transition: all 0.3s;">
                        /d/ 音 (有聲音)
                    </button>
                    <button class="color-mode-button" data-sound="id" style="background: #2ecc71; color: white; border: none; 
                                                                            padding: 15px 25px; border-radius: 10px; font-size: 18px; 
                                                                            font-weight: bold; cursor: pointer; transition: all 0.3s;">
                        /ɪd/ 音 (額外音節)
                    </button>
                </div>
                <div class="selected-sound" style="font-size: 18px; color: white; font-weight: bold;">
                    當前選擇: <span id="selectedSound">請選擇發音類型</span>
                </div>
            </div>
            
            <!-- Game Board -->
            <div class="game-board-container" style="text-align: center;">
                <div id="wordSearchBoard" style="display: inline-block; margin: 20px auto;"></div>
            </div>
            
            <!-- Current Words to Find -->
            <div class="current-words" style="text-align: center; margin: 20px 0; padding: 15px; 
                                              background: rgba(255,255,255,0.1); border-radius: 10px;">
                <h4>當前需要尋找的單詞:</h4>
                <div id="currentWordsDisplay" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                    <!-- Words will be shown here -->
                </div>
            </div>
            
            <!-- Game Controls -->
            <div class="game-controls" style="text-align: center; margin: 20px 0; padding: 20px; 
                                              background: rgba(255,255,255,0.1); border-radius: 15px;">
                <div class="selected-word-display" style="font-size: 20px; margin-bottom: 15px; color: white;">
                    選中的單詞: <span id="selectedWord" style="font-weight: bold; color: #4ecca3;">-</span>
                </div>
                <div class="control-buttons" style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                    <button id="confirmWord" class="control-btn" style="background: #2ecc71; color: white; border: none; 
                                                                       padding: 12px 24px; border-radius: 8px; cursor: pointer; 
                                                                       font-weight: bold; font-size: 16px;">
                        ✅ 確認單詞
                    </button>
                    <button id="clearSelection" class="control-btn" style="background: #e74c3c; color: white; border: none; 
                                                                         padding: 12px 24px; border-radius: 8px; cursor: pointer; 
                                                                         font-weight: bold; font-size: 16px;">
                        🗑️ 清除選擇
                    </button>
                    <button id="pronounceWord" class="control-btn" style="background: #3498db; color: white; border: none; 
                                                                        padding: 12px 24px; border-radius: 8px; cursor: pointer; 
                                                                        font-weight: bold; font-size: 16px;">
                        🔊 發音
                    </button>
                </div>
            </div>
            
            <button class="back-btn" onclick="window.gameSystem?.showGameMenu()" 
                    style="position: fixed; bottom: 20px; right: 20px; background: #4ecca3; color: white; 
                           border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer; font-weight: bold;">
                ← 返回選單
            </button>
        `;
    }
    
    generateWordGrid() {
        // Initialize empty grid
        this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(''));
        
        // Place words for all types in grid
        Object.keys(this.wordsToFind).forEach(soundType => {
            this.wordsToFind[soundType].forEach(word => {
                this.placeWordInGrid(word);
            });
        });
        
        // Fill remaining cells with random letters
        this.fillEmptyCells();
    }
    
    placeWordInGrid(word) {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!placed && attempts < maxAttempts) {
            const direction = Math.random() < 0.7 ? 'horizontal' : 'vertical'; // Prefer horizontal
            const row = Math.floor(Math.random() * this.gridSize);
            const col = Math.floor(Math.random() * this.gridSize);
            
            if (this.canPlaceWord(word, row, col, direction)) {
                this.insertWord(word, row, col, direction);
                placed = true;
            }
            attempts++;
        }
        
        if (!placed) {
            console.warn(`Could not place word: ${word}`);
        }
    }
    
    canPlaceWord(word, row, col, direction) {
        if (direction === 'horizontal') {
            if (col + word.length > this.gridSize) return false;
            for (let i = 0; i < word.length; i++) {
                const existingChar = this.grid[row][col + i];
                if (existingChar && existingChar !== word[i]) {
                    return false;
                }
            }
        } else {
            if (row + word.length > this.gridSize) return false;
            for (let i = 0; i < word.length; i++) {
                const existingChar = this.grid[row + i][col];
                if (existingChar && existingChar !== word[i]) {
                    return false;
                }
            }
        }
        return true;
    }
    
    insertWord(word, row, col, direction) {
        if (direction === 'horizontal') {
            for (let i = 0; i < word.length; i++) {
                this.grid[row][col + i] = word[i];
            }
        } else {
            for (let i = 0; i < word.length; i++) {
                this.grid[row + i][col] = word[i];
            }
        }
    }
    
    fillEmptyCells() {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (!this.grid[row][col]) {
                    this.grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    }
    
    createVisualGrid() {
        const boardElement = document.getElementById('wordSearchBoard');
        if (!boardElement) return;
        
        boardElement.innerHTML = '';
        boardElement.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${this.gridSize}, 1fr);
            gap: 2px;
            max-width: 600px;
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
        `;
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = this.grid[row][col].toUpperCase();
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.style.cssText = `
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.9);
                    color: #2d3142;
                    font-weight: bold;
                    font-size: 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    user-select: none;
                `;
                
                // Add event handlers
                cell.addEventListener('mousedown', (e) => this.startSelection(e));
                cell.addEventListener('mouseenter', (e) => this.extendSelection(e));
                cell.addEventListener('mouseup', () => this.endSelection());
                
                boardElement.appendChild(cell);
            }
        }
    }
    
    selectSound(sound) {
        if (!this.isGameActive) return;
        
        this.selectedSound = sound;
        
        // Update button appearance
        const soundButtons = document.querySelectorAll('.color-mode-button');
        soundButtons.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.sound === sound);
            if (btn.dataset.sound === sound) {
                btn.style.transform = 'scale(1.1)';
                btn.style.boxShadow = '0 0 20px rgba(255,255,255,0.5)';
            } else {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = 'none';
            }
        });
        
        // Update UI
        const selectedSoundDisplay = document.getElementById('selectedSound');
        if (selectedSoundDisplay) {
            const soundNames = { t: '/t/ 音 (無聲音)', d: '/d/ 音 (有聲音)', id: '/ɪd/ 音 (額外音節)' };
            selectedSoundDisplay.textContent = soundNames[sound];
        }
        
        // Show current target words
        this.updateCurrentWordsDisplay();
        
        // Play sound
        if (window.SoundSystem) {
            window.SoundSystem.play('click');
        }
    }
    
    updateCurrentWordsDisplay() {
        const display = document.getElementById('currentWordsDisplay');
        if (!display || !this.selectedSound) return;
        
        display.innerHTML = '';
        const targetWords = this.wordsToFind[this.selectedSound];
        const foundWords = this.foundWords[this.selectedSound];
        const remainingWords = targetWords.filter(word => !foundWords.includes(word));
        
        // Show only the first 3 remaining words (since we only need 3)
        remainingWords.slice(0, 3).forEach(word => {
            const wordItem = document.createElement('div');
            wordItem.textContent = word;
            wordItem.style.cssText = `
                background: rgba(255,255,255,0.8);
                color: #2d3142;
                padding: 8px 15px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 16px;
            `;
            display.appendChild(wordItem);
        });
        
        if (remainingWords.length === 0) {
            const completedMsg = document.createElement('div');
            completedMsg.textContent = '✅ 此類型已完成！';
            completedMsg.style.cssText = `
                background: #2ecc71;
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-weight: bold;
            `;
            display.appendChild(completedMsg);
        }
    }
    
    startSelection(e) {
        if (!this.selectedSound) {
            this.gameSystem.showMessage('請先選擇發音類型！', 2000);
            return;
        }
        
        this.clearSelection();
        this.isSelecting = true;
        this.addCellToSelection(e.target);
    }
    
    extendSelection(e) {
        if (this.isSelecting) {
            this.addCellToSelection(e.target);
        }
    }
    
    endSelection() {
        this.isSelecting = false;
        this.updateCurrentWord();
    }
    
    addCellToSelection(cell) {
        if (!cell.classList.contains('grid-cell')) return;
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        // Check if cell is already selected
        const existing = this.selectedCells.find(c => c.row === row && c.col === col);
        if (existing) return;
        
        this.selectedCells.push({ row, col, element: cell });
        cell.style.background = '#4ecca3';
        cell.style.color = 'white';
        cell.style.transform = 'scale(1.1)';
    }
    
    updateCurrentWord() {
        this.currentWord = this.selectedCells
            .map(cell => this.grid[cell.row][cell.col])
            .join('').toLowerCase();
            
        const selectedWordDisplay = document.getElementById('selectedWord');
        if (selectedWordDisplay) {
            selectedWordDisplay.textContent = this.currentWord;
        }
    }
    
    confirmWord() {
        if (!this.currentWord || !this.selectedSound) return;
        
        const targetWords = this.wordsToFind[this.selectedSound];
        const foundWordsForType = this.foundWords[this.selectedSound];
        
        if (targetWords.includes(this.currentWord) && !foundWordsForType.includes(this.currentWord)) {
            // Check if we still need words for this type
            if (foundWordsForType.length < 3) {
                foundWordsForType.push(this.currentWord);
                this.score += 15;
                this.gameSystem.updateScore('wordSearch', 15, false);
                
                // Mark found cells
                this.selectedCells.forEach(cell => {
                    cell.element.style.background = '#2ecc71';
                    cell.element.classList.add('found-word');
                });
                
                // Play success sound and pronunciation
                if (window.SoundSystem) {
                    window.SoundSystem.play('correct');
                    setTimeout(() => this.pronounceWord(), 500);
                }
                
                this.gameSystem.showMessage(`✅ 找到: ${this.currentWord}! (+15分)`, 2500);
                
                // Check if this type is completed
                if (foundWordsForType.length === 3) {
                    this.completeBridgeSegment(this.selectedSound);
                }
                
                this.updateUI();
                this.checkGameCompletion();
            } else {
                this.gameSystem.showMessage('此類型已經完成了！請選擇其他類型。', 2000);
            }
        } else if (foundWordsForType.includes(this.currentWord)) {
            this.gameSystem.showMessage('這個單詞已經找到了！', 2000);
        } else {
            this.gameSystem.showMessage('不是目標單詞或發音類型錯誤！', 2000);
            if (window.SoundSystem) {
                window.SoundSystem.play('wrong');
            }
        }
        
        this.clearSelection();
    }
    
    completeBridgeSegment(soundType) {
        this.bridgeSegments[soundType].completed = true;
        
        const typeNames = {
            t: '/t/ 音段',
            d: '/d/ 音段', 
            id: '/ɪd/ 音段'
        };
        
        this.gameSystem.showMessage(`🌉 ${typeNames[soundType]} 修復完成！橋樑的一段已經建好了！`, 4000);
        
        // Update bridge visual
        this.updateBridgeVisual();
        
        // Play special completion sound
        if (window.SoundSystem) {
            setTimeout(() => window.SoundSystem.play('correct', 1.5), 500);
        }
    }
    
    updateBridgeVisual() {
        const canvas = document.getElementById('bridgeCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4682B4');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw cliff edges
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 120, 150, 80);
        ctx.fillRect(650, 120, 150, 80);
        
        // Draw player
        ctx.fillStyle = '#4ecca3';
        ctx.fillRect(120, 100, 25, 40);
        ctx.fillStyle = '#fdbcb4';
        ctx.beginPath();
        ctx.arc(132, 90, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bridge segments
        const segmentWidth = 150;
        const bridgeY = 140;
        const segments = ['t', 'd', 'id'];
        
        segments.forEach((segment, index) => {
            const x = 150 + (index * segmentWidth);
            const isCompleted = this.bridgeSegments[segment].completed;
            
            if (isCompleted) {
                // Draw solid bridge segment
                ctx.fillStyle = '#708090';
                ctx.fillRect(x, bridgeY, segmentWidth, 20);
                ctx.strokeStyle = '#2F4F4F';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, bridgeY, segmentWidth, 20);
                
                // Add sparkles
                for (let i = 0; i < 5; i++) {
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(x + 20 + (i * 25), bridgeY + 10, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                // Draw broken/incomplete segment
                ctx.strokeStyle = 'rgba(112, 128, 144, 0.5)';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 10]);
                ctx.strokeRect(x, bridgeY, segmentWidth, 20);
                ctx.setLineDash([]);
            }
        });
        
        // Draw gap indicator if bridge not complete
        if (!this.isGameComplete()) {
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('修復中...', canvas.width / 2, bridgeY - 10);
        }
    }
    
    clearSelection() {
        this.selectedCells.forEach(cell => {
            if (!cell.element.classList.contains('found-word')) {
                cell.element.style.background = 'rgba(255, 255, 255, 0.9)';
                cell.element.style.color = '#2d3142';
                cell.element.style.transform = 'scale(1)';
            }
        });
        
        this.selectedCells = [];
        this.currentWord = '';
        
        const selectedWordDisplay = document.getElementById('selectedWord');
        if (selectedWordDisplay) {
            selectedWordDisplay.textContent = '-';
        }
    }
    
    pronounceWord() {
        if (this.currentWord && window.SoundSystem) {
            window.SoundSystem.speakWord(this.currentWord);
        }
    }
    
    updateUI() {
        // Update progress bars
        Object.keys(this.bridgeSegments).forEach(type => {
            const progressElement = document.querySelector(`[data-type="${type}"] .progress-fill`);
            const countElement = document.querySelector(`[data-type="${type}"] .word-count`);
            
            if (progressElement && countElement) {
                const found = this.foundWords[type].length;
                const needed = this.bridgeSegments[type].wordsNeeded;
                const percentage = (found / needed) * 100;
                
                progressElement.style.width = percentage + '%';
                countElement.textContent = found;
                
                // Change color when completed
                if (found >= needed) {
                    progressElement.style.background = '#2ecc71';
                    countElement.parentElement.style.color = '#2ecc71';
                }
            }
        });
        
        // Update current words display
        this.updateCurrentWordsDisplay();
        
        // Update bridge visual
        this.updateBridgeVisual();
    }
    
    isGameComplete() {
        return Object.keys(this.bridgeSegments).every(type => 
            this.bridgeSegments[type].completed
        );
    }
    
    checkGameCompletion() {
        if (this.isGameComplete()) {
            this.completeGame();
        }
    }
    
    completeGame() {
        this.isGameActive = false;
        
        // Show victory message
        const message = '🎉 橋樑修復完成！你現在可以安全通過了！<br>恭喜完成單詞搜索任務！';
        this.gameSystem.showMessage(message, 5000);
        
        // Animate complete bridge
        this.animateVictory();
        
        // Complete the level
        setTimeout(() => {
            this.gameSystem.checkLevelCompletion('wordSearch');
        }, 3000);
    }
    
    animateVictory() {
        const canvas = document.getElementById('bridgeCanvas');
        if (!canvas) return;
        
        let frame = 0;
        const animate = () => {
            this.updateBridgeVisual();
            
            const ctx = canvas.getContext('2d');
            
            // Add victory sparkles
            for (let i = 0; i < 10; i++) {
                const x = 150 + Math.random() * 450;
                const y = 120 + Math.random() * 40;
                const size = 2 + Math.random() * 3;
                
                ctx.fillStyle = frame % 20 < 10 ? '#FFD700' : '#FFF';
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Move player across bridge
            const playerX = 120 + (frame * 3);
            if (playerX < 700) {
                ctx.fillStyle = '#4ecca3';
                ctx.fillRect(playerX, 100, 25, 40);
                ctx.fillStyle = '#fdbcb4';
                ctx.beginPath();
                ctx.arc(playerX + 12, 90, 12, 0, Math.PI * 2);
                ctx.fill();
            }
            
            frame++;
            if (frame < 200) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    stopGame() {
        this.isGameActive = false;
        this.clearSelection();
        
        const canvas = document.getElementById('bridgeCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checkGameSystem = () => {
        if (window.gameSystem) {
            window.wordSearchGame = new WordSearchGame(window.gameSystem);
            console.log('Word Search Bridge Repair game initialized');
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
