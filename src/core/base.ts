export class Bury<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  unwrap(): T {
    return this._value;
  }
}
