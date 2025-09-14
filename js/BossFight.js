/**
 * Boss Fight Game - Complete Version with Visual Effects
 * Final battle against the Pronunciation King
 */
class BossFight {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.canvas = null;
        this.ctx = null;
        this.isGameActive = false;
        this.currentQuestion = null;
        
        // Game state
        this.bossHealth = 100;
        this.playerHealth = 100;
        this.score = 0;
        this.playerAction = null; // 'attack' or 'defend'
        this.bossAction = null;
        this.turnCounter = 0;
        
        // Battle animations
        this.battleEffects = [];
        this.showingResults = false;
        this.animationFrame = 0;
        
        // Word database for boss questions
        this.bossQuestions = {
            t: [
                { word: 'watched', pronunciation: '/wɑtʃt/', meaning: '觀看' },
                { word: 'crossed', pronunciation: '/krɔst/', meaning: '穿越' },
                { word: 'kicked', pronunciation: '/kɪkt/', meaning: '踢' },
                { word: 'helped', pronunciation: '/hɛlpt/', meaning: '幫助' },
                { word: 'worked', pronunciation: '/wɜrkt/', meaning: '工作' },
                { word: 'washed', pronunciation: '/wɑʃt/', meaning: '洗' }
            ],
            d: [
                { word: 'played', pronunciation: '/pleɪd/', meaning: '玩' },
                { word: 'lived', pronunciation: '/lɪvd/', meaning: '住' },
                { word: 'moved', pronunciation: '/muvd/', meaning: '移動' },
                { word: 'called', pronunciation: '/kɔld/', meaning: '叫' },
                { word: 'loved', pronunciation: '/lʌvd/', meaning: '愛' },
                { word: 'saved', pronunciation: '/seɪvd/', meaning: '拯救' }
            ],
            id: [
                { word: 'wanted', pronunciation: '/ˈwɑntɪd/', meaning: '想要' },
                { word: 'needed', pronunciation: '/ˈnidɪd/', meaning: '需要' },
                { word: 'decided', pronunciation: '/dɪˈsaɪdɪd/', meaning: '決定' },
                { word: 'started', pronunciation: '/ˈstɑrtɪd/', meaning: '開始' },
                { word: 'ended', pronunciation: '/ˈɛndɪd/', meaning: '結束' },
                { word: 'created', pronunciation: '/kriˈeɪtɪd/', meaning: '創造' }
            ]
        };
        
        this.usedQuestions = [];
        this.init();
    }
    
    init() {
        console.log('Initializing Boss Fight');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'bossFight') {
                this.startGame();
            }
        });
    }
    
    startGame() {
        this.showCutscene();
    }
    
    showCutscene() {
        const gameContainer = document.getElementById('bossFight');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = `
            <div class="boss-cutscene" style="
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000;
                background: linear-gradient(45deg, #1e1b4b 0%, #7c2d12 50%, #dc2626 100%);
                display: flex; align-items: center; justify-content: center;">
                
                <div class="boss-arena-scene" style="width: 90%; max-width: 1000px; position: relative; height: 80%;">
                    
                    <!-- Arena background -->
                    <div class="arena-background" style="
                        position: absolute; width: 100%; height: 100%;
                        background: radial-gradient(circle at center, #44403c 0%, #1c1917 70%, #000 100%);
                        border-radius: 20px; overflow: hidden;">
                        
                        <!-- Arena pillars -->
                        <div style="position: absolute; left: 10%; top: 20%; width: 15px; height: 60%; 
                                    background: linear-gradient(180deg, #a8a29e, #57534e); border-radius: 8px;"></div>
                        <div style="position: absolute; right: 10%; top: 20%; width: 15px; height: 60%; 
                                    background: linear-gradient(180deg, #a8a29e, #57534e); border-radius: 8px;"></div>
                        
                        <!-- Arena floor pattern -->
                        <div style="position: absolute; bottom: 0; width: 100%; height: 30%; 
                                    background: repeating-linear-gradient(90deg, #44403c 0px, #44403c 50px, #57534e 50px, #57534e 100px);
                                    opacity: 0.3;"></div>
                    </div>
                    
                    <!-- Pronunciation King Boss -->
                    <div class="pronunciation-king" style="
                        position: absolute; right: 15%; top: 20%; width: 180px; height: 240px;">
                        
                        <!-- Crown -->
                        <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); 
                                    width: 80px; height: 40px; background: linear-gradient(45deg, #fbbf24, #f59e0b);
                                    clip-path: polygon(20% 100%, 0% 60%, 10% 40%, 25% 60%, 40% 40%, 50% 60%, 60% 40%, 75% 60%, 90% 40%, 100% 60%, 80% 100%);
                                    animation: crownGlow 3s ease-in-out infinite;"></div>
                        
                        <!-- King body -->
                        <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); 
                                    width: 120px; height: 160px; background: linear-gradient(180deg, #7c2d12, #dc2626);
                                    border-radius: 60px 60px 30px 30px; border: 4px solid #fbbf24;"></div>
                        
                        <!-- King head -->
                        <div style="position: absolute; top: 30px; left: 50%; transform: translateX(-50%); 
                                    width: 90px; height: 90px; background: #f3e8ff; border-radius: 50%;
                                    border: 3px solid #a855f7;"></div>
                        
                        <!-- Evil glowing eyes -->
                        <div style="position: absolute; top: 55px; left: 40%; width: 12px; height: 12px; 
                                    background: #dc2626; border-radius: 50%; 
                                    box-shadow: 0 0 20px #dc2626; animation: eyeFlicker 2s ease-in-out infinite;"></div>
                        <div style="position: absolute; top: 55px; right: 40%; width: 12px; height: 12px; 
                                    background: #dc2626; border-radius: 50%; 
                                    box-shadow: 0 0 20px #dc2626; animation: eyeFlicker 2s ease-in-out infinite 0.5s;"></div>
                        
                        <!-- Menacing smile -->
                        <div style="position: absolute; top: 75px; left: 50%; transform: translateX(-50%); 
                                    width: 40px; height: 20px; border: 4px solid #7c2d12; 
                                    border-top: none; border-radius: 0 0 40px 40px;"></div>
                        
                        <!-- Royal scepter -->
                        <div style="position: absolute; right: -25px; top: 80px; width: 8px; height: 140px; 
                                    background: linear-gradient(180deg, #fbbf24, #a16207); border-radius: 4px;"></div>
                        <div style="position: absolute; right: -40px; top: 65px; width: 35px; height: 30px; 
                                    background: radial-gradient(circle, #dc2626, #7c2d12); border-radius: 50%; 
                                    animation: scepterPower 2.5s ease-in-out infinite; 
                                    box-shadow: 0 0 40px #dc2626;"></div>
                        
                        <!-- Power aura -->
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                    width: 200px; height: 200px; border-radius: 50%; 
                                    background: radial-gradient(circle, rgba(220, 38, 38, 0.2), transparent); 
                                    animation: auraExpand 4s ease-in-out infinite;"></div>
                    </div>
                    
                    <!-- Hero Player -->
                    <div class="hero-player" style="
                        position: absolute; left: 18%; bottom: 25%; width: 100px; height: 140px;">
                        
                        <!-- Hero body -->
                        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); 
                                    width: 70px; height: 100px; background: linear-gradient(180deg, #4ecca3, #2ecc71);
                                    border-radius: 35px 35px 15px 15px; border: 3px solid #fbbf24;"></div>
                        
                        <!-- Hero head -->
                        <div style="position: absolute; top: 15px; left: 50%; transform: translateX(-50%); 
                                    width: 55px; height: 55px; background: #fdbcb4; border-radius: 50%;"></div>
                        
                        <!-- Determined eyes -->
                        <div style="position: absolute; top: 30px; left: 38%; width: 6px; height: 6px; 
                                    background: #1f2937; border-radius: 50%;"></div>
                        <div style="position: absolute; top: 30px; right: 38%; width: 6px; height: 6px; 
                                    background: #1f2937; border-radius: 50%;"></div>
                        
                        <!-- Brave smile -->
                        <div style="position: absolute; top: 45px; left: 50%; transform: translateX(-50%); 
                                    width: 20px; height: 10px; border: 2px solid #1f2937; 
                                    border-bottom: none; border-radius: 20px 20px 0 0;"></div>
                        
                        <!-- Hero weapon -->
                        <div style="position: absolute; right: -12px; top: 50px; width: 4px; height: 50px; 
                                    background: #a16207; border-radius: 2px;"></div>
                        <div style="position: absolute; right: -20px; top: 40px; width: 20px; height: 20px; 
                                    background: #3b82f6; border-radius: 50%; border: 2px solid #1d4ed8;"></div>
                    </div>
                    
                    <!-- Lightning effects between characters -->
                    <div class="battle-energy" style="position: absolute; left: 25%; right: 25%; top: 40%; bottom: 35%;">
                        <div style="position: absolute; width: 4px; height: 30%; left: 20%; top: 10%; 
                                    background: linear-gradient(45deg, #fbbf24, #f59e0b); 
                                    animation: lightning1 3s ease-in-out infinite; transform: rotate(15deg);"></div>
                        <div style="position: absolute; width: 4px; height: 25%; right: 30%; top: 30%; 
                                    background: linear-gradient(-45deg, #dc2626, #b91c1c); 
                                    animation: lightning2 3s ease-in-out infinite 1s; transform: rotate(-20deg);"></div>
                        <div style="position: absolute; width: 4px; height: 20%; left: 50%; top: 20%; 
                                    background: linear-gradient(90deg, #8b5cf6, #7c3aed); 
                                    animation: lightning3 3s ease-in-out infinite 2s;"></div>
                    </div>
                    
                    <!-- Story text -->
                    <div class="cutscene-text" style="
                        position: absolute; top: 5%; left: 50%; transform: translateX(-50%); 
                        background: rgba(0,0,0,0.9); color: white; padding: 25px; 
                        border-radius: 20px; max-width: 650px; text-align: center; border: 3px solid #dc2626;">
                        
                        <h3 style="color: #dc2626; margin-top: 0; font-size: 28px;">👑 最終決戰：發音之王</h3>
                        <p style="font-size: 20px; line-height: 1.6; margin: 15px 0;">
                            你終於來到了發音之王的王座前！他是所有邪惡巫師的首領，擁有強大的語音魔法！
                        </p>
                        <div style="background: rgba(220, 38, 38, 0.3); padding: 18px; border-radius: 12px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold; color: #fca5a5; font-size: 18px;">
                                ⚔️ 戰鬥規則：
                            </p>
                            <ul style="text-align: left; padding-left: 25px; margin: 10px 0; font-size: 16px;">
                                <li>每回合先選擇<strong>攻擊</strong>或<strong>防禦</strong></li>
                                <li>答對問題：<strong>攻擊成功</strong>或<strong>防禦成功</strong></li>
                                <li>答錯問題：<strong>攻擊失敗</strong>且<strong>無法防禦</strong></li>
                                <li>把Boss血量降到0就獲勝！</li>
                            </ul>
                        </div>
                        <p style="color: #fbbf24; font-size: 18px; margin: 15px 0;">
                            運用你學到的所有過去式發音知識，擊敗發音之王！
                        </p>
                        <button onclick="window.bossFight.startMainGame()" style="
                            background: linear-gradient(45deg, #dc2626, #b91c1c); color: white; border: none; 
                            padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                            cursor: pointer; margin-top: 25px; box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
                            transition: transform 0.2s ease;">
                            ⚔️ 開始最終決戰
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
            @keyframes crownGlow {
                0%, 100% { box-shadow: 0 0 20px #fbbf24; }
                50% { box-shadow: 0 0 40px #fbbf24, 0 0 60px #f59e0b; }
            }
            @keyframes eyeFlicker {
                0%, 90%, 100% { opacity: 1; }
                95% { opacity: 0.3; }
            }
            @keyframes scepterPower {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.3) rotate(180deg); }
            }
            @keyframes auraExpand {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
            }
            @keyframes lightning1 {
                0%, 80%, 100% { opacity: 0; }
                85%, 95% { opacity: 1; }
            }
            @keyframes lightning2 {
                0%, 70%, 100% { opacity: 0; }
                75%, 85% { opacity: 1; }
            }
            @keyframes lightning3 {
                0%, 60%, 100% { opacity: 0; }
                65%, 75% { opacity: 1; }
            }
            </style>
        `;
    }
    
    startMainGame() {
        this.setupGameInterface();
        this.resetGame();
        this.startBattle();
    }
    
    setupGameInterface() {
        const gameContainer = document.getElementById('bossFight');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = `
            <div class="boss-battle-game" style="
                background: linear-gradient(45deg, #1e1b4b 0%, #7c2d12 50%, #dc2626 100%);
                min-height: 100vh; position: relative; overflow: hidden;">
                
                <!-- Game Header -->
                <div class="battle-header" style="
                    position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
                    text-align: center; color: white; z-index: 100;">
                    <h2 style="margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">
                        👑 最終決戰：發音之王
                    </h2>
                </div>
                
                <!-- Battle Canvas -->
                <canvas id="bossCanvas" width="800" height="400" style="
                    position: absolute; top: 120px; left: 50%; transform: translateX(-50%);
                    border: 3px solid rgba(220, 38, 38, 0.8); border-radius: 15px; 
                    background: radial-gradient(circle at center, #44403c 0%, #1c1917 100%);">
                </canvas>
                
                <!-- Health Bars -->
                <div class="health-bars" style="
                    position: absolute; top: 540px; left: 50%; transform: translateX(-50%); 
                    width: 800px; display: flex; justify-content: space-between; z-index: 100;">
                    
                    <!-- Player Health -->
                    <div class="player-health" style="width: 350px;">
                        <div style="color: white; font-size: 18px; margin-bottom: 8px; font-weight: bold;">
                            🛡️ 英雄血量: <span id="playerHealth">100</span>/100
                        </div>
                        <div style="width: 100%; height: 25px; background: rgba(0,0,0,0.5); border-radius: 12px; overflow: hidden;">
                            <div id="playerHealthBar" style="
                                width: 100%; height: 100%; background: linear-gradient(90deg, #10b981, #059669);
                                transition: width 1s ease; border-radius: 12px;"></div>
                        </div>
                    </div>
                    
                    <!-- Boss Health -->
                    <div class="boss-health" style="width: 350px;">
                        <div style="color: white; font-size: 18px; margin-bottom: 8px; font-weight: bold; text-align: right;">
                            👑 Boss血量: <span id="bossHealth">100</span>/100
                        </div>
                        <div style="width: 100%; height: 25px; background: rgba(0,0,0,0.5); border-radius: 12px; overflow: hidden;">
                            <div id="bossHealthBar" style="
                                width: 100%; height: 100%; background: linear-gradient(90deg, #dc2626, #7f1d1d);
                                transition: width 1s ease; border-radius: 12px;"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Action Selection -->
                <div class="action-selection" style="
                    position: absolute; top: 600px; left: 50%; transform: translateX(-50%); 
                    text-align: center; background: rgba(0,0,0,0.7); padding: 20px; 
                    border-radius: 15px; z-index: 100;">
                    
                    <h3 style="color: white; margin-top: 0;">選擇你的行動：</h3>
                    <div class="action-buttons" style="margin: 20px 0;">
                        <button id="attackBtn" class="action-btn" style="
                            background: linear-gradient(45deg, #dc2626, #b91c1c); color: white; border: none; 
                            padding: 18px 30px; border-radius: 12px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; margin: 0 15px; transition: all 0.3s ease;
                            box-shadow: 0 5px 15px rgba(220, 38, 38, 0.4);">
                            ⚔️ 攻擊
                        </button>
                        <button id="defendBtn" class="action-btn" style="
                            background: linear-gradient(45deg, #3b82f6, #1d4ed8); color: white; border: none; 
                            padding: 18px 30px; border-radius: 12px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; margin: 0 15px; transition: all 0.3s ease;
                            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);">
                            🛡️ 防禦
                        </button>
                    </div>
                    <div id="actionStatus" style="color: #fbbf24; font-size: 16px; margin: 10px 0; min-height: 20px;">
                        選擇你的戰術！
                    </div>
                </div>
                
                <!-- Question Area -->
                <div class="question-area" style="
                    position: absolute; top: 720px; left: 50%; transform: translateX(-50%); 
                    background: rgba(255,255,255,0.1); padding: 25px; border-radius: 20px; 
                    max-width: 700px; text-align: center; display: none;">
                    
                    <div style="color: #e5e7eb; font-size: 20px; margin-bottom: 15px;">
                        聽這個過去式動詞的發音：
                    </div>
                    
                    <div id="bossQuestionWord" style="
                        font-size: 36px; font-weight: bold; color: #4ecca3; margin: 20px 0; 
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">
                        準備中...
                    </div>
                    
                    <div id="bossWordMeaning" style="color: #94a3b8; font-size: 16px; margin: 10px 0;"></div>
                    <div id="bossWordPronunciation" style="color: #fbbf24; font-size: 18px; margin: 10px 0;"></div>
                    
                    <button id="bossPronunciation" class="pronunciation-btn" style="
                        background: #8b5cf6; color: white; border: none; padding: 15px 25px; 
                        border-radius: 10px; margin: 15px 0; cursor: pointer; font-size: 16px;">
                        🔊 播放發音
                    </button>
                </div>
                
                <!-- Answer Choices -->
                <div class="boss-choices" style="
                    position: absolute; top: 900px; left: 50%; transform: translateX(-50%); 
                    display: none; gap: 20px;">
                    
                    <button class="boss-choice-button" data-sound="t" style="
                        background: #3498db; color: white; border: none; padding: 20px 25px; 
                        border-radius: 15px; font-size: 18px; cursor: pointer; min-width: 140px;">
                        /t/ 音
                    </button>
                    
                    <button class="boss-choice-button" data-sound="d" style="
                        background: #e74c3c; color: white; border: none; padding: 20px 25px; 
                        border-radius: 15px; font-size: 18px; cursor: pointer; min-width: 140px;">
                        /d/ 音
                    </button>
                    
                    <button class="boss-choice-button" data-sound="id" style="
                        background: #2ecc71; color: white; border: none; padding: 20px 25px; 
                        border-radius: 15px; font-size: 18px; cursor: pointer; min-width: 140px;">
                        /ɪd/ 音
                    </button>
                </div>
                
                <!-- Battle Log -->
                <div id="battleLog" style="
                    position: absolute; bottom: 20px; left: 20px; right: 20px; 
                    background: rgba(0,0,0,0.8); color: white; padding: 15px; 
                    border-radius: 10px; font-size: 16px; text-align: center; 
                    max-height: 80px; overflow-y: auto; z-index: 100;">
                    準備戰鬥...
                </div>
                
                <!-- Back Button -->
                <button class="back-btn" onclick="window.gameSystem.showGameMenu()" style="
                    position: fixed; bottom: 20px; left: 20px; background: rgba(76, 204, 163, 0.8); 
                    color: white; border: none; padding: 12px 20px; border-radius: 25px; 
                    cursor: pointer; font-weight: bold; z-index: 200;">
                    ← 返回選單
                </button>
            </div>
            
            <style>
            .action-btn:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            }
            
            .boss-choice-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            }
            
            .action-btn:disabled, .boss-choice-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none !important;
            }
            </style>
        `;
        
        // Get canvas and setup
        this.canvas = document.getElementById('bossCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupBattleControls();
        this.startBattleAnimation();
    }
    
    setupBattleControls() {
        // Action buttons
        document.getElementById('attackBtn').addEventListener('click', () => this.selectAction('attack'));
        document.getElementById('defendBtn').addEventListener('click', () => this.selectAction('defend'));
        
        // Pronunciation button
        document.getElementById('bossPronunciation').addEventListener('click', () => this.playPronunciation());
        
        // Choice buttons
        const choiceButtons = document.querySelectorAll('.boss-choice-button');
        choiceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.target.dataset.sound;
                this.makeChoice(choice);
            });
        });
    }
    
    resetGame() {
        this.bossHealth = 100;
        this.playerHealth = 100;
        this.score = 0;
        this.playerAction = null;
        this.bossAction = null;
        this.turnCounter = 0;
        this.usedQuestions = [];
        this.battleEffects = [];
        this.showingResults = false;
        this.isGameActive = true;
        
        this.updateHealthBars();
        this.updateBattleLog('最終決戰開始！選擇你的戰術！');
    }
    
    startBattle() {
        this.isGameActive = true;
        this.enableActionButtons();
    }
    
    startBattleAnimation() {
        this.animationFrame = 0;
        this.animate();
    }
    
    animate() {
        if (!this.isGameActive) return;
        
        this.drawBattleScene();
        this.animationFrame++;
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawBattleScene() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw arena background
        const gradient = this.ctx.createRadialGradient(400, 200, 0, 400, 200, 400);
        gradient.addColorStop(0, '#44403c');
        gradient.addColorStop(1, '#1c1917');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw boss
        this.drawBoss();
        
        // Draw player
        this.drawPlayer();
        
        // Draw battle effects
        this.drawBattleEffects();
    }
    
    drawBoss() {
        const bossX = 600;
        const bossY = 150;
        const pulseScale = 1 + Math.sin(this.animationFrame * 0.05) * 0.05;
        
        this.ctx.save();
        this.ctx.translate(bossX, bossY);
        this.ctx.scale(pulseScale, pulseScale);
        
        // Boss body
        this.ctx.fillStyle = '#dc2626';
        this.ctx.fillRect(-40, 0, 80, 120);
        
        // Boss head
        this.ctx.fillStyle = '#f3e8ff';
        this.ctx.beginPath();
        this.ctx.arc(0, -20, 35, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Crown
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.fillRect(-25, -50, 50, 20);
        
        // Eyes
        const eyeGlow = Math.sin(this.animationFrame * 0.1) * 0.5 + 0.5;
        this.ctx.fillStyle = `rgba(220, 38, 38, ${0.8 + eyeGlow * 0.2})`;
        this.ctx.beginPath();
        this.ctx.arc(-12, -25, 4, 0, Math.PI * 2);
        this.ctx.arc(12, -25, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Boss aura based on health
        const auraIntensity = this.bossHealth / 100;
        this.ctx.strokeStyle = `rgba(220, 38, 38, ${auraIntensity * 0.5})`;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(0, 40, 60 + Math.sin(this.animationFrame * 0.08) * 10, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawPlayer() {
        const playerX = 150;
        const playerY = 200;
        const actionScale = this.playerAction ? 1.2 : 1;
        
        this.ctx.save();
        this.ctx.translate(playerX, playerY);
        this.ctx.scale(actionScale, actionScale);
        
        // Player body
        this.ctx.fillStyle = '#4ecca3';
        this.ctx.fillRect(-25, 0, 50, 80);
        
        // Player head
        this.ctx.fillStyle = '#fdbcb4';
        this.ctx.beginPath();
        this.ctx.arc(0, -15, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player eyes
        this.ctx.fillStyle = '#1f2937';
        this.ctx.beginPath();
        this.ctx.arc(-8, -18, 2, 0, Math.PI * 2);
        this.ctx.arc(8, -18, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Weapon/shield based on action
        if (this.playerAction === 'attack') {
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.fillRect(20, -10, 5, 40);
            this.ctx.fillStyle = '#3b82f6';
            this.ctx.beginPath();
            this.ctx.arc(22, -15, 8, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.playerAction === 'defend') {
            this.ctx.fillStyle = '#6b7280';
            this.ctx.fillRect(-30, -20, 15, 50);
            this.ctx.strokeStyle = '#1d4ed8';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(-30, -20, 15, 50);
        }
        
        this.ctx.restore();
    }
    
    drawBattleEffects() {
        this.battleEffects.forEach((effect, index) => {
            this.ctx.save();
            
            switch(effect.type) {
                case 'hit':
                    this.ctx.fillStyle = `rgba(220, 38, 38, ${effect.opacity})`;
                    this.ctx.beginPath();
                    this.ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
                    
                case 'block':
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${effect.opacity})`;
                    this.ctx.lineWidth = 5;
                    this.ctx.beginPath();
                    this.ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
                    this.ctx.stroke();
                    break;
                    
                case 'spark':
                    this.ctx.fillStyle = `rgba(251, 191, 36, ${effect.opacity})`;
                    this.ctx.fillRect(effect.x, effect.y, 3, 3);
                    break;
            }
            
            // Update effect
            effect.life--;
            effect.opacity = effect.life / effect.maxLife;
            
            if (effect.life <= 0) {
                this.battleEffects.splice(index, 1);
            }
            
            this.ctx.restore();
        });
    }
    
    addBattleEffect(type, x, y, size = 20) {
        this.battleEffects.push({
            type: type,
            x: x,
            y: y,
            size: size,
            life: 30,
            maxLife: 30,
            opacity: 1
        });
    }
    
    selectAction(action) {
        if (this.showingResults) return;
        
        this.playerAction = action;
        this.disableActionButtons();
        
        const actionStatus = document.getElementById('actionStatus');
        if (action === 'attack') {
            actionStatus.textContent = '⚔️ 攻擊模式已選擇！答對問題將對Boss造成傷害！';
            actionStatus.style.color = '#dc2626';
        } else {
            actionStatus.textContent = '🛡️ 防禦模式已選擇！答對問題將減少受到的傷害！';
            actionStatus.style.color = '#3b82f6';
        }
        
        // Generate boss action
        this.bossAction = Math.random() < 0.7 ? 'attack' : 'defend';
        
        setTimeout(() => {
            this.showQuestion();
        }, 1500);
    }
    
    showQuestion() {
        this.generateBossQuestion();
        
        const questionArea = document.querySelector('.question-area');
        const choices = document.querySelector('.boss-choices');
        
        if (questionArea) questionArea.style.display = 'block';
        if (choices) choices.style.display = 'flex';
        
        // Auto-play pronunciation
        setTimeout(() => this.playPronunciation(), 800);
    }
    
    generateBossQuestion() {
        // Get available questions
        const allQuestions = [];
        Object.keys(this.bossQuestions).forEach(type => {
            this.bossQuestions[type].forEach(wordObj => {
                if (!this.usedQuestions.includes(wordObj.word)) {
                    allQuestions.push({ ...wordObj, type });
                }
            });
        });
        
        if (allQuestions.length === 0) {
            this.usedQuestions = [];
            return this.generateBossQuestion();
        }
        
        // Pick random question
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        this.currentQuestion = allQuestions[randomIndex];
        this.usedQuestions.push(this.currentQuestion.word);
        
        this.updateQuestionDisplay();
    }
    
    updateQuestionDisplay() {
        if (!this.currentQuestion) return;
        
        const questionWord = document.getElementById('bossQuestionWord');
        const wordMeaning = document.getElementById('bossWordMeaning');
        const wordPronunciation = document.getElementById('bossWordPronunciation');
        
        if (questionWord) {
            questionWord.textContent = this.currentQuestion.word;
        }
        
        if (wordMeaning) {
            wordMeaning.textContent = `意思：${this.currentQuestion.meaning}`;
        }
        
        if (wordPronunciation) {
            wordPronunciation.textContent = this.currentQuestion.pronunciation;
        }
        
        // Reset choice buttons
        const choiceButtons = document.querySelectorAll('.boss-choice-button');
        choiceButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    }
    
    playPronunciation() {
        if (!this.currentQuestion) return;
        
        if (window.SoundSystem && window.SoundSystem.speakWord) {
            window.SoundSystem.speakWord(this.currentQuestion.word);
        } else if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.currentQuestion.word);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }
    
    makeChoice(choice) {
        if (!this.currentQuestion || this.showingResults) return;
        
        const isCorrect = choice === this.currentQuestion.type;
        
        // Disable choice buttons
        const choiceButtons = document.querySelectorAll('.boss-choice-button');
        choiceButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
        
        this.resolveBattle(isCorrect);
    }
    
    resolveBattle(playerCorrect) {
        this.showingResults = true;
        
        let battleResult = '';
        
        if (this.playerAction === 'attack') {
            if (playerCorrect) {
                // Player attacks successfully
                const damage = 20 + Math.floor(Math.random() * 10);
                this.bossHealth = Math.max(0, this.bossHealth - damage);
                this.addBattleEffect('hit', 600, 200, 30);
                battleResult = `⚔️ 攻擊成功！Boss受到 ${damage} 點傷害！`;
                
                if (window.SoundSystem) {
                    window.SoundSystem.play('correct');
                }
                
                this.score += 15;
            } else {
                // Player attack fails
                battleResult = '❌ 攻擊失敗！答錯了問題！';
                
                if (window.SoundSystem) {
                    window.SoundSystem.play('wrong');
                }
            }
        } else {
            // Player defending
            if (playerCorrect) {
                // Defense successful
                battleResult = '🛡️ 防禦成功！完美的防守！';
                this.addBattleEffect('block', 150, 250, 40);
                
                if (window.SoundSystem) {
                    window.SoundSystem.play('correct');
                }
                
                this.score += 10;
            } else {
                // Defense fails
                battleResult = '💥 防禦失敗！答錯問題無法防守！';
                
                if (window.SoundSystem) {
                    window.SoundSystem.play('wrong');
                }
            }
        }
        
        // Boss attacks if player failed or boss chooses to attack
        if (!playerCorrect || this.bossAction === 'attack') {
            const bossDamage = playerCorrect && this.playerAction === 'defend' ? 5 : 15 + Math.floor(Math.random() * 10);
            if (!(playerCorrect && this.playerAction === 'defend')) {
                this.playerHealth = Math.max(0, this.playerHealth - bossDamage);
                this.addBattleEffect('hit', 150, 250, 25);
                battleResult += ` 👑 Boss反擊造成 ${bossDamage} 點傷害！`;
            }
        }
        
        this.updateBattleLog(battleResult);
        this.updateHealthBars();
        
        // Check win/lose conditions
        setTimeout(() => {
            if (this.bossHealth <= 0) {
                this.playerWins();
            } else if (this.playerHealth <= 0) {
                this.playerLoses();
            } else {
                this.nextTurn();
            }
        }, 2000);
    }
    
    nextTurn() {
        this.showingResults = false;
        this.playerAction = null;
        this.bossAction = null;
        this.turnCounter++;
        
        // Hide question area
        const questionArea = document.querySelector('.question-area');
        const choices = document.querySelector('.boss-choices');
        
        if (questionArea) questionArea.style.display = 'none';
        if (choices) choices.style.display = 'none';
        
        // Reset action status
        const actionStatus = document.getElementById('actionStatus');
        if (actionStatus) {
            actionStatus.textContent = '選擇你的下一個戰術！';
            actionStatus.style.color = '#fbbf24';
        }
        
        this.enableActionButtons();
    }
    
    playerWins() {
        this.isGameActive = false;
        
        // Add victory effects
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.addBattleEffect('spark', 
                    Math.random() * this.canvas.width, 
                    Math.random() * this.canvas.height, 5);
            }, i * 100);
        }
        
        this.updateBattleLog('🎉 勝利！你擊敗了發音之王！');
        
        // Update final score
        this.score += 50; // Victory bonus
        this.gameSystem.updateScore('bossFight', this.score);
        
        setTimeout(() => {
            this.showVictoryScreen();
        }, 2000);
    }
    
    playerLoses() {
        this.isGameActive = false;
        
        this.updateBattleLog('💀 失敗！你被發音之王擊敗了...');
        
        setTimeout(() => {
            this.showDefeatScreen();
        }, 2000);
    }
    
    showVictoryScreen() {
        const container = document.getElementById('bossFight');
        if (container) {
            container.innerHTML = `
                <div class="victory-screen" style="
                    background: linear-gradient(45deg, #10b981, #059669, #fbbf24); 
                    min-height: 100vh; display: flex; align-items: center; justify-content: center;
                    position: relative; overflow: hidden;">
                    
                    <!-- Victory sparkles -->
                    <div style="position: absolute; width: 100%; height: 100%; overflow: hidden;">
                        ${Array.from({length: 20}, (_, i) => `
                            <div style="position: absolute; 
                                       left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; 
                                       width: 4px; height: 4px; background: #fbbf24; border-radius: 50%;
                                       animation: sparkle ${2 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s;"></div>
                        `).join('')}
                    </div>
                    
                    <div class="victory-content" style="
                        text-align: center; color: white; max-width: 800px; padding: 40px; 
                        background: rgba(0,0,0,0.3); border-radius: 20px; z-index: 10;">
                        
                        <div style="font-size: 120px; margin: 30px 0; animation: bounce 2s ease-in-out infinite;">
                            👑🎉
                        </div>
                        
                        <h1 style="font-size: 48px; margin: 30px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.5);">
                            恭喜！你擊敗了發音之王！
                        </h1>
                        
                        <p style="font-size: 24px; margin: 25px 0; line-height: 1.5;">
                            你已經掌握了英語過去式的所有發音規則！<br>
                            從此，語言不再是障礙，而是你征服世界的利器！
                        </p>
                        
                        <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; margin: 30px 0;">
                            <h3>最終成績</h3>
                            <div style="font-size: 20px; margin: 10px 0;">
                                最終分數: <strong style="color: #fbbf24;">${this.score}</strong>
                            </div>
                            <div style="font-size: 18px; margin: 10px 0;">
                                戰鬥回合: <strong>${this.turnCounter}</strong>
                            </div>
                            <div style="font-size: 18px; margin: 10px 0;">
                                完成度: <strong style="color: #10b981;">100%</strong>
                            </div>
                        </div>
                        
                        <div style="margin: 40px 0;">
                            <button onclick="window.gameSystem.showGameMenu()" style="
                                background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                                padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                                cursor: pointer; margin: 0 15px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);">
                                🏠 返回大廳
                            </button>
                            
                            <button onclick="window.location.reload()" style="
                                background: linear-gradient(45deg, #8b5cf6, #7c3aed); color: white; border: none; 
                                padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                                cursor: pointer; margin: 0 15px; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);">
                                🔄 重新開始冒險
                            </button>
                        </div>
                    </div>
                    
                    <style>
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes sparkle {
                        0%, 100% { opacity: 0; transform: scale(0); }
                        50% { opacity: 1; transform: scale(1); }
                    }
                    </style>
                </div>
            `;
        }
        
        // Mark boss fight as completed
        setTimeout(() => {
            this.gameSystem.checkLevelCompletion('bossFight');
        }, 1000);
    }
    
    showDefeatScreen() {
        const container = document.getElementById('bossFight');
        if (container) {
            container.innerHTML = `
                <div class="defeat-screen" style="
                    background: linear-gradient(45deg, #7f1d1d, #dc2626, #1f2937); 
                    min-height: 100vh; display: flex; align-items: center; justify-content: center;">
                    
                    <div class="defeat-content" style="
                        text-align: center; color: white; max-width: 600px; padding: 40px; 
                        background: rgba(0,0,0,0.5); border-radius: 20px;">
                        
                        <div style="font-size: 80px; margin: 20px 0;">💀</div>
                        
                        <h1 style="font-size: 36px; margin: 20px 0; color: #dc2626;">
                            你被發音之王擊敗了...
                        </h1>
                        
                        <p style="font-size: 18px; margin: 20px 0; line-height: 1.5;">
                            別灰心！每個英雄都需要經歷挫折才能成長。<br>
                            回去加強練習，再次挑戰發音之王吧！
                        </p>
                        
                        <div style="margin: 30px 0;">
                            <button onclick="window.gameSystem.showGameMenu()" style="
                                background: #4ecca3; color: white; border: none; 
                                padding: 15px 30px; border-radius: 10px; font-size: 18px; 
                                cursor: pointer; margin: 0 10px;">
                                返回練習
                            </button>
                            
                            <button onclick="window.bossFight.startGame()" style="
                                background: #dc2626; color: white; border: none; 
                                padding: 15px 30px; border-radius: 10px; font-size: 18px; 
                                cursor: pointer; margin: 0 10px;">
                                再次挑戰
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    enableActionButtons() {
        const attackBtn = document.getElementById('attackBtn');
        const defendBtn = document.getElementById('defendBtn');
        
        if (attackBtn) {
            attackBtn.disabled = false;
            attackBtn.style.opacity = '1';
        }
        
        if (defendBtn) {
            defendBtn.disabled = false;
            defendBtn.style.opacity = '1';
        }
    }
    
    disableActionButtons() {
        const attackBtn = document.getElementById('attackBtn');
        const defendBtn = document.getElementById('defendBtn');
        
        if (attackBtn) {
            attackBtn.disabled = true;
            attackBtn.style.opacity = '0.5';
        }
        
        if (defendBtn) {
            defendBtn.disabled = true;
            defendBtn.style.opacity = '0.5';
        }
    }
    
    updateHealthBars() {
        const playerBar = document.getElementById('playerHealthBar');
        const bossBar = document.getElementById('bossHealthBar');
        const playerHealthText = document.getElementById('playerHealth');
        const bossHealthText = document.getElementById('bossHealth');
        
        if (playerBar) {
            playerBar.style.width = this.playerHealth + '%';
        }
        
        if (bossBar) {
            bossBar.style.width = this.bossHealth + '%';
        }
        
        if (playerHealthText) {
            playerHealthText.textContent = this.playerHealth;
        }
        
        if (bossHealthText) {
            bossHealthText.textContent = this.bossHealth;
        }
    }
    
    updateBattleLog(message) {
        const battleLog = document.getElementById('battleLog');
        if (battleLog) {
            battleLog.innerHTML = message;
        }
    }
    
    stopGame() {
        this.isGameActive = false;
        this.battleEffects = [];
        
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checkGameSystem = () => {
        if (window.gameSystem) {
            window.bossFight = new BossFight(window.gameSystem);
            console.log('Boss Fight initialized');
        } else {
            setTimeout(checkGameSystem, 100);
        }
    };
    checkGameSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BossFight;
}
