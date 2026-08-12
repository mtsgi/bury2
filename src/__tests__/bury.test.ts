// Feature: bury2-core-library
// Tests for the bury() entry point function and Bury<T> base class

import * as fc from 'fast-check';
import { bury } from '../bury.ts';
import { BuryArray } from '../wrappers/array.ts';
import { BuryString } from '../wrappers/string.ts';
import { BuryNumber } from '../wrappers/number.ts';
import { BuryObject } from '../wrappers/object.ts';
import { Bury } from '../core/base.ts';

describe('bury', () => {
  // Feature: bury2-core-library, Property 1: Entry Function Round-Trip
  // Validates: Requirements 1.8, 2.1, 2.4
  test('bury(v).value === v for any value', () => {
    fc.assert(fc.property(
      fc.anything(),
      (v) => bury(v as never).value === v
    ));
  });

  // Feature: bury2-core-library, Property 2: unwrap Equivalence
  // Validates: Requirements 2.2
  test('bury(v).unwrap() === bury(v).value for any value', () => {
    fc.assert(fc.property(
      fc.anything(),
      (v) => bury(v as never).unwrap() === bury(v as never).value
    ));
  });

  // Unit tests for entry point dispatch (task 4.2)
  describe('type dispatch', () => {
    test('bury([]) returns BuryArray', () => {
      expect(bury([])).toBeInstanceOf(BuryArray);
    });

    test('bury([1,2,3]) returns BuryArray', () => {
      expect(bury([1, 2, 3])).toBeInstanceOf(BuryArray);
    });

    test('bury("hello") returns BuryString', () => {
      expect(bury('hello')).toBeInstanceOf(BuryString);
    });

    test('bury("") returns BuryString', () => {
      expect(bury('')).toBeInstanceOf(BuryString);
    });

    test('bury(42) returns BuryNumber', () => {
      expect(bury(42)).toBeInstanceOf(BuryNumber);
    });

    test('bury(0) returns BuryNumber', () => {
      expect(bury(0)).toBeInstanceOf(BuryNumber);
    });

    test('bury({}) returns BuryObject', () => {
      expect(bury({})).toBeInstanceOf(BuryObject);
    });

    test('bury({ a: 1 }) returns BuryObject', () => {
      expect(bury({ a: 1 })).toBeInstanceOf(BuryObject);
    });

    test('bury(null) returns Bury (base)', () => {
      expect(bury(null)).toBeInstanceOf(Bury);
      expect(bury(null)).not.toBeInstanceOf(BuryArray);
      expect(bury(null)).not.toBeInstanceOf(BuryString);
    });

    test('bury(undefined) returns Bury (base)', () => {
      expect(bury(undefined)).toBeInstanceOf(Bury);
      expect(bury(undefined)).not.toBeInstanceOf(BuryArray);
    });

    test('bury(null) does not throw', () => {
      expect(() => bury(null)).not.toThrow();
    });

    test('bury(undefined) does not throw', () => {
      expect(() => bury(undefined)).not.toThrow();
    });
  });
});
