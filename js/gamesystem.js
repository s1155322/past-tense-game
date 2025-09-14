checkLevelCompletion(gameType) {
    const gameState = this.gameStates[gameType];
    const requiredScore = this.requiredScores[gameType];
    
    if (gameState.score >= requiredScore && !gameState.completed) {
        console.log('Level completed:', gameType);
        gameState.completed = true;
        this.unlockNextLevel(gameType);
        this.grantArtifact(gameType);
        
        // Show completion message and auto-progress
        this.showStageCompletionMessage(gameType);
        
        this.saveGameState();
    }
}

// 在你的 GameSystem 類別最後面（最後一個 } 之前）添加這個新方法：

showStageCompletionMessage(completedGame) {
    const stageNames = {
        wordSearch: '石橋修復',
        fallingWords: '石塊斬擊', 
        multipleChoice: '催眠破解'
    };
    
    const artifactNames = {
        wordSearch: '探險者之眼 👁',
        fallingWords: '時間控制者 ⏰',
        multipleChoice: '知識寶石 💎'
    };
    
    const stageName = stageNames[completedGame] || '階段';
    const artifactName = artifactNames[completedGame] || '神器';
    
    // Show completion message
    const message = `🎉 ${stageName}完成！<br>獲得神器: ${artifactName}`;
    this.showMessage(message, 4000);
    
    // Auto-progress to next stage after delay
    setTimeout(() => {
        this.proceedToNextStage(completedGame);
    }, 4000);
}

// 同樣在 GameSystem 類別最後面添加這個方法：

proceedToNextStage(completedGame) {
    const nextStages = {
        wordSearch: 'fallingWords',
        fallingWords: 'multipleChoice', 
        multipleChoice: 'bossFight'
    };
    
    const nextStage = nextStages[completedGame];
    
    if (nextStage) {
        console.log('Proceeding to next stage:', nextStage);
        
        if (nextStage === 'bossFight' && !this.canAccessBoss()) {
            this.showMessage('🔒 需要收集所有三個神器才能挑戰Boss！', 3000);
            this.showGameMenu();
        } else {
            // Show transition message
            const stageNames = {
                fallingWords: '石塊斬擊挑戰',
                multipleChoice: '催眠術破解',
                bossFight: '最終Boss戰'
            };
            
            const nextStageName = stageNames[nextStage] || '下一關';
            this.showMessage(`⚡ 準備進入: ${nextStageName}`, 2000);
            
            setTimeout(() => {
                this.startGame(nextStage);
            }, 2000);
        }
    } else {
        // All stages completed
        this.showGameMenu();
    }
}
