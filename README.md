# 🎮 English Past Tense Pronunciation Adventure Game

A comprehensive web-based language learning game that teaches English past tense pronunciation through interactive gameplay and engaging challenges.

## 🌟 Features

### 🎯 Four Unique Games
1. **Word Search (懸崖造橋)** - Find hidden words in a letter grid while building stone bridges across a dangerous cliff
2. **Falling Words (石雨劍斬)** - Use colored swords to slash falling IPA stones with correct pronunciation
3. **Multiple Choice (巫師催眠)** - Break free from hypnosis by answering 5 consecutive questions correctly
4. **Boss Fight (最終決戰)** - Face the Pronunciation King in an epic final battle

### 🎵 Advanced Audio System
- **Background Music** - Immersive BGM with user interaction detection
- **Sound Effects** - Correct/wrong answer feedback and UI sounds  
- **Text-to-Speech** - Word pronunciation using Web Speech API
- **Web Audio API** - High-quality audio with HTML5 fallback

### 🏆 Progressive Gameplay
- **Individual Scoring** - Each game has its own scoring system
- **Artifact Collection** - Collect three mystical artifacts to unlock the final boss
- **Auto-Progression** - Games unlock automatically upon completion
- **Save System** - Progress is automatically saved using localStorage

### 🎨 Rich Visual Experience  
- **Cutscenes** - Animated story sequences for each game
- **Character Sprites** - Detailed character animations and effects
- **Particle Systems** - Explosion effects, magic spells, and visual feedback
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### 🌍 Multilingual Support
- **Chinese (Traditional)** - Full traditional Chinese interface
- **English** - Complete English translation available
- **Easy Expansion** - Modular translation system for adding new languages

## 📁 Project Structure

```
language-learning-game/
├── index.html              # Main game page
├── css/
│   ├── styles.css         # Main styling and UI
│   └── games.css          # Game-specific styles and animations
├── js/
│   ├── main.js            # Application initialization
│   ├── gameSystem.js      # Core game management system
│   ├── soundSystem.js     # Audio management and Web Speech API
│   ├── wordSearch.js      # Game 1: Word Search implementation
│   ├── fallingWords.js    # Game 2: Falling Words with Canvas
│   ├── multipleChoice.js  # Game 3: Multiple Choice hypnosis game
│   └── bossFight.js       # Game 4: Final boss battle
├── data/
│   └── wordDatabase.js    # Expandable word database with pronunciation rules
├── assets/
│   ├── audio/            # BGM and sound effect files
│   ├── video/            # Intro and ending cutscene videos
│   └── images/           # Character sprites and background images
├── README.md             # This file
└── deployment-guide.md   # Detailed deployment instructions
```

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development) or hosting platform

### Local Development
1. Clone or download this repository
2. Start a local web server in the project directory:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js
   npx serve .

   # PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser
4. Click anywhere to enable audio and start playing!

### Production Deployment

#### GitHub Pages
1. Upload all files to a GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from branch" → "main" → "/ (root)"
4. Your game will be live at `https://yourusername.github.io/repository-name`

#### Render.com
1. Connect your GitHub repository to Render
2. Create a new "Static Site"  
3. Set build command to empty and publish directory to "." 
4. Deploy automatically with custom domain

## 🎮 How to Play

### Game Controls
- **Mouse/Touch** - Navigate menus and select answers
- **Keyboard** - Arrow keys for movement (Game 2), Space for actions
- **Audio** - Click the speaker icon to hear word pronunciations

### Gameplay Flow
1. **Start Adventure** - Begin with an introductory video
2. **Word Search** - Find words and select correct pronunciation types
3. **Falling Words** - Use WASD/arrows to move, Space to attack, 1-2-3 to change sword color
4. **Multiple Choice** - Answer questions to break hypnosis (need 5 correct in a row)
5. **Boss Fight** - Final battle requiring all artifacts (answer questions to attack boss)

### Tips for Success
- Listen carefully to word pronunciations
- Learn the pronunciation rules:
  - **/t/** - Words ending in voiceless sounds (helped, worked, washed)
  - **/d/** - Words ending in voiced sounds (played, lived, called)  
  - **/ɪd/** - Words ending in /t/ or /d/ sounds (wanted, needed, visited)

## 🛠️ Customization

### Adding New Words
Edit `data/wordDatabase.js`:
```javascript
wordDatabase.t.push("cooked", "typed", "kissed");
wordDatabase.d.push("amazed", "borrowed", "claimed");
wordDatabase.id.push("accepted", "educated", "limited");
```

### Changing Game Settings
Modify `js/gameSystem.js`:
```javascript
this.requiredScores = {
    wordSearch: 50,    // Points needed to complete
    fallingWords: 75,
    multipleChoice: 100,
    bossFight: 150
};
```

### Adding New Languages
Extend the translations object in `js/gameSystem.js`:
```javascript
this.translations = {
    zh: { /* Chinese translations */ },
    en: { /* English translations */ },
    es: { /* Add Spanish */ },
    // Add more languages...
};
```

## 🎨 Asset Guidelines

### Audio Files (assets/audio/)
- **bgm.mp3** - Background music (2-3 minutes, looping, 128kbps+)
- **correct.mp3** - Success sound (1-2 seconds, clear and pleasant)
- **wrong.mp3** - Error sound (1-2 seconds, distinct from correct)
- **click.mp3** - UI interaction sound (short click/tap sound)

### Images (assets/images/)
- **Backgrounds**: 1200x800px, JPG format, fantasy/adventure theme
- **Character Sprites**: 100-150px, PNG with transparency
- **Style**: Consistent art style, readable at small sizes

### Videos (assets/video/)
- **intro.mp4** - Opening story (30-60 seconds, 1280x720, MP4/H.264)
- **ending.mp4** - Victory celebration (20-40 seconds, 1280x720, MP4/H.264)

## 🔧 Technical Features

### Modern Web Technologies
- **ES6+ JavaScript** - Modern syntax and features
- **Web Audio API** - High-quality audio processing
- **Canvas API** - Hardware-accelerated 2D graphics
- **Web Speech API** - Text-to-speech functionality
- **Local Storage** - Progress persistence
- **CSS3 Animations** - Smooth visual transitions

### Browser Compatibility  
- **Chrome/Chromium** 60+ (Recommended)
- **Firefox** 55+
- **Safari** 11+
- **Edge** 79+
- **Mobile browsers** - iOS Safari 11+, Chrome Mobile 60+

### Performance Optimizations
- Modular loading system
- Efficient particle systems
- Optimized audio management
- Responsive image loading
- Memory leak prevention

## 🧪 Development Tools

### Debug Console Commands
Open browser developer tools and try these:
```javascript
// Reset all progress
window.dev.resetGame();

// Unlock all games
window.dev.unlockAll();

// Add score to specific game  
window.dev.addScore('wordSearch', 100);

// Test audio system
window.dev.testSound('correct');

// Toggle debug mode
window.dev.toggleDebug();
```

### Performance Monitoring
The game includes built-in performance monitoring. Check console for timing information and warnings about slow operations.

## 📚 Educational Content

### Pronunciation Rules Covered
1. **Voiceless Ending /t/** - After /p/, /k/, /f/, /s/, /ʃ/, /tʃ/, /θ/
2. **Voiced Ending /d/** - After /b/, /g/, /v/, /z/, /ʒ/, /dʒ/, /ð/, /m/, /n/, /ŋ/, /l/, /r/, vowels
3. **Syllabic Ending /ɪd/** - After /t/ or /d/ sounds

### Learning Objectives
- Recognize pronunciation patterns in past tense verbs
- Differentiate between the three pronunciation types
- Apply pronunciation rules to new vocabulary
- Build confidence in English pronunciation

## 🤝 Contributing

### Adding New Features
1. Create feature branch from main
2. Follow existing code structure and naming conventions
3. Add appropriate comments and documentation
4. Test across multiple browsers
5. Submit pull request with clear description

### Reporting Issues
- Use GitHub Issues for bug reports
- Include browser version and steps to reproduce
- Attach screenshots for visual issues
- Check console for error messages

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

### Libraries and APIs Used
- Web Audio API for advanced audio features
- Web Speech API for text-to-speech functionality  
- Canvas API for 2D graphics and animations
- Local Storage API for progress saving

### Recommended Free Resources
- **Audio**: Freesound.org, Zapsplat.com, BBC Sound Effects
- **Images**: Unsplash.com, Pixabay.com, OpenGameArt.org
- **Fonts**: Google Fonts, Adobe Fonts
- **Tools**: Blender, GIMP, Audacity, VS Code

## 📞 Support

Need help? Check out:
- **deployment-guide.md** - Detailed setup instructions
- **Browser Console** - Check for error messages
- **GitHub Issues** - Report bugs or request features

---

🎮 **Happy Learning!** 📚

Transform your English pronunciation skills through engaging gameplay and interactive challenges!
