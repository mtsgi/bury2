# Requirements Document

## Introduction

bury2 は、既存の buryjs ライブラリの後継として設計されるコアライブラリである。
既存ライブラリがネイティブオブジェクトのプロトタイプを直接拡張する方式を採っていたのに対し、
bury2 は `bury(value)` 関数でラッパーオブジェクトを生成するアプローチを採用する。
これによりグローバル汚染を排除し、TypeScript の型安全性を最大限に活かしたメソッドチェーン API を提供する。

主な対象型は Array（配列）、String（文字列）、Number（数値）、Object（オブジェクト）であり、
Ruby ライクな表記スタイルを JavaScript / TypeScript 上で実現する。

## Glossary

- **Bury_Wrapper**: `bury(value)` 関数が返すチェーンラッパーオブジェクト。型パラメータ `T` を持ち、`Bury<T>` と表記する
- **Entry_Function**: ユーザーがラッパーを生成するために呼び出すトップレベル関数 `bury(value)`
- **Terminal_Operation**: チェーンを終了し内包値を取り出す操作（`.value` プロパティまたは `.unwrap()` メソッド）
- **Getter_Method**: 引数なしでプロパティアクセスのように呼び出せるメソッド（例：`.compact`、`.trim`）
- **Callable_Getter**: Proxy を用いて getter アクセスと関数呼び出しの両方をサポートするメソッド（例：`.uniq` / `.uniq()`）
- **Array_Wrapper**: 配列値を内包する `Bury<T[]>` 型のラッパー
- **String_Wrapper**: 文字列値を内包する `Bury<string>` 型のラッパー
- **Number_Wrapper**: 数値値を内包する `Bury<number>` 型のラッパー
- **Object_Wrapper**: オブジェクト値を内包する `Bury<Record<string, unknown>>` 型のラッパー
- **Nullish_Value**: `null` または `undefined` の値
- **Chain_Method**: `Bury_Wrapper` を返すことでチェーンを継続できるメソッド

---

## Requirements

### Requirement 1: Entry Function と Wrapper の生成

**User Story:** As a developer, I want to wrap any value with `bury(value)`, so that I can access Ruby-like methods in a type-safe, chain-friendly way without polluting native prototypes.

#### Acceptance Criteria

1. THE `Entry_Function` SHALL accept a value of any type `T` and return a `Bury<T>` instance.
2. WHEN `bury(value)` is called with an array value, THE `Entry_Function` SHALL return an `Array_Wrapper`.
3. WHEN `bury(value)` is called with a string value, THE `Entry_Function` SHALL return a `String_Wrapper`.
4. WHEN `bury(value)` is called with a number value, THE `Entry_Function` SHALL return a `Number_Wrapper`.
5. WHEN `bury(value)` is called with a plain object value, THE `Entry_Function` SHALL return an `Object_Wrapper`.
6. THE `Entry_Function` SHALL NOT modify any native object prototypes (`Array.prototype`, `String.prototype`, `Number.prototype`).
7. IF `bury(value)` is called with `null` or `undefined`, THEN THE `Entry_Function` SHALL return a `Bury<T>` instance wrapping the `null` or `undefined` value without throwing an error.
8. THE `Bury<T>` instance SHALL expose the original wrapped value of type `T` via a `.value` property, such that `bury(v).value === v` holds for any input `v`.

---

### Requirement 2: Terminal Operations

**User Story:** As a developer, I want to extract the wrapped value from a chain, so that I can use the final result in regular JavaScript/TypeScript code.

#### Acceptance Criteria

1. THE `Bury_Wrapper` SHALL expose a `value` property that returns the internally held value of type `T`.
2. THE `Bury_Wrapper` SHALL expose an `unwrap()` method that returns a value strictly equal (`===`) to the value returned by the `value` property.
3. IF the chain has been transformed through one or more Chain_Methods, THEN THE `Bury_Wrapper` SHALL return the final transformed value when accessed via the `value` property or `unwrap()` method.
4. IF no Chain_Methods have been applied to the `Bury_Wrapper`, THEN THE `Bury_Wrapper` SHALL return the original construction value when accessed via the `value` property or `unwrap()` method.

---

### Requirement 3: Callable Getter Pattern

**User Story:** As a developer, I want to call certain methods either as a property getter or as a function, so that I can write expressive code in both styles.

#### Acceptance Criteria

1. THE `Bury_Wrapper` SHALL implement the `Callable_Getter` pattern using JavaScript Proxy so that each designated method returns a callable object that also carries the pre-computed zero-argument result as its resolved value.
2. WHEN a `Callable_Getter` is accessed as a property (getter), THE `Bury_Wrapper` SHALL return a `Bury_Wrapper` holding the same value as calling the underlying method with no arguments.
3. WHEN a `Callable_Getter` is invoked as a function with no arguments, THE `Bury_Wrapper` SHALL return a `Bury_Wrapper` holding the same value as the getter access.
4. WHEN a `Callable_Getter` is invoked as a function with one or more arguments, THE `Bury_Wrapper` SHALL pass all provided arguments to the underlying method and return a `Bury_Wrapper` holding the result.
5. THE `Bury_Wrapper` SHALL support the `Callable_Getter` pattern for the following methods: `compact`, `uniq`, `trim`, `upcase`, `downcase`, `keys`, `sort`, `rev`.

---

### Requirement 4: Array Methods

**User Story:** As a developer, I want Ruby-like array operations on an Array_Wrapper, so that I can write concise and readable data transformation pipelines.

#### Acceptance Criteria

1. THE `Array_Wrapper` SHALL provide a `compact` Getter_Method that returns an `Array_Wrapper` containing only non-Nullish_Value elements.
2. THE `Array_Wrapper` SHALL provide a `uniq` Callable_Getter that returns an `Array_Wrapper` with duplicate elements removed, preserving the first occurrence of each value.
3. THE `Array_Wrapper` SHALL provide a `first` Getter_Method that returns a `Bury_Wrapper` holding the first element of the array.
4. THE `Array_Wrapper` SHALL provide a `last` Getter_Method that returns a `Bury_Wrapper` holding the last element of the array.
5. THE `Array_Wrapper` SHALL provide a `min` Getter_Method that returns a `Bury_Wrapper` holding the minimum numeric value in the array.
6. THE `Array_Wrapper` SHALL provide a `max` Getter_Method that returns a `Bury_Wrapper` holding the maximum numeric value in the array.
7. THE `Array_Wrapper` SHALL provide a `sum` Getter_Method that returns a `Bury_Wrapper` holding the numeric sum of all elements.
8. THE `Array_Wrapper` SHALL provide a `size` Getter_Method that returns a `Bury_Wrapper` holding the number of elements.
9. THE `Array_Wrapper` SHALL provide a `rev` Callable_Getter that returns an `Array_Wrapper` with elements in reversed order without mutating the original array.
10. THE `Array_Wrapper` SHALL provide a `sort` Callable_Getter that returns an `Array_Wrapper` with elements sorted in ascending order without mutating the original array.
11. THE `Array_Wrapper` SHALL provide a `trim` Getter_Method that returns an `Array_Wrapper` where each string element has leading and trailing whitespace removed.
12. THE `Array_Wrapper` SHALL provide a `map(fn)` method that accepts a mapping function and returns an `Array_Wrapper` with each element transformed by `fn`.
13. THE `Array_Wrapper` SHALL provide a `where(fn)` method (alias of `filter`) that accepts a predicate function and returns an `Array_Wrapper` containing only elements for which `fn` returns true.
14. THE `Array_Wrapper` SHALL provide a `pluck(key)` method that accepts a property key name and returns an `Array_Wrapper` holding the value of that property from each element.
15. THE `Array_Wrapper` SHALL provide a `min_by(fn)` method that returns a `Bury_Wrapper` holding the element for which `fn` returns the smallest value.
16. THE `Array_Wrapper` SHALL provide a `max_by(fn)` method that returns a `Bury_Wrapper` holding the element for which `fn` returns the largest value.
17. THE `Array_Wrapper` SHALL provide an `append(...elements)` method that returns an `Array_Wrapper` with the given elements added to the end.
18. THE `Array_Wrapper` SHALL provide a `prepend(...elements)` method that returns an `Array_Wrapper` with the given elements added to the beginning.
19. THE `Array_Wrapper` SHALL provide a `union(other)` method that accepts another array and returns an `Array_Wrapper` containing the unique elements from both arrays.
20. THE `Array_Wrapper` SHALL provide a `minmax` Getter_Method that returns a `Bury_Wrapper` holding a two-element array `[min, max]`.
21. IF the array is empty and `min`, `max`, `sum`, `first`, or `last` is accessed, THEN THE `Array_Wrapper` SHALL return a `Bury_Wrapper` holding `undefined`.

---

### Requirement 5: String Methods

**User Story:** As a developer, I want Ruby-like string operations on a String_Wrapper, so that I can transform strings in a readable, chained style.

#### Acceptance Criteria

1. THE `String_Wrapper` SHALL provide an `upcase` Callable_Getter that returns a `String_Wrapper` with all characters converted to uppercase.
2. THE `String_Wrapper` SHALL provide a `downcase` Callable_Getter that returns a `String_Wrapper` with all characters converted to lowercase.
3. THE `String_Wrapper` SHALL provide a `trim` Callable_Getter that returns a `String_Wrapper` with leading and trailing whitespace removed.
4. THE `String_Wrapper` SHALL provide a `reverse` Getter_Method that returns a `String_Wrapper` with characters in reversed order.
5. THE `String_Wrapper` SHALL provide a `chop` Getter_Method that returns a `String_Wrapper` with the last character removed.
6. THE `String_Wrapper` SHALL provide a `size` Getter_Method that returns a `Bury_Wrapper` holding the number of characters.
7. THE `String_Wrapper` SHALL provide a `gsub(pattern, replace)` method that returns a `String_Wrapper` with all occurrences of `pattern` replaced by `replace`.
8. THE `String_Wrapper` SHALL provide a `center(width)` method that returns a `String_Wrapper` padded with spaces on both sides to reach the specified total width.
9. THE `String_Wrapper` SHALL provide a `prepend(str)` method that returns a `String_Wrapper` with `str` concatenated before the original string.

---

### Requirement 6: Number Methods

**User Story:** As a developer, I want Ruby-like number operations on a Number_Wrapper, so that I can perform math transformations in a chained style.

#### Acceptance Criteria

1. THE `Number_Wrapper` SHALL provide a `floor` Getter_Method that returns a `Number_Wrapper` holding the largest integer less than or equal to the value.
2. THE `Number_Wrapper` SHALL provide a `ceil` Getter_Method that returns a `Number_Wrapper` holding the smallest integer greater than or equal to the value.
3. THE `Number_Wrapper` SHALL provide an `abs` Getter_Method that returns a `Number_Wrapper` holding the non-negative magnitude of the value.
4. THE `Number_Wrapper` SHALL provide a `next` Getter_Method that returns a `Number_Wrapper` holding `Math.floor(value) + 1`.
5. THE `Number_Wrapper` SHALL provide a `succ` Getter_Method that returns the same result as `next`.
6. THE `Number_Wrapper` SHALL provide a `pred` Getter_Method that returns a `Number_Wrapper` holding `Math.ceil(value) - 1`.
7. THE `Number_Wrapper` SHALL provide a `to_s` Getter_Method that returns a `String_Wrapper` holding the base-10 string representation of the value, equivalent to `String(value)`.
8. THE `Number_Wrapper` SHALL provide a `times(fn)` method that calls `fn` with each integer index from `0` to `Math.floor(value) - 1` in ascending order and returns the `Number_Wrapper` unchanged.
9. IF `times(fn)` is called when the value is not a non-negative integer (e.g., negative or fractional), THEN THE `Number_Wrapper` SHALL skip all invocations of `fn` and return the `Number_Wrapper` unchanged.
10. THE `Number_Wrapper` SHALL provide a `clamp(min, max)` method that returns a `Number_Wrapper` holding the value constrained within the inclusive range `[min, max]`.
11. IF `clamp(min, max)` is called where `min > max`, THEN THE `Number_Wrapper` SHALL return a `Number_Wrapper` holding `min`.

---

### Requirement 7: Object Methods

**User Story:** As a developer, I want basic object introspection methods on an Object_Wrapper, so that I can extract and manipulate object keys and values in a chained style.

#### Acceptance Criteria

1. THE `Object_Wrapper` SHALL provide a `keys` Getter_Method that returns an `Array_Wrapper` holding the array of the object's own enumerable string key names in the same order as `Object.keys()`.
2. THE `Object_Wrapper` SHALL provide a `values` Getter_Method that returns an `Array_Wrapper` holding the array of the object's own enumerable values in the same order as `Object.values()`.
3. THE `Object_Wrapper` SHALL provide a `entries` Getter_Method that returns an `Array_Wrapper` holding the array of `[key, value]` pairs in the same order as `Object.entries()`.
4. IF `keys`, `values`, or `entries` is accessed on an `Object_Wrapper` wrapping an empty object `{}`, THEN THE result SHALL be an `Array_Wrapper` holding an empty array.

---

### Requirement 8: TypeScript Type Safety

**User Story:** As a TypeScript developer, I want the Bury_Wrapper to carry precise type information through a chain, so that I get accurate autocomplete and compile-time type checking.

#### Acceptance Criteria

1. THE `Bury_Wrapper` SHALL be generic over its inner type `T`, expressed as `Bury<T>`.
2. WHEN `map(fn: (x: A) => B)` is called on `Bury<A[]>`, THE `Array_Wrapper` SHALL return `Bury<B[]>`.
3. WHEN `pluck(key)` is called on `Bury<Record<K, V>[]>`, THE `Array_Wrapper` SHALL return `Bury<V[]>`.
4. WHEN `keys` is accessed on `Object_Wrapper`, THE `Object_Wrapper` SHALL return `Bury<string[]>`.
5. WHEN `to_s` is accessed on `Number_Wrapper`, THE `Number_Wrapper` SHALL return `Bury<string>`.
6. THE `Terminal_Operation` `value` property SHALL have return type `T` matching the inner type of the `Bury_Wrapper`.
7. THE `Terminal_Operation` `unwrap()` method SHALL have return type `T` matching the inner type of the `Bury_Wrapper`.
8. WHEN an incorrect argument type is passed to a Chain_Method (e.g., a number passed to `map` instead of a function), THE TypeScript compiler SHALL produce a type error at the call site.

---

### Requirement 9: Immutability

**User Story:** As a developer, I want all Bury_Wrapper transformations to be non-mutating, so that the original value is preserved and chains are safe to branch.

#### Acceptance Criteria

1. THE `Array_Wrapper` SHALL NOT mutate the original array when any Chain_Method is called.
2. THE `String_Wrapper` SHALL NOT mutate the original string when any Chain_Method is called.
3. THE `Number_Wrapper` SHALL NOT mutate the original number when any Chain_Method is called.
4. WHEN `sort` is called, THE `Array_Wrapper` SHALL return a new sorted array without modifying the input array.
5. WHEN `rev` is called, THE `Array_Wrapper` SHALL return a new reversed array without modifying the input array.
6. WHEN two separate Chain_Methods are called on the same `Bury_Wrapper` instance, THE result of each call SHALL be independent and SHALL NOT be affected by the other call.

---

### Requirement 10: Parser and Serializer Round-Trip (JSON Interop)

**User Story:** As a developer, I want to serialize a chain result to JSON and deserialize it back, so that bury2 values can safely pass through JSON boundaries.

#### Acceptance Criteria

1. WHEN `JSON.stringify` is applied to the result of a `Terminal_Operation` holding a JSON-serializable value, THE result SHALL produce a valid JSON string equivalent to calling `JSON.stringify` on the raw unwrapped value.
2. WHEN `JSON.parse` is applied to the JSON string produced in criterion 1, THE result SHALL be deeply equal to the original unwrapped value.
3. WHEN `JSON.stringify` is applied to the result of a `Terminal_Operation` holding a non-JSON-serializable value (e.g., `undefined`, a function, or a circular reference), THE behavior SHALL mirror the native `JSON.stringify` semantics for that value type.
