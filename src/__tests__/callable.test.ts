// Feature: bury2-core-library
// Tests for the Callable Getter pattern (makeCallableGetter utility)

import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { bury } from '../bury.ts';
import { Bury } from '../core/base.ts';
import { makeCallableGetter } from '../core/callable.ts';

// Concrete subclass for use in tests
class TestBury extends Bury<{ value: number }> {}

describe('Callable Getter', () => {
  // Test 1: Property access returns the zeroArgResult
  it('property access returns the zeroArgResult value', () => {
    const zeroArgResult = new TestBury({ value: 42 });
    const implResult = new TestBury({ value: 99 });
    const getter = makeCallableGetter(zeroArgResult, () => implResult);

    expect(getter.value).toBe(zeroArgResult.value);
    expect(getter.value).toEqual({ value: 42 });
  });

  // Test 2: Zero-arg call returns the same value as property access
  it('zero-arg call returns the same value as property access', () => {
    const zeroArgResult = new TestBury({ value: 7 });
    const implResult = new TestBury({ value: 100 });
    const getter = makeCallableGetter(zeroArgResult, () => implResult);

    expect(getter().value).toEqual(getter.value);
  });

  // Test 3: Call with args delegates to impl and returns its result
  it('call with args delegates to impl and returns its result', () => {
    const zeroArgResult = new TestBury({ value: 0 });
    const impl = vi.fn((..._args: unknown[]) => new TestBury({ value: 55 }));
    const getter = makeCallableGetter(zeroArgResult, impl);

    const someArg = 'hello';
    const result = getter(someArg);

    expect(impl).toHaveBeenCalledWith(someArg);
    expect(result.value).toEqual({ value: 55 });
  });
});

// Feature: bury2-core-library, Property 3: Callable Getter Equivalence
describe('Property 3: Callable Getter Equivalence', () => {
  it('bury(arr).uniq.value deepEquals bury(arr).uniq().value for any array', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        const wrapped = bury(arr);
        expect(wrapped.uniq.value).toEqual(wrapped.uniq().value);
      })
    );
  });

  it('bury(arr).rev.value deepEquals bury(arr).rev().value for any array', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        const wrapped = bury(arr);
        expect(wrapped.rev.value).toEqual(wrapped.rev().value);
      })
    );
  });

  it('bury(arr).sort.value deepEquals bury(arr).sort().value for any array of integers', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const wrapped = bury(arr);
        expect(wrapped.sort.value).toEqual(wrapped.sort().value);
      })
    );
  });

  it('bury(arr).compact.value deepEquals bury(arr).compact().value for any array', () => {
    fc.assert(
      fc.property(fc.array(fc.option(fc.anything())), (arr) => {
        const wrapped = bury(arr);
        expect(wrapped.compact.value).toEqual(wrapped.compact().value);
      })
    );
  });

  it('bury(arr).trim.value deepEquals bury(arr).trim().value for any array of strings', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (arr) => {
        const wrapped = bury(arr);
        expect(wrapped.trim.value).toEqual(wrapped.trim().value);
      })
    );
  });
});

