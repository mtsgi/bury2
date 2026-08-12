# API Reference Overview

The `bury2` library exports the primary entry point `bury()`, the base wrapper class `Bury<T>`, and specialized subclass wrappers.

---

## `bury(value)`

The factory function that wraps any JavaScript/TypeScript value in its corresponding Bury wrapper.

```typescript
function bury<T>(value: T[]): BuryArray<T>;
function bury(value: string): BuryString;
function bury(value: number): BuryNumber;
function bury<T extends Record<string, unknown>>(value: T): BuryObject<T>;
function bury<T>(value: T): Bury<T>;
```

### Type Dispatch

| Input Type | Returned Wrapper Class |
|------------|------------------------|
| `Array` | `BuryArray<T>` |
| `string` | `BuryString` |
| `number` | `BuryNumber` |
| `Record<string, unknown>` | `BuryObject<T>` |
| `boolean`, `null`, `undefined`, etc. | `Bury<T>` (Base class) |

---

## Base Class: `Bury<T>`

All wrapper classes inherit from `Bury<T>`.

### Properties & Methods

#### `.value: T`
Getter that returns the underlying raw value.

```typescript
bury(42).value; // 42
```

#### `.unwrap(): T`
Method that returns the underlying raw value (alias for `.value`).

```typescript
bury([1, 2, 3]).unwrap(); // [1, 2, 3]
```

---

## Wrapper Subclasses

- [**BuryArray&lt;T&gt;**](./array.md): Array transformations, enumerable operations, and statistics.
- [**BuryString**](./string.md): String manipulations, case transformations, and regex substitutions.
- [**BuryNumber**](./number.md): Numeric boundary clamping, iterators, and rounding.
- [**BuryObject&lt;T&gt;**](./object.md): Object keys, values, and entry introspection.
