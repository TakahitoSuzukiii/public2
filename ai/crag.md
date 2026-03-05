## 1. 基礎を固める（初心者向け）

### Microsoft Learn – 生成 AI / RAG / LLM 基礎
**運営：Microsoft（信頼性最高）**
LLM の仕組み、RAG の基本、評価、責任ある AI などを体系的に学べる。  
[https://learn.microsoft.com/ja-jp/ai/](https://learn.microsoft.com/ja-jp/ai/)

---

### Google Cloud – Learn Generative AI
**運営：Google（信頼性最高）**
RAG、Embedding、ベクトル検索、評価などを網羅。  
`https://cloud.google.com/learn/paths/generative-ai?hl=ja` [(cloud.google.com in Bing)](https://www.bing.com/search?q="https%3A%2F%2Fcloud.google.com%2Flearn%2Fpaths%2Fgenerative-ai%3Fhl%3Dja")

---

### OpenAI Cookbook（GitHub 60k⭐）
**運営：OpenAI（GitHub 60k⭐）**  
RAG、ツール呼び出し、評価、エージェントの基礎が実装レベルで学べる。  
`https://github.com/openai/openai-cookbook` [(github.com in Bing)](https://www.bing.com/search?q="https%3A%2F%2Fgithub.com%2Fopenai%2Fopenai-cookbook")

---

## 2. 実践力をつける（中級者向け）

### LangChain 公式ドキュメント（GitHub 80k⭐）
**運営：LangChain（GitHub 80k⭐）**
RAG、評価、エージェント、LangGraph など CRAG に直結する技術が豊富。  
[https://python.langchain.com/](https://python.langchain.com/)

---

### LlamaIndex 公式ドキュメント（GitHub 70k⭐）
**運営：LlamaIndex（GitHub 70k⭐）**
ハイブリッド検索、Query Transform、GraphRAG など CRAG の基盤になる機能が揃う。  
[https://docs.llamaindex.ai/](https://docs.llamaindex.ai/)

---

### Haystack（GitHub 13k⭐）
**運営：deepset（企業）**  
RAG パイプライン、BM25＋ベクトルのハイブリッド検索、評価などが強力。  
[https://github.com/deepset-ai/haystack](https://github.com/deepset-ai/haystack)

---

## 3. CRAG を正しく理解する（上級者向け）

### Meta Research – CRAG Benchmark（Corrective RAG）
**運営：Meta（Facebook Research）**  
CRAG の一次情報。Correct / Incorrect / Ambiguous の定義と評価方法が学べる。  
`https://github.com/facebookresearch/CRAG` [(github.com in Bing)](https://www.bing.com/search?q="https%3A%2F%2Fgithub.com%2Ffacebookresearch%2FCRAG")

---

### LangGraph（GitHub 7k⭐）
**運営：LangChain チーム**  
CRAG の「検索 → 自己評価 → 再検索 → 再構成」を最も自然に実装できるフレームワーク。  
`https://github.com/langchain-ai/langgraph` [(github.com in Bing)](https://www.bing.com/search?q="https%3A%2F%2Fgithub.com%2Flangchain-ai%2Flanggraph")

[LangChain overview](https://docs.langchain.com/oss/python/langchain/overview)
[LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)

---

## 4. 日本語で CRAG を理解したい場合

### Corrective RAG（CRAG）の概念と実装方法 – Zenn
**著者：EGGHEAD 代表エンジニア（信頼性高い）**  
LangGraph を使った CRAG 実装が日本語で最もわかりやすい。  
`https://zenn.dev/egghead/articles/corrective-rag` [(zenn.dev in Bing)](https://www.bing.com/search?q="https%3A%2F%2Fzenn.dev%2Fegghead%2Farticles%2Fcorrective-rag")

---

## 5. 学習ロードマップ（崇史さん向け最適化）

### Step 1：基礎
- Microsoft Learn
- Google Learn  
- OpenAI Cookbook  

### Step 2：実践
- LangChain
- LlamaIndex  
- Haystack  

### Step 3：CRAG 理解
- Meta CRAG Benchmark
- Zenn（日本語）  

### Step 4：CRAG 実装
- LangGraph  
- LlamaIndex（Query Transform / GraphRAG）  
- Haystack（ハイブリッド検索）  

---

## 6. まとめ
崇史さんが CRAG を社内 QABOT に導入するには、  
**RAG → 評価 → Agent → CRAG** の順で学ぶのが最短ルートです。

上記のサイトはすべて信頼性が高く、体系的に学べるものだけを厳選しています。