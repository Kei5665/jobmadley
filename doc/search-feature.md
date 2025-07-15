# フリーワード検索機能 実装ドキュメント

## 📋 概要

ライドジョブのフリーワード検索機能の実装詳細と運用方法をまとめたドキュメントです。

---

## 🎯 実装内容

### Phase 1: 基本フリーワード検索機能
- **実装日**: 2024年12月
- **目的**: トップページからの直感的な求人検索
- **技術**: microCMS全文検索API（qパラメータ）

---

## 🔧 実装詳細

### 1. フロントエンド実装

#### Hero Section (app/components/hero-section.tsx)
```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const [keyword, setKeyword] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (keyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(keyword.trim())}`)
    }
  }

  // フォーム実装 & Enterキー対応
}
```

#### 検索ページ (app/search/page.tsx)
```tsx
interface SearchPageProps {
  searchParams: Promise<{
    q?: string  // フリーワード検索パラメータ
    prefecture?: string
    municipality?: string
    tags?: string
    jobCategory?: string
    page?: string
  }>
}

// qパラメータを受け取り、getJobsPagedに渡す
const keyword = params.q
const { contents: jobs, totalCount } = await getJobsPaged({
  keyword,
  prefectureId,
  municipalityId,
  tagIds,
  jobCategoryId,
  limit: 10,
  offset: (page - 1) * 10,
})
```

### 2. バックエンド実装

#### データ取得 (lib/getJobs.ts)
```tsx
interface GetJobsParams {
  keyword?: string  // フリーワード検索パラメータ
  // ... 他のパラメータ
}

export const getJobs = async ({
  keyword,
  prefectureId,
  municipalityId,
  tagIds = [],
  jobCategoryId,
  limit = 100,
  orders
}: GetJobsParams): Promise<Job[]> => {
  const data = await microcmsClient.get<MicroCMSListResponse<Job>>({
    endpoint: "jobs",
    queries: {
      limit,
      depth: 1,
      ...(keyword ? { q: keyword } : {}), // 全文検索
      ...(orders ? { orders } : {}),
      ...(filters ? { filters } : {}),
    },
  })

  return data.contents
}
```

#### URL生成 (lib/utils.ts)
```tsx
export const buildSearchQuery = (params: {
  keyword?: string
  prefectureId?: string
  municipalityId?: string
  tagIds?: string[]
  jobCategoryId?: string
  page?: number
}): string => {
  const searchParams = new URLSearchParams()
  
  if (params.keyword?.trim()) {
    searchParams.set("q", params.keyword.trim())
  }
  // ... 他のパラメータ処理
  
  return searchParams.toString()
}
```

---

## 🔍 検索仕様

### 検索対象フィールド
microCMSの全文検索では以下のフィールドが対象：
- `title`: 求人タイトル
- `jobName`: 職種名
- `companyName`: 会社名
- `catchCopy`: キャッチコピー
- `descriptionWork`: 仕事内容
- `descriptionAppeal`: アピールポイント

### 検索の特性
- **完全一致重視**: microCMSの全文検索は完全一致に近い動作
- **日本語対応**: ひらがな・カタカナ・漢字での検索が可能
- **部分一致**: 限定的だが部分一致検索も対応
- **フィルタ併用**: `filters`パラメータとの組み合わせが可能

---

## 🌐 URL設計

### 基本検索
```
/search?q=タクシー運転手
```

### 複合検索
```
/search?q=高収入&prefecture=tokyo&tags=night-shift
```

### パラメータ仕様
| パラメータ | 型 | 説明 | 例 |
|-----------|-----|------|-----|
| `q` | string | フリーワード検索 | `?q=タクシー運転手` |
| `prefecture` | string | 都道府県ID | `?prefecture=tokyo` |
| `municipality` | string | 市区町村ID | `?municipality=shibuya` |
| `tags` | string | タグID（カンマ区切り） | `?tags=high-income,night-shift` |
| `jobCategory` | string | 職種カテゴリID | `?jobCategory=driver` |
| `page` | number | ページ番号 | `?page=2` |

---

## 🎨 UI/UX実装

### 検索条件表示
```tsx
// app/search/components/search-condition-summary.tsx
const parts: string[] = []
if (keyword) parts.push(`「${keyword}」`)
parts.push(prefectureName)
if (selectedMunicipality) parts.push(selectedMunicipality.name)
if (currentJobCategoryName) parts.push(currentJobCategoryName)
if (tagNames.length) parts.push(tagNames.join(", "))

return (
  <p className="text-sm text-gray-600 leading-relaxed">
    {parts.join(" / ")} の求人を表示中
  </p>
)
```

### 検索状態保持
各種ダイアログ（タグ選択、職種選択、市区町村選択）でキーワードを保持：
```tsx
// components/tags-dialog.tsx
const apply = () => {
  const params = new URLSearchParams()
  if (keyword) params.set("q", keyword)  // キーワード保持
  if (prefectureId) params.set("prefecture", prefectureId)
  if (municipalityId) params.set("municipality", municipalityId)
  if (selected.length) params.set("tags", selected.join(","))
  router.push(`/search?${params.toString()}`)
}
```

---

## 🚀 今後の拡張予定

### Phase 2: 検索機能の強化
- [ ] 検索履歴機能
- [ ] 人気キーワードのサジェスト
- [ ] 検索結果のキーワードハイライト
- [ ] 検索結果の並び順最適化

### Phase 3: 高度な検索機能
- [ ] 除外ワード検索
- [ ] 検索条件の保存機能
- [ ] 検索アラート機能
- [ ] 検索分析・レポート機能

---

## 📝 運用メモ

### パフォーマンス
- microCMSのAPI制限（limit=100）を考慮した実装
- キーワードが短すぎる場合の結果数増加に注意
- 検索クエリのキャッシュ化を検討

### 検索精度
- microCMSの全文検索の特性を理解
- 必要に応じてクライアント側でのフィルタリング補完
- ユーザーの検索行動を分析し、検索精度を向上

### 監視・改善
- 検索クエリの分析
- 検索結果のクリック率測定
- ユーザーフィードバックの収集

---

## 🔍 テスト方法

### 基本テスト
1. トップページで「タクシー運転手」を検索
2. 検索結果ページで関連する求人が表示されることを確認
3. 検索条件に「タクシー運転手」が表示されることを確認

### 複合検索テスト
1. 「高収入」で検索後、東京都を選択
2. URL が `/search?q=高収入&prefecture=tokyo` になることを確認
3. キーワードと地域の両方で絞り込まれた結果が表示されることを確認

### エラーハンドリングテスト
1. 空文字で検索（検索実行されないことを確認）
2. 検索結果が0件の場合の表示確認
3. APIエラー時の適切なエラー表示確認

---

## 📚 参考資料

- [microCMS API リファレンス](https://document.microcms.io/content-api/get-list-contents)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hook Form](https://react-hook-form.com/) 