from __future__ import annotations
from dataclasses import dataclass
from typing import Generic, TypeVar, Callable, Awaitable, Union

T = TypeVar("T")
E = TypeVar("E")
U = TypeVar("U")


@dataclass
class Result(Generic[T, E]):
    ok: bool
    value: Union[T, None] = None
    error: Union[E, None] = None

    @staticmethod
    def Ok(value: T) -> "Result[T, E]":
        return Result(ok=True, value=value)

    @staticmethod
    def Err(error: E) -> "Result[T, E]":
        return Result(ok=False, error=error)

    def is_ok(self) -> bool:
        return self.ok

    def is_err(self) -> bool:
        return not self.ok

    def unwrap(self) -> T:
        if self.ok:
            return self.value
        raise RuntimeError(f"unwrap() called on Err: {self.error}")

    def unwrap_or(self, default: T) -> T:
        return self.value if self.ok else default

    # --- sync map ---
    def map(self, fn: Callable[[T], U]) -> "Result[U, E]":
        if self.ok:
            try:
                return Result.Ok(fn(self.value))
            except Exception as e:
                return Result.Err(e)
        return Result.Err(self.error)

    # --- async map ---
    async def map_async(self, fn: Callable[[T], Awaitable[U]]) -> "Result[U, E]":
        if self.ok:
            try:
                return Result.Ok(await fn(self.value))
            except Exception as e:
                return Result.Err(e)
        return Result.Err(self.error)

    # --- sync and_then ---
    def and_then(self, fn: Callable[[T], "Result[U, E]"]) -> "Result[U, E]":
        if self.ok:
            try:
                return fn(self.value)
            except Exception as e:
                return Result.Err(e)
        return Result.Err(self.error)

    # --- async and_then ---
    async def and_then_async(self, fn: Callable[[T], Awaitable["Result[U, E]"]]) -> "Result[U, E]":
        if self.ok:
            try:
                return await fn(self.value)
            except Exception as e:
                return Result.Err(e)
        return Result.Err(self.error)
