/**
 * Complete Falling Words Game - Stone Slashing Adventure
 * Player slashes falling IPA pronunciation stones with colored swords
 */
class FallingWordsGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.canvas = null;
        this.ctx = null;
        this.isGameActive = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Game objects
        this.fallingStones = [];
        this.player = { x: 375, y: 520, width: 50, height: 60 };
        this.swordEffects = [];
        
        // Timing and difficulty
        this.lastStoneTime = 0;
        this.stoneInterval = 2000;
        this.gameSpeed = 1;
        this.stonesDestroyed = 0;
        
        // Stone and sword data
        this.stoneTypes = {
            t: { color: '#3b82f6', words: ['watched', 'crossed', 'kicked', 'danced', 'jumped', 'helped'], key: 'KeyT' },
            d: { color: '#ef4444', words: ['played', 'lived', 'moved', 'called', 'loved', 'saved'], key: 'KeyG' },
            id: { color: '#10b981', words: ['wanted', 'needed', 'decided', 'started', 'ended', 'visited'], key: 'KeyB' }
        };
        
        this.activeSwords = { t: false, d: false, id: false };
        this.swordCooldown = { t: 0, d: 0, id: 0 };
        
        this.init();
    }
    
    init() {
        console.log('Initializing Complete Falling Words Stone Slashing Game');
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
        
        gameContainer.innerHTML = `
            <div class="stone-slashing-cutscene" style="
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000;
                background: linear-gradient(180deg, #1e293b 0%, #475569 50%, #64748b 100%);
                display: flex; align-items: center; justify-content: center;">
                
                <div class="cave-scene" style="width: 90%; max-width: 1000px; position: relative; height: 80%;">
                    
                    <!-- Deep cave background -->
                    <div class="cave-walls" style="
                        position: absolute; width: 100%; height: 100%;
                        background: radial-gradient(circle at center, #374151 0%, #1f2937 70%, #111827 100%);
                        border-radius: 25px; overflow: hidden;">
                        
                        <!-- Cave stalactites -->
                        <div style="position: absolute; top: 0; left: 15%; width: 0; height: 0; 
                                    border-left: 25px solid transparent; border-right: 25px solid transparent; 
                                    border-top: 60px solid #6b7280; opacity: 0.8;"></div>
                        <div style="position: absolute; top: 0; left: 45%; width: 0; height: 0; 
                                    border-left: 20px solid transparent; border-right: 20px solid transparent; 
                                    border-top: 45px solid #6b7280; opacity: 0.8;"></div>
                        <div style="position: absolute; top: 0; right: 20%; width: 0; height: 0; 
                                    border-left: 30px solid transparent; border-right: 30px solid transparent; 
                                    border-top: 70px solid #6b7280; opacity: 0.8;"></div>
                        
                        <!-- Cave floor -->
                        <div style="position: absolute; bottom: 0; width: 100%; height: 25%; 
                                    background: linear-gradient(180deg, transparent, #1f2937, #111827);"></div>
                    </div>
                    
                    <!-- Stone Wizard (Earth Magic) -->
                    <div class="stone-wizard" style="
                        position: absolute; right: 15%; top: 20%; width: 140px; height: 200px;">
                        
                        <!-- Wizard robe (earth tones) -->
                        <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); 
                                    width: 90px; height: 130px; background: linear-gradient(180deg, #78716c, #57534e); 
                                    border-radius: 45px 45px 20px 20px; border: 3px solid #a8a29e;"></div>
                        
                        <!-- Wizard head -->
                        <div style="position: absolute; top: 25px; left: 50%; transform: translateX(-50%); 
                                    width: 70px; height: 70px; background: #e5e7eb; border-radius: 50%;
                                    border: 3px solid #9ca3af;"></div>
                        
                        <!-- Earth magic eyes -->
                        <div style="position: absolute; top: 45px; left: 35%; width: 10px; height: 10px; 
                                    background: #f59e0b; border-radius: 50%; 
                                    box-shadow: 0 0 15px #f59e0b; animation: earthEyes 3s ease-in-out infinite;"></div>
                        <div style="position: absolute; top: 45px; right: 35%; width: 10px; height: 10px; 
                                    background: #f59e0b; border-radius: 50%; 
                                    box-shadow: 0 0 15px #f59e0b; animation: earthEyes 3s ease-in-out infinite 0.5s;"></div>
                        
                        <!-- Stone wizard beard -->
                        <div style="position: absolute; top: 65px; left: 50%; transform: translateX(-50%); 
                                    width: 35px; height: 30px; background: #6b7280; 
                                    border-radius: 0 0 20px 20px; opacity: 0.9;"></div>
                        
                        <!-- Stone wizard hat -->
                        <div style="position: absolute; top: 5px; left: 50%; transform: translateX(-50%); 
                                    width: 0; height: 0; border-left: 50px solid transparent; 
                                    border-right: 50px solid transparent; border-bottom: 70px solid #44403c;
                                    filter: drop-shadow(3px 3px 6px rgba(0,0,0,0.5));"></div>
                        
                        <!-- Earth staff with crystal -->
                        <div style="position: absolute; right: -15px; top: 70px; width: 6px; height: 120px; 
                                    background: linear-gradient(180deg, #78716c, #44403c); border-radius: 3px;"></div>
                        <div style="position: absolute; right: -30px; top: 55px; width: 35px; height: 25px; 
                                    background: linear-gradient(45deg, #a8a29e, #78716c); 
                                    border-radius: 20px 20px 8px 8px;"></div>
                        <div style="position: absolute; right: -23px; top: 45px; width: 20px; height: 20px; 
                                    background: radial-gradient(circle, #f59e0b, #d97706); border-radius: 50%; 
                                    animation: stoneStaffGlow 2.5s ease-in-out infinite; 
                                    box-shadow: 0 0 30px #f59e0b;"></div>
                        
                        <!-- Stone wizard aura -->
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                    width: 180px; height: 180px; border-radius: 50%; 
                                    background: radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent); 
                                    animation: stoneAura 4s ease-in-out infinite;"></div>
                    </div>
                    
                    <!-- Warrior Player with Three Swords -->
                    <div class="sword-warrior" style="
                        position: absolute; left: 15%; bottom: 20%; width: 110px; height: 150px;">
                        
                        <!-- Warrior body (armored) -->
                        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); 
                                    width: 65px; height: 100px; background: linear-gradient(180deg, #7c3aed, #6d28d9);
                                    border-radius: 32px 32px 12px 12px; border: 3px solid #fbbf24;"></div>
                        
                        <!-- Warrior head with helmet -->
                        <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
                                    width: 50px; height: 50px; background: #fdbcb4; border-radius: 50%;"></div>
                        
                        <!-- Helmet -->
                        <div style="position: absolute; top: 15px; left: 50%; transform: translateX(-50%); 
                                    width: 55px; height: 30px; background: linear-gradient(45deg, #94a3b8, #64748b);
                                    border-radius: 28px 28px 0 0;"></div>
                        
                        <!-- Determined warrior eyes -->
                        <div style="position: absolute; top: 35px; left: 35%; width: 5px; height: 5px; 
                                    background: #1f2937; border-radius: 50%;"></div>
                        <div style="position: absolute; top: 35px; right: 35%; width: 5px; height: 5px; 
                                    background: #1f2937; border-radius: 50%;"></div>
                        
                        <!-- Three specialized swords -->
                        <!-- Blue T-sword -->
                        <div class="t-sword" style="position: absolute; left: -20px; top: 50px; width: 4px; height: 45px; 
                                                    background: linear-gradient(180deg, #3b82f6, #1d4ed8); 
                                                    border-radius: 2px; transform: rotate(-25deg);"></div>
                        <div style="position: absolute; left: -25px; top: 45px; width: 15px; height: 8px; 
                                    background: #3b82f6; border-radius: 8px;"></div>
                        
                        <!-- Red D-sword -->
                        <div class="d-sword" style="position: absolute; left: -8px; top: 45px; width: 4px; height: 45px; 
                                                    background: linear-gradient(180deg, #ef4444, #dc2626); 
                                                    border-radius: 2px; transform: rotate(-10deg);"></div>
                        <div style="position: absolute; left: -13px; top: 40px; width: 15px; height: 8px; 
                                    background: #ef4444; border-radius: 8px;"></div>
                        
                        <!-- Green ID-sword -->
                        <div class="id-sword" style="position: absolute; right: -12px; top: 48px; width: 4px; height: 45px; 
                                                     background: linear-gradient(180deg, #10b981, #059669); 
                                                     border-radius: 2px; transform: rotate(20deg);"></div>
                        <div style="position: absolute; right: -17px; top: 43px; width: 15px; height: 8px; 
                                    background: #10b981; border-radius: 8px;"></div>
                    </div>
                    
                    <!-- Falling Stone Preview -->
                    <div class="stone-rain-preview" style="position: absolute; top: 20%; left: 35%; right: 35%; height: 50%;">
                        <!-- Sample IPA stones -->
                        <div class="preview-ipa-stone" style="
                            position: absolute; top: 15%; left: 25%; width: 45px; height: 30px; 
                            background: linear-gradient(45deg, #3b82f6, #1e40af); border-radius: 8px; 
                            color: white; font-size: 12px; font-weight: bold; display: flex; 
                            align-items: center; justify-content: center;
                            animation: stoneFloat1 4s ease-in-out infinite; border: 2px solid rgba(255,255,255,0.3);">
                            /t/
                        </div>
                        <div class="preview-ipa-stone" style="
                            position: absolute; top: 35%; right: 20%; width: 45px; height: 30px; 
                            background: linear-gradient(45deg, #ef4444, #dc2626); border-radius: 8px; 
                            color: white; font-size: 12px; font-weight: bold; display: flex; 
                            align-items: center; justify-content: center;
                            animation: stoneFloat2 4s ease-in-out infinite 1.5s; border: 2px solid rgba(255,255,255,0.3);">
                            /d/
                        </div>
                        <div class="preview-ipa-stone" style="
                            position: absolute; top: 55%; left: 35%; width: 45px; height: 30px; 
                            background: linear-gradient(45deg, #10b981, #059669); border-radius: 8px; 
                            color: white; font-size: 12px; font-weight: bold; display: flex; 
                            align-items: center; justify-content: center;
                            animation: stoneFloat3 4s ease-in-out infinite 3s; border: 2px solid rgba(255,255,255,0.3);">
                            /ɪd/
                        </div>
                        
                        <!-- Sword slash effects -->
                        <div style="position: absolute; top: 25%; left: 40%; width: 60px; height: 3px; 
                                    background: linear-gradient(90deg, transparent, #3b82f6, transparent);
                                    animation: slashEffect1 4s ease-in-out infinite 2s;"></div>
                        <div style="position: absolute; top: 45%; right: 30%; width: 60px; height: 3px; 
                                    background: linear-gradient(90deg, transparent, #ef4444, transparent);
                                    animation: slashEffect2 4s ease-in-out infinite 3.5s;"></div>
                    </div>
                    
                    <!-- Story text -->
                    <div class="cutscene-text" style="
                        position: absolute; top: 8%; left: 50%; transform: translateX(-50%); 
                        background: rgba(0,0,0,0.9); color: white; padding: 28px; 
                        border-radius: 20px; max-width: 650px; text-align: center; 
                        border: 3px solid #f59e0b; box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);">
                        
                        <h3 style="color: #f59e0b; margin-top: 0; font-size: 26px;">⚔️ 石塊巫師的挑戰</h3>
                        <p style="font-size: 19px; line-height: 1.6; margin: 18px 0;">
                            石塊召喚巫師正在從洞穴頂部降下帶有IPA音標的魔法石塊！你必須用對應顏色的劍斬開正確的石塊。
                        </p>
                        <div style="background: rgba(245, 158, 11, 0.2); padding: 20px; border-radius: 12px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold; color: #fbbf24; font-size: 18px;">
                                ⚔️ 戰鬥技巧：
                            </p>
                            <ul style="text-align: left; padding-left: 25px; margin: 12px 0; font-size: 16px;">
                                <li><strong style="color: #60a5fa;">T鍵 + 藍劍</strong> - 斬擊 /t/ 音石塊 (watched, kicked)</li>
                                <li><strong style="color: #f87171;">G鍵 + 紅劍</strong> - 斬擊 /d/ 音石塊 (played, lived)</li>
                                <li><strong style="color: #34d399;">B鍵 + 綠劍</strong> - 斬擊 /ɪd/ 音石塊 (wanted, needed)</li>
                                <li><strong>A/D鍵</strong> - 左右閃避移動</li>
                            </ul>
                        </div>
                        <p style="color: #fca5a5; font-size: 17px; margin: 18px 0;">
                            用錯劍或漏掉石塊會失去生命值！反應要快，選擇要準確！
                        </p>
                        <button onclick="window.fallingWordsGame.startMainGame()" style="
                            background: linear-gradient(45deg, #f59e0b, #d97706); color: white; border: none; 
                            padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                            cursor: pointer; margin-top: 25px; box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
                            transition: transform 0.3s ease;">
                            ⚔️ 開始石塊斬擊
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
            @keyframes earthEyes {
                0%, 100% { box-shadow: 0 0 15px #f59e0b; }
                50% { box-shadow: 0 0 25px #f59e0b, 0 0 35px #d97706; }
            }
            @keyframes stoneStaffGlow {
                0%, 100% { box-shadow: 0 0 30px #f59e0b; transform: scale(1) rotate(0deg); }
                50% { box-shadow: 0 0 50px #f59e0b, 0 0 70px #d97706; transform: scale(1.2) rotate(180deg); }
            }
            @keyframes stoneAura {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
                50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.7; }
            }
            @keyframes stoneFloat1 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
                50% { transform: translateY(-25px) rotate(45deg); opacity: 1; }
            }
            @keyframes stoneFloat2 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
                50% { transform: translateY(-30px) rotate(-60deg); opacity: 1; }
            }
            @keyframes stoneFloat3 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
                50% { transform: translateY(-20px) rotate(30deg); opacity: 1; }
            }
            @keyframes slashEffect1 {
                0%, 90%, 100% { opacity: 0; transform: scaleX(0); }
                95% { opacity: 1; transform: scaleX(1); }
            }
            @keyframes slashEffect2 {
                0%, 90%, 100% { opacity: 0; transform: scaleX(0); }
                95% { opacity: 1; transform: scaleX(1); }
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
                <div class="battle-header" style="
                    position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
                    text-align: center; color: white; z-index: 100;">
                    <h2 style="margin: 0; font-size: 26px; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">
                        ⚔️ 石塊斬擊挑戰
                    </h2>
                </div>
                
                <!-- Game Stats -->
                <div class="battle-stats" style="
                    position: absolute; top: 20px; left: 20px; z-index: 100; 
                    background: rgba(0,0,0,0.8); padding: 18px; border-radius: 12px; color: white;
                    border: 2px solid rgba(245, 158, 11, 0.5);">
                    <div style="margin: 5px 0;">生命: <span id="fallingLives" style="color: #ef4444; font-weight: bold; font-size: 18px;">3</span> ❤️</div>
                    <div style="margin: 5px 0;">分數: <span id="fallingScore" style="color: #4ecca3; font-weight: bold; font-size: 18px;">0</span></div>
                    <div style="margin: 5px 0;">等級: <span id="fallingLevel" style="color: #fbbf24; font-weight: bold; font-size: 18px;">1</span></div>
                    <div style="margin: 5px 0; font-size: 14px; color: #94a3b8;">已斬: <span id="stonesDestroyed">0</span></div>
                </div>
                
                <!-- Controls Guide -->
                <div class="controls-guide" style="
                    position: absolute; top: 20px; right: 20px; z-index: 100; 
                    background: rgba(0,0,0,0.8); padding: 18px; border-radius: 12px; color: white; 
                    font-size: 14px; border: 2px solid rgba(245, 158, 11, 0.5);">
                    <div style="font-weight: bold; margin-bottom: 8px;">⚔️ 劍術控制</div>
                    <div style="margin: 3px 0;"><strong style="color: #60a5fa;">T鍵</strong>: 藍劍 /t/</div>
                    <div style="margin: 3px 0;"><strong style="color: #f87171;">G鍵</strong>: 紅劍 /d/</div>
                    <div style="margin: 3px 0;"><strong style="color: #34d399;">B鍵</strong>: 綠劍 /ɪd/</div>
                    <div style="margin: 8px 0 3px 0; font-weight: bold;">🏃 移動</div>
                    <div style="margin: 3px 0;"><strong>A/D鍵</strong>: 左右移動</div>
                </div>
                
                <!-- Main Game Canvas -->
                <canvas id="fallingWordsCanvas" width="800" height="600" style="
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    border: 3px solid rgba(245, 158, 11, 0.6); border-radius: 15px; 
                    background: radial-gradient(circle at center bottom, #374151, #1f2937);
                    box-shadow: 0 0 30px rgba(0,0,0,0.5);">
                </canvas>
                
                <!-- Sword Status Display -->
                <div class="sword-status" style="
                    position: absolute; bottom: 120px; left: 50%; transform: translateX(-50%);
                    display: flex; gap: 20px; z-index: 100;">
                    
                    <div class="sword-indicator" data-sword="t" style="
                        background: rgba(59, 130, 246, 0.2); border: 2px solid #3b82f6;
                        padding: 12px; border-radius: 10px; text-align: center; min-width: 80px;">
                        <div style="color: #3b82f6; font-size: 20px;">⚔️</div>
                        <div style="color: #3b82f6; font-size: 14px; font-weight: bold;">T - /t/</div>
                        <div style="color: white; font-size: 12px;">藍劍</div>
                    </div>
                    
                    <div class="sword-indicator" data-sword="d" style="
                        background: rgba(239, 68, 68, 0.2); border: 2px solid #ef4444;
                        padding: 12px; border-radius: 10px; text-align: center; min-width: 80px;">
                        <div style="color: #ef4444; font-size: 20px;">⚔️</div>
                        <div style="color: #ef4444; font-size: 14px; font-weight: bold;">G - /d/</div>
                        <div style="color: white; font-size: 12px;">紅劍</div>
                    </div>
                    
                    <div class="sword-indicator" data-sword="id" style="
                        background: rgba(16, 185, 129, 0.2); border: 2px solid #10b981;
                        padding: 12px; border-radius: 10px; text-align: center; min-width: 80px;">
                        <div style="color: #10b981; font-size: 20px;">⚔️</div>
                        <div style="color: #10b981; font-size: 14px; font-weight: bold;">B - /ɪd/</div>
                        <div style="color: white; font-size: 12px;">綠劍</div>
                    </div>
                </div>
                
                <!-- Back Button -->
                <button class="back-btn" onclick="window.gameSystem.showGameMenu()" style="
                    position: fixed; bottom: 20px; left: 20px; background: rgba(76, 204, 163, 0.8); 
                    color: white; border: none; padding: 14px 25px; border-radius: 25px; 
                    cursor: pointer; font-weight: bold; z-index: 200; font-size: 16px;">
                    ← 返回選單
                </button>
            </div>
            
            <style>
            .sword-indicator {
                transition: all 0.3s ease;
            }
            
            .sword-indicator.active {
                transform: scale(1.2);
                box-shadow: 0 0 20px currentColor;
                animation: swordPulse 0.3s ease-out;
            }
            
            .sword-indicator.cooldown {
                opacity: 0.5;
                transform: scale(0.9);
            }
            
            @keyframes swordPulse {
                0% { transform: scale(1.2); }
                50% { transform: scale(1.4); }
                100% { transform: scale(1.2); }
            }
            
            .back-btn:hover {
                background: rgba(76, 204, 163, 1);
                transform: translateY(-2px);
            }
            </style>
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
        this.stonesDestroyed = 0;
        this.fallingStones = [];
        this.swordEffects = [];
        this.player.x = 375;
        this.lastStoneTime = 0;
        this.gameSpeed = 1;
        this.stoneInterval = 2000;
        this.activeSwords = { t: false, d: false, id: false };
        this.swordCooldown = { t: 0, d: 0, id: 0 };
        
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
        this.updateStones();
        
        // Update sword cooldowns
        this.updateSwordCooldowns();
        
        // Update sword effects
        this.updateSwordEffects();
        
        // Check level progression
        if (this.stonesDestroyed > 0 && this.stonesDestroyed % 15 === 0 && this.score > (this.level - 1) * 150) {
            this.levelUp();
        }
    }
    
    spawnStone() {
        const types = Object.keys(this.stoneTypes);
        const randomType = types[Math.floor(Math.random() * types.length)];
        const words = this.stoneTypes[randomType].words;
        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        const stone = {
            x: Math.random() * (this.canvas.width - 80) + 40,
            y: -50,
            width: 70,
            height: 35,
            speed: 2 + Math.random() * 2 + this.level * 0.3,
            type: randomType,
            word: randomWord,
            color: this.stoneTypes[randomType].color,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        };
        
        this.fallingStones.push(stone);
    }
    
    updateStones() {
        this.fallingStones = this.fallingStones.filter(stone => {
            stone.y += stone.speed * this.gameSpeed;
            stone.rotation += stone.rotationSpeed;
            
            // Check if stone hit bottom
            if (stone.y > this.canvas.height + 20) {
                this.loseLife();
                return false;
            }
            
            return true;
        });
    }
    
    updateSwordCooldowns() {
        Object.keys(this.swordCooldown).forEach(type => {
            if (this.swordCooldown[type] > 0) {
                this.swordCooldown[type]--;
            }
        });
        
        // Update sword visual states
        Object.keys(this.activeSwords).forEach(type => {
            const indicator = document.querySelector(`[data-sword="${type}"]`);
            if (indicator) {
                if (this.activeSwords[type]) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
                
                if (this.swordCooldown[type] > 0) {
                    indicator.classList.add('cooldown');
                } else {
                    indicator.classList.remove('cooldown');
                }
            }
        });
    }
    
    updateSwordEffects() {
        this.swordEffects = this.swordEffects.filter(effect => {
            effect.life--;
            effect.radius += 3;
            effect.opacity = effect.life / effect.maxLife;
            
            return effect.life > 0;
        });
    }
    
    draw() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cave background elements
        this.drawCaveBackground();
        
        // Draw falling stones
        this.fallingStones.forEach(stone => this.drawStone(stone));
        
        // Draw player
        this.drawPlayer();
        
        // Draw sword effects
        this.drawSwordEffects();
    }
    
    drawCaveBackground() {
        // Draw cave stalactites at top
        this.ctx.fillStyle = 'rgba(107, 114, 128, 0.3)';
        
        // Stalactites
        const stalactites = [
            { x: 120, height: 40 },
            { x: 280, height: 30 },
            { x: 520, height: 35 },
            { x: 650, height: 25 }
        ];
        
        stalactites.forEach(stal => {
            this.ctx.beginPath();
            this.ctx.moveTo(stal.x, 0);
            this.ctx.lineTo(stal.x - 15, stal.height);
            this.ctx.lineTo(stal.x + 15, stal.height);
            this.ctx.closePath();
            this.ctx.fill();
        });
        
        // Cave floor texture
        this.ctx.fillStyle = 'rgba(31, 41, 55, 0.4)';
        this.ctx.fillRect(0, this.canvas.height - 30, this.canvas.width, 30);
    }
    
    drawStone(stone) {
        this.ctx.save();
        this.ctx.translate(stone.x + stone.width/2, stone.y + stone.height/2);
        this.ctx.rotate(stone.rotation);
        
        // Stone body with gradient
        const gradient = this.ctx.createLinearGradient(-stone.width/2, -stone.height/2, stone.width/2, stone.height/2);
        gradient.addColorStop(0, stone.color);
        gradient.addColorStop(1, this.darkenColor(stone.color, 0.3));
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(-stone.width/2, -stone.height/2, stone.width, stone.height);
        
        // Stone border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-stone.width/2, -stone.height/2, stone.width, stone.height);
        
        // Inner shadow
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(-stone.width/2 + 2, -stone.height/2 + 2, stone.width - 4, stone.height - 4);
        
        // Reset rotation for text
        this.ctx.rotate(-stone.rotation);
        
        // IPA symbol
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        this.ctx.shadowBlur = 3;
        
        const symbol = stone.type === 'id' ? '/ɪd/' : `/${stone.type}/`;
        this.ctx.fillText(symbol, 0, -2);
        
        // Word below symbol
        this.ctx.font = '11px Arial';
        this.ctx.fillText(stone.word, 0, 12);
        
        this.ctx.shadowBlur = 0;
        this.ctx.restore();
    }
    
    drawPlayer() {
        const p = this.player;
        
        // Player shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(p.x + p.width/2, p.y + p.height + 5, p.width/2, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player body (warrior armor)
        const bodyGradient = this.ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
        bodyGradient.addColorStop(0, '#8b5cf6');
        bodyGradient.addColorStop(1, '#6d28d9');
        this.ctx.fillStyle = bodyGradient;
        this.ctx.fillRect(p.x, p.y, p.width, p.height);
        
        // Armor details
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.fillRect(p.x + 5, p.y + 10, p.width - 10, 3);
        this.ctx.fillRect(p.x + 5, p.y + p.height - 15, p.width - 10, 3);
        
        // Player head
        this.ctx.fillStyle = '#fdbcb4';
        this.ctx.beginPath();
        this.ctx.arc(p.x + p.width/2, p.y - 8, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Helmet
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.beginPath();
        this.ctx.arc(p.x + p.width/2, p.y - 8, 14, Math.PI, Math.PI * 2);
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#1f2937';
        this.ctx.beginPath();
        this.ctx.arc(p.x + p.width/2 - 4, p.y - 10, 2, 0, Math.PI * 2);
        this.ctx.arc(p.x + p.width/2 + 4, p.y - 10, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw three swords
        this.drawSwords(p);
    }
    
    drawSwords(player) {
        const swordPositions = {
            t: { x: player.x - 15, y: player.y + 15, angle: -0.4, color: '#3b82f6' },
            d: { x: player.x - 5, y: player.y + 10, angle: -0.2, color: '#ef4444' },
            id: { x: player.x + player.width + 8, y: player.y + 12, angle: 0.3, color: '#10b981' }
        };
        
        Object.keys(swordPositions).forEach(type => {
            const sword = swordPositions[type];
            const isActive = this.activeSwords[type];
            const onCooldown = this.swordCooldown[type] > 0;
            
            this.ctx.save();
            this.ctx.translate(sword.x, sword.y);
            this.ctx.rotate(sword.angle);
            
            // Sword glow effect when active
            if (isActive) {
                this.ctx.shadowColor = sword.color;
                this.ctx.shadowBlur = 15;
            }
            
            // Sword blade
            this.ctx.fillStyle = onCooldown ? this.darkenColor(sword.color, 0.5) : sword.color;
            this.ctx.fillRect(-2, -25, 4, 30);
            
            // Sword hilt
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.fillRect(-4, 5, 8, 6);
            
            // Sword guard
            this.ctx.fillRect(-6, -2, 12, 4);
            
            this.ctx.shadowBlur = 0;
            this.ctx.restore();
        });
    }
    
    drawSwordEffects() {
        this.swordEffects.forEach(effect => {
            this.ctx.save();
            this.ctx.globalAlpha = effect.opacity;
            
            // Outer ring
            this.ctx.strokeStyle = effect.color;
            this.ctx.lineWidth = 8;
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Inner ring
            this.ctx.lineWidth = 4;
            this.ctx.globalAlpha = effect.opacity * 0.6;
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, effect.radius * 0.7, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }
    
    handleKeyDown(e) {
        if (!this.isGameActive) return;
        
        const key = e.code;
        
        switch(key) {
            case 'KeyA':
                this.player.x = Math.max(0, this.player.x - 25);
                break;
            case 'KeyD':
                this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + 25);
                break;
            case 'KeyT':
                this.useSword('t');
                break;
            case 'KeyG':
                this.useSword('d');
                break;
            case 'KeyB':
                this.useSword('id');
                break;
        }
    }
    
    handleKeyUp(e) {
        const swordMap = { KeyT: 't', KeyG: 'd', KeyB: 'id' };
        const swordType = swordMap[e.code];
        
        if (swordType) {
            this.activeSwords[swordType] = false;
        }
    }
    
    useSword(type) {
        if (this.swordCooldown[type] > 0) return;
        
        this.activeSwords[type] = true;
        this.swordCooldown[type] = 20; // Cooldown frames
        
        // Create sword effect
        this.swordEffects.push({
            x: this.player.x + this.player.width/2,
            y: this.player.y + this.player.height/2,
            radius: 20,
            color: this.stoneTypes[type].color,
            life: 30,
            maxLife: 30,
            opacity: 1
        });
        
        this.checkStoneSlashing(type);
        
        // Deactivate sword after short time
        setTimeout(() => {
            this.activeSwords[type] = false;
        }, 300);
    }
    
    checkStoneSlashing(swordType) {
        const slashRadius = 80;
        const playerCenterX = this.player.x + this.player.width/2;
        const playerCenterY = this.player.y + this.player.height/2;
        
        let hitSomething = false;
        
        this.fallingStones = this.fallingStones.filter(stone => {
            const stoneCenterX = stone.x + stone.width/2;
            const stoneCenterY = stone.y + stone.height/2;
            const distance = Math.sqrt(
                Math.pow(stoneCenterX - playerCenterX, 2) + 
                Math.pow(stoneCenterY - playerCenterY, 2)
            );
            
            if (distance < slashRadius) {
                hitSomething = true;
                
                if (stone.type === swordType) {
                    // Correct slash
                    const points = 15 + this.level * 5;
                    this.score += points;
                    this.stonesDestroyed++;
                    this.gameSystem.updateScore('fallingWords', points, false);
                    
                    // Create destruction effect
                    this.createDestructionEffect(stoneCenterX, stoneCenterY, stone.color);
                    
                    if (window.SoundSystem) {
                        window.SoundSystem.play('correct');
                    }
                    
                    this.updateUI();
                    return false; // Remove stone
                } else {
                    // Wrong slash - penalty
                    this.loseLife();
                    this.createDestructionEffect(stoneCenterX, stoneCenterY, '#ff6b6b');
                    
                    if (window.SoundSystem) {
                        window.SoundSystem.play('wrong');
                    }
                    return false; // Remove stone
                }
            }
            
            return true; // Keep stone
        });
        
        // Play swing sound even if nothing was hit
        if (!hitSomething) {
            // Could play swing sound effect here
        }
    }
    
    createDestructionEffect(x, y, color) {
        // Create particle explosion
        for (let i = 0; i < 12; i++) {
            // This would create particle effects if we had a particle system
            // For now, we'll just create a visual flash
        }
        
        // Add destruction ring effect
        this.swordEffects.push({
            x: x,
            y: y,
            radius: 10,
            color: color,
            life: 20,
            maxLife: 20,
            opacity: 1
        });
    }
    
    loseLife() {
        this.lives--;
        this.updateUI();
        
        // Screen flash effect
        const canvas = this.canvas;
        canvas.style.filter = 'brightness(2) sepia(1) hue-rotate(320deg)';
        setTimeout(() => {
            canvas.style.filter = '';
        }, 200);
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    levelUp() {
        this.level++;
        this.gameSpeed += 0.15;
        this.stoneInterval = Math.max(800, this.stoneInterval - 120);
        
        this.gameSystem.showMessage(`⚔️ 劍術進階！等級 ${this.level}`, 2000);
        this.updateUI();
        
        // Visual level up effect
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.swordEffects.push({
                    x: this.player.x + this.player.width/2 + (Math.random() - 0.5) * 100,
                    y: this.player.y + this.player.height/2 + (Math.random() - 0.5) * 100,
                    radius: 30,
                    color: '#fbbf24',
                    life: 40,
                    maxLife: 40,
                    opacity: 1
                });
            }, i * 200);
        }
    }
    
    updateUI() {
        const scoreElement = document.getElementById('fallingScore');
        const livesElement = document.getElementById('fallingLives');
        const levelElement = document.getElementById('fallingLevel');
        const destroyedElement = document.getElementById('stonesDestroyed');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (livesElement) livesElement.textContent = this.lives;
        if (levelElement) levelElement.textContent = this.level;
        if (destroyedElement) destroyedElement.textContent = this.stonesDestroyed;
    }
    
    gameOver() {
        this.isGameActive = false;
        
        const message = `⚔️ 石塊斬擊結束！<br>斬擊了 ${this.stonesDestroyed} 個石塊<br>最終分數: ${this.score}`;
        this.gameSystem.showMessage(message, 4000);
        
        // Check if score is enough for completion
        setTimeout(() => {
            this.gameSystem.checkLevelCompletion('fallingWords');
        }, 2000);
    }
    
    // Utility function
    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount * 255);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount * 255);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount * 255);
        
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }
    
    stopGame() {
        this.isGameActive = false;
        this.fallingStones = [];
        this.swordEffects = [];
        
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
            console.log('Complete Falling Words Stone Slashing game initialized');
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
