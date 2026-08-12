# クックブック・実践例集

日常の開発で役立つ `bury2` の実践的なコードレシピ集です。

---

## 1. ユーザー入力・CSVデータの整形

前後の空白除去、null/undefined の除去、重複排除をスマートに実行します:

```typescript
import { bury } from 'bury2';

const rawInputs = ['  Alice  ', 'bob', null, '  ALICE  ', 'bob ', undefined, ' Charlie '];

const cleaned = bury(rawInputs)
  .compact                      // null / undefined を除去
  .map(s => s.toLowerCase())    // 小文字化
  .trim                         // 各文字列の空白をトリム
  .uniq                         // 重複排除
  .sort                         // アルファベット順ソート
  .value;

console.log(cleaned); // ['alice', 'bob', 'charlie']
```

---

## 2. オブジェクトデータの集計・統計

オブジェクトの値を配列として扱い、合計値や最大最小値を手軽に算出します:

```typescript
import { bury } from 'bury2';

const inventory = {
  apples: 120,
  bananas: 80,
  oranges: 45,
  strawberries: 200,
};

// 合計数量を計算
const totalCount = bury(inventory)
  .values       // BuryArray<number>
  .sum          // Bury<number>
  .value;       // 445

// 最小値と最大値のタプルを取得
const [minStock, maxStock] = bury(inventory)
  .values
  .minmax
  .value; // [45, 200]
```

---

## 3. 条件絞り込みと最大・最小要素の抽出

`where` で条件を満たす要素を絞り込み、`max_by` / `min_by` で特定スコアの最上位を取得します:

```typescript
import { bury } from 'bury2';

const users = [
  { name: 'Diana', score: 94, active: true },
  { name: 'Bruce', score: 88, active: false },
  { name: 'Clark', score: 99, active: true },
  { name: 'Barry', score: 91, active: true },
];

// アクティブユーザーの中で最高スコアのユーザーを取得
const topActiveUser = bury(users)
  .where(u => u.active)
  .max_by(u => u.score)
  .value;

console.log(topActiveUser); // { name: 'Clark', score: 99, active: true }
```

---

## 4. URL スラッグの生成

文字列の空白除去、小文字化、正規表現置換を組み合わせて URL スラッグを生成します:

```typescript
import { bury } from 'bury2';

function generateSlug(text: string): string {
  return bury(text)
    .trim
    .downcase
    .gsub(/[^a-z0-9]+/g, '-')
    .value;
}

console.log(generateSlug('  Hello World! Ruby & TypeScript 2026 '));
// "hello-world-ruby-typescript-2026"
```

---

## 5. 数値の範囲制限と文字列フォーマット

数値を丸めて範囲内に制限し、文字列化してプレフィックスを付与します:

```typescript
import { bury } from 'bury2';

const rawScore = 155.7;

const display = bury(rawScore)
  .floor
  .clamp(0, 100)
  .to_s
  .prepend('Score: ')
  .value;

console.log(display); // "Score: 100"
```
