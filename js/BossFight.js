/**
 * Boss Fight Game - Complete Fixed Version with Balanced Combat
 * Final battle against the Pronunciation King with proper attack/defense mechanics
 */
class BossFightGame {
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
        this.actionSelected = false;
        this.questionAnswered = false;
        this.turnCounter = 0;
        this.questionsCorrect = 0;
        this.questionsTotal = 0;
        
        // Battle animations and effects
        this.battleEffects = [];
        this.animationFrame = 0;
        this.gamePhase = 'preparation'; // 'preparation', 'battle', 'victory', 'defeat'
        
        // Boss battle questions
        this.bossQuestions = {
            t: [
                { word: 'watched', pronunciation: '/wɑtʃt/', meaning: '觀看' },
                { word: 'crossed', pronunciation: '/krɔst/', meaning: '穿越' },
                { word: 'kicked', pronunciation: '/kɪkt/', meaning: '踢' },
                { word: 'helped', pronunciation: '/hɛlpt/', meaning: '幫助' },
                { word: 'worked', pronunciation: '/wɜrkt/', meaning: '工作' },
                { word: 'washed', pronunciation: '/wɑʃt/', meaning: '洗' },
                { word: 'jumped', pronunciation: '/dʒʌmpt/', meaning: '跳' },
                { word: 'danced', pronunciation: '/dænst/', meaning: '跳舞' }
            ],
            d: [
                { word: 'played', pronunciation: '/pleɪd/', meaning: '玩' },
                { word: 'lived', pronunciation: '/lɪvd/', meaning: '住' },
                { word: 'moved', pronunciation: '/muvd/', meaning: '移動' },
                { word: 'called', pronunciation: '/kɔld/', meaning: '叫' },
                { word: 'loved', pronunciation: '/lʌvd/', meaning: '愛' },
                { word: 'saved', pronunciation: '/seɪvd/', meaning: '拯救' },
                { word: 'opened', pronunciation: '/ˈoʊpənd/', meaning: '開' },
                { word: 'closed', pronunciation: '/kloʊzd/', meaning: '關' }
            ],
            id: [
                { word: 'wanted', pronunciation: '/ˈwɑntɪd/', meaning: '想要' },
                { word: 'needed', pronunciation: '/ˈnidɪd/', meaning: '需要' },
                { word: 'decided', pronunciation: '/dɪˈsaɪdɪd/', meaning: '決定' },
                { word: 'started', pronunciation: '/ˈstɑrtɪd/', meaning: '開始' },
                { word: 'ended', pronunciation: '/ˈɛndɪd/', meaning: '結束' },
                { word: 'visited', pronunciation: '/ˈvɪzɪtɪd/', meaning: '拜訪' },
                { word: 'created', pronunciation: '/kriˈeɪtɪd/', meaning: '創造' },
                { word: 'painted', pronunciation: '/ˈpeɪntɪd/', meaning: '畫' }
            ]
        };
        
        this.usedQuestions = [];
        this.init();
    }
    
    init() {
        console.log('Initializing Complete Boss Fight with Fixed Combat');
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
        
        // Use the already created complete boss fight cutscene from BossFight-COMPLETE.js
        gameContainer.innerHTML = this.createCutsceneHTML();
    }
    
    createCutsceneHTML() {
        return `
            <div class="boss-cutscene" style="
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000;
                background: linear-gradient(45deg, #1e1b4b 0%, #7c2d12 50%, #dc2626 100%);
                display: flex; align-items: center; justify-content: center;">
                
                <div class="boss-arena-scene" style="width: 90%; max-width: 1000px; position: relative; height: 80%;">
                    
                    <!-- Arena background with the complete visual from BossFight-COMPLETE.js -->
                    <div class="arena-background" style="
                        position: absolute; width: 100%; height: 100%;
                        background: radial-gradient(circle at center, #44403c 0%, #1c1917 70%, #000 100%);
                        border-radius: 20px; overflow: hidden;">
                    </div>
                    
                    <!-- Complete Boss Visual from BossFight-COMPLETE.js -->
                    <div class="pronunciation-king" style="position: absolute; right: 15%; top: 20%; width: 180px; height: 240px;">
                        <!-- Crown -->
                        <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); 
                                    width: 80px; height: 40px; background: linear-gradient(45deg, #fbbf24, #f59e0b);
                                    clip-path: polygon(20% 100%, 0% 60%, 10% 40%, 25% 60%, 40% 40%, 50% 60%, 60% 40%, 75% 60%, 90% 40%, 100% 60%, 80% 100%);
                                    animation: crownGlow 3s ease-in-out infinite;"></div>
                        
                        <!-- Complete Boss from BossFight-COMPLETE.js would go here -->
                    </div>
                    
                    <!-- Story text -->
                    <div class="cutscene-text" style="
                        position: absolute; top: 5%; left: 50%; transform: translateX(-50%); 
                        background: rgba(0,0,0,0.9); color: white; padding: 25px; 
                        border-radius: 20px; max-width: 650px; text-align: center; border: 3px solid #dc2626;">
                        
                        <h3 style="color: #dc2626; margin-top: 0; font-size: 28px;">👑 最終決戰：發音之王</h3>
                        <p style="font-size: 20px; line-height: 1.6; margin: 15px 0;">
                            你終於來到了發音之王的王座前！運用你學到的所有語音知識擊敗他！
                        </p>
                        <div style="background: rgba(220, 38, 38, 0.3); padding: 18px; border-radius: 12px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold; color: #fca5a5; font-size: 18px;">
                                ⚔️ 戰鬥規則：
                            </p>
                            <ul style="text-align: left; padding-left: 25px; margin: 10px 0; font-size: 16px;">
                                <li><strong>選擇行動</strong>：每回合先選擇攻擊或防禦</li>
                                <li><strong>答題決定結果</strong>：答對問題行動成功，答錯則失敗</li>
                                <li><strong>攻擊成功</strong>：對Boss造成傷害</li>
                                <li><strong>防禦成功</strong>：減少受到的傷害</li>
                                <li><strong>勝利條件</strong>：把Boss血量降到0</li>
                            </ul>
                        </div>
                        <button onclick="window.bossFightGame.startMainGame()" style="
                            background: linear-gradient(45deg, #dc2626, #b91c1c); color: white; border: none; 
                            padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                            cursor: pointer; margin-top: 25px; box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);">
                            ⚔️ 開始最終決戰
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    startMainGame() {
        this.setupGameInterface();
        this.resetGame();
        this.startBattleLoop();
    }
    
    setupGameInterface() {
        const gameContainer = document.getElementById('bossFight');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = `
            <div class="boss-battle-interface" style="
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
                
                <!-- Health Bars -->
                <div class="health-display" style="
                    position: absolute; top: 70px; left: 50%; transform: translateX(-50%); 
                    width: 90%; max-width: 800px; display: flex; justify-content: space-between; z-index: 100;">
                    
                    <!-- Player Health -->
                    <div class="player-health-container" style="width: 45%;">
                        <div style="color: white; font-size: 18px; margin-bottom: 8px; font-weight: bold;">
                            🛡️ 英雄血量: <span id="playerHealthText">100</span>/100
                        </div>
                        <div style="width: 100%; height: 25px; background: rgba(0,0,0,0.6); border-radius: 12px; overflow: hidden; border: 2px solid #4ecca3;">
                            <div id="playerHealthBar" style="
                                width: 100%; height: 100%; background: linear-gradient(90deg, #10b981, #059669);
                                transition: width 1s ease; border-radius: 12px;"></div>
                        </div>
                    </div>
                    
                    <!-- Boss Health -->
                    <div class="boss-health-container" style="width: 45%;">
                        <div style="color: white; font-size: 18px; margin-bottom: 8px; font-weight: bold; text-align: right;">
                            👑 Boss血量: <span id="bossHealthText">100</span>/100
                        </div>
                        <div style="width: 100%; height: 25px; background: rgba(0,0,0,0.6); border-radius: 12px; overflow: hidden; border: 2px solid #dc2626;">
                            <div id="bossHealthBar" style="
                                width: 100%; height: 100%; background: linear-gradient(90deg, #dc2626, #7f1d1d);
                                transition: width 1s ease; border-radius: 12px;"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Battle Canvas -->
                <canvas id="bossCanvas" width="800" height="400" style="
                    position: absolute; top: 150px; left: 50%; transform: translateX(-50%);
                    border: 3px solid rgba(220, 38, 38, 0.8); border-radius: 15px; 
                    background: radial-gradient(circle at center, #44403c 0%, #1c1917 100%);">
                </canvas>
                
                <!-- Action Selection Phase -->
                <div id="actionPhase" class="action-selection" style="
                    position: absolute; top: 570px; left: 50%; transform: translateX(-50%); 
                    text-align: center; background: rgba(0,0,0,0.8); padding: 20px; 
                    border-radius: 15px; z-index: 100; display: block;">
                    
                    <h3 style="color: white; margin-top: 0;">⚔️ 選擇你的戰術：</h3>
                    <div class="action-buttons" style="margin: 20px 0;">
                        <button id="attackBtn" class="action-btn" style="
                            background: linear-gradient(45deg, #dc2626, #b91c1c); color: white; border: none; 
                            padding: 18px 30px; border-radius: 12px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; margin: 0 15px; transition: all 0.3s ease;
                            box-shadow: 0 5px 15px rgba(220, 38, 38, 0.4);">
                            ⚔️ 攻擊 Boss
                        </button>
                        <button id="defendBtn" class="action-btn" style="
                            background: linear-gradient(45deg, #3b82f6, #1d4ed8); color: white; border: none; 
                            padding: 18px 30px; border-radius: 12px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; margin: 0 15px; transition: all 0.3s ease;
                            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);">
                            🛡️ 防禦準備
                        </button>
                    </div>
                    <div id="actionStatus" style="color: #fbbf24; font-size: 16px; margin: 10px 0; min-height: 20px;">
                        選擇你的戰術！
                    </div>
                </div>
                
                <!-- Question Phase -->
                <div id="questionPhase" class="question-area" style="
                    position: absolute; top: 570px; left: 50%; transform: translateX(-50%); 
                    background: rgba(255,255,255,0.1); padding: 25px; border-radius: 20px; 
                    max-width: 700px; text-align: center; display: none; z-index: 100;
                    backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3);">
                    
                    <div style="color: #e5e7eb; font-size: 20px; margin-bottom: 15px;">
                        🎯 戰鬥中！聽這個過去式動詞的發音：
                    </div>
                    
                    <div id="bossQuestionWord" style="
                        font-size: 36px; font-weight: bold; color: #4ecca3; margin: 20px 0; 
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.7); min-height: 45px;">
                        準備中...
                    </div>
                    
                    <div id="bossWordMeaning" style="color: #94a3b8; font-size: 16px; margin: 10px 0;"></div>
                    <div id="bossWordPronunciation" style="color: #fbbf24; font-size: 18px; margin: 10px 0;"></div>
                    
                    <button id="bossPronunciation" class="pronunciation-btn" style="
                        background: #8b5cf6; color: white; border: none; padding: 15px 25px; 
                        border-radius: 10px; margin: 15px 0; cursor: pointer; font-size: 16px;
                        transition: transform 0.3s ease;">
                        🔊 播放發音
                    </button>
                </div>
                
                <!-- Answer Choices -->
                <div id="choicesPhase" class="boss-choices" style="
                    position: absolute; top: 750px; left: 50%; transform: translateX(-50%); 
                    display: none; gap: 20px; z-index: 100;">
                    
                    <button class="boss-choice-button" data-sound="t" style="
                        background: linear-gradient(45deg, #3498db, #2980b9); color: white; border: none; 
                        padding: 20px 25px; border-radius: 15px; font-size: 18px; cursor: pointer; 
                        min-width: 140px; font-weight: bold; transition: all 0.3s ease;
                        box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);">
                        🔵 /t/ 音<br>
                        <span style="font-size: 14px; opacity: 0.9;">watched, kicked</span>
                    </button>
                    
                    <button class="boss-choice-button" data-sound="d" style="
                        background: linear-gradient(45deg, #e74c3c, #c0392b); color: white; border: none; 
                        padding: 20px 25px; border-radius: 15px; font-size: 18px; cursor: pointer; 
                        min-width: 140px; font-weight: bold; transition: all 0.3s ease;
                        box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);">
                        🔴 /d/ 音<br>
                        <span style="font-size: 14px; opacity: 0.9;">played, lived</span>
                    </button>
                    
                    <button class="boss-choice-button" data-sound="id" style="
                        background: linear-gradient(45deg, #2ecc71, #27ae60); color: white; border: none; 
                        padding: 20px 25px; border-radius: 15px; font-size: 18px; cursor: pointer; 
                        min-width: 140px; font-weight: bold; transition: all 0.3s ease;
                        box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);">
                        🟢 /ɪd/ 音<br>
                        <span style="font-size: 14px; opacity: 0.9;">wanted, needed</span>
                    </button>
                </div>
                
                <!-- Battle Status -->
                <div class="battle-status" style="
                    position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%);
                    background: rgba(0,0,0,0.8); color: white; padding: 15px 25px; 
                    border-radius: 10px; text-align: center; z-index: 100; min-width: 400px;">
                    
                    <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                        <div>回合: <span id="turnCounter" style="color: #fbbf24; font-weight: bold;">1</span></div>
                        <div>正確: <span id="questionsCorrect" style="color: #4ecca3; font-weight: bold;">0</span></div>
                        <div>分數: <span id="bossScore" style="color: #e5e7eb; font-weight: bold;">0</span></div>
                    </div>
                    
                    <div id="battleLog" style="
                        margin: 10px 0; font-size: 16px; min-height: 20px; color: #e5e7eb;">
                        準備戰鬥...選擇你的戰術！
                    </div>
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
                box-shadow: 0 8px 20px rgba(0,0,0,0.4);
            }
            
            .boss-choice-button:hover {
                transform: translateY(-3px) scale(1.05);
            }
            
            .pronunciation-btn:hover {
                transform: translateY(-2px) scale(1.05);
            }
            
            .action-btn:disabled, .boss-choice-button:disabled {
                opacity: 0.5 !important;
                cursor: not-allowed !important;
                transform: none !important;
            }
            
            .action-btn.selected {
                box-shadow: 0 0 25px currentColor;
                transform: scale(1.1);
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
                const choice = e.target.dataset.sound || e.target.closest('.boss-choice-button').dataset.sound;
                if (choice) {
                    this.makeChoice(choice);
                }
            });
        });
    }
    
    resetGame() {
        this.bossHealth = 100;
        this.playerHealth = 100;
        this.score = 0;
        this.playerAction = null;
        this.actionSelected = false;
        this.questionAnswered = false;
        this.turnCounter = 1;
        this.questionsCorrect = 0;
        this.questionsTotal = 0;
        this.usedQuestions = [];
        this.battleEffects = [];
        this.gamePhase = 'battle';
        this.isGameActive = true;
        
        this.updateUI();
        this.updateBattleLog('選擇你的戰術開始戰鬥！');
    }
    
    startBattleLoop() {
        this.gamePhase = 'battle';
        this.showActionPhase();
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
        const healthPercent = this.bossHealth / 100;
        const pulseScale = 1 + Math.sin(this.animationFrame * 0.05) * 0.05;
        
        this.ctx.save();
        this.ctx.translate(bossX, bossY);
        this.ctx.scale(pulseScale, pulseScale);
        
        // Boss body
        this.ctx.fillStyle = `rgba(220, 38, 38, ${0.8 + healthPercent * 0.2})`;
        this.ctx.fillRect(-40, 0, 80, 120);
        
        // Boss head
        this.ctx.fillStyle = '#f3e8ff';
        this.ctx.beginPath();
        this.ctx.arc(0, -20, 35, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Crown
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.fillRect(-25, -50, 50, 20);
        
        // Evil eyes with intensity based on health
        const eyeGlow = (Math.sin(this.animationFrame * 0.1) * 0.5 + 0.5) * healthPercent;
        this.ctx.fillStyle = `rgba(220, 38, 38, ${0.8 + eyeGlow * 0.2})`;
        this.ctx.beginPath();
        this.ctx.arc(-12, -25, 4, 0, Math.PI * 2);
        this.ctx.arc(12, -25, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Boss aura
        this.ctx.strokeStyle = `rgba(220, 38, 38, ${healthPercent * 0.5})`;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(0, 40, 60 + Math.sin(this.animationFrame * 0.08) * 10, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawPlayer() {
        const playerX = 150;
        const playerY = 200;
        const healthPercent = this.playerHealth / 100;
        const actionScale = this.playerAction ? 1.2 : 1;
        
        this.ctx.save();
        this.ctx.translate(playerX, playerY);
        this.ctx.scale(actionScale, actionScale);
        
        // Player body
        this.ctx.fillStyle = `rgba(76, 204, 163, ${0.8 + healthPercent * 0.2})`;
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
        
        // Show action state
        if (this.playerAction === 'attack') {
            // Sword
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.fillRect(20, -10, 5, 40);
            this.ctx.fillStyle = '#3b82f6';
            this.ctx.beginPath();
            this.ctx.arc(22, -15, 8, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.playerAction === 'defend') {
            // Shield
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
            }
            
            // Update effect
            effect.life--;
            effect.opacity = effect.life / effect.maxLife;
            if (effect.size < 50) effect.size += 2;
            
            if (effect.life <= 0) {
                this.battleEffects.splice(index, 1);
            }
            
            this.ctx.restore();
        });
    }
    
    showActionPhase() {
        document.getElementById('actionPhase').style.display = 'block';
        document.getElementById('questionPhase').style.display = 'none';
        document.getElementById('choicesPhase').style.display = 'none';
        
        this.actionSelected = false;
        this.playerAction = null;
        
        // Enable action buttons
        document.getElementById('attackBtn').disabled = false;
        document.getElementById('defendBtn').disabled = false;
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        this.updateBattleLog('選擇你的戰術！');
    }
    
    selectAction(action) {
        this.playerAction = action;
        this.actionSelected = true;
        
        // Disable action buttons and show selection
        document.getElementById('attackBtn').disabled = true;
        document.getElementById('defendBtn').disabled = true;
        
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        const selectedBtn = action === 'attack' ? 'attackBtn' : 'defendBtn';
        document.getElementById(selectedBtn).classList.add('selected');
        
        const actionNames = { attack: '⚔️ 攻擊', defend: '🛡️ 防禦' };
        const actionDesc = { 
            attack: '答對問題將對Boss造成重大傷害！', 
            defend: '答對問題將減少受到的傷害！' 
        };
        
        document.getElementById('actionStatus').textContent = `${actionNames[action]}已選擇！${actionDesc[action]}`;
        this.updateBattleLog(`你選擇了${actionNames[action]}！準備回答問題...`);
        
        // Auto-proceed to question phase
        setTimeout(() => {
            this.showQuestionPhase();
        }, 1500);
    }
    
    showQuestionPhase() {
        document.getElementById('actionPhase').style.display = 'none';
        document.getElementById('questionPhase').style.display = 'block';
        document.getElementById('choicesPhase').style.display = 'flex';
        
        this.generateBossQuestion();
        this.questionAnswered = false;
        
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
            wordPronunciation.textContent = `音標：${this.currentQuestion.pronunciation}`;
        }
        
        // Reset choice buttons
        const choiceButtons = document.querySelectorAll('.boss-choice-button');
        choiceButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.transform = '';
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
        if (!this.currentQuestion || this.questionAnswered) return;
        
        this.questionAnswered = true;
        this.questionsTotal++;
        const isCorrect = choice === this.currentQuestion.type;
        
        // Disable choice buttons
        const choiceButtons = document.querySelectorAll('.boss-choice-button');
        choiceButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
        
        if (isCorrect) {
            this.questionsCorrect++;
        }
        
        this.resolveBattle(isCorrect);
    }
    
    resolveBattle(playerCorrect) {
        let battleResult = '';
        let playerDamage = 0;
        let bossDamage = 0;
        
        if (this.playerAction === 'attack') {
            if (playerCorrect) {
                // Successful attack
                bossDamage = 25 + Math.floor(Math.random() * 10); // 25-35 damage
                this.bossHealth = Math.max(0, this.bossHealth - bossDamage);
                this.score += 20;
                
                this.addBattleEffect('hit', 600, 200, 30);
                battleResult = `⚔️ 攻擊成功！對Boss造成 ${bossDamage} 點傷害！`;
                
                if (window.SoundSystem) {
                    window.SoundSystem.play('correct');
                }
            } else {
                // Failed attack - Boss counter-attacks
                playerDamage = 20 + Math.floor(Math.random() * 10); // 20-30 damage
                this.playerHealth = Math.max(0, this.playerHealth - playerDamage);
                
                this.addBattleEffect('hit', 150, 250, 25);
                battleResult = `❌ 攻擊失敗！Boss反擊造成 ${playerDamage} 點傷害！`;
                
                if (window.SoundSystem) {
                    window.SoundSystem.play('wrong');
                }
            }
        } else if (this.playerAction === 'defend') {
            if (playerCorrect) {
                // Successful defense - minimal damage
                playerDamage = Math.floor(Math.random() * 5); // 0-5 damage
                this.playerHealth = Math.max(0, this.playerHealth - playerDamage);
                this.score += 10;
                
                this.addBattleEffect('block', 150, 250, 40);
                battleResult = `🛡️ 防禦成功！只受到 ${playerDamage} 點傷害！`;
                
                if (window.SoundSystem) {
                    window.SoundSystem.play('correct');
                }
            } else {
                // Failed defense - normal damage
                playerDamage = 15 + Math.floor(Math.random() * 8); // 15-23 damage
                this.playerHealth = Math.max(0, this.playerHealth - playerDamage);
                
                this.addBattleEffect('hit', 150, 250, 25);
                battleResult = `💥 防禦失敗！Boss攻擊造成 ${playerDamage} 點傷害！`;
                
                if (window.SoundSystem) {
                    window.SoundSystem.play('wrong');
                }
            }
        }
        
        this.updateBattleLog(battleResult);
        this.updateUI();
        
        // Check win/lose conditions
        setTimeout(() => {
            if (this.bossHealth <= 0) {
                this.playerWins();
            } else if (this.playerHealth <= 0) {
                this.playerLoses();
            } else {
                this.nextTurn();
            }
        }, 2500);
    }
    
    nextTurn() {
        this.turnCounter++;
        this.currentQuestion = null;
        
        setTimeout(() => {
            this.showActionPhase();
        }, 1000);
    }
    
    playerWins() {
        this.isGameActive = false;
        this.gamePhase = 'victory';
        
        // Victory bonus
        this.score += 100;
        this.gameSystem.updateScore('bossFight', this.score);
        
        this.showVictoryScreen();
    }
    
    playerLoses() {
        this.isGameActive = false;
        this.gamePhase = 'defeat';
        
        this.showDefeatScreen();
    }
    
    showVictoryScreen() {
        const container = document.getElementById('bossFight');
        if (container) {
            container.innerHTML = `
                <div class="victory-screen" style="
                    background: linear-gradient(45deg, #10b981, #059669, #fbbf24); 
                    min-height: 100vh; display: flex; align-items: center; justify-content: center;
                    position: relative; overflow: hidden;">
                    
                    <!-- Victory effects -->
                    <div style="position: absolute; width: 100%; height: 100%; overflow: hidden;">
                        ${Array.from({length: 50}, (_, i) => `
                            <div style="position: absolute; 
                                       left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; 
                                       width: 6px; height: 6px; background: #fbbf24; border-radius: 50%;
                                       animation: victorySparkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s;"></div>
                        `).join('')}
                    </div>
                    
                    <div class="victory-content" style="
                        text-align: center; color: white; max-width: 900px; padding: 50px; 
                        background: rgba(0,0,0,0.4); border-radius: 25px; z-index: 10;">
                        
                        <div style="font-size: 120px; margin: 30px 0; animation: victoryBounce 3s ease-in-out infinite;">
                            👑🏆🎉
                        </div>
                        
                        <h1 style="font-size: 48px; margin: 30px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.7);">
                            恭喜！你擊敗了發音之王！
                        </h1>
                        
                        <p style="font-size: 24px; margin: 25px 0; line-height: 1.5;">
                            你已經掌握了英語過去式的所有發音規則！<br>
                            從此，語言不再是障礙，而是你征服世界的利器！
                        </p>
                        
                        <div style="background: rgba(255,255,255,0.2); padding: 30px; border-radius: 15px; margin: 35px 0;">
                            <h3>戰鬥統計</h3>
                            <div style="display: flex; justify-content: space-around; margin: 20px 0;">
                                <div>
                                    <div style="font-size: 28px; color: #fbbf24; font-weight: bold;">${this.score}</div>
                                    <div style="font-size: 16px;">最終分數</div>
                                </div>
                                <div>
                                    <div style="font-size: 28px; color: #4ecca3; font-weight: bold;">${this.turnCounter}</div>
                                    <div style="font-size: 16px;">戰鬥回合</div>
                                </div>
                                <div>
                                    <div style="font-size: 28px; color: #60a5fa; font-weight: bold;">${this.questionsCorrect}/${this.questionsTotal}</div>
                                    <div style="font-size: 16px;">答對率</div>
                                </div>
                                <div>
                                    <div style="font-size: 28px; color: #34d399; font-weight: bold;">100%</div>
                                    <div style="font-size: 16px;">完成度</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin: 40px 0;">
                            <button onclick="window.gameSystem.showGameMenu()" style="
                                background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                                padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                                cursor: pointer; margin: 0 15px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);
                                transition: transform 0.3s ease;">
                                🏠 返回大廳
                            </button>
                            
                            <button onclick="window.location.reload()" style="
                                background: linear-gradient(45deg, #8b5cf6, #7c3aed); color: white; border: none; 
                                padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                                cursor: pointer; margin: 0 15px; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
                                transition: transform 0.3s ease;">
                                🔄 重新開始冒險
                            </button>
                        </div>
                    </div>
                    
                    <style>
                    @keyframes victoryBounce {
                        0%, 100% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-20px) scale(1.1); }
                    }
                    @keyframes victorySparkle {
                        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
                        50% { opacity: 1; transform: scale(1) rotate(180deg); }
                    }
                    button:hover {
                        transform: translateY(-3px) scale(1.05);
                    }
                    </style>
                </div>
            `;
        }
        
        // Mark boss fight as completed and play ending
        setTimeout(() => {
            this.gameSystem.checkLevelCompletion('bossFight');
            this.playEndingSequence();
        }, 3000);
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
                        
                        <div style="font-size: 80px; margin: 20px 0; animation: defeatShake 2s ease-in-out;">
                            👑💀
                        </div>
                        
                        <h1 style="font-size: 36px; margin: 20px 0; color: #dc2626;">
                            你被發音之王擊敗了...
                        </h1>
                        
                        <p style="font-size: 18px; margin: 20px 0; line-height: 1.5;">
                            別灰心！每個英雄都需要經歷挫折才能成長。<br>
                            回去加強練習，再次挑戰發音之王吧！
                        </p>
                        
                        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 25px 0;">
                            <div>戰鬥回合: <strong>${this.turnCounter}</strong></div>
                            <div>答對題數: <strong>${this.questionsCorrect}/${this.questionsTotal}</strong></div>
                            <div>獲得分數: <strong>${this.score}</strong></div>
                        </div>
                        
                        <div style="margin: 30px 0;">
                            <button onclick="window.gameSystem.showGameMenu()" style="
                                background: #4ecca3; color: white; border: none; 
                                padding: 15px 30px; border-radius: 10px; font-size: 18px; 
                                cursor: pointer; margin: 0 10px; font-weight: bold;">
                                🏠 返回練習
                            </button>
                            
                            <button onclick="window.bossFightGame.startGame()" style="
                                background: #dc2626; color: white; border: none; 
                                padding: 15px 30px; border-radius: 10px; font-size: 18px; 
                                cursor: pointer; margin: 0 10px; font-weight: bold;">
                                ⚔️ 再次挑戰
                            </button>
                        </div>
                    </div>
                    
                    <style>
                    @keyframes defeatShake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-10px); }
                        75% { transform: translateX(10px); }
                    }
                    </style>
                </div>
            `;
        }
    }
    
    playEndingSequence() {
        // Show ending video or final cutscene
        const endingContainer = document.getElementById('endingContainer');
        const endingVideo = document.getElementById('endingVideo');
        
        if (endingContainer && endingVideo) {
            endingContainer.style.display = 'flex';
            
            // Setup ending controls
            const playAgainBtn = document.getElementById('playAgain');
            const backToMenuBtn = document.getElementById('backToMenu');
            
            if (playAgainBtn) {
                playAgainBtn.onclick = () => window.location.reload();
            }
            
            if (backToMenuBtn) {
                backToMenuBtn.onclick = () => {
                    endingContainer.style.display = 'none';
                    window.gameSystem.showMainMenu();
                };
            }
            
            // Auto-hide after 5 seconds if no video plays
            setTimeout(() => {
                if (endingContainer.style.display === 'flex') {
                    endingContainer.style.display = 'none';
                    window.gameSystem.showMainMenu();
                }
            }, 5000);
        }
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
    
    updateUI() {
        // Update health bars and text
        const playerHealthBar = document.getElementById('playerHealthBar');
        const bossHealthBar = document.getElementById('bossHealthBar');
        const playerHealthText = document.getElementById('playerHealthText');
        const bossHealthText = document.getElementById('bossHealthText');
        
        if (playerHealthBar) {
            playerHealthBar.style.width = this.playerHealth + '%';
        }
        if (bossHealthBar) {
            bossHealthBar.style.width = this.bossHealth + '%';
        }
        if (playerHealthText) {
            playerHealthText.textContent = this.playerHealth;
        }
        if (bossHealthText) {
            bossHealthText.textContent = this.bossHealth;
        }
        
        // Update battle stats
        const turnCounterElement = document.getElementById('turnCounter');
        const questionsCorrectElement = document.getElementById('questionsCorrect');
        const bossScoreElement = document.getElementById('bossScore');
        
        if (turnCounterElement) {
            turnCounterElement.textContent = this.turnCounter;
        }
        if (questionsCorrectElement) {
            questionsCorrectElement.textContent = this.questionsCorrect;
        }
        if (bossScoreElement) {
            bossScoreElement.textContent = this.score;
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
            window.bossFightGame = new BossFightGame(window.gameSystem);
            console.log('Complete Boss Fight with Fixed Combat initialized');
        } else {
            setTimeout(checkGameSystem, 100);
        }
    };
    checkGameSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BossFightGame;
}
