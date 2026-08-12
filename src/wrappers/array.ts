import { Bury } from '../core/base.ts';
import { makeCallableGetter, type CallableGetter } from '../core/callable.ts';

/**
 * BuryArray<T> — Wrapper for array values with Ruby-like methods.
 *
 * All transformation methods return new wrappers and do NOT mutate the original array.
 */
export class BuryArray<T> extends Bury<T[]> {
  constructor(value: T[]) {
    super(value);
  }

  // ─── Getter Methods ───────────────────────────────────────────────────────

  /**
   * Returns a BuryArray containing only non-null/undefined elements.
   * Supports both property access and function call syntax.
   * Req 3.5, 4.1
   */
  get compact(): CallableGetter<BuryArray<NonNullable<T>>> {
    const result = new BuryArray(
      this._value.filter((el): el is NonNullable<T> => el !== null && el !== undefined)
    );
    return makeCallableGetter(result, () => result);
  }

  /**
   * Returns Bury wrapping the first element, or Bury<undefined> for empty arrays.
   * Req 4.3, 4.21
   */
  get first(): Bury<T | undefined> {
    return new Bury<T | undefined>(this._value.length > 0 ? this._value[0] : undefined);
  }

  /**
   * Returns Bury wrapping the last element, or Bury<undefined> for empty arrays.
   * Req 4.4, 4.21
   */
  get last(): Bury<T | undefined> {
    return new Bury<T | undefined>(
      this._value.length > 0 ? this._value[this._value.length - 1] : undefined
    );
  }

  /**
   * Returns Bury wrapping the minimum numeric value, or Bury<undefined> for empty arrays.
   * Req 4.5, 4.21
   */
  get min(): Bury<number | undefined> {
    if (this._value.length === 0) {
      return new Bury<number | undefined>(undefined);
    }
    const nums = this._value as unknown as number[];
    return new Bury<number | undefined>(Math.min(...nums));
  }

  /**
   * Returns Bury wrapping the maximum numeric value, or Bury<undefined> for empty arrays.
   * Req 4.6, 4.21
   */
  get max(): Bury<number | undefined> {
    if (this._value.length === 0) {
      return new Bury<number | undefined>(undefined);
    }
    const nums = this._value as unknown as number[];
    return new Bury<number | undefined>(Math.max(...nums));
  }

  /**
   * Returns Bury wrapping the numeric sum of all elements.
   * Empty array returns Bury<undefined> per Req 4.21.
   * Req 4.7, 4.21
   */
  get sum(): Bury<number | undefined> {
    if (this._value.length === 0) {
      return new Bury<number | undefined>(undefined);
    }
    const nums = this._value as unknown as number[];
    return new Bury<number | undefined>(nums.reduce((acc, n) => acc + n, 0));
  }

  /**
   * Returns Bury wrapping the number of elements.
   * Req 4.8
   */
  get size(): Bury<number> {
    return new Bury<number>(this._value.length);
  }

  /**
   * Returns Bury wrapping [min, max] tuple, or [undefined, undefined] for empty arrays.
   * Req 4.20
   */
  get minmax(): Bury<[T, T] | [undefined, undefined]> {
    if (this._value.length === 0) {
      return new Bury<[T, T] | [undefined, undefined]>([undefined, undefined]);
    }
    const nums = this._value as unknown as number[];
    const minVal = Math.min(...nums) as unknown as T;
    const maxVal = Math.max(...nums) as unknown as T;
    return new Bury<[T, T] | [undefined, undefined]>([minVal, maxVal]);
  }

  /**
   * Returns BuryArray where each string element has whitespace trimmed.
   * Non-string elements are left unchanged.
   * Supports both property access and function call syntax.
   * Req 3.5, 4.11
   */
  get trim(): CallableGetter<BuryArray<T>> {
    const result = new BuryArray(
      this._value.map((el) => (typeof el === 'string' ? (el.trim() as unknown as T) : el))
    );
    return makeCallableGetter(result, () => result);
  }

  // ─── Callable Getters (Proxy-based) ───────────────────────────────────────

  /**
   * Returns BuryArray with duplicate elements removed, preserving first occurrence.
   * Supports both property access and function call syntax.
   * Req 4.2
   */
  get uniq(): CallableGetter<BuryArray<T>> {
    const result = new BuryArray([...new Map(this._value.map((el, i) => [i, el])).values()].filter(
      (el, idx, arr) => arr.findIndex((e) => Object.is(e, el)) === idx
    ));
    return makeCallableGetter(result, () => result);
  }

  /**
   * Returns BuryArray with elements in reversed order (non-mutating).
   * Supports both property access and function call syntax.
   * Req 4.9
   */
  get rev(): CallableGetter<BuryArray<T>> {
    const result = new BuryArray([...this._value].reverse());
    return makeCallableGetter(result, () => result);
  }

  /**
   * Returns BuryArray with elements sorted in ascending order (non-mutating).
   * Supports comparator argument; defaults to natural ordering.
   * Req 4.10
   */
  get sort(): CallableGetter<BuryArray<T>> {
    const defaultComparator = (a: T, b: T): number =>
      a < b ? -1 : a > b ? 1 : 0;
    const result = new BuryArray([...this._value].sort(defaultComparator));
    return makeCallableGetter(
      result,
      (...args: unknown[]) => {
        if (args.length === 0) return result;
        const comparator = args[0] as (a: T, b: T) => number;
        return new BuryArray([...this._value].sort(comparator));
      }
    );
  }

  // ─── Parameterized Methods ────────────────────────────────────────────────

  /**
   * Returns BuryArray with each element transformed by fn.
   * Req 4.12
   */
  map<U>(fn: (el: T) => U): BuryArray<U> {
    return new BuryArray(this._value.map(fn));
  }

  /**
   * Returns BuryArray containing only elements for which fn returns true.
   * Req 4.13
   */
  where(fn: (el: T) => boolean): BuryArray<T> {
    return new BuryArray(this._value.filter(fn));
  }

  /**
   * Returns BuryArray holding the value of the given property from each element.
   * Req 4.14
   */
  pluck<K extends keyof T>(key: K): BuryArray<T[K]> {
    return new BuryArray(this._value.map((el) => el[key]));
  }

  /**
   * Returns Bury wrapping the element for which fn returns the smallest value.
   * Req 4.15
   */
  min_by(fn: (el: T) => number): Bury<T | undefined> {
    if (this._value.length === 0) return new Bury<T | undefined>(undefined);
    const result = this._value.reduce((best, el) => (fn(el) < fn(best) ? el : best));
    return new Bury<T | undefined>(result);
  }

  /**
   * Returns Bury wrapping the element for which fn returns the largest value.
   * Req 4.16
   */
  max_by(fn: (el: T) => number): Bury<T | undefined> {
    if (this._value.length === 0) return new Bury<T | undefined>(undefined);
    const result = this._value.reduce((best, el) => (fn(el) > fn(best) ? el : best));
    return new Bury<T | undefined>(result);
  }

  /**
   * Returns BuryArray with the given elements added to the end.
   * Req 4.17
   */
  append(...elements: T[]): BuryArray<T> {
    return new BuryArray([...this._value, ...elements]);
  }

  /**
   * Returns BuryArray with the given elements added to the beginning.
   * Req 4.18
   */
  prepend(...elements: T[]): BuryArray<T> {
    return new BuryArray([...elements, ...this._value]);
  }

  /**
   * Returns BuryArray containing unique elements from both arrays.
   * Req 4.19
   */
  union(other: T[]): BuryArray<T> {
    const combined = [...this._value, ...other];
    const unique = combined.filter((el, idx) => combined.findIndex((e) => Object.is(e, el)) === idx);
    return new BuryArray(unique);
  }
}
