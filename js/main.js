/**
 * Main Application Entry Point - Fixed Version
 */
console.log('Main.js loading...');

// Simple initialization without async/await to avoid syntax errors
function initializeApp() {
    console.log('Initializing Language Learning App...');
    
    // Show loading screen
    showLoadingScreen();
    
    // Check if Sound System is available
    if (window.SoundSystem) {
        console.log('Sound system available');
    } else {
        console.log('Sound system not available');
    }
    
    // Initialize after short delay
    setTimeout(() => {
        try {
            // Game System should be initialized by gamesystem.js
            if (window.gameSystem) {
                console.log('Game System found');
                hideLoadingScreen();
                console.log('App initialized successfully!');
            } else {
                console.log('Waiting for Game System...');
                // Try again after more time
                setTimeout(() => {
                    if (window.gameSystem) {
                        console.log('Game System found on retry');
                        hideLoadingScreen();
                        console.log('App initialized successfully!');
                    } else {
                        console.error('Game System failed to initialize');
                        showErrorMessage('Failed to load the game. Please refresh the page.');
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            showErrorMessage('Failed to load the game. Please refresh the page.');
        }
    }, 500);
}

function showLoadingScreen() {
    // Check if loading screen already exists
    let loadingScreen = document.getElementById('loadingScreen');
    
    if (!loadingScreen) {
        loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.innerHTML = `
            <div style="
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
                background: linear-gradient(135deg, #2d3142 0%, #4f5d75 100%); 
                display: flex; align-items: center; justify-content: center; 
                z-index: 9999; color: white; font-family: Arial, sans-serif;">
                
                <div style="text-align: center;">
                    <div style="
                        width: 60px; height: 60px; border: 4px solid rgba(76, 204, 163, 0.3); 
                        border-top: 4px solid #4ecca3; border-radius: 50%; 
                        animation: spin 1s linear infinite; margin: 0 auto 30px;">
                    </div>
                    <h2 style="margin: 0 0 15px 0; font-size: 32px; color: #4ecca3;">
                        Loading Language Quest Adventure...
                    </h2>
                    <p style="margin: 0; font-size: 18px; color: #bfc0c0;">
                        正在加載英語過去式發音學習遊戲...
                    </p>
                </div>
                
                <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                </style>
            </div>
        `;
        document.body.appendChild(loadingScreen);
    }
    
    loadingScreen.style.display = 'flex';
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

function showErrorMessage(message) {
    hideLoadingScreen();
    
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
            background: #2d3142; display: flex; align-items: center; justify-content: center; 
            z-index: 9999; color: white; font-family: Arial, sans-serif;">
            
            <div style="text-align: center; max-width: 500px; padding: 40px;">
                <h1 style="color: #e74c3c; font-size: 48px; margin-bottom: 20px;">❌ Error</h1>
                <p style="font-size: 20px; margin-bottom: 30px; line-height: 1.5;">
                    ${message}
                </p>
                <button onclick="window.location.reload()" style="
                    background: #4ecca3; color: white; border: none; padding: 15px 30px; 
                    border-radius: 10px; font-size: 18px; cursor: pointer; font-weight: bold;">
                    Refresh Page
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(errorDiv);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log('Main.js loaded successfully');