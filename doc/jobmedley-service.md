# 求人サービス CMS 設定ドキュメント

このドキュメントは **第 1 サービス**（ジョブメドレー・求人データ）の microCMS 設定をまとめたものです。

---

## 1. 環境変数

| 変数名 | 用途 |
|--------|------|
| `NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN` | サービスドメイン（例: `jobmedley`） |
| `MICROCMS_API_KEY` | 管理画面 → API キー |

> API キーはブラウザに送らないよう `NEXT_PUBLIC_` を付けないで設定します。

---

## 2. API 構成

| API 名 | エンドポイント | 型 | 備考 |
|--------|---------------|----|------|
| 求人 | `jobs` | リスト | 求人一覧 & 詳細 |
| タグ | `tag` | リスト | 特徴・こだわりタグ |
| 都道府県 | `prefectures` | リスト | 47 都道府県マスタ |
| 市区町村 | `municipalities` | リスト | 都道府県に紐付く市区町村 |
| 職種カテゴリ | `jobcategories` | リスト | 医療・介護系など職種カテゴリ |

---

## 3. スキーマ詳細

### 3.1 求人 (`jobs`)

| フィールド ID | 表示名 | 種類 | 必須 | 備考 |
|---------------|--------|------|------|------|
| `title` | タイトル | テキストフィールド | Yes | 求人票タイトル |
| `prefecture` | 都道府県 | コンテンツ参照 (`prefectures`) | Yes | 勤務都道府県 |
| `municipality` | 市区町村 | コンテンツ参照 (`municipalities`) | No | 勤務市区町村 |
| `imageUrl` | サムネ URL | テキストフィールド | No | 外部画像 URL を直接入力する場合に使用 |
| `images` | 画像 | 画像 (複数) | No | ギャラリー用画像 |
| `tags` | タグ | コンテンツ参照 (`tag`) <br/>複数可 | No | 特徴タグ |
| ... | ... | ... | ... | 詳細フィールドは `JobDetail` 型を参照 |

### 3.2 タグ (`tag`)

| フィールド ID | 表示名 | 種類 | 必須 |
|---------------|--------|------|------|
| `id` | (自動) | - | - |
| `name` | タグ名 | テキストフィールド | Yes |

### 3.3 都道府県 (`prefectures`)

| フィールド ID | 表示名 | 種類 | 必須 |
|---------------|--------|------|------|
| `region` | 都道府県名 | テキストフィールド | Yes |
| `area` | 地方区分 | セレクトフィールド | Yes |

### 3.4 市区町村 (`municipalities`)

| フィールド ID | 表示名 | 種類 | 必須 |
|---------------|--------|------|------|
| `name` | 市区町村名 | テキストフィールド | Yes |
| `prefecture` | 都道府県参照 | コンテンツ参照 (`prefectures`) | Yes |

### 3.5 職種カテゴリ (`jobcategories`)

| フィールド ID | 表示名 | 種類 | 必須 |
|---------------|--------|------|------|
| `name` | 職種名 | テキストフィールド | Yes |
| `category` | 大分類 | セレクトフィールド | No |

---

## 4. 取得例

```ts
import { microcmsClient } from "@/lib/microcms";

// 求人検索（都道府県・タグなどでフィルタ）
const { contents: jobs } = await microcmsClient.get<{ contents: Job[] }>({
  endpoint: "jobs",
  queries: {
    limit: 100,
    filters: "prefecture[equals]tokyo[and]tags[contains]night-shift",
    depth: 1,
  },
});

// タグ一覧
const { contents: tags } = await microcmsClient.get<{ contents: Tag[] }>({
  endpoint: "tag",
  queries: { limit: 100 },
});
```

---

## 5. 運用メモ

* `jobs` は検索ページで `limit=100` まで取得し、フロント側でページネーションする実装。<br/>それ以上の件数が必要になったら offset などで追加取得する。
* `tag`, `prefectures` などマスタは更新頻度が低いため ISR や SWR でキャッシュして良い。
* 不足フィールドを追加した場合はこのドキュメントも更新してください。 