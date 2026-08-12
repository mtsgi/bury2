# BuryString

`BuryString` ラッパーは、文字列操作のための Ruby 風メソッドを提供します。すべてのメソッドは非破壊的であり、新しいラッパーインスタンスを返します。

---

## Callable Getter

### `.upcase`
すべての文字を大文字に変換します。

```typescript
bury('hello').upcase.value; // "HELLO"
bury('hello').upcase().value; // "HELLO"
```

### `.downcase`
すべての文字を小文字に変換します。

```typescript
bury('HELLO').downcase.value; // "hello"
```

### `.trim`
文字列の前後の空白文字を除去します。

```typescript
bury('  ruby  ').trim.value; // "ruby"
```

---

## 通常のゲッター

### `.reverse: BuryString`
文字の並び順を反転させます。

```typescript
bury('stressed').reverse.value; // "desserts"
```

### `.chop: BuryString`
末尾の1文字を削除します。空文字列はそのまま空文字列を返します。

```typescript
bury('hello!').chop.value; // "hello"
bury('').chop.value; // ""
```

### `.size: Bury<number>`
文字列の長さを `Bury<number>` でラップして返します。

```typescript
bury('hello').size.value; // 5
```

---

## メソッド

### `.gsub(pattern: string | RegExp, replace: string): BuryString`
`pattern` に一致するすべての部分を `replace` で置換します。文字列または global フラグのない正規表現が渡された場合でも、自動的に全体置換を行います。

```typescript
bury('foo bar foo').gsub('foo', 'baz').value; // "baz bar baz"
bury('2026-08-13').gsub(/-/g, '/').value; // "2026/08/13"
```

### `.center(width: number): BuryString`
指定した幅 `width` の中央に文字列を配置し、余白をスペースで埋めます。奇数個の余白は右側に配置されます。

```typescript
bury('hello').center(10).value; // "  hello   "
bury('hello').center(3).value;  // "hello"
```

### `.prepend(str: string): BuryString`
文字列の先頭に `str` を連結します。

```typescript
bury('World').prepend('Hello, ').value; // "Hello, World"
```
