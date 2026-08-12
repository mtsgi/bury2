// Feature: bury2-core-library
// Tests for JSON interoperability — round-trip serialization

import { describe, test, expect, it } from 'vitest';
import * as fc from 'fast-check';
import { bury } from '../bury.ts';

describe('JSON interop', () => {
  // Feature: bury2-core-library, Property 21: JSON Round-Trip
  // Validates: Requirements 10.1, 10.2
  test('Property 21: JSON round-trip for serializable values', () => {
    fc.assert(
      fc.property(
        fc.jsonValue(),
        (v) => {
          const result = JSON.parse(JSON.stringify(bury(v).value));
          const expected = JSON.parse(JSON.stringify(v));
          expect(result).toEqual(expected);
        }
      )
    );
  });

  describe('non-serializable values', () => {
    it('bury(undefined).value returns undefined, matching native JSON behavior', () => {
      const wrapped = bury(undefined).value;
      // JSON.stringify(undefined) === undefined (not a string), same as native
      expect(JSON.stringify(wrapped)).toBe(JSON.stringify(undefined));
    });

    it('bury of a function returns the function unchanged, matching native JSON behavior', () => {
      const fn = () => 42;
      const wrapped = bury(fn).value;
      // JSON.stringify of a function returns undefined, same as native
      expect(JSON.stringify(wrapped)).toBe(JSON.stringify(fn));
    });

    it('bury(null).value serializes to "null", same as native', () => {
      const wrapped = bury(null).value;
      expect(JSON.stringify(wrapped)).toBe(JSON.stringify(null));
      expect(JSON.parse(JSON.stringify(null))).toBeNull();
    });
  });
});
