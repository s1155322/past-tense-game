/**
 * Complete Game System - Master Controller
 * Handles all game states, transitions, scoring, and video playback
 */
class GameSystem {
    constructor() {
        this.currentGame = null;
        this.totalScore = 0;
        this.gameStates = {
            wordSearch: { completed: false, score: 0, unlocked: true },
            fallingWords: { completed: false, score: 0, unlocked: false },
            multipleChoice: { completed: false, score: 0, unlocked: false },
            bossFight: { completed: false, score: 0, unlocked: false }
        };
        
        // Artifact collection
        this.artifacts = {
            explorer: false,      // From wordSearch - 探險者之眼 👁
            timeController: false, // From fallingWords - 時間控制者 ⏰
            knowledgeGem: false   // From multipleChoice - 知識寶石 💎
        };
        
        this.currentStage = 1;
        this.gameProgression = ['wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'];
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        console.log('Initializing Complete Game System');
        this.setupEventListeners();
        this.loadGameState();
        this.isInitialized = true;
        
        // Check if we should show intro on first visit
        const hasSeenIntro = localStorage.getItem('hasSeenIntro');
        if (!hasSeenIntro) {
            setTimeout(() => {
                this.showIntroVideo();
            }, 1000);
        }
    }
    
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupMenuButtons();
            this.setupVideoControls();
        });
    }
    
    setupMenuButtons() {
        // Main menu buttons
        const startBtn = document.getElementById('startGame');
        const continueBtn = document.getElementById('continueGame');
        const collectionsBtn = document.getElementById('collectionsBtn');
        const quitBtn = document.getElementById('quitGame');
        const settingsBtn = document.getElementById('settingsBtn');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startNewGame());
        if (continueBtn) continueBtn.addEventListener('click', () => this.continueGame());
        if (collectionsBtn) collectionsBtn.addEventListener('click', () => this.showCollections());
        if (quitBtn) quitBtn.addEventListener('click', () => this.quitGame());
        if (settingsBtn) settingsBtn.addEventListener('click', () => this.showSettings());
        
        // Game menu buttons
        const gameButtons = document.querySelectorAll('[data-game]');
        gameButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameType = e.target.dataset.game;
                this.startGame(gameType);
            });
        });
    }
    
    setupVideoControls() {
        // Intro video controls
        const skipIntroBtn = document.getElementById('skipIntro');
        const continueStoryBtn = document.getElementById('continueStory');
        
        if (skipIntroBtn) {
            skipIntroBtn.addEventListener('click', () => this.skipIntroVideo());
        }
        
        if (continueStoryBtn) {
            continueStoryBtn.addEventListener('click', () => this.skipIntroVideo());
        }
        
        // Ending video controls
        const playAgainBtn = document.getElementById('playAgain');
        const backToMenuBtn = document.getElementById('backToMenu');
        
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.restartGame());
        }
        
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => this.hideEndingVideo());
        }
        
        // Video ended events
        const introVideo = document.getElementById('introVideo');
        const endingVideo = document.getElementById('endingVideo');
        
        if (introVideo) {
            introVideo.addEventListener('ended', () => this.skipIntroVideo());
            introVideo.addEventListener('error', () => {
                console.log('Intro video not found, showing story intro instead');
                this.showStoryIntro();
            });
        }
        
        if (endingVideo) {
            endingVideo.addEventListener('ended', () => {
                setTimeout(() => this.hideEndingVideo(), 2000);
            });
            endingVideo.addEventListener('error', () => {
                console.log('Ending video not found, showing congratulations screen');
                this.showFinalCongratulations();
            });
        }
    }
    
    // ==================== MAIN MENU SYSTEM ====================
    
    showMainMenu() {
        this.hideAllGameContainers();
        
        const mainMenu = document.getElementById('mainMenu');
        const gameContainer = document.getElementById('gameContainer');
        
        if (mainMenu) mainMenu.style.display = 'block';
        if (gameContainer) gameContainer.style.display = 'block';
        
        this.updateMainMenuButtons();
        console.log('Main menu displayed');
    }
    
    updateMainMenuButtons() {
        const continueBtn = document.getElementById('continueGame');
        const hasProgress = this.totalScore > 0 || Object.values(this.gameStates).some(state => state.completed);
        
        if (continueBtn) {
            continueBtn.style.display = hasProgress ? 'block' : 'none';
        }
    }
    
    showGameMenu() {
        this.hideAllGameContainers();
        
        const gameMenu = document.getElementById('gameMenu');
        if (gameMenu) {
            gameMenu.style.display = 'block';
            this.updateGameMenuButtons();
            this.updateGameStats();
        }
        
        console.log('Game menu displayed');
    }
    
    updateGameMenuButtons() {
        const gameButtons = document.querySelectorAll('[data-game]');
        
        gameButtons.forEach(btn => {
            const gameType = btn.dataset.game;
            const gameState = this.gameStates[gameType];
            
            if (gameState) {
                // Update button state based on unlock status
                btn.disabled = !gameState.unlocked;
                btn.style.opacity = gameState.unlocked ? '1' : '0.5';
                
                // Add completion indicator
                if (gameState.completed) {
                    btn.classList.add('completed');
                    if (!btn.querySelector('.completion-badge')) {
                        const badge = document.createElement('div');
                        badge.className = 'completion-badge';
                        badge.innerHTML = '✅';
                        badge.style.cssText = `
                            position: absolute; top: 5px; right: 5px; 
                            color: #4ecca3; font-size: 20px;
                        `;
                        btn.style.position = 'relative';
                        btn.appendChild(badge);
                    }
                }
                
                // Special styling for boss fight
                if (gameType === 'bossFight') {
                    const canAccessBoss = this.canAccessBoss();
                    btn.disabled = !canAccessBoss;
                    btn.style.opacity = canAccessBoss ? '1' : '0.3';
                    
                    if (!canAccessBoss) {
                        btn.title = '需要收集所有三個神器才能挑戰Boss！';
                    }
                }
            }
        });
    }
    
    updateGameStats() {
        const totalScoreElement = document.getElementById('totalScore');
        const currentStageElement = document.getElementById('currentStage');
        
        if (totalScoreElement) {
            totalScoreElement.textContent = this.totalScore;
        }
        
        if (currentStageElement) {
            currentStageElement.textContent = this.currentStage;
        }
    }
    
    showCollections() {
        this.hideAllGameContainers();
        
        const collectionsMenu = document.getElementById('collectionsMenu');
        if (collectionsMenu) {
            collectionsMenu.style.display = 'block';
            this.updateCollectionsDisplay();
        }
    }
    
    updateCollectionsDisplay() {
        const artifactElements = {
            explorer: document.querySelector('[data-artifact="explorer"]'),
            timeController: document.querySelector('[data-artifact="timeController"]'),
            knowledgeGem: document.querySelector('[data-artifact="knowledgeGem"]')
        };
        
        Object.keys(artifactElements).forEach(artifactKey => {
            const element = artifactElements[artifactKey];
            if (element) {
                const isCollected = this.artifacts[artifactKey];
                element.style.opacity = isCollected ? '1' : '0.3';
                element.style.filter = isCollected ? 'none' : 'grayscale(100%)';
                
                if (isCollected && !element.querySelector('.collected-badge')) {
                    const badge = document.createElement('div');
                    badge.className = 'collected-badge';
                    badge.innerHTML = '✅';
                    badge.style.cssText = `
                        position: absolute; top: 10px; right: 10px; 
                        color: #4ecca3; font-size: 24px; z-index: 10;
                    `;
                    element.style.position = 'relative';
                    element.appendChild(badge);
                }
            }
        });
    }
    
    // ==================== GAME FLOW MANAGEMENT ====================
    
    startNewGame() {
        // Show intro first
        this.showIntroVideo();
    }
    
    continueGame() {
        // Go directly to game menu
        this.showGameMenu();
    }
    
    startGame(gameType) {
        if (!this.gameStates[gameType]?.unlocked) {
            this.showMessage('🔒 這個遊戲還沒有解鎖！先完成前面的挑戰。', 3000);
            return;
        }
        
        if (gameType === 'bossFight' && !this.canAccessBoss()) {
            this.showMessage('🔒 需要收集所有三個神器才能挑戰Boss！', 3000);
            return;
        }
        
        this.currentGame = gameType;
        this.hideAllGameContainers();
        
        const gameContainer = document.getElementById(gameType);
        if (gameContainer) {
            gameContainer.style.display = 'block';
            
            // Dispatch game initialization event
            const event = new CustomEvent('gameInitialize', {
                detail: { gameType: gameType }
            });
            document.dispatchEvent(event);
            
            console.log(`Starting game: ${gameType}`);
        }
    }
    
    checkLevelCompletion(gameType) {
        if (this.gameStates[gameType]) {
            this.gameStates[gameType].completed = true;
            
            // Award artifacts
            this.awardArtifact(gameType);
            
            // Unlock next game
            this.unlockNextGame(gameType);
            
            // Save progress
            this.saveGameState();
            
            // Show transition to next stage
            const nextGame = this.getNextGame(gameType);
            if (nextGame) {
                setTimeout(() => {
                    this.showStageTransition(gameType, nextGame);
                }, 1000);
            } else if (gameType === 'bossFight') {
                // Final victory - show ending
                setTimeout(() => {
                    this.showEndingVideo();
                }, 2000);
            }
        }
    }
    
    awardArtifact(gameType) {
        const artifactMap = {
            wordSearch: 'explorer',
            fallingWords: 'timeController',
            multipleChoice: 'knowledgeGem'
        };
        
        const artifact = artifactMap[gameType];
        if (artifact && !this.artifacts[artifact]) {
            this.artifacts[artifact] = true;
            
            const artifactNames = {
                explorer: '探險者之眼 👁',
                timeController: '時間控制者 ⏰',
                knowledgeGem: '知識寶石 💎'
            };
            
            this.showMessage(`🏆 獲得神器：${artifactNames[artifact]}`, 3000);
        }
    }
    
    unlockNextGame(completedGame) {
        const gameOrder = ['wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'];
        const currentIndex = gameOrder.indexOf(completedGame);
        
        if (currentIndex >= 0 && currentIndex < gameOrder.length - 1) {
            const nextGame = gameOrder[currentIndex + 1];
            if (this.gameStates[nextGame]) {
                this.gameStates[nextGame].unlocked = true;
                this.currentStage = currentIndex + 2;
            }
        }
    }
    
    getNextGame(currentGame) {
        const gameOrder = ['wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'];
        const currentIndex = gameOrder.indexOf(currentGame);
        
        if (currentIndex >= 0 && currentIndex < gameOrder.length - 1) {
            return gameOrder[currentIndex + 1];
        }
        
        return null;
    }
    
    canAccessBoss() {
        return this.artifacts.explorer && this.artifacts.timeController && this.artifacts.knowledgeGem;
    }
    
    // ==================== STAGE TRANSITIONS ====================
    
    showStageTransition(completedGame, nextGame) {
        const transitionData = {
            wordSearch: {
                name: '石橋修復',
                icon: '🌉',
                artifact: '👁',
                artifactName: '探險者之眼',
                nextName: '石塊斬擊',
                nextIcon: '⚔️',
                bg: 'linear-gradient(180deg, #87ceeb 0%, #4682b4 50%, #2e8b57 100%)',
                story: '橋樑修復完成！接下來要面對從天空掉落的音標石塊挑戰...'
            },
            fallingWords: {
                name: '石塊斬擊',
                icon: '⚔️',
                artifact: '⏰',
                artifactName: '時間控制者',
                nextName: '催眠術破解',
                nextIcon: '🧙‍♂️',
                bg: 'linear-gradient(180deg, #1e293b 0%, #475569 100%)',
                story: '石塊斬擊成功！現在要對抗邪惡巫師的催眠術...'
            },
            multipleChoice: {
                name: '催眠術破解',
                icon: '🧙‍♂️',
                artifact: '💎',
                artifactName: '知識寶石',
                nextName: '最終Boss戰',
                nextIcon: '👑',
                bg: 'linear-gradient(45deg, #2d1b69 0%, #8b5cf6 50%, #2d1b69 100%)',
                story: '催眠術被破解！準備面對最終的發音之王Boss戰！'
            }
        };
        
        const data = transitionData[completedGame];
        if (!data) return;
        
        // Create full-screen transition cutscene
        const transitionDiv = document.createElement('div');
        transitionDiv.id = 'stageTransition';
        transitionDiv.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999;
            background: ${data.bg}; display: flex; align-items: center; justify-content: center;
            animation: fadeIn 1s ease-out;
        `;
        
        transitionDiv.innerHTML = `
            <!-- Cinematic letterbox bars -->
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 80px; 
                        background: linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.3));"></div>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 80px; 
                        background: linear-gradient(0deg, rgba(0,0,0,0.9), rgba(0,0,0,0.3));"></div>
            
            <div class="transition-content" style="
                text-align: center; color: white; max-width: 800px; padding: 60px; 
                background: rgba(0,0,0,0.4); border-radius: 20px; position: relative;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                
                <!-- Chapter Complete Section -->
                <div class="chapter-complete" style="margin-bottom: 50px;">
                    <div style="font-size: 100px; margin: 30px 0; animation: stageIcon 2s ease-in-out infinite;">
                        ${data.icon}
                    </div>
                    
                    <h1 style="font-size: 48px; margin: 30px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
                               background: linear-gradient(45deg, #4ecca3, #2ecc71); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ${data.name}完成！
                    </h1>
                    
                    <!-- Artifact Showcase -->
                    <div class="artifact-showcase" style="
                        background: rgba(255,255,255,0.15); padding: 30px; border-radius: 20px; 
                        margin: 40px 0; border: 3px solid rgba(255,255,255,0.3);
                        animation: artifactGlow 3s ease-in-out infinite;">
                        
                        <h3 style="margin-top: 0; color: #fbbf24; font-size: 24px;">🏆 獲得傳說神器</h3>
                        <div style="font-size: 80px; margin: 20px 0; animation: artifactSpin 4s linear infinite;">
                            ${data.artifact}
                        </div>
                        <p style="font-size: 22px; margin: 15px 0; font-weight: bold; color: #4ecca3;">
                            ${data.artifactName}
                        </p>
                        
                        <!-- Power level indicator -->
                        <div style="margin: 20px 0;">
                            <div style="color: #94a3b8; font-size: 14px;">神器力量等級</div>
                            <div style="width: 200px; height: 8px; background: rgba(255,255,255,0.3); 
                                       border-radius: 4px; margin: 8px auto; overflow: hidden;">
                                <div style="width: 100%; height: 100%; 
                                           background: linear-gradient(90deg, #4ecca3, #2ecc71, #fbbf24);
                                           border-radius: 4px; animation: powerFill 2s ease-out 1s both;">
                                </div>
                            </div>
                            <div style="color: #4ecca3; font-size: 16px; font-weight: bold;">MAX</div>
                        </div>
                    </div>
                </div>
                
                <!-- Chapter Transition -->
                <div class="chapter-transition" style="margin: 50px 0; position: relative;">
                    <!-- Animated separator -->
                    <div style="height: 2px; background: linear-gradient(90deg, transparent, #4ecca3, transparent); 
                               margin: 30px 0; animation: separator 3s ease-in-out infinite;"></div>
                    
                    <h2 style="font-size: 28px; margin: 30px 0; color: #fbbf24;">
                        📖 冒險故事繼續...
                    </h2>
                    
                    <div class="story-text" style="
                        background: rgba(0,0,0,0.6); padding: 25px; border-radius: 15px; 
                        margin: 30px 0; font-size: 20px; line-height: 1.6; 
                        border-left: 5px solid #4ecca3;">
                        ${data.story}
                    </div>
                    
                    <!-- Next chapter preview -->
                    <div class="next-chapter" style="
                        background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; 
                        margin: 30px 0; border: 2px solid rgba(255,255,255,0.2);">
                        
                        <h3 style="color: #94a3b8; margin-top: 0;">下一章節</h3>
                        <div style="display: flex; align-items: center; justify-content: center; margin: 20px 0;">
                            <div style="font-size: 60px; margin: 0 20px; animation: nextIcon 2s ease-in-out infinite 0.5s;">
                                ${data.nextIcon}
                            </div>
                            <div>
                                <h2 style="margin: 5px 0; font-size: 32px; color: #e5e7eb;">
                                    ${data.nextName}
                                </h2>
                                <div style="color: #94a3b8; font-size: 16px;">
                                    新的挑戰等待著你...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Auto-progress countdown -->
                <div class="auto-progress" style="margin: 40px 0;">
                    <div style="color: #94a3b8; font-size: 18px; margin-bottom: 15px;">
                        自動進入下一階段倒數：<span id="countdown" style="color: #4ecca3; font-weight: bold; font-size: 24px;">5</span>秒
                    </div>
                    
                    <!-- Circular countdown -->
                    <div style="position: relative; width: 60px; height: 60px; margin: 20px auto;">
                        <svg width="60" height="60" style="transform: rotate(-90deg);">
                            <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>
                            <circle id="countdownCircle" cx="30" cy="30" r="25" fill="none" 
                                    stroke="#4ecca3" stroke-width="4" stroke-linecap="round"
                                    stroke-dasharray="157" stroke-dashoffset="157"
                                    style="transition: stroke-dashoffset 1s linear;"/>
                        </svg>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                   color: #4ecca3; font-size: 18px; font-weight: bold;">
                            <span id="countdownNumber">5</span>
                        </div>
                    </div>
                    
                    <div style="width: 300px; height: 6px; background: rgba(255,255,255,0.3); 
                               border-radius: 3px; margin: 20px auto; overflow: hidden;">
                        <div id="autoProgressBar" style="
                            width: 100%; height: 100%; background: linear-gradient(90deg, #4ecca3, #2ecc71);
                            transition: width 5s linear; border-radius: 3px;">
                        </div>
                    </div>
                </div>
                
                <!-- Control buttons -->
                <div style="margin-top: 40px;">
                    <button id="continueNow" style="
                        background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                        padding: 18px 35px; border-radius: 12px; font-size: 20px; font-weight: bold; 
                        cursor: pointer; margin: 0 15px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);
                        transition: transform 0.3s ease;">
                        ⚡ 立即繼續冒險
                    </button>
                    
                    <button id="backToMenu" style="
                        background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.5); 
                        padding: 18px 35px; border-radius: 12px; font-size: 20px; font-weight: bold; 
                        cursor: pointer; margin: 0 15px; transition: all 0.3s ease;">
                        🏠 返回選單
                    </button>
                </div>
            </div>
            
            <!-- Animated background particles -->
            <div class="bg-particles" style="position: absolute; width: 100%; height: 100%; overflow: hidden; z-index: -1;">
                ${Array.from({length: 20}, (_, i) => `
                    <div style="position: absolute; 
                               left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; 
                               width: 4px; height: 4px; background: rgba(255,255,255,0.6); border-radius: 50%;
                               animation: particle${i % 3 + 1} ${3 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s;"></div>
                `).join('')}
            </div>
            
            <style>
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes stageIcon {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.1) rotate(5deg); }
            }
            @keyframes artifactGlow {
                0%, 100% { box-shadow: 0 0 30px rgba(76, 204, 163, 0.3); }
                50% { box-shadow: 0 0 50px rgba(76, 204, 163, 0.6); }
            }
            @keyframes artifactSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes powerFill {
                from { width: 0%; }
                to { width: 100%; }
            }
            @keyframes separator {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
            @keyframes nextIcon {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            @keyframes particle1 {
                0%, 100% { opacity: 0.2; transform: translateY(0); }
                50% { opacity: 1; transform: translateY(-20px); }
            }
            @keyframes particle2 {
                0%, 100% { opacity: 0.3; transform: translateX(0); }
                50% { opacity: 1; transform: translateX(15px); }
            }
            @keyframes particle3 {
                0%, 100% { opacity: 0.4; transform: translate(0, 0); }
                50% { opacity: 1; transform: translate(-10px, -15px); }
            }
            
            #continueNow:hover { transform: translateY(-3px) scale(1.05); }
            #backToMenu:hover { background: rgba(255,255,255,0.3); }
            </style>
        `;
        
        document.body.appendChild(transitionDiv);
        
        // Setup enhanced countdown with circular progress
        this.setupEnhancedCountdown(nextGame, transitionDiv);
    }
    
    setupEnhancedCountdown(nextGame, transitionDiv) {
        let countdown = 5;
        const countdownElement = document.getElementById('countdownNumber');
        const countdownCircle = document.getElementById('countdownCircle');
        const progressBar = document.getElementById('autoProgressBar');
        
        // Start circular countdown animation
        const circumference = 2 * Math.PI * 25; // radius = 25
        
        const updateCircularProgress = () => {
            const progress = (5 - countdown) / 5;
            const offset = circumference - (progress * circumference);
            if (countdownCircle) {
                countdownCircle.style.strokeDashoffset = offset;
            }
        };
        
        // Start progress bar animation
        setTimeout(() => {
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        }, 100);
        
        const countdownInterval = setInterval(() => {
            countdown--;
            
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            
            updateCircularProgress();
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                this.proceedToNextGame(nextGame);
                this.removeTransition();
            }
        }, 1000);
        
        // Setup button events
        const continueBtn = document.getElementById('continueNow');
        const backBtn = document.getElementById('backToMenu');
        
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                clearInterval(countdownInterval);
                this.proceedToNextGame(nextGame);
                this.removeTransition();
            });
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                clearInterval(countdownInterval);
                this.removeTransition();
                this.showGameMenu();
            });
        }
    }
    
    proceedToNextGame(nextGame) {
        console.log('Proceeding to next game:', nextGame);
        
        if (nextGame === 'bossFight' && !this.canAccessBoss()) {
            this.showMessage('🔒 需要收集所有三個神器才能挑戰Boss！', 3000);
            setTimeout(() => this.showGameMenu(), 3000);
        } else {
            // Small delay before starting next game
            setTimeout(() => {
                this.startGame(nextGame);
            }, 500);
        }
    }
    
    removeTransition() {
        const transition = document.getElementById('stageTransition');
        if (transition && transition.parentNode) {
            document.body.removeChild(transition);
        }
    }
    
    // ==================== VIDEO SYSTEM ====================
    
    showIntroVideo() {
        const storyContainer = document.getElementById('storyContainer');
        const introVideo = document.getElementById('introVideo');
        
        if (storyContainer) {
            storyContainer.style.display = 'block';
            this.hideAllGameContainers();
            
            console.log('Showing intro video');
            
            if (introVideo) {
                // Try to play the video
                introVideo.currentTime = 0;
                const playPromise = introVideo.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Intro video playing');
                    }).catch(error => {
                        console.log('Video autoplay failed:', error);
                        // Show story intro instead
                        this.showStoryIntro();
                    });
                }
            } else {
                // No video element, show story intro
                this.showStoryIntro();
            }
            
            // Mark intro as seen
            localStorage.setItem('hasSeenIntro', 'true');
        } else {
            // No story container, show story intro directly
            this.showStoryIntro();
        }
    }
    
    showStoryIntro() {
        // Hide video container
        const storyContainer = document.getElementById('storyContainer');
        if (storyContainer) {
            storyContainer.style.display = 'none';
        }
        
        // Show animated story intro
        this.showIntroAnimation();
    }
    
    skipIntroVideo() {
        const storyContainer = document.getElementById('storyContainer');
        const introVideo = document.getElementById('introVideo');
        
        if (storyContainer) {
            storyContainer.style.display = 'none';
        }
        
        if (introVideo) {
            introVideo.pause();
            introVideo.currentTime = 0;
        }
        
        // Go to game menu
        setTimeout(() => {
            this.showGameMenu();
        }, 500);
    }
    
    showIntroAnimation() {
        const introDiv = document.createElement('div');
        introDiv.id = 'gameIntro';
        introDiv.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999;
            background: linear-gradient(45deg, #2c3e50 0%, #3498db 50%, #9b59b6 100%);
            display: flex; align-items: center; justify-content: center;
        `;
        
        introDiv.innerHTML = `
            <div class="intro-content" style="text-align: center; color: white; max-width: 800px; padding: 60px;">
                
                <div style="font-size: 120px; margin: 40px 0; animation: titlePulse 3s ease-in-out infinite;">
                    🎭📚
                </div>
                
                <h1 style="font-size: 48px; margin: 30px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
                           background: linear-gradient(45deg, #4ecca3, #fbbf24, #e74c3c); 
                           -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                           animation: titleShine 2s ease-in-out infinite;">
                    英語過去式發音冒險
                </h1>
                
                <h2 style="font-size: 24px; margin: 20px 0; color: #94a3b8;">
                    Language Quest Adventure
                </h2>
                
                <div class="story-intro" style="
                    background: rgba(0,0,0,0.6); padding: 30px; border-radius: 20px; 
                    margin: 40px 0; font-size: 18px; line-height: 1.6;">
                    
                    <p style="margin: 20px 0;">
                        在一個遙遠的語言王國裡，邪惡的發音之王封印了所有的語音知識...
                    </p>
                    <p style="margin: 20px 0;">
                        只有掌握了英語過去式發音的勇者才能打敗他，拯救這個王國！
                    </p>
                    <p style="margin: 20px 0; color: #4ecca3; font-weight: bold;">
                        你準備好開始這場史詩級的語言冒險了嗎？
                    </p>
                </div>
                
                <button onclick="window.gameSystem.hideIntroAnimation(); window.gameSystem.showGameMenu();" style="
                    background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                    padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                    cursor: pointer; margin: 30px 10px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);
                    animation: buttonGlow 2s ease-in-out infinite;">
                    🚀 開始冒險
                </button>
                
                <button onclick="window.gameSystem.hideIntroAnimation(); window.gameSystem.showMainMenu();" style="
                    background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.5); 
                    padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                    cursor: pointer; margin: 30px 10px;">
                    返回主選單
                </button>
            </div>
            
            <style>
            @keyframes titlePulse {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.1) rotate(5deg); }
            }
            @keyframes titleShine {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.3); }
            }
            @keyframes buttonGlow {
                0%, 100% { box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4); }
                50% { box-shadow: 0 12px 35px rgba(76, 204, 163, 0.7); }
            }
            </style>
        `;
        
        document.body.appendChild(introDiv);
    }
    
    hideIntroAnimation() {
        const intro = document.getElementById('gameIntro');
        if (intro && intro.parentNode) {
            document.body.removeChild(intro);
        }
    }
    
    showEndingVideo() {
        const endingContainer = document.getElementById('endingContainer');
        const endingVideo = document.getElementById('endingVideo');
        
        if (endingContainer) {
            endingContainer.style.display = 'flex';
            console.log('Showing ending video');
            
            if (endingVideo) {
                // Try to play the ending video
                endingVideo.currentTime = 0;
                const playPromise = endingVideo.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Ending video playing');
                    }).catch(error => {
                        console.log('Ending video autoplay failed:', error);
                        // Show congratulations screen instead
                        this.showFinalCongratulations();
                    });
                }
            } else {
                // No video element, show congratulations
                this.showFinalCongratulations();
            }
        } else {
            // No ending container, show congratulations
            this.showFinalCongratulations();
        }
    }
    
    hideEndingVideo() {
        const endingContainer = document.getElementById('endingContainer');
        const endingVideo = document.getElementById('endingVideo');
        
        if (endingContainer) {
            endingContainer.style.display = 'none';
        }
        
        if (endingVideo) {
            endingVideo.pause();
            endingVideo.currentTime = 0;
        }
        
        // Return to main menu
        setTimeout(() => {
            this.showMainMenu();
        }, 500);
    }
    
    showFinalCongratulations() {
        // Hide ending video container
        const endingContainer = document.getElementById('endingContainer');
        if (endingContainer) {
            endingContainer.style.display = 'none';
        }
        
        // Create congratulations screen
        const congratsDiv = document.createElement('div');
        congratsDiv.id = 'finalCongratulations';
        congratsDiv.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999;
            background: linear-gradient(45deg, #10b981, #059669, #fbbf24); 
            display: flex; align-items: center; justify-content: center;
        `;
        
        congratsDiv.innerHTML = `
            <div class="congrats-content" style="text-align: center; color: white; max-width: 800px; padding: 60px;">
                
                <div style="font-size: 120px; margin: 40px 0; animation: finalCelebration 3s ease-in-out infinite;">
                    🎉👑🏆
                </div>
                
                <h1 style="font-size: 48px; margin: 30px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.7);">
                    恭喜！冒險圓滿完成！
                </h1>
                
                <p style="font-size: 24px; margin: 25px 0; line-height: 1.5;">
                    你已經成功掌握了英語過去式的所有發音規則！<br>
                    從此，語言不再是障礙，而是你征服世界的利器！
                </p>
                
                <div style="background: rgba(255,255,255,0.2); padding: 30px; border-radius: 15px; margin: 35px 0;">
                    <h3>最終成就</h3>
                    <div style="display: flex; justify-content: space-around; margin: 20px 0;">
                        <div>
                            <div style="font-size: 32px; color: #fbbf24;">👁</div>
                            <div style="font-size: 14px;">探險者之眼</div>
                        </div>
                        <div>
                            <div style="font-size: 32px; color: #fbbf24;">⏰</div>
                            <div style="font-size: 14px;">時間控制者</div>
                        </div>
                        <div>
                            <div style="font-size: 32px; color: #fbbf24;">💎</div>
                            <div style="font-size: 14px;">知識寶石</div>
                        </div>
                        <div>
                            <div style="font-size: 32px; color: #fbbf24;">👑</div>
                            <div style="font-size: 14px;">語言大師</div>
                        </div>
                    </div>
                    <div style="font-size: 20px; margin: 15px 0;">
                        總分數: <strong style="color: #fbbf24;">${this.totalScore}</strong>
                    </div>
                </div>
                
                <div style="margin: 40px 0;">
                    <button onclick="window.gameSystem.hideFinalCongratulations(); window.gameSystem.showMainMenu();" style="
                        background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                        padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                        cursor: pointer; margin: 0 15px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);">
                        🏠 返回主選單
                    </button>
                    
                    <button onclick="window.location.reload();" style="
                        background: linear-gradient(45deg, #8b5cf6, #7c3aed); color: white; border: none; 
                        padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                        cursor: pointer; margin: 0 15px; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);">
                        🔄 重新開始冒險
                    </button>
                </div>
            </div>
            
            <style>
            @keyframes finalCelebration {
                0%, 100% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.1) rotate(5deg); }
                75% { transform: scale(1.1) rotate(-5deg); }
            }
            </style>
        `;
        
        document.body.appendChild(congratsDiv);
    }
    
    hideFinalCongratulations() {
        const congrats = document.getElementById('finalCongratulations');
        if (congrats && congrats.parentNode) {
            document.body.removeChild(congrats);
        }
    }
    
    restartGame() {
        // Reset all game states
        this.resetAllGameStates();
        
        // Reload the page for fresh start
        window.location.reload();
    }
    
    // ==================== UTILITY FUNCTIONS ====================
    
    hideAllGameContainers() {
        const gameContainers = ['mainMenu', 'gameMenu', 'collectionsMenu', 'storyContainer', 'endingContainer',
                               'wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'];
        
        gameContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.style.display = 'none';
            }
        });
        
        // Also hide any transition screens
        this.removeTransition();
        this.hideIntroAnimation();
        this.hideFinalCongratulations();
    }
    
    updateScore(gameType, points, isTotal = true) {
        if (this.gameStates[gameType]) {
            if (isTotal) {
                this.gameStates[gameType].score = points;
            } else {
                this.gameStates[gameType].score += points;
            }
            
            // Update total score
            this.calculateTotalScore();
            this.saveGameState();
        }
    }
    
    calculateTotalScore() {
        this.totalScore = Object.values(this.gameStates).reduce((total, state) => total + state.score, 0);
    }
    
    showMessage(message, duration = 3000) {
        // Remove existing messages
        const existingMessage = document.getElementById('gameMessage');
        if (existingMessage) {
            document.body.removeChild(existingMessage);
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.id = 'gameMessage';
        messageDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
            background: rgba(0,0,0,0.9); color: white; padding: 25px 35px; 
            border-radius: 15px; font-size: 20px; text-align: center; z-index: 10000; 
            box-shadow: 0 8px 25px rgba(0,0,0,0.5); border: 2px solid #4ecca3;
            animation: messageSlideIn 0.5s ease-out;
        `;
        
        messageDiv.innerHTML = message;
        
        // Add CSS animation
        if (!document.getElementById('messageAnimation')) {
            const style = document.createElement('style');
            style.id = 'messageAnimation';
            style.textContent = `
                @keyframes messageSlideIn {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'messageSlideIn 0.5s ease-out reverse';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        document.body.removeChild(messageDiv);
                    }
                }, 500);
            }
        }, duration);
    }
    
    showSettings() {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            settingsPanel.style.display = 'flex';
        }
    }
    
    quitGame() {
        if (confirm('確定要離開遊戲嗎？')) {
            // Save current state before closing
            this.saveGameState();
            window.close();
        }
    }
    
    // ==================== DATA PERSISTENCE ====================
    
    saveGameState() {
        const gameData = {
            totalScore: this.totalScore,
            gameStates: this.gameStates,
            artifacts: this.artifacts,
            currentStage: this.currentStage
        };
        
        localStorage.setItem('languageQuestSave', JSON.stringify(gameData));
        console.log('Game state saved');
    }
    
    loadGameState() {
        const savedData = localStorage.getItem('languageQuestSave');
        
        if (savedData) {
            try {
                const gameData = JSON.parse(savedData);
                
                this.totalScore = gameData.totalScore || 0;
                this.gameStates = { ...this.gameStates, ...gameData.gameStates };
                this.artifacts = { ...this.artifacts, ...gameData.artifacts };
                this.currentStage = gameData.currentStage || 1;
                
                console.log('Game state loaded');
            } catch (error) {
                console.error('Failed to load game state:', error);
            }
        }
    }
    
    resetAllGameStates() {
        this.totalScore = 0;
        this.currentStage = 1;
        
        this.gameStates = {
            wordSearch: { completed: false, score: 0, unlocked: true },
            fallingWords: { completed: false, score: 0, unlocked: false },
            multipleChoice: { completed: false, score: 0, unlocked: false },
            bossFight: { completed: false, score: 0, unlocked: false }
        };
        
        this.artifacts = {
            explorer: false,
            timeController: false,
            knowledgeGem: false
        };
        
        // Clear saved data
        localStorage.removeItem('languageQuestSave');
        localStorage.removeItem('hasSeenIntro');
        
        this.saveGameState();
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GameSystem
    window.gameSystem = new GameSystem();
    console.log('Complete Game System initialized');
    
    // Show main menu after initialization
    setTimeout(() => {
        window.gameSystem.showMainMenu();
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSystem;
}
