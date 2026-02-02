// theme.js - テーマ関連の機能

const Theme = {
	// 元の値を保存するためのプロパティ
	originalTypewellCountdown: null,

	// テーマの初期化
	initialize() {
		const savedTheme = Storage.getTheme();
		if (savedTheme === "light") {
			this.setLight();
		} else {
			this.setDark();
		}

		// テキストラップ設定の初期化
		const savedTextWrap = Storage.getTextWrap();
		if (savedTextWrap) {
			this.enableTextWrap();
		} else {
			this.disableTextWrap();
		}

		// 休憩設定の初期化
		this.initializeBreakSettings();
	},

	// ダークモードの設定
	setDark() {
		APP_STATE.isDarkMode = true;
		document.body.removeAttribute("data-theme");
		DOM.themeToggleBtn.classList.remove("active");
		DOM.darkLabel.classList.add("active");
		DOM.lightLabel.classList.remove("active");
		Storage.saveTheme(null); // ダークモードの場合は削除
	},

	// ライトモードの設定
	setLight() {
		APP_STATE.isDarkMode = false;
		document.body.setAttribute("data-theme", "light");
		DOM.themeToggleBtn.classList.add("active");
		DOM.darkLabel.classList.remove("active");
		DOM.lightLabel.classList.add("active");
		Storage.saveTheme("light");
	},

	// テーマの切り替え
	toggle() {
		if (APP_STATE.isDarkMode) {
			this.setLight();
		} else {
			this.setDark();
		}
	},

	// テキストラップの有効化
	enableTextWrap() {
		APP_STATE.isTextWrapEnabled = true;
		DOM.textWrapToggleBtn.classList.add("active");
		DOM.wrapDisabledLabel.classList.remove("active");
		DOM.wrapEnabledLabel.classList.add("active");
		Storage.saveTextWrap(true);

		// ページを再レンダリングして構造を更新
		this.updateTextWrapDisplay();
	},

	// テキストラップの無効化
	disableTextWrap() {
		APP_STATE.isTextWrapEnabled = false;
		DOM.textWrapToggleBtn.classList.remove("active");
		DOM.wrapDisabledLabel.classList.add("active");
		DOM.wrapEnabledLabel.classList.remove("active");
		Storage.saveTextWrap(false);

		// ページを再レンダリングして構造を更新
		this.updateTextWrapDisplay();
	},

	// テキストラップの切り替え
	toggleTextWrap() {
		if (APP_STATE.isTextWrapEnabled) {
			this.disableTextWrap();
		} else {
			this.enableTextWrap();
		}
	},

	// テキストラップ表示の更新
	updateTextWrapDisplay() {
		// ページが初期化されているかチェック
		if (!APP_STATE.pages || APP_STATE.pages.length === 0) {
			console.warn("Pages not initialized yet, skipping text wrap update");
			return;
		}

		// Initial Speedモードでは何もしない
		if (Typing.isInitialSpeedMode()) {
			return;
		}

		// ページを再レンダリングして構造を完全に更新
		if (typeof Typing !== "undefined" && Typing.renderPage) {
			Typing.renderPage();
		}
	},

	// 休憩設定の初期化
	initializeBreakSettings() {
		const savedBreakChars = Storage.getBreakChars();
		if (DOM.breakCharsInput) {
			DOM.breakCharsInput.value = savedBreakChars;
		}
	},

	// タイプウェルカウントダウン設定の初期化
	initializeTypewellCountdown() {
		// 保存された値を取得（デフォルト値は定数から）
		const savedCountdown = Storage.getTypewellCountdown();

		// DOM要素が存在する場合のみ値を設定
		if (DOM.typewellCountdownInput) {
			DOM.typewellCountdownInput.value = savedCountdown;
			// 元の値として保存（確実に数値を保存）
			this.originalTypewellCountdown = savedCountdown;
			// ボーダー色をリセット
			DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
		}
	},

	// 休憩設定の保存
	saveBreakSettings() {
		if (!DOM.breakCharsInput) return false;

		const value = parseInt(DOM.breakCharsInput.value, 10);
		const max = CONSTANTS.BREAK_SETTINGS.MAX_CHARS;

		if (isNaN(value)) {
			alert("Please enter a valid number.");
			DOM.breakCharsInput.value = Storage.getBreakChars();
			return false;
		}

		if (value < 0) {
			alert("Value cannot be negative. Use 0 to disable breaks.");
			DOM.breakCharsInput.value = 0;
			return false;
		}

		if (value > max) {
			alert(`Maximum value is ${max} characters.`);
			DOM.breakCharsInput.value = max;
			return false;
		}

		const success = Storage.saveBreakChars(value);
		if (!success) alert("Failed to save break settings.");
		return success;
	},

	handleBreakCharsChange() {
		if (!DOM.breakCharsInput) return;

		const value = parseInt(DOM.breakCharsInput.value, 10);
		const isInvalid = isNaN(value) || 
			value < 0 || 
			value > CONSTANTS.BREAK_SETTINGS.MAX_CHARS;

		DOM.breakCharsInput.style.borderColor = isInvalid 
			? "var(--incorrect-color)" 
			: "var(--border-color)";
	},

	handleTypewellCountdownChange() {
		if (!DOM.typewellCountdownInput) return;

		const inputValue = DOM.typewellCountdownInput.value.trim();
		if (inputValue === "") {
			DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
			return;
		}

		const value = parseInt(inputValue, 10);
		const settings = CONSTANTS.TYPEWELL_SETTINGS;
		const isInvalid = isNaN(value) || 
			inputValue !== value.toString() ||
			value < settings.MIN_COUNTDOWN || 
			value > settings.MAX_COUNTDOWN;

		DOM.typewellCountdownInput.style.borderColor = isInvalid 
			? "var(--incorrect-color)" 
			: "var(--border-color)";
	},

	validateTypewellCountdownInput() {
		if (!DOM.typewellCountdownInput) return;

		const inputValue = DOM.typewellCountdownInput.value.trim();
		const value = parseInt(inputValue, 10);

		const isInvalid = inputValue === "" ||
			isNaN(value) ||
			inputValue !== value.toString() ||
			value < CONSTANTS.TYPEWELL_SETTINGS.MIN_COUNTDOWN ||
			value > CONSTANTS.TYPEWELL_SETTINGS.MAX_COUNTDOWN;

		DOM.typewellCountdownInput.style.borderColor = isInvalid 
			? "var(--incorrect-color)" 
			: "var(--border-color)";
	},

	// 設定パネルの表示
	openSettings() {
		// 設定パネルを開く前にTypeWellカウントダウン設定を初期化
		this.initializeTypewellCountdown();

		// 既存の処理（設定パネル表示）
		DOM.settingsPanel.style.display = "flex";
	},

	// 設定パネルの非表示
	closeSettings() {
		// 休憩設定を検証・保存
		if (DOM.breakCharsInput) {
			this.saveBreakSettings();
		}

		// タイプウェルカウントダウン設定を検証・保存
		// 確実に実行されるよう独立して処理
		this.saveTypewellCountdown();

		// 設定パネルを閉じる
		DOM.settingsPanel.style.display = "none";
	},

	saveTypewellCountdown() {
		if (!DOM.typewellCountdownInput) return true;

		const inputValue = DOM.typewellCountdownInput.value.trim();
		const settings = CONSTANTS.TYPEWELL_SETTINGS;

		if (inputValue === "") {
			return this._restoreAndSaveCountdown(settings.DEFAULT_COUNTDOWN);
		}

		const value = parseInt(inputValue, 10);
		const isValid = /^\d+$/.test(inputValue) && 
			value >= settings.MIN_COUNTDOWN && 
			value <= settings.MAX_COUNTDOWN;

		if (!isValid) {
			this._showCountdownError();
			return this._restoreCountdownValue();
		}

		return this._saveCountdownValue(value);
	},

	_restoreAndSaveCountdown(value) {
		DOM.typewellCountdownInput.value = value;
		this.originalTypewellCountdown = value;
		DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
		return Storage.saveTypewellCountdown(value);
	},

	_showCountdownError() {
		const settings = CONSTANTS.TYPEWELL_SETTINGS;
		const message = `Invalid input for TypeWell Countdown.\n\nPlease enter a whole number between ${settings.MIN_COUNTDOWN} and ${settings.MAX_COUNTDOWN} seconds.\n\nThe setting has been reset to the previous value.`;
		alert(message);
	},

	_restoreCountdownValue() {
		const restoreValue = this.originalTypewellCountdown ?? CONSTANTS.TYPEWELL_SETTINGS.DEFAULT_COUNTDOWN;
		DOM.typewellCountdownInput.value = restoreValue;
		DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
		return false;
	},

	_saveCountdownValue(value) {
		const success = Storage.saveTypewellCountdown(value);
		if (success) {
			this.originalTypewellCountdown = value;
			DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
			return true;
		}
		
		alert("Failed to save TypeWell Countdown settings.\n\nThe value has been reset to the previous setting.");
		return this._restoreCountdownValue();
	},
};
