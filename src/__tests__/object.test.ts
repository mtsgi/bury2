// Feature: bury2-core-library
// Tests for BuryObject<T> — unit tests and property-based tests

import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { bury } from '../bury.ts';

describe('BuryObject', () => {
  // ─── Unit tests ────────────────────────────────────────────────────────────

  test('keys returns an array of own enumerable keys', () => {
    expect(bury({ a: 1, b: 2, c: 3 }).keys.value).toEqual(['a', 'b', 'c']);
  });

  test('values returns an array of own enumerable values', () => {
    expect(bury({ a: 1, b: 2 }).values.value).toEqual([1, 2]);
  });

  test('entries returns [key, value] pairs', () => {
    expect(bury({ x: 10 }).entries.value).toEqual([['x', 10]]);
  });

  test('empty object returns empty arrays for keys/values/entries', () => {
    const wrapped = bury({});
    expect(wrapped.keys.value).toEqual([]);
    expect(wrapped.values.value).toEqual([]);
    expect(wrapped.entries.value).toEqual([]);
  });

  test('keys is a Callable Getter: property access equals function call', () => {
    const obj = { a: 1, b: 2 };
    const wrapped = bury(obj);
    expect(wrapped.keys.value).toEqual(wrapped.keys().value);
  });

  // ─── Property-based tests ──────────────────────────────────────────────────

  // Feature: bury2-core-library, Property 20: Object keys/values/entries Consistency
  test('Property 20: keys, values, and entries lengths all equal Object.keys(obj).length', () => {
    // Validates: Requirements 7.1, 7.2, 7.3
    fc.assert(
      fc.property(
        fc.object(),
        (obj) => {
          const expected = Object.keys(obj).length;
          const wrapped = bury(obj);
          return (
            wrapped.keys.value.length === expected &&
            wrapped.values.value.length === expected &&
            wrapped.entries.value.length === expected
          );
        }
      )
    );
  });
});
