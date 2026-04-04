# 📘 Telnet 疎通確認ドキュメント（辞書・備忘録）

ネットワーク疎通確認、サービス生存確認、プロトコル動作テストに使う  
**telnet の実務向けまとめ**。

---

# # 1. Telnet とは
- **TCP ポートに接続できるか確認するためのツール**
- HTTP / SMTP / Redis / Memcached / WebSocket / SSH など  
  多くのサービスの **生の通信路** を手動で確認できる
- 暗号化はできないが、**TCP レベルの疎通確認**には最適

---

# # 2. 基本構文

```
telnet <ホスト名 or IP> <ポート番号>
```

### 例
```
telnet example.com 80
telnet example.com 443
telnet 192.168.1.10 22
```

---

# # 3. 疎通成功時の挙動（真っ黒画面の意味）

疎通成功すると、画面が黒くなりカーソルだけが点滅する。

これは：

- **TCP の 3-way handshake が成功**
- **サーバが LISTEN しており、接続を受け付けた**
- **あなたが入力した文字がそのままサーバに送られる状態**

つまり、**プロトコルを手でしゃべれる状態**。

---

# # 4. 疎通失敗時の代表的メッセージ

| エラー                      | 意味                                         |
| --------------------------- | -------------------------------------------- |
| `Connection refused`        | ポートは存在するがアプリが LISTEN していない |
| `Connection timed out`      | FW/ネットワークでブロック                    |
| `No route to host`          | ルーティング不達                             |
| `Name or service not known` | DNS 解決失敗                                 |

---

# # 5. 真っ黒画面でできること（初心者 → 玄人）

## 5.1 初心者向け：基本的な確認

### ✔ ポートが開いているか確認  
真っ黒画面が出た時点で以下が確定：

- ポートは開いている  
- FW でブロックされていない  
- サーバは LISTEN 中  
- ネットワーク経路は問題なし  

### ✔ HTTP の簡易テスト
```
telnet example.com 80
```

真っ黒画面で：

```
GET / HTTP/1.1
Host: example.com

```

→ HTTP レスポンスが返る

### ✔ 終了方法
```
Ctrl + ]
quit
```

---

## 5.2 中級者向け：プロトコルの動作確認

### ✔ SMTP（メールサーバ）
```
telnet mail.example.com 25
```

```
HELO test
MAIL FROM:<test@example.com>
RCPT TO:<user@example.com>
DATA
Hello
.
QUIT
```

### ✔ Redis
```
telnet localhost 6379
PING
```
→ `+PONG`

### ✔ Memcached
```
telnet localhost 11211
stats
```

### ✔ SSH（バナー確認）
```
telnet host 22
```

→ `SSH-2.0-OpenSSH_8.2` などが返る

---

## 5.3 玄人向け：高度な検証

### ✔ HTTP/1.0 と 1.1 の挙動比較
```
GET / HTTP/1.0

```

```
GET / HTTP/1.1
Host: example.com

```

### ✔ バーチャルホストの確認
```
GET / HTTP/1.1
Host: test.example.com

```

### ✔ WebSocket の Upgrade 確認
```
GET /ws HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Version: 13

```

### ✔ HTTPS（443）の TCP レベル確認
```
telnet example.com 443
```

→ 真っ黒画面になればポートは開いている  
（TLS の中身は見えない）

---

# # 6. Telnet の主なオプション（Linux/macOS）

| オプション  | 説明                                   | 例                                 |
| ----------- | -------------------------------------- | ---------------------------------- |
| `-4`        | IPv4 を強制                            | `telnet -4 example.com 80`         |
| `-6`        | IPv6 を強制                            | `telnet -6 example.com 80`         |
| `-e <char>` | エスケープ文字変更                     | `telnet -e q example.com 80`       |
| `-l <user>` | ログインユーザー指定（古いサーバ向け） | `telnet -l root host`              |
| `-n <file>` | ネゴシエーションログ保存               | `telnet -n log.txt example.com 80` |

---

# # 7. Telnet コマンドモード（Ctrl + ]）

真っ黒画面で `Ctrl + ]` → telnet モードへ

```
telnet>
```

使えるコマンド：

| コマンド         | 説明             |
| ---------------- | ---------------- |
| `status`         | 接続状態を表示   |
| `open host port` | 別のホストに接続 |
| `close`          | 接続を閉じる     |
| `quit`           | telnet を終了    |
| `mode line`      | 行モード         |
| `mode character` | 文字モード       |

---

# # 8. Telnet が使えない場合の代替ツール

| ツール             | 用途                     |
| ------------------ | ------------------------ |
| `nc` (netcat)      | TCP/UDP の疎通確認に最強 |
| `curl`             | HTTP/HTTPS の動作確認    |
| `openssl s_client` | TLS の詳細確認           |
| `ss` / `netstat`   | ポート LISTEN 状況確認   |

### 例：netcat で 443 の疎通確認
```
nc -vz example.com 443
```

---

# # 9. まとめ（初心者 → 玄人の成長ロードマップ）

| レベル | できること                                                     |
| ------ | -------------------------------------------------------------- |
| 初心者 | ポート疎通確認、HTTP の簡易テスト                              |
| 中級者 | SMTP/Redis/Memcached の動作確認                                |
| 玄人   | HTTP ヘッダ検証、WebSocket、バイナリプロトコル、IPv6、ログ取得 |

---

# # 10. このドキュメントの使い方
- **疎通確認の手順書として**  
- **プロトコル動作確認の辞書として**  
- **トラブルシューティングのチェックリストとして**  
- **Discord Bot / OpenClaw / GitHub MCP / AWS MCP のネットワーク調査にも応用可能**

===========

### 前提の整理

telnet は今どきデフォルトで入っていないことが多いので、  
**「どの OS で」「クライアントだけか／サーバもか」**を意識して入れるのがポイントです。

ここでは：

- **Windows（10/11）**
- **macOS**
- **Linux（Ubuntu 系）**

の順で、**インストール手順＋確認コマンド**をまとめます。

---

## 1. Windows 10 / 11 で telnet をインストール

### 1-1. GUI（いちばん分かりやすい方法）

1. **コントロール パネル** を開く  
2. **「プログラム」** をクリック  
3. **「Windows の機能の有効化または無効化」** をクリック  
4. 一覧から **「Telnet クライアント」** にチェックを入れる  
5. **OK** を押してインストール完了を待つ

### 1-2. コマンドで入れる（PowerShell）

管理者権限の PowerShell で：

```powershell
dism /online /Enable-Feature /FeatureName:TelnetClient
```

### 1-3. インストール確認

コマンドプロンプト or PowerShell で：

```powershell
telnet
```

`Microsoft Telnet>` のようなプロンプトが出れば OK。

---

## 2. macOS で telnet をインストール

最近の macOS には telnet が標準で入っていないので、  
**Homebrew 経由で入れる**のが定番です。

### 2-1. Homebrew がない場合（最初だけ）

ターミナルで：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

※ すでに brew が入っているならこのステップは不要。

### 2-2. telnet のインストール

```bash
brew install telnet
```

### 2-3. インストール確認

```bash
telnet -h
```

ヘルプが表示されれば OK。

---

## 3. Linux（Ubuntu 系）で telnet をインストール

### 3-1. クライアントだけ入れる（疎通確認用途）

疎通確認・ポート確認だけなら **クライアントだけで十分**です。

```bash
sudo apt update
sudo apt install telnet -y
```

### 3-2. サーバも入れる（telnet でログインさせたい場合）

※ セキュリティ的には非推奨。学習・検証用途に限定推奨。

```bash
sudo apt update
sudo apt install telnetd -y
```

ディストリによっては `inetd` / `inetutils-telnetd` などが一緒に入ります。

### 3-3. インストール確認

```bash
telnet
```

`telnet>` やヘルプが出れば OK。

---

## 4. 動作確認のミニチェック

インストール後、まずはローカル or 適当なサイトで試すと安心です。

### 4-1. どの OS でも共通

```bash
telnet example.com 80
```

`Connected to example.com.` と出て真っ黒画面になれば成功。

### 4-2. Ubuntu でローカル確認（サーバも入れた場合）

```bash
telnet localhost 23
```

`Connected to localhost.` と出れば telnet サーバも動作中。

---

## 5. ざっくりまとめ（用途別）

- **疎通確認・ポート確認だけしたい**
  - Windows：Telnet クライアントを有効化
  - macOS：`brew install telnet`
  - Ubuntu：`sudo apt install telnet`
- **telnet でログインさせたい（学習用）**
  - Ubuntu：`sudo apt install telnetd`（＋設定）
  - 本番用途では SSH を使うのが前提
