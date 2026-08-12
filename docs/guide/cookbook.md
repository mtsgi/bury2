# Cookbook & Practical Patterns

Explore real-world use cases and recipes for `bury2`.

---

## 1. Cleaning & Normalizing Data

Clean dirty CSV or form inputs containing leading/trailing whitespace, null values, and duplicate entries:

```typescript
import { bury } from 'bury2';

const rawInputs = ['  Alice  ', 'bob', null, '  ALICE  ', 'bob ', undefined, ' Charlie '];

const cleaned = bury(rawInputs)
  .compact                      // Strip null / undefined
  .map(s => s.toLowerCase())    // Lowercase
  .trim                         // Trim whitespace on each item
  .uniq                         // Deduplicate
  .sort                         // Sort alphabetically
  .value;

console.log(cleaned); // ['alice', 'bob', 'charlie']
```

---

## 2. Object Analytics & Aggregations

Sum up inventory counts or extract statistics from a dictionary object:

```typescript
import { bury } from 'bury2';

const inventory = {
  apples: 120,
  bananas: 80,
  oranges: 45,
  strawberries: 200,
};

// Calculate total count
const totalCount = bury(inventory)
  .values       // BuryArray<number>
  .sum          // Bury<number>
  .value;       // 445

// Get min and max stock
const [minStock, maxStock] = bury(inventory)
  .values
  .minmax
  .value; // [45, 200]
```

---

## 3. Top-N Ranking and Filtering

Filter users by threshold and find extreme values with `max_by` and `min_by`:

```typescript
import { bury } from 'bury2';

const users = [
  { name: 'Diana', score: 94, active: true },
  { name: 'Bruce', score: 88, active: false },
  { name: 'Clark', score: 99, active: true },
  { name: 'Barry', score: 91, active: true },
];

// Find highest scoring active user
const topActiveUser = bury(users)
  .where(u => u.active)
  .max_by(u => u.score)
  .value;

console.log(topActiveUser); // { name: 'Clark', score: 99, active: true }
```

---

## 4. URL Slug Generator

Create sanitized URL slugs with `BuryString` methods:

```typescript
import { bury } from 'bury2';

function generateSlug(text: string): string {
  return bury(text)
    .trim
    .downcase
    .gsub(/[^a-z0-9]+/g, '-')
    .value;
}

console.log(generateSlug('  Hello World! Ruby & TypeScript 2026 '));
// "hello-world-ruby-typescript-2026"
```

---

## 5. Number Formatting & Boundaries

Clamp scores and convert to padded strings:

```typescript
import { bury } from 'bury2';

const rawScore = 155.7;

const display = bury(rawScore)
  .floor
  .clamp(0, 100)
  .to_s
  .prepend('Score: ')
  .value;

console.log(display); // "Score: 100"
```
