# ui.js リファクタリング詳細

## 変更概要

`ui.js`のHTML生成とオーバーレイ表示を最適化し、重複コードを削除しました。

---

## 変更前の問題点

### 1. 重複したメソッド定義

```javascript
// 2箇所に同じ名前のメソッドが定義されていた
// 478行目と1248行目に同名のshowWordPracticeResults()
// 527行目と1335行目に同名のgenerateWordPracticeDetailedResults()
```

**問題:**
- LSPエラー（"This method is later overwritten"）
- コードの混乱
- メンテナンス困難

### 2. オーバーレイ表示の重複

```javascript
// 変更前: 各オーバーレイ表示で同じパターンが繰り返し
showWordPracticeOverlay(correct, total) {
    // ...統計処理...
    
    if (DOM.wordPracticeResults) {
        DOM.wordPracticeResults.style.display = "block";
    }

    const statsListEls = document.querySelectorAll(".stats-list:not(.typewell-stats)");
    statsListEls.forEach(el => {
        el.style.display = "none";
    });

    const top3RankingEl = document.getElementById("top3-ranking");
    if (top3RankingEl) {
        top3RankingEl.style.display = "none";
    }

    this.updateOverlayButtons();

    // フェードイン効果
    if (DOM.overlay) {
        DOM.overlay.style.visibility = "visible";
        DOM.overlay.classList.remove("hide");
        setTimeout(() => {
            DOM.overlay.classList.add("show");
        }, 10);
    }
}
```

**問題:**
- 同じDOM操作パターンが複数の関数で繰り返し
- 変更時に複数箇所を修正する必要がある
- 一貫性の維持が困難

---

## 変更内容の詳細

### 1. 重複メソッドの削除

#### 削除された重複メソッド

```javascript
// 478-524行目と527-558行目の重複を削除
// 同名のメソッドが後で定義されているため、先に定義されていた方を削除

// showWordPracticeResults() - 後の定義を保持
// generateWordPracticeDetailedResults() - 後の定義を保持
```

### 2. オーバーレイ表示の共通化

#### 新しい構造

```javascript
// 専用オーバーレイ表示の共通処理
_showSpecializedOverlay(resultContainer) {
    if (resultContainer) {
        resultContainer.style.display = "block";
    }

    const statsListEls = document.querySelectorAll(".stats-list:not(.typewell-stats)");
    statsListEls.forEach(el => {
        el.style.display = "none";
    });

    const top3RankingEl = document.getElementById("top3-ranking");
    if (top3RankingEl) {
        top3RankingEl.style.display = "none";
    }

    this.updateOverlayButtons();
    this._fadeInOverlay();
}

// オーバーレイフェードイン
_fadeInOverlay() {
    if (DOM.overlay) {
        DOM.overlay.style.visibility = "visible";
        DOM.overlay.classList.remove("hide");
        setTimeout(() => {
            DOM.overlay.classList.add("show");
        }, 10);
    }
}
```

#### 使用例

```javascript
showWordPracticeOverlay(correct, total) {
    const stats = APP_STATE.wordPracticeStats;
    if (!stats) {
        console.error("Word Practice統計が見つかりません");
        return;
    }

    const selectedSet = Utils.getSelectedWordPracticeSet();
    const setNames = {
        'top500': 'Top 500 Words',
        'top1500': 'Top 1500 Words', 
        'all': 'All Words'
    };
    const languageName = `Word Practice (${setNames[selectedSet] || 'Top 500 Words'})`;

    Stats.saveResult(
        languageName,
        1,
        1,
        stats.averageWPM,
        stats.accuracy,
        stats.totalTime,
        stats.wordCount
    );

    this._showSpecializedOverlay(DOM.wordPracticeResults);
}
```

---

## 改善効果

### 1. LSPエラーの解消

| エラー | 変更前 | 変更後 |
|--------|--------|--------|
| メソッド上書き警告 | 2件 | 0件 |

### 2. コード重複の削減

| パターン | 変更前 | 変更後 |
|----------|--------|--------|
| オーバーレイ表示ロジック | 3箇所に分散 | 1つの関数に統合 |
| フェードイン効果 | 3箇所に分散 | 1つの関数に統合 |

### 3. 保守性の向上

- 変更が必要な場合、1箇所のみ修正すればよい
- 一貫性が保証される
- 新しいオーバーレイ追加時に再利用可能

---

## 技術的な詳細

### メソッド名の衝突回避

JavaScriptのオブジェクトリテラルでは、同じ名前のメソッドを複数定義すると、後に定義された方が有効になります：

```javascript
const obj = {
    method() { return 1; },  // 無効化される
    method() { return 2; }   // これが有効
};

obj.method(); // 2を返す
```

このリファクタリングでは、後に定義されている（より完全な）実装を保持し、先に定義されている不完全な実装を削除しました。

---

## 今後の改善の機会

1. **さらなる共通化**: `showTypeWellOverlay()`や`showInitialSpeedOverlay()`も共通関数を使用可能
2. **アニメーション設定の外部化**: フェードイン時間などを定数として抽出
3. **エラーハンドリングの強化**: DOM要素の存在確認をさらに厳密に

---

## 関連ファイル

- `typing.js` - オーバーレイ表示のトリガー
- `stats.js` - 統計データの保存
