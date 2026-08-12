# BuryArray&lt;T&gt;

`BuryArray<T>` ラッパーは、配列操作のための Ruby 風 Enumerable メソッドを提供します。すべてのメソッドは**非破壊的（イミュータブル）**であり、新しいラッパーインスタンスを返します。

---

## Callable Getter

プロパティアクセス（`.prop`）と関数呼び出し（`.prop()`）のどちらの記法でも利用可能です。

### `.compact`
`null` および `undefined` の要素を除去します。戻り値の型は `BuryArray<NonNullable<T>>` に自動的に絞り込まれます。

```typescript
bury([1, null, 2, undefined, 3]).compact.value; // [1, 2, 3]
bury([1, null, 2, undefined, 3]).compact().value; // [1, 2, 3]
```

### `.uniq`
最初の出現順を維持したまま、重複する要素を取り除きます（`Object.is` による等価判定）。

```typescript
bury([1, 2, 2, 3, 1]).uniq.value; // [1, 2, 3]
```

### `.trim`
配列内の文字列要素の前後の空白を除去します。文字列以外の要素は変更されません。

```typescript
bury(['  a  ', ' b ']).trim.value; // ['a', 'b']
```

### `.rev`
要素の並び順を反転させた新しい配列を返します。

```typescript
bury([1, 2, 3]).rev.value; // [3, 2, 1]
```

### `.sort([comparator])`
デフォルトでは昇順ソートを行います。引数として任意の比較関数 `(a: T, b: T) => number` を渡すことも可能です。

```typescript
bury([3, 1, 2]).sort.value; // [1, 2, 3]
bury([3, 1, 2]).sort((a, b) => b - a).value; // [3, 2, 1]
```

---

## 通常のゲッター

### `.first: Bury<T | undefined>`
配列の先頭要素をラップして返します。空配列の場合は `undefined` をラップします。

```typescript
bury(['apple', 'banana']).first.value; // 'apple'
bury([]).first.value; // undefined
```

### `.last: Bury<T | undefined>`
配列の末尾要素をラップして返します。空配列の場合は `undefined` をラップします。

```typescript
bury(['apple', 'banana']).last.value; // 'banana'
```

### `.min: Bury<number | undefined>`
数値配列内の最小値をラップして返します。空配列の場合は `undefined` をラップします。

```typescript
bury([10, 5, 20]).min.value; // 5
```

### `.max: Bury<number | undefined>`
数値配列内の最大値をラップして返します。空配列の場合は `undefined` をラップします。

```typescript
bury([10, 5, 20]).max.value; // 20
```

### `.sum: Bury<number | undefined>`
数値要素の合計値をラップして返します。空配列の場合は `undefined` をラップします。

```typescript
bury([1, 2, 3, 4]).sum.value; // 10
```

### `.size: Bury<number>`
配列の要素数をラップして返します。

```typescript
bury(['a', 'b', 'c']).size.value; // 3
```

### `.minmax: Bury<[T, T] | [undefined, undefined]>`
`[最小値, 最大値]` のタプルをラップして返します。空配列の場合は `[undefined, undefined]` をラップします。

```typescript
bury([5, 1, 9, 3]).minmax.value; // [1, 9]
```

---

## メソッド

### `.map<U>(fn: (el: T) => U): BuryArray<U>`
各要素に `fn` を適用した新しい配列を返します。

```typescript
bury([1, 2, 3]).map(x => x * 2).value; // [2, 4, 6]
```

### `.where(fn: (el: T) => boolean): BuryArray<T>`
`fn` が `true` を返した要素のみを抽出した新しい配列を返します。

```typescript
bury([1, 2, 3, 4, 5]).where(x => x % 2 === 0).value; // [2, 4]
```

### `.pluck<K extends keyof T>(key: K): BuryArray<T[K]>`
各オブジェクト要素から指定されたプロパティ `key` の値を抽出した配列を返します。

```typescript
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
bury(users).pluck('name').value; // ['Alice', 'Bob']
```

### `.min_by(fn: (el: T) => number): Bury<T | undefined>`
`fn` の評価値が最も小さくなる要素をラップして返します。

```typescript
const items = [{ name: 'A', price: 50 }, { name: 'B', price: 20 }];
bury(items).min_by(i => i.price).value; // { name: 'B', price: 20 }
```

### `.max_by(fn: (el: T) => number): Bury<T | undefined>`
`fn` の評価値が最も大きくなる要素をラップして返します。

```typescript
const items = [{ name: 'A', price: 50 }, { name: 'B', price: 20 }];
bury(items).max_by(i => i.price).value; // { name: 'A', price: 50 }
```

### `.append(...elements: T[]): BuryArray<T>`
配列の末尾に要素を追加した新しい配列を返します。

```typescript
bury([1, 2]).append(3, 4).value; // [1, 2, 3, 4]
```

### `.prepend(...elements: T[]): BuryArray<T>`
配列の先頭に要素を追加した新しい配列を返します。

```typescript
bury([3, 4]).prepend(1, 2).value; // [1, 2, 3, 4]
```

### `.union(other: T[]): BuryArray<T>`
自身と引数の配列を結合し、重複を除いた一意な要素の配列を返します。

```typescript
bury([1, 2, 3]).union([3, 4, 5]).value; // [1, 2, 3, 4, 5]
```
