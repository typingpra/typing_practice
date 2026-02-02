# Typing Practice App

<div align="center">

🎯 **A comprehensive typing practice application for programmers and language learners**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Web](https://img.shields.io/badge/Platform-Web-blue.svg)](https://typingpra.github.io)
[![Tech: Vanilla JS](https://img.shields.io/badge/Tech-Vanilla%20JS-green.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[Features](#features) • [Quick Start](#quick-start) • [Practice Modes](#practice-modes) • [Documentation](#documentation)

</div>

## 🌟 Overview

A specialized typing practice application combining programming code practice, English vocabulary training, basic character practice, and reaction time measurement. Built as a **pure static web application** with advanced analytics and hosted on GitHub Pages.

**Key Highlights:**
- 🚀 **Zero setup required** - Works directly in your browser
- 📱 **Fully responsive** - Practice on desktop, tablet, or mobile
- 🔒 **Privacy-first** - All data stays locally in your browser
- 📊 **Rich analytics** - Track your progress with interactive charts
- 🎨 **Beautiful themes** - Dark and light modes for comfortable practice

---

## ✨ Features

### 🎯 Core Features

- **12 Practice Modes**: Programming languages, TypeWell modes, English words, reaction training, and custom content
- **Real-time Statistics**: WPM, accuracy, and detailed performance tracking with live feedback
- **Advanced Analytics**: Interactive graphs, keyboard heatmaps, and comprehensive mistake analysis
- **Custom Code Practice**: Import your own code files or paste custom content with dual mode support
- **Page-based Learning**: Long code automatically split into manageable 20-line pages
- **Multiple Practice Modes**: Normal (with corrections) and TypeWell (strict, no backspace)

---

## 🎮 Practice Modes

### 💻 Programming Languages (7 languages)

Practice with real code snippets from popular programming languages:

| Language | Description | Difficulty |
|----------|-------------|------------|
| **Python** | Clean, readable syntax | Beginner-friendly |
| **JavaScript** | Web development essentials | Intermediate |
| **Java** | Enterprise-grade code | Intermediate |
| **C** | Low-level programming | Advanced |
| **C++** | Object-oriented systems | Advanced |
| **Rust** | Modern systems language | Advanced |
| **Lua** | Lightweight scripting | Beginner-friendly |

**Features:**
- Real code practice with actual programming syntax and patterns
- Automatic 20-line page splitting for long files
- Choose Normal mode (backspace allowed) or TypeWell mode (strict)
- Syntax-aware character highlighting

### ⌨️ TypeWell Original

Master fundamental typing skills with random character drills:

**Format:** 360 characters × 10 lines (36 characters per line)

**4 Difficulty Modes:**
- 📝 **Lowercase** - a-z + space, comma, period
- 📝 **Mixed Case** - a-z, A-Z + space, comma, period  
- 📝 **With Symbols** - Full alphanumeric + all symbols
- 🔢 **Numbers Only** - 0-9 focused practice

**Special Features:**
- ⛔ **No Backspace** - Stop on mistakes for strict training
- 🎲 **Xorshift128 Random** - High-quality random generation
- ⏱️ **Countdown Timer** - Configurable 0-3 second preparation
- 🔤 **Large Font** - 28px dedicated font for optimal visibility
- 📊 **Lap Times** - Line-by-line completion tracking

### 🔤 TypeWell English Words

Improve typing speed while learning practical English vocabulary:

**Format:** 400 characters × 8 lines consistently

**3 Word Sets (NGSL-compliant):**
- 📚 **Top 500 Words** - Most frequent everyday vocabulary
- 📚 **Top 1500 Words** - Extended vocabulary coverage
- 📚 **All Words** - Complete 2809 word database

**Educational Value:**
- Based on the **New General Service List** - scientifically validated frequency data
- Learn common English words while practicing typing
- Strict TypeWell mode for accuracy training
- Perfect for ESL learners and vocabulary building

### ⚡ Initial Speed

Train your reaction time and finger reflexes:

**Character Sets:**
- 🔤 **Lowercase + Punctuation** (a-z, comma, period)
- 🔢 **Numbers Only** (0-9)
- ✋ **Left Hand** (qwertasdfgzxcvb)
- ✋ **Right Hand** (yuiophjklnm,.)
- 🎯 **Hand Primitive** - Specialized left/right reflex training

**Features:**
- ⚡ **Millisecond precision** - Accurate reaction time measurement
- 🎯 **5-20 trials** - Configurable session length
- 🛡️ **Anti-cheat** - Premature key press detection
- 📊 **Detailed analysis** - Trial-by-trial breakdown with statistics
- 🏆 **TOP3 Rankings** - Based on average reaction time

### 📚 Word Practice

Individual word-by-word typing practice:

**Features:**
- 📖 **NGSL Word Database** - 2809 scientifically validated words
- 🔢 **5-20 words per session** - Flexible practice length
- ⏱️ **Real-time WPM** - Immediate speed feedback per word
- 📈 **Comprehensive results** - Best/worst word tracking
- 🎯 **First key analysis** - Measure word recognition time

### 🔧 Custom Code

Practice with your own content:

**Supported Formats:**
`.txt` `.js` `.py` `.c` `.cpp` `.java` `.rs` `.lua` `.md` `.json` `.html` `.css` and more

**Features:**
- 📁 **File upload** - Up to 1MB file size
- 📋 **Paste support** - Direct text input alternative
- 💾 **Save & Load** - Named storage for multiple codes
- 🎨 **Mode selection** - Normal or TypeWell mode per code
- 📄 **Auto-paging** - Long files split into 20-line pages

---

## 📊 Advanced Analytics

### 📈 Interactive Graphs

Powered by **Chart.js** for beautiful, interactive visualizations:

- **📊 Progress Chart** - Performance trends over time (Line chart)
- **📈 Language Comparison** - Side-by-side language performance (Bar chart)
- **⚡ Initial Speed Analysis** - Reaction time scatter plot with trend lines
- **⌨️ Keyboard Analysis** - Heatmap + mistake frequency visualization

### 🎯 Mistake Analysis System

Identify and improve your weak points:

- **Character-level tracking** - Every error recorded and analyzed
- **Dual statistics** - General mistakes + Initial Speed specific data
- **Keyboard heatmap** - 15×4 QWERTY layout with 5-level intensity
- **Top 8 problem characters** - Doughnut chart with gradient colors
- **Special character support** - Visual display for space (␣), Enter (⏎), Tab (→)

### 🏆 TOP3 Ranking System

Track your personal bests:

- **Language-specific records** - Separate rankings per practice mode
- **Part-based tracking** - Individual page/section records
- **Rank-in celebration** - Highlight when achieving new personal bests
- **Real-time updates** - Automatic record comparison

---

## 🎨 Customization & Comfort

### 🌙 Advanced Theme System

- **Dark/Light themes** - Eye-friendly for any environment
- **Smooth transitions** - Animated theme switching
- **Responsive design** - Mobile-optimized layouts
- **Color coding** - Clear visual feedback:
  - 🟢 **Green** = Correct
  - 🔴 **Red** = Incorrect
  - ⚪ **Gray** = Pending
  - 🔵 **Blue background** = Current position

### 🧘 Auto Break System

Prevent fatigue with smart break reminders:

- **Configurable thresholds** - Set character count for automatic breaks
- **Cross-session tracking** - Monitors cumulative typing
- **Break statistics** - Display current WPM, time, and character count
- **Easy resume** - Continue button or Enter key

### 🌏 Multilingual Support

- **Multibyte character skip** - Japanese, Chinese, Korean characters handled gracefully
- **ASCII optimization** - Programming-focused practice
- **Visual distinction** - Non-target characters shown dimmed
- **UTF-8 support** - Safe handling of international files

### 💾 Data Management

- **Local storage** - All data saved securely in browser
- **Export/Import** - JSON format backup and restore
- **Cross-session persistence** - Settings preserved between visits
- **365-day retention** - Standard browser storage period
- **Privacy first** - No external data transmission, completely offline

---

## 🚀 Quick Start

### Option 1: Fork & Deploy (Recommended)

Perfect for customizing your own instance:

1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages** in repository Settings → Pages → Source: Deploy from a branch → main
3. **Access your deployment** at `https://yourusername.github.io/typingpra.github.io`

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/typingpra/typingpra.github.io.git
cd typingpra.github.io

# Serve locally using Python
python -m http.server 8080

# Or using Node.js
npx http-server -p 8080

# Access at http://localhost:8080
```

### Option 3: Download & Run (Offline)

1. **Download** the repository as ZIP from GitHub
2. **Extract** files to your desired location
3. **Open** `index.html` in your web browser
4. **Start practicing** - No internet connection required!

---

## 📋 System Requirements

- **Modern Web Browser** - Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **JavaScript Enabled** - Required for all functionality
- **Local Storage** - For saving settings and statistics
- **File API Support** - For custom code file uploads
- **Canvas Support** - For interactive charts and graphs

**Note:** The app is fully functional offline after initial page load.

---

## 🎯 How to Use

### Getting Started

1. **🎮 Select Mode** - Choose from 12 practice types via the dropdown
2. **⚙️ Configure** - Adjust mode-specific settings (word sets, trials, etc.)
3. **⌨️ Start Typing** - Begin typing to match displayed content - timer starts automatically
4. **📊 Monitor** - Track WPM, accuracy, and progress in real-time
5. **🎉 Review** - View detailed statistics, rankings, and improvement suggestions

### Practice Mode Selection Guide

| Your Goal | Recommended Mode | Why |
|-----------|------------------|-----|
| Learn programming syntax | Programming Languages | Real code from 7 languages |
| Build fundamental speed | TypeWell Original | Strict random character drills |
| Improve English vocabulary | TypeWell English Words | NGSL word frequency practice |
| Train reaction time | Initial Speed | Millisecond-precision measurement |
| Practice specific words | Word Practice | Individual word focus |
| Use your own content | Custom Code | Upload or paste any text |

### Keyboard Shortcuts

| Key | Action | When Available |
|-----|--------|----------------|
| **Esc** | Reset and restart from beginning | Always |
| **Enter** | Continue to next page / finish | During results |
| **r** | Retry current page | During results |
| **R** | Restart entire practice from beginning | During results |
| **Enter** | Resume from auto-break | During break dialog |
| **Backspace** | Delete last character | Normal mode only |

---

## 📚 Documentation

### Core Statistics Explained

- **WPM (Words Per Minute)** - Calculated from correctly typed characters (1 word = 5 characters)
- **Accuracy** - Percentage of correct keystrokes out of total attempts
- **Character Progress** - Real-time tracking of completion status
- **Reaction Time** - Millisecond-precise measurement for Initial Speed mode
- **Lap Times** - Line-by-line completion tracking for TypeWell modes

### Custom Code Guidelines

**Best Practices:**
- Use ASCII characters for optimal display
- Files up to 1MB are supported
- UTF-8 encoding recommended
- Choose Normal mode for learning, TypeWell for mastery
- Save frequently used code snippets for quick access

---

## 🔧 Technical Details

### Architecture

- **Frontend Only** - Pure HTML5, CSS3, JavaScript ES6+
- **No build step required** - Open `index.html` directly
- **Modular design** - 11 clean JavaScript modules
- **Progressive enhancement** - Graceful degradation for older browsers
- **Responsive design** - Mobile-first approach

### Browser Storage Structure

```
localStorage Keys (prefix: typingPractice):
├── settings          # Theme, break config, countdown
├── stats             # Practice history, TOP3 records
├── mistakeChars      # Character-level mistake data
├── customCodes       # Saved custom code snippets
└── version           # Data format version
```

### JavaScript Module Structure

```
static/js/
├── chart.min.js      # Chart.js v3.9.1 (MIT License)
├── snippets.js       # 7 programming language definitions
├── words.js          # NGSL database (2809 words, CC BY-SA 4.0)
├── constants.js      # Application constants & state
├── storage.js        # localStorage operations
├── utils.js          # Utilities & random generation
├── theme.js          # Theme management
├── stats.js          # Analytics & graph generation
├── customCode.js     # File handling & custom code
├── typing.js         # Core typing logic
├── ui.js             # UI management
└── main.js           # App initialization
```

### External Dependencies

- **Chart.js v3.9.1** ([MIT License](https://www.chartjs.org/)) - Interactive charts
- **NGSL Word Database** ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)) - English vocabulary

---

## 🎨 Customization

### Adding New Languages

1. Edit `static/js/snippets.js`
2. Add new language to `SNIPPETS` object with code samples
3. Update dropdown in `index.html`
4. Test both Normal and TypeWell modes

Example:
```javascript
SNIPPETS.golang = [
    "package main\\n\\nimport \\"fmt\\"\\n\\nfunc main() {",
    "    fmt.Println(\\"Hello, World!\\")",
    "}"
];
```

### Theme Modification

Edit CSS custom properties in `static/style.css`:

```css
:root {
    --bg-color: #0d1117;
    --text-color: #c9d1d9;
    --correct-color: #3fb950;
    --incorrect-color: #f85149;
    /* ... more variables ... */
}
```

---

## 🤝 Contributing

Contributions are welcome! Please:

- 🐛 **Report bugs** via GitHub Issues with reproduction steps
- 💡 **Suggest features** with use case descriptions
- 🔧 **Submit PRs** following existing code style
- 🌍 **Translate** documentation for broader accessibility
- ⭐ **Star the repo** if you find it useful!

### Development Guidelines

- Follow existing code structure and naming conventions
- Test across different browsers and screen sizes
- Maintain backward compatibility with existing data
- Document new features thoroughly
- Consider mobile performance impact

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

### Third-party Licenses

- **Chart.js v3.9.1**: MIT License
- **NGSL Word Database**: CC BY-SA 4.0 License (by Browne, Culligan & Phillips)

---

## 🙏 Acknowledgments

- **TypeWell Software** - Inspiration for strict typing methodology
- **New General Service List** - High-quality English vocabulary data
- **Chart.js Team** - Excellent charting library
- **GitHub Pages** - Free hosting platform
- **Open Source Community** - Continuous inspiration and best practices

---

<div align="center">

**Made with ❤️ for developers and language learners**

🚀 **[Start Practicing Now](https://typingpra.github.io)** 🚀

</div>
