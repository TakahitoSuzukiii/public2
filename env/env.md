# .env の前提ルール（共通）

- **コードに秘密情報を書かない**
- **.env は Git 管理しない（`.gitignore` に入れる）**
- **本番のシークレットはクラウド側（Secrets / Parameter Store 等）に寄せる**
- **コンテナイメージに秘密情報を焼き込まない**

---

# TypeScript プロジェクト向け .env 設計テンプレ

## 想定構成

- ランタイム: Node.js（TypeScript ビルド済み）
- 利用ライブラリ例: `dotenv`, `zod`
- 実行環境: Docker / Docker Compose / クラウド

### ディレクトリ構成例

```text
project/
  src/
    index.ts
    env.ts
  dist/
  .env.local
  .env.example
  package.json
  tsconfig.json
  docker-compose.yml
  Dockerfile
```

### `.env.example`（サンプル・共有用）

```env
# アプリ基本
NODE_ENV=development
PORT=3000

# Discord Bot
DISCORD_TOKEN=your-discord-token-here

# DB
DATABASE_URL=postgres://user:password@localhost:5432/app

# ログ
LOG_LEVEL=debug
```

- **目的:** 「何が必要な環境変数か」をチームで共有する
- **ポイント:** 値はダミーにする（本物は書かない）

### `.env.local`（ローカル開発用・Git 管理しない）

```env
NODE_ENV=development
PORT=3000

DISCORD_TOKEN=xxxxx
DATABASE_URL=postgres://user:password@db:5432/app
LOG_LEVEL=debug
```

- **ローカル専用の実値**を書く
- Docker Compose から `env_file` として読み込む想定

### `src/env.ts`（型安全な環境変数ラッパ）

```ts
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config(); // .env.local or .env をロード

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("3000"),
  DISCORD_TOKEN: z.string(),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.string().default("info"),
});

export const env = EnvSchema.parse(process.env);
```

### `src/index.ts`

```ts
import { env } from "./env";

console.log("NODE_ENV:", env.NODE_ENV);
console.log("PORT:", env.PORT);
// ここで Discord Bot や DB 接続などに env を使う
```

---

# Python プロジェクト向け .env 設計テンプレ

## 想定構成

- ランタイム: Python 3.x
- 利用ライブラリ例: `python-dotenv`, `pydantic` or `pydantic-settings`
- 実行環境: Docker / Docker Compose / クラウド

### ディレクトリ構成例

```text
project/
  app/
    __init__.py
    main.py
    settings.py
  .env.local
  .env.example
  requirements.txt
  docker-compose.yml
  Dockerfile
```

### `.env.example`

```env
ENV=development
PORT=8000

DISCORD_TOKEN=your-discord-token-here
DATABASE_URL=postgres://user:password@localhost:5432/app

LOG_LEVEL=debug
```

### `.env.local`

```env
ENV=development
PORT=8000

DISCORD_TOKEN=xxxxx
DATABASE_URL=postgres://user:password@db:5432/app

LOG_LEVEL=debug
```

### `settings.py`（Pydantic で型安全）

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    env: str = "development"
    port: int = 8000
    discord_token: str
    database_url: str
    log_level: str = "info"

    class Config:
        env_file = ".env.local"  # ローカル開発用
        env_file_encoding = "utf-8"

settings = Settings()
```

### `main.py`

```python
from .settings import Settings, settings

def main():
    print("ENV:", settings.env)
    print("PORT:", settings.port)
    # ここで Discord Bot や DB 接続などに settings を使う

if __name__ == "__main__":
    main()
```

- **本番環境:** `.env.local` を使わず、環境変数で上書き（Pydantic は環境変数優先）

---

# Docker Compose と組み合わせた実践例

## 想定

- `app-ts`: TypeScript（Node.js）サービス
- `app-py`: Python サービス
- `db`: PostgreSQL
- `.env.local` を Compose の変数展開＋各サービスの `env_file` に利用

### プロジェクト構成例

```text
project/
  ts-app/
    src/...
    Dockerfile
  py-app/
    app/...
    Dockerfile
  .env.local
  .env.example
  docker-compose.yml
```

### `.env.local`（Compose 用＋アプリ用を兼ねる）

```env
# 共通
COMPOSE_PROJECT_NAME=sample_app

# TS アプリ
TS_PORT=3000

# Python アプリ
PY_PORT=8000

# DB
POSTGRES_USER=app
POSTGRES_PASSWORD=password
POSTGRES_DB=app
POSTGRES_PORT=5432

# アプリ用
DISCORD_TOKEN=xxxxx
DATABASE_URL=postgres://app:password@db:5432/app
LOG_LEVEL=debug
```

### `docker-compose.yml`（compose.yaml）

```yaml
services:
  db:
    image: postgres:15-alpine
    container_name: ${COMPOSE_PROJECT_NAME}-db
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

  app-ts:
    build:
      context: ./ts-app
    container_name: ${COMPOSE_PROJECT_NAME}-ts
    env_file:
      - .env.local
    environment:
      # 必要なら上書きも可能
      NODE_ENV: development
    ports:
      - "${TS_PORT}:3000"
    depends_on:
      - db

  app-py:
    build:
      context: ./py-app
    container_name: ${COMPOSE_PROJECT_NAME}-py
    env_file:
      - .env.local
    environment:
      ENV: development
    ports:
      - "${PY_PORT}:8000"
    depends_on:
      - db

volumes:
  db-data:
```

### ポイント整理

- **Compose の変数展開**
  - `${COMPOSE_PROJECT_NAME}`, `${POSTGRES_PORT}`, `${TS_PORT}` などは `.env.local` から展開
- **各コンテナの環境変数**
  - `env_file: .env.local` でアプリ側から `DISCORD_TOKEN`, `DATABASE_URL` などを参照
- **本番運用時の切り替え**
  - `.env.local` はローカル専用
  - 本番は:
    - Compose を使うなら `--env-file .env.production` などで切り替え
    - もしくはクラウドのタスク定義 / サービス設定で環境変数を直接指定
    - シークレットは Secrets Manager / Parameter Store 等に移行

---

# まとめ（運用の指針）

- **ローカル開発**
  - `.env.local` に「全部」書いて OK（Git 管理しない）
  - TypeScript / Python からは `dotenv` / `Pydantic` で読み込む
  - Docker Compose は `.env.local` を
    - 変数展開（ポート・プロジェクト名など）
    - `env_file`（アプリ用環境変数）として再利用

- **本番**
  - `.env` ファイルは極力使わず、**環境変数＋Secrets 管理サービス**に寄せる
  - イメージには秘密情報を焼き込まない
  - アプリ側は「`process.env` / `os.environ` を読む設計」にしておく
