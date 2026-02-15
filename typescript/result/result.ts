export interface Failure {
  code: string;
  message: string;
}

export type Result<T, E extends Failure> = SuccessResult<T> | FailureResult<E>;

export class SuccessResult<T> {
  constructor(private readonly value: T) {}

  isSuccess(): this is SuccessResult<T> {
    return true;
  }

  isFailure(): this is FailureResult<Failure> {
    return false;
  }

  getValue(): T {
    return this.value;
  }
}

export class FailureResult<E extends Failure> {
  constructor(private readonly failure: E) {}

  isSuccess(): this is SuccessResult<unknown> {
    return false;
  }

  isFailure(): this is FailureResult<E> {
    return true;
  }

  getFailure(): E {
    return this.failure;
  }
}
