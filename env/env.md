# **クラウド開発環境ガイド：Cloud9 vs WorkSpaces（ローカル制約あり版）**

AWS上で開発環境を持つ方法はいくつかあるが、  
**ローカルPCにVSCodeを入れられない／SSHも使えない**という制約がある場合、  
実質的に選択肢は次の2つに絞られる。

- **Cloud9（ブラウザIDE）で完結させる**
- **WorkSpaces（クラウドPC）にVSCode/Cursorを入れて使う**

どちらも「ローカルに何もインストールできない」状況をクリアできる。  
ただし、性質が大きく異なるため、用途に応じて選ぶ必要がある。

---

## **1. Cloud9：AWSネイティブのブラウザIDE**

### 🌐 **特徴**
- ブラウザだけで開発できる。ローカルに何もインストール不要。
- 裏側はEC2なので、Node/Python/LLMライブラリなど自由に入れられる。
- AWSサービスとの統合が強く、LambdaやAPI Gatewayの開発がしやすい。
- VSCodeは使えない（ローカルに入れられないため）。  
  → Cloud9のエディタで完結する運用になる。

### 👍 **メリット**
- ローカル制約が強い環境でも問題なく使える。
- ブラウザさえあればどこでも同じ環境にアクセス可能。
- EC2の自動休止を使えばコストを抑えられる。
- AWS公式のため、権限設定やIAMロールがスムーズ。

### 👎 **デメリット**
- エディタとしてはVSCodeに劣る（拡張性・操作性）。
- AIコーディング（Cursorなど）は使えない。
- ブラウザIDEなので、重い処理はややストレス。

### 🛠 **構築手順（Cloud9）**
1. **AWSコンソール → Cloud9 → Create environment**
2. 名前をつける（例：`dev-env-cloud9`）
3. **Environment type：EC2**
4. **Instance type：t3.small**
5. **Platform：Amazon Linux 2 or Ubuntu**
6. **Cost-saving setting：30分で自動休止**（必須）
7. 作成完了後、ブラウザでIDEにアクセスして開発開始

### 💰 **コスト（t3.smallを1か月使った場合）**
- **EC2（t3.small）**：約 0.026 USD/h  
  → 720h（1か月）で **約 18.7 USD（約 2,800円）**
- **EBS 50GB**：約 4 USD（約 600円）
- **合計：約 3,400円/月**

※自動休止を使えば、実際はもっと安くなる。

---

## **2. WorkSpaces：クラウド上の自分専用PC**

### 🖥 **特徴**
- AWS上に「クラウドPC（Windows/Linux）」を持つサービス。
- その中に **VSCode / Cursor / Git / Node / Python** など自由にインストール可能。
- ローカルPCはただの端末として使うだけでOK。

### 👍 **メリット**
- ほぼ「クラウドに置いた自分のPC」。  
  → VSCodeもCursorも普通に使える。
- ローカルPCの制約を完全に回避できる。
- 開発体験は最も自然で快適。

### 👎 **デメリット**
- 月額固定で、EC2より高くつきやすい。
- ネットワーク品質に依存（遅いと操作がもっさり）。
- GPUを使うAI開発には向かない（高額になる）。

### 🛠 **構築手順（WorkSpaces）**
1. **AWSコンソール → WorkSpaces → Launch WorkSpaces**
2. **Directory（Simple AD）を作成**
3. **ユーザーを作成し、WorkSpaceを割り当て**
4. **Bundle（スペック）選択**
   - Standard（2vCPU / 4GB / 50GB）以上を推奨
5. 数十分待つと、登録メールが届く
6. ローカルPCに **WorkSpaces Client** をインストール
7. クラウドPCにログインし、VSCode/Cursorをインストールして利用開始

### 💰 **コスト（Standardバンドルの例）**
- Tokyoリージョンで **約 35 USD/月（約 5,000円）** 程度  
  ※月額固定。使わなくてもほぼ同額。

---

# **Cloud9 vs WorkSpaces：ローカル制約が強い場合の最終比較**

| 項目                 | Cloud9                    | WorkSpaces                          |
| -------------------- | ------------------------- | ----------------------------------- |
| ローカル制約への強さ | ◎（ブラウザのみ）         | ◎（クライアントのみ）               |
| VSCode/Cursor        | ✕（使えない）             | ◎（普通に使える）                   |
| 開発体験             | △（ブラウザIDE）          | ◎（クラウドPC）                     |
| AIコーディング       | △（ブラウザIDEの限界）    | ◎（Cursor利用可）                   |
| コスト               | 安い（3,000円台〜）       | やや高い（5,000円〜）               |
| 運用の楽さ           | ○                         | ◎                                   |
| 向いている人         | AWS中心の開発、コスト重視 | VSCode/Cursorを使いたい、快適さ重視 |

---

# **結論（崇史さん向け）**

ローカルPCにVSCodeを入れられず、SSHも使えないという制約を考えると、  
**開発体験を重視するなら WorkSpaces が最適**。

- VSCode/Cursorをそのまま使える  
- ローカル制約を完全に回避  
- 開発体験が最も自然でストレスが少ない

コストを抑えたい場合は Cloud9 も選択肢だが、  
**Cursorを使ったAIコーディングはできない**ため、  
崇史さんの目的（Web開発＋AIコーディング）には WorkSpaces がより合う。

=========================

# **クラウド開発環境ガイド：Cloud9 / WorkSpaces × CodeCommit（ローカル制約あり版）**

AWS 上で開発環境を構築し、GitHub のようなソース管理を行いたい場合、  
ローカルPCに VSCode や SSH が使えない環境では、次の 2 つが現実的な選択肢になる。

- **Cloud9（ブラウザIDE）＋ CodeCommit**
- **WorkSpaces（クラウドPC）＋ VSCode/Cursor ＋ CodeCommit**

どちらも「ローカルに何もインストールできない」制約をクリアしつつ、  
AWS 内で完結した Git 運用が可能。

---

# **1. CodeCommit：AWS ネイティブの Git リポジトリ**

CodeCommit は AWS が提供する **フルマネージド Git リポジトリ**で、  
Cloud9 や WorkSpaces と組み合わせると、GitHub とほぼ同じ運用ができる。

### 特徴
- 完全プライベート Git リポジトリ
- IAM による強力なアクセス管理
- VPC 内で閉じた運用も可能
- GitHub と同じ Git コマンドで操作できる
- Cloud9 とは公式に統合されている（AWS公式ドキュメントより）  
    [AWS Documentation](https://docs.aws.amazon.com/ja_jp/codecommit/latest/userguide/setting-up-ide-c9.html)

---

# **2. CodeCommit の最小 Git 運用フロー（AWS 内だけで完結）**

AWS 上で Git を使う最小構成は次の 5 ステップ。

## **① CodeCommit リポジトリを作成**
AWS コンソール → CodeCommit → Create repository  
名前を入力して作成するだけ。

（Cloud9 から直接作成することも可能）

---

## **② Git 認証情報を作成（HTTPS）**
SSH が使えないため、**HTTPS Git 認証情報**を利用する。

IAM → 対象ユーザー → 認証情報タブ →  
「**AWS CodeCommit の HTTPS Git 認証情報**」を生成。

- Git 用ユーザー名
- Git 用パスワード

が発行される。

---

## **③ Cloud9 または WorkSpaces からリポジトリを clone**

### Cloud9 の場合（ブラウザIDE）
Cloud9 のターミナルで：

```bash
git clone https://git-codecommit.ap-northeast-1.amazonaws.com/v1/repos/<repo-name>
```

Cloud9 は Git と AWS CLI がプリインストールされているため、  
ほぼそのまま使える（AWS公式ドキュメントより）  
  [AWS Documentation](https://docs.aws.amazon.com/ja_jp/codecommit/latest/userguide/setting-up-ide-c9.html)

---

### WorkSpaces の場合（クラウドPC）
WorkSpaces 内の VSCode / ターミナルで：

```bash
git clone https://git-codecommit.ap-northeast-1.amazonaws.com/v1/repos/<repo-name>
```

Git が入っていなければインストールしておく。

---

## **④ 変更を commit & push**

```bash
git add .
git commit -m "first commit"
git push
```

---

## **⑤ pull して同期**

```bash
git pull
```

これで AWS 内だけで GitHub と同じ運用ができる。

---

# **3. Cloud9 × CodeCommit：AWS ネイティブで完結する構成**

Cloud9 はブラウザだけで使える IDE で、  
CodeCommit との統合が公式にサポートされている。  
  [AWS Documentation](https://docs.aws.amazon.com/ja_jp/codecommit/latest/userguide/setting-up-ide-c9.html)

## Cloud9 のメリット
- ローカルに何もインストール不要
- Git / AWS CLI が最初から入っている
- CodeCommit との連携が簡単
- コストが安い（t3.small で月 3,000 円台）

## Cloud9 のデメリット
- VSCode/Cursor は使えない
- ブラウザIDEのため、操作性は VSCode に劣る

---

## Cloud9 × CodeCommit の構築手順

### ① Cloud9 環境を作成
- EC2（t3.small）
- Amazon Linux 2 or Ubuntu
- 自動休止 30 分

### ② Git 認証情報を IAM で生成

### ③ Cloud9 のターミナルで clone

```bash
git clone https://git-codecommit.ap-northeast-1.amazonaws.com/v1/repos/<repo>
```

### ④ commit / push / pull を実行

---

# **4. WorkSpaces × CodeCommit：VSCode/Cursor を使いたい場合の構成**

WorkSpaces はクラウド上の Windows / Linux デスクトップ。  
ここに VSCode や Cursor をインストールして使う。

## WorkSpaces のメリット
- VSCode / Cursor が普通に使える
- ローカルPCの制約を完全に回避
- 開発体験が最も自然

## WorkSpaces のデメリット
- 月額固定でやや高い（5,000円〜）
- ネットワーク品質に依存

---

## WorkSpaces × CodeCommit の構築手順

### ① WorkSpaces を作成（Windows 推奨）
- Standard バンドル以上

### ② WorkSpaces 内に Git / VSCode / Cursor をインストール

### ③ IAM で Git 認証情報を生成

### ④ WorkSpaces 内のターミナルで clone

```bash
git clone https://git-codecommit.ap-northeast-1.amazonaws.com/v1/repos/<repo>
```

### ⑤ VSCode / Cursor で開発し、commit/push

---

# **5. Cloud9 vs WorkSpaces × CodeCommit：最終比較**

| 項目                 | Cloud9 × CodeCommit     | WorkSpaces × CodeCommit  |
| -------------------- | ----------------------- | ------------------------ |
| ローカル制約への強さ | ◎（ブラウザのみ）       | ◎（クライアントのみ）    |
| VSCode/Cursor        | ✕                       | ◎                        |
| Git 操作             | Cloud9 ターミナルで可能 | VSCode ターミナルで可能  |
| 開発体験             | △                       | ◎                        |
| コスト               | 安い（3,000円台〜）     | やや高い（5,000円〜）    |
| 向き                 | AWS ネイティブ開発      | VSCode/Cursor を使いたい |

---

# **6. 既存ドキュメントに追加する「ソース管理（CodeCommit）」章**

以下を Cloud9 / WorkSpaces ガイドに追加すると自然に統合できる。

---

## **📦 ソース管理：CodeCommit を使った AWS 内完結 Git 運用**

AWS 上で GitHub のようなソース管理を行う場合、  
CodeCommit を利用することで、AWS 内だけで安全に Git 運用ができる。

### 運用フロー（最小構成）
1. CodeCommit でリポジトリ作成  
2. IAM で HTTPS Git 認証情報を生成  
3. Cloud9 または WorkSpaces から clone  
4. commit / push / pull  
5. 必要に応じてブランチ運用

### Cloud9 との相性
- Git / AWS CLI がプリインストール  
- CodeCommit との統合が公式サポート  
    [AWS Documentation](https://docs.aws.amazon.com/ja_jp/codecommit/latest/userguide/setting-up-ide-c9.html)

### WorkSpaces との相性
- VSCode / Cursor を使った本格的な Git 開発が可能  
- GitHub とほぼ同じ操作感

---

# **最後に**

Cloud9 と WorkSpaces のどちらを採用するかは、  
**「VSCode/Cursor を使いたいか」**が最大の判断軸。

- **使いたい → WorkSpaces × CodeCommit**
- **使わなくてもいい → Cloud9 × CodeCommit（安い）**

どちらにするか、崇史さんの用途に合わせて最適化できます。
