// Feature: bury2-core-library
// Tests for BuryArray<T> — unit tests and property-based tests

import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { bury } from '../bury.ts';

describe('BuryArray', () => {
  // Tests will be added in tasks 5.4 through 5.14

  // Feature: bury2-core-library, Property 4: compact Removes Nullish Values
  // Validates: Requirements 4.1, 9.1
  test('Property 4: compact removes null and undefined, preserving relative order of non-nullish elements', () => {
    fc.assert(fc.property(
      // fc.option defaults nil to null; combine with undefined-producing option for full coverage
      fc.array(fc.oneof(
        fc.option(fc.anything()),                      // may produce null
        fc.option(fc.anything(), { nil: undefined }),  // may produce undefined
      )),
      (arr) => {
        const result = bury(arr).compact.value;

        // No null or undefined in result
        const hasNullish = result.some((el) => el === null || el === undefined);
        expect(hasNullish).toBe(false);

        // Relative order preserved: result equals arr with all null/undefined removed
        const expectedOrder = arr.filter((el) => el !== null && el !== undefined);
        expect(result).toEqual(expectedOrder);
      }
    ));
  });

  // Feature: bury2-core-library, Property 5: compact is Idempotent
  // Validates: Requirements 4.1
  test('Property 5: compact applied twice equals compact applied once', () => {
    fc.assert(fc.property(
      fc.array(fc.option(fc.anything())),
      (arr) => {
        const once = bury(arr).compact.value;
        const twice = bury(arr).compact.compact.value;
        expect(twice).toEqual(once);
      }
    ));
  });

  // Feature: bury2-core-library, Property 6: uniq Preserves Uniqueness and First Occurrence
  test('Property 6: uniq preserves uniqueness and retains first occurrence', () => {
    fc.assert(fc.property(
      fc.array(fc.integer()),
      (arr) => {
        const result = bury(arr).uniq.value;

        // Every value appears exactly once
        const seen = new Set<number>();
        for (const el of result) {
          if (seen.has(el)) return false;
          seen.add(el);
        }

        // For each value in result, it is the first occurrence from the original array
        for (const el of result) {
          const firstIndexInOriginal = arr.indexOf(el);
          const indexInResult = result.indexOf(el);
          if (result[indexInResult] !== arr[firstIndexInOriginal]) return false;
        }

        return true;
      }
    ));
  });

  // Feature: bury2-core-library, Property 7: Immutability of Array Operations
  // Validates: Requirements 9.1, 9.4, 9.5, 9.6
  test('Property 7: array operations do not mutate the original array', () => {
    fc.assert(fc.property(
      fc.array(fc.integer()),
      (arr) => {
        const snapshot = [...arr];

        bury(arr).sort.value;
        expect(arr).toEqual(snapshot);

        bury(arr).rev.value;
        expect(arr).toEqual(snapshot);

        bury(arr).compact.value;
        expect(arr).toEqual(snapshot);

        bury(arr).uniq.value;
        expect(arr).toEqual(snapshot);

        bury(arr).map((x) => x).value;
        expect(arr).toEqual(snapshot);

        bury(arr).where(() => true).value;
        expect(arr).toEqual(snapshot);

        bury(arr).append(1).value;
        expect(arr).toEqual(snapshot);

        bury(arr).prepend(1).value;
        expect(arr).toEqual(snapshot);

        bury(arr).union([]).value;
        expect(arr).toEqual(snapshot);
      }
    ));
  });

  // Feature: bury2-core-library, Property 8: sort Returns Sorted Array
  // Validates: Requirements 4.10
  test('Property 8: sort returns array where every adjacent pair satisfies result[i] <= result[i+1]', () => {
    fc.assert(fc.property(
      fc.array(fc.integer()),
      (arr) => {
        const result = bury(arr).sort.value;

        // Every adjacent pair must be in non-descending order
        for (let i = 0; i < result.length - 1; i++) {
          expect(result[i]).toBeLessThanOrEqual(result[i + 1]);
        }
      }
    ));
  });

  // Feature: bury2-core-library, Property 9: rev Reverses Array
  // Validates: Requirements 4.9
  test('Property 9: rev reverses the array so result[i] === arr[arr.length - 1 - i]', () => {
    fc.assert(fc.property(
      fc.array(fc.anything()),
      (arr) => {
        const result = bury(arr).rev.value;

        expect(result.length).toBe(arr.length);
        for (let i = 0; i < arr.length; i++) {
          expect(result[i]).toBe(arr[arr.length - 1 - i]);
        }
      }
    ));
  });

  // Feature: bury2-core-library, Property 10: map Length Invariant
  // Validates: Requirements 4.12
  test('Property 10: map preserves array length for any input array and mapping function', () => {
    fc.assert(fc.property(
      fc.array(fc.anything()),
      (arr) => {
        const result = bury(arr).map((x) => x).value;
        expect(result.length).toBe(arr.length);
      }
    ));
  });

  // Feature: bury2-core-library, Property 11: where Predicate Satisfaction
  // Validates: Requirements 4.13
  test('Property 11: every element in where(fn).value satisfies fn', () => {
    fc.assert(fc.property(
      fc.array(fc.integer()),
      (arr) => {
        const predicate = (x: number) => x % 2 === 0;
        const result = bury(arr).where(predicate).value;

        for (const el of result) {
          expect(predicate(el)).toBe(true);
        }
      }
    ));
  });

  // Feature: bury2-core-library, Property 12: append and prepend Length Invariant
  // Validates: Requirements 4.17, 4.18
  test('Property 12: append and prepend each increase length by the number of added elements', () => {
    fc.assert(fc.property(
      fc.array(fc.anything()),
      fc.array(fc.anything()),
      (arr, els) => {
        const appendResult = bury(arr).append(...els).value;
        expect(appendResult.length).toBe(arr.length + els.length);

        const prependResult = bury(arr).prepend(...els).value;
        expect(prependResult.length).toBe(arr.length + els.length);
      }
    ));
  });

  // Feature: bury2-core-library, Property 13: union Contains All Unique Elements
  // Validates: Requirements 4.19
  test('Property 13: union contains all elements from both arrays with no duplicates', () => {
    fc.assert(fc.property(
      fc.array(fc.integer()),
      fc.array(fc.integer()),
      (a, b) => {
        const result = bury(a).union(b).value;

        // Every element from a and b appears in result
        for (const el of a) {
          expect(result).toContain(el);
        }
        for (const el of b) {
          expect(result).toContain(el);
        }

        // No duplicates: each element appears exactly once
        const seen = new Set<number>();
        for (const el of result) {
          expect(seen.has(el)).toBe(false);
          seen.add(el);
        }
      }
    ));
  });

  // ─── Unit Tests ───────────────────────────────────────────────────────────
  describe('unit tests', () => {
    test('first and last return elements or undefined', () => {
      expect(bury([1, 2, 3]).first.value).toBe(1);
      expect(bury([1, 2, 3]).last.value).toBe(3);
      expect(bury([]).first.value).toBeUndefined();
      expect(bury([]).last.value).toBeUndefined();
    });

    test('min, max, sum return correct values or undefined for empty', () => {
      expect(bury([3, 1, 4, 1, 5]).min.value).toBe(1);
      expect(bury([3, 1, 4, 1, 5]).max.value).toBe(5);
      expect(bury([1, 2, 3, 4]).sum.value).toBe(10);
      expect(bury([]).min.value).toBeUndefined();
      expect(bury([]).max.value).toBeUndefined();
      expect(bury([]).sum.value).toBeUndefined();
    });

    test('size returns element count', () => {
      expect(bury([1, 2, 3]).size.value).toBe(3);
      expect(bury([]).size.value).toBe(0);
    });

    test('minmax returns [min, max] or [undefined, undefined]', () => {
      expect(bury([5, 2, 9, 1]).minmax.value).toEqual([1, 9]);
      expect(bury([]).minmax.value).toEqual([undefined, undefined]);
    });

    test('trim removes whitespace from string elements', () => {
      expect(bury(['  a  ', 'b ', ' c']).trim.value).toEqual(['a', 'b', 'c']);
      expect(bury(['  a  ', 'b ']).trim().value).toEqual(['a', 'b']);
    });

    test('pluck extracts property from objects', () => {
      const items = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
      expect(bury(items).pluck('name').value).toEqual(['Alice', 'Bob']);
      expect(bury(items).pluck('id').value).toEqual([1, 2]);
    });

    test('min_by and max_by return element with min/max transformed value', () => {
      const items = [{ v: 3 }, { v: 1 }, { v: 5 }];
      expect(bury(items).min_by((x) => x.v).value).toEqual({ v: 1 });
      expect(bury(items).max_by((x) => x.v).value).toEqual({ v: 5 });
      expect(bury([]).min_by(() => 0).value).toBeUndefined();
      expect(bury([]).max_by(() => 0).value).toBeUndefined();
    });

    test('append and prepend add elements to end and start', () => {
      expect(bury([1, 2]).append(3, 4).value).toEqual([1, 2, 3, 4]);
      expect(bury([3, 4]).prepend(1, 2).value).toEqual([1, 2, 3, 4]);
    });
  });
});
