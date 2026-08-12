# Design Document: bury2 Core Library

## Overview

bury2 は buryjs の後継ライブラリで、ネイティブプロトタイプを汚染せず Ruby ライクな API を TypeScript で提供する。
`bury(value)` 関数がラッパーオブジェクトを生成し、`.value` / `.unwrap()` でチェーンを終了する設計とする。

主な設計目標:

- **グローバル汚染ゼロ**: `Array.prototype` 等を一切変更しない
- **型安全チェーン**: TypeScript の型推論がチェーン全体を通じて正確に動作する
- **Callable Getter**: `.uniq` と `.uniq()` の両記法を Proxy で実現する
- **Immutability**: すべての変換は新しい値を返し、元の値を変更しない

### 既存ライブラリとの違い

| 項目 | bury (v1) | bury2 |
|------|-----------|-------|
| API スタイル | プロトタイプ拡張 | ラッパー関数 |
| グローバル汚染 | あり | なし |
| 型推論 | 限定的 | 完全サポート |
| Immutability | 保証なし | すべてのメソッドで保証 |
| エントリポイント | 自動適用 | `bury(value)` 明示的 |

---

## Architecture

```mermaid
graph TD
    A[bury(value)] --> B{型判定}
    B --> |Array| C[BuryArray<T>]
    B --> |String| D[BuryString]
    B --> |Number| E[BuryNumber]
    B --> |Object| F[BuryObject<T>]
    B --> |その他| G[Bury<T> 基底]

    C --> H[Callable Getter Proxy]
    D --> H
    E --> H
    F --> H

    H --> I[.value / .unwrap()]
```

### 設計上の主要な決定

**1. Proxy ベースの Callable Getter**

`.uniq` と `.uniq()` の両方をサポートするために JavaScript `Proxy` を使用する。
Proxy の `get` トラップで「指定したメソッド名へのアクセス」を検出し、
呼び出し可能かつ即時評価済みの値を返す特殊なオブジェクト（Callable Wrapper）を返す。

この方式の利点:
- TypeScript 型定義でプロパティと関数の両方を同一シグネチャで表現できる
- 実装ロジックを一箇所に集約できる
- 対象メソッドのリストを拡張しやすい

**2. サブクラス型階層**

`Bury<T>` を基底クラスとし、各型ラッパーをサブクラスとして設計する。
`bury()` 関数がランタイムの型判定（`Array.isArray`, `typeof`）で適切なサブクラスを選択する。

**3. メソッドチェーンの返値型**

各メソッドは変換後の値で再び `bury()` を呼ぶことで返値を生成する。
これにより返値の型が自動的に適切な Wrapper クラスに解決される。

---

## Components and Interfaces

### ファイル構成

```
src/
  index.ts              — 公開 API エクスポート
  bury.ts               — エントリポイント: bury() 関数
  core/
    base.ts             — Bury<T> 基底クラス
    callable.ts         — Callable Getter Proxy ユーティリティ
  wrappers/
    array.ts            — BuryArray<T>
    string.ts           — BuryString
    number.ts           — BuryNumber
    object.ts           — BuryObject<T>
```

### Bury\<T\> 基底クラス (`core/base.ts`)

```ts
export class Bury<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  unwrap(): T {
    return this._value;
  }
}
```

### Callable Getter ユーティリティ (`core/callable.ts`)

Callable Getter は「関数として呼べるが、プロパティとしてアクセスしても同じ結果を返すオブジェクト」である。
これを実現するために、各 Wrapper クラスの Proxy `get` トラップ内で以下のパターンを使用する:

```ts
// 擬似コード
function makeCallableGetter<T>(
  zeroArgResult: Bury<T>,
  impl: (...args: unknown[]) => Bury<T>
): CallableGetter<T> {
  // 関数として振る舞いつつ、プロパティアクセスでも同値を返すオブジェクト
  const fn = (...args: unknown[]) =>
    args.length === 0 ? zeroArgResult : impl(...args);

  // fn 自体が Bury<T> のプロパティ（value, unwrap）を持つよう Proxy でラップ
  return new Proxy(fn, {
    get(target, prop) {
      return (zeroArgResult as unknown as Record<string, unknown>)[prop as string];
    }
  }) as CallableGetter<T>;
}
```

**Callable Getter の型定義:**

```ts
// CallableGetter<W> は W（Bury_Wrapper）のプロパティと
// 引数なし/あり呼び出しの両方をサポートする型
type CallableGetter<W extends Bury<unknown>> =
  W & ((...args: unknown[]) => W);
```

各 Wrapper クラスは Proxy を使ってインスタンスをラップし、
Callable Getter メソッドへのアクセス時に上記の動作を実現する。

### BuryArray\<T\> (`wrappers/array.ts`)

```ts
export class BuryArray<T> extends Bury<T[]> {
  // Getter Methods
  get compact(): BuryArray<NonNullable<T>> { ... }
  get first(): Bury<T | undefined> { ... }
  get last(): Bury<T | undefined> { ... }
  get min(): Bury<T | undefined> { ... }
  get max(): Bury<T | undefined> { ... }
  get sum(): Bury<number> { ... }
  get size(): Bury<number> { ... }
  get minmax(): Bury<[T, T] | [undefined, undefined]> { ... }
  get trim(): BuryArray<T> { ... }  // string 配列専用

  // Callable Getters (Proxy 経由で getter/関数両対応)
  get uniq(): BuryArray<T> { ... }
  get rev(): BuryArray<T> { ... }
  get sort(): BuryArray<T> { ... }

  // Parameterized Methods
  map<U>(fn: (el: T) => U): BuryArray<U> { ... }
  where(fn: (el: T) => boolean): BuryArray<T> { ... }
  pluck<K extends keyof T>(key: K): BuryArray<T[K]> { ... }
  min_by(fn: (el: T) => number): Bury<T | undefined> { ... }
  max_by(fn: (el: T) => number): Bury<T | undefined> { ... }
  append(...elements: T[]): BuryArray<T> { ... }
  prepend(...elements: T[]): BuryArray<T> { ... }
  union(other: T[]): BuryArray<T> { ... }
}
```

### BuryString (`wrappers/string.ts`)

```ts
export class BuryString extends Bury<string> {
  // Callable Getters
  get upcase(): BuryString { ... }
  get downcase(): BuryString { ... }
  get trim(): BuryString { ... }

  // Getter Methods
  get reverse(): BuryString { ... }
  get chop(): BuryString { ... }
  get size(): Bury<number> { ... }

  // Parameterized Methods
  gsub(pattern: RegExp | string, replace: string): BuryString { ... }
  center(width: number): BuryString { ... }
  prepend(str: string): BuryString { ... }
}
```

### BuryNumber (`wrappers/number.ts`)

```ts
export class BuryNumber extends Bury<number> {
  // Getter Methods
  get floor(): BuryNumber { ... }
  get ceil(): BuryNumber { ... }
  get abs(): BuryNumber { ... }
  get next(): BuryNumber { ... }
  get succ(): BuryNumber { ... }  // next と同値
  get pred(): BuryNumber { ... }
  get to_s(): BuryString { ... }

  // Parameterized Methods
  times(fn: (i: number) => void): BuryNumber { ... }
  clamp(min: number, max: number): BuryNumber { ... }
}
```

### BuryObject\<T\> (`wrappers/object.ts`)

```ts
export class BuryObject<T extends Record<string, unknown>> extends Bury<T> {
  // Callable Getters
  get keys(): BuryArray<string> { ... }

  // Getter Methods
  get values(): BuryArray<T[keyof T]> { ... }
  get entries(): BuryArray<[string, T[keyof T]]> { ... }
}
```

### エントリポイント (`bury.ts`)

```ts
export function bury<T>(value: T[]): BuryArray<T>;
export function bury(value: string): BuryString;
export function bury(value: number): BuryNumber;
export function bury<T extends Record<string, unknown>>(value: T): BuryObject<T>;
export function bury<T>(value: T): Bury<T>;
export function bury(value: unknown): Bury<unknown> {
  if (Array.isArray(value)) return new BuryArray(value);
  if (typeof value === 'string') return new BuryString(value);
  if (typeof value === 'number') return new BuryNumber(value);
  if (value !== null && typeof value === 'object') return new BuryObject(value);
  return new Bury(value);
}
```

---

## Data Models

### 型階層

```
Bury<T>
├── BuryArray<T>    extends Bury<T[]>
├── BuryString      extends Bury<string>
├── BuryNumber      extends Bury<number>
└── BuryObject<T>   extends Bury<T extends Record<string, unknown>>
```

### Callable Getter の型表現

TypeScript の型システムで Callable Getter を表現する際、
プロパティアクセスと関数呼び出しの両方を型安全にサポートする必要がある。

```ts
// 引数なし専用 Callable Getter
type CallableGetter0<W extends Bury<unknown>> = W & (() => W);

// 引数あり Callable Getter (sort の comparator 等)
type CallableGetter1<W extends Bury<unknown>, A> = W & ((arg?: A) => W);
```

設計上の選択として、`sort` は comparator 関数を任意引数として受け取る。
`uniq`, `rev`, `compact`, `trim`, `upcase`, `downcase`, `keys` は引数なし専用とする。

### 内部状態

各 Wrapper は不変（immutable）であり、変換メソッドは常に新しい Wrapper インスタンスを生成する。
内部値 `_value` は `protected readonly` で宣言し、サブクラスからの読み取りは許可するが書き込みは禁止する。

### Proxy ラッパーの構造

```
BuryArray インスタンス
└── Proxy
    ├── get "uniq"  → CallableGetter (即時評価 + 呼び出し可能)
    ├── get "rev"   → CallableGetter
    ├── get "sort"  → CallableGetter (comparator 引数あり)
    ├── get "value" → T[] (基底クラスの getter に委譲)
    └── その他      → 通常の BuryArray メソッド/プロパティ
```

Callable Getter の「即時評価」は Proxy の `get` トラップ内で行われる（遅延評価ではない）。
これは単純さを優先した設計決定であり、アクセスのたびに再計算されるが、
配列操作の時間計算量は O(n) 以下なので許容できる。

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Entry Function Round-Trip

*For any* value `v` of any type, `bury(v).value` SHALL be strictly equal (`===`) to `v`.

**Validates: Requirements 1.8, 2.1, 2.4**

### Property 2: unwrap Equivalence

*For any* value `v`, `bury(v).unwrap()` SHALL be strictly equal (`===`) to `bury(v).value`.

**Validates: Requirements 2.2**

### Property 3: Callable Getter Equivalence

*For any* array `arr` and any Callable Getter method `m` (compact, uniq, trim, rev, sort), accessing `bury(arr).m.value` SHALL produce a value that is deeply equal to `bury(arr).m().value`.

**Validates: Requirements 3.1, 3.2, 3.3, 3.5**

### Property 4: compact Removes Nullish Values

*For any* array `arr`, `bury(arr).compact.value` SHALL contain no `null` or `undefined` elements, and every element in the result SHALL have appeared in `arr` at the same relative order.

**Validates: Requirements 4.1, 9.1**

### Property 5: compact is Idempotent

*For any* array `arr`, applying `compact` twice SHALL produce the same result as applying it once: `bury(arr).compact.compact.value` deeply equals `bury(arr).compact.value`.

**Validates: Requirements 4.1**

### Property 6: uniq Preserves Uniqueness and First Occurrence

*For any* array `arr`, `bury(arr).uniq.value` SHALL contain each distinct value exactly once, and for any value appearing multiple times in `arr`, the retained element SHALL be the one at the lowest index.

**Validates: Requirements 4.2**

### Property 7: Immutability of Array Operations

*For any* array `arr` and any Chain_Method call on `bury(arr)` (sort, rev, compact, uniq, map, where, append, prepend, union), the original array `arr` SHALL remain unchanged after the method call.

**Validates: Requirements 9.1, 9.4, 9.5, 9.6**

### Property 8: sort Returns Sorted Array

*For any* array `arr` of numbers, `bury(arr).sort.value` SHALL be a permutation of `arr` where every adjacent pair satisfies `arr[i] <= arr[i+1]`.

**Validates: Requirements 4.10**

### Property 9: rev Reverses Array

*For any* array `arr`, `bury(arr).rev.value` SHALL be the reverse of `arr`, i.e., element at index `i` of the result equals element at index `arr.length - 1 - i` of the original.

**Validates: Requirements 4.9**

### Property 10: map Length Invariant

*For any* array `arr` and any function `fn`, `bury(arr).map(fn).value` SHALL have the same length as `arr`.

**Validates: Requirements 4.12**

### Property 11: where Predicate Satisfaction

*For any* array `arr` and any predicate function `fn`, every element in `bury(arr).where(fn).value` SHALL satisfy `fn(element) === true`.

**Validates: Requirements 4.13**

### Property 12: append and prepend Length Invariant

*For any* array `arr` and elements `...els`, `bury(arr).append(...els).value` SHALL have length `arr.length + els.length`, and `bury(arr).prepend(...els).value` SHALL have length `arr.length + els.length`.

**Validates: Requirements 4.17, 4.18**

### Property 13: union Contains All Unique Elements

*For any* two arrays `a` and `b`, every element in `a` and `b` SHALL appear in `bury(a).union(b).value`, and no element SHALL appear more than once.

**Validates: Requirements 4.19**

### Property 14: String upcase/downcase Round-Trip

*For any* ASCII string `s`, `bury(s).upcase.downcase.value` SHALL deeply equal `s.toLowerCase()`.

**Validates: Requirements 5.1, 5.2**

### Property 15: String trim Idempotence

*For any* string `s`, `bury(s).trim.trim.value` SHALL deeply equal `bury(s).trim.value`.

**Validates: Requirements 5.3**

### Property 16: String reverse Round-Trip

*For any* string `s`, reversing twice SHALL restore the original: `bury(s).reverse.reverse.value === s`.

**Validates: Requirements 5.4**

### Property 17: Number clamp Invariant

*For any* number `v` and any `min <= max`, `bury(v).clamp(min, max).value` SHALL satisfy `min <= result <= max`.

**Validates: Requirements 6.10**

### Property 18: Number abs Non-Negativity

*For any* number `n`, `bury(n).abs.value` SHALL be greater than or equal to `0`.

**Validates: Requirements 6.3**

### Property 19: times Call Count

*For any* non-negative integer `n`, calling `bury(n).times(fn)` SHALL invoke `fn` exactly `n` times with indices `0, 1, ..., n-1` in that order.

**Validates: Requirements 6.8**

### Property 20: Object keys/values/entries Consistency

*For any* plain object `obj`, the number of elements in `bury(obj).keys.value`, `bury(obj).values.value`, and `bury(obj).entries.value` SHALL all be equal to `Object.keys(obj).length`.

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 21: JSON Round-Trip

*For any* JSON-serializable value `v` (number, string, boolean, null, array, or plain object), `JSON.parse(JSON.stringify(bury(v).value))` SHALL be deeply equal to `JSON.parse(JSON.stringify(v))`.

**Validates: Requirements 10.1, 10.2**

---

## Error Handling

### Nullish 値の扱い

`bury(null)` および `bury(undefined)` はエラーを投げてはならない。
基底クラス `Bury<T>` がそのまま `null` / `undefined` を保持する。
Wrapper サブクラスへのディスパッチは行われないため、
Array/String/Number/Object のメソッドにはアクセスできない（TypeScript コンパイルエラー）。

### 空配列の境界値

`first`, `last`, `min`, `max`, `sum` が空配列に対して呼び出された場合、
`undefined` を保持した `Bury<undefined>` を返す（エラーは投げない）。

### times の引数バリデーション

`value` が負の数または非整数の場合、`times(fn)` は `fn` を一切呼び出さずに
元の `BuryNumber` をそのまま返す（`Math.floor(value)` のイテレーション回数が 0 以下の場合）。

### clamp の min > max

`min > max` の場合、`clamp` は `min` を返す（仕様 6.11）。
これにより常に安全な数値が返る。

### sort の Comparator 省略

`sort` が引数なしで呼ばれた場合（Callable Getter としてのアクセスを含む）、
デフォルト comparator（辞書順ではなく数値昇順相当）を使用する。
具体的には `[...arr].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))` とする。

### 型エラー (TypeScript コンパイル時)

`map` に関数以外を渡す、`pluck` に存在しないキーを渡すなどは
TypeScript コンパイラが compile-time エラーとして検出する。
ランタイムでの防御的チェックは最小限にとどめ、型システムに委ねる。

---

## Testing Strategy

### ツールチェーン

- **テストランナー**: [Vitest](https://vitest.dev/) — Vite との統合が最適
- **PBT ライブラリ**: [fast-check](https://fast-check.io/) — TypeScript 対応が充実している

```bash
npm install --save-dev vitest fast-check
```

### ディレクトリ構成

```
src/
  __tests__/
    bury.test.ts          — エントリポイントの単体テスト
    array.test.ts         — BuryArray の単体・プロパティテスト
    string.test.ts        — BuryString の単体・プロパティテスト
    number.test.ts        — BuryNumber の単体・プロパティテスト
    object.test.ts        — BuryObject の単体・プロパティテスト
    callable.test.ts      — Callable Getter パターンのテスト
    json-interop.test.ts  — JSON ラウンドトリップテスト
```

### 単体テスト方針

単体テストは以下に集中させる:

- 具体的なユースケース例（`bury([1,2,null]).compact.value` など）
- エラー境界条件（空配列、nullish 値、min > max）
- 非 JSON シリアライザブル値の挙動

単体テストは exhaustive な入力カバレッジを目指さず、代表例のみとする。
広い入力カバレッジはプロパティテストに委ねる。

### プロパティテスト方針

fast-check を用いてプロパティテストを実装する。
各プロパティは **最低 100 回** のイテレーション（fast-check のデフォルト）を実行する。

各プロパティテストには設計ドキュメントへの参照コメントを付与する:

```ts
// Feature: bury2-core-library, Property 1: Entry Function Round-Trip
test('bury(v).value === v for any value', () => {
  fc.assert(fc.property(
    fc.anything(),
    (v) => bury(v).value === v
  ));
});
```

**タグ形式**: `Feature: bury2-core-library, Property {番号}: {プロパティ名}`

### 各プロパティのテスト実装方針

| プロパティ | fast-check Arbitrary | 検証内容 |
|-----------|---------------------|----------|
| P1: Entry Round-Trip | `fc.anything()` | `bury(v).value === v` |
| P2: unwrap Equiv | `fc.anything()` | `unwrap() === .value` |
| P3: Callable Getter Equiv | `fc.array(fc.anything())` | getter = call |
| P4: compact removes nullish | `fc.array(fc.option(fc.anything()))` | 結果に null/undefined なし |
| P5: compact idempotent | `fc.array(fc.option(fc.anything()))` | 2回 = 1回 |
| P6: uniq uniqueness | `fc.array(fc.integer())` | 重複なし + 最初の出現 |
| P7: Immutability | `fc.array(fc.integer())` | 元配列不変 |
| P8: sort sorted | `fc.array(fc.integer())` | 昇順 |
| P9: rev reversal | `fc.array(fc.anything())` | 逆順 |
| P10: map length | `fc.array(fc.anything())` | 長さ不変 |
| P11: where predicate | `fc.array(fc.integer())` | 全要素が述語を満たす |
| P12: append/prepend length | `fc.array(fc.anything())` | 長さ増加 |
| P13: union uniqueness | 2つの`fc.array` | 全要素含む+重複なし |
| P14: upcase/downcase | `fc.string({ unit: 'grapheme' })` | ASCII 往復 |
| P15: trim idempotent | `fc.string()` | 2回 = 1回 |
| P16: reverse round-trip | `fc.string()` | 2回 = 元 |
| P17: clamp invariant | `fc.tuple(fc.float(), fc.float(), fc.float())` | [min,max] 内 |
| P18: abs non-negative | `fc.float()` | >= 0 |
| P19: times count | `fc.nat()` | fn が n 回呼ばれる |
| P20: obj keys/values/entries | `fc.object()` | 長さ一致 |
| P21: JSON round-trip | `fc.jsonValue()` | 深い等価 |

### TypeScript 型レベルテスト

型安全性要件（Req 8）は [expect-type](https://github.com/mmkal/expect-type) または
[tsd](https://github.com/tsdjs/tsd) を用いて検証する:

```ts
import { expectTypeOf } from 'expect-type';

// bury([1,2,3]).map(x => x.toString()) → BuryArray<string>
expectTypeOf(bury([1,2,3]).map(x => x.toString())).toEqualTypeOf<BuryArray<string>>();

// bury(42).to_s → BuryString
expectTypeOf(bury(42).to_s).toEqualTypeOf<BuryString>();
```

### 実行コマンド

```bash
# 単一実行 (CI 向け)
npx vitest run

# ウォッチモード (開発時)
npx vitest
```
