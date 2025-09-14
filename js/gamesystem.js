/**
 * Game System - Core game management system
 * Handles navigation, state management, and game coordination
 * Updated to match existing HTML structure and features
 */
class GameSystem {
    constructor() {
        this.screenManager = new ScreenManager();
        this.currentVideo = null;
        this.currentGame = null;
        this.gameInstances = {};
        this.score = 0;
        this.level = 1;
        this.gameProgress = {
            wordSearch: { completed: false, unlocked: true, score: 0 },
            fallingWords: { completed: false, unlocked: false, score: 0 },
            multipleChoice: { completed: false, unlocked: false, score: 0 },
            bossFight: { completed: false, unlocked: false, score: 0 }
        };
        this.artifacts = { t: false, d: false, id: false };
        
        console.log('🎮 GameSystem initialized');
        this.init();
    }
    
    init() {
        console.log('🎮 遊戲系統初始化中');
        this.setupEventListeners();
        this.updateGameProgress();
        this.updateLanguage('zh');
        
        // 啟動BGM
        setTimeout(() => {
            window.audioManager.playBGM();
        }, 1000);
    }
    
    setupEventListeners() {
        console.log('🔧 設置遊戲系統事件監聽器');
        
        // 為所有按鈕添加點擊音效
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('clickable')) {
                window.audioManager.playClick();
            }
        });
        
        // 主選單按鈕
        document.getElementById('startGameBtn').addEventListener('click', () => {
            console.log('Start game clicked');
            this.showStory();
        });
        
        document.getElementById('instructionsBtn').addEventListener('click', () => {
            this.showInstructions();
        });
        
        document.getElementById('creditsBtn').addEventListener('click', () => {
            this.showCredits();
        });
        
        // 故事控制
        document.getElementById('skipIntroBtn').addEventListener('click', () => {
            this.skipVideo();
        });
        
        document.getElementById('continueStoryBtn').addEventListener('click', () => {
            this.continueFromVideo();
        });
        
        // 結束畫面控制
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // 遊戲選單
        document.getElementById('gameMenuBackBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // 遊戲按鈕
        document.getElementById('wordSearchBtn').addEventListener('click', () => {
            this.startGame('wordSearch');
        });
        
        document.getElementById('fallingWordsBtn').addEventListener('click', () => {
            this.startGame('fallingWords');
        });
        
        document.getElementById('multipleChoiceBtn').addEventListener('click', () => {
            this.startGame('multipleChoice');
        });
        
        document.getElementById('bossFightBtn').addEventListener('click', () => {
            this.startGame('bossFight');
        });
        
        // 語言切換
        document.getElementById('languageToggle').addEventListener('click', () => {
            this.toggleLanguage();
        });
        
        // 影片事件
        this.currentVideo = document.getElementById('introVideo');
        if (this.currentVideo) {
            this.currentVideo.onended = () => {
                console.log('🎬 介紹影片播放完畢');
                setTimeout(() => this.continueFromVideo(), 2000);
            };
        }
        
        const endingVideo = document.getElementById('endingVideo');
        if (endingVideo) {
            endingVideo.onended = () => {
                console.log('🎉 結束影片播放完畢');
            };
        }
    }
    
    showMainMenu() {
        console.log('📋 顯示主選單');
        this.stopAllVideos();
        this.screenManager.showScreen('mainMenuScreen');
        window.audioManager.playBGM();
        this.currentGame = null;
        this.saveGameState();
    }
    
    showStory() {
        console.log('📖 顯示故事介紹');
        this.screenManager.showScreen('storyScreen');
        // 自動播放介紹影片
        setTimeout(() => {
            if (this.currentVideo) {
                this.currentVideo.currentTime = 0;
                this.currentVideo.play().catch(e => {
                    console.log('影片自動播放被阻擋：', e);
                });
            }
        }, 500);
    }
    
    showEnding() {
        console.log('🎉 顯示結束畫面');
        this.screenManager.showScreen('endingScreen');
        // 自動播放結束影片
        setTimeout(() => {
            const endingVideo = document.getElementById('endingVideo');
            if (endingVideo) {
                endingVideo.currentTime = 0;
                endingVideo.play().catch(e => {
                    console.log('結束影片自動播放被阻擋：', e);
                });
            }
        }, 500);
    }
    
    stopAllVideos() {
        const videos = ['introVideo', 'endingVideo'];
        videos.forEach(videoId => {
            const video = document.getElementById(videoId);
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
        console.log('🛑 所有影片已停止');
    }
    
    skipVideo() {
        console.log('⏭️ 跳過介紹影片');
        this.stopAllVideos();
        this.showGameMenu();
    }
    
    continueFromVideo() {
        console.log('▶️ 從影片繼續');
        this.stopAllVideos();
        this.showGameMenu();
    }
    
    resetGame() {
        console.log('🔄 重置遊戲');
        this.score = 0;
        this.level = 1;
        this.currentGame = null;
        this.gameProgress = {
            wordSearch: { completed: false, unlocked: true, score: 0 },
            fallingWords: { completed: false, unlocked: false, score: 0 },
            multipleChoice: { completed: false, unlocked: false, score: 0 },
            bossFight: { completed: false, unlocked: false, score: 0 }
        };
        this.artifacts = { t: false, d: false, id: false };
        this.updateGameProgress();
        this.showMainMenu();
        this.saveGameState();
    }
    
    showGameMenu() {
        console.log('🎮 顯示遊戲選單');
        this.screenManager.showScreen('gameMenuScreen');
        this.updateGameProgress();
        this.saveGameState();
    }
    
    updateGameProgress() {
        console.log('📊 更新遊戲進度');
        
        const games = ['wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'];
        games.forEach(gameId => {
            const button = document.getElementById(gameId + 'Btn');
            if (button) {
                const progress = this.gameProgress[gameId];
                
                // 移除所有狀態類別
                button.classList.remove('locked', 'completed');
                
                if (progress.completed) {
                    button.classList.add('completed');
                } else if (!progress.unlocked) {
                    button.classList.add('locked');
                }
            }
        });
    }
    
    startGame(gameType) {
        const progress = this.gameProgress[gameType];
        
        if (!progress.unlocked) {
            const message = this.getCurrentLanguage() === 'zh' ? '請先完成前面的遊戲才能解鎖！' : 'Please complete previous games to unlock!';
            this.showMessage(message, 'warning');
            return;
        }
        
        console.log(`🚀 開始遊戲: ${gameType}`);
        this.currentGame = gameType;
        
        // 顯示過場動畫
        this.showGameCutscene(gameType, () => {
            // 顯示遊戲容器
            this.screenManager.showScreen('gameContainer');
            
            // 載入遊戲內容
            this.loadGameContent(gameType);
        });
        
        this.saveGameState();
    }
    
    showGameCutscene(gameId, callback) {
        let title, text, backgroundImage, characterImage;
        
        if (this.getCurrentLanguage() === 'zh') {
            switch(gameId) {
                case 'wordSearch':
                    title = '🌉 第一章：斷橋修復';
                    text = '古老的發音橋樑被邪惡法師破壞了！你必須找到正確的過去式單詞並按發音分類，才能修復橋樑繼續前進。';
                    backgroundImage = 'assets/images/cliff-background.jpg';
                    characterImage = 'assets/images/player-sprite.png';
                    break;
                case 'fallingWords':
                    title = '⚔️ 第二章：岩石法師戰';
                    text = '邪惡的岩石法師用魔法石塊攻擊你！使用你的劍切開帶有正確發音的石塊，擊敗法師獲得發音神器。';
                    backgroundImage = 'assets/images/cliff-background.jpg';
                    characterImage = 'assets/images/warrior-sprite.png';
                    break;
                case 'multipleChoice':
                    title = '🧙‍♂️ 第三章：夢魘法師戰';
                    text = '夢魘法師用催眠術迷惑了你的心智！你必須連續答對5題才能醒來並擊敗法師，奪取最後的神器。';
                    backgroundImage = 'assets/images/cave-background.jpg';
                    characterImage = 'assets/images/player-hypnotized.png';
                    break;
                case 'bossFight':
                    title = '👑 最終章：發音之王';
                    text = '你已經收集齊所有三個發音神器！現在面對最終Boss - 發音之王。運用你掌握的所有發音知識擊敗他，成為真正的發音大師！';
                    backgroundImage = 'assets/images/boss-arena.jpg';
                    characterImage = 'assets/images/pronunciation-king.png';
                    break;
            }
        } else {
            switch(gameId) {
                case 'wordSearch':
                    title = '🌉 Chapter 1: Bridge Repair';
                    text = 'The ancient pronunciation bridge has been destroyed by evil wizards! You must find the correct past tense words and classify them by pronunciation to repair the bridge and continue forward.';
                    backgroundImage = 'assets/images/cliff-background.jpg';
                    characterImage = 'assets/images/player-sprite.png';
                    break;
                case 'fallingWords':
                    title = '⚔️ Chapter 2: Rock Wizard Battle';
                    text = 'The evil rock wizard attacks you with magical stone blocks! Use your sword to slice through blocks with the correct pronunciation, defeat the wizard and obtain the pronunciation artifact.';
                    backgroundImage = 'assets/images/cliff-background.jpg';
                    characterImage = 'assets/images/warrior-sprite.png';
                    break;
                case 'multipleChoice':
                    title = '🧙‍♂️ Chapter 3: Nightmare Wizard Battle';
                    text = 'The nightmare wizard has hypnotized your mind! You must answer 5 questions correctly in a row to wake up, defeat the wizard and seize the final artifact.';
                    backgroundImage = 'assets/images/cave-background.jpg';
                    characterImage = 'assets/images/player-hypnotized.png';
                    break;
                case 'bossFight':
                    title = '👑 Final Chapter: Pronunciation King';
                    text = 'You have collected all three pronunciation artifacts! Now face the final boss - the Pronunciation King. Use all your pronunciation knowledge to defeat him and become a true pronunciation master!';
                    backgroundImage = 'assets/images/boss-arena.jpg';
                    characterImage = 'assets/images/pronunciation-king.png';
                    break;
            }
        }
        
        this.screenManager.showCutscene(title, text, backgroundImage, characterImage, callback);
    }
    
    loadGameContent(gameId) {
        const gameContent = document.getElementById('gameContent');
        
        if (gameId === 'wordSearch') {
            this.loadWordSearchGame(gameContent);
        } else if (gameId === 'fallingWords') {
            this.loadFallingWordsGame(gameContent);
        } else if (gameId === 'multipleChoice') {
            this.loadMultipleChoiceGame(gameContent);
        } else if (gameId === 'bossFight') {
            this.loadBossFightGame(gameContent);
        }
    }
    
    loadWordSearchGame(container) {
        console.log('🔍 載入單詞搜索遊戲');
        const t = window.translations[this.getCurrentLanguage()];
        
        container.style.backgroundImage = 'url("assets/images/cliff-background.jpg")';
        
        container.innerHTML = `
            <div style="min-height: 100vh; color: white; padding: 20px; background: rgba(0,0,0,0.3); backdrop-filter: blur(5px);">
                <h1 style="text-align: center; font-size: 2.5em; margin-bottom: 20px;">${t.bridgeRepair}</h1>
                <!-- Game content will be loaded here -->
                <div id="wordSearchContent"></div>
                <button onclick="window.gameSystem.showGameMenu()" class="control-btn" style="background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.5); position: fixed; bottom: 20px; right: 20px;">${t.backToMenu}</button>
            </div>
        `;
        
        this.setupWordSearchGame();
    }
    
    loadFallingWordsGame(container) {
        console.log('⚔️ 載入岩石法師戰');
        // Similar implementation for other games...
        this.setupFallingWordsGame();
    }
    
    loadMultipleChoiceGame(container) {
        console.log('🧙‍♂️ 載入夢魘法師戰');
        this.setupMultipleChoiceGame();
    }
    
    loadBossFightGame(container) {
        console.log('👑 載入最終Boss戰');
        this.setupBossFightGame();
    }
    
    setupWordSearchGame() {
        const wordSearchGame = new WordSearchGameLogic();
        wordSearchGame.startGame();
        this.gameInstances.wordSearch = wordSearchGame;
    }
    
    setupFallingWordsGame() {
        const fallingGame = new FallingWordsGameLogic();
        fallingGame.init();
        this.gameInstances.fallingWords = fallingGame;
    }
    
    setupMultipleChoiceGame() {
        const mcGame = new MultipleChoiceGameLogic();
        mcGame.init();
        this.gameInstances.multipleChoice = mcGame;
    }
    
    setupBossFightGame() {
        const bossGame = new BossFightGameLogic();
        bossGame.init();
        this.gameInstances.bossFight = bossGame;
    }
    
    updateScore(gameType, score, completed = false) {
        console.log(`📊 更新分數 ${gameType}: ${score}`);
        
        if (this.gameProgress[gameType]) {
            this.gameProgress[gameType].score = score;
            this.gameProgress[gameType].completed = completed;
            
            // 更新總分
            this.score = Object.values(this.gameProgress).reduce((total, game) => total + game.score, 0);
            
            // 發送分數更新事件
            const event = new CustomEvent('scoreUpdate', {
                detail: { gameType, score, totalScore: this.score, completed }
            });
            document.dispatchEvent(event);
            
            this.saveGameState();
        }
    }
    
    completeGame(gameId) {
        console.log(`✅ 遊戲完成: ${gameId}`);
        this.gameProgress[gameId].completed = true;
        window.audioManager.playCorrect();
        
        // 給予神器
        if (gameId === 'wordSearch') {
            this.artifacts.t = true;
        } else if (gameId === 'fallingWords') {
            this.artifacts.d = true;
        } else if (gameId === 'multipleChoice') {
            this.artifacts.id = true;
        }
        
        // 解鎖下一個遊戲
        const gameOrder = ['wordSearch', 'fallingWords', 'multipleChoice', 'bossFight'];
        const currentIndex = gameOrder.indexOf(gameId);
        if (currentIndex >= 0 && currentIndex < gameOrder.length - 1) {
            const nextGame = gameOrder[currentIndex + 1];
            this.gameProgress[nextGame].unlocked = true;
            console.log(`🔓 已解鎖: ${nextGame}`);
            
            this.showMessage(`🎉 ${this.getCurrentLanguage() === 'zh' ? '完成！已解鎖' : 'Completed! Unlocked'}: ${nextGame}!`, 'success', 4000);
        } else if (gameId === 'bossFight') {
            // Boss戰完成，顯示結束影片
            setTimeout(() => {
                this.showEnding();
            }, 3000);
            return;
        }
        
        this.saveGameState();
        setTimeout(() => {
            this.showGameMenu();
        }, 3000);
    }
    
    showFinalVictory() {
        console.log('🏆 顯示最終勝利');
        this.showMessage(`🏆 恭喜！所有遊戲完成！最終得分: ${this.score}`, 'success', 5000);
        setTimeout(() => {
            this.resetGame();
        }, 5000);
    }
    
    showInstructions() {
        const message = this.getCurrentLanguage() === 'zh' ? 
            '找到過去式單詞並根據發音分類：/t/、/d/ 或 /ɪd/！' :
            'Find past tense words and classify by pronunciation: /t/, /d/, or /ɪd/!';
        this.showMessage(message, 'info', 5000);
    }
    
    showCredits() {
        const message = this.getCurrentLanguage() === 'zh' ? 
            '用 ❤️ 為英語學習冒險而製作！' :
            'Made with ❤️ for English learning adventure!';
        this.showMessage(message, 'info', 3000);
    }
    
    toggleLanguage() {
        const newLang = this.getCurrentLanguage() === 'zh' ? 'en' : 'zh';
        this.updateLanguage(newLang);
    }
    
    updateLanguage(lang) {
        window.gameState.currentLanguage = lang;
        const t = window.translations[lang];
        
        console.log(`🌐 語言切換到: ${lang}`);
        
        // 更新所有UI元素
        const elements = {
            'loadingTitle': t.loadingTitle,
            'gameTitle': t.gameTitle,
            'startGameBtn': t.startGame,
            'instructionsBtn': t.instructions,
            'creditsBtn': t.credits,
            'languageToggle': t.languageToggle,
            'introVideoTitle': t.introVideoTitle,
            'introVideoDesc': t.introVideoDesc,
            'skipIntroBtn': t.skipIntro,
            'continueStoryBtn': t.startAdventure,
            'endingVideoTitle': t.endingVideoTitle,
            'endingVideoDesc': t.endingVideoDesc,
            'playAgainBtn': t.playAgain,
            'backToMenuBtn': t.backToMainMenu,
            'gameMenuTitle': t.gameMenuTitle,
            'ws-title': t.wsTitle,
            'ws-desc': t.wsDesc,
            'fw-title': t.fwTitle,
            'fw-desc': t.fwDesc,
            'mc-title': t.mcTitle,
            'mc-desc': t.mcDesc,
            'bf-title': t.bfTitle,
            'bf-desc': t.bfDesc,
            'gameMenuBackBtn': t.backToMenu
        };
        
        Object.entries(elements).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
            }
        });
        
        this.saveGameState();
    }
    
    showMessage(text, type = 'success', duration = 3000) {
        const existing = document.querySelector('.message');
        if (existing) existing.remove();
        
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        document.body.appendChild(message);
        
        // 播放對應音效
        if (type === 'success') {
            window.audioManager.playCorrect();
        } else if (type === 'error') {
            window.audioManager.playWrong();
        } else {
            window.audioManager.playClick();
        }
        
        setTimeout(() => {
            if (message.parentNode) {
                message.style.opacity = '0';
                setTimeout(() => {
                    if (message.parentNode) message.parentNode.removeChild(message);
                }, 300);
            }
        }, duration);
    }
    
    // 音效相關方法
    playSound(soundType) {
        switch(soundType) {
            case 'correct':
                window.audioManager.playCorrect();
                break;
            case 'wrong':
                window.audioManager.playWrong();
                break;
            case 'click':
                window.audioManager.playClick();
                break;
            case 'bgm':
                window.audioManager.playBGM();
                break;
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
    
    // 遊戲狀態管理
    saveGameState() {
        const gameState = {
            score: this.score,
            level: this.level,
            progress: this.gameProgress,
            artifacts: this.artifacts,
            currentGame: this.currentGame,
            language: this.getCurrentLanguage()
        };
        
        try {
            localStorage.setItem('englishGameState', JSON.stringify(gameState));
            console.log('🔄 遊戲狀態已儲存');
        } catch (e) {
            console.log('⚠️ 無法儲存遊戲狀態');
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
                this.artifacts = gameState.artifacts || { t: false, d: false, id: false };
                
                if (gameState.language) {
                    this.updateLanguage(gameState.language);
                }
                
                console.log('✅ 遊戲狀態已載入');
                return true;
            }
        } catch (e) {
            console.log('⚠️ 無法載入遊戲狀態');
        }
        return false;
    }
    
    // 語言支援
    getCurrentLanguage() {
        return window.gameState?.currentLanguage || 'zh';
    }
    
    getTranslation(key) {
        const lang = this.getCurrentLanguage();
        return window.translations?.[lang]?.[key] || key;
    }
    
    // 遊戲進度檢查
    isGameUnlocked(gameType) {
        return this.gameProgress[gameType]?.unlocked || false;
    }
    
    isGameCompleted(gameType) {
        return this.gameProgress[gameType]?.completed || false;
    }
    
    getGameScore(gameType) {
        return this.gameProgress[gameType]?.score || 0;
    }
    
    getAllArtifacts() {
        return this.artifacts;
    }
    
    hasArtifact(type) {
        return this.artifacts[type] || false;
    }
}

// 畫面管理器 - 與現有系統整合
class ScreenManager {
    constructor() {
        this.screens = ['mainMenuScreen', 'storyScreen', 'gameMenuScreen', 'gameContainer', 'endingScreen'];
        this.currentScreen = null;
    }
    
    showScreen(screenId) {
        console.log(`📺 切換到畫面: ${screenId}`);
        
        // 隱藏所有畫面
        this.screens.forEach(id => {
            const screen = document.getElementById(id);
            if (screen) {
                screen.classList.remove('active');
            }
        });
        
        // 隱藏過場動畫
        const cutscene = document.getElementById('cutsceneContainer');
        if (cutscene) {
            cutscene.classList.remove('active');
        }
        
        // 顯示目標畫面
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            console.log(`✅ 畫面 ${screenId} 現在處於活動狀態`);
        } else {
            console.error(`❌ 找不到畫面 ${screenId}`);
        }
    }
    
    showCutscene(title, text, backgroundImage, characterImage, callback) {
        const cutscene = document.getElementById('cutsceneContainer');
        if (!cutscene) return;
        
        cutscene.style.backgroundImage = backgroundImage ? `url('${backgroundImage}')` : '';
        
        const titleEl = document.getElementById('cutsceneTitle');
        const textEl = document.getElementById('cutsceneText');
        const characterEl = document.getElementById('cutsceneCharacter');
        
        if (titleEl) titleEl.textContent = title;
        if (textEl) textEl.textContent = text;
        
        if (characterEl && characterImage) {
            characterEl.style.backgroundImage = `url('${characterImage}')`;
            characterEl.style.display = 'block';
        } else if (characterEl) {
            characterEl.style.display = 'none';
        }
        
        cutscene.classList.add('active');
        
        const continueBtn = document.getElementById('cutsceneContinue');
        if (continueBtn) {
            continueBtn.onclick = () => {
                window.audioManager.playClick();
                cutscene.classList.remove('active');
                if (callback) callback();
            };
        }
    }
}

// 確保全域可用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSystem;
}

// 設置全域變數
window.GameSystem = GameSystem;
window.ScreenManager = ScreenManager;

console.log('✅ GameSystem 和 ScreenManager 類別載入成功');
