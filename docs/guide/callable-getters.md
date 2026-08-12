# Callable Getters

One of `bury2`'s most distinctive features is **Callable Getters**. In Ruby, methods can be called without parentheses (e.g. `[1, 2, 2].uniq`). In JavaScript/TypeScript, methods usually require parentheses `()`.

`bury2` supports **both** styles seamlessly:

```typescript
import { bury } from 'bury2';

// 1. Property access syntax (Ruby style)
const a = bury([1, 2, 2, 3]).uniq.value; // [1, 2, 3]

// 2. Function call syntax (Standard JS style)
const b = bury([1, 2, 2, 3]).uniq().value; // [1, 2, 3]
```

---

## How It Works

Under the hood, `bury2` uses JavaScript `Proxy` objects to construct a `CallableGetter`.

```typescript
export type CallableGetter<T> = T & (() => T);
```

When you access a property like `.uniq`:
1. The getter computes the wrapped result immediately.
2. It returns a `Proxy` that delegates property access to the target instance (`T`), while also implementing the `apply` trap so that calling it as a function `()` returns `T`.

### Parameter Support (e.g. `.sort`)

Callable Getters can also accept optional parameters when invoked as functions. For example, `.sort`:

```typescript
// Default sorting (natural ascending order):
bury([10, 5, 20]).sort.value; // [5, 10, 20]
bury([10, 5, 20]).sort().value; // [5, 10, 20]

// Custom comparator passed to the call:
bury([10, 5, 20]).sort((a, b) => b - a).value; // [20, 10, 5]
```

---

## List of Callable Getters

### `BuryArray<T>`
- `.compact` / `.compact()`
- `.uniq` / `.uniq()`
- `.trim` / `.trim()`
- `.rev` / `.rev()`
- `.sort` / `.sort([comparator])`

### `BuryString`
- `.upcase` / `.upcase()`
- `.downcase` / `.downcase()`
- `.trim` / `.trim()`

### `BuryObject<T>`
- `.keys` / `.keys()`

---

## Best Practices & Caveats

1. **Chaining**: You can chain freely regardless of whether you used parentheses or property access:
   ```typescript
   bury([' b ', ' a ']).trim.sort.value; // ['a', 'b']
   bury([' b ', ' a ']).trim().sort().value; // ['a', 'b']
   ```
2. **Terminal `.value`**: Always unwrap with `.value` or `.unwrap()` when passing the raw value to external APIs, JSON serialization, or libraries.
