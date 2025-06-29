# タクシー運転手 CMS 設定ドキュメント

このドキュメントは、2 つ目の microCMS サービス（タクシー運転手向けメディア）の設定内容と API スキーマをまとめたものです。

---

## 1. 環境変数

| 変数名 | 用途 |
|--------|------|
| `NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN_2` | microCMS のサービスドメイン（例: `taxi-media`） |
| `MICROCMS_API_KEY_2` | 管理画面 → API キー |

> **注意**  
> API キー側には `NEXT_PUBLIC_` を付けず、クライアントへ漏洩しないようにしてください。

---

## 2. API 構成

| API 名 | エンドポイント | 型 | 備考 |
|--------|---------------|----|------|
| ブログ | `blogs` | リスト | 記事データ本体 |
| カテゴリ | `categories` | リスト | ブログ記事が参照するカテゴリ |

---

## 3. スキーマ詳細

### 3.1 ブログ (`blogs`)

| フィールド ID | 表示名 | 種類 | 必須 | 役割 |
|---------------|--------|------|------|------|
| `title` | タイトル | テキストフィールド | Yes | 記事タイトル |
| `content` | 内容 | リッチエディタ | Yes | Markdown またはリッチテキスト本文 |
| `eyecatch` | アイキャッチ | 画像 | No | 記事サムネイル画像 |
| `category` | カテゴリ | コンテンツ参照（`categories`） | Yes | 紐付けるカテゴリ |
| `slug` | スラッグ | テキストフィールド | Yes | 記事 URL 用 slug |
| `html` | 記事 (html) | テキストエリア | No | 静的 HTML を直接保存する場合に使用 |
| `blog-style` | 記事形式 | セレクトフィールド | No | "normal" / "interview" など形式切替に利用 |

### 3.2 カテゴリ (`categories`)

| フィールド ID | 表示名 | 種類 | 必須 | 役割 |
|---------------|--------|------|------|------|
| `name` | カテゴリ名 | テキストフィールド | Yes | 表示用名称 |
| `slug` | スラッグ | テキストエリア | Yes | URL 用 slug |

---

## 4. 取得例

```ts
import { microcmsClient2 } from "@/lib/microcms";

// 記事一覧
const { contents: blogs } = await microcmsClient2.get<{ contents: Blog[] }>({
  endpoint: "blogs",
  queries: { limit: 10, orders: "-publishedAt" },
});

// カテゴリ一覧
const { contents: categories } = await microcmsClient2.get<{ contents: Category[] }>({
  endpoint: "categories",
  queries: { limit: 100 },
});
```

---

## 5. 備考

* データ転送量や API 制限はサービス単位でカウントされます。
* カテゴリを追加・削除した場合は、必ずブログ記事側の `category` 参照を整合させてください。
* 今後フィールドを追加した場合は、本ドキュメントを更新してください。 