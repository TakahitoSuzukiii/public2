from typing import Callable, Awaitable, Any
from .result import Result


class ResultPipeline:
    def __init__(self, initial: Result):
        self.result = initial

    @staticmethod
    def start(value: Any) -> "ResultPipeline":
        return ResultPipeline(Result.Ok(value))

    # --- sync pipe ---
    def pipe(self, fn: Callable[[Any], Result]) -> "ResultPipeline":
        if self.result.is_ok():
            self.result = fn(self.result.value)
        return self

    # --- async pipe ---
    async def pipe_async(self, fn: Callable[[Any], Awaitable[Result]]) -> "ResultPipeline":
        if self.result.is_ok():
            self.result = await fn(self.result.value)
        return self

    def unwrap(self):
        return self.result.unwrap()

    def get(self) -> Result:
        return self.result
