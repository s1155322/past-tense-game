/**
 * Multiple Choice Game - Complete Hypnosis Breaking Version
 * Player must answer 5 consecutive questions correctly to break the evil wizard's hypnosis
 */
class MultipleChoiceGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.isGameActive = false;
        this.score = 0;
        this.correctStreak = 0;
        this.requiredStreak = 5;
        this.currentQuestion = null;
        this.questionCount = 0;
        this.totalQuestions = 0;
        
        // Hypnosis effects
        this.hypnosisLevel = 5; // Higher = more hypnotized
        this.wizardPower = 100;
        this.playerWillpower = 50;
        
        // Word database with pronunciation info
        this.wordDatabase = {
            t: [
                { word: 'watched', pronunciation: '/wɑtʃt/', meaning: '觀看' },
                { word: 'crossed', pronunciation: '/krɔst/', meaning: '穿越' },
                { word: 'kicked', pronunciation: '/kɪkt/', meaning: '踢' },
                { word: 'danced', pronunciation: '/dænst/', meaning: '跳舞' },
                { word: 'jumped', pronunciation: '/dʒʌmpt/', meaning: '跳躍' },
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
                { word: 'saved', pronunciation: '/seɪvd/', meaning: '拯救' },
                { word: 'opened', pronunciation: '/ˈoʊpənd/', meaning: '打開' },
                { word: 'closed', pronunciation: '/kloʊzd/', meaning: '關閉' }
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
        console.log('Initializing Complete Hypnosis Breaking Game');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'multipleChoice') {
                this.startGame();
            }
        });
    }
    
    startGame() {
        this.showCutscene();
    }
    
    showCutscene() {
        const gameContainer = document.getElementById('multipleChoice');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = `
            <div class="hypnosis-cutscene" style="
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000;
                background: linear-gradient(45deg, #2d1b69 0%, #8b5cf6 50%, #2d1b69 100%);
                display: flex; align-items: center; justify-content: center;">
                
                <div class="wizard-lair-scene" style="width: 90%; max-width: 1000px; position: relative; height: 80%;">
                    
                    <!-- Dark lair background -->
                    <div class="lair-background" style="
                        position: absolute; width: 100%; height: 100%;
                        background: radial-gradient(circle at center, #4c1d95 0%, #2d1b69 70%, #1e1b4b 100%);
                        border-radius: 20px; overflow: hidden;">
                        
                        <!-- Mystical crystals -->
                        <div style="position: absolute; top: 20%; left: 15%; width: 20px; height: 40px; 
                                    background: linear-gradient(45deg, #8b5cf6, #a855f7); 
                                    clip-path: polygon(50% 0%, 0% 100%, 100% 100%); 
                                    animation: crystalGlow 3s ease-in-out infinite;"></div>
                        <div style="position: absolute; top: 30%; right: 20%; width: 25px; height: 50px; 
                                    background: linear-gradient(45deg, #7c3aed, #8b5cf6); 
                                    clip-path: polygon(50% 0%, 0% 100%, 100% 100%); 
                                    animation: crystalGlow 3s ease-in-out infinite 1s;"></div>
                        
                        <!-- Magical runes -->
                        <div style="position: absolute; bottom: 20%; left: 25%; width: 30px; height: 30px; 
                                    border: 3px solid #a855f7; border-radius: 50%; 
                                    animation: runeRotate 4s linear infinite;"></div>
                        <div style="position: absolute; bottom: 25%; right: 30%; width: 25px; height: 25px; 
                                    background: transparent; border: 2px solid #8b5cf6; 
                                    transform: rotate(45deg); animation: runeFloat 3s ease-in-out infinite;"></div>
                    </div>
                    
                    <!-- Evil Hypnosis Wizard -->
                    <div class="evil-wizard" style="
                        position: absolute; right: 12%; top: 15%; width: 160px; height: 220px;">
                        
                        <!-- Wizard dark robe -->
                        <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); 
                                    width: 110px; height: 150px; background: linear-gradient(180deg, #1e1b4b, #0f172a); 
                                    border-radius: 55px 55px 25px 25px; border: 3px solid #8b5cf6;"></div>
                        
                        <!-- Wizard head -->
                        <div style="position: absolute; top: 30px; left: 50%; transform: translateX(-50%); 
                                    width: 80px; height: 80px; background: #c7d2fe; border-radius: 50%;
                                    border: 3px solid #6d28d9;"></div>
                        
                        <!-- Hypnotic evil eyes -->
                        <div style="position: absolute; top: 55px; left: 30%; width: 15px; height: 15px; 
                                    background: #dc2626; border-radius: 50%; 
                                    box-shadow: 0 0 25px #dc2626; animation: hypnoticEyes 2s ease-in-out infinite;"></div>
                        <div style="position: absolute; top: 55px; right: 30%; width: 15px; height: 15px; 
                                    background: #dc2626; border-radius: 50%; 
                                    box-shadow: 0 0 25px #dc2626; animation: hypnoticEyes 2s ease-in-out infinite 0.3s;"></div>
                        
                        <!-- Evil grin -->
                        <div style="position: absolute; top: 80px; left: 50%; transform: translateX(-50%); 
                                    width: 45px; height: 20px; border: 4px solid #7c2d12; 
                                    border-top: none; border-radius: 0 0 45px 45px;"></div>
                        
                        <!-- Wizard pointed hat -->
                        <div style="position: absolute; top: 5px; left: 50%; transform: translateX(-50%); 
                                    width: 0; height: 0; border-left: 60px solid transparent; 
                                    border-right: 60px solid transparent; border-bottom: 80px solid #1e1b4b;
                                    filter: drop-shadow(0 0 10px #8b5cf6);"></div>
                        
                        <!-- Hat star -->
                        <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
                                    color: #fbbf24; font-size: 24px; animation: starTwinkle 2s ease-in-out infinite;">
                            ⭐
                        </div>
                        
                        <!-- Hypnosis staff -->
                        <div style="position: absolute; right: -20px; top: 80px; width: 8px; height: 130px; 
                                    background: linear-gradient(180deg, #1e1b4b, #0f172a); border-radius: 4px;"></div>
                        <div style="position: absolute; right: -35px; top: 65px; width: 40px; height: 30px; 
                                    background: radial-gradient(circle, #8b5cf6, #6d28d9); border-radius: 50%; 
                                    animation: hypnosisOrb 2s ease-in-out infinite; 
                                    box-shadow: 0 0 30px #8b5cf6;"></div>
                        
                        <!-- Hypnotic spiral from staff -->
                        <div style="position: absolute; right: -50px; top: 50px; width: 70px; height: 70px; 
                                    background: conic-gradient(from 0deg, transparent, #8b5cf6, transparent, #a855f7, transparent); 
                                    border-radius: 50%; opacity: 0.7;
                                    animation: hypnoticSpiral 3s linear infinite;"></div>
                        
                        <!-- Wizard dark aura -->
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                    width: 200px; height: 200px; border-radius: 50%; 
                                    background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent); 
                                    animation: darkAura 4s ease-in-out infinite;"></div>
                    </div>
                    
                    <!-- Hypnotized Hero Player -->
                    <div class="hypnotized-hero" style="
                        position: absolute; left: 18%; bottom: 25%; width: 90px; height: 130px;">
                        
                        <!-- Hero body (weakened state) -->
                        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); 
                                    width: 60px; height: 85px; background: linear-gradient(180deg, #6b7280, #4b5563);
                                    border-radius: 30px 30px 12px 12px; border: 2px solid rgba(76, 204, 163, 0.5);
                                    animation: weakenedSway 3s ease-in-out infinite;"></div>
                        
                        <!-- Hero head -->
                        <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
                                    width: 45px; height: 45px; background: #fdbcb4; border-radius: 50%;"></div>
                        
                        <!-- Hypnotized spiral eyes -->
                        <div style="position: absolute; top: 35px; left: 35%; width: 12px; height: 12px; 
                                    background: conic-gradient(from 0deg, #dc2626, #f59e0b, #dc2626); 
                                    border-radius: 50%; animation: eyeSpiral 2s linear infinite;"></div>
                        <div style="position: absolute; top: 35px; right: 35%; width: 12px; height: 12px; 
                                    background: conic-gradient(from 0deg, #dc2626, #f59e0b, #dc2626); 
                                    border-radius: 50%; animation: eyeSpiral 2s linear infinite 1s;"></div>
                        
                        <!-- Dazed expression -->
                        <div style="position: absolute; top: 50px; left: 50%; transform: translateX(-50%); 
                                    width: 20px; height: 8px; border: 2px solid #6b7280; 
                                    border-top: none; border-radius: 0 0 20px 20px; opacity: 0.7;"></div>
                        
                        <!-- Hypnotic energy chains -->
                        <div style="position: absolute; top: 30%; left: -20px; width: 130px; height: 3px; 
                                    background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
                                    animation: energyChain1 3s ease-in-out infinite;"></div>
                        <div style="position: absolute; top: 50%; left: -15px; width: 120px; height: 2px; 
                                    background: linear-gradient(90deg, transparent, #a855f7, transparent);
                                    animation: energyChain2 3s ease-in-out infinite 1s;"></div>
                    </div>
                    
                    <!-- Hypnotic atmosphere effects -->
                    <div class="hypnotic-atmosphere" style="position: absolute; left: 30%; right: 30%; top: 25%; bottom: 30%;">
                        <!-- Floating hypnotic symbols -->
                        <div style="position: absolute; left: 20%; top: 20%; color: #a855f7; font-size: 20px; 
                                    animation: symbolFloat1 4s ease-in-out infinite;">🌀</div>
                        <div style="position: absolute; right: 10%; top: 40%; color: #8b5cf6; font-size: 16px; 
                                    animation: symbolFloat2 4s ease-in-out infinite 2s;">✨</div>
                        <div style="position: absolute; left: 50%; bottom: 20%; color: #7c3aed; font-size: 18px; 
                                    animation: symbolFloat3 4s ease-in-out infinite 1s;">💫</div>
                        
                        <!-- Wave effects -->
                        <div style="position: absolute; left: 0; top: 30%; width: 100%; height: 2px; 
                                    background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
                                    animation: hypnoticWave1 3s ease-in-out infinite;"></div>
                        <div style="position: absolute; left: 0; top: 50%; width: 100%; height: 1px; 
                                    background: linear-gradient(90deg, transparent, #a855f7, transparent);
                                    animation: hypnoticWave2 3s ease-in-out infinite 1.5s;"></div>
                    </div>
                    
                    <!-- Story text -->
                    <div class="cutscene-text" style="
                        position: absolute; top: 8%; left: 50%; transform: translateX(-50%); 
                        background: rgba(0,0,0,0.9); color: white; padding: 28px; 
                        border-radius: 20px; max-width: 650px; text-align: center; 
                        border: 3px solid #dc2626; box-shadow: 0 0 30px rgba(220, 38, 38, 0.3);">
                        
                        <h3 style="color: #dc2626; margin-top: 0; font-size: 26px;">🧙‍♂️ 催眠術陷阱</h3>
                        <p style="font-size: 19px; line-height: 1.6; margin: 18px 0;">
                            你被邪惡的催眠巫師困住了！他的強大催眠術讓你無法行動。只有連續答對 <strong style="color: #fbbf24;">5個問題</strong> 才能打破催眠術重獲自由！
                        </p>
                        <div style="background: rgba(220, 38, 38, 0.2); padding: 20px; border-radius: 12px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold; color: #fca5a5; font-size: 18px;">
                                💪 破解規則：
                            </p>
                            <ul style="text-align: left; padding-left: 25px; margin: 12px 0; font-size: 16px;">
                                <li>聽單詞發音，選擇正確的過去式類型</li>
                                <li>必須<strong>連續答對5題</strong>才能脫困</li>
                                <li>答錯一題就會重新開始計算</li>
                                <li>每答對一題，催眠效果會減弱</li>
                            </ul>
                        </div>
                        <p style="color: #a78bfa; font-size: 17px; margin: 18px 0;">
                            ⚠️ 保持專注！巫師的催眠術會讓你感到困惑和迷茫...
                        </p>
                        <button onclick="window.multipleChoiceGame.startMainGame()" style="
                            background: linear-gradient(45deg, #dc2626, #b91c1c); color: white; border: none; 
                            padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                            cursor: pointer; margin-top: 25px; box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
                            animation: pulseButton 2s ease-in-out infinite;">
                            💪 開始破解催眠術
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
            @keyframes crystalGlow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.5); }
            }
            @keyframes runeRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes runeFloat {
                0%, 100% { transform: rotate(45deg) translateY(0); }
                50% { transform: rotate(45deg) translateY(-10px); }
            }
            @keyframes hypnoticEyes {
                0%, 100% { box-shadow: 0 0 25px #dc2626; }
                50% { box-shadow: 0 0 40px #dc2626, 0 0 60px #b91c1c; }
            }
            @keyframes starTwinkle {
                0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
                50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
            }
            @keyframes hypnosisOrb {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.3) rotate(180deg); }
            }
            @keyframes hypnoticSpiral {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes darkAura {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
            }
            @keyframes weakenedSway {
                0%, 100% { transform: translateX(-50%) rotate(0deg); }
                50% { transform: translateX(-50%) rotate(2deg); }
            }
            @keyframes eyeSpiral {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes energyChain1 {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
            @keyframes energyChain2 {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.8; }
            }
            @keyframes symbolFloat1 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
            }
            @keyframes symbolFloat2 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
                50% { transform: translateY(-15px) rotate(-180deg); opacity: 1; }
            }
            @keyframes symbolFloat3 {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
                50% { transform: translateY(-25px) rotate(360deg); opacity: 1; }
            }
            @keyframes hypnoticWave1 {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.8; }
            }
            @keyframes hypnoticWave2 {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 0.9; }
            }
            @keyframes pulseButton {
                0%, 100% { box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4); }
                50% { box-shadow: 0 12px 35px rgba(220, 38, 38, 0.7); }
            }
            </style>
        `;
    }
    
    startMainGame() {
        this.setupGameInterface();
        this.resetGame();
        this.generateQuestion();
    }
    
    setupGameInterface() {
        const gameContainer = document.getElementById('multipleChoice');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = `
            <div class="hypnosis-breaking-game" style="
                background: linear-gradient(45deg, #2d1b69 0%, #8b5cf6 50%, #2d1b69 100%);
                min-height: 100vh; position: relative; overflow: hidden;">
                
                <!-- Hypnotic background effects -->
                <div class="hypnotic-bg-effects" style="position: absolute; width: 100%; height: 100%; z-index: 1;">
                    <div style="position: absolute; top: 20%; left: 10%; width: 100px; height: 100px; 
                               background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent); 
                               border-radius: 50%; animation: bgFloat1 6s ease-in-out infinite;"></div>
                    <div style="position: absolute; bottom: 30%; right: 15%; width: 80px; height: 80px; 
                               background: radial-gradient(circle, rgba(168, 85, 247, 0.2), transparent); 
                               border-radius: 50%; animation: bgFloat2 5s ease-in-out infinite 2s;"></div>
                </div>
                
                <!-- Game Header -->
                <div class="game-header" style="
                    position: relative; z-index: 100; text-align: center; color: white; 
                    padding: 30px 0; background: rgba(0,0,0,0.3);">
                    <h2 style="margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">
                        🧙‍♂️ 催眠術破解挑戰
                    </h2>
                    <p style="margin: 10px 0; font-size: 18px; color: #a78bfa;">
                        連續答對5題打敗邪惡巫師！
                    </p>
                </div>
                
                <!-- Hypnosis Breaking Progress -->
                <div class="breaking-progress" style="
                    position: relative; z-index: 100; background: rgba(0,0,0,0.8); 
                    padding: 25px; border-radius: 20px; margin: 30px auto; max-width: 600px;
                    border: 3px solid rgba(220, 38, 38, 0.6); box-shadow: 0 0 30px rgba(220, 38, 38, 0.3);">
                    
                    <h3 style="color: white; text-align: center; margin-top: 0;">💪 催眠破解進度</h3>
                    
                    <!-- Chain breaking visual -->
                    <div class="chain-breaking" style="display: flex; justify-content: space-between; margin: 25px 0; padding: 0 20px;">
                        <div class="chain-link" data-chain="0">
                            <div style="color: #dc2626; font-size: 24px;">🔗</div>
                            <div style="color: #94a3b8; font-size: 12px; text-align: center;">第1題</div>
                        </div>
                        <div class="chain-link" data-chain="1">
                            <div style="color: #dc2626; font-size: 24px;">🔗</div>
                            <div style="color: #94a3b8; font-size: 12px; text-align: center;">第2題</div>
                        </div>
                        <div class="chain-link" data-chain="2">
                            <div style="color: #dc2626; font-size: 24px;">🔗</div>
                            <div style="color: #94a3b8; font-size: 12px; text-align: center;">第3題</div>
                        </div>
                        <div class="chain-link" data-chain="3">
                            <div style="color: #dc2626; font-size: 24px;">🔗</div>
                            <div style="color: #94a3b8; font-size: 12px; text-align: center;">第4題</div>
                        </div>
                        <div class="chain-link" data-chain="4">
                            <div style="color: #dc2626; font-size: 24px;">🔗</div>
                            <div style="color: #94a3b8; font-size: 12px; text-align: center;">第5題</div>
                        </div>
                    </div>
                    
                    <!-- Willpower vs Hypnosis bars -->
                    <div style="display: flex; justify-content: space-between; gap: 30px; margin: 20px 0;">
                        <div style="flex: 1;">
                            <div style="color: #4ecca3; font-size: 16px; margin-bottom: 8px;">💪 意志力</div>
                            <div style="width: 100%; height: 20px; background: rgba(76, 204, 163, 0.3); 
                                       border-radius: 10px; overflow: hidden;">
                                <div id="willpowerBar" style="
                                    width: 50%; height: 100%; background: linear-gradient(90deg, #4ecca3, #2ecc71);
                                    transition: width 1s ease; border-radius: 10px;"></div>
                            </div>
                            <div style="color: white; font-size: 14px; text-align: center; margin-top: 5px;">
                                <span id="willpowerValue">50</span>%
                            </div>
                        </div>
                        
                        <div style="flex: 1;">
                            <div style="color: #dc2626; font-size: 16px; margin-bottom: 8px;">🌀 催眠強度</div>
                            <div style="width: 100%; height: 20px; background: rgba(220, 38, 38, 0.3); 
                                       border-radius: 10px; overflow: hidden;">
                                <div id="hypnosisBar" style="
                                    width: 100%; height: 100%; background: linear-gradient(90deg, #dc2626, #b91c1c);
                                    transition: width 1s ease; border-radius: 10px;"></div>
                            </div>
                            <div style="color: white; font-size: 14px; text-align: center; margin-top: 5px;">
                                <span id="hypnosisValue">100</span>%
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; color: white; font-size: 16px; margin: 15px 0;">
                        <div>連續正確: <span id="correctStreak" style="color: #4ecca3; font-weight: bold; font-size: 20px;">0</span>/5</div>
                        <div>總分數: <span id="multipleChoiceScore" style="color: #fbbf24; font-weight: bold; font-size: 20px;">0</span></div>
                    </div>
                </div>
                
                <!-- Question Display Area -->
                <div class="question-display" style="
                    position: relative; z-index: 100; background: rgba(255,255,255,0.1); 
                    padding: 30px; border-radius: 20px; margin: 30px auto; max-width: 700px; 
                    text-align: center; border: 2px solid rgba(255,255,255,0.3);
                    backdrop-filter: blur(10px);">
                    
                    <div style="color: #e5e7eb; font-size: 22px; margin-bottom: 20px;">
                        🔊 聽這個過去式單詞的發音：
                    </div>
                    
                    <div id="questionWord" style="
                        font-size: 48px; font-weight: bold; color: #4ecca3; margin: 25px 0; 
                        text-shadow: 3px 3px 6px rgba(0,0,0,0.7); min-height: 60px; 
                        display: flex; align-items: center; justify-content: center;">
                        準備中...
                    </div>
                    
                    <div id="wordMeaning" style="color: #a78bfa; font-size: 18px; margin: 15px 0; min-height: 25px;"></div>
                    <div id="wordPronunciation" style="color: #fbbf24; font-size: 20px; margin: 15px 0; min-height: 25px;"></div>
                    
                    <button id="playPronunciation" class="pronunciation-btn" style="
                        background: linear-gradient(45deg, #8b5cf6, #7c3aed); color: white; border: none; 
                        padding: 18px 30px; border-radius: 12px; margin: 20px 0; cursor: pointer; 
                        font-size: 18px; font-weight: bold; box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4);
                        transition: transform 0.3s ease;">
                        🔊 播放發音
                    </button>
                </div>
                
                <!-- Answer Choices -->
                <div class="answer-choices" style="
                    position: relative; z-index: 100; display: flex; justify-content: center; 
                    gap: 25px; margin: 40px auto; max-width: 600px;">
                    
                    <button class="choice-button" data-sound="t" style="
                        background: linear-gradient(45deg, #3498db, #2980b9); color: white; border: none; 
                        padding: 25px 30px; border-radius: 15px; font-size: 20px; cursor: pointer; 
                        min-width: 140px; font-weight: bold; box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
                        transition: all 0.3s ease;">
                        🔵 /t/ 音<br>
                        <span style="font-size: 14px; opacity: 0.9;">watched, kicked</span>
                    </button>
                    
                    <button class="choice-button" data-sound="d" style="
                        background: linear-gradient(45deg, #e74c3c, #c0392b); color: white; border: none; 
                        padding: 25px 30px; border-radius: 15px; font-size: 20px; cursor: pointer; 
                        min-width: 140px; font-weight: bold; box-shadow: 0 8px 20px rgba(231, 76, 60, 0.4);
                        transition: all 0.3s ease;">
                        🔴 /d/ 音<br>
                        <span style="font-size: 14px; opacity: 0.9;">played, lived</span>
                    </button>
                    
                    <button class="choice-button" data-sound="id" style="
                        background: linear-gradient(45deg, #2ecc71, #27ae60); color: white; border: none; 
                        padding: 25px 30px; border-radius: 15px; font-size: 20px; cursor: pointer; 
                        min-width: 140px; font-weight: bold; box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
                        transition: all 0.3s ease;">
                        🟢 /ɪd/ 音<br>
                        <span style="font-size: 14px; opacity: 0.9;">wanted, needed</span>
                    </button>
                </div>
                
                <!-- Game Status -->
                <div id="gameStatus" style="
                    position: relative; z-index: 100; text-align: center; color: white; 
                    font-size: 18px; margin: 30px 0; min-height: 30px; font-weight: bold;">
                    選擇正確的發音類型來削弱催眠術...
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
            @keyframes bgFloat1 {
                0%, 100% { transform: translateY(0); opacity: 0.3; }
                50% { transform: translateY(-30px); opacity: 0.6; }
            }
            @keyframes bgFloat2 {
                0%, 100% { transform: translateX(0); opacity: 0.2; }
                50% { transform: translateX(20px); opacity: 0.5; }
            }
            
            .chain-link {
                transition: all 0.5s ease;
                text-align: center;
            }
            
            .chain-link.broken {
                animation: chainBreak 0.8s ease-out;
            }
            
            .chain-link.broken div:first-child {
                color: #4ecca3 !important;
                font-size: 28px !important;
            }
            
            @keyframes chainBreak {
                0% { transform: scale(1); }
                50% { transform: scale(1.3) rotate(15deg); }
                100% { transform: scale(1.1) rotate(0deg); }
            }
            
            .choice-button:hover {
                transform: translateY(-5px) scale(1.05);
            }
            
            .choice-button:active {
                transform: translateY(-2px) scale(0.98);
            }
            
            .choice-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none !important;
            }
            
            .choice-button.correct {
                background: linear-gradient(45deg, #2ecc71, #27ae60) !important;
                box-shadow: 0 0 30px rgba(46, 204, 113, 0.8) !important;
                animation: correctPulse 0.6s ease-out;
            }
            
            .choice-button.wrong {
                background: linear-gradient(45deg, #e74c3c, #c0392b) !important;
                box-shadow: 0 0 30px rgba(231, 76, 60, 0.8) !important;
                animation: wrongShake 0.6s ease-out;
            }
            
            @keyframes correctPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            @keyframes wrongShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
            
            .pronunciation-btn:hover {
                transform: translateY(-3px) scale(1.05);
            }
            
            .back-btn:hover {
                background: rgba(76, 204, 163, 1);
                transform: translateY(-2px);
            }
            </style>
        `;
        
        this.setupGameControls();
    }
    
    setupGameControls() {
        // Choice buttons
        const choiceButtons = document.querySelectorAll('.choice-button');
        choiceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.target.dataset.sound || e.target.closest('.choice-button').dataset.sound;
                this.makeChoice(choice);
            });
        });
        
        // Pronunciation button
        const pronunciationBtn = document.getElementById('playPronunciation');
        if (pronunciationBtn) {
            pronunciationBtn.addEventListener('click', () => this.playPronunciation());
        }
    }
    
    resetGame() {
        this.isGameActive = true;
        this.score = 0;
        this.correctStreak = 0;
        this.questionCount = 0;
        this.totalQuestions = 0;
        this.hypnosisLevel = 5;
        this.wizardPower = 100;
        this.playerWillpower = 50;
        this.usedQuestions = [];
        
        this.updateUI();
    }
    
    generateQuestion() {
        // Get all available questions
        const allQuestions = [];
        Object.keys(this.wordDatabase).forEach(type => {
            this.wordDatabase[type].forEach(wordObj => {
                if (!this.usedQuestions.includes(wordObj.word)) {
                    allQuestions.push({ ...wordObj, type });
                }
            });
        });
        
        if (allQuestions.length === 0) {
            this.usedQuestions = [];
            return this.generateQuestion();
        }
        
        // Pick random question
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        this.currentQuestion = allQuestions[randomIndex];
        this.usedQuestions.push(this.currentQuestion.word);
        
        this.questionCount++;
        this.totalQuestions++;
        
        this.updateQuestionDisplay();
        
        // Auto-play pronunciation after a delay
        setTimeout(() => this.playPronunciation(), 1000);
    }
    
    updateQuestionDisplay() {
        if (!this.currentQuestion) return;
        
        const questionWord = document.getElementById('questionWord');
        const wordMeaning = document.getElementById('wordMeaning');
        const wordPronunciation = document.getElementById('wordPronunciation');
        
        if (questionWord) {
            questionWord.textContent = this.currentQuestion.word;
        }
        
        if (wordMeaning) {
            wordMeaning.textContent = `意思：${this.currentQuestion.meaning}`;
        }
        
        if (wordPronunciation) {
            wordPronunciation.textContent = `音標：${this.currentQuestion.pronunciation}`;
        }
        
        // Reset button states
        const choiceButtons = document.querySelectorAll('.choice-button');
        choiceButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'wrong');
        });
        
        // Update status
        this.updateGameStatus('選擇正確的發音類型來削弱催眠術...');
    }
    
    playPronunciation() {
        if (!this.currentQuestion) return;
        
        if (window.SoundSystem && window.SoundSystem.speakWord) {
            window.SoundSystem.speakWord(this.currentQuestion.word);
        } else if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.currentQuestion.word);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    }
    
    makeChoice(choice) {
        if (!this.currentQuestion) return;
        
        const isCorrect = choice === this.currentQuestion.type;
        
        // Disable all buttons
        const choiceButtons = document.querySelectorAll('.choice-button');
        choiceButtons.forEach(btn => {
            btn.disabled = true;
        });
        
        // Show correct/wrong feedback
        choiceButtons.forEach(btn => {
            const btnChoice = btn.dataset.sound;
            if (btnChoice === choice) {
                btn.classList.add(isCorrect ? 'correct' : 'wrong');
            }
        });
        
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
    }
    
    handleCorrectAnswer() {
        this.correctStreak++;
        this.score += 20;
        this.playerWillpower = Math.min(100, this.playerWillpower + 15);
        this.wizardPower = Math.max(0, this.wizardPower - 18);
        
        // Break a chain link
        this.breakChainLink(this.correctStreak - 1);
        
        if (window.SoundSystem) {
            window.SoundSystem.play('correct');
        }
        
        this.updateGameStatus(`✅ 正確！催眠效果減弱了... (${this.correctStreak}/5)`);
        
        setTimeout(() => {
            if (this.correctStreak >= this.requiredStreak) {
                this.hypnosisBreakingComplete();
            } else {
                this.generateQuestion();
            }
        }, 2000);
        
        this.updateUI();
    }
    
    handleWrongAnswer() {
        this.correctStreak = 0;
        this.playerWillpower = Math.max(0, this.playerWillpower - 10);
        this.wizardPower = Math.min(100, this.wizardPower + 5);
        
        // Reset chain links
        this.resetChainLinks();
        
        if (window.SoundSystem) {
            window.SoundSystem.play('wrong');
        }
        
        this.updateGameStatus('❌ 錯誤！催眠效果增強了，重新開始...');
        
        setTimeout(() => {
            this.generateQuestion();
        }, 2500);
        
        this.updateUI();
    }
    
    breakChainLink(chainIndex) {
        const chainLink = document.querySelector(`[data-chain="${chainIndex}"]`);
        if (chainLink) {
            chainLink.classList.add('broken');
        }
    }
    
    resetChainLinks() {
        const chainLinks = document.querySelectorAll('.chain-link');
        chainLinks.forEach(link => {
            link.classList.remove('broken');
        });
    }
    
    hypnosisBreakingComplete() {
        this.isGameActive = false;
        
        // Add completion bonus
        this.score += 50;
        this.gameSystem.updateScore('multipleChoice', this.score);
        
        // Show success animation
        this.showBreakingSuccess();
    }
    
    showBreakingSuccess() {
        const container = document.getElementById('multipleChoice');
        if (container) {
            container.innerHTML = `
                <div class="hypnosis-breaking-success" style="
                    background: linear-gradient(45deg, #2ecc71 0%, #27ae60 50%, #16a085 100%); 
                    min-height: 100vh; display: flex; align-items: center; justify-content: center;
                    position: relative; overflow: hidden;">
                    
                    <!-- Success particles -->
                    <div style="position: absolute; width: 100%; height: 100%; overflow: hidden;">
                        ${Array.from({length: 30}, (_, i) => `
                            <div style="position: absolute; 
                                       left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; 
                                       width: 6px; height: 6px; background: rgba(255,255,255,0.8); border-radius: 50%;
                                       animation: successParticle${i % 3 + 1} ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s;"></div>
                        `).join('')}
                    </div>
                    
                    <div class="success-content" style="
                        text-align: center; color: white; max-width: 800px; padding: 50px; 
                        background: rgba(0,0,0,0.3); border-radius: 25px; z-index: 10;">
                        
                        <!-- Breaking chains animation -->
                        <div style="font-size: 100px; margin: 30px 0; animation: chainsBreaking 2s ease-out;">
                            ⛓️💥
                        </div>
                        
                        <h1 style="font-size: 52px; margin: 30px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.7);">
                            🎉 催眠術被破解！
                        </h1>
                        
                        <p style="font-size: 26px; margin: 25px 0; line-height: 1.5;">
                            恭喜！你成功打敗了邪惡巫師！<br>
                            意志力戰勝了催眠術的控制！
                        </p>
                        
                        <div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; margin: 35px 0;">
                            <h3>破解成就</h3>
                            <div style="font-size: 20px; margin: 10px 0;">
                                連續正確答題: <strong style="color: #fbbf24;">${this.correctStreak}</strong> 次
                            </div>
                            <div style="font-size: 20px; margin: 10px 0;">
                                最終分數: <strong style="color: #fbbf24;">${this.score}</strong>
                            </div>
                            <div style="font-size: 20px; margin: 10px 0;">
                                總答題數: <strong>${this.totalQuestions}</strong>
                            </div>
                            <div style="font-size: 18px; margin: 10px 0; color: #a7f3d0;">
                                完成度: <strong style="color: #4ecca3;">100%</strong>
                            </div>
                        </div>
                        
                        <div style="margin: 40px 0;">
                            <button onclick="window.gameSystem.showGameMenu()" style="
                                background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                                padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                                cursor: pointer; margin: 0 15px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);">
                                🏠 繼續冒險
                            </button>
                            
                            <button onclick="window.multipleChoiceGame.startGame()" style="
                                background: linear-gradient(45deg, #8b5cf6, #7c3aed); color: white; border: none; 
                                padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                                cursor: pointer; margin: 0 15px; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);">
                                🔄 再次挑戰
                            </button>
                        </div>
                    </div>
                    
                    <style>
                    @keyframes chainsBreaking {
                        0% { transform: scale(1) rotate(0deg); }
                        50% { transform: scale(1.3) rotate(15deg); }
                        100% { transform: scale(1.1) rotate(0deg); }
                    }
                    @keyframes successParticle1 {
                        0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
                        50% { opacity: 1; transform: translateY(-30px) scale(1); }
                    }
                    @keyframes successParticle2 {
                        0%, 100% { opacity: 0; transform: translateX(0) scale(0); }
                        50% { opacity: 1; transform: translateX(25px) scale(1); }
                    }
                    @keyframes successParticle3 {
                        0%, 100% { opacity: 0; transform: translate(0, 0) scale(0); }
                        50% { opacity: 1; transform: translate(-20px, -25px) scale(1); }
                    }
                    </style>
                </div>
            `;
        }
        
        // Complete the level
        setTimeout(() => {
            this.gameSystem.checkLevelCompletion('multipleChoice');
        }, 2000);
    }
    
    updateUI() {
        // Update progress bars
        const willpowerBar = document.getElementById('willpowerBar');
        const hypnosisBar = document.getElementById('hypnosisBar');
        const willpowerValue = document.getElementById('willpowerValue');
        const hypnosisValue = document.getElementById('hypnosisValue');
        
        if (willpowerBar) {
            willpowerBar.style.width = this.playerWillpower + '%';
        }
        if (willpowerValue) {
            willpowerValue.textContent = this.playerWillpower;
        }
        
        if (hypnosisBar) {
            hypnosisBar.style.width = this.wizardPower + '%';
        }
        if (hypnosisValue) {
            hypnosisValue.textContent = this.wizardPower;
        }
        
        // Update streak and score
        const streakElement = document.getElementById('correctStreak');
        const scoreElement = document.getElementById('multipleChoiceScore');
        
        if (streakElement) {
            streakElement.textContent = this.correctStreak;
        }
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }
    
    updateGameStatus(message) {
        const statusElement = document.getElementById('gameStatus');
        if (statusElement) {
            statusElement.innerHTML = message;
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
            window.multipleChoiceGame = new MultipleChoiceGame(window.gameSystem);
            console.log('Complete Multiple Choice Hypnosis Breaking game initialized');
        } else {
            setTimeout(checkGameSystem, 100);
        }
    };
    checkGameSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultipleChoiceGame;
}
