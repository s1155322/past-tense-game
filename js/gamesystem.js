/**
 * Main Game System - Clean Version
 */
class GameSystem {
    constructor() {
        this.currentLang = 'zh';
        this.gameStates = {
            wordSearch: { completed: false, score: 0, unlocked: true, artifact: false },
            fallingWords: { completed: false, score: 0, unlocked: false, artifact: false },
            multipleChoice: { completed: false, score: 0, unlocked: false, artifact: false },
            bossFight: { completed: false, score: 0, unlocked: false, artifact: false }
        };
        
        this.currentGame = null;
        this.totalScore = 0;
        this.currentStage = 1;
        this.requiredScores = {
            wordSearch: 50,
            fallingWords: 75,
            multipleChoice: 100,
            bossFight: 150
        };
        
        this.artifacts = {
            explorer: { obtained: false, name: 'Explorer Eye', icon: '👁' },
            timeController: { obtained: false, name: 'Time Controller', icon: '⏰' },
            knowledgeGem: { obtained: false, name: 'Knowledge Gem', icon: '💎' }
        };
        
        this.settings = {
            volume: 0.5,
            bgmEnabled: true,
            sfxEnabled: true,
            screenSize: 'medium'
        };
        
        this.init();
    }
    
    init() {
        console.log('GameSystem initializing...');
        this.loadGameState();
        this.initializeUI();
        this.setupEventListeners();
        this.updateUI();
        console.log('GameSystem initialized successfully');
    }
    
    initializeUI() {
        const gameContainers = document.querySelectorAll('.game-container');
        gameContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        this.showMainMenu();
    }
    
    setupEventListeners() {
        // Main menu buttons
        this.bindButton('startGame', () => this.startNewGame());
        this.bindButton('continueGame', () => this.continueGame());
        this.bindButton('collectionsBtn', () => this.showCollections());
        this.bindButton('settingsBtn', () => this.showSettings());
        
        // Game menu buttons
        const gameButtons = document.querySelectorAll('.menu-button[data-game]');
        gameButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const game = e.target.dataset.game || e.target.closest('.menu-button').dataset.game;
                if (game) {
                    console.log('Starting game:', game);
                    this.startGame(game);
                }
            });
        });
        
        // Language buttons
        const langButtons = document.querySelectorAll('.lang-button, .lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                if (lang) this.setLanguage(lang);
            });
        });
        
        this.setupSettingsControls();
    }
    
    bindButton(id, callback) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', callback);
        }
    }
    
    setupSettingsControls() {
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(parseFloat(e.target.value));
            });
        }
        
        this.bindButton('bgmToggle', () => this.toggleBGM());
        this.bindButton('sfxToggle', () => this.toggleSFX());
        this.bindButton('closeSettings', () => this.hideSettings());
    }
    
    startNewGame() {
        console.log('Starting new game...');
        Object.keys(this.gameStates).forEach(game => {
            this.gameStates[game] = { completed: false, score: 0, unlocked: false, artifact: false };
        });
        
        this.gameStates.wordSearch.unlocked = true;
        this.currentStage = 1;
        this.totalScore = 0;
        
        Object.keys(this.artifacts).forEach(artifact => {
            this.artifacts[artifact].obtained = false;
        });
        
        this.saveGameState();
        this.showGameMenu();
    }
    
    continueGame() {
        console.log('Continuing game...');
        this.loadGameState();
        this.showGameMenu();
    }
    
    showMainMenu() {
        console.log('Showing main menu');
        this.hideAllContainers();
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.display = 'block';
        }
    }
    
    showGameMenu() {
        console.log('Showing game menu');
        this.hideAllContainers();
        const gameMenu = document.getElementById('gameMenu');
        if (gameMenu) {
            gameMenu.style.display = 'block';
        }
        this.updateGameButtons();
        this.updateUI();
    }
    
    showCollections() {
        console.log('Showing collections');
        this.hideAllContainers();
        const collectionsMenu = document.getElementById('collectionsMenu');
        if (collectionsMenu) {
            collectionsMenu.style.display = 'block';
        }
        this.updateCollectionsDisplay();
    }
    
    showSettings() {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            settingsPanel.classList.add('open');
        }
    }
    
    hideSettings() {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            settingsPanel.classList.remove('open');
        }
    }
    
    startGame(gameType) {
        console.log('Starting game:', gameType);
        
        if (!this.gameStates[gameType] || !this.gameStates[gameType].unlocked) {
            this.showMessage('This game is locked!');
            return;
        }
        
        if (gameType === 'bossFight' && !this.canAccessBoss()) {
            this.showMessage('Collect all artifacts to challenge the Boss!');
            return;
        }
        
        this.currentGame = gameType;
        this.hideAllContainers();
        
        const gameContainer = document.getElementById(gameType);
        if (gameContainer) {
            gameContainer.style.display = 'block';
        } else {
            console.error('Game container not found:', gameType);
            return;
        }
        
        // Dispatch game initialization event
        const event = new CustomEvent('gameInitialize', { 
            detail: { gameType, gameSystem: this } 
        });
        document.dispatchEvent(event);
    }
    
    updateScore(gameType, points, checkCompletion = true) {
        if (!this.gameStates[gameType]) return;
        
        this.gameStates[gameType].score += points;
        console.log(`Score updated: ${gameType} = ${this.gameStates[gameType].score}`);
        
        if (checkCompletion) {
            this.checkLevelCompletion(gameType);
        }
        
        this.saveGameState();
        
        if (window.SoundSystem) {
            window.SoundSystem.play(points > 0 ? 'correct' : 'wrong');
        }
    }
    
    checkLevelCompletion(gameType) {
        const gameState = this.gameStates[gameType];
        const requiredScore = this.requiredScores[gameType];
        
        console.log(`Checking completion for ${gameType}: ${gameState.score}/${requiredScore}`);
        
        if (gameState.score >= requiredScore && !gameState.completed) {
            console.log('Level completed!', gameType);
            gameState.completed = true;
            this.unlockNextLevel(gameType);
            this.grantArtifact(gameType);
            
            // Show completion message
            const messages = {
                wordSearch: '🌉 石橋修復完成！獲得探險者之眼 👁',
                fallingWords: '⚔️ 石塊斬擊完成！獲得時間控制者 ⏰', 
                multipleChoice: '💪 催眠破解完成！獲得知識寶石 💎'
            };
            
            const message = messages[gameType] || '🎉 關卡完成！';
            this.showMessage(message, 4000);
            
            // Auto-progress after 4 seconds
            setTimeout(() => {
                this.autoProgressToNextStage(gameType);
            }, 4000);
            
            this.saveGameState();
        }
    }
    
    unlockNextLevel(completedGame) {
        const gameOrder = ['wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'];
        const currentIndex = gameOrder.indexOf(completedGame);
        
        if (currentIndex >= 0 && currentIndex < gameOrder.length - 1) {
            const nextGame = gameOrder[currentIndex + 1];
            this.gameStates[nextGame].unlocked = true;
            this.currentStage = currentIndex + 2;
            
            console.log(`Next game unlocked: ${nextGame}`);
        }
        
        this.updateGameButtons();
        this.saveGameState();
    }
    
    grantArtifact(gameType) {
        const artifactMap = {
            wordSearch: 'explorer',
            fallingWords: 'timeController', 
            multipleChoice: 'knowledgeGem'
        };
        
        const artifactKey = artifactMap[gameType];
        if (artifactKey && !this.artifacts[artifactKey].obtained) {
            this.artifacts[artifactKey].obtained = true;
            this.gameStates[gameType].artifact = true;
            console.log('Artifact granted:', artifactKey);
        }
    }
    
    canAccessBoss() {
        return this.artifacts.explorer.obtained && 
               this.artifacts.timeController.obtained && 
               this.artifacts.knowledgeGem.obtained;
    }
    
    autoProgressToNextStage(completedGame) {
        const nextGames = {
            wordSearch: 'fallingWords',
            fallingWords: 'multipleChoice', 
            multipleChoice: 'bossFight'
        };
        
        const nextGame = nextGames[completedGame];
        
        if (nextGame) {
            console.log('Auto-progressing to:', nextGame);
            
            if (nextGame === 'bossFight' && !this.canAccessBoss()) {
                this.showMessage('🔒 需要收集所有神器才能挑戰Boss！', 3000);
                this.showGameMenu();
            } else {
                const stageNames = {
                    fallingWords: '石塊斬擊挑戰',
                    multipleChoice: '催眠術破解',
                    bossFight: '最終Boss戰'
                };
                
                this.showMessage(`⚡ 準備進入: ${stageNames[nextGame]}`, 2000);
                
                setTimeout(() => {
                    this.startGame(nextGame);
                }, 2000);
            }
        } else {
            this.showGameMenu();
        }
    }
    
    updateUI() {
        this.updateScoreDisplay();
        this.updateStageDisplay();
        this.updateGameButtons();
        this.updateCollectionsDisplay();
    }
    
    updateScoreDisplay() {
        this.totalScore = Object.values(this.gameStates).reduce((total, game) => total + game.score, 0);
        
        const totalScoreElement = document.getElementById('totalScore');
        if (totalScoreElement) {
            totalScoreElement.textContent = this.totalScore;
        }
    }
    
    updateStageDisplay() {
        const stageElement = document.getElementById('currentStage');
        if (stageElement) {
            stageElement.textContent = this.currentStage;
        }
    }
    
    updateGameButtons() {
        const gameButtons = document.querySelectorAll('.menu-button[data-game]');
        gameButtons.forEach(btn => {
            const gameType = btn.dataset.game;
            if (!gameType || !this.gameStates[gameType]) return;
            
            const gameState = this.gameStates[gameType];
            
            btn.classList.remove('locked', 'completed');
            
            if (!gameState.unlocked) {
                btn.classList.add('locked');
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.5';
            } else {
                btn.style.pointerEvents = 'auto';
                btn.style.opacity = '1';
                
                if (gameState.completed) {
                    btn.classList.add('completed');
                }
            }
            
            if (gameType === 'bossFight' && !this.canAccessBoss()) {
                btn.classList.add('locked');
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.5';
            }
        });
    }
    
    updateCollectionsDisplay() {
        Object.keys(this.artifacts).forEach(key => {
            const artifact = this.artifacts[key];
            const element = document.querySelector(`[data-artifact="${key}"]`);
            
            if (element) {
                if (artifact.obtained) {
                    element.classList.add('obtained');
                } else {
                    element.classList.remove('obtained');
                }
            }
        });
    }
    
    showMessage(message, duration = 3000) {
        console.log('Showing message:', message);
        
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background: rgba(76, 204, 163, 0.95); color: white; padding: 20px 30px;
                        border-radius: 10px; font-size: 18px; font-weight: bold; text-align: center;
                        z-index: 10000; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                ${message}
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                document.body.removeChild(messageDiv);
            }
        }, duration);
    }
    
    setLanguage(lang) {
        this.currentLang = lang;
        
        document.querySelectorAll('.lang-button, .lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        this.saveGameState();
    }
    
    setVolume(volume) {
        this.settings.volume = Math.max(0, Math.min(1, volume));
        
        if (window.SoundSystem) {
            window.SoundSystem.setVolume(this.settings.volume);
        }
        
        this.saveGameState();
    }
    
    toggleBGM() {
        this.settings.bgmEnabled = !this.settings.bgmEnabled;
        
        const bgmToggle = document.getElementById('bgmToggle');
        if (bgmToggle) {
            bgmToggle.textContent = this.settings.bgmEnabled ? 'ON' : 'OFF';
        }
        
        if (window.SoundSystem) {
            window.SoundSystem.setBGMEnabled(this.settings.bgmEnabled);
        }
        
        this.saveGameState();
    }
    
    toggleSFX() {
        this.settings.sfxEnabled = !this.settings.sfxEnabled;
        
        const sfxToggle = document.getElementById('sfxToggle');
        if (sfxToggle) {
            sfxToggle.textContent = this.settings.sfxEnabled ? 'ON' : 'OFF';
        }
        
        if (window.SoundSystem) {
            window.SoundSystem.setSFXEnabled(this.settings.sfxEnabled);
        }
        
        this.saveGameState();
    }
    
    hideAllContainers() {
        const containers = [
            'mainMenu', 'gameMenu', 'collectionsMenu', 'storyContainer',
            'wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'
        ];
        
        containers.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }
    
    saveGameState() {
        const saveData = {
            gameStates: this.gameStates,
            artifacts: this.artifacts,
            currentStage: this.currentStage,
            currentLang: this.currentLang,
            settings: this.settings,
            totalScore: this.totalScore
        };
        
        try {
            localStorage.setItem('languageGameSave', JSON.stringify(saveData));
        } catch (error) {
            console.error('Failed to save game state:', error);
        }
    }
    
    loadGameState() {
        try {
            const saveData = localStorage.getItem('languageGameSave');
            if (saveData) {
                const data = JSON.parse(saveData);
                
                if (data.gameStates) this.gameStates = Object.assign(this.gameStates, data.gameStates);
                if (data.artifacts) this.artifacts = Object.assign(this.artifacts, data.artifacts);
                if (data.currentStage) this.currentStage = data.currentStage;
                if (data.currentLang) this.currentLang = data.currentLang;
                if (data.settings) this.settings = Object.assign(this.settings, data.settings);
                if (data.totalScore) this.totalScore = data.totalScore;
                
                return true;
            }
        } catch (error) {
            console.error('Failed to load game state:', error);
        }
        
        return false;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Game System...');
    
    setTimeout(() => {
        try {
            window.gameSystem = new GameSystem();
            console.log('Game System initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Game System:', error);
        }
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSystem;
}