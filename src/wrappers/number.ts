import { Bury } from '../core/base.ts';
import { BuryString } from './string.ts';

/**
 * BuryNumber — Wrapper for number values with Ruby-like methods.
 *
 * All transformation methods return new wrappers and do NOT mutate the original number.
 */
export class BuryNumber extends Bury<number> {
  constructor(value: number) {
    super(value);
  }

  // ─── Getter Methods ───────────────────────────────────────────────────────

  /**
   * Returns a BuryNumber with the floor of the value.
   * Req 6.1
   */
  get floor(): BuryNumber {
    return new BuryNumber(Math.floor(this._value));
  }

  /**
   * Returns a BuryNumber with the ceiling of the value.
   * Req 6.2
   */
  get ceil(): BuryNumber {
    return new BuryNumber(Math.ceil(this._value));
  }

  /**
   * Returns a BuryNumber with the absolute value.
   * Req 6.3
   */
  get abs(): BuryNumber {
    return new BuryNumber(Math.abs(this._value));
  }

  /**
   * Returns a BuryNumber with Math.floor(value) + 1.
   * Req 6.4
   */
  get next(): BuryNumber {
    return new BuryNumber(Math.floor(this._value) + 1);
  }

  /**
   * Returns a BuryNumber with Math.floor(value) + 1 (same as next).
   * Req 6.5
   */
  get succ(): BuryNumber {
    return this.next;
  }

  /**
   * Returns a BuryNumber with Math.ceil(value) - 1.
   * Req 6.6
   */
  get pred(): BuryNumber {
    return new BuryNumber(Math.ceil(this._value) - 1);
  }

  /**
   * Returns a BuryString with the base-10 string representation of the value.
   * Req 6.7
   */
  get to_s(): BuryString {
    return new BuryString(String(this._value));
  }

  // ─── Parameterized Methods ────────────────────────────────────────────────

  /**
   * Calls fn for each integer from 0 to Math.floor(value) - 1.
   * If value is negative or floor(value) <= 0, fn is never called.
   * Returns this.
   * Req 6.8, 6.9
   */
  times(fn: (i: number) => void): this {
    const count = Math.floor(this._value);
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        fn(i);
      }
    }
    return this;
  }

  /**
   * Returns a BuryNumber with value clamped to [min, max].
   * If min > max, returns min.
   * Req 6.10, 6.11
   */
  clamp(min: number, max: number): BuryNumber {
    if (min > max) return new BuryNumber(min);
    return new BuryNumber(Math.min(Math.max(this._value, min), max));
  }
}
