# Implementation Plan: bury2 Core Library

## Overview

TypeScript + Vite プロジェクトに Vitest と fast-check を追加し、
`Bury<T>` 基底クラス → Callable Getter Proxy → 各型ラッパー → エントリポイント → 公開 API
の順で段階的に実装する。各ステップで単体テストとプロパティテストを追加し、
チェーン全体の型安全性・Immutability・Callable Getter 動作を担保する。

---

## Tasks

- [x] 1. プロジェクトセットアップ
  - [x] 1.1 Vitest と fast-check をインストールし、tsconfig と vite.config を調整する
    - `vitest` と `fast-check` を devDependencies に追加する
    - `package.json` の `scripts` に `"test": "vitest run"` と `"test:watch": "vitest"` を追加する
    - `tsconfig.json` の `types` に `"vitest/globals"` を追加し、`include` に `"src/__tests__"` パスが含まれることを確認する
    - `vite.config.ts` (または `.js`) に `test: { globals: true }` を追加する
    - _Requirements: テスト戦略（design.md）_

  - [x] 1.2 `src/__tests__/` ディレクトリと空のテストファイルを作成する
    - `bury.test.ts`, `array.test.ts`, `string.test.ts`, `number.test.ts`, `object.test.ts`, `callable.test.ts`, `json-interop.test.ts` を作成する
    - _Requirements: design.md テストディレクトリ構成_

- [x] 2. `Bury<T>` 基底クラス
  - [x] 2.1 `src/core/base.ts` に `Bury<T>` 基底クラスを実装する
    - `protected readonly _value: T` フィールドを持つ
    - `get value(): T` プロパティを実装する
    - `unwrap(): T` メソッドを実装する
    - _Requirements: 1.1, 1.8, 2.1, 2.2, 2.3, 2.4_

  - [x] 2.2 Property 1 (Entry Round-Trip) と Property 2 (unwrap Equivalence) のプロパティテストを書く
    - **Property 1: Entry Function Round-Trip**
    - **Validates: Requirements 1.8, 2.1, 2.4**
    - **Property 2: unwrap Equivalence**
    - **Validates: Requirements 2.2**
    - `fc.anything()` を使い `bury(v).value === v` および `bury(v).unwrap() === bury(v).value` を検証する
    - _テストファイル: `src/__tests__/bury.test.ts`_

- [x] 3. Callable Getter Proxy ユーティリティ
  - [x] 3.1 `src/core/callable.ts` に `makeCallableGetter` ユーティリティと型を実装する
    - `CallableGetter<W>` 型エイリアスを定義する
    - `makeCallableGetter(zeroArgResult, impl)` 関数を実装する: 引数なし呼び出し・プロパティアクセスでは `zeroArgResult` を返し、引数あり呼び出しでは `impl(...args)` を返す
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Callable Getter の単体テストを書く
    - getter アクセスと引数なし呼び出しが同値を返すことを検証する
    - 引数あり呼び出しが `impl` に委譲されることを検証する
    - _テストファイル: `src/__tests__/callable.test.ts`_

- [x] 4. エントリポイント関数 `bury()`
  - [x] 4.1 `src/bury.ts` にエントリポイント関数を実装する
    - 型オーバーロード (`T[]`, `string`, `number`, `Record<string, unknown>`, `T`) を定義する
    - `Array.isArray` / `typeof` でディスパッチし、適切なサブクラスを返す（サブクラスは stub でよい）
    - `null` / `undefined` でも例外を投げず `Bury<T>` を返す
    - ネイティブプロトタイプを一切変更しないことをコメントで明示する
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 4.2 エントリポイントの単体テストを書く
    - 各型（array / string / number / object / null / undefined）で正しいサブクラスが返ることを検証する
    - _テストファイル: `src/__tests__/bury.test.ts`_

- [x] 5. `BuryArray<T>` の実装
  - [x] 5.1 `src/wrappers/array.ts` にゲッターメソッドを実装する
    - `compact`, `first`, `last`, `min`, `max`, `sum`, `size`, `minmax`, `trim` を getter として実装する
    - 空配列で `first`, `last`, `min`, `max`, `sum` が `undefined` を返すことを確認する
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.20, 4.21, 4.11_

  - [x] 5.2 `src/wrappers/array.ts` に Callable Getter メソッド（`uniq`, `rev`, `sort`）を実装する
    - Proxy を用いて `uniq`, `rev`, `sort` を Callable Getter として実装する
    - `sort` はデフォルト comparator `(a, b) => a < b ? -1 : a > b ? 1 : 0` を使用する
    - 元配列を変更しないために `[...this._value]` でコピーする
    - _Requirements: 4.2, 4.9, 4.10, 9.1, 9.4, 9.5_

  - [x] 5.3 `src/wrappers/array.ts` にパラメータ付きメソッドを実装する
    - `map`, `where`, `pluck`, `min_by`, `max_by`, `append`, `prepend`, `union` を実装する
    - _Requirements: 4.12, 4.13, 4.14, 4.15, 4.16, 4.17, 4.18, 4.19_

  - [x] 5.4 Property 3 (Callable Getter Equivalence) のプロパティテストを書く
    - **Property 3: Callable Getter Equivalence**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.5**
    - `fc.array(fc.anything())` を使い `bury(arr).m.value` deepEquals `bury(arr).m().value` を検証する（`uniq`, `rev`, `sort` 対象）
    - _テストファイル: `src/__tests__/callable.test.ts`_

  - [x] 5.5 Property 4 (compact removes nullish) のプロパティテストを書く
    - **Property 4: compact Removes Nullish Values**
    - **Validates: Requirements 4.1, 9.1**
    - `fc.array(fc.option(fc.anything()))` を使い結果に `null`/`undefined` が含まれないことを検証する
    - _テストファイル: `src/__tests__/array.test.ts`_

  - [x] 5.6 Property 5 (compact idempotent) のプロパティテストを書く
    - **Property 5: compact is Idempotent**
    - **Validates: Requirements 4.1**
    - _テストファイル: `src/__tests__/array.test.ts`_

  - [x] 5.7 Property 6 (uniq uniqueness) のプロパティテストを書く
    - **Property 6: uniq Preserves Uniqueness and First Occurrence**
    - **Validates: Requirements 4.2**
    - `fc.array(fc.integer())` を使い重複なし・最初の出現保持を検証する
    - _テストファイル: `src/__tests__/array.test.ts`_

  - [x] 5.8 Property 7 (Immutability) のプロパティテストを書く
    - **Property 7: Immutability of Array Operations**
    - **Validates: Requirements 9.1, 9.4, 9.5, 9.6**
    - `fc.array(fc.integer())` を使い sort / rev / compact / uniq / map / where / append / prepend / union 後に元配列が変更されないことを検証する
    - _テストファイル: `src/__tests__/array.test.ts`_

  - [x] 5.9 Property 8 (sort sorted) のプロパティテストを書く
    - **Property 8: sort Returns Sorted Array**
    - **Validates: Requirements 4.10**
    - `fc.array(fc.integer())` を使い隣接ペアが `arr[i] <= arr[i+1]` を満たすことを検証する
    - _テストファイル: `src/__tests__/array.test.ts`_

  - [x] 5.10 Property 9 (rev reversal) のプロパティテストを書く
    - **Property 9: rev Reverses Array**
    - **Validates: Requirements 4.9**
    - `fc.array(fc.anything())` を使いインデックス対応を検証する
    - _テストファイル: `src/__tests__/array.test.ts`_

  - [x] 5.11 Property 10 (map length invariant) のプロパティテストを書く
    - **Property 10: map Length Invariant**
    - **Validates: Requirements 4.12**
    - _テストファイル: `src/__tests__/array.test.ts`_

  - [x] 5.12 Property 11 (where predicate satisfaction) のプロパティテストを書く
    - **Property 11: where Predicate Satisfaction**
    - **Validates: Requirements 4.13**
    - _テストファイル: `src/__tests__/array.test.ts`_

  - [x] 5.13 Property 12 (append/prepend length invariant) のプロパティテストを書く
    - **Property 12: append and prepend Length Invariant**
    - **Validates: Requirements 4.17, 4.18**
    - _テストファイル: `src/__tests__/array.test.ts`_

  - [x] 5.14 Property 13 (union uniqueness) のプロパティテストを書く
    - **Property 13: union Contains All Unique Elements**
    - **Validates: Requirements 4.19**
    - 2 つの `fc.array(fc.integer())` を使い全要素含む・重複なしを検証する
    - _テストファイル: `src/__tests__/array.test.ts`_

- [x] 6. チェックポイント — BuryArray テスト通過確認
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. `BuryString` の実装
  - [x] 7.1 `src/wrappers/string.ts` に Callable Getter メソッドと Getter Methods を実装する
    - `upcase`, `downcase`, `trim` を Callable Getter として実装する
    - `reverse`, `chop`, `size` を通常 getter として実装する
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 7.2 `src/wrappers/string.ts` にパラメータ付きメソッドを実装する
    - `gsub(pattern, replace)`, `center(width)`, `prepend(str)` を実装する
    - _Requirements: 5.7, 5.8, 5.9_

  - [x] 7.3 Property 14 (upcase/downcase round-trip) のプロパティテストを書く
    - **Property 14: String upcase/downcase Round-Trip**
    - **Validates: Requirements 5.1, 5.2**
    - `fc.string({ unit: 'grapheme' })` を使い ASCII 文字列で往復一致を検証する
    - _テストファイル: `src/__tests__/string.test.ts`_

  - [x] 7.4 Property 15 (trim idempotence) のプロパティテストを書く
    - **Property 15: String trim Idempotence**
    - **Validates: Requirements 5.3**
    - `fc.string()` を使い 2 回適用 = 1 回適用を検証する
    - _テストファイル: `src/__tests__/string.test.ts`_

  - [x] 7.5 Property 16 (reverse round-trip) のプロパティテストを書く
    - **Property 16: String reverse Round-Trip**
    - **Validates: Requirements 5.4**
    - `fc.string()` を使い 2 回適用 = 元の文字列を検証する
    - _テストファイル: `src/__tests__/string.test.ts`_

- [x] 8. `BuryNumber` の実装
  - [x] 8.1 `src/wrappers/number.ts` に Getter Methods を実装する
    - `floor`, `ceil`, `abs`, `next`, `succ`, `pred`, `to_s` を getter として実装する
    - `succ` は `next` と同値にする
    - `to_s` は `BuryString` を返す
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [x] 8.2 `src/wrappers/number.ts` にパラメータ付きメソッドを実装する
    - `times(fn)` を実装する: 負数・非整数では `fn` を呼ばない
    - `clamp(min, max)` を実装する: `min > max` のとき `min` を返す
    - _Requirements: 6.8, 6.9, 6.10, 6.11_

  - [x] 8.3 Property 17 (clamp invariant) のプロパティテストを書く
    - **Property 17: Number clamp Invariant**
    - **Validates: Requirements 6.10**
    - `fc.tuple(fc.float(), fc.float(), fc.float())` を使い `min <= result <= max` を検証する
    - _テストファイル: `src/__tests__/number.test.ts`_

  - [x] 8.4 Property 18 (abs non-negativity) のプロパティテストを書く
    - **Property 18: Number abs Non-Negativity**
    - **Validates: Requirements 6.3**
    - `fc.float()` を使い結果が `>= 0` を検証する
    - _テストファイル: `src/__tests__/number.test.ts`_

  - [x] 8.5 Property 19 (times call count) のプロパティテストを書く
    - **Property 19: times Call Count**
    - **Validates: Requirements 6.8**
    - `fc.nat()` を使い `fn` がちょうど `n` 回呼ばれることを検証する
    - _テストファイル: `src/__tests__/number.test.ts`_

- [x] 9. `BuryObject<T>` の実装
  - [x] 9.1 `src/wrappers/object.ts` に `keys`, `values`, `entries` を実装する
    - `keys` を Callable Getter として実装する
    - `values`, `entries` を通常 getter として実装する
    - 空オブジェクト `{}` で空配列を返すことを確認する
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 9.2 Property 20 (Object keys/values/entries consistency) のプロパティテストを書く
    - **Property 20: Object keys/values/entries Consistency**
    - **Validates: Requirements 7.1, 7.2, 7.3**
    - `fc.object()` を使い 3 つの長さが `Object.keys(obj).length` と等しいことを検証する
    - _テストファイル: `src/__tests__/object.test.ts`_

- [x] 10. チェックポイント — 全ラッパーテスト通過確認
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. 公開 API エクスポートと JSON Interop テスト
  - [x] 11.1 `src/index.ts` に公開 API をエクスポートする
    - `bury`, `Bury`, `BuryArray`, `BuryString`, `BuryNumber`, `BuryObject` をエクスポートする
    - `CallableGetter` 型をエクスポートする
    - _Requirements: 1.1, 8.1_

  - [x] 11.2 Property 21 (JSON round-trip) のプロパティテストを書く
    - **Property 21: JSON Round-Trip**
    - **Validates: Requirements 10.1, 10.2**
    - `fc.jsonValue()` を使い `JSON.parse(JSON.stringify(bury(v).value))` が元値と深い等価を検証する
    - 非シリアライザブル値（`undefined`, 関数）のネイティブ動作一致も単体テストで確認する
    - _テストファイル: `src/__tests__/json-interop.test.ts`_

- [x] 12. TypeScript 型レベルテスト
  - [x] 12.1 `expect-type` をインストールし、型レベルテストを実装する
    - `npm install --save-dev expect-type` を実行する
    - `src/__tests__/types.test.ts` を作成し `expectTypeOf` で型推論を検証する
    - `bury([]).map(x => x.toString())` → `BuryArray<string>` を検証する
    - `bury(42).to_s` → `BuryString` を検証する
    - `bury({}).keys` → `BuryArray<string>` を検証する
    - `bury('').size` → `Bury<number>` を検証する
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [x] 13. 最終チェックポイント — 全テスト通過確認
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- タスク名に `*` が付いているサブタスクはオプションであり、MVP の場合はスキップ可能
- 各タスクは requirements の特定サブ要件を参照しているためトレーサビリティが確保されている
- チェックポイントで段階的に動作確認を行い、リグレッションを早期発見する
- プロパティテストは fast-check のデフォルト（100 イテレーション）を使用する
- 各プロパティテストには `// Feature: bury2-core-library, Property {番号}: {名前}` コメントを付与する
- `sort` のデフォルト comparator は辞書順でなく `(a, b) => a < b ? -1 : a > b ? 1 : 0` を使用する

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2", "4.1"] },
    { "id": 4, "tasks": ["4.2", "5.1"] },
    { "id": 5, "tasks": ["5.2", "5.4"] },
    { "id": 6, "tasks": ["5.3", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10"] },
    { "id": 7, "tasks": ["5.11", "5.12", "5.13", "5.14", "7.1", "8.1", "9.1"] },
    { "id": 8, "tasks": ["7.2", "7.3", "7.4", "7.5", "8.2", "9.2"] },
    { "id": 9, "tasks": ["8.3", "8.4", "8.5", "11.1"] },
    { "id": 10, "tasks": ["11.2", "12.1"] }
  ]
}
```
