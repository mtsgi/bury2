/**
 * bury2 — Public API
 *
 * Entry point for the bury2 library. Import from this module to access
 * all public classes, functions, and types.
 */

export { bury } from './bury.ts';
export { Bury } from './core/base.ts';
export { BuryArray } from './wrappers/array.ts';
export { BuryString } from './wrappers/string.ts';
export { BuryNumber } from './wrappers/number.ts';
export { BuryObject } from './wrappers/object.ts';
export type { CallableGetter } from './core/callable.ts';
