/**
 * bury() — Entry point function for the bury2 library.
 *
 * NOTE: This library does NOT modify any native object prototypes.
 * Array.prototype, String.prototype, Number.prototype, and Object.prototype
 * are left completely unchanged. All Ruby-like methods are provided exclusively
 * through the wrapper objects returned by this function.
 */

import { Bury } from './core/base.ts';
import { BuryArray } from './wrappers/array.ts';
import { BuryString } from './wrappers/string.ts';
import { BuryNumber } from './wrappers/number.ts';
import { BuryObject } from './wrappers/object.ts';

/**
 * Wraps an array value in a BuryArray wrapper.
 */
export function bury<T>(value: T[]): BuryArray<T>;

/**
 * Wraps a string value in a BuryString wrapper.
 */
export function bury(value: string): BuryString;

/**
 * Wraps a number value in a BuryNumber wrapper.
 */
export function bury(value: number): BuryNumber;

/**
 * Wraps a plain object value in a BuryObject wrapper.
 */
export function bury<T extends Record<string, unknown>>(value: T): BuryObject<T>;

/**
 * Wraps any other value (including null and undefined) in a base Bury wrapper.
 * null and undefined are accepted without throwing — they are simply wrapped as-is.
 */
export function bury<T>(value: T): Bury<T>;

/**
 * Implementation: dispatches to the appropriate subclass based on runtime type.
 *
 * Dispatch order:
 *  1. Array.isArray  → BuryArray
 *  2. typeof string  → BuryString
 *  3. typeof number  → BuryNumber
 *  4. non-null object → BuryObject
 *  5. everything else (null, undefined, boolean, symbol, bigint, function) → Bury<T>
 */
export function bury(value: unknown): Bury<unknown> {
  if (Array.isArray(value)) {
    return new BuryArray(value);
  }
  if (typeof value === 'string') {
    return new BuryString(value);
  }
  if (typeof value === 'number') {
    return new BuryNumber(value);
  }
  if (value !== null && typeof value === 'object') {
    return new BuryObject(value as Record<string, unknown>);
  }
  // null, undefined, boolean, symbol, bigint, function — wrap as base Bury<T>
  return new Bury(value);
}
