# BuryObject&lt;T&gt;

`BuryObject<T>` ラッパーは、JavaScript プレーンオブジェクトに対する Ruby 風のプロパティ走査・抽出メソッドを提供します。

---

## Callable Getter

### `.keys`
オブジェクト自身の列挙可能なプロパティ名の配列を `BuryArray<string>` でラップして返します。

```typescript
const obj = { a: 1, b: 2, c: 3 };

// プロパティアクセス
bury(obj).keys.sort.value; // ['a', 'b', 'c']

// 関数呼び出し
bury(obj).keys().sort().value; // ['a', 'b', 'c']
```

---

## 通常のゲッター

### `.values: BuryArray<T[keyof T]>`
オブジェクト自身の列挙可能なプロパティ値の配列を `BuryArray` でラップして返します。これにより、そのまま `.sum` や `.compact`、`.where` などの配列メソッドをチェーンできます。

```typescript
const scores = { math: 90, english: 85, science: 95 };

const total = bury(scores)
  .values
  .sum
  .value; // 270
```

### `.entries: BuryArray<[string, T[keyof T]]>`
オブジェクト自身の `[key, value]` のペアの配列を `BuryArray` でラップして返します。

```typescript
const data = { x: 10, y: 20 };

const pairs = bury(data)
  .entries
  .value; // [['x', 10], ['y', 20]]
```
