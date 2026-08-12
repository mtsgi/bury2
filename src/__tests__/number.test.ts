// Feature: bury2-core-library
// Tests for BuryNumber — unit tests and property-based tests

import { bury } from '../bury.ts';
import * as fc from 'fast-check';

describe('BuryNumber', () => {
  // ─── Unit Tests ───────────────────────────────────────────────────────────

  describe('floor', () => {
    it('floors the value', () => {
      expect(bury(3.7).floor.value).toBe(3);
      expect(bury(-1.2).floor.value).toBe(-2);
      expect(bury(5).floor.value).toBe(5);
    });
  });

  describe('ceil', () => {
    it('ceils the value', () => {
      expect(bury(3.2).ceil.value).toBe(4);
      expect(bury(-1.7).ceil.value).toBe(-1);
      expect(bury(5).ceil.value).toBe(5);
    });
  });

  describe('abs', () => {
    it('returns the absolute value', () => {
      expect(bury(-5).abs.value).toBe(5);
      expect(bury(3).abs.value).toBe(3);
      expect(bury(0).abs.value).toBe(0);
    });
  });

  describe('next', () => {
    it('returns Math.floor(value) + 1', () => {
      expect(bury(3).next.value).toBe(4);
      expect(bury(3.9).next.value).toBe(4);
      expect(bury(-1).next.value).toBe(0);
    });
  });

  describe('succ', () => {
    it('returns the same as next', () => {
      expect(bury(3).succ.value).toBe(bury(3).next.value);
      expect(bury(3.9).succ.value).toBe(bury(3.9).next.value);
    });
  });

  describe('pred', () => {
    it('returns Math.ceil(value) - 1', () => {
      expect(bury(3).pred.value).toBe(2);
      expect(bury(3.1).pred.value).toBe(3);
      expect(bury(-1).pred.value).toBe(-2);
    });
  });

  describe('to_s', () => {
    it('returns a BuryString with the base-10 string representation', () => {
      expect(bury(42).to_s.value).toBe('42');
      expect(bury(-3.14).to_s.value).toBe('-3.14');
      expect(bury(0).to_s.value).toBe('0');
    });
  });

  describe('times', () => {
    it('calls fn for each index from 0 to floor(value)-1', () => {
      const calls: number[] = [];
      bury(3).times((i) => calls.push(i));
      expect(calls).toEqual([0, 1, 2]);
    });

    it('returns the original wrapper unchanged', () => {
      expect(bury(3).times(() => {}).value).toBe(3);
    });

    it('skips fn when value is negative', () => {
      const calls: number[] = [];
      bury(-1).times((i) => calls.push(i));
      expect(calls).toEqual([]);
    });

    it('skips fn when value is fractional less than 1', () => {
      const calls: number[] = [];
      bury(0.9).times((i) => calls.push(i));
      expect(calls).toEqual([]);
    });
  });

  describe('clamp', () => {
    it('constrains the value within [min, max]', () => {
      expect(bury(5).clamp(1, 10).value).toBe(5);
      expect(bury(0).clamp(1, 10).value).toBe(1);
      expect(bury(15).clamp(1, 10).value).toBe(10);
    });

    it('returns min when min > max', () => {
      expect(bury(5).clamp(10, 1).value).toBe(10);
    });
  });

  // ─── Property-Based Tests ─────────────────────────────────────────────────

  // Feature: bury2-core-library, Property 17: floor/ceil Bounds
  it('Property 17: floor(x) <= x <= ceil(x)', () => {
    fc.assert(
      fc.property(fc.float({ noNaN: true }), (n) => {
        expect(bury(n).floor.value).toBeLessThanOrEqual(n);
        expect(bury(n).ceil.value).toBeGreaterThanOrEqual(n);
      })
    );
  });

  // Feature: bury2-core-library, Property 18: abs is Non-Negative
  it('Property 18: abs always returns a non-negative value', () => {
    fc.assert(
      fc.property(fc.float({ noNaN: true }), (n) => {
        expect(bury(n).abs.value).toBeGreaterThanOrEqual(0);
      })
    );
  });

  // Feature: bury2-core-library, Property 19: clamp stays within bounds
  it('Property 19: clamp result is always within [min, max]', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true }),
        fc.float({ noNaN: true }),
        fc.float({ noNaN: true }),
        (n, a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          const result = bury(n).clamp(min, max).value;
          expect(result).toBeGreaterThanOrEqual(min);
          expect(result).toBeLessThanOrEqual(max);
        }
      )
    );
  });
});
