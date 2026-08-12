# はじめに

**bury2** へようこそ！このガイドでは、ライブラリのインストール、基本的な使い方、値のラップとアンラップについて解説します。

---

## インストール

お使いのパッケージマネージャーでインストールしてください:

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

## 基本思想: `bury()` 関数

`bury2` では、グローバルプロトタイプを変更することはありません。代わりに `bury()` 関数で値をラップし、専用のラッパーインスタンスを生成します:

```typescript
import { bury } from 'bury2';

const wrappedArray = bury([3, 1, 2]);   // BuryArray<number>
const wrappedString = bury('hello');    // BuryString
const wrappedNumber = bury(42);         // BuryNumber
const wrappedObject = bury({ a: 1 });   // BuryObject<{ a: number }>
```

---

## 値のアンラップ

変換や抽出が完了したら、`.value` または `.unwrap()` で元のプリミティブ値や配列を取り出します:

```typescript
const result = bury([1, 2, 2, 3])
  .uniq
  .value; // [1, 2, 3]

// .unwrap() でも同様です:
const sameResult = bury([1, 2, 2, 3])
  .uniq
  .unwrap(); // [1, 2, 3]
```

---

## メソッドチェーンとイミュータビリティ

すべての変換処理は**新しいラッパーオブジェクト**を生成して返します。元の入力配列やオブジェクトが変更（ミューテート）されることはありません:

```typescript
const original = ['  apple  ', ' banana ', ' cherry '];

const processed = bury(original)
  .trim                          // 各文字列要素の空白を除去
  .where(s => s.startsWith('b')) // フィルタリング
  .value;

console.log(processed); // ['banana']
console.log(original);  // ['  apple  ', ' banana ', ' cherry '] (元の値はそのまま保持)
```

---

## 次のステップ

- [Callable Getter 解説](./callable-getters.md)（`.uniq` と `.uniq()` の両立）
- [全 API リファレンス](../api/index.md)
- [実践クックブック](./cookbook.md)
