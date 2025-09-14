/**
 * Word Search Game - 完整可用版本
 * 包含字母網格、斷橋動畫、故事、所有功能都能用
 */
class WordSearchGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.isGameActive = false;
        this.score = 0;
        this.selectedSound = null;
        
        // 遊戲狀態
        this.targetWords = [];
        this.foundWords = { t: [], d: [], id: [] };
        this.currentSelection = [];
        this.gameBoard = [];
        this.boardSize = 12;
        this.placedWords = [];
        
        // 橋樑修復狀態 - 每種發音類型需要3個詞
        this.bridgeProgress = { t: 0, d: 0, id: 0 };
        this.wordsNeededPerType = 3;
        
        // 詞彙資料庫
        this.wordDatabase = {
            t: ['watched', 'crossed', 'kicked', 'danced', 'jumped', 'helped', 'worked', 'washed', 'passed', 'missed'],
            d: ['played', 'lived', 'moved', 'called', 'loved', 'saved', 'opened', 'closed', 'turned', 'owned'],
            id: ['wanted', 'needed', 'decided', 'started', 'ended', 'visited', 'created', 'painted', 'counted', 'added']
        };
        
        console.log('🎮 Word Search Game 初始化完成');
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        
        // 檢查遊戲容器是否可見並自動開始
        this.checkAndStart();
    }
    
    checkAndStart() {
        const gameContainer = document.getElementById('wordSearch');
        if (gameContainer && gameContainer.style.display !== 'none') {
            console.log('🎯 遊戲容器可見，開始遊戲');
            setTimeout(() => this.startGame(), 100);
        } else {
            // 繼續檢查
            setTimeout(() => this.checkAndStart(), 500);
        }
    }
    
    setupEventListeners() {
        // 監聽遊戲初始化事件
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'wordSearch') {
                this.startGame();
            }
        });
        
        // 監聽容器顯示變化
        const observer = new MutationObserver(() => {
            const gameContainer = document.getElementById('wordSearch');
            if (gameContainer && gameContainer.style.display !== 'none' && !this.isGameActive) {
                console.log('🎯 容器變為可見，啟動遊戲');
                this.startGame();
            }
        });
        
        const container = document.getElementById('wordSearch');
        if (container) {
            observer.observe(container, { attributes: true, attributeFilter: ['style'] });
        }
    }
    
    startGame() {
        console.log('🚀 開始 Word Search 遊戲');
        this.showStoryScene();
    }
    
    showStoryScene() {
        const gameContainer = document.getElementById('wordSearch');
        if (!gameContainer) return;
        
        console.log('📖 顯示故事場景');
        
        gameContainer.innerHTML = `
            <div class="story-scene" style="
                background: linear-gradient(180deg, #87ceeb 0%, #4682b4 50%, #2e8b57 100%);
                min-height: 100vh; position: relative; overflow: hidden; display: flex; 
                align-items: center; justify-content: center; padding: 20px;">
                
                <!-- 故事背景 -->
                <div class="story-content" style="
                    background: rgba(0,0,0,0.7); padding: 40px; border-radius: 20px; 
                    max-width: 800px; text-align: center; color: white; position: relative;">
                    
                    <h1 style="font-size: 36px; margin: 0 0 30px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                        🌉 石橋修復任務
                    </h1>
                    
                    <!-- 斷橋場景 -->
                    <div class="bridge-scene" style="
                        background: linear-gradient(180deg, #87ceeb 0%, #228b22 100%); 
                        margin: 30px 0; padding: 40px; border-radius: 15px; 
                        position: relative; height: 200px; overflow: hidden;">
                        
                        <!-- 左邊懸崖 -->
                        <div class="cliff-left" style="
                            position: absolute; left: 0; top: 50%; width: 100px; height: 120px;
                            background: linear-gradient(45deg, #8b4513, #a0522d); 
                            clip-path: polygon(0 0, 80% 0, 100% 100%, 0 100%);
                            transform: translateY(-50%);"></div>
                        
                        <!-- 右邊懸崖 -->
                        <div class="cliff-right" style="
                            position: absolute; right: 0; top: 50%; width: 100px; height: 120px;
                            background: linear-gradient(45deg, #8b4513, #a0522d); 
                            clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%);
                            transform: translateY(-50%);"></div>
                        
                        <!-- 斷裂的橋樑 -->
                        <div class="broken-bridge" style="
                            position: absolute; left: 50%; top: 70%; transform: translateX(-50%);
                            display: flex; gap: 8px; align-items: center;">
                            
                            <!-- 左邊石塊 -->
                            <div style="width: 40px; height: 25px; background: #696969; border-radius: 8px; border: 2px solid #555;"></div>
                            <div style="width: 40px; height: 25px; background: #696969; border-radius: 8px; border: 2px solid #555;"></div>
                            
                            <!-- 缺失的石塊 (用虛線表示) -->
                            <div style="width: 40px; height: 25px; border: 3px dashed #fff; border-radius: 8px; background: rgba(255,255,255,0.1);"></div>
                            <div style="width: 40px; height: 25px; border: 3px dashed #fff; border-radius: 8px; background: rgba(255,255,255,0.1);"></div>
                            <div style="width: 40px; height: 25px; border: 3px dashed #fff; border-radius: 8px; background: rgba(255,255,255,0.1);"></div>
                            
                            <!-- 右邊石塊 -->
                            <div style="width: 40px; height: 25px; background: #696969; border-radius: 8px; border: 2px solid #555;"></div>
                            <div style="width: 40px; height: 25px; background: #696969; border-radius: 8px; border: 2px solid #555;"></div>
                        </div>
                        
                        <!-- 角色 -->
                        <div class="character" style="
                            position: absolute; left: 15%; bottom: 30%; width: 50px; height: 60px;">
                            <!-- 頭部 -->
                            <div style="width: 35px; height: 35px; background: #fdbcb4; border-radius: 50%; 
                                        margin: 0 auto; border: 3px solid #333;"></div>
                            <!-- 身體 -->
                            <div style="width: 40px; height: 45px; background: #4ecca3; border-radius: 20px; 
                                        margin: 5px auto 0; border: 2px solid #333;"></div>
                            <!-- 手臂 -->
                            <div style="position: absolute; top: 40px; left: -8px; width: 15px; height: 20px; 
                                        background: #fdbcb4; border-radius: 10px; transform: rotate(-30deg);"></div>
                            <div style="position: absolute; top: 40px; right: -8px; width: 15px; height: 20px; 
                                        background: #fdbcb4; border-radius: 10px; transform: rotate(30deg);"></div>
                        </div>
                        
                        <!-- 思考泡泡 -->
                        <div style="position: absolute; left: 25%; top: 10%; background: white; 
                                   padding: 15px; border-radius: 20px; color: #333; font-size: 14px; 
                                   border: 3px solid #333; max-width: 200px;">
                            我需要找到正確的過去式單詞來修復這座橋！
                        </div>
                    </div>
                    
                    <!-- 故事文字 -->
                    <div class="story-text" style="
                        background: rgba(0,0,0,0.5); padding: 25px; border-radius: 15px; 
                        margin: 30px 0; font-size: 18px; line-height: 1.8;">
                        
                        <p style="margin: 15px 0; color: #fff;">
                            古老的石橋因為時間而破損，你必須找到正確的過去式單詞才能修復它！
                        </p>
                        
                        <p style="margin: 15px 0; color: #fbbf24; font-weight: bold;">
                            在字母網格中找到隱藏的過去式單詞，並選擇正確的發音類型來獲得修復石塊。
                        </p>
                        
                        <div style="background: rgba(76, 204, 163, 0.2); padding: 20px; border-radius: 10px; 
                                   margin: 25px 0; border: 2px solid #4ecca3;">
                            <h3 style="margin: 0 0 15px 0; color: #4ecca3;">🎯 任務目標：</h3>
                            <ul style="text-align: left; margin: 0; padding-left: 25px; color: #fff;">
                                <li><strong>/t/ 音：</strong>找到3個單詞 (如: watched, kicked)</li>
                                <li><strong>/d/ 音：</strong>找到3個單詞 (如: played, lived)</li>
                                <li><strong>/ɪd/ 音：</strong>找到3個單詞 (如: wanted, needed)</li>
                            </ul>
                            <p style="margin: 15px 0 0 0; color: #fbbf24; font-weight: bold;">
                                每找對3個同類單詞，就能獲得一塊石塊來修復橋樑！
                            </p>
                        </div>
                    </div>
                    
                    <!-- 開始按鈕 -->
                    <div style="margin-top: 30px;">
                        <button id="startWordSearchBtn" style="
                            background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                            padding: 20px 50px; border-radius: 15px; font-size: 24px; font-weight: bold; 
                            cursor: pointer; margin: 15px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);
                            transition: all 0.3s ease; animation: buttonGlow 2s ease-in-out infinite;">
                            🔍 開始尋找單詞
                        </button>
                        
                        <button onclick="window.gameSystem?.showGameMenu()" style="
                            background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.5); 
                            padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                            cursor: pointer; margin: 15px; transition: all 0.3s ease;">
                            🏠 返回選單
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
            @keyframes buttonGlow {
                0%, 100% { 
                    box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4), 0 0 0 0 rgba(76, 204, 163, 0.7); 
                }
                50% { 
                    box-shadow: 0 12px 35px rgba(76, 204, 163, 0.8), 0 0 0 10px rgba(76, 204, 163, 0); 
                }
            }
            
            #startWordSearchBtn:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 35px rgba(76, 204, 163, 0.6);
            }
            
            .character {
                animation: characterBob 3s ease-in-out infinite;
            }
            
            @keyframes characterBob {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            </style>
        `;
        
        // 綁定開始按鈕事件
        document.getElementById('startWordSearchBtn').onclick = () => {
            console.log('🎯 用戶點擊開始按鈕');
            this.startMainGame();
        };
    }
    
    startMainGame() {
        console.log('🎮 開始主要遊戲');
        this.setupGameInterface();
        this.resetGame();
        this.generateGameBoard();
        this.setupGameControls();
        this.updateDisplay();
        this.isGameActive = true;
    }
    
    setupGameInterface() {
        const gameContainer = document.getElementById('wordSearch');
        if (!gameContainer) return;
        
        console.log('🎨 設置遊戲界面');
        
        gameContainer.innerHTML = `
            <div class="word-search-main" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh; padding: 20px; color: white;">
                
                <!-- 遊戲標題和進度 -->
                <div class="game-header" style="text-align: center; margin-bottom: 25px;">
                    <h2 style="font-size: 28px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">
                        🌉 石橋修復 - 單詞搜索
                    </h2>
                    <p style="margin: 10px 0;">找到過去式單詞並選擇正確發音來修復橋樑</p>
                </div>
                
                <!-- 橋樑進度顯示 -->
                <div class="bridge-progress" style="
                    background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; 
                    margin-bottom: 25px; text-align: center;">
                    
                    <h3 style="margin: 0 0 15px 0; color: #4ecca3;">🌉 橋樑修復進度</h3>
                    
                    <div style="display: flex; justify-content: space-around; margin: 20px 0;">
                        <!-- /t/ 音進度 -->
                        <div class="progress-section" style="flex: 1; margin: 0 10px;">
                            <div style="color: #3498db; font-weight: bold; margin-bottom: 10px;">/t/ 音</div>
                            <div class="progress-bar" style="
                                background: rgba(52, 152, 219, 0.3); height: 20px; border-radius: 10px; 
                                border: 2px solid #3498db; position: relative; overflow: hidden;">
                                <div id="tProgress" style="
                                    background: linear-gradient(45deg, #3498db, #2980b9); 
                                    height: 100%; width: 0%; transition: width 0.5s ease;"></div>
                            </div>
                            <div id="tCount" style="margin-top: 5px; font-size: 14px;">0/3</div>
                        </div>
                        
                        <!-- /d/ 音進度 -->
                        <div class="progress-section" style="flex: 1; margin: 0 10px;">
                            <div style="color: #e74c3c; font-weight: bold; margin-bottom: 10px;">/d/ 音</div>
                            <div class="progress-bar" style="
                                background: rgba(231, 76, 60, 0.3); height: 20px; border-radius: 10px; 
                                border: 2px solid #e74c3c; position: relative; overflow: hidden;">
                                <div id="dProgress" style="
                                    background: linear-gradient(45deg, #e74c3c, #c0392b); 
                                    height: 100%; width: 0%; transition: width 0.5s ease;"></div>
                            </div>
                            <div id="dCount" style="margin-top: 5px; font-size: 14px;">0/3</div>
                        </div>
                        
                        <!-- /ɪd/ 音進度 -->
                        <div class="progress-section" style="flex: 1; margin: 0 10px;">
                            <div style="color: #2ecc71; font-weight: bold; margin-bottom: 10px;">/ɪd/ 音</div>
                            <div class="progress-bar" style="
                                background: rgba(46, 204, 113, 0.3); height: 20px; border-radius: 10px; 
                                border: 2px solid #2ecc71; position: relative; overflow: hidden;">
                                <div id="idProgress" style="
                                    background: linear-gradient(45deg, #2ecc71, #27ae60); 
                                    height: 100%; width: 0%; transition: width 0.5s ease;"></div>
                            </div>
                            <div id="idCount" style="margin-top: 5px; font-size: 14px;">0/3</div>
                        </div>
                    </div>
                </div>
                
                <!-- 遊戲統計 -->
                <div class="game-stats" style="
                    display: flex; justify-content: center; gap: 30px; margin-bottom: 25px;">
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                        <strong>分數: <span id="gameScore" style="color: #4ecca3;">0</span></strong>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                        <strong>總找到: <span id="totalFound" style="color: #fbbf24;">0</span>/9</strong>
                    </div>
                </div>
                
                <!-- 發音選擇 -->
                <div class="sound-selection" style="
                    text-align: center; margin-bottom: 25px; 
                    background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
                    
                    <h3 style="margin: 0 0 20px 0; color: #fbbf24;">選擇發音類型：</h3>
                    
                    <div class="sound-buttons" style="display: flex; justify-content: center; gap: 20px;">
                        <button class="sound-btn" data-sound="t" style="
                            background: linear-gradient(45deg, #3498db, #2980b9); color: white; border: none; 
                            padding: 15px 25px; border-radius: 10px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease; min-width: 120px;">
                            🔵 /t/ 音
                            <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">watched, kicked</div>
                        </button>
                        
                        <button class="sound-btn" data-sound="d" style="
                            background: linear-gradient(45deg, #e74c3c, #c0392b); color: white; border: none; 
                            padding: 15px 25px; border-radius: 10px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease; min-width: 120px;">
                            🔴 /d/ 音
                            <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">played, lived</div>
                        </button>
                        
                        <button class="sound-btn" data-sound="id" style="
                            background: linear-gradient(45deg, #2ecc71, #27ae60); color: white; border: none; 
                            padding: 15px 25px; border-radius: 10px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease; min-width: 120px;">
                            🟢 /ɪd/ 音
                            <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">wanted, needed</div>
                        </button>
                    </div>
                    
                    <div style="margin: 20px 0; font-size: 18px;">
                        當前選擇: <span id="currentSoundDisplay" style="color: #4ecca3; font-weight: bold;">請選擇發音類型</span>
                    </div>
                </div>
                
                <!-- 字母網格 -->
                <div class="grid-container" style="
                    display: flex; justify-content: center; margin-bottom: 25px;">
                    <div id="letterGrid" class="letter-grid" style="
                        display: grid; grid-template-columns: repeat(12, 1fr); gap: 3px; 
                        background: rgba(0,0,0,0.4); padding: 25px; border-radius: 15px; 
                        border: 3px solid rgba(255,255,255,0.3); max-width: 550px;">
                        <!-- 字母格子會在這裡生成 -->
                    </div>
                </div>
                
                <!-- 已找到的單詞列表 -->
                <div class="found-words-lists" style="
                    display: flex; justify-content: space-around; margin-bottom: 25px; gap: 15px;">
                    
                    <div class="word-list" style="
                        background: rgba(52, 152, 219, 0.2); padding: 15px; border-radius: 10px; 
                        border: 2px solid #3498db; flex: 1; max-width: 200px;">
                        <h4 style="margin: 0 0 15px 0; color: #3498db; text-align: center;">🔵 /t/ 音</h4>
                        <div id="tWordsList" class="words-container"></div>
                    </div>
                    
                    <div class="word-list" style="
                        background: rgba(231, 76, 60, 0.2); padding: 15px; border-radius: 10px; 
                        border: 2px solid #e74c3c; flex: 1; max-width: 200px;">
                        <h4 style="margin: 0 0 15px 0; color: #e74c3c; text-align: center;">🔴 /d/ 音</h4>
                        <div id="dWordsList" class="words-container"></div>
                    </div>
                    
                    <div class="word-list" style="
                        background: rgba(46, 204, 113, 0.2); padding: 15px; border-radius: 10px; 
                        border: 2px solid #2ecc71; flex: 1; max-width: 200px;">
                        <h4 style="margin: 0 0 15px 0; color: #2ecc71; text-align: center;">🟢 /ɪd/ 音</h4>
                        <div id="idWordsList" class="words-container"></div>
                    </div>
                </div>
                
                <!-- 遊戲控制 -->
                <div class="game-controls" style="
                    text-align: center; background: rgba(255,255,255,0.1); 
                    padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                    
                    <div style="margin-bottom: 20px; font-size: 20px;">
                        選中的單詞: <span id="selectedWordText" style="color: #fbbf24; font-weight: bold; font-size: 24px;">無</span>
                    </div>
                    
                    <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                        <button id="confirmBtn" class="control-btn" style="
                            background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                            padding: 15px 30px; border-radius: 10px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease;" disabled>
                            ✅ 確認單詞
                        </button>
                        
                        <button id="clearBtn" class="control-btn" style="
                            background: linear-gradient(45deg, #f39c12, #e67e22); color: white; border: none; 
                            padding: 15px 30px; border-radius: 10px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease;">
                            🔄 清除選擇
                        </button>
                        
                        <button id="pronounceBtn" class="control-btn" style="
                            background: linear-gradient(45deg, #9b59b6, #8e44ad); color: white; border: none; 
                            padding: 15px 30px; border-radius: 10px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; transition: all 0.3s ease;" disabled>
                            🔊 聽發音
                        </button>
                    </div>
                </div>
                
                <!-- 返回按鈕 -->
                <div style="text-align: center;">
                    <button id="backBtn" style="
                        background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.5); 
                        padding: 15px 35px; border-radius: 10px; font-size: 18px; font-weight: bold; 
                        cursor: pointer; transition: all 0.3s ease;">
                        🏠 返回選單
                    </button>
                </div>
            </div>
            
            <style>
            /* 字母格子樣式 */
            .letter-grid .letter-cell {
                width: 38px;
                height: 38px;
                background: rgba(255,255,255,0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
                cursor: pointer;
                border-radius: 6px;
                transition: all 0.2s ease;
                user-select: none;
                border: 2px solid transparent;
                color: #333;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .letter-grid .letter-cell:hover {
                background: rgba(76, 204, 163, 0.8);
                color: white;
                transform: scale(1.1);
                border-color: #4ecca3;
                box-shadow: 0 4px 8px rgba(76, 204, 163, 0.3);
            }
            
            .letter-grid .letter-cell.selected {
                background: #4ecca3 !important;
                color: white;
                border-color: #2ecc71;
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(76, 204, 163, 0.6);
            }
            
            .letter-grid .letter-cell.found {
                background: #2ecc71 !important;
                color: white;
                border-color: #27ae60;
                animation: cellFound 0.8s ease-in-out;
            }
            
            @keyframes cellFound {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); box-shadow: 0 0 25px rgba(46, 204, 113, 0.8); }
                100% { transform: scale(1.05); }
            }
            
            /* 按鈕樣式 */
            .sound-btn:hover, .control-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            }
            
            .sound-btn.selected {
                transform: scale(1.1);
                box-shadow: 0 0 25px currentColor;
                border: 3px solid rgba(255,255,255,0.7);
            }
            
            .control-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none !important;
                box-shadow: none !important;
            }
            
            /* 找到的單詞樣式 */
            .found-word-item {
                background: rgba(255,255,255,0.2);
                padding: 10px;
                margin: 8px 0;
                border-radius: 8px;
                text-align: center;
                font-weight: bold;
                font-size: 16px;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            
            .found-word-item.found {
                background: rgba(46, 204, 113, 0.8);
                color: white;
                border-color: #2ecc71;
                animation: wordAdded 0.8s ease-in-out;
            }
            
            @keyframes wordAdded {
                0% { transform: scale(1); opacity: 0; }
                50% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            </style>
        `;
        
        console.log('✅ 遊戲界面設置完成');
    }
    
    resetGame() {
        console.log('🔄 重置遊戲狀態');
        
        this.score = 0;
        this.foundWords = { t: [], d: [], id: [] };
        this.currentSelection = [];
        this.selectedSound = null;
        this.bridgeProgress = { t: 0, d: 0, id: 0 };
        this.placedWords = [];
        
        // 選擇要放置的單詞 (每種類型4個)
        this.targetWords = [];
        Object.keys(this.wordDatabase).forEach(type => {
            const words = this.wordDatabase[type].slice(0, 4);
            words.forEach(word => {
                this.targetWords.push({ word, type });
            });
        });
        
        console.log(`✅ 遊戲重置完成，目標單詞: ${this.targetWords.length}個`);
    }
    
    generateGameBoard() {
        console.log('🎯 開始生成遊戲棋盤');
        
        // 創建空的棋盤
        this.gameBoard = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(''));
        
        // 在棋盤上放置目標單詞
        let placedCount = 0;
        this.targetWords.forEach(wordObj => {
            if (this.placeWordOnBoard(wordObj.word.toUpperCase())) {
                placedCount++;
                console.log(`放置單詞: ${wordObj.word} (${wordObj.type})`);
            }
        });
        
        // 用隨機字母填充空格子
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.gameBoard[row][col] === '') {
                    this.gameBoard[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
        
        console.log(`✅ 棋盤生成完成，成功放置 ${placedCount} 個單詞`);
        this.renderGameBoard();
    }
    
    placeWordOnBoard(word) {
        const directions = [
            [0, 1],   // 水平向右
            [1, 0],   // 垂直向下
            [1, 1],   // 對角線右下
            [-1, 1],  // 對角線右上
            [0, -1],  // 水平向左
            [-1, 0],  // 垂直向上
            [-1, -1], // 對角線左上
            [1, -1]   // 對角線左下
        ];
        
        let attempts = 0;
        const maxAttempts = 100;
        
        while (attempts < maxAttempts) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const startRow = Math.floor(Math.random() * this.boardSize);
            const startCol = Math.floor(Math.random() * this.boardSize);
            
            if (this.canPlaceWord(word, startRow, startCol, direction)) {
                this.placeWord(word, startRow, startCol, direction);
                
                // 記錄放置的單詞信息
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
        
        return false;
    }
    
    canPlaceWord(word, startRow, startCol, direction) {
        for (let i = 0; i < word.length; i++) {
            const row = startRow + direction[0] * i;
            const col = startCol + direction[1] * i;
            
            // 檢查是否超出邊界
            if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
                return false;
            }
            
            // 檢查格子是否空閒或已有相同字母
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
    
    renderGameBoard() {
        const gridElement = document.getElementById('letterGrid');
        if (!gridElement) {
            console.error('找不到字母網格元素！');
            return;
        }
        
        console.log('🎨 渲染字母網格');
        
        // 清空現有內容
        gridElement.innerHTML = '';
        
        // 創建所有格子
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'letter-cell';
                cell.textContent = this.gameBoard[row][col];
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // 添加點擊事件
                cell.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.selectCell(row, col, e);
                });
                
                gridElement.appendChild(cell);
            }
        }
        
        console.log(`✅ 字母網格渲染完成 (${this.boardSize}x${this.boardSize})`);
        
        // 驗證網格是否正確顯示
        const totalCells = gridElement.querySelectorAll('.letter-cell').length;
        console.log(`驗證: 創建了 ${totalCells} 個字母格子`);
    }
    
    setupGameControls() {
        console.log('🎮 設置遊戲控制');
        
        // 發音選擇按鈕
        document.querySelectorAll('.sound-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // 清除之前的選擇
                document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('selected'));
                
                // 選擇當前按鈕
                btn.classList.add('selected');
                this.selectedSound = btn.dataset.sound;
                
                const soundNames = { t: '/t/ 音', d: '/d/ 音', id: '/ɪd/ 音' };
                document.getElementById('currentSoundDisplay').textContent = soundNames[this.selectedSound];
                
                console.log(`選擇發音: ${this.selectedSound}`);
            });
        });
        
        // 控制按鈕
        document.getElementById('confirmBtn').addEventListener('click', () => this.confirmWord());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearSelection());
        document.getElementById('pronounceBtn').addEventListener('click', () => this.pronounceWord());
        
        // 返回按鈕
        document.getElementById('backBtn').addEventListener('click', () => {
            if (this.gameSystem) {
                this.gameSystem.showGameMenu();
            }
        });
        
        console.log('✅ 遊戲控制設置完成');
    }
    
    selectCell(row, col, event) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (!cell) return;
        
        if (event.shiftKey && this.currentSelection.length > 0) {
            // Shift+點擊: 選擇直線
            this.selectLine(this.currentSelection[0], { row, col });
        } else if (cell.classList.contains('selected')) {
            // 取消選擇
            cell.classList.remove('selected');
            this.currentSelection = this.currentSelection.filter(c => !(c.row === row && c.col === col));
        } else {
            // 普通選擇
            if (!event.ctrlKey && !event.metaKey) {
                this.clearSelection();
            }
            cell.classList.add('selected');
            this.currentSelection.push({ row, col });
        }
        
        this.updateSelectedWordDisplay();
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
        
        this.updateSelectedWordDisplay();
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
    
    updateSelectedWordDisplay() {
        const selectedWord = this.getSelectedWord();
        document.getElementById('selectedWordText').textContent = selectedWord || '無';
        
        const confirmBtn = document.getElementById('confirmBtn');
        const pronounceBtn = document.getElementById('pronounceBtn');
        
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
        
        const selectedWord = this.getSelectedWord().toLowerCase();
        const wordObj = this.targetWords.find(w => w.word.toLowerCase() === selectedWord);
        
        if (wordObj && !this.foundWords[wordObj.type].includes(selectedWord)) {
            if (wordObj.type === this.selectedSound) {
                // 答對了！
                this.foundWords[wordObj.type].push(selectedWord);
                this.bridgeProgress[wordObj.type]++;
                this.score += 10;
                
                // 標記格子為已找到
                this.currentSelection.forEach(cell => {
                    const cellElement = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                    if (cellElement) {
                        cellElement.classList.add('found');
                        cellElement.classList.remove('selected');
                    }
                });
                
                // 添加到對應的單詞列表
                this.addWordToList(selectedWord, wordObj.type);
                
                this.showMessage(`✅ 正確！${selectedWord} 是 /${wordObj.type}/ 音`, 'success');
                
                // 檢查是否完成了某個類型的3個單詞
                if (this.bridgeProgress[wordObj.type] === this.wordsNeededPerType) {
                    this.showBridgeRepair(wordObj.type);
                }
                
                console.log(`找到正確單詞: ${selectedWord} (${wordObj.type})`);
            } else {
                // 答錯了
                this.showMessage(`❌ 錯誤！${selectedWord} 不是 /${this.selectedSound}/ 音`, 'error');
                console.log(`錯誤分類: ${selectedWord} 應該是 ${wordObj.type}`);
            }
        } else if (wordObj && this.foundWords[wordObj.type].includes(selectedWord)) {
            this.showMessage('這個單詞已經找過了！', 'warning');
        } else {
            this.showMessage('這不是有效的目標單詞', 'error');
        }
        
        this.clearSelection();
        this.updateDisplay();
        
        // 檢查是否完成全部
        if (this.isGameComplete()) {
            setTimeout(() => this.showVictory(), 1000);
        }
    }
    
    addWordToList(word, type) {
        const listElement = document.getElementById(`${type}WordsList`);
        if (listElement) {
            const wordItem = document.createElement('div');
            wordItem.className = 'found-word-item found';
            wordItem.textContent = word;
            listElement.appendChild(wordItem);
        }
    }
    
    showBridgeRepair(type) {
        const typeNames = { t: '/t/ 音', d: '/d/ 音', id: '/ɪd/ 音' };
        this.showMessage(`🌉 太棒了！${typeNames[type]} 橋段修復完成！`, 'success');
        
        // 播放修復動畫效果
        this.playRepairAnimation(type);
    }
    
    playRepairAnimation(type) {
        // 創建修復動畫效果
        const container = document.querySelector('.bridge-progress');
        if (container) {
            const effect = document.createElement('div');
            effect.style.cssText = `
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                color: #4ecca3; font-size: 24px; font-weight: bold; z-index: 1000;
                animation: repairEffect 2s ease-out forwards; pointer-events: none;
            `;
            effect.textContent = '🌉 橋段修復！';
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes repairEffect {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(1) translateY(-50px); }
                }
            `;
            document.head.appendChild(style);
            
            container.style.position = 'relative';
            container.appendChild(effect);
            
            setTimeout(() => {
                if (effect.parentNode) {
                    effect.parentNode.removeChild(effect);
                }
                document.head.removeChild(style);
            }, 2000);
        }
    }
    
    clearSelection() {
        document.querySelectorAll('.letter-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        this.currentSelection = [];
        this.updateSelectedWordDisplay();
    }
    
    pronounceWord() {
        const selectedWord = this.getSelectedWord().toLowerCase();
        if (window.speechSynthesis && selectedWord) {
            const utterance = new SpeechSynthesisUtterance(selectedWord);
            utterance.lang = 'en-US';
            utterance.rate = 0.7;
            window.speechSynthesis.speak(utterance);
        }
    }
    
    updateDisplay() {
        // 更新分數和總數
        document.getElementById('gameScore').textContent = this.score;
        
        const totalFound = Object.values(this.foundWords).reduce((sum, arr) => sum + arr.length, 0);
        document.getElementById('totalFound').textContent = totalFound;
        
        // 更新各類型進度
        ['t', 'd', 'id'].forEach(type => {
            const count = this.foundWords[type].length;
            const percentage = (count / this.wordsNeededPerType) * 100;
            
            document.getElementById(`${type}Count`).textContent = `${count}/${this.wordsNeededPerType}`;
            document.getElementById(`${type}Progress`).style.width = `${percentage}%`;
        });
    }
    
    isGameComplete() {
        return Object.values(this.bridgeProgress).every(count => count >= this.wordsNeededPerType);
    }
    
    showVictory() {
        const gameContainer = document.getElementById('wordSearch');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = `
            <div class="victory-screen" style="
                background: linear-gradient(45deg, #4ecca3, #2ecc71, #1abc9c);
                min-height: 100vh; display: flex; flex-direction: column; 
                align-items: center; justify-content: center; color: white; text-align: center; padding: 40px;">
                
                <div class="victory-content" style="
                    background: rgba(0,0,0,0.3); padding: 50px; border-radius: 30px; 
                    max-width: 800px; animation: victoryBounce 1s ease-out;">
                    
                    <h1 style="font-size: 48px; margin: 0 0 30px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                        🎉 恭喜通關！
                    </h1>
                    
                    <!-- 完整的橋樑 -->
                    <div class="complete-bridge" style="
                        background: linear-gradient(180deg, #87ceeb 0%, #228b22 100%); 
                        margin: 40px 0; padding: 40px; border-radius: 20px; 
                        position: relative; height: 200px; overflow: hidden;">
                        
                        <!-- 左邊懸崖 -->
                        <div style="position: absolute; left: 0; top: 50%; width: 80px; height: 120px;
                                   background: linear-gradient(45deg, #8b4513, #a0522d); 
                                   clip-path: polygon(0 0, 80% 0, 100% 100%, 0 100%);
                                   transform: translateY(-50%);"></div>
                        
                        <!-- 右邊懸崖 -->
                        <div style="position: absolute; right: 0; top: 50%; width: 80px; height: 120px;
                                   background: linear-gradient(45deg, #8b4513, #a0522d); 
                                   clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%);
                                   transform: translateY(-50%);"></div>
                        
                        <!-- 完整的橋樑 -->
                        <div style="position: absolute; left: 50%; top: 70%; transform: translateX(-50%);
                                   display: flex; gap: 5px; align-items: center;">
                            <div style="width: 40px; height: 25px; background: #4ecca3; border-radius: 8px; border: 2px solid #2ecc71; animation: bridgeGlow 2s ease-in-out infinite;"></div>
                            <div style="width: 40px; height: 25px; background: #4ecca3; border-radius: 8px; border: 2px solid #2ecc71; animation: bridgeGlow 2s ease-in-out infinite 0.3s;"></div>
                            <div style="width: 40px; height: 25px; background: #4ecca3; border-radius: 8px; border: 2px solid #2ecc71; animation: bridgeGlow 2s ease-in-out infinite 0.6s;"></div>
                            <div style="width: 40px; height: 25px; background: #4ecca3; border-radius: 8px; border: 2px solid #2ecc71; animation: bridgeGlow 2s ease-in-out infinite 0.9s;"></div>
                            <div style="width: 40px; height: 25px; background: #4ecca3; border-radius: 8px; border: 2px solid #2ecc71; animation: bridgeGlow 2s ease-in-out infinite 1.2s;"></div>
                            <div style="width: 40px; height: 25px; background: #4ecca3; border-radius: 8px; border: 2px solid #2ecc71; animation: bridgeGlow 2s ease-in-out infinite 1.5s;"></div>
                            <div style="width: 40px; height: 25px; background: #4ecca3; border-radius: 8px; border: 2px solid #2ecc71; animation: bridgeGlow 2s ease-in-out infinite 1.8s;"></div>
                        </div>
                        
                        <!-- 慶祝的角色 -->
                        <div style="position: absolute; left: 50%; bottom: 20%; width: 50px; height: 60px; transform: translateX(-50%); animation: characterCelebrate 1.5s ease-in-out infinite;">
                            <div style="width: 35px; height: 35px; background: #fdbcb4; border-radius: 50%; margin: 0 auto; border: 3px solid #333;"></div>
                            <div style="width: 40px; height: 45px; background: #4ecca3; border-radius: 20px; margin: 5px auto 0; border: 2px solid #333;"></div>
                            <div style="position: absolute; top: 35px; left: -10px; width: 15px; height: 20px; background: #fdbcb4; border-radius: 10px; transform: rotate(-45deg); animation: armWave 0.5s ease-in-out infinite;"></div>
                            <div style="position: absolute; top: 35px; right: -10px; width: 15px; height: 20px; background: #fdbcb4; border-radius: 10px; transform: rotate(45deg); animation: armWave 0.5s ease-in-out infinite 0.3s;"></div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.2); padding: 30px; border-radius: 20px; margin: 30px 0;">
                        <h2 style="margin: 0 0 20px 0; color: #fff;">🌉 石橋修復成功！</h2>
                        <p style="font-size: 20px; margin: 0; line-height: 1.6;">
                            你成功找到了所有的過去式單詞並正確分類！<br>
                            石橋現在完全修復，可以安全通過了！
                        </p>
                        
                        <div style="margin: 25px 0; display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
                            <div style="text-align: center;">
                                <div style="font-size: 36px; color: #3498db;">🔵</div>
                                <div>/t/ 音: ${this.foundWords.t.length}/3</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 36px; color: #e74c3c;">🔴</div>
                                <div>/d/ 音: ${this.foundWords.d.length}/3</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 36px; color: #2ecc71;">🟢</div>
                                <div>/ɪd/ 音: ${this.foundWords.id.length}/3</div>
                            </div>
                        </div>
                        
                        <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">
                            最終分數: ${this.score} 分
                        </div>
                    </div>
                    
                    <div style="margin-top: 40px;">
                        <button onclick="window.wordSearchGame.startGame()" style="
                            background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                            padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                            cursor: pointer; margin: 15px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);
                            transition: all 0.3s ease;">
                            🔄 再玩一次
                        </button>
                        
                        <button onclick="window.gameSystem?.showGameMenu()" style="
                            background: rgba(255,255,255,0.3); color: white; border: 2px solid rgba(255,255,255,0.7); 
                            padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                            cursor: pointer; margin: 15px; transition: all 0.3s ease;">
                            🏠 返回選單
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
            @keyframes victoryBounce {
                0% { transform: scale(0.8); opacity: 0; }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); opacity: 1; }
            }
            
            @keyframes bridgeGlow {
                0%, 100% { box-shadow: 0 0 10px rgba(76, 204, 163, 0.6); }
                50% { box-shadow: 0 0 25px rgba(76, 204, 163, 1), 0 0 35px rgba(76, 204, 163, 0.8); }
            }
            
            @keyframes characterCelebrate {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50% { transform: translateX(-50%) translateY(-15px); }
            }
            
            @keyframes armWave {
                0%, 100% { transform: rotate(-45deg); }
                50% { transform: rotate(-70deg); }
            }
            </style>
        `;
        
        this.isGameActive = false;
        console.log('🎉 遊戲勝利！');
    }
    
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        
        const colors = {
            success: '#2ecc71',
            error: '#e74c3c', 
            warning: '#f39c12',
            info: '#3498db'
        };
        
        messageDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: ${colors[type] || colors.info}; color: white; 
            padding: 25px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
            z-index: 10000; box-shadow: 0 15px 35px rgba(0,0,0,0.3); text-align: center;
            animation: messageShow 0.3s ease-out; max-width: 500px;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes messageShow {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                    if (style.parentNode) {
                        style.parentNode.removeChild(style);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    stopGame() {
        this.isGameActive = false;
        this.currentSelection = [];
    }
}

// 初始化系統
document.addEventListener('DOMContentLoaded', () => {
    console.log('📋 Word Search 遊戲腳本載入完成');
    
    const initializeGame = () => {
        if (window.gameSystem) {
            window.wordSearchGame = new WordSearchGame(window.gameSystem);
            console.log('✅ Word Search 遊戲初始化成功');
        } else {
            setTimeout(initializeGame, 100);
        }
    };
    
    initializeGame();
    
    // 監控容器可見性變化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.id === 'wordSearch' && target.style.display !== 'none') {
                    if (!window.wordSearchGame || !window.wordSearchGame.isGameActive) {
                        console.log('🎯 檢測到 wordSearch 容器可見，啟動遊戲');
                        if (window.wordSearchGame) {
                            window.wordSearchGame.startGame();
                        }
                    }
                }
            }
        });
    });
    
    const wordSearchContainer = document.getElementById('wordSearch');
    if (wordSearchContainer) {
        observer.observe(wordSearchContainer, { attributes: true, attributeFilter: ['style'] });
        console.log('👁 開始監控 wordSearch 容器可見性');
    }
});

// 全域匯出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordSearchGame;
}
