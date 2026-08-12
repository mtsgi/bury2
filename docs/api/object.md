# BuryObject&lt;T&gt;

The `BuryObject<T>` wrapper provides Ruby-like introspection methods for plain JavaScript objects.

---

## Callable Getters

### `.keys`
Returns a `BuryArray<string>` containing the object's own enumerable string keyed property names.

```typescript
const obj = { a: 1, b: 2, c: 3 };

// Property access
bury(obj).keys.sort.value; // ['a', 'b', 'c']

// Function call
bury(obj).keys().sort().value; // ['a', 'b', 'c']
```

---

## Getters

### `.values: BuryArray<T[keyof T]>`
Returns a `BuryArray` containing the object's own enumerable property values, enabling full array chaining (e.g. `.sum`, `.compact`, `.where`).

```typescript
const scores = { math: 90, english: 85, science: 95 };

const total = bury(scores)
  .values
  .sum
  .value; // 270
```

### `.entries: BuryArray<[string, T[keyof T]]>`
Returns a `BuryArray` containing `[key, value]` pairs.

```typescript
const data = { x: 10, y: 20 };

const pairs = bury(data)
  .entries
  .value; // [['x', 10], ['y', 20]]
```
