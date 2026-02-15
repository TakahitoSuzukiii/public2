import { Result, Failure } from "./result";

export class ResultPipeline<T, E extends Failure> {
  constructor(private readonly promise: Promise<Result<T, E>>) {}

  static from<T, E extends Failure>(promise: Promise<Result<T, E>>) {
    return new ResultPipeline<T, E>(promise);
  }

  run(): Promise<Result<T, E>> {
    return this.promise;
  }
}
