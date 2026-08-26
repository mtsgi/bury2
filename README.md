# bury2

[![npm version](https://img.shields.io/npm/v/bury2.svg)](https://www.npmjs.com/package/bury2)
[![CI](https://github.com/mtsgi/bury2/actions/workflows/ci.yml/badge.svg)](https://github.com/mtsgi/bury2/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-brightgreen.svg)](https://mtsgi.github.io/bury2/)

> **Ruby-like method chains for JavaScript & TypeScript without prototype pollution.**

`bury2` brings the elegance, expressiveness, and productivity of Ruby's Enumerable and core object methods to JavaScript and TypeScript. Unlike previous libraries (such as `bury` v1), `bury2` **never modifies native prototypes** (`Array.prototype`, `String.prototype`, etc.), making it 100% safe for libraries, frameworks, and modern enterprise applications.

---

## 📖 Documentation

- **English Documentation**: [https://mtsgi.github.io/bury2/](https://mtsgi.github.io/bury2/)
- **日本語ドキュメント**: [https://mtsgi.github.io/bury2/ja/](https://mtsgi.github.io/bury2/ja/)

---

## 💎 Key Features

- 🛡️ **Zero Prototype Pollution**: Pure wrapper design. `Array.prototype`, `String.prototype`, `Number.prototype`, and `Object.prototype` remain untouched.
- ⚡ **Callable Getters**: Write `.uniq` or `.uniq()` seamlessly! JavaScript Proxy enables property access and function call syntax side-by-side.
- 🔒 **Pure Immutability**: All transformation methods return new wrappers without mutating the original input data.
- 🎯 **Full TypeScript Type Safety**: Precise type inference through every step of the method chain.
- 🪶 **Zero Dependencies & Lightweight**: No heavy runtime dependencies, ESM and CommonJS dual-packaged.

---

## 📦 Installation

```bash
# npm
npm install bury2

# pnpm
pnpm add bury2

# yarn
yarn add bury2

# bun
bun add bury2
```

---

## 🚀 Quick Start

Wrap any value with `bury()`, chain Ruby-like methods, and extract the result with `.value` or `.unwrap()`.

```typescript
import { bury } from 'bury2';

// ─── Array Processing ──────────────────────────────────────────────────────
const rawUsers = [
  { id: 1, name: ' Alice ', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  null,
  { id: 3, name: ' Charlie', role: 'user' },
  { id: 1, name: ' Alice ', role: 'admin' }, // duplicate
];

const cleanedNames = bury(rawUsers)
  .compact                      // Remove null / undefined
  .uniq                         // Remove duplicates (Callable Getter: .uniq or .uniq())
  .where(u => u.role === 'user') // Filter users
  .pluck('name')                // Extract names -> ['Bob', ' Charlie']
  .trim                         // Trim strings -> ['Bob', 'Charlie']
  .sort                         // Sort alphabetically
  .value;

console.log(cleanedNames); // ['Bob', 'Charlie']

// ─── String Helpers ────────────────────────────────────────────────────────
const title = bury('  hello world  ')
  .trim
  .upcase
  .value;
console.log(title); // "HELLO WORLD"

const slug = bury('Hello World 2026')
  .downcase
  .gsub(/ /g, '-')
  .value;
console.log(slug); // "hello-world-2026"

// ─── Number Operations ─────────────────────────────────────────────────────
const clamped = bury(142.8)
  .floor
  .clamp(0, 100)
  .value;
console.log(clamped); // 100

// ─── Object Introspection ──────────────────────────────────────────────────
const stats = { apples: 5, oranges: 8, bananas: 3 };
const totalFruits = bury(stats)
  .values       // BuryArray<number>
  .sum          // Bury<number>
  .value;
console.log(totalFruits); // 16
```

---

## 🪄 Callable Getters

Methods like `.uniq`, `.compact`, `.trim`, `.rev`, and `.sort` on `BuryArray` and `.upcase`, `.downcase`, `.trim` on `BuryString` are **Callable Getters**. You can use whichever syntax fits your style:

```typescript
// Property access (Ruby-style getter)
bury([1, 2, 2, 3]).uniq.value; // [1, 2, 3]

// Function call (JavaScript-style method)
bury([1, 2, 2, 3]).uniq().value; // [1, 2, 3]

// .sort also accepts an optional comparator when called as a function:
bury([10, 5, 20]).sort((a, b) => b - a).value; // [20, 10, 5]
```

---

## 📚 API Highlights

### `bury(value)`
Dispatches to the appropriate wrapper based on the input type:
- `Array` $\to$ `BuryArray<T>`
- `string` $\to$ `BuryString`
- `number` $\to$ `BuryNumber`
- `object` $\to$ `BuryObject<T>`
- `others` (boolean, null, undefined) $\to$ `Bury<T>`

### Common Methods

| Type | Methods / Properties |
|------|----------------------|
| **Base** | `.value`, `.unwrap()` |
| **Array** | `.compact`, `.uniq`, `.first`, `.last`, `.min`, `.max`, `.sum`, `.size`, `.minmax`, `.rev`, `.sort([cmp])`, `.trim`, `.map(fn)`, `.where(fn)`, `.pluck(key)`, `.min_by(fn)`, `.max_by(fn)`, `.append(...items)`, `.prepend(...items)`, `.union(other)` |
| **String** | `.upcase`, `.downcase`, `.trim`, `.reverse`, `.chop`, `.size`, `.gsub(pattern, replace)`, `.center(width)`, `.prepend(str)` |
| **Number** | `.floor`, `.ceil`, `.abs`, `.next`, `.succ`, `.pred`, `.to_s`, `.times(fn)`, `.clamp(min, max)` |
| **Object** | `.keys`, `.values`, `.entries` |

---

## 🔄 Differences from bury (v1)

| Feature | bury (v1) | bury2 |
|---------|-----------|-------|
| **Architecture** | Native prototype extensions | Pure wrapper (`bury(val)`) |
| **Global Pollution** | Modifies `Array.prototype`, etc. | **Zero global pollution** |
| **Type Safety** | Partial | **Full TypeScript inference** |
| **Immutability** | Mixed (some methods mutate) | **100% Immutable** |
| **Callable Getters** | Not available | `.prop` & `.prop()` supported |

---

## 🛠️ Development

```bash
# Type check
npm run typecheck

# Lint (Oxlint with Type-Aware rules)
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Run tests (Vitest)
npm run test

# Build library (ESM + CJS + Types)
npm run build

# Start docs dev server
npm run docs:dev
```

---

## 📄 License

MIT © [mtsgi](https://github.com/mtsgi)
