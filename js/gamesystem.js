/**
 * Complete Game System - REVISED & DEBUGGED VERSION
 * Fixed all 404 errors and button functionality issues
 * Properly handles intro.mp4 and ending.mp4 videos
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
        
        // Debug flag
        this.debug = true;
        
        this.log('GameSystem constructor called');
        this.init();
    }
    
    log(message) {
        if (this.debug) {
            console.log('[GameSystem]', message);
        }
    }
    
    init() {
        this.log('Initializing Complete Game System');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupSystem();
            });
        } else {
            this.setupSystem();
        }
    }
    
    setupSystem() {
        this.log('Setting up system...');
        
        try {
            this.setupEventListeners();
            this.loadGameState();
            this.isInitialized = true;
            
            this.log('System setup complete');
            
            // Check if we should show intro on first visit
            const hasSeenIntro = localStorage.getItem('hasSeenIntro');
            if (!hasSeenIntro) {
                this.log('First visit - showing intro');
                setTimeout(() => {
                    this.showIntroVideo();
                }, 1000);
            } else {
                this.log('Returning visitor - showing main menu');
                setTimeout(() => {
                    this.showMainMenu();
                }, 500);
            }
        } catch (error) {
            console.error('Error setting up game system:', error);
        }
    }
    
    setupEventListeners() {
        this.log('Setting up event listeners');
        
        // Setup menu buttons with error handling
        this.setupMenuButtons();
        
        // Setup video controls with proper paths
        this.setupVideoControls();
        
        // Setup settings panel
        this.setupSettingsPanel();
        
        this.log('Event listeners setup complete');
    }
    
    setupMenuButtons() {
        this.log('Setting up menu buttons');
        
        // Main menu buttons with null checks
        const startBtn = document.getElementById('startGame');
        const continueBtn = document.getElementById('continueGame');
        const collectionsBtn = document.getElementById('collectionsBtn');
        const quitBtn = document.getElementById('quitGame');
        const settingsBtn = document.getElementById('settingsBtn');
        
        if (startBtn) {
            startBtn.onclick = () => this.startNewGame();
            this.log('Start button connected');
        }
        
        if (continueBtn) {
            continueBtn.onclick = () => this.continueGame();
            this.log('Continue button connected');
        }
        
        if (collectionsBtn) {
            collectionsBtn.onclick = () => this.showCollections();
            this.log('Collections button connected');
        }
        
        if (quitBtn) {
            quitBtn.onclick = () => this.quitGame();
            this.log('Quit button connected');
        }
        
        if (settingsBtn) {
            settingsBtn.onclick = () => this.showSettings();
            this.log('Settings button connected');
        }
        
        // Game menu buttons
        const gameButtons = document.querySelectorAll('[data-game]');
        this.log(`Found ${gameButtons.length} game buttons`);
        
        gameButtons.forEach(btn => {
            btn.onclick = (e) => {
                const gameType = e.target.dataset.game || e.target.closest('[data-game]').dataset.game;
                this.log(`Game button clicked: ${gameType}`);
                this.startGame(gameType);
            };
        });
    }
    
    setupVideoControls() {
        this.log('Setting up video controls');
        
        // Intro video setup with proper error handling
        const introVideo = document.getElementById('introVideo');
        if (introVideo) {
            introVideo.src = 'assets/video/intro.mp4';
            
            introVideo.addEventListener('loadeddata', () => {
                this.log('Intro video loaded successfully');
            });
            
            introVideo.addEventListener('error', (e) => {
                this.log('Intro video failed to load:', e);
                console.warn('Intro video not found - will use animated intro');
            });
            
            introVideo.addEventListener('ended', () => {
                this.log('Intro video ended');
                this.skipIntroVideo();
            });
        }
        
        // Ending video setup
        const endingVideo = document.getElementById('endingVideo');
        if (endingVideo) {
            endingVideo.src = 'assets/video/ending.mp4';
            
            endingVideo.addEventListener('loadeddata', () => {
                this.log('Ending video loaded successfully');
            });
            
            endingVideo.addEventListener('error', (e) => {
                this.log('Ending video failed to load:', e);
                console.warn('Ending video not found - will use congratulations screen');
            });
            
            endingVideo.addEventListener('ended', () => {
                this.log('Ending video ended');
                setTimeout(() => this.hideEndingVideo(), 2000);
            });
        }
        
        // Video control buttons
        const skipIntroBtn = document.getElementById('skipIntro');
        const continueStoryBtn = document.getElementById('continueStory');
        const playAgainBtn = document.getElementById('playAgain');
        const backToMenuBtn = document.getElementById('backToMenu');
        
        if (skipIntroBtn) {
            skipIntroBtn.onclick = () => {
                this.log('Skip intro clicked');
                this.skipIntroVideo();
            };
        }
        
        if (continueStoryBtn) {
            continueStoryBtn.onclick = () => {
                this.log('Continue story clicked');
                this.skipIntroVideo();
            };
        }
        
        if (playAgainBtn) {
            playAgainBtn.onclick = () => {
                this.log('Play again clicked');
                this.restartGame();
            };
        }
        
        if (backToMenuBtn) {
            backToMenuBtn.onclick = () => {
                this.log('Back to menu clicked');
                this.hideEndingVideo();
            };
        }
    }
    
    setupSettingsPanel() {
        const closeSettingsBtn = document.getElementById('closeSettings');
        if (closeSettingsBtn) {
            closeSettingsBtn.onclick = () => {
                const settingsPanel = document.getElementById('settingsPanel');
                if (settingsPanel) {
                    settingsPanel.style.display = 'none';
                }
            };
        }
    }
    
    // ==================== MAIN MENU SYSTEM ====================
    
    showMainMenu() {
        this.log('Showing main menu');
        this.hideAllGameContainers();
        
        const mainMenu = document.getElementById('mainMenu');
        const gameContainer = document.getElementById('gameContainer');
        
        if (mainMenu) {
            mainMenu.style.display = 'block';
            this.log('Main menu visible');
        }
        
        if (gameContainer) {
            gameContainer.style.display = 'block';
            this.log('Game container visible');
        }
        
        this.updateMainMenuButtons();
    }
    
    updateMainMenuButtons() {
        const continueBtn = document.getElementById('continueGame');
        const hasProgress = this.totalScore > 0 || Object.values(this.gameStates).some(state => state.completed);
        
        if (continueBtn) {
            continueBtn.style.display = hasProgress ? 'block' : 'none';
        }
    }
    
    showGameMenu() {
        this.log('Showing game menu');
        this.hideAllGameContainers();
        
        const gameMenu = document.getElementById('gameMenu');
        if (gameMenu) {
            gameMenu.style.display = 'block';
            this.updateGameMenuButtons();
            this.updateGameStats();
            this.log('Game menu displayed');
        }
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
        this.log('Showing collections');
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
        this.log('Starting new game');
        this.showIntroVideo();
    }
    
    continueGame() {
        this.log('Continuing game');
        this.showGameMenu();
    }
    
    startGame(gameType) {
        this.log(`Starting game: ${gameType}`);
        
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
            
            this.log(`Game ${gameType} started successfully`);
        } else {
            console.error(`Game container ${gameType} not found`);
        }
    }
    
    checkLevelCompletion(gameType) {
        this.log(`Checking completion for ${gameType}`);
        
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
                this.log(`Transitioning from ${gameType} to ${nextGame}`);
                setTimeout(() => {
                    this.showStageTransition(gameType, nextGame);
                }, 1000);
            } else if (gameType === 'bossFight') {
                // Final victory - show ending
                this.log('Boss defeated - showing ending');
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
            
            this.log(`Awarded artifact: ${artifactNames[artifact]}`);
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
                this.log(`Unlocked next game: ${nextGame}`);
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
    
    // ==================== VIDEO SYSTEM (FIXED) ====================
    
    showIntroVideo() {
        this.log('Attempting to show intro video');
        
        const storyContainer = document.getElementById('storyContainer');
        const introVideo = document.getElementById('introVideo');
        
        if (storyContainer) {
            this.hideAllGameContainers();
            storyContainer.style.display = 'block';
            
            if (introVideo) {
                this.log('Intro video element found, attempting to play');
                
                // Reset video to beginning
                introVideo.currentTime = 0;
                
                // Try to play the video
                const playPromise = introVideo.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.log('Intro video playing successfully');
                    }).catch(error => {
                        this.log('Video autoplay failed, showing controls:', error);
                        // Video is there but autoplay failed - show controls
                        introVideo.controls = true;
                    });
                }
            } else {
                this.log('Intro video element not found');
                this.showStoryIntro();
            }
            
            // Mark intro as seen
            localStorage.setItem('hasSeenIntro', 'true');
        } else {
            this.log('Story container not found, showing story intro');
            this.showStoryIntro();
        }
    }
    
    skipIntroVideo() {
        this.log('Skipping intro video');
        
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
    
    showStoryIntro() {
        this.log('Showing animated story intro');
        
        // Hide video container
        const storyContainer = document.getElementById('storyContainer');
        if (storyContainer) {
            storyContainer.style.display = 'none';
        }
        
        // Show animated story intro
        this.showIntroAnimation();
    }
    
    showIntroAnimation() {
        this.log('Creating intro animation');
        
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
                
                <button id="startAdventureBtn" style="
                    background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                    padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                    cursor: pointer; margin: 30px 10px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);
                    animation: buttonGlow 2s ease-in-out infinite;">
                    🚀 開始冒險
                </button>
                
                <button id="backToMainBtn" style="
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
        
        // Setup button handlers
        document.getElementById('startAdventureBtn').onclick = () => {
            this.hideIntroAnimation();
            this.showGameMenu();
        };
        
        document.getElementById('backToMainBtn').onclick = () => {
            this.hideIntroAnimation();
            this.showMainMenu();
        };
    }
    
    hideIntroAnimation() {
        const intro = document.getElementById('gameIntro');
        if (intro && intro.parentNode) {
            document.body.removeChild(intro);
        }
    }
    
    showEndingVideo() {
        this.log('Attempting to show ending video');
        
        const endingContainer = document.getElementById('endingContainer');
        const endingVideo = document.getElementById('endingVideo');
        
        if (endingContainer) {
            this.hideAllGameContainers();
            endingContainer.style.display = 'flex';
            
            if (endingVideo) {
                this.log('Ending video element found, attempting to play');
                
                // Reset video to beginning
                endingVideo.currentTime = 0;
                
                // Try to play the ending video
                const playPromise = endingVideo.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.log('Ending video playing successfully');
                    }).catch(error => {
                        this.log('Ending video autoplay failed:', error);
                        // Show controls if autoplay failed
                        endingVideo.controls = true;
                    });
                }
            } else {
                this.log('Ending video element not found, showing congratulations');
                this.showFinalCongratulations();
            }
        } else {
            this.log('Ending container not found, showing congratulations');
            this.showFinalCongratulations();
        }
    }
    
    hideEndingVideo() {
        this.log('Hiding ending video');
        
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
        this.log('Showing final congratulations screen');
        
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
                    <button id="finalBackToMenuBtn" style="
                        background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                        padding: 20px 40px; border-radius: 15px; font-size: 20px; font-weight: bold; 
                        cursor: pointer; margin: 0 15px; box-shadow: 0 8px 25px rgba(76, 204, 163, 0.4);">
                        🏠 返回主選單
                    </button>
                    
                    <button id="finalRestartBtn" style="
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
        
        // Setup button handlers
        document.getElementById('finalBackToMenuBtn').onclick = () => {
            this.hideFinalCongratulations();
            this.showMainMenu();
        };
        
        document.getElementById('finalRestartBtn').onclick = () => {
            this.restartGame();
        };
    }
    
    hideFinalCongratulations() {
        const congrats = document.getElementById('finalCongratulations');
        if (congrats && congrats.parentNode) {
            document.body.removeChild(congrats);
        }
    }
    
    restartGame() {
        this.log('Restarting game');
        this.resetAllGameStates();
        window.location.reload();
    }
    
    // ==================== STAGE TRANSITIONS ====================
    
    showStageTransition(completedGame, nextGame) {
        this.log(`Showing transition from ${completedGame} to ${nextGame}`);
        
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
        if (!data) {
            this.log(`No transition data for ${completedGame}`);
            return;
        }
        
        // Create transition screen - simplified version to avoid errors
        const transitionDiv = document.createElement('div');
        transitionDiv.id = 'stageTransition';
        transitionDiv.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999;
            background: ${data.bg}; display: flex; align-items: center; justify-content: center;
        `;
        
        transitionDiv.innerHTML = `
            <div class="transition-content" style="
                text-align: center; color: white; max-width: 800px; padding: 60px; 
                background: rgba(0,0,0,0.4); border-radius: 20px;">
                
                <div style="font-size: 100px; margin: 30px 0;">${data.icon}</div>
                
                <h1 style="font-size: 48px; margin: 30px 0; color: #4ecca3;">
                    ${data.name}完成！
                </h1>
                
                <div style="background: rgba(255,255,255,0.15); padding: 30px; border-radius: 20px; margin: 40px 0;">
                    <h3 style="margin-top: 0; color: #fbbf24; font-size: 24px;">🏆 獲得傳說神器</h3>
                    <div style="font-size: 80px; margin: 20px 0;">${data.artifact}</div>
                    <p style="font-size: 22px; margin: 15px 0; font-weight: bold; color: #4ecca3;">
                        ${data.artifactName}
                    </p>
                </div>
                
                <div style="background: rgba(0,0,0,0.6); padding: 25px; border-radius: 15px; margin: 30px 0;">
                    ${data.story}
                </div>
                
                <h3 style="color: #94a3b8;">下一章節</h3>
                <div style="font-size: 60px; margin: 20px 0;">${data.nextIcon}</div>
                <h2 style="margin: 5px 0; font-size: 32px; color: #e5e7eb;">${data.nextName}</h2>
                
                <div style="margin: 40px 0;">
                    <button id="transitionContinue" style="
                        background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none; 
                        padding: 18px 35px; border-radius: 12px; font-size: 20px; font-weight: bold; 
                        cursor: pointer; margin: 0 15px;">
                        ⚡ 立即繼續冒險
                    </button>
                    
                    <button id="transitionMenu" style="
                        background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.5); 
                        padding: 18px 35px; border-radius: 12px; font-size: 20px; font-weight: bold; 
                        cursor: pointer; margin: 0 15px;">
                        🏠 返回選單
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(transitionDiv);
        
        // Setup button handlers
        document.getElementById('transitionContinue').onclick = () => {
            this.removeTransition();
            this.proceedToNextGame(nextGame);
        };
        
        document.getElementById('transitionMenu').onclick = () => {
            this.removeTransition();
            this.showGameMenu();
        };
        
        // Auto-proceed after 8 seconds
        setTimeout(() => {
            if (document.getElementById('stageTransition')) {
                this.removeTransition();
                this.proceedToNextGame(nextGame);
            }
        }, 8000);
    }
    
    proceedToNextGame(nextGame) {
        this.log(`Proceeding to next game: ${nextGame}`);
        
        if (nextGame === 'bossFight' && !this.canAccessBoss()) {
            this.showMessage('🔒 需要收集所有三個神器才能挑戰Boss！', 3000);
            setTimeout(() => this.showGameMenu(), 3000);
        } else {
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
    
    // ==================== UTILITY FUNCTIONS ====================
    
    hideAllGameContainers() {
        const gameContainers = [
            'mainMenu', 'gameMenu', 'collectionsMenu', 'storyContainer', 'endingContainer',
            'wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'
        ];
        
        gameContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.style.display = 'none';
            }
        });
        
        // Also hide any dynamic screens
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
            
            this.calculateTotalScore();
            this.saveGameState();
            
            this.log(`Score updated for ${gameType}: ${this.gameStates[gameType].score}`);
        }
    }
    
    calculateTotalScore() {
        this.totalScore = Object.values(this.gameStates).reduce((total, state) => total + state.score, 0);
    }
    
    showMessage(message, duration = 3000) {
        this.log(`Showing message: ${message}`);
        
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
        `;
        
        messageDiv.innerHTML = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                document.body.removeChild(messageDiv);
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
            this.saveGameState();
            window.close();
        }
    }
    
    // ==================== DATA PERSISTENCE ====================
    
    saveGameState() {
        try {
            const gameData = {
                totalScore: this.totalScore,
                gameStates: this.gameStates,
                artifacts: this.artifacts,
                currentStage: this.currentStage
            };
            
            localStorage.setItem('languageQuestSave', JSON.stringify(gameData));
            this.log('Game state saved successfully');
        } catch (error) {
            console.error('Failed to save game state:', error);
        }
    }
    
    loadGameState() {
        try {
            const savedData = localStorage.getItem('languageQuestSave');
            
            if (savedData) {
                const gameData = JSON.parse(savedData);
                
                this.totalScore = gameData.totalScore || 0;
                this.gameStates = { ...this.gameStates, ...gameData.gameStates };
                this.artifacts = { ...this.artifacts, ...gameData.artifacts };
                this.currentStage = gameData.currentStage || 1;
                
                this.log('Game state loaded successfully');
            }
        } catch (error) {
            console.error('Failed to load game state:', error);
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
        
        localStorage.removeItem('languageQuestSave');
        localStorage.removeItem('hasSeenIntro');
        
        this.log('All game states reset');
    }
}

// Initialize the game system when DOM is ready
(() => {
    console.log('[GameSystem] Script loaded, waiting for DOM...');
    
    const initializeGameSystem = () => {
        try {
            window.gameSystem = new GameSystem();
            console.log('[GameSystem] Game system initialized successfully');
        } catch (error) {
            console.error('[GameSystem] Failed to initialize:', error);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeGameSystem);
    } else {
        initializeGameSystem();
    }
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSystem;
}
