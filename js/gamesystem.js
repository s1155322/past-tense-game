/**
 * Main Game System - Enhanced with proper progression and scoring
 */
class GameSystem {
    constructor() {
        this.currentLang = 'zh';
        this.gameStates = {
            wordSearch: { completed: false, score: 0, unlocked: true, artifact: false },
            fallingWords: { completed: false, score: 0, unlocked: false, artifact: false },
            multipleChoice: { completed: false, score: 0, unlocked: false, artifact: false },
            bossFight: { completed: false, score: 0, unlocked: false, artifact: false }
        };
        
        this.currentGame = null;
        this.totalScore = 0;
        this.currentStage = 1;
        this.requiredScores = {
            wordSearch: 50,
            fallingWords: 75,
            multipleChoice: 100,
            bossFight: 150
        };
        
        this.artifacts = {
            explorer: { obtained: false, name: 'Explorer\'s Eye', icon: '👁' },
            timeController: { obtained: false, name: 'Time Controller', icon: '⏰' },
            knowledgeGem: { obtained: false, name: 'Knowledge Gem', icon: '💎' }
        };
        
        this.settings = {
            volume: 0.5,
            bgmEnabled: true,
            sfxEnabled: true,
            screenSize: 'medium'
        };
        
        this.translations = this.initializeTranslations();
        this.init();
    }
    
    initializeTranslations() {
        return {
            zh: {
                ui: {
                    gameTitle: '英語過去式發音冒險',
                    lobby: {
                        startGame: '開始冒險',
                        loadGame: '繼續冒險',
                        collections: '收藏品',
                        quitGame: '離開遊戲',
                        backToLobby: '返回大廳'
                    },
                    games: {
                        wordSearch: '單詞探索',
                    
