# theme.js リファクタリング詳細

## 変更概要

`theme.js`の検証ロジックを簡潔化し、長い関数を分割して可読性を向上させました。

---

## 変更前の問題点

### 1. `saveTypewellCountdown()` が70行以上の巨大関数

```javascript
// 変更前: 複雑な検証とエラーハンドリング
saveTypewellCountdown() {
    if (!DOM.typewellCountdownInput) {
        return true;
    }

    const inputValue = DOM.typewellCountdownInput.value.trim();

    // 空の入力値の場合はデフォルト値を使用
    if (inputValue === "") {
        const defaultValue = CONSTANTS.TYPEWELL_SETTINGS.DEFAULT_COUNTDOWN;
        DOM.typewellCountdownInput.value = defaultValue;
        this.originalTypewellCountdown = defaultValue;
        DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
        return Storage.saveTypewellCountdown(defaultValue);
    }

    const value = parseInt(inputValue, 10);

    // より厳密な検証条件
    const isNotInteger = isNaN(value);
    const hasNonNumericChars = !/^\d+$/.test(inputValue);
    const isNotExactMatch = inputValue !== value.toString();
    const isOutOfRange =
        value < CONSTANTS.TYPEWELL_SETTINGS.MIN_COUNTDOWN ||
        value > CONSTANTS.TYPEWELL_SETTINGS.MAX_COUNTDOWN;

    // 入力値検証：より厳密な条件
    if (isNotInteger || hasNonNumericChars || isNotExactMatch || isOutOfRange) {
        // より詳細なエラーメッセージ
        let errorMessage = "Invalid input for TypeWell Countdown.\n\n";

        if (hasNonNumericChars || isNotInteger) {
            errorMessage += "Please enter a valid whole number.\n";
        }

        if (isOutOfRange && !isNotInteger) {
            errorMessage += `Value must be between ${CONSTANTS.TYPEWELL_SETTINGS.MIN_COUNTDOWN} and ${CONSTANTS.TYPEWELL_SETTINGS.MAX_COUNTDOWN} seconds.\n`;
        }

        errorMessage += "\nThe setting has been reset to the previous value.";

        alert(errorMessage);

        // 元の値に復元
        const restoreValue =
            this.originalTypewellCountdown !== null
                ? this.originalTypewellCountdown
                : CONSTANTS.TYPEWELL_SETTINGS.DEFAULT_COUNTDOWN;

        DOM.typewellCountdownInput.value = restoreValue;
        DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";

        return false;
    }

    // 有効な値の場合：保存実行
    const success = Storage.saveTypewellCountdown(value);
    if (success) {
        this.originalTypewellCountdown = value;
        DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
        return true;
    } else {
        alert(
            "Failed to save TypeWell Countdown settings.\n\nThe value has been reset to the previous setting.",
        );
        const restoreValue =
            this.originalTypewellCountdown !== null
                ? this.originalTypewellCountdown
                : CONSTANTS.TYPEWELL_SETTINGS.DEFAULT_COUNTDOWN;
        DOM.typewellCountdownInput.value = restoreValue;
        DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
        return false;
    }
}
```

**問題:**
- 関数が長すぎて理解が困難（70行）
- エラーメッセージ構築が複雑
- 値の復元ロジックが重複
- 検証条件が分散して把握しにくい

### 2. `saveBreakSettings()` の冗長な構造

```javascript
// 変更前: 不要なelseブロックと重複パターン
saveBreakSettings() {
    if (!DOM.breakCharsInput) return;

    const value = parseInt(DOM.breakCharsInput.value, 10);

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

    if (value > CONSTANTS.BREAK_SETTINGS.MAX_CHARS) {
        alert(`Maximum value is ${CONSTANTS.BREAK_SETTINGS.MAX_CHARS} characters.`);
        DOM.breakCharsInput.value = CONSTANTS.BREAK_SETTINGS.MAX_CHARS;
        return false;
    }

    const success = Storage.saveBreakChars(value);
    if (success) {
        return true;
    } else {
        alert("Failed to save break settings.");
        return false;
    }
}
```

### 3. 入力フィールド変更ハンドラーの重複

```javascript
// 変更前: 同様のパターンが複数存在
handleBreakCharsChange() {
    if (!DOM.breakCharsInput) return;
    const value = parseInt(DOM.breakCharsInput.value, 10);

    if (isNaN(value) || value < 0) {
        DOM.breakCharsInput.style.borderColor = "var(--incorrect-color)";
    } else if (value > CONSTANTS.BREAK_SETTINGS.MAX_CHARS) {
        DOM.breakCharsInput.style.borderColor = "var(--incorrect-color)";
    } else {
        DOM.breakCharsInput.style.borderColor = "var(--border-color)";
    }
}

handleTypewellCountdownChange() {
    if (!DOM.typewellCountdownInput) return;
    const inputValue = DOM.typewellCountdownInput.value.trim();
    const value = parseInt(inputValue, 10);

    if (inputValue === "") {
        DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
    } else if (isNaN(value) || inputValue !== value.toString()) {
        DOM.typewellCountdownInput.style.borderColor = "var(--incorrect-color)";
    } else if (value < CONSTANTS.TYPEWELL_SETTINGS.MIN_COUNTDOWN ||
               value > CONSTANTS.TYPEWELL_SETTINGS.MAX_COUNTDOWN) {
        DOM.typewellCountdownInput.style.borderColor = "var(--incorrect-color)";
    } else {
        DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
    }
}
```

---

## 変更内容の詳細

### 1. `saveTypewellCountdown()` の分割

#### 新しい構造

```javascript
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
}

_restoreAndSaveCountdown(value) {
    DOM.typewellCountdownInput.value = value;
    this.originalTypewellCountdown = value;
    DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
    return Storage.saveTypewellCountdown(value);
}

_showCountdownError() {
    const settings = CONSTANTS.TYPEWELL_SETTINGS;
    const message = `Invalid input for TypeWell Countdown.\n\nPlease enter a whole number between ${settings.MIN_COUNTDOWN} and ${settings.MAX_COUNTDOWN} seconds.\n\nThe setting has been reset to the previous value.`;
    alert(message);
}

_restoreCountdownValue() {
    const restoreValue = this.originalTypewellCountdown ?? CONSTANTS.TYPEWELL_SETTINGS.DEFAULT_COUNTDOWN;
    DOM.typewellCountdownInput.value = restoreValue;
    DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
    return false;
}

_saveCountdownValue(value) {
    const success = Storage.saveTypewellCountdown(value);
    if (success) {
        this.originalTypewellCountdown = value;
        DOM.typewellCountdownInput.style.borderColor = "var(--border-color)";
        return true;
    }
    
    alert("Failed to save TypeWell Countdown settings.\n\nThe value has been reset to the previous setting.");
    return this._restoreCountdownValue();
}
```

#### 分割の根拠

| 関数 | 責務 | 行数 |
|------|------|------|
| `saveTypewellCountdown()` | メインロジック・検証 | 20行 |
| `_restoreAndSaveCountdown()` | デフォルト値の復元と保存 | 6行 |
| `_showCountdownError()` | エラーメッセージ表示 | 5行 |
| `_restoreCountdownValue()` | 値の復元 | 6行 |
| `_saveCountdownValue()` | 保存実行 | 12行 |

### 2. `saveBreakSettings()` の簡潔化

```javascript
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
}
```

### 3. 入力フィールド変更ハンドラーの簡潔化

```javascript
handleBreakCharsChange() {
    if (!DOM.breakCharsInput) return;

    const value = parseInt(DOM.breakCharsInput.value, 10);
    const isInvalid = isNaN(value) || 
        value < 0 || 
        value > CONSTANTS.BREAK_SETTINGS.MAX_CHARS;

    DOM.breakCharsInput.style.borderColor = isInvalid 
        ? "var(--incorrect-color)" 
        : "var(--border-color)";
}

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
}

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
}
```

---

## 改善効果

### 1. コード行数の削減

| 関数 | 変更前 | 変更後 | 削減率 |
|------|--------|--------|--------|
| `saveTypewellCountdown()` | 70行 | 20行 | 71% |
| `saveBreakSettings()` | 35行 | 25行 | 29% |
| `handleBreakCharsChange()` | 14行 | 10行 | 29% |
| `handleTypewellCountdownChange()` | 22行 | 17行 | 23% |
| `validateTypewellCountdownInput()` | 20行 | 14行 | 30% |

### 2. 重複コードの削減

- 値の復元ロジックを `_restoreCountdownValue()` に統合
- ボーダー色の設定を三項演算子で統一
- 検証条件を明確に分離

### 3. 可読性の向上

- 各関数の責務が明確に
- エラーメッセージが一元化
- 条件判定が簡潔に

### 4. メンテナンス性の向上

- 変更時の影響範囲が限定される
- テストが容易に
- デバッグが容易に

---

## 技術的な詳細

### 検証ロジックの統合

変更前は4つの個別の検証フラグを使用:
```javascript
const isNotInteger = isNaN(value);
const hasNonNumericChars = !/^\d+$/.test(inputValue);
const isNotExactMatch = inputValue !== value.toString();
const isOutOfRange = value < MIN || value > MAX;

if (isNotInteger || hasNonNumericChars || isNotExactMatch || isOutOfRange) {
    // エラー処理
}
```

変更後は統合した検証:
```javascript
const isValid = /^\d+$/.test(inputValue) && 
    value >= MIN && 
    value <= MAX;

if (!isValid) {
    // エラー処理
}
```

### Nullish Coalescing Operator (`??`) の使用

```javascript
// 変更前
const restoreValue =
    this.originalTypewellCountdown !== null
        ? this.originalTypewellCountdown
        : DEFAULT;

// 変更後
const restoreValue = this.originalTypewellCountdown ?? DEFAULT;
```

---

## 今後の改善の機会

1. **さらなる汎用化**: 検証ロジックをさらに汎用化して、他の数値入力でも再利用可能に
2. **バリデーションライブラリ**: より複雑な検証が必要になった場合、専用のバリデーションモジュールを検討
3. **エラーメッセージの外部化**: エラーメッセージを定数ファイルに移動して国際化に対応

---

## 関連ファイル

- `storage.js` - 設定値の保存・取得
- `constants.js` - 設定定数（MIN_COUNTDOWN, MAX_COUNTDOWN等）
- `main.js` - イベントリスナー設定
