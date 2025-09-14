// Add these methods to your existing gamesystem.js class

// Replace the checkLevelCompletion method in your GameSystem class with this:
checkLevelCompletion(gameType) {
    const gameState = this.gameStates[gameType];
    const requiredScore = this.requiredScores[gameType];
    
    if (gameState.score >= requiredScore && !gameState.completed) {
        console.log(`Level completed: ${gameType}`);
        gameState.completed = true;
        this.grantArtifact(gameType);
        this.unlockNextLevel(gameType);
        
        // Show stage completion cutscene and auto-progress
        this.showStageCompletionCutscene(gameType);
    }
}

// Add this new method to handle stage completion with auto-progression:
showStageCompletionCutscene(completedGame) {
    const stageNames = {
        wordSearch: '石橋修復完成',
        fallingWords: '石塊斬擊完成', 
        multipleChoice: '催眠術破解完成'
    };
    
    const stageName = stageNames[completedGame] || '階段完成';
    
    // Create completion cutscene
    const cutscene = document.createElement('div');
    cutscene.className = 'stage-completion-cutscene';
    cutscene.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex; align-items: center; justify-content: center;
    `;
    
    cutscene.innerHTML = `
        <div class="completion-content" style="
            text-align: center; color: white; max-width: 800px; padding: 40px;">
            
            <div class="stage-icon" style="font-size: 80px; margin: 20px 0;">
                ${this.getStageIcon(completedGame)}
            </div>
            
            <h1 style="font-size: 42px; margin: 30px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                🎉 ${stageName}！
            </h1>
            
            <div class="artifact-display" style="
                background: rgba(255,255,255,0.1); padding: 25px; border-radius: 20px; 
                margin: 30px 0; border: 2px solid rgba(255,255,255,0.3);">
                <h3 style="margin-top: 0; color: #fbbf24;">獲得神器：</h3>
                <div style="font-size: 48px; margin: 15px 0;">
                    ${this.getArtifactIcon(completedGame)}
                </div>
                <p style="font-size: 20px; margin: 10px 0; font-weight: bold;">
                    ${this.getArtifactName(completedGame)}
                </p>
            </div>
            
            <div class="next-stage-info" style="
                background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; margin: 25px 0;">
                <p style="font-size: 18px; margin: 10px 0;">
                    ${this.getNextStageMessage(completedGame)}
                </p>
            </div>
            
            <div class="auto-progress" style="margin: 30px 0;">
                <div style="color: #94a3b8; font-size: 16px; margin-bottom: 15px;">
                    自動進入下一階段倒數：<span id="countdownTimer" style="color: #4ecca3; font-weight: bold; font-size: 20px;">5</span>秒
                </div>
                <div class="progress-bar" style="
                    width: 300px; height: 8px; background: rgba(255,255,255,0.3); 
                    border-radius: 4px; margin: 0 auto; overflow: hidden;">
                    <div id="autoProgressBar" style="
                        width: 100%; height: 100%; background: linear-gradient(90deg, #4ecca3, #2ecc71);
                        transition: width 5s linear; border-radius: 4px;">
                    </div>
                </div>
            </div>
            
            <button id="continueNowBtn" style="
                background: linear-gradient(45deg, #4ecca3, #2ecc71); color: white; border: none;
                padding: 15px 30px; border-radius: 10px; font-size: 18px; font-weight: bold;
                cursor: pointer; margin: 20px 10px; box-shadow: 0 5px 15px rgba(76, 204, 163, 0.4);">
                立即繼續 →
            </button>
            
            <button id="backToMenuBtn" style="
                background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.5);
                padding: 15px 30px; border-radius: 10px; font-size: 18px; font-weight: bold;
                cursor: pointer; margin: 20px 10px;">
                返回選單
            </button>
        </div>
    `;
    
    document.body.appendChild(cutscene);
    
    // Setup countdown timer
    this.setupAutoProgression(completedGame, cutscene);
    
    // Setup button events
    document.getElementById('continueNowBtn').addEventListener('click', () => {
        this.proceedToNextStage(completedGame);
        document.body.removeChild(cutscene);
    });
    
    document.getElementById('backToMenuBtn').addEventListener('click', () => {
        this.showGameMenu();
        document.body.removeChild(cutscene);
    });
}

// Add this helper method for auto-progression:
setupAutoProgression(completedGame, cutscene) {
    let countdown = 5;
    const timerElement = document.getElementById('countdownTimer');
    const progressBar = document.getElementById('autoProgressBar');
    
    // Start progress bar animation
    setTimeout(() => {
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }, 100);
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (timerElement) {
            timerElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            this.proceedToNextStage(completedGame);
            if (cutscene.parentNode) {
                document.body.removeChild(cutscene);
            }
        }
    }, 1000);
}

// Add this method to handle progression to next stage:
proceedToNextStage(completedGame) {
    const nextStages = {
        wordSearch: 'fallingWords',
        fallingWords: 'multipleChoice', 
        multipleChoice: 'bossFight'
    };
    
    const nextStage = nextStages[completedGame];
    
    if (nextStage) {
        console.log(`Proceeding to next stage: ${nextStage}`);
        
        // Small delay before showing next stage cutscene
        setTimeout(() => {
            if (nextStage === 'bossFight' && !this.canAccessBoss()) {
                // Show message that boss is not yet accessible
                this.showMessage('🔒 需要收集所有三個神器才能挑戰最終Boss！', 4000);
                this.showGameMenu();
            } else {
                this.startGame(nextStage);
            }
        }, 500);
    } else {
        // All stages completed, show victory
        this.showGameMenu();
    }
}

// Add helper methods for stage info:
getStageIcon(gameType) {
    const icons = {
        wordSearch: '🌉',
        fallingWords: '⚔️', 
        multipleChoice: '💪'
    };
    return icons[gameType] || '🎯';
}

getArtifactIcon(gameType) {
    const artifactMap = {
        wordSearch: '👁',
        fallingWords: '⏰',
        multipleChoice: '💎'
    };
    return artifactMap[gameType] || '🏆';
}

getArtifactName(gameType) {
    const nameMap = {
        wordSearch: '探險者之眼',
        fallingWords: '時間控制者',
        multipleChoice: '知識寶石'
    };
    return nameMap[gameType] || '神秘神器';
}

getNextStageMessage(gameType) {
    const messages = {
        wordSearch: '橋樑修復完成！接下來面對從天空掉落的音標石塊挑戰...',
        fallingWords: '石塊斬擊成功！現在要對抗邪惡巫師的催眠術...',
        multipleChoice: '催眠術被破解！準備面對最終的發音之王Boss戰！'
    };
    return messages[gameType] || '準備進入下一個挑戰！';
}

// Update the existing updateGameButtons method to better handle progression:
updateGameButtons() {
    const gameButtons = document.querySelectorAll('.menu-button[data-game]');
    gameButtons.forEach(btn => {
        const gameType = btn.dataset.game;
        if (!gameType || !this.gameStates[gameType]) return;
        
        const gameState = this.gameStates[gameType];
        
        // Remove existing classes
        btn.classList.remove('locked', 'completed', 'active', 'current');
        
        // Check if unlocked
        if (!gameState.unlocked) {
            btn.classList.add('locked');
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.4';
        } else {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
            
            if (gameState.completed) {
                btn.classList.add('completed');
                btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
                btn.style.boxShadow = '0 5px 15px rgba(46, 204, 113, 0.4)';
            } else {
                // This is the current available game
                btn.classList.add('current');
                btn.style.background = 'linear-gradient(135deg, #4ecca3, #45b7aa)';
                btn.style.boxShadow = '0 5px 20px rgba(76, 204, 163, 0.5)';
            }
        }
        
        // Special case for boss fight
        if (gameType === 'bossFight') {
            if (!this.canAccessBoss()) {
                btn.classList.add('locked');
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.4';
                btn.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
            } else {
                btn.classList.remove('locked');
                btn.style.pointerEvents = 'auto';
                btn.style.opacity = '1';
                btn.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                btn.style.boxShadow = '0 5px 20px rgba(220, 38, 38, 0.5)';
                
                // Add pulsing effect for boss
                btn.style.animation = 'bossPulse 2s ease-in-out infinite';
            }
        }
    });
    
    // Add CSS for boss pulse animation if not exists
    if (!document.getElementById('bossPulseStyle')) {
        const style = document.createElement('style');
        style.id = 'bossPulseStyle';
        style.textContent = `
            @keyframes bossPulse {
                0%, 100% { box-shadow: 0 5px 20px rgba(220, 38, 38, 0.5); }
                50% { box-shadow: 0 8px 30px rgba(220, 38, 38, 0.8); }
            }
        `;
        document.head.appendChild(style);
    }
}
