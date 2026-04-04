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
