/**
 * Main Application Entry Point
 * Initializes all game systems and handles global functionality
 */

class LanguageLearningApp {
    constructor() {
        this.initialized = false;
        this.loadingScreen = null;
        this.init();
    }
    
    async init() {
        console.log('Initializing Language Learning App...');
        
        // Show loading screen
        this.showLoadingScreen();
        
        try {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize systems in order
            await this.initializeSystems();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            console.log('App initialized successfully!');
            this.initialized = true;
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showErrorMessage('Failed to load the game. Please refresh the page.');
        }
    }
    
    async initializeSystems() {
        // Check if all required elements exist
        this.checkRequiredElements();
        
        // Initialize sound system first (it handles user interaction)
        if (window.SoundSystem) {
            console.log('Sound system available');
        }
        
        // Game system should initialize automatically via DOMContentLoaded
        await this.waitForGameSystem();
        
        // Setup global event listeners
        this.setupGlobalEventListeners();
    }
    
    checkRequiredElements() {
        const requiredElements = [
            'gameContainer',
            'mainMenu', 
            'gameMenu',
            'wordSearch',
            'fallingWords',
            'multipleChoice',
            'bossFight'
        ];
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            throw new Error(`Missing required elements: ${missingElements.join(', ')}`);
        }
    }
    
    async waitForGameSystem() {
        return new Promise((resolve) => {
            const checkGameSystem = () => {
                if (window.gameSystem) {
                    console.log('Game system ready');
                    resolve();
                } else {
                    setTimeout(checkGameSystem, 100);
                }
            };
            checkGameSystem();
        });
    }
    
    setupGlobalEventListeners() {
        // Handle visibility changes (pause when tab not visible)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAllGames();
            } else {
                this.resumeAllGames();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });
        
        // Prevent context menu on game elements
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.game-container, canvas')) {
                e.preventDefault();
            }
        });
    }
    
    handleGlobalKeyboard(e) {
        // Global shortcuts that work anywhere
        switch (e.code) {
            case 'Escape':
                // Return to main menu
                if (window.gameSystem) {
                    window.gameSystem.showMainMenu();
                }
                break;
            case 'F11':
                // Toggle fullscreen
                this.toggleFullscreen();
                e.preventDefault();
                break;
        }
    }
    
    pauseAllGames() {
        // Pause any running games
        if (window.fallingWordsGame && window.fallingWordsGame.isGameRunning) {
            window.fallingWordsGame.isPaused = true;
        }
        
        if (window.bossFightGame && window.bossFightGame.isGameRunning) {
            window.bossFightGame.isPaused = true;
        }
    }
    
    resumeAllGames() {
        // Resume games that were paused
        if (window.fallingWordsGame && window.fallingWordsGame.isGameRunning) {
            window.fallingWordsGame.isPaused = false;
        }
        
        if (window.bossFightGame && window.bossFightGame.isGameRunning) {
            window.bossFightGame.isPaused = false;
        }
    }
    
    handleResize() {
        // Handle canvas resizing if needed
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            // Canvases maintain their size, but we might need to adjust positioning
            const container = canvas.parentElement;
            if (container) {
                // Center canvas in container
                const containerWidth = container.clientWidth;
                const canvasWidth = canvas.offsetWidth;
                if (canvasWidth < containerWidth) {
                    canvas.style.marginLeft = Math.floor((containerWidth - canvasWidth) / 2) + 'px';
                }
            }
        });
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    showLoadingScreen() {
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        this.loadingScreen.innerHTML = `
            <div class="loading-spinner"></div>
            <h2 style="color: #4ecca3; margin: 0;">Loading Language Quest Adventure...</h2>
            <p style="color: #ccc; margin: 10px 0 0 0;">正在加載英語過去式發音學習遊戲...</p>
        `;
        
        document.body.appendChild(this.loadingScreen);
    }
    
    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    document.body.removeChild(this.loadingScreen);
                }
            }, 500);
        }
    }
    
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: #16213e; display: flex; align-items: center; justify-content: center;
                        z-index: 10000; flex-direction: column;">
                <h2 style="color: #e74c3c; margin-bottom: 20px;">❌ Error</h2>
                <p style="color: white; margin-bottom: 20px; text-align: center; max-width: 500px;">${message}</p>
                <button onclick="location.reload()" 
                        style="background: #4ecca3; color: white; border: none; padding: 15px 30px; 
                               border-radius: 5px; cursor: pointer; font-size: 16px;">
                    Refresh Page
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    // Utility methods for other modules
    static showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        const colors = {
            info: '#4ecca3',
            success: '#2ecc71', 
            warning: '#f39c12',
            error: '#e74c3c'
        };
        
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: ${colors[type]}; 
                        color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3); max-width: 300px;
                        animation: slideIn 0.3s ease-out;">
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.firstElementChild.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, duration);
    }
    
    // Performance monitoring
    static logPerformance(label, startTime) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`Performance [${label}]: ${duration.toFixed(2)}ms`);
        
        if (duration > 100) {
            console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
        }
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the app
const startTime = performance.now();
window.app = new LanguageLearningApp();

// Log initialization time
setTimeout(() => {
    if (window.app.initialized) {
        LanguageLearningApp.logPerformance('App Initialization', startTime);
    }
}, 1000);

// Export app class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageLearningApp;
}

// Development helpers (remove in production)
if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
    window.dev = {
        resetGame: () => window.gameSystem?.resetGameState(),
        unlockAll: () => {
            if (window.gameSystem) {
                Object.keys(window.gameSystem.gameStates).forEach(game => {
                    window.gameSystem.gameStates[game].unlocked = true;
                });
                window.gameSystem.updateGameButtons();
            }
        },
        addScore: (game, points) => window.gameSystem?.updateScore(game, points),
        testSound: (type) => window.SoundSystem?.play(type),
        toggleDebug: () => {
            document.body.classList.toggle('debug-mode');
        }
    };
    
    console.log('Development helpers available in window.dev');
}
