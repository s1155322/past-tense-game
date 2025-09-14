/**
 * Falling Words Game - Stone Slashing with Different Evil Wizard
 * Player slashes falling pronunciation stones with colored swords
 */
class FallingWordsGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.canvas = null;
        this.ctx = null;
        this.isGameActive = false;
        this.selectedSound = null;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Game objects
        this.fallingStones = [];
        this.player = { x: 400, y: 500, width: 50, height: 60 };
        this.swords = { t: false, d: false, id: false }; // Active swords
        
        // Timing
        this.lastStoneTime = 0;
        this.stoneInterval = 2000; // milliseconds
        this.gameSpeed = 1;
        
        // Word database for falling stones
        this.stoneWords = {
            t: ['watched', 'crossed', 'kicked', 'danced', 'jumped', 'helped', 'worked'],
            d: ['played', 'lived', 'moved', 'called', 'loved', 'saved', 'smiled'],
            id: ['wanted', 'needed', 'decided', 'started', 'ended', 'visited', 'created']
        };
        
        this.init();
    }
    
    init() {
        console.log('Initializing Falling Words Stone Slashing Game');
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
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    startGame() {
        this.showCutscene();
    }
    
    showCutscene() {
        const gameContainer = document.getElementById('fallingWords');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = '';
        
        // Create stone slashing cutscene with different evil wizard
        gameContainer.innerHTML = `
            <div class="stone-slashing-cutscene" style="
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000;
                background: linear-gradient(180deg, #1e293b 0%, #475569 50%, #64748b 100%);
                display: flex; align-items: center; justify-content: center;">
                
                <div class="cave-scene" style="width: 90%; max-width: 1000px; position: relative;">
                    
                    <!-- Cave background elements -->
                    <div class="cave-walls" style="
                        position: absolute; width: 100%; height: 100%;
                        background: radial-gradient(circle at center, #374151 0%, #1f2937 70%, #111827 100%);
                        border-radius: 20px;">
                        
                        <!-- Stalactites -->
                        <div style="position: absolute; top: 0; left: 20%; width: 0; height: 0; 
                                    border-left: 20px solid transparent; border-right: 20px solid transparent; 
                                    border-top: 50px solid #6b7280;"></div>
                        <div style="position: absolute; top: 0; left: 60%; width: 0; height: 0; 
                                    border-left: 15px solid transparent; border-right: 15px solid transparent; 
                                    border-top: 40px solid #6b7280;"></div>
                        <div style="position: absolute; top: 0; right: 25%; width: 0; height: 0; 
                                    border-left: 25px solid transparent; border-right: 25px solid transparent; 
                                    border-top: 60px solid #6b7280;"></div>
                    </div>
                    
                    <!-- Stone Summoning Wizard (Game 2 version - different from Game 3) -->
                    <div class="stone-wizard" style="
                        position: absolute; right: 12%; top: 25%; width: 130px; height: 180px;">
                        
                        <!-- Wizard body (earth/stone colored) -->
                        <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); 
                                    width: 80px; height: 120px; background: #78716c; 
                                    border-radius: 40px 40px 15px 15px; border: 2px solid #57534e;"></div>
                        
                        <!-- Wizard head (stone-grey skin) -->
                        <div style="position: absolute; top: 25px; left: 50%; transform: translateX(-50%); 
                                    width: 65px; height: 65px; background: #d6d3d1; border-radius: 50%;
                                    border: 2px solid #a8a29e;"></div>
                        
                        <!-- Glowing earth-magic eyes -->
                        <div style="position: absolute; top: 45px; left: 38%; width: 8px; height: 8px; 
                                    background: #f59e0b; border-radius: 50%; box-shadow: 0 0 12px #f59e0b;"></div>
                        <div style="position: absolute; top: 45px; right: 38%; width: 8px; height: 8px; 
                                    background: #f59e0b; border-radius: 50%; box-shadow: 0 0 12px #f59e0b;"></div>
                        
                        <!-- Stone wizard beard -->
                        <div style="position: absolute; top: 60px; left: 50%; transform: translateX(-50%); 
                                    width: 30px; height: 25px; background: #9ca3af; border-radius: 0 0 15px 15px;"></div>
                        
                        <!-- Earth wizard hat -->
                        <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); 
                                    width: 0; height: 0; border-left: 45px solid transparent; 
                                    border-right: 45px solid transparent; border-bottom: 65px solid #44403c;"></div>
                        
                        <!-- Stone/Earth staff -->
                        <div style="position: absolute; right: -20px; top: 65px; width: 5px; height: 110px; 
                                    background: linear-gradient(180deg, #78716c, #44403c); border-radius: 3px;"></div>
                        <div style="position: absolute; right: -32px; top: 50px; width: 30px; height: 20px; 
                                    background: #78716c; border-radius: 15px 15px 5px 5px;"></div>
                        <div style="position: absolute; right: -27px; top: 45px; width: 20px; height: 20px; 
                                    background: radial-gradient(circle, #f59e0b, #d97706); border-radius: 50%; 
                                    animation: earthMagic 2.5s ease-in-out infinite; 
                                    box-shadow: 0 0 25px #f59e0b;"></div>
                    </div>
                    
                    <!-- Warrior Player with Swords -->
                    <div class="warrior-player" style="
                        position: absolute; left: 18%; bottom: 25%; width: 90px; height: 130px;">
                        
                        <!-- Warrior body -->
                        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); 
                                    width: 55px; height: 85px; background: #7c3aed; border-radius: 28px 28px 10px 10px;
                                    border: 2px solid #6d28d9;"></div>
                        
                        <!-- Warrior head -->
                        <div style="position: absolute; top: 15px; left: 50%; transform: translateX(-50%); 
                                    width: 45px; height: 45px; background: #fdbcb4; border-radius: 50%;"></div>
                        
                        <!-- Determined eyes -->
                        <div style="position: absolute; top: 28px; left: 38%; width: 4px; height: 4px; 
                                    background: #1f2937; border-radius: 50%;"></div>
                        <div style="position: absolute; top: 28px; right: 38%; width: 4px; height: 4px; 
                                    background: #1f2937; border-radius: 50%;"></div>
                        
                        <!-- Three colored swords -->
                        <div class="sword-t" style="position: absolute; left: -15px; top: 45px; width: 3px; height: 35px; 
                                                    background: #3b82f6; border-radius: 2px; transform: rotate(-20deg);"></div>
                        <div class="sword-d" style="position: absolute; left: -5px; top: 40px; width: 3px; height: 35px; 
                                                    background: #ef4444; border-radius: 2px; transform: rotate(-10deg);"></div>
                        <div class="sword-id" style="position: absolute; right: -8px; top: 42px; width: 3px; height: 35px; 
                                                     background: #10b981; border-radius: 2px; transform: rotate(15deg);"></div>
                    </div>
                    
                    <!-- Falling Stone Effects -->
                    <div class="falling-preview" style="position: absolute; top: 15%; left: 30%; right: 30%; height: 60%;">
                        <!-- Sample falling stones -->
                        <div class="preview-stone" style="
                            position: absolute; top: 10%; left: 20%; width: 40px; height: 25px; 
                            background: #3b82f6; border-radius: 5px; color: white; font-size: 10px;
                            display: flex; align-items: center; justify-content: center; font-weight: bold;
                            animation: stonePreview1 4s ease-in-out infinite;">
                            /t/
                        </div>
                        <div class="preview-stone" style="
                            position: absolute; top: 30%; right: 25%; width: 40px; height: 25px; 
                            background: #ef4444; border-radius: 5px; color: white; font-size: 10px;
                            display: flex; align-items: center; justify-content: center; font-weight: bold;
                            animation: stonePreview2 4s ease-in-out infinite 1s;">
                            /d/
                        </div>
                        <div class="preview-stone" style="
                            position: absolute; top: 50%; left: 30%; width: 40px; height: 25px; 
                            background: #10b981; border-radius: 5px; color: white; font-size: 10px;
                            display: flex; align-items: center; justify-content: center; font-weight: bold;
                            animation: stonePreview3 4s ease-in-out infinite 2s;">
                            /ɪd/
                        </div>
                    </div>
                    
                    <!-- Story text -->
                    <div class="cutscene-text" style="
                        position: absolute; top: 8%; left: 50%; transform: translateX(-50%); 
                        background: rgba(0,0,0,0.85); color: white; padding: 25px; 
                        border-radius: 20px; max-width: 600px; text-align: center; border: 2px solid #f59e0b;">
                        
                        <h3 style="color: #f59e0b; margin-top: 0; font-size: 24px;">⚔️ 石塊巫師的挑戰</h3>
                        <p style="font-size: 18px; line-height: 1.5;">
                            石塊召喚巫師正在從天空降下帶有IPA音標的魔法石塊！
                        </p>
                        <div style="background: rgba(245, 158, 11, 0.2); padding: 15px; border-radius: 10px; margin: 15px 0;">
                            <p style="margin: 0; font-weight: bold; color: #fbbf24;">
                                🎮 操作方法：
                            </p>
                            <ul style="text-align: left; padding-left: 20px; margin: 10px 0;">
                                <li><strong>A/D 鍵</strong> - 左右移動</li>
                                <li><strong>T 鍵</strong> - 藍劍斬擊 /t/ 音石塊</li>
                                <li><strong>G 鍵</strong> - 紅劍斬擊 /d/ 音石塊</li>
                                <li><strong>B 鍵</strong> - 綠劍斬擊 /ɪd/ 音石塊</li>
                            </ul>
                        </div>
                        <p style="color: #fca5a5; font-size: 16px;">
                            用正確顏色的劍斬開對應的石塊！斬錯或漏掉會失去生命值！
                        </p>
                        <button onclick="window.fallingWordsGame.startMainGame()" style="
                            background: linear-gradient(45deg, #f59e0b, #d97706); color: white; border: none; 
                            padding: 18px 35px; border-radius: 12px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; margin-top: 20px; box-shadow: 0 5px 20px rgba(245, 158, 11, 0.4);">
                            ⚔️ 開始石塊斬擊
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
            @keyframes earthMagic {
                0%, 100% { box-shadow: 0 0 25px #f59e0b; transform: scale(1) rotate(0deg); }
                50% { box-shadow: 0 0 40px #f59e0b, 0 0 60px #d97706; transform: scale(1.2) rotate(180deg); }
            }
            @keyframes stonePreview1 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
                50% { transform: translateY(20px) rotate(90deg); opacity: 1; }
            }
            @keyframes stonePreview2 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
                50% { transform: translateY(25px) rotate(-90deg); opacity: 1; }
            }
            @keyframes stonePreview3 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
                50% { transform: translateY(15px) rotate(45deg); opacity: 1; }
            }
            </style>
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
            <div class="stone-slashing-game" style="
                background: linear-gradient(180deg, #1e293b 0%, #475569 100%);
                min-height: 100vh; position: relative; overflow: hidden;">
                
                <!-- Game Header -->
                <div class="game-header" style="
                    position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
                    text-align: center; z-index: 100; color: white;">
                    <h2 style="margin: 0; font-size: 24px;">⚔️ 石塊斬擊挑戰</h2>
                </div>
                
                <!-- Game Stats -->
                <div class="game-stats" style="
                    position: absolute; top: 20px; left: 20px; z-index: 100; 
                    background: rgba(0,0,0,0.7); padding: 15px; border-radius: 10px; color: white;">
                    <div>分數: <span id="fallingScore" style="color: #4ecca3; font-weight: bold;">0</span></div>
                    <div>生命: <span id="fallingLives" style="color: #ef4444; font-weight: bold;">3</span></div>
                    <div>等級: <span id="fallingLevel" style="color: #fbbf24; font-weight: bold;">1</span></div>
                </div>
                
                <!-- Controls Guide -->
                <div class="controls-guide" style="
                    position: absolute; top: 20px; right: 20px; z-index: 100; 
                    background: rgba(0,0,0,0.7); padding: 15px; border-radius: 10px; color: white; font-size: 14px;">
                    <div><strong>A/D</strong>: 移動</div>
                    <div><strong style="color: #3b82f6;">T</strong>: 藍劍 /t/</div>
                    <div><strong style="color: #ef4444;">G</strong>: 紅劍 /d/</div>
                    <div><strong style="color: #10b981;">B</strong>: 綠劍 /ɪd/</div>
                </div>
                
                <!-- Game Canvas -->
                <canvas id="fallingWordsCanvas" width="800" height="600" style="
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    border: 2px solid rgba(255,255,255,0.3); border-radius: 10px; 
                    background: radial-gradient(circle at center bottom, #374151, #1f2937);">
                </canvas>
                
                <!-- Back Button -->
                <button class="back-btn" onclick="window.gameSystem?.showGameMenu()" style="
                    position: absolute; bottom: 20px; left: 20px; background: rgba(76, 204, 163, 0.8); 
                    color: white; border: none; padding: 12px 20px; border-radius: 25px; 
                    cursor: pointer; font-weight: bold; z-index: 100;">
                    ← 返回選單
                </button>
            </div>
        `;
        
        // Get canvas and context
        this.canvas = document.getElementById('fallingWordsCanvas');
        this.ctx = this.canvas.getContext('2d');
    }
    
    resetGame() {
        this.isGameActive = true;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.fallingStones = [];
        this.player.x = 400;
        this.lastStoneTime = 0;
        this.gameSpeed = 1;
        
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
        
        // Spawn new stones
        if (currentTime - this.lastStoneTime > this.stoneInterval) {
            this.spawnStone();
            this.lastStoneTime = currentTime;
        }
        
        // Update falling stones
        this.fallingStones = this.fallingStones.filter(stone => {
            stone.y += stone.speed * this.gameSpeed;
            
            // Check if stone hit bottom
            if (stone.y > this.canvas.height) {
                this.loseLife();
                return false;
            }
            
            return true;
        });
        
        // Check for level progression
        if (this.score > 0 && this.score % 100 === 0 && this.score > (this.level - 1) * 100) {
            this.levelUp();
        }
    }
    
    spawnStone() {
        const soundTypes = ['t', 'd', 'id'];
        const randomType = soundTypes[Math.floor(Math.random() * soundTypes.length)];
        const words = this.stoneWords[randomType];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        const colors = { t: '#3b82f6', d: '#ef4444', id: '#10b981' };
        
        const stone = {
            x: Math.random() * (this.canvas.width - 60),
            y: -40,
            width: 60,
            height: 30,
            speed: 2 + Math.random() * 2,
            type: randomType,
            word: randomWord,
            color: colors[randomType]
        };
        
        this.fallingStones.push(stone);
    }
    
    draw() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#374151');
        gradient.addColorStop(1, '#1f2937');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cave elements
        this.drawCaveElements();
        
        // Draw falling stones
        this.fallingStones.forEach(stone => this.drawStone(stone));
        
        // Draw player
        this.drawPlayer();
        
        // Draw active sword effects
        this.drawSwordEffects();
    }
    
    drawCaveElements() {
        // Draw stalactites
        this.ctx.fillStyle = '#6b7280';
        this.ctx.beginPath();
        this.ctx.moveTo(100, 0);
        this.ctx.lineTo(80, 50);
        this.ctx.lineTo(120, 50);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(300, 0);
        this.ctx.lineTo(285, 40);
        this.ctx.lineTo(315, 40);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(600, 0);
        this.ctx.lineTo(580, 60);
        this.ctx.lineTo(620, 60);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawStone(stone) {
        // Draw stone body
        this.ctx.fillStyle = stone.color;
        this.ctx.fillRect(stone.x, stone.y, stone.width, stone.height);
        
        // Draw stone border
        this.ctx.strokeStyle = '#1f2937';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(stone.x, stone.y, stone.width, stone.height);
        
        // Draw IPA symbol
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        const symbol = stone.type === 'id' ? '/ɪd/' : `/${stone.type}/`;
        this.ctx.fillText(symbol, stone.x + stone.width/2, stone.y + stone.height/2 + 5);
        
        // Draw word below
        this.ctx.font = '10px Arial';
        this.ctx.fillText(stone.word, stone.x + stone.width/2, stone.y + stone.height + 15);
    }
    
    drawPlayer() {
        const p = this.player;
        
        // Player body
        this.ctx.fillStyle = '#7c3aed';
        this.ctx.fillRect(p.x, p.y, p.width, p.height);
        
        // Player head
        this.ctx.fillStyle = '#fdbcb4';
        this.ctx.beginPath();
        this.ctx.arc(p.x + p.width/2, p.y - 10, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw swords
        const swordColors = { t: '#3b82f6', d: '#ef4444', id: '#10b981' };
        let swordOffset = -20;
        
        Object.keys(swordColors).forEach(type => {
            this.ctx.fillStyle = swordColors[type];
            this.ctx.fillRect(p.x + swordOffset, p.y - 5, 4, 40);
            swordOffset += 15;
        });
    }
    
    drawSwordEffects() {
        // Draw sword slash effects if any sword is active
        Object.keys(this.swords).forEach(type => {
            if (this.swords[type]) {
                const colors = { t: '#3b82f6', d: '#ef4444', id: '#10b981' };
                this.ctx.strokeStyle = colors[type];
                this.ctx.lineWidth = 8;
                this.ctx.beginPath();
                this.ctx.arc(this.player.x + 25, this.player.y + 30, 60, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        });
    }
    
    handleKeyDown(e) {
        if (!this.isGameActive) return;
        
        const key = e.key.toLowerCase();
        
        switch(key) {
            case 'a':
                this.player.x = Math.max(0, this.player.x - 20);
                break;
            case 'd':
                this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + 20);
                break;
            case 't':
                this.activateSword('t');
                break;
            case 'g':
                this.activateSword('d');
                break;
            case 'b':
                this.activateSword('id');
                break;
        }
    }
    
    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        
        if (['t', 'g', 'b'].includes(key)) {
            const swordMap = { t: 't', g: 'd', b: 'id' };
            this.deactivateSword(swordMap[key]);
        }
    }
    
    activateSword(type) {
        this.swords[type] = true;
        this.checkStoneSlashing(type);
        
        // Deactivate after short time
        setTimeout(() => {
            this.swords[type] = false;
        }, 200);
    }
    
    deactivateSword(type) {
        this.swords[type] = false;
    }
    
    checkStoneSlashing(swordType) {
        const slashRadius = 80;
        const playerCenterX = this.player.x + this.player.width/2;
        const playerCenterY = this.player.y + this.player.height/2;
        
        this.fallingStones = this.fallingStones.filter(stone => {
            const stoneCenterX = stone.x + stone.width/2;
            const stoneCenterY = stone.y + stone.height/2;
            const distance = Math.sqrt(
                Math.pow(stoneCenterX - playerCenterX, 2) + 
                Math.pow(stoneCenterY - playerCenterY, 2)
            );
            
            if (distance < slashRadius) {
                if (stone.type === swordType) {
                    // Correct slash
                    this.score += 10;
                    this.gameSystem.updateScore('fallingWords', 10, false);
                    if (window.SoundSystem) {
                        window.SoundSystem.play('correct');
                    }
                    this.updateUI();
                    return false; // Remove stone
                } else {
                    // Wrong slash
                    this.loseLife();
                    if (window.SoundSystem) {
                        window.SoundSystem.play('wrong');
                    }
                    return false; // Remove stone
                }
            }
            
            return true; // Keep stone
        });
    }
    
    loseLife() {
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    levelUp() {
        this.level++;
        this.gameSpeed += 0.2;
        this.stoneInterval = Math.max(800, this.stoneInterval - 100);
        
        this.gameSystem.showMessage(`Level Up! 等級 ${this.level}`, 2000);
        this.updateUI();
    }
    
    updateUI() {
        const scoreElement = document.getElementById('fallingScore');
        const livesElement = document.getElementById('fallingLives');
        const levelElement = document.getElementById('fallingLevel');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (livesElement) livesElement.textContent = this.lives;
        if (levelElement) levelElement.textContent = this.level;
    }
    
    gameOver() {
        this.isGameActive = false;
        
        const message = `遊戲結束！最終分數: ${this.score}`;
        this.gameSystem.showMessage(message, 3000);
        
        // Check if score is enough for completion
        setTimeout(() => {
            this.gameSystem.checkLevelCompletion('fallingWords');
        }, 2000);
    }
    
    stopGame() {
        this.isGameActive = false;
        this.fallingStones = [];
        
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
            console.log('Falling Words Stone Slashing game initialized');
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
