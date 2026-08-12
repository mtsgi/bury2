# BuryString

The `BuryString` wrapper provides Ruby-like methods for string operations. All methods are non-mutating and return new wrappers.

---

## Callable Getters

### `.upcase`
Converts all characters to uppercase.

```typescript
bury('hello').upcase.value; // "HELLO"
bury('hello').upcase().value; // "HELLO"
```

### `.downcase`
Converts all characters to lowercase.

```typescript
bury('HELLO').downcase.value; // "hello"
```

### `.trim`
Strips leading and trailing whitespace.

```typescript
bury('  ruby  ').trim.value; // "ruby"
```

---

## Standard Getters

### `.reverse: BuryString`
Reverses the characters in the string.

```typescript
bury('stressed').reverse.value; // "desserts"
```

### `.chop: BuryString`
Removes the last character of the string. Empty strings return empty strings.

```typescript
bury('hello!').chop.value; // "hello"
bury('').chop.value; // ""
```

### `.size: Bury<number>`
Returns the character length of the string wrapped in `Bury<number>`.

```typescript
bury('hello').size.value; // 5
```

---

## Methods

### `.gsub(pattern: string | RegExp, replace: string): BuryString`
Replaces all occurrences of `pattern` with `replace`. If a string or non-global RegExp is passed, global replacement is enforced.

```typescript
bury('foo bar foo').gsub('foo', 'baz').value; // "baz bar baz"
bury('2026-08-13').gsub(/-/g, '/').value; // "2026/08/13"
```

### `.center(width: number): BuryString`
Centers the string within the given total `width` by padding with spaces. Extra odd padding is placed on the right.

```typescript
bury('hello').center(10).value; // "  hello   "
bury('hello').center(3).value;  // "hello"
```

### `.prepend(str: string): BuryString`
Concatenates `str` before the current string.

```typescript
bury('World').prepend('Hello, ').value; // "Hello, World"
```
