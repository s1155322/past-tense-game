/**
 * Multiple Choice Game - Complete Fixed Version
 * Player must answer 5 questions correctly in a row to break the evil wizard's hypnosis
 */
class MultipleChoiceGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.currentQuestion = null;
        this.correctStreak = 0;
        this.requiredStreak = 5;
        this.score = 0;
        this.isGameActive = false;
        
        // Word database with pronunciation and meaning
        this.wordDatabase = {
            t: [
                { word: 'watched', pronunciation: '/wɑtʃt/', meaning: '觀看' },
                { word: 'crossed', pronunciation: '/krɔst/', meaning: '穿越' },
                { word: 'kicked', pronunciation: '/kɪkt/', meaning: '踢' },
                { word: 'danced', pronunciation: '/dænst/', meaning: '跳舞' },
                { word: 'jumped', pronunciation: '/dʒʌmpt/', meaning: '跳躍' },
                { word: 'helped', pronunciation: '/hɛlpt/', meaning: '幫助' },
                { word: 'worked', pronunciation: '/wɜrkt/', meaning: '工作' },
                { word: 'washed', pronunciation: '/wɑʃt/', meaning: '洗' }
            ],
            d: [
                { word: 'played', pronunciation: '/pleɪd/', meaning: '玩' },
                { word: 'lived', pronunciation: '/lɪvd/', meaning: '住' },
                { word: 'moved', pronunciation: '/muvd/', meaning: '移動' },
                { word: 'called', pronunciation: '/kɔld/', meaning: '叫' },
                { word: 'loved', pronunciation: '/lʌvd/', meaning: '愛' },
                { word: 'saved', pronunciation: '/seɪvd/', meaning: '拯救' },
                { word: 'smiled', pronunciation: '/smaɪld/', meaning: '微笑' },
                { word: 'tried', pronunciation: '/traɪd/', meaning: '試' }
            ],
            id: [
                { word: 'wanted', pronunciation: '/ˈwɑntɪd/', meaning: '想要' },
                { word: 'needed', pronunciation: '/ˈnidɪd/', meaning: '需要' },
                { word: 'decided', pronunciation: '/dɪˈsaɪdɪd/', meaning: '決定' },
                { word: 'started', pronunciation: '/ˈstɑrtɪd/', meaning: '開始' },
                { word: 'ended', pronunciation: '/ˈɛndɪd/', meaning: '結束' },
                { word: 'visited', pronunciation: '/ˈvɪzɪtɪd/', meaning: '拜訪' },
                { word: 'created', pronunciation: '/kriˈeɪtɪd/', meaning: '創造' },
                { word: 'painted', pronunciation: '/ˈpeɪntɪd/', meaning: '畫' }
            ]
        };
        
        this.usedWords = [];
        this.init();
    }
    
    init() {
        console.log('Initializing Multiple Choice Hypnosis Game');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'multipleChoice') {
                console.log('Starting Multiple Choice Game');
                this.startGame();
            }
        });
    }
    
    startGame() {
        this.resetGame();
        this.showCutscene();
    }
    
    resetGame() {
        this.currentQuestion = null;
        this.correctStreak = 0;
        this.score = 0;
        this.isGameActive = true;
        this.usedWords = [];
    }
    
    showCutscene() {
        const gameContainer = document.getElementById('multipleChoice');
        if (!gameContainer) return;
        
        // Clear existing content
        gameContainer.innerHTML = '';
        
        // Create hypnosis cutscene
        gameContainer.innerHTML = `
            <div class="hypnosis-cutscene" style="
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000;
                background: linear-gradient(45deg, #2d1b69 0%, #8b5cf6 50%, #2d1b69 100%);
                display: flex; align-items: center; justify-content: center;">
                
                <div class="scene-container" style="width: 90%; max-width: 1000px; position: relative;">
                    
                    <!-- Evil Wizard (Game 3 - Different from Game 2) -->
                    <div class="evil-wizard-3" style="
                        position: absolute; right: 10%; top: 20%; width: 150px; height: 200px;">
                        
                        <!-- Wizard body (darker, more evil) -->
                        <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); 
                                    width: 90px; height: 130px; background: #1e1b4b; 
                                    border-radius: 45px 45px 20px 20px; border: 3px solid #7c3aed;"></div>
                        
                        <!-- Wizard head (pale evil) -->
                        <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
                                    width: 70px; height: 70px; background: #e5e7eb; border-radius: 50%; 
                                    border: 2px solid #6b7280;"></div>
                        
                        <!-- Evil glowing red eyes -->
                        <div style="position: absolute; top: 40px; left: 38%; width: 10px; height: 10px; 
                                    background: #dc2626; border-radius: 50%; box-shadow: 0 0 10px #dc2626;"></div>
                        <div style="position: absolute; top: 40px; right: 38%; width: 10px; height: 10px; 
                                    background: #dc2626; border-radius: 50%; box-shadow: 0 0 10px #dc2626;"></div>
                        
                        <!-- Evil smile -->
                        <div style="position: absolute; top: 55px; left: 50%; transform: translateX(-50%); 
                                    width: 20px; height: 10px; border: 2px solid #7c2d12; 
                                    border-top: none; border-radius: 0 0 20px 20px;"></div>
                        
                        <!-- Dark wizard hat -->
                        <div style="position: absolute; top: 5px; left: 50%; transform: translateX(-50%); 
                                    width: 0; height: 0; border-left: 50px solid transparent; 
                                    border-right: 50px solid transparent; border-bottom: 70px solid #0f172a;
                                    filter: drop-shadow(0 0 10px #7c3aed);"></div>
                        
                        <!-- Crystal staff (more powerful) -->
                        <div style="position: absolute; right: -25px; top: 60px; width: 6px; height: 120px; 
                                    background: linear-gradient(180deg, #7c2d12, #451a03); border-radius: 3px;"></div>
                        <div style="position: absolute; right: -35px; top: 45px; width: 25px; height: 25px; 
                                    background: radial-gradient(circle, #dc2626, #7c2d12); border-radius: 50%; 
                                    box-shadow: 0 0 30px #dc2626; animation: evilPulse 2s ease-in-out infinite;"></div>
                    </div>
                    
                    <!-- Hypnotized Player -->
                    <div class="hypnotized-player" style="
                        position: absolute; left: 15%; bottom: 20%; width: 100px; height: 140px;">
                        
                        <!-- Player body -->
                        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); 
                                    width: 60px; height: 90px; background: #4ecca3; border-radius: 30px 30px 15px 15px;"></div>
                        
                        <!-- Player head -->
                        <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
                                    width: 50px; height: 50px; background: #fdbcb4; border-radius: 50%;"></div>
                        
                        <!-- Hypnosis spiral eyes -->
                        <div class="spiral-eyes" style="position: absolute; top: 35px; left: 50%; transform: translateX(-50%);">
                            <div style="position: absolute; left: -15px; width: 12px; height: 12px; 
                                        background: conic-gradient(from 0deg, #dc2626, #7c2d12, #dc2626); 
                                        border-radius: 50%; animation: spinClockwise 1.5s linear infinite;"></div>
                            <div style="position: absolute; right: -15px; width: 12px; height: 12px; 
                                        background: conic-gradient(from 0deg, #dc2626, #7c2d12, #dc2626); 
                                        border-radius: 50%; animation: spinCounterclockwise 1.5s linear infinite;"></div>
                        </div>
                    </div>
                    
                    <!-- Hypnosis energy beams -->
                    <div class="hypnosis-beams" style="position: absolute; left: 25%; right: 25%; top: 40%; bottom: 40%;">
                        <div style="position: absolute; width: 100%; height: 4px; top: 20%; 
                                    background: linear-gradient(90deg, transparent, #dc2626, transparent); 
                                    animation: beamPulse 2s ease-in-out infinite;"></div>
                        <div style="position: absolute; width: 100%; height: 4px; top: 40%; 
                                    background: linear-gradient(90deg, transparent, #7c3aed, transparent); 
                                    animation: beamPulse 2s ease-in-out infinite 0.5s;"></div>
                        <div style="position: absolute; width: 100%; height: 4px; top: 60%; 
                                    background: linear-gradient(90deg, transparent, #dc2626, transparent); 
                                    animation: beamPulse 2s ease-in-out infinite 1s;"></div>
                    </div>
                    
                    <!-- Story text -->
                    <div class="cutscene-text" style="
                        position: absolute; top: 5%; left: 50%; transform: translateX(-50%); 
                        background: rgba(0,0,0,0.85); color: white; padding: 25px; 
                        border-radius: 20px; max-width: 600px; text-align: center; border: 2px solid #7c3aed;">
                        
                        <h3 style="color: #dc2626; margin-top: 0; font-size: 24px;">🧙‍♂️ 邪惡大巫師的催眠術</h3>
                        <p style="font-size: 18px; line-height: 1.5;">
                            你遇到了比之前更強大的邪惡巫師！他的催眠術更加致命。
                        </p>
                        <div style="background: rgba(220, 38, 38, 0.2); padding: 15px; border-radius: 10px; margin: 15px 0;">
                            <p style="margin: 0; font-weight: bold; color: #fca5a5;">
                                ⚠️ 破解方法：連續正確回答 <span style="color: #dc2626; font-size: 20px;">5 題</span> 過去式發音問題！
                            </p>
                        </div>
                        <p style="color: #fbbf24; font-size: 16px;">
                            答錯一題，連擊數就會歸零！必須重新開始挑戰！
                        </p>
                        <button onclick="window.multipleChoiceGame.startMainGame()" style="
                            background: linear-gradient(45deg, #dc2626, #b91c1c); color: white; border: none; 
                            padding: 18px 35px; border-radius: 12px; font-size: 18px; font-weight: bold; 
                            cursor: pointer; margin-top: 20px; box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
                            transition: transform 0.2s ease;">
                            💪 開始破解催眠術
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
            @keyframes evilPulse {
                0%, 100% { box-shadow: 0 0 30px #dc2626; transform: scale(1); }
                50% { box-shadow: 0 0 50px #dc2626, 0 0 80px #7c2d12; transform: scale(1.1); }
            }
            @keyframes spinClockwise {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes spinCounterclockwise {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
            }
            @keyframes beamPulse {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
            </style>
        `;
    }
    
    startMainGame() {
        this.setupGameInterface();
        this.generateNewQuestion();
    }
    
    setupGameInterface() {
        const gameContainer = document.getElementById('multipleChoice');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = `
            <div class="hypnosis-game" style="
                background: linear-gradient(135deg, #2d1b69 0%, #8b5cf6 50%, #2d1b69 100%);
                min-height: 100vh; padding: 20px; position: relative;">
                
                <!-- Game Header -->
                <div class="game-header" style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                        💀 破解邪惡巫師催眠術
                    </h2>
                    <p style="color: #e5e7eb; margin: 10px 0; font-size: 16px;">
                        連續答對5題才能脫離催眠！答錯將重置連擊數！
                    </p>
                </div>
                
                <!-- Evil Wizard in corner -->
                <div class="floating-wizard" style="
                    position: fixed; top: 20px; right: 20px; width: 100px; height: 120px; 
                    z-index: 100; pointer-events: none;">
                    <div id="gameWizard" style="width: 100%; height: 100%; position: relative;">
                        <!-- Wizard will be updated based on state -->
                    </div>
                </div>
                
                <!-- Progress Display -->
                <div class="progress-display" style="
                    background: rgba(0,0,0,0.6); padding: 20px; border-radius: 15px; 
                    margin: 20px auto; max-width: 500px; text-align: center;">
                    
                    <h3 style="color: #dc2626; margin-top: 0;">催眠狀態中...</h3>
                    <div class="streak-info" style="margin: 15px 0;">
                        <div style="color: white; font-size: 18px; margin-bottom: 10px;">
                            破解進度: <span id="correctStreak" style="color: #4ecca3; font-weight: bold; font-size: 24px;">0</span>/5
                        </div>
                        <div class="progress-bar-bg" style="
                            width: 100%; height: 25px; background: rgba(255,255,255,0.2); 
                            border-radius: 12px; overflow: hidden; border: 2px solid rgba(255,255,255,0.3);">
                            <div id="streakProgressBar" style="
                                width: 0%; height: 100%; 
                                background: linear-gradient(90deg, #4ecca3, #2ecc71, #27ae60); 
                                transition: width 0.8s ease; position: relative;">
                            </div>
                        </div>
                    </div>
                    <div style="color: #94a3b8; font-size: 16px;">
                        當前分數: <span id="multipleChoiceScore" style="color: #fbbf24; font-weight: bold;">0</span>
                    </div>
                </div>
                
                <!-- Question Area -->
                <div class="question-area" style="
                    background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; 
                    margin: 30px auto; max-width: 700px; text-align: center; 
                    border: 2px solid rgba(255,255,255,0.2);">
                    
                    <div class="question-prompt" style="color: #e5e7eb; font-size: 20px; margin-bottom: 20px;">
                        聽這個過去式動詞的發音，選擇正確的發音類型：
                    </div>
                    
                    <div id="questionWord" style="
                        font-size: 42px; font-weight: bold; color: #4ecca3; margin: 25px 0; 
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.5); 
                        background: rgba(0,0,0,0.3); padding: 15px 30px; border-radius: 15px; 
                        display: inline-block;">
                        準備中...
                    </div>
                    
                    <div id="wordDetails" style="margin: 20px 0;">
                        <div id="wordMeaning" style="color: #94a3b8; font-size: 18px; margin: 8px 0;"></div>
                        <div id="wordPronunciation" style="
                            color: #fbbf24; font-size: 20px; font-family: 'Courier New', monospace; 
                            font-weight: bold; margin: 8px 0;"></div>
                    </div>
                    
                    <button id="playPronunciation" class="pronunciation-btn" style="
                        background: linear-gradient(45deg, #3b82f6, #1d4ed8); color: white; border: none; 
                        padding: 18px 35px; border-radius: 12px; font-size: 20px; font-weight: bold; 
                        cursor: pointer; margin: 20px 0; transition: all 0.3s ease;
                        box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4);">
                        🔊 播放發音
                    </button>
                </div>
                
                <!-- Answer Choices -->
                <div class="choices" style="
                    display: flex; justify-content: center; gap: 25px; margin: 40px auto; 
                    max-width: 800px; flex-wrap: wrap;">
                    
                    <button class="choice-button" data-sound="t" style="
                        background: linear-gradient(45deg, #3498db, #2980b9); color: white; border: none; 
                        padding: 25px 30px; border-radius: 18px; font-size: 22px; font-weight: bold; 
                        cursor: pointer; min-width: 180px; transition: all 0.3s ease;
                        box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);">
                        /t/ 音<br>
                        <small style="font-size: 14px; opacity: 0.9;">無聲音結尾</small>
                    </button>
                    
                    <button class="choice-button" data-sound="d" style="
                        background: linear-gradient(45deg, #e74c3c, #c0392b); color: white; border: none; 
                        padding: 25px 30px; border-radius: 18px; font-size: 22px; font-weight: bold; 
                        cursor: pointer; min-width: 180px; transition: all 0.3s ease;
                        box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);">
                        /d/ 音<br>
                        <small style="font-size: 14px; opacity: 0.9;">有聲音結尾</small>
                    </button>
                    
                    <button class="choice-button" data-sound="id" style="
                        background: linear-gradient(45deg, #2ecc71, #27ae60); color: white; border: none; 
                        padding: 25px 30px; border-radius: 18px; font-size: 22px; font-weight: bold; 
                        cursor: pointer; min-width: 180px; transition: all 0.3s ease;
                        box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);">
                        /ɪd/ 音<br>
                        <small style="font-size: 14px; opacity: 0.9;">額外音節</small>
                    </button>
                </div>
                
                <!-- Feedback Area -->
                <div id="feedbackArea" style="
                    text-align: center; margin: 30px auto; max-width: 600px; min-height: 80px;">
                    <!-- Feedback messages appear here -->
                </div>
                
                <!-- Back Button -->
                <button class="back-btn" onclick="window.gameSystem?.showGameMenu()" style="
                    position: fixed; bottom: 20px; left: 20px; background: rgba(76, 204, 163, 0.8); 
                    color: white; border: none; padding: 12px 20px; border-radius: 25px; 
                    cursor: pointer; font-weight: bold;">
                    ← 返回選單
                </button>
            </div>
            
            <style>
            .choice-button:hover {
                transform: translateY(-8px) scale(1.05);
                box-shadow: 0 15px 35px rgba(0,0,0,0.4);
            }
            
            .choice-button:active {
                transform: translateY(-4px) scale(1.02);
            }
            
            .pronunciation-btn:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(59, 130, 246, 0.6);
            }
            
            .choice-button.correct {
                animation: correctFlash 1s ease;
            }
            
            .choice-button.incorrect {
                animation: incorrectShake 0.8s ease;
            }
            
            @keyframes correctFlash {
                0% { background: linear-gradient(45deg, #2ecc71, #27ae60); transform: scale(1); }
                50% { background: linear-gradient(45deg, #fff, #2ecc71); transform: scale(1.15); 
                      box-shadow: 0 0 30px rgba(46, 204, 113, 0.8); }
                100% { background: linear-gradient(45deg, #2ecc71, #27ae60); transform: scale(1); }
            }
            
            @keyframes incorrectShake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-15px); }
                40% { transform: translateX(15px); }
                60% { transform: translateX(-10px); }
                80% { transform: translateX(10px); }
            }
            </style>
        `;
        
        // Setup event listeners
        this.setupButtonListeners();
        this.updateWizardDisplay();
    }
    
    setupButtonListeners() {
        // Pronunciation button
        const pronounceBtn = document.getElementById('playPronunciation');
        if (pronounceBtn) {
            pronounceBtn.addEventListener('click', () => this.playPronunciation());
        }
        
        // Choice buttons
        const choiceButtons = document.querySelectorAll('.choice-button');
        choiceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.target.dataset.sound || e.target.closest('.choice-button').dataset.sound;
                this.makeChoice(choice);
            });
        });
    }
    
    generateNewQuestion() {
        // Get all available words
        const allWords = [];
        Object.keys(this.wordDatabase).forEach(type => {
            this.wordDatabase[type].forEach(wordObj => {
                if (!this.usedWords.includes(wordObj.word)) {
                    allWords.push({ ...wordObj, type });
                }
            });
        });
        
        if (allWords.length === 0) {
            this.usedWords = [];
            return this.generateNewQuestion();
        }
        
        // Pick random word
        const randomIndex = Math.floor(Math.random() * allWords.length);
        this.currentQuestion = allWords[randomIndex];
        this.usedWords.push(this.currentQuestion.word);
        
        // Update display
        this.updateQuestionDisplay();
        
        // Auto-play pronunciation after a brief delay
        setTimeout(() => this.playPronunciation(), 800);
    }
    
    updateQuestionDisplay() {
        if (!this.currentQuestion) return;
        
        const questionWord = document.getElementById('questionWord');
        const wordMeaning = document.getElementById('wordMeaning');
        const wordPronunciation = document.getElementById('wordPronunciation');
        
        if (questionWord) {
            questionWord.textContent = this.currentQuestion.word;
        }
        
        if (wordMeaning) {
            wordMeaning.textContent = `意思：${this.currentQuestion.meaning}`;
        }
        
        if (wordPronunciation) {
            wordPronunciation.textContent = this.currentQuestion.pronunciation;
        }
        
        // Reset choice buttons
        const choiceButtons = document.querySelectorAll('.choice-button');
        choiceButtons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = false;
            btn.style.opacity = '1';
        });
        
        // Clear feedback
        const feedbackArea = document.getElementById('feedbackArea');
        if (feedbackArea) {
            feedbackArea.innerHTML = '';
        }
    }
    
    playPronunciation() {
        if (!this.currentQuestion) return;
        
        console.log('Playing pronunciation for:', this.currentQuestion.word);
        
        if (window.SoundSystem && window.SoundSystem.speakWord) {
            window.SoundSystem.speakWord(this.currentQuestion.word);
        } else {
            // Fallback: try to use Web Speech API
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(this.currentQuestion.word);
                utterance.lang = 'en-US';
                utterance.rate = 0.8;
                speechSynthesis.speak(utterance);
            }
        }
        
        // Visual feedback for the pronunciation button
        const pronounceBtn = document.getElementById('playPronunciation');
        if (pronounceBtn) {
            const originalText = pronounceBtn.textContent;
            pronounceBtn.textContent = '🔊 播放中...';
            pronounceBtn.style.background = 'linear-gradient(45deg, #e67e22, #d68910)';
            
            setTimeout(() => {
                pronounceBtn.textContent = originalText;
                pronounceBtn.style.background = 'linear-gradient(45deg, #3b82f6, #1d4ed8)';
            }, 1500);
        }
    }
    
    makeChoice(choice) {
        if (!this.currentQuestion || !this.isGameActive) return;
        
        const isCorrect = choice === this.currentQuestion.type;
        const choiceButtons = document.querySelectorAll('.choice-button');
        
        // Disable all buttons temporarily
        choiceButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.7';
        });
        
        const clickedButton = document.querySelector(`[data-sound="${choice}"]`);
        
        if (isCorrect) {
            this.handleCorrectAnswer(clickedButton);
        } else {
            this.handleIncorrectAnswer(clickedButton);
        }
    }
    
    handleCorrectAnswer(button) {
        this.correctStreak++;
        this.score += 25;
        
        console.log(`Correct! Streak: ${this.correctStreak}/5`);
        
        // Visual feedback
        if (button) {
            button.classList.add('correct');
        }
        
        // Play success sound
        if (window.SoundSystem) {
            window.SoundSystem.play('correct');
        }
        
        // Show feedback
        this.showFeedback(`✅ 正確！連擊: ${this.correctStreak}/5`, 'success');
        
        // Update UI
        this.updateUI();
        this.updateWizardDisplay();
        
        // Check if hypnosis is broken
        if (this.correctStreak >= this.requiredStreak) {
            setTimeout(() => this.breakHypnosis(), 1500);
        } else {
            setTimeout(() => this.generateNewQuestion(), 2500);
        }
    }
    
    handleIncorrectAnswer(button) {
        this.correctStreak = 0; // Reset streak!
        
        console.log('Incorrect! Streak reset to 0');
        
        // Visual feedback
        if (button) {
            button.classList.add('incorrect');
        }
        
        // Show correct answer
        const correctButton = document.querySelector(`[data-sound="${this.currentQuestion.type}"]`);
        if (correctButton) {
            setTimeout(() => {
                correctButton.classList.add('correct');
            }, 800);
        }
        
        // Play wrong sound
        if (window.SoundSystem) {
            window.SoundSystem.play('wrong');
        }
        
        // Show feedback
        const correctType = this.currentQuestion.type;
        const typeNames = { t: '/t/ 音', d: '/d/ 音', id: '/ɪd/ 音' };
        this.showFeedback(
            `❌ 錯誤！正確答案是 ${typeNames[correctType]}<br>連擊重置為 0！`, 
            'error'
        );
        
        // Update UI
        this.updateUI();
        this.updateWizardDisplay();
        
        // Continue with new question
        setTimeout(() => this.generateNewQuestion(), 3500);
    }
    
    showFeedback(message, type) {
        const feedbackArea = document.getElementById('feedbackArea');
        if (!feedbackArea) return;
        
        const colors = {
            success: { bg: '#2ecc71', border: '#27ae60' },
            error: { bg: '#e74c3c', border: '#c0392b' },
            info: { bg: '#3498db', border: '#2980b9' }
        };
        
        const color = colors[type] || colors.info;
        
        feedbackArea.innerHTML = `
            <div style="
                background: ${color.bg}; color: white; padding: 20px 30px; 
                border-radius: 15px; font-size: 20px; font-weight: bold; 
                border: 3px solid ${color.border}; display: inline-block;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3); 
                animation: feedbackSlide 0.6s ease;">
                ${message}
            </div>
        `;
        
        // Add animation CSS if not exists
        if (!document.getElementById('feedbackAnimations')) {
            const style = document.createElement('style');
            style.id = 'feedbackAnimations';
            style.textContent = `
                @keyframes feedbackSlide {
                    0% { transform: translateY(-30px) scale(0.8); opacity: 0; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    updateUI() {
        // Update streak display
        const streakElement = document.getElementById('correctStreak');
        const progressBar = document.getElementById('streakProgressBar');
        const scoreElement = document.getElementById('multipleChoiceScore');
        
        if (streakElement) {
            streakElement.textContent = this.correctStreak;
        }
        
        if (progressBar) {
            const percentage = (this.correctStreak / this.requiredStreak) * 100;
            progressBar.style.width = percentage + '%';
        }
        
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }
    
    updateWizardDisplay() {
        const wizardElement = document.getElementById('gameWizard');
        if (!wizardElement) return;
        
        let wizardHTML = '';
        
        if (this.correctStreak === 0) {
            // Powerful wizard
            wizardHTML = `
                <div style="position: relative; width: 100%; height: 100%;">
                    <!-- Wizard body -->
                    <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); 
                                width: 50px; height: 70px; background: #1e1b4b; 
                                border-radius: 25px 25px 10px 10px;"></div>
                    <!-- Wizard head -->
                    <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); 
                                width: 35px; height: 35px; background: #e5e7eb; border-radius: 50%;"></div>
                    <!-- Glowing eyes -->
                    <div style="position: absolute; top: 20px; left: 40%; width: 4px; height: 4px; 
                                background: #dc2626; border-radius: 50%; box-shadow: 0 0 8px #dc2626;"></div>
                    <div style="position: absolute; top: 20px; right: 40%; width: 4px; height: 4px; 
                                background: #dc2626; border-radius: 50%; box-shadow: 0 0 8px #dc2626;"></div>
                    <!-- Hat -->
                    <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); 
                                width: 0; height: 0; border-left: 25px solid transparent; 
                                border-right: 25px solid transparent; border-bottom: 35px solid #0f172a;"></div>
                    <!-- Magic energy -->
                    <div style="position: absolute; right: -10px; top: 25px; width: 12px; height: 12px; 
                                background: radial-gradient(circle, #dc2626, #7c2d12); border-radius: 50%; 
                                animation: evilPulse 1.5s ease-in-out infinite; 
                                box-shadow: 0 0 15px #dc2626;"></div>
                </div>
            `;
        } else if (this.correctStreak < this.requiredStreak) {
            // Weakening wizard
            wizardHTML = `
                <div style="position: relative; width: 100%; height: 100%; opacity: ${1 - (this.correctStreak * 0.15)};">
                    <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); 
                                width: 50px; height: 70px; background: #6b46c1; 
                                border-radius: 25px 25px 10px 10px;"></div>
                    <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); 
                                width: 35px; height: 35px; background: #f3f4f6; border-radius: 50%;"></div>
                    <div style="position: absolute; top: 20px; left: 40%; width: 4px; height: 4px; 
                                background: #f59e0b; border-radius: 50%; box-shadow: 0 0 6px #f59e0b;"></div>
                    <div style="position: absolute; top: 20px; right: 40%; width: 4px; height: 4px; 
                                background: #f59e0b; border-radius: 50%; box-shadow: 0 0 6px #f59e0b;"></div>
                    <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); 
                                width: 0; height: 0; border-left: 25px solid transparent; 
                                border-right: 25px solid transparent; border-bottom: 35px solid #374151;"></div>
                    <div style="position: absolute; right: -10px; top: 25px; width: 10px; height: 10px; 
                                background: radial-gradient(circle, #fbbf24, #f59e0b); border-radius: 50%; 
                                animation: weakPulse 2.5s ease-in-out infinite; 
                                box-shadow: 0 0 10px #fbbf24;"></div>
                </div>
            `;
        } else {
            // Defeated wizard
            wizardHTML = `
                <div style="position: relative; width: 100%; height: 100%; opacity: 0.3; transform: rotate(20deg);">
                    <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); 
                                width: 50px; height: 50px; background: #9ca3af; 
                                border-radius: 25px 25px 10px 10px;"></div>
                    <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
                                width: 35px; height: 35px; background: #f3f4f6; border-radius: 50%;"></div>
                    <div style="position: absolute; top: 30px; left: 40%; width: 4px; height: 4px; 
                                background: #6b7280; border-radius: 50%;"></div>
                    <div style="position: absolute; top: 30px; right: 40%; width: 4px; height: 4px; 
                                background: #6b7280; border-radius: 50%;"></div>
                </div>
            `;
        }
        
        wizardElement.innerHTML = wizardHTML;
    }
    
    breakHypnosis() {
        this.isGameActive = false;
        
        // Show breaking animation
        this.showBreakingAnimation();
        
        // Complete the game
        setTimeout(() => {
            this.completeGame();
        }, 4000);
    }
    
    showBreakingAnimation() {
        const overlay = document.createElement('div');
        overlay.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 2000;
                        background: radial-gradient(circle, rgba(76, 204, 163, 0.3), rgba(46, 204, 113, 0.9)); 
                        display: flex; align-items: center; justify-content: center;
                        animation: breakingFlash 0.8s ease-in-out 4;">
                
                <div style="text-align: center; color: white;">
                    <h1 style="font-size: 52px; margin: 30px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
                               animation: breakingGlow 1.2s ease-in-out infinite;">
                        💪 催眠術被破解！
                    </h1>
                    <p style="font-size: 28px; margin: 25px 0; font-weight: bold;">
                        你成功連續答對 5 題！邪惡巫師被擊敗了！
                    </p>
                    <div style="font-size: 40px; margin: 40px 0; animation: sparkle 1s ease-in-out infinite;">
                        🎉✨🌟💎🌟✨🎉
                    </div>
                    <p style="font-size: 22px; color: #fbbf24; margin: 20px 0;">
                        知識寶石已獲得！
                    </p>
                </div>
            </div>
            
            <style>
            @keyframes breakingFlash {
                0%, 100% { background: radial-gradient(circle, rgba(76, 204, 163, 0.3), rgba(46, 204, 113, 0.9)); }
                50% { background: radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(76, 204, 163, 0.95)); }
            }
            @keyframes breakingGlow {
                0%, 100% { text-shadow: 3px 3px 6px rgba(0,0,0,0.7), 0 0 30px rgba(76, 204, 163, 0.6); }
                50% { text-shadow: 3px 3px 6px rgba(0,0,0,0.7), 0 0 60px rgba(255, 255, 255, 0.9); }
            }
            @keyframes sparkle {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.1) rotate(180deg); }
            }
            </style>
        `;
        
        document.body.appendChild(overlay);
        
        // Remove animation after duration
        setTimeout(() => {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
        }, 3500);
        
        // Play victory sounds
        if (window.SoundSystem) {
            window.SoundSystem.play('correct', 1.8);
            setTimeout(() => window.SoundSystem.play('correct', 2.2), 400);
            setTimeout(() => window.SoundSystem.play('correct', 2.6), 800);
        }
    }
    
    completeGame() {
        // Update the game system
        this.gameSystem.updateScore('multipleChoice', this.score);
        
        const message = '🎉 恭喜！你成功破解了邪惡巫師的催眠術！<br>💎 知識寶石已經獲得！<br>準備進入最終Boss戰！';
        this.gameSystem.showMessage(message, 6000);
        
        // Complete the level
        setTimeout(() => {
            this.gameSystem.checkLevelCompletion('multipleChoice');
        }, 3000);
    }
    
    stopGame() {
        this.isGameActive = false;
        
        // Clear any overlays
        const overlays = document.querySelectorAll('.hypnosis-cutscene');
        overlays.forEach(overlay => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checkGameSystem = () => {
        if (window.gameSystem) {
            window.multipleChoiceGame = new MultipleChoiceGame(window.gameSystem);
            console.log('Multiple Choice Hypnosis Breaking game initialized successfully');
        } else {
            setTimeout(checkGameSystem, 100);
        }
    };
    checkGameSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultipleChoiceGame;
}
