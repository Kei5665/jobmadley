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
| `companyName` | 会社名 | テキストフィールド | No | 事業所／法人名 |
| `jobName` | 職種名 | テキストフィールド | No | 募集職種 |
| `catchCopy` | キャッチコピー | テキストフィールド | No | PR 見出し |
| `employmentType` | 雇用形態 | セレクトフィールド | No | 正職員・パートなど |
| `wageType` | 給与形態 | セレクトフィールド | No | 月給・時給など |
| `salaryMin` | 最低給与 | 数値フィールド | No | 下限金額 |
| `salaryMax` | 最高給与 | 数値フィールド | No | 上限金額 |
| `workStyle` | 勤務形態 | テキストフィールド | No | 日勤のみ・夜勤あり等 |
| `jobCategory` | 職種カテゴリ | コンテンツ参照 (`jobcategories`) | No | |
| `addressZip` | 郵便番号 | テキストフィールド | No | 例: 123-4567 |
| `addressPrefMuni` | 住所（都道府県市区） | テキストフィールド | No | |
| `addressLine` | 住所（番地） | テキストフィールド | No | |
| `addressBuilding` | 建物名等 | テキストフィールド | No | |
| `avgScheduledHour` | 平均所定労働時間 | 数値フィールド | No | 週平均労働時間(h) |
| `socialInsurance` | 社会保険 | テキストフィールド | No | 加入保険 |
| `ssReason` | 社会保険適用差異 | テキストフィールド | No | |
| `salaryNote` | 給与備考 | テキストフィールド | No | |
| `descriptionAppeal` | アピールポイント | リッチエディタ | No | |
| `descriptionWork` | 仕事内容詳細 | リッチエディタ | No | |
| `descriptionPerson` | 求める人材 | リッチエディタ | No | |
| `descriptionBenefits` | 福利厚生備考 | リッチエディタ | No | |
| `workHours` | 勤務時間 | テキストフィールド | No | |
| `holidays` | 休日 | テキストフィールド | No | |
| `descriptionOther` | その他備考 | リッチエディタ | No | |
| `access` | 通勤アクセス | テキストフィールド | No | 最寄駅など |
| `dlNote` | 勤務地補足メモ | テキストフィールド | No | Google Map 補足 |
| `createdAt` / `updatedAt` / `publishedAt` / `revisedAt` | API メタ | 自動付与 | - | microCMS システムフィールド |

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

// フリーワード検索
const { contents: keywordJobs } = await microcmsClient.get<{ contents: Job[] }>({
  endpoint: "jobs",
  queries: {
    limit: 100,
    q: "タクシー運転手", // 全文検索
    depth: 1,
  },
});

// 複合検索（フリーワード × フィルタ）
const { contents: combinedJobs } = await microcmsClient.get<{ contents: Job[] }>({
  endpoint: "jobs",
  queries: {
    limit: 100,
    q: "高収入", // フリーワード検索
    filters: "prefecture[equals]tokyo[and]tags[contains]night-shift", // フィルタ
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

## 5. フリーワード検索仕様

### 検索対象フィールド
microCMS の全文検索（`q` パラメータ）では以下のフィールドが検索対象となります：
- `title`: 求人タイトル
- `jobName`: 職種名
- `companyName`: 会社名
- `catchCopy`: キャッチコピー
- `descriptionWork`: 仕事内容
- `descriptionAppeal`: アピールポイント

### 検索特性
- **完全一致重視**: microCMS の全文検索は完全一致に近い動作
- **日本語対応**: ひらがな・カタカナ・漢字での検索が可能
- **部分一致**: 限定的だが部分一致検索も対応
- **フィルタ併用**: `filters` パラメータとの組み合わせが可能

### 使用例

```ts
// lib/getJobs.ts での実装例
export const getJobs = async ({
  keyword,
  prefectureId,
  municipalityId,
  tagIds = [],
  jobCategoryId,
  limit = 100,
  orders
}: GetJobsParams): Promise<Job[]> => {
  const filterParts: string[] = []
  if (prefectureId) filterParts.push(`prefecture[equals]${prefectureId}`)
  if (municipalityId) filterParts.push(`municipality[equals]${municipalityId}`)
  if (tagIds.length > 0) {
    tagIds.forEach((id) => {
      filterParts.push(`tags[contains]${id}`)
    })
  }
  if (jobCategoryId) filterParts.push(`jobcategory[equals]${jobCategoryId}`)

  const filters = filterParts.join("[and]")

  const data = await microcmsClient.get<MicroCMSListResponse<Job>>({
    endpoint: "jobs",
    queries: {
      limit,
      depth: 1,
      ...(keyword ? { q: keyword } : {}), // フリーワード検索
      ...(orders ? { orders } : {}),
      ...(filters ? { filters } : {}), // フィルタ条件
    },
  })

  return data.contents
}
```

---

## 6. 運用メモ

* `jobs` は検索ページで `limit=100` まで取得し、フロント側でページネーションする実装。<br/>それ以上の件数が必要になったら offset などで追加取得する。
* `tag`, `prefectures` などマスタは更新頻度が低いため ISR や SWR でキャッシュして良い。
* **フリーワード検索**: `q` パラメータを使用し、`filters` との併用が可能。
* **検索パフォーマンス**: キーワードが短すぎる場合は結果が多くなるため、UI側で適切なバリデーションを実装。
* **検索精度**: microCMS の全文検索の特性を理解し、必要に応じてクライアント側でのフィルタリングを補完。
* 不足フィールドを追加した場合はこのドキュメントも更新してください。 