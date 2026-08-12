# Migration from bury (v1)

This guide helps you transition from the legacy `bury` (v1) package to `bury2`.

---

## Why bury2?

`bury` (v1) was designed around modifying global prototypes (e.g. `Array.prototype.uniq = ...`). While convenient in small demo scripts, prototype pollution carries significant risks:
- Conflicts with other libraries or future JavaScript specifications.
- Hard-to-trace bugs across large codebases.
- Incompatibility with strict enterprise environments and security audits.

`bury2` completely reimagines the library with a **pure wrapper design**, **zero prototype pollution**, and **full TypeScript type inference**.

---

## Summary of Changes

| Feature | bury (v1) | bury2 |
|---------|-----------|-------|
| **Entry Point** | Auto-applied upon `import 'bury'` | Explicit wrapper: `bury(value)` |
| **Global Prototype Pollution** | ⚠️ Yes (`Array.prototype`, etc.) | ✅ **Zero pollution** |
| **Unwrapping** | Direct native return | `.value` or `.unwrap()` |
| **Immutability** | Mixed (some methods mutated inplace) | ✅ **100% Guaranteed Immutable** |
| **TypeScript Support** | Partial / ambient type declarations | ✅ **Precise end-to-end generics** |
| **Callable Getters** | Not available | ✅ `.prop` and `.prop()` both work |

---

## Migration Examples

### Array Transformation

::: code-group

```typescript [v1 (Legacy)]
import 'bury';

// Native array modified via prototype extension
const numbers = [1, 2, 2, 3, null];
const result = numbers.compact().uniq();
```

```typescript [v2 (bury2)]
import { bury } from 'bury2';

const numbers = [1, 2, 2, 3, null];
// Wrap with bury() and unwrap with .value
const result = bury(numbers)
  .compact
  .uniq
  .value;
```

:::

---

### String Operations

::: code-group

```typescript [v1 (Legacy)]
import 'bury';

const str = '  hello world  ';
const upper = str.upcase().trim();
```

```typescript [v2 (bury2)]
import { bury } from 'bury2';

const str = '  hello world  ';
const upper = bury(str)
  .upcase
  .trim
  .value;
```

:::

---

## Migration Checklist

1. Replace `import 'bury'` with `import { bury } from 'bury2'`.
2. Wrap targets at the start of method chains: `bury(target)`.
3. Add `.value` or `.unwrap()` at the end of the chain to retrieve raw primitives or arrays.
4. Remove any global prototype declaration augmentations (`global.d.ts`) that were used for v1.
