# BuryNumber

`BuryNumber` ラッパーは、数値の丸め、範囲制限（クランプ）、繰り返し処理、および文字列表現への変換メソッドを提供します。

---

## ゲッター

### `.floor: BuryNumber`
元の数値以下の最大の整数をラップして返します。

```typescript
bury(3.7).floor.value; // 3
```

### `.ceil: BuryNumber`
元の数値以上の最小の整数をラップして返します。

```typescript
bury(3.2).ceil.value; // 4
```

### `.abs: BuryNumber`
絶対値をラップして返します。

```typescript
bury(-42).abs.value; // 42
```

### `.next: BuryNumber`
`Math.floor(value) + 1` の値をラップして返します。

```typescript
bury(5).next.value;   // 6
bury(5.8).next.value; // 6
```

### `.succ: BuryNumber`
`.next` のエイリアスです。

```typescript
bury(10).succ.value; // 11
```

### `.pred: BuryNumber`
`Math.ceil(value) - 1` の値をラップして返します。

```typescript
bury(5).pred.value;   // 4
bury(5.2).pred.value; // 5
```

### `.to_s: BuryString`
数値を10進数表現の文字列に変換し、`BuryString` でラップして返します。これにより、そのまま文字列メソッドをチェーンできます。

```typescript
bury(12345).to_s.reverse.value; // "54321"
```

---

## メソッド

### `.times(fn: (i: number) => void): this`
`0` から `Math.floor(value) - 1` までの整数について `fn(i)` を実行します。`floor` が `<= 0` の場合、`fn` は実行されません。メソッドチェーン継続のために `this` を返します。

```typescript
const numbers: number[] = [];
bury(3).times(i => numbers.push(i));
console.log(numbers); // [0, 1, 2]
```

### `.clamp(min: number, max: number): BuryNumber`
数値を `[min, max]` の範囲内に収めます。`min > max` の場合は `min` を返します。

```typescript
bury(150).clamp(0, 100).value; // 100
bury(-50).clamp(0, 100).value; // 0
bury(42).clamp(0, 100).value;  // 42
```
