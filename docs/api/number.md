# BuryNumber

The `BuryNumber` wrapper provides Ruby-like numeric transformations, iterators, and rounding methods.

---

## Getters

### `.floor: BuryNumber`
Returns the largest integer less than or equal to the numeric value.

```typescript
bury(3.7).floor.value; // 3
```

### `.ceil: BuryNumber`
Returns the smallest integer greater than or equal to the numeric value.

```typescript
bury(3.2).ceil.value; // 4
```

### `.abs: BuryNumber`
Returns the absolute value.

```typescript
bury(-42).abs.value; // 42
```

### `.next: BuryNumber`
Returns `Math.floor(value) + 1`.

```typescript
bury(5).next.value;   // 6
bury(5.8).next.value; // 6
```

### `.succ: BuryNumber`
Alias for `.next`.

```typescript
bury(10).succ.value; // 11
```

### `.pred: BuryNumber`
Returns `Math.ceil(value) - 1`.

```typescript
bury(5).pred.value;   // 4
bury(5.2).pred.value; // 5
```

### `.to_s: BuryString`
Converts the number to its base-10 string representation wrapped in `BuryString`, allowing further string method chaining.

```typescript
bury(12345).to_s.reverse.value; // "54321"
```

---

## Methods

### `.times(fn: (i: number) => void): this`
Executes `fn(i)` for integer indices from `0` to `Math.floor(value) - 1`. If the floor is `<= 0`, `fn` is not executed. Returns `this` for chaining.

```typescript
const numbers: number[] = [];
bury(3).times(i => numbers.push(i));
console.log(numbers); // [0, 1, 2]
```

### `.clamp(min: number, max: number): BuryNumber`
Restricts the value within the range `[min, max]`. If `min > max`, returns `min`.

```typescript
bury(150).clamp(0, 100).value; // 100
bury(-50).clamp(0, 100).value; // 0
bury(42).clamp(0, 100).value;  // 42
```
