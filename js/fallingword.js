// Simple test game for fallingWords
class FallingWordsGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.score = 0;
        console.log('FallingWords game initialized');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.gameSystem) {
        window.fallingWordsGame = new FallingWordsGame(window.gameSystem);
    } else {
        setTimeout(() => {
            if (window.gameSystem) {
                window.fallingWordsGame = new FallingWordsGame(window.gameSystem);
            }
        }, 500);
    }
});

document.addEventListener('gameInitialize', (e) => {
    if (e.detail.gameType === 'fallingWords') {
        const container = document.getElementById('fallingWords');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px; color: white; background: linear-gradient(180deg, #1e293b 0%, #475569 100%); min-height: 80vh;">
                    <h2>⚔️ 石塊斬擊遊戲 (測試版)</h2>
                    <p style="font-size: 18px; margin: 20px 0;">用劍斬開魔法石塊！</p>
                    <button onclick="window.gameSystem.updateScore('fallingWords', 80); window.gameSystem.checkLevelCompletion('fallingWords');" style="
                        padding: 15px 30px; font-size: 18px; background: #f59e0b; color: white; 
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