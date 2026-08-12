import type { Bury } from './base.ts';

/**
 * A type that is both a Bury wrapper `W` and a callable function.
 * When called with no arguments, returns the zero-arg result (same as property access).
 * When called with arguments, delegates to the underlying implementation.
 */
export type CallableGetter<W extends Bury<unknown>> = W & ((...args: unknown[]) => W);

/**
 * Creates a Callable Getter — an object that can be both accessed as a property
 * and called as a function.
 *
 * - Property access (`wrapper.method`) returns `zeroArgResult`
 * - Call with no args (`wrapper.method()`) returns `zeroArgResult`
 * - Call with args (`wrapper.method(arg)`) calls `impl(arg)` and returns the result
 *
 * @param zeroArgResult - The pre-computed result for zero-argument access/calls
 * @param impl - The implementation to invoke when arguments are provided
 * @returns A CallableGetter that behaves as both a Bury wrapper and a function
 */
export function makeCallableGetter<W extends Bury<unknown>>(
  zeroArgResult: W,
  impl: (...args: unknown[]) => W
): CallableGetter<W> {
  const fn = (...args: unknown[]): W =>
    args.length === 0 ? zeroArgResult : impl(...args);

  // Proxy the function so that property access delegates to zeroArgResult,
  // making `wrapper.method.value` work the same as `wrapper.method().value`
  return new Proxy(fn, {
    get(_target, prop) {
      return (zeroArgResult as unknown as Record<string | symbol, unknown>)[prop as string];
    },
  }) as unknown as CallableGetter<W>;
}
