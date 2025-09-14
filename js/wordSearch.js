// Simple test game for wordSearch
class WordSearchGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.score = 0;
        console.log('WordSearch game initialized');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.gameSystem) {
        window.wordSearchGame = new WordSearchGame(window.gameSystem);
    } else {
        setTimeout(() => {
            if (window.gameSystem) {
                window.wordSearchGame = new WordSearchGame(window.gameSystem);
            }
        }, 500);
    }
});

document.addEventListener('gameInitialize', (e) => {
    if (e.detail.gameType === 'wordSearch') {
        const container = document.getElementById('wordSearch');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px; color: white; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 80vh;">
                    <h2>🌉 單詞搜索遊戲 (測試版)</h2>
                    <p style="font-size: 18px; margin: 20px 0;">修復石橋，安全通過！</p>
                    <button onclick="window.gameSystem.updateScore('wordSearch', 60); window.gameSystem.checkLevelCompletion('wordSearch');" style="
                        padding: 15px 30px; font-size: 18px; background: #2ecc71; color: white; 
                        border: none; border-radius: 10px; cursor: pointer; margin: 10px;">
                        完成遊戲 (測試)
                    </button>
                    <br><br>
                    <button onclick="window.gameSystem.showGameMenu()" style="
                        padding: 10px 20px; background: #4ecca3; color: white; 
                        border: none; border-radius: 5px; cursor: pointer;">
                        返回選單
                    </button>
                </div>
            `;
        }
    }
});