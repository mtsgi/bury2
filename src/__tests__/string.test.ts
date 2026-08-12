// Feature: bury2-core-library
// Tests for BuryString — unit tests and property-based tests

import { bury } from '../bury.ts';
import * as fc from 'fast-check';

describe('BuryString', () => {
  // ─── Unit Tests ───────────────────────────────────────────────────────────

  describe('upcase', () => {
    it('converts to uppercase', () => {
      expect(bury('hello').upcase.value).toBe('HELLO');
      expect(bury('Hello World').upcase.value).toBe('HELLO WORLD');
      expect(bury('').upcase.value).toBe('');
    });

    it('Callable Getter: property access and call return the same value', () => {
      const w = bury('hello');
      expect(w.upcase.value).toBe(w.upcase().value);
    });
  });

  describe('downcase', () => {
    it('converts to lowercase', () => {
      expect(bury('HELLO').downcase.value).toBe('hello');
      expect(bury('Hello World').downcase.value).toBe('hello world');
      expect(bury('').downcase.value).toBe('');
    });

    it('Callable Getter: property access and call return the same value', () => {
      const w = bury('HELLO');
      expect(w.downcase.value).toBe(w.downcase().value);
    });
  });

  describe('trim', () => {
    it('removes leading and trailing whitespace', () => {
      expect(bury('  hello  ').trim.value).toBe('hello');
      expect(bury('\t hi \n').trim.value).toBe('hi');
      expect(bury('no-spaces').trim.value).toBe('no-spaces');
      expect(bury('').trim.value).toBe('');
    });

    it('Callable Getter: property access and call return the same value', () => {
      const w = bury('  hello  ');
      expect(w.trim.value).toBe(w.trim().value);
    });
  });

  describe('reverse', () => {
    it('reverses the string', () => {
      expect(bury('hello').reverse.value).toBe('olleh');
      expect(bury('abc').reverse.value).toBe('cba');
      expect(bury('').reverse.value).toBe('');
      expect(bury('a').reverse.value).toBe('a');
    });
  });

  describe('chop', () => {
    it('removes the last character', () => {
      expect(bury('hello').chop.value).toBe('hell');
      expect(bury('a').chop.value).toBe('');
      expect(bury('ab').chop.value).toBe('a');
    });

    it('returns empty string unchanged', () => {
      expect(bury('').chop.value).toBe('');
    });
  });

  describe('size', () => {
    it('returns the number of characters', () => {
      expect(bury('hello').size.value).toBe(5);
      expect(bury('').size.value).toBe(0);
      expect(bury('abc').size.value).toBe(3);
    });
  });

  describe('gsub', () => {
    it('replaces all occurrences of a string pattern', () => {
      expect(bury('hello world').gsub('l', 'r').value).toBe('herro worrd');
      expect(bury('aaa').gsub('a', 'b').value).toBe('bbb');
      expect(bury('hello').gsub('x', 'y').value).toBe('hello');
    });

    it('replaces all occurrences of a RegExp pattern', () => {
      expect(bury('hello world').gsub(/l/g, 'r').value).toBe('herro worrd');
      expect(bury('Hello World').gsub(/[A-Z]/g, '_').value).toBe('_ello _orld');
    });

    it('handles non-global RegExp by making it global', () => {
      expect(bury('hello').gsub(/l/, 'r').value).toBe('herro');
    });
  });

  describe('center', () => {
    it('pads string to specified width with spaces on both sides', () => {
      expect(bury('hi').center(6).value).toBe('  hi  ');
      expect(bury('hi').center(5).value).toBe(' hi  ');
      expect(bury('hello').center(5).value).toBe('hello');
      expect(bury('hello').center(3).value).toBe('hello');
    });

    it('returns the original string if width is not greater than length', () => {
      expect(bury('hello').center(0).value).toBe('hello');
    });
  });

  describe('prepend', () => {
    it('prepends a string before the original', () => {
      expect(bury('world').prepend('hello ').value).toBe('hello world');
      expect(bury('').prepend('abc').value).toBe('abc');
      expect(bury('abc').prepend('').value).toBe('abc');
    });
  });

  // ─── Property-Based Tests ─────────────────────────────────────────────────

  // Feature: bury2-core-library, Property 14: String upcase/downcase Round-Trip
  it('Property 14: upcase then downcase equals toLowerCase() on ASCII strings', () => {
    // **Validates: Requirements 5.1, 5.2**
    fc.assert(
      fc.property(
        fc.stringOf(fc.mapToConstant(
          { num: 26, build: (i) => String.fromCharCode(65 + i) },  // A-Z
          { num: 26, build: (i) => String.fromCharCode(97 + i) },  // a-z
          { num: 10, build: (i) => String.fromCharCode(48 + i) },  // 0-9
          { num: 5,  build: (i) => ' !@#$'[i] },                   // punctuation
        )),
        (s) => {
          const result = bury(s).upcase.downcase.value;
          expect(result).toBe(s.toLowerCase());
        }
      )
    );
  });

  // Feature: bury2-core-library, Property 15: String trim Idempotence
  it('Property 15: trim is idempotent', () => {
    // **Validates: Requirements 5.3**
    fc.assert(
      fc.property(fc.string(), (s) => {
        const once = bury(s).trim.value;
        const twice = bury(once).trim.value;
        expect(twice).toBe(once);
      })
    );
  });

  // Feature: bury2-core-library, Property 16: String reverse Round-Trip
  it('Property 16: reversing twice returns the original string', () => {
    // **Validates: Requirements 5.4**
    fc.assert(
      fc.property(fc.string(), (s) => {
        const roundTripped = bury(bury(s).reverse.value).reverse.value;
        expect(roundTripped).toBe(s);
      })
    );
  });
});
