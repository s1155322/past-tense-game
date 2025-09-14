// Simple test version of multipleChoice.js
class MultipleChoiceGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.score = 0;
        console.log('MultipleChoice game initialized');
    }
    
    startGame() {
        console.log('Starting MultipleChoice game');
        const container = document.getElementById('multipleChoice');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px; color: white;">
                    <h2>選擇題遊戲 (測試版)</h2>
                    <p>連續答對5題破解催眠術！</p>
                    <button onclick="this.completeGame()" style="padding: 15px 30px; font-size: 18px; background: #2ecc71; color: white; border: none; border-radius: 10px; cursor: pointer;">
                        完成測試
                    </button>
                    <br><br>
                    <button onclick="window.gameSystem.showGameMenu()" style="padding: 10px 20px; background: #4ecca3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        返回選單
                    </button>
                </div>
            `;
        }
    }
    
    completeGame() {
        this.score = 100;
        this.gameSystem.updateScore('multipleChoice', this.score);
        this.gameSystem.checkLevelCompletion('multipleChoice');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const checkGameSystem = () => {
        if (window.gameSystem) {
            window.multipleChoiceGame = new MultipleChoiceGame(window.gameSystem);
        } else {
            setTimeout(checkGameSystem, 100);
        }
    };
    checkGameSystem();
});

// Game initialization listener
document.addEventListener('gameInitialize', (e) => {
    if (e.detail.gameType === 'multipleChoice' && window.multipleChoiceGame) {
        window.multipleChoiceGame.startGame();
    }
});