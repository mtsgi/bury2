import { Bury } from '../core/base.ts';
import { makeCallableGetter, type CallableGetter } from '../core/callable.ts';

/**
 * BuryString — Wrapper for string values with Ruby-like methods.
 *
 * All transformation methods return new wrappers and do NOT mutate the original string.
 */
export class BuryString extends Bury<string> {
  constructor(value: string) {
    super(value);
  }

  // ─── Callable Getters ─────────────────────────────────────────────────────

  /**
   * Returns a BuryString with all characters converted to uppercase.
   * Supports both property access and function call syntax.
   * Req 5.1
   */
  get upcase(): CallableGetter<BuryString> {
    const result = new BuryString(this._value.toUpperCase());
    return makeCallableGetter(result, () => result);
  }

  /**
   * Returns a BuryString with all characters converted to lowercase.
   * Supports both property access and function call syntax.
   * Req 5.2
   */
  get downcase(): CallableGetter<BuryString> {
    const result = new BuryString(this._value.toLowerCase());
    return makeCallableGetter(result, () => result);
  }

  /**
   * Returns a BuryString with leading and trailing whitespace removed.
   * Supports both property access and function call syntax.
   * Req 5.3
   */
  get trim(): CallableGetter<BuryString> {
    const result = new BuryString(this._value.trim());
    return makeCallableGetter(result, () => result);
  }

  // ─── Getter Methods ───────────────────────────────────────────────────────

  /**
   * Returns a BuryString with characters in reversed order.
   * Req 5.4
   */
  get reverse(): BuryString {
    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
      const segmenter = new Intl.Segmenter();
      const chars = Array.from(segmenter.segment(this._value), (s) => s.segment);
      return new BuryString(chars.reverse().join(''));
    }
    return new BuryString(Array.from(this._value).reverse().join(''));
  }

  /**
   * Returns a BuryString with the last character removed.
   * Empty string is returned as-is.
   * Req 5.5
   */
  get chop(): BuryString {
    if (this._value.length === 0) return new BuryString('');
    return new BuryString(this._value.slice(0, -1));
  }

  /**
   * Returns Bury wrapping the number of characters.
   * Req 5.6
   */
  get size(): Bury<number> {
    return new Bury<number>(this._value.length);
  }

  // ─── Parameterized Methods ────────────────────────────────────────────────

  /**
   * Returns a BuryString with all occurrences of pattern replaced by replace.
   * Req 5.7
   */
  gsub(pattern: string | RegExp, replace: string): BuryString {
    // Ensure global replacement: if a string pattern is passed, use replaceAll;
    // if a RegExp is passed, ensure the global flag is set.
    if (typeof pattern === 'string') {
      return new BuryString(this._value.split(pattern).join(replace));
    }
    const globalPattern = pattern.flags.includes('g')
      ? pattern
      : new RegExp(pattern.source, pattern.flags + 'g');
    return new BuryString(this._value.replace(globalPattern, replace));
  }

  /**
   * Returns a BuryString padded with spaces on both sides to reach the specified total width.
   * If the padding cannot be distributed evenly, the extra space goes to the right.
   * Req 5.8
   */
  center(width: number): BuryString {
    const len = this._value.length;
    if (width <= len) return new BuryString(this._value);
    const total = width - len;
    const leftPad = Math.floor(total / 2);
    const rightPad = total - leftPad;
    return new BuryString(' '.repeat(leftPad) + this._value + ' '.repeat(rightPad));
  }

  /**
   * Returns a BuryString with str concatenated before the original string.
   * Req 5.9
   */
  prepend(str: string): BuryString {
    return new BuryString(str + this._value);
  }
}
