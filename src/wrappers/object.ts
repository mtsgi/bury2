import { Bury } from '../core/base.ts';
import { BuryArray } from './array.ts';
import { makeCallableGetter, type CallableGetter } from '../core/callable.ts';

/**
 * BuryObject<T> — Wrapper for plain object values with Ruby-like introspection methods.
 *
 * All methods are non-mutating and return new wrappers.
 */
export class BuryObject<T extends Record<string, unknown>> extends Bury<T> {
  constructor(value: T) {
    super(value);
  }

  /**
   * Returns BuryArray holding the object's own enumerable key names.
   * Supports both property access and function call syntax (Callable Getter).
   * Req 7.1, 7.4, 8.4
   */
  get keys(): CallableGetter<BuryArray<string>> {
    const result = new BuryArray(Object.keys(this._value));
    return makeCallableGetter(result, () => result);
  }

  /**
   * Returns BuryArray holding the object's own enumerable values.
   * Req 7.2, 7.4
   */
  get values(): BuryArray<T[keyof T]> {
    return new BuryArray(Object.values(this._value) as T[keyof T][]);
  }

  /**
   * Returns BuryArray holding [key, value] pairs.
   * Req 7.3, 7.4
   */
  get entries(): BuryArray<[string, T[keyof T]]> {
    return new BuryArray(Object.entries(this._value) as [string, T[keyof T]][]);
  }
}
