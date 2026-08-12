# API リファレンス概要

`bury2` ライブラリは、メインエントリポイントとなる `bury()` 関数、基底ラッパークラス `Bury<T>`、および各データ型に応じたサブクラスラッパーを提供します。

---

## `bury(value)`

JavaScript/TypeScript のあらゆる値を対応する Bury ラッパーに包むファクトリ関数です。

```typescript
function bury<T>(value: T[]): BuryArray<T>;
function bury(value: string): BuryString;
function bury(value: number): BuryNumber;
function bury<T extends Record<string, unknown>>(value: T): BuryObject<T>;
function bury<T>(value: T): Bury<T>;
```

### 型ディスパッチ一覧

| 入力値の型 | 返却されるラッパークラス |
|------------|--------------------------|
| `Array` | `BuryArray<T>` |
| `string` | `BuryString` |
| `number` | `BuryNumber` |
| `Record<string, unknown>` | `BuryObject<T>` |
| `boolean`, `null`, `undefined` など | `Bury<T>` (基底クラス) |

---

## 基底クラス: `Bury<T>`

すべてのラッパークラスは `Bury<T>` を継承しています。

### プロパティ & メソッド

#### `.value: T`
内部に保持されている生の値を返却するゲッターです。

```typescript
bury(42).value; // 42
```

#### `.unwrap(): T`
内部の生値を返却するメソッド（`.value` のエイリアス）です。

```typescript
bury([1, 2, 3]).unwrap(); // [1, 2, 3]
```

---

## サブクラス一覧

- [**BuryArray&lt;T&gt;**](./array.md): 配列操作、Enumerable 処理、統計計算。
- [**BuryString**](./string.md): 文字列加工、大文字小文字変換、正規表現置換。
- [**BuryNumber**](./number.md): 数値丸め、範囲制限（クランプ）、繰り返し処理。
- [**BuryObject&lt;T&gt;**](./object.md): オブジェクトのキー・値・エントリの取得。
