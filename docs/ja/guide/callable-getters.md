# Callable Getter 解説

`bury2` の大きな特徴の1つが **Callable Getter**（呼び出し可能ゲッター）です。

Ruby ではメソッドを括弧なしで呼び出せますが（例: `[1, 2, 2].uniq`）、JavaScript/TypeScript では通常 `()` が必要です。

`bury2` では、どちらのスタイルでも自然に書けるよう両方を完全サポートしています:

```typescript
import { bury } from 'bury2';

// 1. プロパティアクセス記法（Ruby 風ゲッタースタイル）
const a = bury([1, 2, 2, 3]).uniq.value; // [1, 2, 3]

// 2. 関数呼び出し記法（標準的な JS/TS メソッドスタイル）
const b = bury([1, 2, 2, 3]).uniq().value; // [1, 2, 3]
```

---

## 仕組み

内部的には JavaScript の `Proxy` を活用して `CallableGetter` を生成しています。

```typescript
export type CallableGetter<T> = T & (() => T);
```

`.uniq` にアクセスした際:
1. ゲッター内で即座に処理結果のラッパーインスタンス `T` を生成します。
2. そのインスタンスへのプロパティアクセスを委譲しつつ、関数として呼び出された場合（`apply` トラップ）には自分自身 `T` を返す `Proxy` を返します。

### 引数を受け取る Callable Getter（例: `.sort`）

Callable Getter は、関数として呼び出された際に任意の引数を受け取ることもできます。例えば `.sort` は次のように動作します:

```typescript
// 引数なし（自然昇順ソート）
bury([10, 5, 20]).sort.value; // [5, 10, 20]
bury([10, 5, 20]).sort().value; // [5, 10, 20]

// カスタム比較関数を渡す場合
bury([10, 5, 20]).sort((a, b) => b - a).value; // [20, 10, 5]
```

---

## Callable Getter 対象一覧

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

## ベストプラクティス

1. **連続チェーン**: 括弧の有無に関わらずスムーズにチェーンを継続できます:
   ```typescript
   bury([' b ', ' a ']).trim.sort.value; // ['a', 'b']
   bury([' b ', ' a ']).trim().sort().value; // ['a', 'b']
   ```
2. **終端のアンラップ**: 外部のAPIやJSONシリアライズに渡す際は、必ず `.value` または `.unwrap()` でアンラップしてください。
