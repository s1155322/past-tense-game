/**
 * Falling Words Game - Stone Rain Theme with fixes
 */
class FallingWordsGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.canvas = null;
        this.ctx = null;
        this.isGameRunning = false;
        this.isPaused = false;
        this.animationId = null;
        
        this.score = 0;
        this.lives = 3;
        this.fallingWords = [];
        this.playerX = 400;
        this.playerY = 550;
        this.selectedSword = 't';
        this.wordSpeed = 2;
        this.particles = [];
        
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        
        this.swordColors = {
            't': '#3498db',
            'd': '#e74c3c', 
            'id': '#2ecc71'
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('fallingWordsCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.canvas.style.background = 'linear-gradient(180deg, #2c3e50, #34495e)';
        this.canvas.style.border = '3px solid #4ecca3';
        this.canvas.style.borderRadius = '10px';
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
            this.handleKeyDown(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
        
        document.querySelectorAll('.color-mode-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectSword(e.target.dataset.sound);
            });
        });
        
        document.addEventListener('gameInitialize', (e) => {
            if (e.detail.gameType === 'fallingWords') {
                this.startGame();
            }
        });
        
        if (this.canvas) {
            this.canvas.addEventListener('click', () => {
                this.canvas.focus();
            });
            this.canvas.tabIndex = 1;
        }
    }
    
    handleKeyDown(e) {
        if (!this.isGameRunning) return;
        
        switch (e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = true;
                break;
            case 'ArrowRight': 
            case 'KeyD':
                this.keys.right = true;
                break;
            case 'ArrowUp':
            case 'KeyW':
                this.keys.up = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.keys.down = true;
                break;
            case 'Space':
                this.swingSword();
                break;
            case 'Digit1':
                this.selectSword('t');
                break;
            case 'Digit2':
                this.selectSword('d');
                break;
            case 'Digit3':
                this.selectSword('id');
                break;
        }
    }
    
    handleKeyUp(e) {
        switch (e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = false;
                break;
            case 'ArrowUp':
            case 'KeyW':
                this.keys.up = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.keys.down = false;
                break;
        }
    }
    
    selectSword(type) {
        this.selectedSword = type;
        
        document.querySelectorAll('.color-mode-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sound === type);
        });
        
        if (window.SoundSystem) {
            window.SoundSystem.play('click');
        }
    }
    
    startGame() {
        this.resetGame();
        this.isGameRunning = true;
        this.showStoneRainCutscene();
        
        setTimeout(() => {
            this.gameLoop();
        }, 3000);
        
        if (this.canvas) {
            this.canvas.focus();
        }
    }
    
    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.fallingWords = [];
        this.particles = [];
        this.playerX = 400;
        this.playerY = 550;
        this.updateUI();
    }
    
    showStoneRainCutscene() {
        const cutscene = document.getElementById('game2Cutscene');
        if (cutscene) {
            cutscene.classList.add('active');
            
            setTimeout(() => {
                cutscene.classList.remove('active');
            }, 5000);
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
        
        this.updatePlayer();
        this.spawnWords();
        this.updateFallingWords();
        this.updateParticles();
        this.checkGameOver();
    }
    
    updatePlayer() {
        if (this.keys.left && this.playerX > 50) {
            this.playerX -= 8;
        }
        if (this.keys.right && this.playerX < this.canvas.width - 50) {
            this.playerX += 8;
        }
        if (this.keys.up && this.playerY > 50) {
            this.playerY -= 8;
        }
        if (this.keys.down && this.playerY < this.canvas.height - 50) {
            this.playerY += 8;
        }
    }
    
    spawnWords() {
        if (this.fallingWords.length < 5 && Math.random() < 0.02) {
            const word = this.generateRandomWord();
            this.fallingWords.push(word);
        }
    }
    
    generateRandomWord() {
        const types = ['t', 'd', 'id'];
        const type = types[Math.floor(Math.random() * types.length)];
        const words = wordDatabase[type];
        const word = words[Math.floor(Math.random() * words.length)];
        
        return {
            word: word,
            type: type,
            x: Math.random() * (this.canvas.width - 150) + 75,
            y: -30,
            speed: this.wordSpeed + Math.random(),
            hit: false
        };
    }
    
    updateFallingWords() {
        this.fallingWords = this.fallingWords.filter(wordObj => {
            if (wordObj.hit) return false;
            
            wordObj.y += wordObj.speed;
            
            if (wordObj.y > this.canvas.height) {
                this.lives--;
                this.updateUI();
                this.createExplosion(wordObj.x, this.canvas.height, '#e74c3c');
                return false;
            }
            
            return true;
        });
    }
    
    swingSword() {
        this.fallingWords.forEach(wordObj => {
            const distance = Math.sqrt(
                Math.pow(wordObj.x - this.playerX, 2) + 
                Math.pow(wordObj.y - this.playerY, 2)
            );
            
            if (distance < 80 && !wordObj.hit) {
                this.handleWordHit(wordObj);
            }
        });
        
        if (window.SoundSystem) {
            window.SoundSystem.play('click', 0.8);
        }
    }
    
    handleWordHit(wordObj) {
        wordObj.hit = true;
        
        if (wordObj.type === this.selectedSword) {
            this.score += 10;
            this.gameSystem.updateScore('fallingWords', 10, false);
            
            if (window.SoundSystem) {
                window.SoundSystem.speakWord(wordObj.word);
                window.SoundSystem.play('correct');
            }
            
            this.createExplosion(wordObj.x, wordObj.y, this.swordColors[wordObj.type]);
            
        } else {
            this.lives--;
            
            if (window.SoundSystem) {
                window.SoundSystem.play('wrong');
            }
            
            this.createExplosion(wordObj.x, wordObj.y, '#e74c3c');
        }
        
        this.updateUI();
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 60,
                color: color,
                size: Math.random() * 4 + 2
            });
        }
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            return particle.life > 0;
        });
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(44, 62, 80, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBackground();
        this.drawFallingWords();
        this.drawPlayer();
        this.drawParticles();
        this.drawGameUI();
    }
    
    drawBackground() {
        this.ctx.fillStyle = 'rgba(52, 73, 94, 0.3)';
        
        for (let i = 0; i < 8; i++) {
            const x = i * 100 + 50;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x - 15, 60);
            this.ctx.lineTo(x + 15, 60);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
    
    drawFallingWords() {
        this.fallingWords.forEach(wordObj => {
            if (wordObj.hit) return;
            
            this.ctx.fillStyle = this.swordColors[wordObj.type];
            this.ctx.shadowColor = this.swordColors[wordObj.type];
            this.ctx.shadowBlur = 10;
            
            this.ctx.fillRect(wordObj.x - 40, wordObj.y - 15, 80, 30);
            
            this.ctx.shadowBlur = 0;
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(wordObj.word, wordObj.x, wordObj.y + 5);
        });
    }
    
    drawPlayer() {
        this.ctx.fillStyle = '#f39c12';
        this.ctx.fillRect(this.playerX - 20, this.playerY - 30, 40, 60);
        
        const swordColor = this.swordColors[this.selectedSword];
        this.ctx.strokeStyle = swordColor;
        this.ctx.lineWidth = 6;
        this.ctx.shadowColor = swordColor;
        this.ctx.shadowBlur = 8;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.playerX + 25, this.playerY - 20);
        this.ctx.lineTo(this.playerX + 45, this.playerY - 40);
        this.ctx.stroke();
        
        this.ctx.shadowBlur = 0;
        
        this.ctx.fillStyle = '#fdbcb4';
        this.ctx.beginPath();
        this.ctx.arc(this.playerX, this.playerY - 35, 15, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / 60;
            this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawGameUI() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 80);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Current Sword:', 20, 30);
        
        this.ctx.fillStyle = this.swordColors[this.selectedSword];
        this.ctx.fillRect(20, 35, 30, 30);
        
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`/${this.selectedSword}/`, 60, 55);
        
        this.ctx.font = '12px Arial';
        this.ctx.fillText('WASD: Move | Space: Swing | 1,2,3: Change Sword', 20, 75);
    }
    
    updateUI() {
        const scoreElement = document.getElementById('fallingScore');
        const livesElement = document.getElementById('fallingLives');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (livesElement) livesElement.textContent = this.lives;
    }
    
    checkGameOver() {
        if (this.lives <= 0) {
            this.endGame(false);
        } else if (this.score >= 100) {
            this.endGame(true);
        }
    }
    
    endGame(victory) {
        this.isGameRunning = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (victory) {
            this.gameSystem.checkLevelCompletion('fallingWords');
            this.gameSystem.showMessage('太棒了！你成功斬斷了所有IPA石塊！');
        } else {
            this.gameSystem.showMessage('遊戲結束！繼續練習提高反應速度吧！');
        }
    }
    
    stopGame() {
        this.isGameRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const checkGameSystem = () => {
        if (window.gameSystem) {
            window.fallingWordsGame = new FallingWordsGame(window.gameSystem);
        } else {
            setTimeout(checkGameSystem, 100);
        }
    };
    checkGameSystem();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FallingWordsGame;
}
