# genu

[Generative AI Use Cases (略称:GenU)](https://aws-samples.github.io/generative-ai-use-cases/ja/ABOUT.html)
[generative-ai-use-cases](https://github.com/aws-samples/generative-ai-use-cases?tab=readme-ov-file#generative-ai-use-cases-genu)
[生成 AI 体験ワークショップ](https://catalog.workshops.aws/generative-ai-use-cases-jp/ja-JP)

## work memo

[デプロイオプション](https://aws-samples.github.io/generative-ai-use-cases/ja/DEPLOY_OPTION.html)
[アップデート方法](https://aws-samples.github.io/generative-ai-use-cases/ja/UPDATE.html#%E3%82%A2%E3%83%83%E3%83%97%E3%83%87%E3%83%BC%E3%83%88%E6%96%B9%E6%B3%95)
→次回、良く確認すること！
[RAG チャット (Knowledge Base) ユースケースの有効化](https://aws-samples.github.io/generative-ai-use-cases/ja/DEPLOY_OPTION.html#rag-%E3%83%81%E3%83%A3%E3%83%83%E3%83%88-knowledge-base-%E3%83%A6%E3%83%BC%E3%82%B9%E3%82%B1%E3%83%BC%E3%82%B9%E3%81%AE%E6%9C%89%E5%8A%B9%E5%8C%96)
[Amazon Bedrock のモデルを変更する](https://aws-samples.github.io/generative-ai-use-cases/ja/DEPLOY_OPTION.html#amazon-bedrock-%E3%81%AE%E3%83%A2%E3%83%87%E3%83%AB%E3%82%92%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B)
[ブランディングカスタマイズ](https://aws-samples.github.io/generative-ai-use-cases/ja/DEPLOY_OPTION.html#%E3%83%96%E3%83%A9%E3%83%B3%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA)
[ネイティブアプリのように利用する方法](https://aws-samples.github.io/generative-ai-use-cases/ja/PWA.html#%E3%83%8D%E3%82%A4%E3%83%86%E3%82%A3%E3%83%96%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95)

## update memo

### ファイルコピー

```bash
aws s3 cp ./path/to/file.txt s3://my-bucket/path/to/file.txt
```

```bash
aws s3 sync ./generative-ai-use-cases s3://my-bucket/generative-ai-use-cases
```

### ディレクトリ同期

おすすめオプション
--dryrun：まずは「何が起きるか」確認する用（超重要）
--exact-timestamps：タイムスタンプまで見て差分判定（より rsync 的）
--delete：S3 側から「ローカルにないファイル」を削除（要注意）
--no-progress：CI/CD やログをきれいにしたいとき

```bash
aws s3 sync ./generative-ai-use-cases \
  s3://my-bucket/generative-ai-use-cases \
  --exact-timestamps \
  --delete \
  --no-progress
```

```bash
aws s3 sync <src> <dst> --exclude "<パターン>"
```

```bash
aws s3 sync ./generative-ai-use-cases \
  s3://my-bucket/generative-ai-use-cases \
  --exclude ".node_modules/*"
```

```bash
aws s3 sync ./generative-ai-use-cases \
  s3://my-bucket/generative-ai-use-cases \
  --exclude "*/.node_modules/*"
```

```bash
# まずはドライランで確認
aws s3 sync ./generative-ai-use-cases \
  s3://my-bucket/generative-ai-use-cases \
  --exclude "*/.node_modules/*" \
  --dryrun
```

```bash
# 問題なければ本番
aws s3 sync ./generative-ai-use-cases \
  s3://my-bucket/generative-ai-use-cases \
  --exclude "*/.node_modules/*" \
  --exact-timestamps \
  --delete \
  --no-progress
```

## research memo

以下を整理する。それぞれ違いを理解する。

- Agent チャットユースケースの有効化
- リサーチエージェントユースケースの有効化
- MCP チャットユースケースの有効化
- AgentCore ユースケースの有効化
- AgentBuilder ユースケースの有効化
- ユースケースビルダーの設定
