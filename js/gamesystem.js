/**
 * Game System - Core game management system
 * Handles navigation, state management, and game coordination
 */
class GameSystem {
    constructor() {
        this.currentGame = null;
        this.gameInstances = {};
        this.score = 0;
        this.level = 1;
        this.gameProgress = {
            wordSearch: { completed: false, score: 0 },
            fallingWords: { completed: false, score: 0 },
            multipleChoice: { completed: false, score: 0 },
            bossFight: { completed: false, score: 0 }
        };
        
        console.log('🎮 GameSystem initialized');
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showMainMenu();
    }
    
    setupEventListeners() {
        console.log('🔧 Setting up GameSystem event listeners');
        
        // Main menu buttons
        document.getElementById('startGame').addEventListener('click', () => {
            console.log('Start game clicked');
            this.showStory();
        });
        
        document.getElementById('instructionsBtn').addEventListener('click', () => {
            this.showInstructions();
        });
        
        document.getElementById('creditsBtn').addEventListener('click', () => {
            this.showCredits();
        });
        
        // Game menu buttons
        document.getElementById('gameMenuBackBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Game selection buttons
        document.querySelectorAll('.menu-button[data-game]').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameType = e.currentTarget.dataset.game;
                console.log('Game selected:', gameType);
                this.startGame(gameType);
            });
        });
    }
    
    showMainMenu() {
        console.log('📋 Showing main menu');
        this.hideAllScreens();
        document.getElementById('mainMenu').style.display = 'flex';
        this.currentGame = null;
    }
    
    showStory() {
        console.log('📖 Showing story');
        this.hideAllScreens();
        const storyContainer = document.getElementById('storyContainer');
        if (storyContainer) {
            storyContainer.classList.add('active');
            
            // Auto-play video if available
            const video = document.getElementById('introVideo');
            if (video && video.canPlayType) {
                video.play().catch(() => {
                    console.log('Video autoplay blocked - user interaction required');
                });
            }
        } else {
            // Skip to game menu if no video
            this.showGameMenu();
        }
    }
    
    showGameMenu() {
        console.log('🎮 Showing game menu');
        this.hideAllScreens();
        const gameMenu = document.getElementById('gameMenu');
        if (gameMenu) {
            gameMenu.classList.add('active');
        }
        this.currentGame = null;
    }
    
    startGame(gameType) {
        console.log(`🚀 Starting game: ${gameType}`);
        this.hideAllScreens();
        this.currentGame = gameType;
        
        // Show the game container
        const gameContainer = document.getElementById(gameType);
        if (gameContainer) {
            gameContainer.classList.add('active');
            
            // Initialize the specific game
            this.initializeGame(gameType);
        } else {
            console.error(`Game container not found: ${gameType}`);
            this.showMessage('Game not found!', 'error');
            this.showGameMenu();
        }
    }
    
    initializeGame(gameType) {
        console.log(`🎯 Initializing game: ${gameType}`);
        
        // Dispatch game initialization event
        const event = new CustomEvent('gameInitialize', {
            detail: { gameType: gameType }
        });
        document.dispatchEvent(event);
        
        // Store reference to game instance
        if (window[gameType + 'Game']) {
            this.gameInstances[gameType] = window[gameType + 'Game'];
        }
    }
    
    showInstructions() {
        this.showMessage('Instructions: Find past tense words and classify their pronunciation!', 'info', 5000);
    }
    
    showCredits() {
        this.showMessage('Created with ❤️ for English learning', 'info', 3000);
    }
    
    hideAllScreens() {
        // Hide main menu
        document.getElementById('mainMenu').style.display = 'none';
        
        // Hide game menu
        const gameMenu = document.getElementById('gameMenu');
        if (gameMenu) {
            gameMenu.classList.remove('active');
        }
        
        // Hide story container
        const storyContainer = document.getElementById('storyContainer');
        if (storyContainer) {
            storyContainer.classList.remove('active');
        }
        
        // Hide all game containers
        document.querySelectorAll('.game-container').forEach(container => {
            container.classList.remove('active');
        });
    }
    
    updateScore(gameType, score, completed = false) {
        console.log(`📊 Updating score for ${gameType}: ${score}`);
        
        if (this.gameProgress[gameType]) {
            this.gameProgress[gameType].score = score;
            this.gameProgress[gameType].completed = completed;
            
            // Update total score
            this.score = Object.values(this.gameProgress).reduce((total, game) => total + game.score, 0);
            
            // Dispatch score update event
            const event = new CustomEvent('scoreUpdate', {
                detail: { gameType, score, totalScore: this.score, completed }
            });
            document.dispatchEvent(event);
        }
    }
    
    completeGame(gameType) {
        console.log(`✅ Game completed: ${gameType}`);
        this.updateScore(gameType, this.gameProgress[gameType].score, true);
        
        // Show completion message
        this.showMessage(`🎉 ${gameType} completed!`, 'success');
        
        // Check if all games are completed
        const allCompleted = Object.values(this.gameProgress).every(game => game.completed);
        if (allCompleted) {
            setTimeout(() => {
                this.showFinalVictory();
            }, 2000);
        } else {
            setTimeout(() => {
                this.showGameMenu();
            }, 2000);
        }
    }
    
    showFinalVictory() {
        console.log('🏆 Showing final victory');
        this.showMessage(`🏆 Congratulations! All games completed! Final score: ${this.score}`, 'success', 5000);
        setTimeout(() => {
            this.resetProgress();
            this.showMainMenu();
        }, 5000);
    }
    
    resetProgress() {
        console.log('🔄 Resetting game progress');
        this.score = 0;
        this.level = 1;
        Object.keys(this.gameProgress).forEach(gameType => {
            this.gameProgress[gameType] = { completed: false, score: 0 };
        });
    }
    
    showMessage(text, type = 'success', duration = 3000) {
        // Use the global showMessage function
        if (window.showMessage) {
            window.showMessage(text, type, duration);
        } else {
            console.log(`Message: ${text}`);
        }
    }
    
    // Utility methods for games
    playSound(soundType) {
        const audioMap = {
            correct: 'correctSound',
            wrong: 'wrongSound',
            bgm: 'bgmAudio'
        };
        
        const audioId = audioMap[soundType];
        if (audioId) {
            const audio = document.getElementById(audioId);
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(() => {
                    console.log('Audio play blocked - user interaction required');
                });
            }
        }
    }
    
    speakText(text, lang = 'en-US') {
        if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    }
    
    // Game state management
    saveGameState() {
        const gameState = {
            score: this.score,
            level: this.level,
            progress: this.gameProgress,
            currentGame: this.currentGame
        };
        
        try {
            localStorage.setItem('englishGameState', JSON.stringify(gameState));
            console.log('Game state saved');
        } catch (e) {
            console.log('Could not save game state');
        }
    }
    
    loadGameState() {
        try {
            const saved = localStorage.getItem('englishGameState');
            if (saved) {
                const gameState = JSON.parse(saved);
                this.score = gameState.score || 0;
                this.level = gameState.level || 1;
                this.gameProgress = gameState.progress || this.gameProgress;
                console.log('Game state loaded');
                return true;
            }
        } catch (e) {
            console.log('Could not load game state');
        }
        return false;
    }
    
    // Language support
    getCurrentLanguage() {
        return window.gameState?.currentLanguage || 'en';
    }
    
    getTranslation(key) {
        const lang = this.getCurrentLanguage();
        return window.translations?.[lang]?.[key] || key;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSystem;
}

// Make available globally
window.GameSystem = GameSystem;

console.log('✅ GameSystem class loaded successfully');
