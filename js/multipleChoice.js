/**
 * Multiple Choice Game Module - Wizard Hypnosis Theme
 * Enhanced with streak counter and wizard defeat mechanics
 */

class MultipleChoiceGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.currentWord = null;
        this.currentCategory = null;
        this.correctStreak = 0;
        this.requiredStreak = 5;
        this.score = 0;
        this.gameActive = false;
        this.questionCount = 0;
        this.maxQuestions = 20;
        this.hypnosisLevel = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const choiceButtons = document.querySelectorAll('#multipleChoice .choice-button');
        choiceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.gameActive) {
                    this.handleAnswer(e.target.dataset.sound);
                }
            });
        });
        
        const pronunciationBtn = document.getElementById('playPronunciation');
        if (pronunciationBtn) {
            pronunciationBtn.addEventListener('click', () => {
                this.pronounceCurrentWord();
            });
        }
        
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'multipleChoice') {
                this.startGame();
            }
        });
    }
    
    startGame() {
        this.resetGame();
        this.showHypnosisCutscene();
        
        setTimeout(() => {
            this.gameActive = true;
            this.generateQuestion();
            this.startHypnosisEffects();
        }, 6000);
    }
    
    resetGame() {
        this.correctStreak = 0;
        this.score = 0;
        this.questionCount = 0;
        this.gameActive = false;
        this.hypnosisLevel 
