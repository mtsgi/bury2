# Getting Started

Welcome to **bury2**! This guide walks you through installation, the core concepts of wrapping/unwrapping, and basic examples.

---

## Installation

Install `bury2` using your preferred package manager:

::: code-group

```bash [npm]
npm install bury2
```

```bash [pnpm]
pnpm add bury2
```

```bash [yarn]
yarn add bury2
```

```bash [bun]
bun add bury2
```

:::

---

## Core Concept: The `bury()` Function

In `bury2`, you do not mutate global prototypes. Instead, you wrap values in expressive wrapper instances using the `bury()` function:

```typescript
import { bury } from 'bury2';

const wrappedArray = bury([3, 1, 2]);   // BuryArray<number>
const wrappedString = bury('hello');    // BuryString
const wrappedNumber = bury(42);         // BuryNumber
const wrappedObject = bury({ a: 1 });   // BuryObject<{ a: number }>
```

---

## Unwrapping Values

When you are done transforming or querying data, retrieve the underlying value using `.value` or `.unwrap()`:

```typescript
const result = bury([1, 2, 2, 3])
  .uniq
  .value; // [1, 2, 3]

// Or with .unwrap():
const sameResult = bury([1, 2, 2, 3])
  .uniq
  .unwrap(); // [1, 2, 3]
```

---

## Method Chaining & Immutability

Every transformation creates and returns a **new wrapper**. The original input value is never mutated:

```typescript
const original = ['  apple  ', ' banana ', ' cherry '];

const processed = bury(original)
  .trim          // Trim each string element
  .where(s => s.startsWith('b')) // Filter
  .value;

console.log(processed); // ['banana']
console.log(original);  // ['  apple  ', ' banana ', ' cherry '] (untouched!)
```

---

## Next Steps

- Learn about [Callable Getters](./callable-getters.md) (`.uniq` vs `.uniq()`).
- Explore the [API Reference](../api/index.md) for full method lists.
- Check out the [Cookbook](./cookbook.md) for real-world patterns.
