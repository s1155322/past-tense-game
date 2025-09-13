/**
 * Boss Fight Game Module - Final Battle
 * Player faces the Pronunciation King in the ultimate challenge
 */

class BossFightGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.canvas = null;
        this.ctx = null;
        this.isGameRunning = false;
        this.isPaused = false;
        this.animationId = null;
        
        // Game state
        this.playerHealth = 100;
        this.bossHealth = 100;
        this.score = 0;
        this.currentQuestion = null;
        this.questionTimer = 0;
        this.maxQuestionTime = 300; // 5 seconds at 60fps
        
        // Boss properties
        this.boss = {
            x: 600,
            y: 200,
            width: 120,
            height: 150,
            phase: 1, // Boss has 3 phases
            attackCooldown: 0,
            isAttacking: false,
            animFrame: 0
        };
        
        // Player properties
        this.player = {
            x: 100,
            y: 400,
            width: 80,
            height: 100,
            isDefending: false,
            attackCooldown: 0,
            animFrame: 0
        };
        
        // Visual effects
        this.particles = [];
        this.attacks = [];
        this.battleTexts = [];
        
        // Question system
        this.questionsAnswered = 0;
        this.questionsCorrect = 0;
        this.requiredCorrect = 15; // Need 15 correct answers to win
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('bossCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Style canvas
        this.canvas.style.background = 'linear-gradient(180deg, #2c3e50, #8e44ad)';
        this.canvas.style.border = '3px solid #e74c3c';
        this.canvas.style.borderRadius = '10px';
    }
    
    setupEventListeners() {
        // Answer buttons (assume they exist in the HTML)
        document.querySelectorAll('#bossFight .choice-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.isGameRunning && this.currentQuestion) {
                    this.handleAnswer(e.target.dataset.sound);
                }
            });
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.isGameRunning) return;
            
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.playerAttack();
                    break;
                case 'KeyD':
                    this.player.isDefending = true;
                    break;
                case 'KeyP':
                    this.togglePause();
                    break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'KeyD') {
                this.player.isDefending = false;
            }
        });
        
        // Game initialization
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'bossFight') {
                this.startGame();
            }
        });
    }
    
    startGame() {
        this.resetGame();
        this.showBossCutscene();
        
        // Start battle after cutscene
        setTimeout(() => {
            this.isGameRunning = true;
            this.generateQuestion();
            this.gameLoop();
        }, 6000);
    }
    
    resetGame() {
        this.playerHealth = 100;
        this.bossHealth = 100;
        this.score = 0;
        this.questionsAnswered = 0;
        this.questionsCorrect = 0;
        this.boss.phase = 1;
        this.boss.attackCooldown = 0;
        this.player.attackCooldown = 0;
        this.particles = [];
        this.attacks = [];
        this.battleTexts = [];
        this.questionTimer = 0;
        this.currentQuestion = null;
        
        this.updateUI();
    }
    
    showBossCutscene() {
        const cutscene = document.getElementById('bossCutscene');
        if (cutscene) {
            // Add dramatic battle effects
            this.createBattleEffects();
            
            cutscene.classList.add('active');
            
            setTimeout(() => {
                cutscene.classList.remove('active');
            }, 8000);
        }
    }
    
    createBattleEffects() {
        const effectsContainer = document.getElementById('battleEffects');
        if (!effectsContainer) return;
        
        effectsContainer.innerHTML = '';
        
        // Create lightning effects
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const lightning = document.createElement('div');
                lightning.style.cssText = `
                    position: absolute;
                    top: ${Math.random() * 80}%;
                    left: ${Math.random() * 100}%;
                    width: 2px;
                    height: ${20 + Math.random() * 40}%;
                    background: linear-gradient(to bottom, #fff, #4ecdc4);
                    animation: lightning 0.3s ease-out;
                    z-index: 10;
                `;
                effectsContainer.appendChild(lightning);
                
                setTimeout(() => {
                    if (lightning.parentNode) {
                        lightning.parentNode.removeChild(lightning);
                    }
                }, 500);
            }, i * 600);
        }
    }
    
    gameLoop() {
        if (!this.isGameRunning) return;
        
        this.update();
        this.draw();
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (this.isPaused) return;
        
        // Update boss AI
        this.updateBoss();
        
        // Update question timer
        this.updateQuestionTimer();
        
        // Update particles and effects
        this.updateEffects();
        
        // Update attacks
        this.updateAttacks();
        
        // Check win/lose conditions
        this.checkGameEnd();
        
        // Update animations
        this.boss.animFrame = (this.boss.animFrame + 0.1) % (Math.PI * 2);
        this.player.animFrame = (this.player.animFrame + 0.1) % (Math.PI * 2);
    }
    
    updateBoss() {
        // Boss behavior based on phase
        if (this.boss.attackCooldown > 0) {
            this.boss.attackCooldown--;
        }
        
        // Phase transitions
        if (this.bossHealth <= 66 && this.boss.phase === 1) {
            this.boss.phase = 2;
            this.createPhaseTransition('Boss enters Phase 2!');
        } else if (this.bossHealth <= 33 && this.boss.phase === 2) {
            this.boss.phase = 3;
            this.createPhaseTransition('Final Phase - Boss is enraged!');
        }
        
        // Boss attacks
        if (this.boss.attackCooldown <= 0 && Math.random() < 0.02 * this.boss.phase) {
            this.bossAttack();
        }
        
        // Boss floating animation
        this.boss.y = 200 + Math.sin(this.boss.animFrame) * 20;
    }
    
    updateQuestionTimer() {
        if (this.currentQuestion) {
            this.questionTimer--;
            
            if (this.questionTimer <= 0) {
                // Time's up - wrong answer
                this.handleAnswer(null);
            }
        }
    }
    
    generateQuestion() {
        const types = ['t', 'd', 'id'];
        const type = types[Math.floor(Math.random() * types.length)];
        const words = wordDatabase[type];
        const word = words[Math.floor(Math.random() * words.length)];
        
        this.currentQuestion = { word, type };
        this.questionTimer = this.maxQuestionTime;
        
        // Show question in battle UI
        this.showBattleQuestion();
        
        // Pronounce the word
        if (window.SoundSystem) {
            setTimeout(() => {
                window.SoundSystem.speakWord(word);
            }, 200);
        }
    }
    
    showBattleQuestion() {
        // This would update battle UI elements
        const questionDisplay = document.querySelector('#bossFight .word-display');
        if (questionDisplay) {
            questionDisplay.textContent = this.currentQuestion.word;
        }
        
        // Reset button states
        document.querySelectorAll('#bossFight .choice-button').forEach(btn => {
            btn.classList.remove('correct', 'wrong');
            btn.disabled = false;
        });
    }
    
    handleAnswer(answer) {
        if (!this.currentQuestion) return;
        
        this.questionsAnswered++;
        const isCorrect = answer === this.currentQuestion.type;
        
        if (isCorrect) {
            this.questionsCorrect++;
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
        
        // Generate next question after delay
        setTimeout(() => {
            if (this.isGameRunning) {
                this.generateQuestion();
            }
        }, 1500);
        
        this.currentQuestion = null;
        this.questionTimer = 0;
    }
    
    handleCorrectAnswer() {
        this.score += 10;
        this.gameSystem.updateScore('bossFight', 10, false);
        
        // Player attacks boss
        this.playerAttack();
        
        // Visual feedback
        this.createBattleText(this.player.x, this.player.y - 50, 'Correct!', '#2ecc71');
        this.createExplosion(this.boss.x, this.boss.y, '#e74c3c');
        
        // Damage boss
        const damage = 5 + Math.floor(this.boss.phase * 2);
        this.bossHealth = Math.max(0, this.bossHealth - damage);
        
        // Sound effects
        if (window.SoundSystem) {
            window.SoundSystem.play('correct');
        }
        
        this.updateUI();
    }
    
    handleWrongAnswer() {
        // Player takes damage
        const damage = 10 + (this.boss.phase * 5);
        this.playerHealth = Math.max(0, this.playerHealth - damage);
        
        // Visual feedback
        this.createBattleText(this.player.x, this.player.y - 50, 'Wrong!', '#e74c3c');
        this.createExplosion(this.player.x, this.player.y, '#e74c3c');
        
        // Boss attack effect
        this.bossAttack();
        
        // Sound effects
        if (window.SoundSystem) {
            window.SoundSystem.play('wrong');
        }
        
        this.updateUI();
    }
    
    playerAttack() {
        if (this.player.attackCooldown > 0) return;
        
        this.player.attackCooldown = 60; // 1 second cooldown
        this.player.isAttacking = true;
        
        // Create attack projectile
        this.attacks.push({
            x: this.player.x + this.player.width,
            y: this.player.y + this.player.height / 2,
            vx: 8,
            vy: 0,
            type: 'player',
            damage: 5,
            life: 100
        });
        
        setTimeout(() => {
            this.player.isAttacking = false;
        }, 300);
    }
    
    bossAttack() {
        if (this.boss.attackCooldown > 0) return;
        
        this.boss.attackCooldown = 120 - (this.boss.phase * 20); // Faster attacks in later phases
        this.boss.isAttacking = true;
        
        // Create multiple attack projectiles based on phase
        const numAttacks = this.boss.phase;
        
        for (let i = 0; i < numAttacks; i++) {
            setTimeout(() => {
                this.attacks.push({
                    x: this.boss.x,
                    y: this.boss.y + this.boss.height / 2,
                    vx: -6 - Math.random() * 2,
                    vy: (Math.random() - 0.5) * 4,
                    type: 'boss',
                    damage: 8 + this.boss.phase * 2,
                    life: 150
                });
            }, i * 200);
        }
        
        setTimeout(() => {
            this.boss.isAttacking = false;
        }, 500);
    }
    
    updateAttacks() {
        this.attacks = this.attacks.filter(attack => {
            attack.x += attack.vx;
            attack.y += attack.vy;
            attack.life--;
            
            // Check collisions
            if (attack.type === 'player') {
                // Player attack hits boss
                if (attack.x >= this.boss.x && attack.x <= this.boss.x + this.boss.width &&
                    attack.y >= this.boss.y && attack.y <= this.boss.y + this.boss.height) {
                    this.createExplosion(attack.x, attack.y, '#4ecca3');
                    return false; // Remove attack
                }
            } else {
                // Boss attack hits player
                if (!this.player.isDefending &&
                    attack.x >= this.player.x && attack.x <= this.player.x + this.player.width &&
                    attack.y >= this.player.y && attack.y <= this.player.y + this.player.height) {
                    
                    this.playerHealth = Math.max(0, this.playerHealth - attack.damage);
                    this.createExplosion(attack.x, attack.y, '#e74c3c');
                    this.updateUI();
                    return false; // Remove attack
                }
            }
            
            // Remove if out of bounds or life expired
            return attack.x > -50 && attack.x < this.canvas.width + 50 && attack.life > 0;
        });
    }
    
    updateEffects() {
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            return particle.life > 0;
        });
        
        // Update battle texts
        this.battleTexts = this.battleTexts.filter(text => {
            text.y -= 2;
            text.life--;
            return text.life > 0;
        });
        
        // Update attack cooldowns
        if (this.player.attackCooldown > 0) {
            this.player.attackCooldown--;
        }
    }
    
    draw() {
        // Clear canvas with battlefield background
        this.drawBackground();
        
        // Draw characters
        this.drawPlayer();
        this.drawBoss();
        
        // Draw attacks
        this.drawAttacks();
        
        // Draw particles
        this.drawParticles();
        
        // Draw battle texts
        this.drawBattleTexts();
        
        // Draw UI
        this.drawBattleUI();
        
        // Draw pause screen if paused
        if (this.isPaused) {
            this.drawPauseScreen();
        }
    }
    
    drawBackground() {
        // Dark battlefield background
        this.ctx.fillStyle = 'rgba(44, 62, 80, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw arena elements
        this.ctx.fillStyle = 'rgba(142, 68, 173, 0.3)';
        
        // Floor
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
        
        // Battle arena circle
        this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.5)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 250, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    drawPlayer() {
        const x = this.player.x;
        const y = this.player.y;
        
        // Player body
        this.ctx.fillStyle = this.player.isDefending ? '#3498db' : '#4ecca3';
        this.ctx.fillRect(x, y, this.player.width, this.player.height);
        
        // Player effects
        if (this.player.isAttacking) {
            this.ctx.fillStyle = 'rgba(76, 204, 163, 0.7)';
            this.ctx.fillRect(x + this.player.width, y, 20, this.player.height);
        }
        
        if (this.player.isDefending) {
            this.ctx.strokeStyle = '#2980b9';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(x + this.player.width / 2, y + this.player.height / 2, 60, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Player face
        this.ctx.fillStyle = '#fdbcb4';
        this.ctx.beginPath();
        this.ctx.arc(x + this.player.width / 2, y + 20, 15, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawBoss() {
        const x = this.boss.x;
        const y = this.boss.y;
        
        // Boss shadow based on phase
        const phaseColors = ['#9b59b6', '#8e44ad', '#6c3483'];
        this.ctx.fillStyle = phaseColors[this.boss.phase - 1];
        
        // Boss body (larger and more intimidating)
        this.ctx.fillRect(x, y, this.boss.width, this.boss.height);
        
        // Boss crown
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.fillRect(x + 10, y - 20, this.boss.width - 20, 20);
        
        // Boss eyes (glowing effect)
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.shadowColor = '#e74c3c';
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(x + 30, y + 40, 8, 0, Math.PI * 2);
        this.ctx.arc(x + 90, y + 40, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Boss attack effect
        if (this.boss.isAttacking) {
            this.ctx.fillStyle = 'rgba(231, 76, 60, 0.5)';
            this.ctx.fillRect(x - 20, y, 20, this.boss.height);
        }
        
        // Phase indicator
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Phase ${this.boss.phase}`, x + this.boss.width / 2, y - 30);
    }
    
    drawAttacks() {
        this.attacks.forEach(attack => {
            if (attack.type === 'player') {
                this.ctx.fillStyle = '#4ecca3';
                this.ctx.shadowColor = '#4ecca3';
                this.ctx.shadowBlur = 8;
            } else {
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.shadowColor = '#e74c3c';
                this.ctx.shadowBlur = 8;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(attack.x, attack.y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawBattleTexts() {
        this.battleTexts.forEach(text => {
            const alpha = text.life / text.maxLife;
            this.ctx.fillStyle = text.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            this.ctx.font = `bold ${text.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text.text, text.x, text.y);
        });
    }
    
    drawBattleUI() {
        // Draw health bars background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 780, 80);
        
        // Boss health bar
        this.ctx.fillStyle = '#2d4059';
        this.ctx.fillRect(50, 30, 300, 20);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(50, 30, (this.bossHealth / 100) * 300, 20);
        
        // Player health bar
        this.ctx.fillStyle = '#2d4059';
        this.ctx.fillRect(450, 30, 300, 20);
        this.ctx.fillStyle = '#4ecca3';
        this.ctx.fillRect(450, 30, (this.playerHealth / 100) * 300, 20);
        
        // Labels
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Pronunciation King', 50, 25);
        this.ctx.fillText('Hero', 450, 25);
        
        // Score and progress
        this.ctx.fillText(`Score: ${this.score}`, 50, 70);
        this.ctx.fillText(`Correct: ${this.questionsCorrect}/${this.requiredCorrect}`, 250, 70);
        
        // Question timer
        if (this.currentQuestion && this.questionTimer > 0) {
            const timerPercent = this.questionTimer / this.maxQuestionTime;
            this.ctx.fillStyle = timerPercent > 0.3 ? '#2ecc71' : '#e74c3c';
            this.ctx.fillRect(450, 60, 300 * timerPercent, 10);
            
            this.ctx.fillStyle = 'white';
            this.ctx.fillText('Time', 450, 58);
        }
        
        // Controls hint
        this.ctx.font = '12px Arial';
        this.ctx.fillText('Space: Attack | D: Defend | Answer buttons to respond', 20, this.canvas.height - 10);
    }
    
    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press P to resume', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 60,
                maxLife: 60,
                color: color,
                size: Math.random() * 6 + 2
            });
        }
    }
    
    createBattleText(x, y, text, color) {
        this.battleTexts.push({
            x: x,
            y: y,
            text: text,
            color: color,
            life: 120,
            maxLife: 120,
            size: 24
        });
    }
    
    createPhaseTransition(message) {
        // Screen flash effect
        this.createExplosion(this.canvas.width / 2, this.canvas.height / 2, '#f1c40f');
        
        // Show phase message
        this.createBattleText(this.canvas.width / 2, this.canvas.height / 2, message, '#f1c40f');
        
        // Play sound
        if (window.SoundSystem) {
            window.SoundSystem.play('correct', 2.0);
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
    }
    
    checkGameEnd() {
        if (this.playerHealth <= 0) {
            this.endGame(false);
        } else if (this.bossHealth <= 0) {
            this.endGame(true);
        }
    }
    
    endGame(victory) {
        this.isGameRunning = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (victory) {
            this.showVictory();
            this.gameSystem.checkLevelCompletion('bossFight');
        } else {
            this.showDefeat();
        }
    }
    
    showVictory() {
        const message = '🎉 恭喜！你擊敗了發音之王，成為了真正的語言大師！';
        this.gameSystem.showMessage(message, 8000);
        
        // Play ending video
        this.playEndingVideo();
        
        // Play victory sound
        if (window.SoundSystem) {
            window.SoundSystem.play('correct', 2.0);
        }
    }
    
    showDefeat() {
        const message = '💀 你被發音之王擊敗了！繼續練習，再次挑戰吧！';
        this.gameSystem.showMessage(message, 5000);
    }
    
    playEndingVideo() {
        const endingContainer = document.getElementById('endingContainer');
        const endingVideo = document.getElementById('endingVideo');
        
        if (endingContainer && endingVideo) {
            endingContainer.style.display = 'flex';
            
            // Handle video not found
            endingVideo.addEventListener('error', () => {
                console.log('Ending video not found');
                setTimeout(() => {
                    endingContainer.style.display = 'none';
                    this.gameSystem.showMainMenu();
                }, 3000);
            });
            
            endingVideo.addEventListener('ended', () => {
                setTimeout(() => {
                    endingContainer.style.display = 'none';
                    this.gameSystem.showMainMenu();
                }, 2000);
            });
        }
    }
    
    updateUI() {
        const bossHealthElement = document.getElementById('bossHealth');
        const playerHealthElement = document.getElementById('playerHealth');
        const bossScoreElement = document.getElementById('bossScore');
        
        if (bossHealthElement) bossHealthElement.textContent = this.bossHealth;
        if (playerHealthElement) playerHealthElement.textContent = this.playerHealth;
        if (bossScoreElement) bossScoreElement.textContent = this.score;
    }
    
    stopGame() {
        this.isGameRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checkGameSystem = () => {
        if (window.gameSystem) {
            window.bossFightGame = new BossFightGame(window.gameSystem);
            console.log('Boss Fight game initialized');
        } else {
            setTimeout(checkGameSystem, 100);
        }
    };
    checkGameSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BossFightGame;
}
