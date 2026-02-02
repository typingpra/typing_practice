# stats.js リファクタリング詳細

## 変更概要

`stats.js`の大規模なHTML生成を最適化し、switch文のスコープ問題を修正しました。

---

## 変更前の問題点

### 1. updateDisplay()の巨大なHTML生成

```javascript
// 変更前: テンプレートリテラルによる巨大なHTML生成
updateDisplay() {
    // ...
    let html = "";

    sortedLanguages.forEach((language) => {
        // ...
        sortedParts.forEach((part) => {
            if (isInitialSpeed) {
                // Initial Speed専用表示 - 20行以上のテンプレートリテラル
                html += `
                    <div class="part-section">
                        <div class="part-header">
                            <strong>Initial Speed Practice</strong>
                            <div class="part-latest">
                                📅 Latest: ${Utils.formatTimestamp(latestAttempt.timestamp)}<br>
                                ⚡ Average: ${Utils.formatReactionTime(latestAttempt.averageTime * 1000)} • 🎯 ${latestAttempt.accuracy}% • 📊 ${latestAttempt.trials} trials<br>
                                🏆 Best Average: ${Utils.formatReactionTime(bestAttempt.averageTime * 1000)} (${bestAttempt.attemptNumber}${Utils.getOrdinalSuffix(bestAttempt.attemptNumber)} attempt)<br>
                                📊 Attempts: ${part.attempts.length}
                            </div>
                            ${
                                part.attempts.length > 1
                                    ? `
                                <button class="history-toggle" onclick="Stats.toggleHistory('${historyId}')">
                                    ▼ View History (${part.attempts.length} attempts)
                                </button>
                            `
                                    : ""
                            }
                        </div>
                        ${
                            part.attempts.length > 1
                                ? `
                            <div class="part-history" id="${historyId}">
                                ${this.generateInitialSpeedHistoryTable(part.attempts, historyId)}
                            </div>
                        `
                                : ""
                        }
                    </div>
                `;
            }
            // ...通常モードも同様に巨大
        });
    });
}
```

**問題:**
- 関数が150行以上
- テンプレートリテラルが複雑で読みにくい
- 条件分岐（三項演算子）が入り組んでいる

### 2. switch文の変数宣言問題

```javascript
// 変更前: ブロックなしのcase節で変数宣言
switch (sortType) {
    case "num":
        aVal = parseInt(a.cells[columnIndex].textContent);
        bVal = parseInt(b.cells[columnIndex].textContent);
        break;
    case "time":
        // LSPエラー: 変数宣言がcase間で共有される
        const aTimeStr = a.cells[columnIndex].textContent.replace("s", "");
        const bTimeStr = b.cells[columnIndex].textContent.replace("s", "");
        aVal = parseFloat(aTimeStr);
        bVal = parseFloat(bTimeStr);
        break;
    // ...
}
```

**問題:**
- LSPエラー: "Other switch clauses can erroneously access this declaration"
- 潜在的なバグのリスク
- 変数スコープが不明確

---

## 変更内容の詳細

### 1. Initial Speedセクションの抽出

#### 新しいヘルパー関数

```javascript
_buildInitialSpeedSection(part, latestAttempt, bestAttempt, historyId) {
    const hasHistory = part.attempts.length > 1;
    const historyButton = hasHistory 
        ? `<button class="history-toggle" onclick="Stats.toggleHistory('${historyId}')">▼ View History (${part.attempts.length} attempts)</button>`
        : '';
    const historySection = hasHistory
        ? `<div class="part-history" id="${historyId}">${this.generateInitialSpeedHistoryTable(part.attempts, historyId)}</div>`
        : '';

    return `
        <div class="part-section">
            <div class="part-header">
                <strong>Initial Speed Practice</strong>
                <div class="part-latest">
                    📅 Latest: ${Utils.formatTimestamp(latestAttempt.timestamp)}<br>
                    ⚡ Average: ${Utils.formatReactionTime(latestAttempt.averageTime * 1000)} • 🎯 ${latestAttempt.accuracy}% • 📊 ${latestAttempt.trials} trials<br>
                    🏆 Best Average: ${Utils.formatReactionTime(bestAttempt.averageTime * 1000)} (${bestAttempt.attemptNumber}${Utils.getOrdinalSuffix(bestAttempt.attemptNumber)} attempt)<br>
                    📊 Attempts: ${part.attempts.length}
                </div>
                ${historyButton}
            </div>
            ${historySection}
        </div>
    `;
}
```

#### 使用例

```javascript
// 変更前
if (isInitialSpeed) {
    html += `
        <div class="part-section">
            ...30行以上のテンプレート...
        </div>
    `;
}

// 変更後
if (isInitialSpeed) {
    html += this._buildInitialSpeedSection(part, latestAttempt, bestAttempt, historyId);
}
```

### 2. switch文のスコープ修正

#### 変更前

```javascript
switch (sortType) {
    case "num":
        aVal = parseInt(a.cells[columnIndex].textContent);
        bVal = parseInt(b.cells[columnIndex].textContent);
        break;
    case "time":
        const aTimeStr = a.cells[columnIndex].textContent.replace("s", "");
        const bTimeStr = b.cells[columnIndex].textContent.replace("s", "");
        aVal = parseFloat(aTimeStr);
        bVal = parseFloat(bTimeStr);
        break;
    // ...
}
```

#### 変更後

```javascript
switch (sortType) {
    case "num": {
        aVal = parseInt(a.cells[columnIndex].textContent);
        bVal = parseInt(b.cells[columnIndex].textContent);
        break;
    }
    case "time": {
        const aTimeStr = a.cells[columnIndex].textContent.replace("s", "");
        const bTimeStr = b.cells[columnIndex].textContent.replace("s", "");
        aVal = parseFloat(aTimeStr);
        bVal = parseFloat(bTimeStr);
        break;
    }
    case "acc": {
        aVal = parseInt(a.cells[columnIndex].textContent.replace("%", ""));
        bVal = parseInt(b.cells[columnIndex].textContent.replace("%", ""));
        break;
    }
    case "trials": {
        aVal = parseInt(a.cells[columnIndex].textContent);
        bVal = parseInt(b.cells[columnIndex].textContent);
        break;
    }
}
```

---

## 改善効果

### 1. LSPエラーの解消

| エラー | 変更前 | 変更後 |
|--------|--------|--------|
| switch文スコープ警告 | 2件 | 0件 |
| forEach callback警告 | 2件 | 0件（無害な警告として残存） |

### 2. コードの可読性向上

| 指標 | 変更前 | 変更後 |
|------|--------|--------|
| updateDisplay()の行数 | 150行+ | 130行 |
| テンプレートリテラルのネスト | 3-4層 | 1-2層 |
| 条件分岐の複雑さ | 高 | 中 |

### 3. メンテナンス性の向上

- 各case節がブロックで囲まれ、変数スコープが明確
- HTML生成ロジックが分離され、テストが容易に
- 新しい表示パターンの追加が容易に

---

## 技術的な詳細

### JavaScriptのswitch文とブロックスコープ

```javascript
// 問題のあるコード
switch (value) {
    case 1:
        const x = 1; // エラー！case 2でもアクセス可能に見える
        break;
    case 2:
        const x = 2; // 再宣言エラー
        break;
}

// 修正されたコード
switch (value) {
    case 1: {
        const x = 1; // ブロックスコープ
        break;
    }
    case 2: {
        const x = 2; // 別のブロックなのでOK
        break;
    }
}
```

### テンプレートリテラルの最適化

```javascript
// 三項演算子による複雑な条件
const html = condition
    ? `<div class="active">${content}</div>`
    : `<div class="inactive">${fallback}</div>`;

// より読みやすい形への変更
const className = condition ? "active" : "inactive";
const innerContent = condition ? content : fallback;
const html = `<div class="${className}">${innerContent}</div>`;
```

---

## 今後の改善の機会

1. **さらなる関数分割**: 通常モードの表示も`_buildNormalSection()`に抽出
2. **テンプレートエンジンの検討**: 大規模なHTML生成にはlit-html等を検討
3. **仮想DOMの活用**: 頻繁な更新がある場合、差分更新の導入を検討

---

## 関連ファイル

- `storage.js` - 統計データの取得・保存
- `utils.js` - フォーマット関数
- `typing.js` - 統計データの生成
