/**
 * Falling Words Game - Simple Fixed Version
 * Player catches falling words with keyboard controls
 */
class FallingWordsGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.canvas = null;
        this.ctx = null;
        this.isGameActive = false;
        this.score = 0;
        this.lives = 3;
        
        // Game objects
        this.fallingWords = [];
        this.player = { x: 375, y: 520, width: 50, height: 50 };
        
        // Timing
        this.lastWordTime = 0;
        this.wordInterval = 2000;
        
        // Words for each type
        this.wordsByType = {
            t: ['watched', 'crossed', 'kicked', 'danced', 'jumped'],
            d: ['played', 'lived', 'moved', 'called', 'loved'],
            id: ['wanted', 'needed', 'decided', 'started', 'ended']
        };
        
        this.init();
    }
    
    init() {
        console.log('Initializing Falling Words Game');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'fallingWords') {
                this.startGame();
            }
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    startGame() {
        this.showCutscene();
    }
    
    showCutscene() {
        const gameContainer = document.getElementById('fallingWords');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = `
            <div class="falling-cutscene" style="
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000;
                background: linear-gradient(180deg, #1e293b 0%, #475569 100%);
                display: flex; align-items: center; justify-content: center;">
                
                <div class="cutscene-content" style="text-align: center; color: white; max-width: 600px;">
                    <h2 style="font-size: 36px; margin-bottom: 20px;">⚔️ 石塊巫師挑戰</h2>
                    <p style="font-size: 18px; margin-bottom: 20px;">
                        石塊巫師正在召喚魔法石塊！使用鍵盤躲避並收集正確的單詞！
                    </p>
                    <div style="background: rgba(0,0,0,0.5); padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h4>操作方法:</h4>
                        <p>← → 方向鍵: 左右移動</p>
                        <p>空白鍵: 收集單詞</p>
                    </div>
                    <button onclick="window.fallingWordsGame.startMainGame()" style="
                        background: #f59e0b; color: white; border: none; padding: 15px 30px; 
                        border-radius: 10px; font-size: 18px; cursor: pointer;">
                        開始挑戰
                    </button>
                </div>
            </div>
        `;
    }
    
    startMainGame() {
        this.setupGameInterface();
        this.resetGame();
        this.gameLoop();
    }
    
    setupGameInterface() {
        const gameContainer = document.getElementById('fallingWords');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = `
            <div class="falling-game" style="
                background: linear-gradient(180deg, #1e293b 0%, #475569 100%);
                min-height: 100vh; position: relative;">
                
                <div class="game-header" style="
                    position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
                    text-align: center; color: white; z-index: 100;">
                    <h2>⚔️ 石塊收集挑戰</h2>
                </div>
                
                <div class="game-stats" style="
                    position: absolute; top: 20px; left: 20px; z-index: 100; 
                    background: rgba(0,0,0,0.7); padding: 15px; border-radius: 10px; color: white;">
                    <div>分數: <span id="fallingScore">0</span></div>
                    <div>生命: <span id="fallingLives">3</span></div>
                </div>
                
                <canvas id="fallingWordsCanvas" width="800" height="600" style="
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    border: 2px solid rgba(255,255,255,0.3); border-radius: 10px; 
                    background: radial-gradient(circle, #374151, #1f2937);">
                </canvas>
                
                <button class="back-btn" onclick="window.gameSystem.showGameMenu()" style="
                    position: absolute; bottom: 20px; left: 20px; background: #4ecca3; 
                    color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer;">
                    ← 返回選單
                </button>
            </div>
        `;
        
        this.canvas = document.getElementById('fallingWordsCanvas');
        this.ctx = this.canvas.getContext('2d');
    }
    
    resetGame() {
        this.isGameActive = true;
        this.score = 0;
        this.lives = 3;
        this.fallingWords = [];
        this.player.x = 375;
        this.lastWordTime = 0;
        
        this.updateUI();
    }
    
    gameLoop() {
        if (!this.isGameActive) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        const currentTime = Date.now();
        
        // Spawn new words
        if (currentTime - this.lastWordTime > this.wordInterval) {
            this.spawnWord();
            this.lastWordTime = currentTime;
        }
        
        // Update falling words
        this.fallingWords = this.fallingWords.filter(word => {
            word.y += word.speed;
            
            // Check if word hit bottom
            if (word.y > this.canvas.height) {
                this.loseLife();
                return false;
            }
            
            return true;
        });
    }
    
    spawnWord() {
        const types = ['t', 'd', 'id'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const words = this.wordsByType[randomType];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        const colors = { t: '#3b82f6', d: '#ef4444', id: '#10b981' };
        
        const word = {
            x: Math.random() * (this.canvas.width - 100),
            y: -30,
            width: 80,
            height: 30,
            speed: 2 + Math.random() * 2,
            type: randomType,
            word: randomWord,
            color: colors[randomType]
        };
        
        this.fallingWords.push(word);
    }
    
    draw() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw falling words
        this.fallingWords.forEach(wordObj => this.drawWord(wordObj));
        
        // Draw player
        this.drawPlayer();
    }
    
    drawWord(wordObj) {
        // Draw word background
        this.ctx.fillStyle = wordObj.color;
        this.ctx.fillRect(wordObj.x, wordObj.y, wordObj.width, wordObj.height);
        
        // Draw word text
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(wordObj.word, wordObj.x + wordObj.width/2, wordObj.y + wordObj.height/2 + 5);
    }
    
    drawPlayer() {
        // Player body
        this.ctx.fillStyle = '#4ecca3';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Player indicator
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('↑', this.player.x + this.player.width/2, this.player.y + this.player.height/2 + 7);
    }
    
    handleKeyDown(e) {
        if (!this.isGameActive) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                this.player.x = Math.max(0, this.player.x - 30);
                break;
            case 'ArrowRight':
                this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + 30);
                break;
            case ' ':
                this.collectWords();
                break;
        }
    }
    
    collectWords() {
        const collectRadius = 60;
        const playerCenterX = this.player.x + this.player.width/2;
        const playerCenterY = this.player.y + this.player.height/2;
        
        this.fallingWords = this.fallingWords.filter(wordObj => {
            const wordCenterX = wordObj.x + wordObj.width/2;
            const wordCenterY = wordObj.y + wordObj.height/2;
            const distance = Math.sqrt(
                Math.pow(wordCenterX - playerCenterX, 2) + 
                Math.pow(wordCenterY - playerCenterY, 2)
            );
            
            if (distance < collectRadius) {
                // Collected a word
                this.score += 10;
                this.gameSystem.updateScore('fallingWords', 10, false);
                
                if (window.SoundSystem) {
                    window.SoundSystem.play('correct');
                }
                
                this.updateUI();
                return false; // Remove word
            }
            
            return true; // Keep word
        });
    }
    
    loseLife() {
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    updateUI() {
        const scoreElement = document.getElementById('fallingScore');
        const livesElement = document.getElementById('fallingLives');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (livesElement) livesElement.textContent = this.lives;
    }
    
    gameOver() {
        this.isGameActive = false;
        
        const message = `遊戲結束！最終分數: ${this.score}`;
        this.gameSystem.showMessage(message, 3000);
        
        setTimeout(() => {
            this.gameSystem.checkLevelCompletion('fallingWords');
        }, 2000);
    }
    
    stopGame() {
        this.isGameActive = false;
        this.fallingWords = [];
        
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checkGameSystem = () => {
        if (window.gameSystem) {
            window.fallingWordsGame = new FallingWordsGame(window.gameSystem);
            console.log('Falling Words game initialized');
        } else {
            setTimeout(checkGameSystem, 100);
        }
    };
    checkGameSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FallingWordsGame;
}
