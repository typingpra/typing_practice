// utils.js - ユーティリティ関数

const Utils = {
	// タイムスタンプのフォーマット
	formatTimestamp(timestamp) {
		const date = new Date(timestamp);
		return date.toLocaleString("en-US", {
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	},

	// 時間のフォーマット（秒 → "Xm Ys" or "Xs"）
	formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return minutes > 0
			? `${minutes}m ${remainingSeconds}s`
			: `${remainingSeconds}s`;
	},

	// 反応時間のフォーマット（ミリ秒 → "X.XXXs"）
	formatReactionTime(milliseconds) {
		return `${(milliseconds / 1000).toFixed(3)}s`;
	},

	// 時間文字列のパース（"Xm Ys" → 秒）
	parseTime(timeStr) {
		const parts = timeStr.match(/(\d+)m\s*(\d+)s|(\d+)s/);
		if (parts) {
			if (parts[1] && parts[2]) {
				return parseInt(parts[1]) * 60 + parseInt(parts[2]);
			} else if (parts[3]) {
				return parseInt(parts[3]);
			}
		}
		return 0;
	},

	// 序数の接尾辞を取得（1st, 2nd, 3rd, 4th...）
	getOrdinalSuffix(num) {
		const j = num % 10;
		const k = num % 100;
		if (j === 1 && k !== 11) return "st";
		if (j === 2 && k !== 12) return "nd";
		if (j === 3 && k !== 13) return "rd";
		return "th";
	},

	// 現在のコードを取得
	getCurrentCode() {
		if (DOM.langSel.value === "custom") {
			return DOM.customCodeArea.value;
		} else if (DOM.langSel.value === "typewell") {
			return this.generateTypeWellCode();
		} else if (DOM.langSel.value === "typewell-english-words") {
			return this.generateEnglishWordsCode();
		} else if (DOM.langSel.value === "initial-speed") {
			return ""; // Initial Speedは専用ロジックを使用
		} else if (SNIPPETS[DOM.langSel.value]) {
			return SNIPPETS[DOM.langSel.value];
		} else {
			// 保存されたカスタムコードの場合
			return CustomCode.getCustomCodeContent(DOM.langSel.value);
		}
	},

	// 高品質疑似ランダム生成器（Xorshift128）
	_xorshift128State: [123456789, 362436069, 521288629, 88675123],

	_xorshift128() {
		let t = this._xorshift128State[3];
		let s = this._xorshift128State[0];
		this._xorshift128State[3] = this._xorshift128State[2];
		this._xorshift128State[2] = this._xorshift128State[1];
		this._xorshift128State[1] = s;

		t ^= t << 11;
		t ^= t >>> 8;
		t ^= s ^ (s >>> 19);
		this._xorshift128State[0] = t;

		return (t >>> 0) / 0x100000000; // 0から1の範囲の数値を返す
	},

	// シード設定
	_seedXorshift128() {
		const seed = Date.now() + Math.random() * 1000000;
		this._xorshift128State[0] = seed & 0xffffffff;
		this._xorshift128State[1] = (seed >>> 16) & 0xffffffff;
		this._xorshift128State[2] = (seed >>> 8) & 0xffffffff;
		this._xorshift128State[3] = (seed >>> 24) & 0xffffffff;
		
		// 初期化のため数回実行
		for (let i = 0; i < 10; i++) {
			this._xorshift128();
		}
	},

	// TypeWellオリジナルモード - ランダム文字生成
	generateTypeWellCode() {
		const CHARS_PER_LINE = 36;
		const TOTAL_LINES = 10;

		// ランダム生成器の初期化
		this._seedXorshift128();

		// 選択されたモードを取得
		const selectedMode = this.getSelectedTypeWellMode();

		// モード別の文字セット定義
		let baseChars, punctuationChars, allChars;

		switch (selectedMode) {
			case "lowercase":
				// 小文字のみモード (a-z + 空白 + カンマ + ピリオド)
				baseChars = "abcdefghijklmnopqrstuvwxyz";
				punctuationChars = " .,";
				allChars = baseChars + punctuationChars;
				break;

			case "mixed":
				// 大小混合モード (a-z, A-Z + 空白 + カンマ + ピリオド)
				baseChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
				punctuationChars = " .,";
				allChars = baseChars + punctuationChars;
				break;

			case "symbols":
				// 記号混合モード (a-z, A-Z + 記号 + 空白)
				baseChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
				punctuationChars = " .,;:!?-()[]{}'\"@#$%&*+=/_<>|`~^\\";
				allChars = baseChars + punctuationChars;
				break;

			case "numbers":
				// 数字のみモード (0-9のみ)
				baseChars = "0123456789";
				punctuationChars = "";
				allChars = baseChars;
				break;

			default:
				// デフォルトは小文字のみ
				baseChars = "abcdefghijklmnopqrstuvwxyz";
				punctuationChars = " .,";
				allChars = baseChars + punctuationChars;
		}

		let result = "";

		for (let line = 0; line < TOTAL_LINES; line++) {
			let lineContent = "";

			for (let char = 0; char < CHARS_PER_LINE; char++) {
				// 高品質疑似ランダム生成器を使用
				const randomIndex = Math.floor(this._xorshift128() * allChars.length);
				lineContent += allChars[randomIndex];
			}

			result += lineContent;

			// 最後の行以外は改行を追加
			if (line < TOTAL_LINES - 1) {
				result += "\n";
			}
		}

		return result;
	},

	generateEnglishWordsCode() {
		const CHARS_PER_LINE = 50;
		const TOTAL_LINES = 8;
		
		const selectedSet = this.getSelectedTypeWellEnglishWordsSet();
		
		if (typeof WORD_SETS === 'undefined') {
			console.error('WORD_SETS not found. Make sure words.js is loaded.');
			return "Error: Word data not available";
		}

		const words = WORD_SETS[selectedSet]?.words || WORD_SETS.top500?.words || [];
		this._seedXorshift128();

		const wordPool = this._createShuffledWordPool(words);
		const lines = this._generateWordLines(wordPool, CHARS_PER_LINE, TOTAL_LINES);
		
		return lines.join("\n");
	},

	_createShuffledWordPool(words) {
		const pool = [...words];
		for (let i = pool.length - 1; i > 0; i--) {
			const j = Math.floor(this._xorshift128() * (i + 1));
			[pool[i], pool[j]] = [pool[j], pool[i]];
		}
		return { words: pool, index: 0 };
	},

	_getNextWord(pool) {
		if (pool.index >= pool.words.length) {
			for (let i = pool.words.length - 1; i > 0; i--) {
				const j = Math.floor(this._xorshift128() * (i + 1));
				[pool.words[i], pool.words[j]] = [pool.words[j], pool.words[i]];
			}
			pool.index = 0;
		}
		return pool.words[pool.index++];
	},

	_generateWordLines(pool, charsPerLine, totalLines) {
		const lines = [];
		let remainder = "";
		let needsSpace = false;

		for (let lineIdx = 0; lineIdx < totalLines; lineIdx++) {
			const isLastLine = lineIdx === totalLines - 1;
			const lineResult = this._buildLine(pool, charsPerLine, isLastLine, remainder, needsSpace);
			
			lines.push(lineResult.content);
			remainder = lineResult.remainder;
			needsSpace = lineResult.needsSpace;
		}

		return lines;
	},

	_buildLine(pool, maxLength, isLastLine, remainder, needsSpace) {
		let content = "";
		let length = 0;

		if (needsSpace && length < maxLength) {
			content += " ";
			length++;
		}

		if (remainder) {
			const fitLength = Math.min(remainder.length, maxLength - length);
			content += remainder.substring(0, fitLength);
			length += fitLength;
			
			if (fitLength >= remainder.length) {
				remainder = "";
				if (length < maxLength) {
					content += " ";
					length++;
				}
			} else {
				remainder = remainder.substring(fitLength);
				return { content: content.substring(0, maxLength), remainder, needsSpace: false };
			}
		}

		while (length < maxLength && !remainder) {
			const word = this._getNextWord(pool);
			const wordWithSpace = word + " ";
			
			if (isLastLine) {
				const remaining = maxLength - length;
				if (wordWithSpace.length <= remaining) {
					content += wordWithSpace;
					length += wordWithSpace.length;
				} else {
					content += word.substring(0, remaining);
					length = maxLength;
				}
			} else {
				if (length + wordWithSpace.length <= maxLength) {
					content += wordWithSpace;
					length += wordWithSpace.length;
				} else {
					const remaining = maxLength - length;
					content += word.substring(0, remaining);
					remainder = word.substring(remaining);
					length = maxLength;
				}
			}
		}

		const lastChar = content[content.length - 1];
		needsSpace = !isLastLine && !remainder && lastChar && lastChar !== " ";

		return { content: content.substring(0, maxLength), remainder, needsSpace };
	},

	getSelectedDefaultMode() {
		return this._getCheckedRadioValue([
			["default-normal", "normal"],
			["default-typewell", "typewell"]
		], "normal");
	},

	_getCheckedRadioValue(radioIds, defaultValue) {
		if (typeof document === "undefined") {
			return defaultValue;
		}

		for (const [id, value] of radioIds) {
			const radio = document.getElementById(id);
			if (radio && radio.checked) return value;
		}

		return defaultValue;
	},

	getSelectedTypeWellMode() {
		return this._getCheckedRadioValue([
			["typewell-lowercase", "lowercase"],
			["typewell-mixed", "mixed"],
			["typewell-symbols", "symbols"],
			["typewell-numbers", "numbers"]
		], "lowercase");
	},

	getSelectedTypeWellEnglishWordsSet() {
		return this._getCheckedRadioValue([
			["typewell-english-words-top500", "top500"],
			["typewell-english-words-top1500", "top1500"],
			["typewell-english-words-all", "all"]
		], "top500");
	},

	getSelectedWordPracticeSet() {
		return this._getCheckedRadioValue([
			["word-practice-top500", "top500"],
			["word-practice-top1500", "top1500"],
			["word-practice-all", "all"]
		], "top500");
	},

	// Initial Speed用のランダム文字生成
	generateInitialSpeedChar(mode = "lowercase") {
		const characterSet = CONSTANTS.INITIAL_SPEED_SETTINGS.CHARACTER_SETS[mode];
		if (!characterSet) {
			console.warn(`Unknown Initial Speed mode: ${mode}`);
			return "a";
		}

		// 高品質疑似ランダム生成器を使用
		const randomIndex = Math.floor(this._xorshift128() * characterSet.length);
		return characterSet[randomIndex];
	},

	getSelectedInitialSpeedMode() {
		const modes = CONSTANTS.INITIAL_SPEED_SETTINGS.MODES;
		return this._getCheckedRadioValue([
			["initial-speed-lowercase", modes.LOWERCASE],
			["initial-speed-numbers", modes.NUMBERS],
			["initial-speed-lefthand", modes.LEFT_HAND],
			["initial-speed-righthand", modes.RIGHT_HAND],
			["initial-speed-hand-primitive", modes.HAND_PRIMITIVE]
		], modes.LOWERCASE);
	},

	// Initial Speedモード名を表示用文字列に変換
	getInitialSpeedModeDisplayName(mode) {
		switch (mode) {
			case CONSTANTS.INITIAL_SPEED_SETTINGS.MODES.LOWERCASE:
				return "Lowercase + Punctuation";
			case CONSTANTS.INITIAL_SPEED_SETTINGS.MODES.NUMBERS:
				return "Numbers Only";
			case CONSTANTS.INITIAL_SPEED_SETTINGS.MODES.LEFT_HAND:
				return "Left Hand";
			case CONSTANTS.INITIAL_SPEED_SETTINGS.MODES.RIGHT_HAND:
				return "Right Hand";
			case CONSTANTS.INITIAL_SPEED_SETTINGS.MODES.HAND_PRIMITIVE:
				return "Hand Primitive";
			default:
				return "Unknown Mode";
		}
	},

	// 選択されたInitial Speed試行回数を取得
	getSelectedInitialSpeedTrials() {
		if (typeof document === "undefined" || !DOM.initialSpeedTrialsSelect) {
			return CONSTANTS.INITIAL_SPEED_SETTINGS.DEFAULT_TRIALS;
		}

		const value = parseInt(DOM.initialSpeedTrialsSelect.value, 10);
		if (
			isNaN(value) ||
			value < CONSTANTS.INITIAL_SPEED_SETTINGS.MIN_TRIALS ||
			value > CONSTANTS.INITIAL_SPEED_SETTINGS.MAX_TRIALS
		) {
			return CONSTANTS.INITIAL_SPEED_SETTINGS.DEFAULT_TRIALS;
		}

		return value;
	},

	// Initial Speed統計計算
	calculateInitialSpeedStats(results) {
		if (!results || results.length === 0) {
			return {
				averageTime: 0,
				bestTime: 0,
				worstTime: 0,
				accuracy: 100,
				totalMistakes: 0,
			};
		}

		// 全結果から正解と不正解を分離
		const correctResults = results.filter((r) => r.correct);
		const incorrectResults = results.filter((r) => !r.correct);
		const totalMistakes = incorrectResults.length;

		// 正解がない場合
		if (correctResults.length === 0) {
			return {
				averageTime: 0,
				bestTime: 0,
				worstTime: 0,
				accuracy: 0,
				totalMistakes: totalMistakes,
			};
		}

		// 正解した試行の時間統計
		const correctTimes = correctResults.map((r) => r.time);
		const averageTime =
			correctTimes.reduce((sum, time) => sum + time, 0) / correctTimes.length;
		const bestTime = Math.min(...correctTimes);
		const worstTime = Math.max(...correctTimes);

		// 最初からミスらなかった文字数をカウント（各試行で最初の入力が正解だった数）
		const totalTrials = Math.max(...results.map((r) => r.trial));
		let firstTryCorrectCount = 0;

		// 各試行について、最初の入力が正解だったかを判定
		for (let trial = 1; trial <= totalTrials; trial++) {
			const trialResults = results.filter((r) => r.trial === trial);
			if (trialResults.length > 0) {
				// 時間順にソートして最初の結果を取得
				const firstResult = trialResults.sort((a, b) => a.time - b.time)[0];
				if (firstResult.correct) {
					firstTryCorrectCount++;
				}
			}
		}

		const accuracy = Math.round((firstTryCorrectCount / totalTrials) * 100);

		return {
			averageTime: Math.round(averageTime),
			bestTime: bestTime,
			worstTime: worstTime,
			accuracy: accuracy,
			totalMistakes: totalMistakes,
		};
	},

	// Initial Speedミス統計用のキー生成
	generateMistakeKey(expectedChar, inputChar) {
		// 特殊文字の表示名変換
		const getDisplayChar = (char) => {
			if (char === " ") return "Space";
			if (char === "\n") return "Enter";
			if (char === "\t") return "Tab";
			return char;
		};

		return `${getDisplayChar(expectedChar)}->${getDisplayChar(inputChar)}`;
	},
};
