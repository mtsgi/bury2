# v1 からの移行ガイド

旧バージョン `bury` (v1) から `bury2` への移行手順について解説します。

---

## なぜ bury2 に刷新されたのか？

旧版 `bury` (v1) は、グローバルプロトタイプを拡張する設計（例: `Array.prototype.uniq = ...`）でした。これは小規模なスクリプトでは手軽な反面、以下の重大な課題がありました:
- 他のサードパーティライブラリや将来の JavaScript 標準仕様との衝突リスク
- 大規模コードベースでの追跡困難なバグの誘発
- 厳格なエンタープライズ環境やセキュリティ監査との不適合

`bury2` は、**グローバルプロトタイプ汚染ゼロ**、**ラッパーベース設計**、**完全な TypeScript 型推論** を備えたモダンライブラリとしてゼロから再設計されました。

---

## 主な相違点

| 項目 | bury (v1) | bury2 |
|------|-----------|-------|
| **エントリポイント** | `import 'bury'` で自動適用 | 明示的ラッパー: `bury(value)` |
| **グローバル汚染** | ⚠️ あり (`Array.prototype` 等) | ✅ **完全ゼロ** |
| **アンラップ** | ネイティブ値が直接返る | `.value` または `.unwrap()` |
| **イミュータビリティ** | メソッドによりミューテートあり | ✅ **100% イミュータブル保証** |
| **TypeScript 型推論** | 限定的（グローバル型拡張） | ✅ **完全なジェネリクス推論** |
| **Callable Getter** | 非対応 | ✅ `.prop` と `.prop()` 両対応 |

---

## コード移行例

### 配列の操作

::: code-group

```typescript [v1 (旧)]
import 'bury';

// プロトタイプ拡張により直接呼び出し
const numbers = [1, 2, 2, 3, null];
const result = numbers.compact().uniq();
```

```typescript [v2 (bury2)]
import { bury } from 'bury2';

const numbers = [1, 2, 2, 3, null];
// bury() でラップし、最後に .value で取り出す
const result = bury(numbers)
  .compact
  .uniq
  .value;
```

:::

---

### 文字列の操作

::: code-group

```typescript [v1 (旧)]
import 'bury';

const str = '  hello world  ';
const upper = str.upcase().trim();
```

```typescript [v2 (bury2)]
import { bury } from 'bury2';

const str = '  hello world  ';
const upper = bury(str)
  .upcase
  .trim
  .value;
```

:::

---

## 移行チェックリスト

1. `import 'bury'` を `import { bury } from 'bury2'` に変更する。
2. チェーンの起点で対象の値を `bury(...)` でラップする。
3. チェーンの終端に `.value` または `.unwrap()` を追加して値を取り出す。
4. v1 用にプロジェクト内に存在していた `global.d.ts` などの型拡張記述を削除する。
