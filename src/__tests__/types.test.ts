// Feature: bury2-core-library
// Task 12.1 — TypeScript type-level tests
// Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8

import { test } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { bury, Bury, BuryArray, BuryString, type CallableGetter } from '../index.ts';

// Req 8.1, 8.5 — bury([]).map() returns BuryArray<string>
test('bury([]).map(x => x.toString()) matches BuryArray<string>', () => {
  expectTypeOf(bury([] as string[]).map((x) => x.toString())).toEqualTypeOf<BuryArray<string>>();
});

// Req 8.2, 8.6 — bury(42).to_s returns BuryString
test('bury(42).to_s matches BuryString', () => {
  expectTypeOf(bury(42).to_s).toEqualTypeOf<BuryString>();
});

// Req 8.3, 8.4 — bury({}).keys returns CallableGetter<BuryArray<string>>
test('bury({}).keys matches CallableGetter<BuryArray<string>>', () => {
  expectTypeOf(bury({}).keys).toEqualTypeOf<CallableGetter<BuryArray<string>>>();
});

// Req 8.7, 8.8 — bury('').size returns Bury<number>
test("bury('').size matches Bury<number>", () => {
  expectTypeOf(bury('').size).toEqualTypeOf<Bury<number>>();
});

// BuryArray CallableGetters
test('bury([]).compact matches CallableGetter<BuryArray<never>>', () => {
  expectTypeOf(bury([] as (string | null)[]).compact).toEqualTypeOf<CallableGetter<BuryArray<string>>>();
});

test('bury([]).trim matches CallableGetter<BuryArray<string>>', () => {
  expectTypeOf(bury([] as string[]).trim).toEqualTypeOf<CallableGetter<BuryArray<string>>>();
});

test('bury([]).minmax matches Bury<[number, number] | [undefined, undefined]>', () => {
  expectTypeOf(bury([] as number[]).minmax).toEqualTypeOf<Bury<[number, number] | [undefined, undefined]>>();
});

