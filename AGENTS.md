# Typing Practice App

**Generated:** 2026-02-02  
**Commit:** 94fb544  
**Branch:** main

## OVERVIEW
Frontend-only typing practice app for programmers and language learners. 12 practice modes including programming languages (Python, JS, Java, C, C++, Rust, Lua), TypeWell modes, English words, and reaction time training.

Pure vanilla JavaScript (ES6+) with no build system. Data persisted via localStorage.

## STRUCTURE

```
./
├── index.html              # Single-page app entry
├── static/
│   ├── style.css           # CSS variables for dark/light themes
│   └── js/
│       ├── main.js         # App initialization, event listeners
│       ├── typing.js       # Core typing logic, mode detection
│       ├── ui.js           # UI management, overlays
│       ├── stats.js        # Statistics, charts, analytics
│       ├── storage.js      # localStorage wrapper
│       ├── theme.js        # Dark/light theme handling
│       ├── utils.js        # Time formatting, random generation
│       ├── customCode.js   # File upload, custom code management
│       ├── constants.js    # App constants, CONFIGURATION
│       ├── words.js        # NGSL English word database (2809 words)
│       ├── snippets.js     # Programming language code samples
│       └── chart.min.js    # Chart.js v3.9.1 (library)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new language | `snippets.js` → add to `SNIPPETS` object | Also update `index.html` dropdown |
| Change pagination | `constants.js` - `LINES_PER_PAGE`, `CHARS_PER_PAGE` | Default: 20 lines/page |
| Modify themes | `style.css` - CSS custom properties | Dark is default, `[data-theme="light"]` for light |
| Add practice mode | `typing.js` + `constants.js` + `index.html` | Check `isTypeWellMode()`, `isInitialSpeedMode()` |
| Change storage keys | `constants.js` - `STORAGE_KEYS` | Prefix: `typingPractice` |
| Modify stats/charts | `stats.js` | Uses Chart.js, see chart configs |
| Handle key events | `main.js` - `setupEventListeners()` | Keyboard shortcuts: Esc=reset, Enter=next, r=retry, R=restart |

## CODE MAP

**Key State Objects**
- `APP_STATE` (constants.js): Global state - input buffer, pages, timer, mode states
- `DOM` (constants.js): Centralized DOM element cache
- `CONSTANTS` (constants.js): All configuration constants

**Main Modules**
| Module | Key Functions | Role |
|--------|---------------|------|
| `Typing` | `handleKeyPress()`, `isTypeWellMode()`, `preparePages()` | Core typing logic |
| `UI` | `showOverlay()`, `handleLanguageChange()` | UI updates, event handlers |
| `Stats` | `saveResult()`, `generateCharts()` | Analytics, TOP3 rankings |
| `Storage` | `setJSON()`, `getJSON()`, `exportData()`, `importData()` | Data persistence |
| `Theme` | `toggle()`, `initialize()` | Theme switching |
| `Utils` | `formatTime()`, `getSelectedTypeWellMode()` | Utilities, state getters |
| `CustomCode` | `save()`, `load()`, `handleFileSelect()` | Custom code management |

## CONVENTIONS

**Code Organization**
- One global object per module (e.g., `const Typing = {...}`)
- Module files loaded via `<script>` tags in `index.html` (order matters)
- All DOM element references cached in `DOM` object during init
- Event listeners attached in `main.js` `setupEventListeners()`

**State Management**
- `APP_STATE` holds all mutable state (pages, timers, input buffer)
- Mode-specific state stored here (e.g., `typewellState`, `initialSpeedState`)
- localStorage for persistence, `Storage` module for all IO

**Comments**
- Mixed Japanese/English throughout codebase
- Japanese for internal notes, English for exported/public concepts

**Naming**
- Module objects: PascalCase (`Typing`, `UI`, `Stats`)
- Constants: UPPER_SNAKE_CASE
- Functions: camelCase
- DOM elements: camelCase with `El` suffix in `DOM` object

## ANTI-PATTERNS

- **Never use `window.localStorage` directly** - Always use `Storage` wrapper (handles errors)
- **Never modify `APP_STATE` directly from outside its module** - Use provided methods
- **Never call `Typing.startTimer()` directly** - It's called automatically on first keypress

## UNIQUE STYLES

**TypeWell Mode Detection** (typing.js)
Multiple checks required: direct typewell value, custom code mode, saved code mode, default language mode. Always use `Typing.isTypeWellMode()` helper.

**Mode-Specific State Machines**
Several modes use explicit state tracking:
- TypeWell: `waiting` → `countdown` → `typing` → `finished`
- Initial Speed: `waiting` → `ready` → `measuring`
- Word Practice: `waiting` → `practicing`

**Backspace Handling**
TypeWell modes disable backspace entirely (strict typing). Normal modes allow corrections. Check `isTypeWellMode()` before allowing backspace.

**Multi-byte Character Support**
Japanese/Chinese/Korean characters are automatically skipped during typing. See `Typing.isMultiByteChar()` regex: `/[^\x00-\x7F]/`

## COMMANDS

```bash
# Local development (Python)
python -m http.server 8080

# Local development (Node)
npx http-server -p 8080

# No build step - open index.html directly
```

## NOTES

- **No package.json, no build system** - Direct browser execution
- **No tests** - Manual testing only
- **Chart.js loaded from CDN** in `index.html` but also has local copy
- **GitHub Pages deployment** - Fully static, no backend
- **localStorage quota** - May fail silently in private mode, `Storage` wrapper logs warnings
- **File upload limit** - 1MB max for custom code files
- **365-day data retention** - localStorage standard, export recommended
