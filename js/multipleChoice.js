// Simple test game for multipleChoice
class MultipleChoiceGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.score = 0;
        this.correctStreak = 0;
        console.log('MultipleChoice game initialized');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const checkGameSystem = () => {
        if (window.gameSystem) {
            window.multipleChoiceGame = new MultipleChoiceGame(window.gameSystem);
            console.log('MultipleChoice test version ready');
        } else {
            setTimeout(checkGameSystem, 100);
        }
    };
    checkGameSystem();
});

document.addEventListener('gameInitialize', (e) => {
    if (e.detail.gameType === 'multipleChoice') {
        console.log('Starting multipleChoice test game');
        const container = document.getElementById('multipleChoice');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px; color: white; 
                           background: linear-gradient(45deg, #2d1b69 0%, #8b5cf6 50%, #2d1b69 100%); 
                           min-height: 80vh;">
                    
                    <h2>🧙‍♂️ 催眠術破解遊戲 (測試版)</h2>
                    <p style="font-size: 18px; margin: 20px 0;">連續答對5題破解邪惡巫師的催眠術！</p>
                    
                    <!-- Mock wizard animation -->
                    <div style="margin: 30px 0;">
                        <div style="font-size: 60px; margin: 20px 0; animation: wizardPulse 2s ease-in-out infinite;">
                            🧙‍♂️✨
                        </div>
                        <p style="color: #dc2626; font-weight: bold;">你被催眠了！</p>
                    </div>
                    
                    <!-- Mock progress -->
                    <div style="background: rgba(0,0,0,0.6); padding: 20px; border-radius: 15px; 
                               margin: 20px auto; max-width: 400px;">
                        <div style="font-size: 18px; margin: 10px 0;">
                            連續正確: <span id="testStreak" style="color: #4ecca3;">0</span>/5
                        </div>
                        <div style="width: 100%; height: 10px; background: rgba(255,255,255,0.2); 
                                   border-radius: 5px; margin: 10px 0;">
                            <div id="testProgressBar" style="width: 0%; height: 100%; background: #4ecca3; 
                                                           border-radius: 5px; transition: width 0.5s;"></div>
                        </div>
                    </div>
                    
                    <!-- Test buttons -->
                    <div style="margin: 30px 0;">
                        <button onclick="window.multipleChoiceTestGame.simulateCorrect()" style="
                            padding: 15px 25px; font-size: 16px; background: #2ecc71; color: white; 
                            border: none; border-radius: 8px; cursor: pointer; margin: 0 10px;">
                            ✅ 模擬答對
                        </button>
                        <button onclick="window.multipleChoiceTestGame.simulateWrong()" style="
                            padding: 15px 25px; font-size: 16px; background: #e74c3c; color: white; 
                            border: none; border-radius: 8px; cursor: pointer; margin: 0 10px;">
                            ❌ 模擬答錯
                        </button>
                    </div>
                    
                    <button onclick="window.multipleChoiceTestGame.completeGame()" style="
                        padding: 15px 30px; font-size: 18px; background: #8b5cf6; color: white; 
                        border: none; border-radius: 10px; cursor: pointer; margin: 20px 10px;">
                        💪 直接完成遊戲
                    </button>
                    <br><br>
                    <button onclick="window.gameSystem.showGameMenu()" style="
                        padding: 10px 20px; background: #4ecca3; color: white; 
                        border: none; border-radius: 5px; cursor: pointer;">
                        返回選單
                    </button>
                </div>
                
                <style>
                @keyframes wizardPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                </style>
            `;
            
            // Setup test game functions
            window.multipleChoiceTestGame = {
                correctStreak: 0,
                
                simulateCorrect: function() {
                    this.correctStreak++;
                    this.updateUI();
                    
                    if (this.correctStreak >= 5) {
                        this.breakHypnosis();
                    }
                },
                
                simulateWrong: function() {
                    this.correctStreak = 0;
                    this.updateUI();
                    alert('❌ 答錯了！連擊重置為0！');
                },
                
                updateUI: function() {
                    const streakElement = document.getElementById('testStreak');
                    const progressBar = document.getElementById('testProgressBar');
                    
                    if (streakElement) {
                        streakElement.textContent = this.correctStreak;
                    }
                    
                    if (progressBar) {
                        const percentage = (this.correctStreak / 5) * 100;
                        progressBar.style.width = percentage + '%';
                    }
                },
                
                breakHypnosis: function() {
                    alert('🎉 催眠術被破解！連續答對5題！');
                    setTimeout(() => {
                        this.completeGame();
                    }, 1000);
                },
                
                completeGame: function() {
                    console.log('MultipleChoice test completing...');
                    window.gameSystem.updateScore('multipleChoice', 110);
                    window.gameSystem.checkLevelCompletion('multipleChoice');
                }
            };
            
        } else {
            console.error('MultipleChoice container not found');
        }
    }
});
