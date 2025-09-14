/**
 * Main Game System - Complete Version
 * Handles all game flow, progression, scoring, and UI management
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
            explorer: { obtained: false, name: 'Explorer\'s Eye', icon: '👁' },
            timeController: { obtained: false, name: 'Time Controller', icon: '⏰' },
            knowledgeGem: { obtained: false, name: 'Knowledge Gem', icon: '💎' }
        };
        
        this.settings = {
            volume: 0.5,
            bgmEnabled: true,
            sfxEnabled: true,
            screenSize: 'medium'
        };
        
        this.translations = this.initializeTranslations();
        this.init();
    }
    
    initializeTranslations() {
        return {
            zh: {
                ui: {
                    gameTitle: '英語過去式發音冒險',
                    lobby: {
                        startGame: '開始冒險',
                        loadGame: '繼續冒險',
                        collections: '收藏品',
                        quitGame: '離開遊戲',
                        backToLobby: '返回大廳'
                    },
                    games: {
                        wordSearch: '單詞探索',
                        fallingWords: '時間挑戰', 
                        multipleChoice: '知識試煉',
                        bossFight: '最終決戰'
                    }
                }
            },
            en: {
                ui: {
                    gameTitle: 'Past Tense Pronunciation Adventure',
                    lobby: {
                        startGame: 'Start Adventure',
                        loadGame: 'Continue Adventure', 
                        collections: 'Collections',
                        quitGame: 'Quit Game',
                        backToLobby: 'Back to Lobby'
                    },
                    games: {
                        wordSearch: 'Word Search',
                        fallingWords: 'Time Challenge',
                        multipleChoice: 'Knowledge Trial', 
                        bossFight: 'Boss Fight'
                    }
                }
            }
        };
    }
    
    init() {
        console.log('Initializing Game System...');
        this.loadGameState();
        this.initializeUI();
        this.setupEventListeners();
        this.updateUI();
        console.log('Game System initialized');
    }
    
    initializeUI() {
        // Hide all game containers initially
        const gameContainers = document.querySelectorAll('.game-container');
        gameContainers.forEach(container => {
            container.style.display = 'none';
            container.classList.remove('active');
        });
        
        // Hide story and ending containers
        const storyContainer = document.getElementById('storyContainer');
        const endingContainer = document.getElementById('endingContainer');
        if (storyContainer) storyContainer.style.display = 'none';
        if (endingContainer) endingContainer.style.display = 'none';
        
        // Show main menu
        this.showMainMenu();
        this.setLanguage(this.currentLang);
    }
    
    setupEventListeners() {
        // Main menu buttons
        this.bindButton('startGame', () => this.startNewGame());
        this.bindButton('continueGame', () => this.continueGame());
        this.bindButton('collectionsBtn', () => this.showCollections());
        this.bindButton('settingsBtn', () => this.showSettings());
        
        // Game menu buttons
        const gameMenuButtons = document.querySelectorAll('.menu-button');
        gameMenuButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const game = e.target.dataset.game || e.target.closest('.menu-button').dataset.game;
                if (game) {
                    console.log('Game button clicked:', game);
                    this.startGame(game);
                }
            });
        });
        
        // Back buttons
        const backButtons = document.querySelectorAll('.back-btn');
        backButtons.forEach(btn => {
            btn.addEventListener('click', () => this.showMainMenu());
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
        this.setupStoryControls();
    }
    
    bindButton(id, callback) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', callback);
        } else {
            console.warn(`Button with id '${id}' not found`);
        }
    }
    
    setupSettingsControls() {
        // Volume control
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.value = this.settings.volume;
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(parseFloat(e.target.value));
            });
        }
        
        // BGM toggle
        this.bindButton('bgmToggle', () => this.toggleBGM());
        
        // SFX toggle
        this.bindButton('sfxToggle', () => this.toggleSFX());
        
        // Screen size buttons
        const sizeButtons = document.querySelectorAll('.size-button');
        sizeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.target.dataset.size;
                this.setScreenSize(size);
            });
        });
        
        // Close settings
        this.bindButton('closeSettings', () => this.hideSettings());
        
        // Update settings UI
        this.updateSettingsUI();
    }
    
    setupStoryControls() {
        this.bindButton('skipIntro', () => this.skipIntro());
        this.bindButton('continueStory', () => this.continueFromIntro());
        this.bindButton('playAgain', () => this.startNewGame());
        this.bindButton('backToMenu', () => this.showMainMenu());
    }
    
    startNewGame() {
        console.log('Starting new game...');
        
        // Reset all game states
        Object.keys(this.gameStates).forEach(game => {
            this.gameStates[game] = { completed: false, score: 0, unlocked: false, artifact: false };
        });
        
        // Unlock first game
        this.gameStates.wordSearch.unlocked = true;
        this.currentStage = 1;
        this.totalScore = 0;
        
        // Reset artifacts
        Object.keys(this.artifacts).forEach(artifact => {
            this.artifacts[artifact].obtained = false;
        });
        
        this.saveGameState();
        this.showIntroVideo();
    }
    
    continueGame() {
        console.log('Continuing game...');
        this.loadGameState();
        this.showGameMenu();
    }
    
    showIntroVideo() {
        console.log('Showing intro video...');
        const storyContainer = document.getElementById('storyContainer');
        const introVideo = document.getElementById('introVideo');
        
        if (storyContainer) {
            this.hideAllContainers();
            storyContainer.style.display = 'flex';
            
            if (introVideo) {
                // Handle video events
                introVideo.addEventListener('error', () => {
                    console.log('Intro video not found, skipping to game menu');
                    this.skipIntro();
                });
                
                introVideo.addEventListener('ended', () => {
                    console.log('Intro video ended');
                    this.continueFromIntro();
                });
            }
            
            // Auto-skip after 10 seconds if video doesn't work
            setTimeout(() => {
                if (storyContainer.style.display === 'flex') {
                    console.log('Auto-skipping intro video');
                    this.skipIntro();
                }
            }, 10000);
        } else {
            console.log('Story container not found, going to game menu');
            this.showGameMenu();
        }
    }
    
    skipIntro() {
        console.log('Skipping intro...');
        const storyContainer = document.getElementById('storyContainer');
        if (storyContainer) {
            storyContainer.style.display = 'none';
        }
        this.showGameMenu();
    }
    
    continueFromIntro() {
        console.log('Continuing from intro...');
        this.skipIntro();
    }
    
    showMainMenu() {
        console.log('Showing main menu...');
        this.hideAllContainers();
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.display = 'block';
            mainMenu.classList.add('fade-in');
        }
        
        // Update continue button based on save data
        const continueBtn = document.getElementById('continueGame');
        if (continueBtn) {
            const hasSave = localStorage.getItem('languageGameSave') !== null;
            continueBtn.style.display = hasSave ? 'block' : 'none';
        }
    }
    
    showGameMenu() {
        console.log('Showing game menu...');
        this.hideAllContainers();
        const gameMenu = document.getElementById('gameMenu');
        if (gameMenu) {
            gameMenu.style.display = 'block';
            gameMenu.classList.add('fade-in');
        }
        this.updateGameButtons();
        this.updateUI();
    }
    
    showCollections() {
        console.log('Showing collections...');
        this.hideAllContainers();
        const collectionsMenu = document.getElementById('collectionsMenu');
        if (collectionsMenu) {
            collectionsMenu.style.display = 'block';
            collectionsMenu.classList.add('fade-in');
        }
        this.updateCollectionsDisplay();
    }
    
    showSettings() {
        console.log('Showing settings...');
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            settingsPanel.classList.add('open');
        }
        this.updateSettingsUI();
    }
    
    hideSettings() {
        console.log('Hiding settings...');
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            settingsPanel.classList.remove('open');
        }
    }
    
    startGame(gameType) {
        console.log('Starting game:', gameType);
        
        // Validate game exists
        if (!this.gameStates[gameType]) {
            console.error('Unknown game type:', gameType);
            this.showMessage('Unknown game type!');
            return;
        }
        
        // Check if game is unlocked
        if (!this.gameStates[gameType].unlocked) {
            console.log('Game is locked:', gameType);
            this.showMessage('This game is locked! Complete previous levels to unlock.');
            return;
        }
        
        // Special check for boss fight
        if (gameType === 'bossFight' && !this.canAccessBoss()) {
            console.log('Boss fight locked - missing artifacts');
            this.showMessage('Collect all three artifacts to challenge the Boss!');
            return;
        }
        
        this.currentGame = gameType;
        this.hideAllContainers();
        
        // Show game container
        const gameContainer = document.getElementById(gameType);
        if (gameContainer) {
            gameContainer.style.display = 'block';
            gameContainer.classList.add('active');
            console.log('Game container shown:', gameType);
        } else {
            console.error('Game container not found:', gameType);
            this.showMessage('Game container not found!');
            return;
        }
        
        // Initialize specific game
        this.initializeSpecificGame(gameType);
    }
    
    initializeSpecificGame(gameType) {
        console.log('Initializing specific game:', gameType);
        
        // Dispatch event to game modules
        const event = new CustomEvent('gameInitialize', { 
            detail: { gameType, gameSystem: this } 
        });
        document.dispatchEvent(event);
        
        // Initialize Sound System if available
        if (window.SoundSystem) {
            window.SoundSystem.setVolume(this.settings.volume);
            window.SoundSystem.setBGMEnabled(this.settings.bgmEnabled);
            window.SoundSystem.setSFXEnabled(this.settings.sfxEnabled);
        }
    }
    
    updateScore(gameType, points, checkCompletion = true) {
        if (!this.gameStates[gameType]) {
            console.error('Invalid game type for score update:', gameType);
            return;
        }
        
        console.log(`Score update: ${gameType} +${points}`);
        this.gameStates[gameType].score += points;
        this.updateScoreDisplay(gameType);
        
        if (checkCompletion) {
            this.checkLevelCompletion(gameType);
        }
        
        this.saveGameState();
        
        // Play sound feedback
        if (window.SoundSystem) {
            window.SoundSystem.play(points > 0 ? 'correct' : 'wrong');
        }
    }
    
    checkLevelCompletion(gameType) {
        const gameState = this.gameStates[gameType];
        const requiredScore = this.requiredScores[gameType];
        
        console.log(`Checking completion: ${gameType} - Score: ${gameState.score}/${requiredScore}`);
        
        if (gameState.score >= requiredScore && !gameState.completed) {
            console.log('Level completed!', gameType);
            gameState.completed = true;
            this.unlockNextLevel(gameType);
            this.grantArtifact(gameType);
            this.showMessage('🎉 Level Complete! Well done!', 4000);
            
            // Play completion sound
            if (window.SoundSystem) {
                setTimeout(() => window.SoundSystem.play('correct', 1.5), 500);
            }
        }
    }
    
    unlockNextLevel(completedGame) {
        const gameOrder = ['wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'];
        const currentIndex = gameOrder.indexOf(completedGame);
        
        console.log(`Unlocking next level after: ${completedGame} (index: ${currentIndex})`);
        
        if (currentIndex >= 0 && currentIndex < gameOrder.length - 1) {
            const nextGame = gameOrder[currentIndex + 1];
            this.gameStates[nextGame].unlocked = true;
            this.currentStage = currentIndex + 2;
            
            console.log(`Next game unlocked: ${nextGame} (stage: ${this.currentStage})`);
            this.showMessage(`🔓 New game unlocked: ${nextGame}!`, 3000);
        }
        
        // Special case: unlock boss fight when all artifacts collected
        if (this.canAccessBoss() && !this.gameStates.bossFight.unlocked) {
            this.gameStates.bossFight.unlocked = true;
            this.showMessage('⚔️ Final Boss Unlocked! You have all three artifacts!', 5000);
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
            console.log('Granting artifact:', artifactKey);
            this.artifacts[artifactKey].obtained = true;
            this.gameStates[gameType].artifact = true;
            
            const artifact = this.artifacts[artifactKey];
            this.showArtifactMessage(artifact.name, artifact.icon);
            this.saveGameState();
        }
    }
    
    canAccessBoss() {
        return this.artifacts.explorer.obtained && 
               this.artifacts.timeController.obtained && 
               this.artifacts.knowledgeGem.obtained;
    }
    
    updateUI() {
        this.updateScoreDisplay();
        this.updateStageDisplay();
        this.updateGameButtons();
        this.updateCollectionsDisplay();
    }
    
    updateScoreDisplay(gameType = null) {
        // Update total score
        this.totalScore = Object.values(this.gameStates).reduce((total, game) => total + game.score, 0);
        
        const totalScoreElement = document.getElementById('totalScore');
        if (totalScoreElement) {
            totalScoreElement.textContent = this.totalScore;
        }
        
        // Update specific game score
        if (gameType && this.gameStates[gameType]) {
            const scoreElements = [
                document.getElementById(gameType + 'Score'),
                document.getElementById('score-' + gameType)
            ];
            
            scoreElements.forEach(element => {
                if (element) {
                    element.textContent = this.gameStates[gameType].score;
                }
            });
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
            
            // Remove existing classes
            btn.classList.remove('locked', 'completed', 'active');
            
            // Check if unlocked
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
            
            // Special case for boss fight
            if (gameType === 'bossFight') {
                if (!this.canAccessBoss()) {
                    btn.classList.add('locked');
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = '0.5';
                } else {
                    btn.classList.remove('locked');
                    btn.style.pointerEvents = 'auto';
                    btn.style.opacity = '1';
                }
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
                    element.style.opacity = '1';
                } else {
                    element.classList.remove('obtained');
                    element.style.opacity = '0.5';
                }
            }
        });
    }
    
    updateSettingsUI() {
        // Update volume slider
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.value = this.settings.volume;
        }
        
        // Update BGM toggle
        const bgmToggle = document.getElementById('bgmToggle');
        if (bgmToggle) {
            bgmToggle.textContent = this.settings.bgmEnabled ? 'ON' : 'OFF';
            bgmToggle.classList.toggle('off', !this.settings.bgmEnabled);
        }
        
        // Update SFX toggle
        const sfxToggle = document.getElementById('sfxToggle');
        if (sfxToggle) {
            sfxToggle.textContent = this.settings.sfxEnabled ? 'ON' : 'OFF';
            sfxToggle.classList.toggle('off', !this.settings.sfxEnabled);
        }
        
        // Update size buttons
        document.querySelectorAll('.size-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === this.settings.screenSize);
        });
    }
    
    showMessage(message, duration = 3000) {
        console.log('Showing message:', message);
        
        // Remove existing message
        const existingMessage = document.querySelector('.game-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'game-message';
        messageDiv.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background: rgba(76, 204, 163, 0.95); color: white; padding: 20px 30px;
                        border-radius: 10px; font-size: 18px; font-weight: bold; text-align: center;
                        z-index: 10000; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                        animation: messageSlideIn 0.3s ease-out; max-width: 400px;">
                ${message}
            </div>
        `;
        
        // Add CSS animation if not exists
        if (!document.getElementById('messageStyles')) {
            const style = document.createElement('style');
            style.id = 'messageStyles';
            style.textContent = `
                @keyframes messageSlideIn {
                    0% { opacity: 0; transform: translate(-50%, -60%); }
                    100% { opacity: 1; transform: translate(-50%, -50%); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        document.body.removeChild(messageDiv);
                    }
                }, 300);
            }
        }, duration);
    }
    
    showArtifactMessage(name, icon) {
        const message = `${icon} Artifact Obtained!<br><strong>${name}</strong>`;
        this.showMessage(message, 5000);
        
        // Play special artifact sound
        if (window.SoundSystem) {
            setTimeout(() => window.SoundSystem.play('correct', 1.5), 200);
            setTimeout(() => window.SoundSystem.play('correct', 1.8), 600);
        }
    }
    
    setLanguage(lang) {
        console.log('Setting language:', lang);
        this.currentLang = lang;
        
        // Update active language button
        document.querySelectorAll('.lang-button, .lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        this.updateLanguageText();
        this.saveGameState();
    }
    
    updateLanguageText() {
        const translations = this.translations[this.currentLang];
        if (!translations) return;
        
        // Update UI text elements
        const textElements = {
            'gameTitle': translations.ui.gameTitle,
            'startGame': translations.ui.lobby.startGame,
            'continueGame': translations.ui.lobby.loadGame,
            'collectionsBtn': translations.ui.lobby.collections,
            'quitGame': translations.ui.lobby.quitGame
        };
        
        Object.keys(textElements).forEach(id => {
            const element = document.getElementById(id);
            if (element && textElements[id]) {
                element.textContent = textElements[id];
            }
        });
    }
    
    setVolume(volume) {
        this.settings.volume = Math.max(0, Math.min(1, volume));
        console.log('Volume set to:', this.settings.volume);
        
        if (window.SoundSystem) {
            window.SoundSystem.setVolume(this.settings.volume);
        }
        
        this.saveGameState();
    }
    
    toggleBGM() {
        this.settings.bgmEnabled = !this.settings.bgmEnabled;
        console.log('BGM toggled:', this.settings.bgmEnabled);
        
        if (window.SoundSystem) {
            window.SoundSystem.setBGMEnabled(this.settings.bgmEnabled);
        }
        
        this.updateSettingsUI();
        this.saveGameState();
    }
    
    toggleSFX() {
        this.settings.sfxEnabled = !this.settings.sfxEnabled;
        console.log('SFX toggled:', this.settings.sfxEnabled);
        
        if (window.SoundSystem) {
            window.SoundSystem.setSFXEnabled(this.settings.sfxEnabled);
        }
        
        this.updateSettingsUI();
        this.saveGameState();
    }
    
    setScreenSize(size) {
        this.settings.screenSize = size;
        console.log('Screen size set to:', size);
        
        const container = document.querySelector('.container');
        if (container) {
            container.classList.remove('size-small', 'size-medium', 'size-large');
            container.classList.add(`size-${size}`);
        }
        
        this.updateSettingsUI();
        this.saveGameState();
    }
    
    hideAllContainers() {
        const containers = [
            'mainMenu', 'gameMenu', 'collectionsMenu', 'storyContainer', 'endingContainer',
            'wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'
        ];
        
        containers.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
                element.classList.remove('active', 'fade-in');
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
            totalScore: this.totalScore,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('languageGameSave', JSON.stringify(saveData));
            console.log('Game state saved');
        } catch (error) {
            console.error('Failed to save game state:', error);
        }
    }
    
    loadGameState() {
        try {
            const saveData = localStorage.getItem('languageGameSave');
            if (saveData) {
                const data = JSON.parse(saveData);
                
                // Validate and merge save data
                if (data.gameStates) this.gameStates = { ...this.gameStates, ...data.gameStates };
                if (data.artifacts) this.artifacts = { ...this.artifacts, ...data.artifacts };
                if (data.currentStage) this.currentStage = data.currentStage;
                if (data.currentLang) this.currentLang = data.currentLang;
                if (data.settings) this.settings = { ...this.settings, ...data.settings };
                if (data.totalScore) this.totalScore = data.totalScore;
                
                console.log('Game state loaded:', data.timestamp);
                return true;
            }
        } catch (error) {
            console.error('Failed to load game state:', error);
        }
        
        console.log('No save data found, using defaults');
        return false;
    }
    
    resetGameState() {
        console.log('Resetting game state...');
        localStorage.removeItem('languageGameSave');
        window.location.reload(); // Restart the entire game
    }
    
    checkRequiredElements() {
        const requiredElements = ['wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'];
        const missingElements = [];
        
        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                missingElements.push(id);
            }
        });
        
        if (missingElements.length > 0) {
            console.error('❌ Missing required elements:', missingElements);
            return false;
        }
        
        console.log('✅ All required elements found');
        return true;
    }
    
    // Utility method for debugging
    getGameState() {
        return {
            gameStates: this.gameStates,
            artifacts: this.artifacts,
            currentStage: this.currentStage,
            totalScore: this.totalScore,
            currentGame: this.currentGame
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Language Learning App...');
    
    // Small delay to ensure all elements are loaded
    setTimeout(() => {
        try {
            window.gameSystem = new GameSystem();
            
            if (!window.gameSystem.checkRequiredElements()) {
                console.error('❌ Failed to initialize app: Missing required elements');
                
                // Show error message to user
                document.body.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; 
                                height: 100vh; background: #2d3142; color: white; text-align: center; 
                                font-family: Arial, sans-serif;">
                        <div>
                            <h1>❌ Error</h1>
                            <p>Failed to load the game. Please refresh the page.</p>
                            <button onclick="window.location.reload()" 
                                    style="padding: 10px 20px; font-size: 16px; 
                                           background: #4ecca3; color: white; border: none; 
                                           border-radius: 5px; cursor: pointer;">
                                Refresh Page
                            </button>
                        </div>
                    </div>
                `;
            } else {
                console.log('✅ Language Learning App initialized successfully');
                
                // Initialize Sound System
                if (window.SoundSystem) {
                    window.SoundSystem.init();
                }
            }
        } catch (error) {
            console.error('❌ Fatal error during initialization:', error);
        }
    }, 200);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSystem;
}
