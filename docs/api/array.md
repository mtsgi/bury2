# BuryArray&lt;T&gt;

The `BuryArray<T>` wrapper provides Ruby-like Enumerable methods for array manipulation. All methods are **non-mutating** and return new wrapper instances.

---

## Callable Getters

These properties can be accessed as properties (`.prop`) or called as functions (`.prop()`).

### `.compact`
Removes `null` and `undefined` elements. The return type narrows to `BuryArray<NonNullable<T>>`.

```typescript
bury([1, null, 2, undefined, 3]).compact.value; // [1, 2, 3]
bury([1, null, 2, undefined, 3]).compact().value; // [1, 2, 3]
```

### `.uniq`
Removes duplicate elements while preserving the order of the first occurrence (using `Object.is` semantics).

```typescript
bury([1, 2, 2, 3, 1]).uniq.value; // [1, 2, 3]
```

### `.trim`
Trims leading and trailing whitespace on string elements within the array. Non-string elements remain unchanged.

```typescript
bury(['  a  ', ' b ']).trim.value; // ['a', 'b']
```

### `.rev`
Returns a new array with elements in reversed order.

```typescript
bury([1, 2, 3]).rev.value; // [3, 2, 1]
```

### `.sort([comparator])`
Sorts elements in ascending natural order by default, or accepts an optional custom comparator callback `(a: T, b: T) => number`.

```typescript
bury([3, 1, 2]).sort.value; // [1, 2, 3]
bury([3, 1, 2]).sort((a, b) => b - a).value; // [3, 2, 1]
```

---

## Standard Getters

### `.first: Bury<T | undefined>`
Wraps the first element of the array, or `undefined` if empty.

```typescript
bury(['apple', 'banana']).first.value; // 'apple'
bury([]).first.value; // undefined
```

### `.last: Bury<T | undefined>`
Wraps the last element of the array, or `undefined` if empty.

```typescript
bury(['apple', 'banana']).last.value; // 'banana'
```

### `.min: Bury<number | undefined>`
Wraps the minimum numeric value in the array, or `undefined` if empty.

```typescript
bury([10, 5, 20]).min.value; // 5
```

### `.max: Bury<number | undefined>`
Wraps the maximum numeric value in the array, or `undefined` if empty.

```typescript
bury([10, 5, 20]).max.value; // 20
```

### `.sum: Bury<number | undefined>`
Wraps the sum of numeric elements in the array, or `undefined` if empty.

```typescript
bury([1, 2, 3, 4]).sum.value; // 10
```

### `.size: Bury<number>`
Wraps the length of the array.

```typescript
bury(['a', 'b', 'c']).size.value; // 3
```

### `.minmax: Bury<[T, T] | [undefined, undefined]>`
Wraps a tuple containing `[min, max]`, or `[undefined, undefined]` if empty.

```typescript
bury([5, 1, 9, 3]).minmax.value; // [1, 9]
```

---

## Methods

### `.map<U>(fn: (el: T) => U): BuryArray<U>`
Transforms each element by applying `fn`.

```typescript
bury([1, 2, 3]).map(x => x * 2).value; // [2, 4, 6]
```

### `.where(fn: (el: T) => boolean): BuryArray<T>`
Filters elements, keeping only those for which `fn` returns `true`.

```typescript
bury([1, 2, 3, 4, 5]).where(x => x % 2 === 0).value; // [2, 4]
```

### `.pluck<K extends keyof T>(key: K): BuryArray<T[K]>`
Extracts the value of the specified property from each object element.

```typescript
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
bury(users).pluck('name').value; // ['Alice', 'Bob']
```

### `.min_by(fn: (el: T) => number): Bury<T | undefined>`
Returns the element that produces the lowest value when evaluated by `fn`.

```typescript
const items = [{ name: 'A', price: 50 }, { name: 'B', price: 20 }];
bury(items).min_by(i => i.price).value; // { name: 'B', price: 20 }
```

### `.max_by(fn: (el: T) => number): Bury<T | undefined>`
Returns the element that produces the highest value when evaluated by `fn`.

```typescript
const items = [{ name: 'A', price: 50 }, { name: 'B', price: 20 }];
bury(items).max_by(i => i.price).value; // { name: 'A', price: 50 }
```

### `.append(...elements: T[]): BuryArray<T>`
Returns a new array with elements added to the end.

```typescript
bury([1, 2]).append(3, 4).value; // [1, 2, 3, 4]
```

### `.prepend(...elements: T[]): BuryArray<T>`
Returns a new array with elements added to the beginning.

```typescript
bury([3, 4]).prepend(1, 2).value; // [1, 2, 3, 4]
```

### `.union(other: T[]): BuryArray<T>`
Returns a new array combining unique elements from both arrays.

```typescript
bury([1, 2, 3]).union([3, 4, 5]).value; // [1, 2, 3, 4, 5]
```
