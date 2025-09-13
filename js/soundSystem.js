/**
 * Enhanced Sound System - Fixes BGM and audio issues
 */
class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
        this.bgmEnabled = true;
        this.sfxEnabled = true;
        this.volume = 0.5;
        this.userInteracted = false;
        
        this.handleUserInteraction = this.handleUserInteraction.bind(this);
        this.addUserInteractionListeners();
    }
    
    addUserInteractionListeners() {
        const events = ['click', 'touchstart', 'keydown'];
        const handler = () => {
            if (!this.userInteracted) {
                this.handleUserInteraction();
            }
        };
        
        events.forEach(event => {
            document.addEventListener(event, handler, { once: true });
        });
    }
    
    handleUserInteraction() {
        this.userInteracted = true;
        this.init();
    }
    
    async init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioContext = new AudioContext();
                if (this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                }
            }
            
            this.initialized = true;
            
            if (this.bgmEnabled) {
                this.playBGM();
            }
            
            return true;
        } catch (error) {
            console.error('Failed to initialize sound system:', error);
            return false;
        }
    }
    
    play(soundName, volume = 1.0) {
        if (!this.sfxEnabled) return;
        
        // Simple beep sounds as fallback
        if (soundName === 'correct') {
            this.playBeep(800, 200);
        } else if (soundName === 'wrong') {
            this.playBeep(200, 300);
        } else if (soundName === 'click') {
            this.playBeep(400, 100);
        }
    }
    
    playBeep(frequency, duration) {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1 * this.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);
        } catch (error) {
            console.error('Error playing beep:', error);
        }
    }
    
    async playBGM() {
        if (!this.bgmEnabled || !this.userInteracted) return;
        
        const bgmElement = document.getElementById('bgmAudio');
        if (bgmElement) {
            try {
                bgmElement.volume = 0.3 * this.volume;
                await bgmElement.play();
            } catch (error) {
                console.log('BGM play failed, this is normal before user interaction');
            }
        }
    }
    
    stopBGM() {
        const bgmElement = document.getElementById('bgmAudio');
        if (bgmElement && !bgmElement.paused) {
            bgmElement.pause();
        }
    }
    
    async speakWord(word, accent = 'en-US') {
        if (!this.sfxEnabled) return;
        
        try {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.rate = 0.8;
                utterance.volume = this.volume;
                utterance.lang = accent;
                speechSynthesis.speak(utterance);
                return;
            }
            
            this.play('click');
            
        } catch (error) {
            console.error('Error speaking word:', error);
            this.play('click');
        }
    }
    
    setBGMEnabled(enabled) {
        this.bgmEnabled = enabled;
        if (enabled && this.userInteracted) {
            this.playBGM();
        } else {
            this.stopBGM();
        }
    }
    
    setSFXEnabled(enabled) {
        this.sfxEnabled = enabled;
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        const bgmElement = document.getElementById('bgmAudio');
        if (bgmElement) {
            bgmElement.volume = 0.3 * this.volume;
        }
    }
}

window.SoundSystem = new SoundSystem();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundSystem;
}
