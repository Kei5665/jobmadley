## 求人検索ページ レイアウト/検索条件リニューアル計画

### 目的
- PC/モバイルのUIを添付デザインに寄せ、検索条件を「勤務地（都道府県）/職種/タグ」に整理。市区町村の選択も可能な場合は継続提供。
- ソートは「おすすめ順/新着順」をUIとして表示（いずれも実際の並びは新着順）。

### スコープ
- 対象ページ: `app/search/page.tsx`
- 関連コンポーネント: `app/search/components/*`、`components/*-dialog.tsx`
- 影響ライブラリ: `lib/getJobs.ts`（orders 指定）、`lib/utils.ts`（URL生成）

### URL/クエリ仕様
- 既存: `q`, `prefecture`, `municipality`, `tags`, `jobCategory`, `page`
- 追加: `sort`（UI状態のみ、`recommended` | `new`）。APIの並びは常に新着順で固定。
- ページネーション時は `sort` を保持。

### UI/レイアウト方針
- PC: 左サイドバーにフィルタ（勤務地/市区町村/職種/タグ）、右に「件数/ソートタブ/結果/ページネーション」。
- モバイル: フィルタは上部縦積み、ソートタブは結果リスト直上。

### 検索条件コンポーネント
1. 都道府県選択ダイアログ（新規: `components/prefecture-dialog.tsx`）
   - 入力: `PrefectureGroup`、`keyword?`、`jobCategoryId?`、`tagIds?`
   - 選択時: `prefecture` を設定し、`municipality` はクリア。
2. 市区町村ダイアログ（既存: `components/municipality-dialog.tsx`）
   - `prefecture` がある時のみ表示。
3. 職種ダイアログ（既存: `components/job-category-dialog.tsx`）
4. タグダイアログ（既存: `components/tags-dialog.tsx`）
5. ソートタブ（新規: `app/search/components/sort-tabs.tsx`）
   - `sort` クエリを書き換え、UI状態のみ切替。

### 実装タスク（Phase 1）
1) `sort-tabs.tsx` 追加（クエリ `sort` 切替。APIの `orders` には影響させない）
2) `prefecture-dialog.tsx` 追加（都道府県一覧からリンク生成。`municipality` を外す）
3) `search-options.tsx` を「勤務地（都道府県）/市区町村/職種/タグ」の順で再構成
4) `app/search/page.tsx` を更新
   - `sort` 受け取り
   - `getPrefectureGroups()` を取得して `SearchOptions` へ渡す
   - `getJobsPaged` 呼び出しに `orders: "-publishedAt"` を明示
   - ソートタブを結果リスト上に設置
5) `lib/utils.ts` の `buildSearchQuery` に `sort?` を追加し、ページネーションで維持

### 実装タスク（Phase 2: レイアウト最適化）
- 左サイドバー化（PC）/アコーディオン（SP）
- 「リセット」ボタン（クエリクリア）
- スタイル微調整（sticky・余白・カード化）

### テスト観点
- 都道府県変更で `municipality` がクリアされる
- 既存クエリ（`q`,`tags`,`jobCategory`,`page`）の維持
- `sort` のUI状態保持とページ送りでの維持
- PC/モバイルの崩れがない（2カラム/縦積み）

### リスク/留意
- microCMS APIは `limit<=100`（大量結果時のページングは既存仕様を踏襲）
- `sort` はUIのみで、実データ順は常に新着順

### 想定工数
- Phase 1: 0.5〜1.0日 / Phase 2: 0.5〜1.0日


