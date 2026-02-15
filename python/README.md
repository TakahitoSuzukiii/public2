# Result / ResultPipeline / Logger / HttpLogger (Python)

このリポジトリは、TypeScript 版で構築した Result / ResultPipeline / Logger / HttpLogger の設計思想を Python で再構築したものです。

- Rust ライクな `Result<T, E>`
- 関数チェーンを可能にする `ResultPipeline`
- シンプルで構造化された `Logger`
- HTTP 専用の構造化ログを出力する `HttpLogger`
- `async/await` に自然に対応した API

「最小構成・高可読性・実用性」を重視して設計されています。

---

# 📦 インストール

```bash
pip install -r requirements.txt
```

（特別な依存はありません）

---

# 🧩 Result

Rust の `Result<T, E>` に近い構造で、成功 (`Ok`) と失敗 (`Err`) を明示的に扱います。

## 特徴

- `Ok(value)` / `Err(error)`
- `map` / `map_async`
- `and_then` / `and_then_async`
- `unwrap` / `unwrap_or`
- 例外は自動的に `Err` に変換

## 例：基本的な使い方

```python
from result import Result

def divide(a: int, b: int) -> Result[int, str]:
    if b == 0:
        return Result.Err("division by zero")
    return Result.Ok(a // b)

result = divide(10, 2)

if result.is_ok():
    print(result.value)
else:
    print(result.error)
```

---

# 🔗 ResultPipeline

複数の処理をチェーンし、途中で `Err` が出たら即停止します。

## 特徴

- `pipe`（同期）
- `pipe_async`（非同期）
- `unwrap` / `get`
- 最小構成で読みやすい

---

# 🚀 async 使い方例（複数パターン）

## パターン1：シンプルな async チェーン

```python
from result import Result
from result_pipeline import ResultPipeline

async def step1(x: int) -> Result[int, str]:
    return Result.Ok(x + 1)

async def step2(x: int) -> Result[int, str]:
    if x > 5:
        return Result.Err("too big")
    return Result.Ok(x * 2)

async def main():
    pipeline = (
        await ResultPipeline.start(2)
        .pipe_async(step1)
        .pipe_async(step2)
    )

    result = pipeline.get()
    print(result)
```

---

## パターン2：map_async を使う

```python
async def fetch_value(x: int) -> int:
    return x * 10

async def main():
    result = await Result.Ok(3).map_async(fetch_value)
    print(result.unwrap())  # 30
```

---

## パターン3：and_then_async で Result を返す関数をチェーン

```python
async def fetch_user(id: int) -> Result[dict, str]:
    if id == 0:
        return Result.Err("invalid id")
    return Result.Ok({"id": id, "name": "Taro"})

async def main():
    result = await Result.Ok(1).and_then_async(fetch_user)
    print(result)
```

---

## パターン4：Pipeline + async + map_async の複合

```python
async def step1(x: int) -> Result[int, str]:
    return Result.Ok(x + 5)

async def multiply_async(x: int) -> int:
    return x * 3

async def main():
    pipeline = (
        await ResultPipeline.start(1)
        .pipe_async(step1)
    )
    pipeline.result = await pipeline.result.map_async(multiply_async)

    print(pipeline.unwrap())  # (1+5)*3 = 18
```

---

# 📝 Logger

シンプルで構造化された JSON ログを出力します。

## 特徴

- `info`, `warn`, `error`
- payload は dict で渡せる
- JSON 形式で出力
- 拡張しやすい最小構成

## 例

```python
from logger import Logger

log = Logger("my-service")

log.info("Start process", {"step": 1})
log.warn("Slow response", {"duration": 120})
log.error("Failed", {"reason": "timeout"})
```

出力例：

```json
{
  "timestamp": "2026-02-15T09:00:00.000Z",
  "service": "my-service",
  "level": "INFO",
  "message": "Start process",
  "payload": {"step": 1}
}
```

---

# 🌐 HttpLogger

HTTP リクエスト/レスポンス専用の構造化ログ。

## 例

```python
from http_logger import HttpLogger

http_log = HttpLogger("api-service")

http_log.request("GET", "/users", {"id": 10})
http_log.response("GET", "/users", 200, {"name": "Taro"})
```

---

# 📁 ディレクトリ構成

```
project/
  result.py
  result_pipeline.py
  logger.py
  http_logger.py
  README.md
```

---

# 🎯 設計思想

- **最小構成**：複雑な抽象化を避け、読みやすさを最優先
- **Rust ライク**：Result による明示的な成功/失敗
- **TypeScript 版の思想を継承**：Pipeline / structured logging
- **async/await に自然対応**
- **拡張しやすい**：Logger を CloudWatch / File / HTTP などに簡単に拡張可能

---

# 🧪 テスト

```bash
pytest
```

---

# 📜 ライセンス

MIT

## Author and Ownership

This project was created as a personal initiative and is not connected to any organization or group.  
It is published as an individual creative work.

## 著作権と所属について

本プロジェクトは個人の活動として作成したものであり、
特定の組織や団体の業務とは関係ありません。
個人の創作物として公開しています。
