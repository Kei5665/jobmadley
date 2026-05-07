# ライドジョブ | タクシードライバー・自動車整備士・デリバリーの求人・転職サイト

## 🚀 プロジェクト概要

タクシードライバー、自動車整備士、フードデリバリー営業など、暮らしと街を支える仕事の求人情報サイト。

## 📋 主要機能

### 求人関連機能
- **フリーワード検索**: 求人タイトル・職種・会社名・仕事内容でのキーワード検索
- **求人検索**: 都道府県・市区町村・タグ・職種カテゴリでの詳細検索
- **複合検索**: フリーワード × 地域・タグ・職種の組み合わせ検索
- **求人詳細**: 給与、勤務地、福利厚生などの詳細情報表示
- **応募機能**: 求人への直接応募
- **画像ギャラリー**: 職場の雰囲気を伝える複数画像表示

### メディア機能
- **業界記事**: 企業インタビュー・業界情報の配信
- **カテゴリ別記事**: 企業紹介・インタビュー記事など

### 検索・絞り込み機能
- **フリーワード**: 直感的なキーワード検索（「タクシー運転手」「高収入」など）
- **地域検索**: 都道府県・市区町村での絞り込み
- **タグ検索**: 「夜勤あり」「高収入」などの特徴による絞り込み
- **職種検索**: タクシードライバー・自動車整備士・フードデリバリーなど職種別検索
- **複合検索**: 複数条件の組み合わせ検索

## 🛠️ 技術スタック

### フロントエンド
- **Next.js** 15.2.4 (App Router)
- **React** 19
- **TypeScript** 5
- **Tailwind CSS** 3.4.17
- **shadcn/ui** (UIコンポーネント)

### バックエンド・データ
- **microCMS** (ヘッドレスCMS)
- **microcms-js-sdk** (API クライアント)

### 開発・UI
- **React Hook Form** (フォーム管理)
- **Zod** (バリデーション)
- **Lucide React** (アイコン)
- **next-themes** (ダークモード対応)

## 🔧 セットアップ

### 必要要件
- Node.js 18.17 以上
- npm

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd jobmedley

# 依存関係をインストール
npm install
```

### 環境変数の設定

`.env.local` ファイルを作成し、以下の変数を設定してください：

```env
# 求人サービス（メイン）
NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key

# メディアサービス（ブログ）
NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN_2=your-media-service-domain
MICROCMS_API_KEY_2=your-media-api-key
```

> **注意**: API キーは `NEXT_PUBLIC_` を付けずに設定し、クライアントサイドに漏洩しないようにしてください。

### 開発サーバーの起動

```bash
# 開発サーバーを起動
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 🗂️ プロジェクト構成

ソースは `src/` 配下に集約され、ドメイン単位の vertical slice (`features/`) と
横断的な共通基盤 (`shared/`) に分かれています。

```
jobmedley/
├── src/
│   ├── app/                     # App Router (ルーティングのみ薄く保つ)
│   │   ├── api/                 # API Routes (applications, submit-application, contact, municipalities, preview)
│   │   ├── apply/[id]/          # 応募ページ
│   │   ├── job/[id]/            # 求人詳細ページ
│   │   ├── search/              # 求人検索ページ
│   │   └── components/          # ページ固有 sections (hero, latest-jobs, ...)
│   ├── features/                # ドメイン単位の垂直スライス (各 feature に api.ts / types.ts / components/ を持つ)
│   │   ├── jobs/                # 求人 (api.ts: getJob/getJobs/getJobCount/getJobsPaged, JobCard, types.ts)
│   │   ├── application/         # 応募 (schema, normalize, ApplicationForm, hooks/, lib/submitApplication, types.ts)
│   │   ├── contact/             # 問い合わせフォーム
│   │   ├── master/              # 都道府県/市区町村/タグ/職種カテゴリ + types.ts
│   │   └── media/               # ブログ記事 (api.ts, types.ts)
│   ├── shared/                  # 横断インフラ
│   │   ├── microcms/            # microCMS クライアント + fetcher + types
│   │   ├── lark/                # Lark Webhook 送信 + 求人種別ルーティング
│   │   ├── config/              # 環境変数アクセス
│   │   ├── lib/                 # utils, error-handling, metadata, ...
│   │   ├── ui/                  # shadcn/ui
│   │   ├── components/          # SiteHeader, SiteFooter, theme-provider
│   │   └── hooks/               # use-mobile, use-toast
│   └── middleware.ts            # Next.js middleware (検索URL正規化)
├── public/                      # 静的ファイル
├── tests/                       # テスト用 fixtures
├── doc/ , docs/                 # 技術仕様・運用ドキュメント
├── tsconfig.json                # paths "@/*" → "./src/*"
└── components.json              # shadcn/ui エイリアス設定
```

import は全て `@/...` エイリアス経由（`@/features/*`, `@/shared/*`, `@/app/*`）。

## 📊 データ構造

### microCMS サービス1（求人データ）
- **jobs**: 求人情報（タイトル、給与、勤務地、詳細など）
- **prefectures**: 47都道府県マスタ
- **municipalities**: 市区町村データ
- **tag**: 特徴・こだわりタグ
- **jobcategories**: 職種カテゴリ

### microCMS サービス2（メディア）
- **blogs**: ブログ記事データ
- **categories**: 記事カテゴリ

## 🔍 API エンドポイント

### 内部 API ルート (`src/app/api/*`)

| メソッド | パス | 用途 |
|---|---|---|
| `POST` | `/api/submit-application` | 自社応募フォーム送信。求人種別 (CP One / 整備士 / スタンバイ / 求人ボックス) を判定し Lark Webhook へ通知 |
| `POST` | `/api/applications` | 外部経由 (スタンバイ等) の flat 応募データ受信。重複チェック後 Lark へ通知 |
| `POST` | `/api/contact` | 採用担当者向け問い合わせフォーム。Lark へ通知 |
| `GET` | `/api/municipalities?prefecture=<id>` | 都道府県 ID から市区町村一覧を返す (応募/検索フォームのクライアント側絞り込みで利用) |
| `GET` | `/api/preview?secret=&type=&id=&draftKey=` | microCMS プレビュー用。secret 一致時に draftMode 有効化 → 詳細ページへ redirect |

求人種別ごとの Webhook 振り分けは `src/shared/lark/routing.ts` に集約。

### microCMS API (外部)
- 求人検索・詳細取得 (jobs)
- メディア記事取得 (blogs)
- マスタデータ取得 (prefectures, municipalities, tag, jobcategories)

## 🚀 デプロイメント

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start
```

## 📱 主要ページ

| ページ | パス | 説明 |
|--------|------|------|
| トップ | `/` | ヒーロー・地域検索・最新求人・メディア記事 |
| 求人検索 | `/search` | 条件絞り込み・一覧表示・ページネーション |
| 求人詳細 | `/job/[id]` | 求人詳細・画像ギャラリー・応募ボタン |
| 応募 | `/apply/[id]` | 応募フォーム |
| プライバシー | `/privacy` | プライバシーポリシー |

## 🔍 検索機能の使い方

### フリーワード検索
トップページの検索ボックスから直感的な検索が可能です：

```
例: 「タクシー運転手」「高収入」「夜勤」「東京」
```

### 複合検索
フリーワード × 地域・タグ・職種の組み合わせで詳細検索：

```
キーワード「高収入」+ 都道府県「東京」+ タグ「夜勤あり」
→ /search?q=高収入&prefecture=tokyo&tags=night-shift
```

### 検索URL仕様
| パラメータ | 説明 | 例 |
|-----------|------|-----|
| `q` | フリーワード検索 | `?q=タクシー運転手` |
| `prefecture` | 都道府県ID | `?prefecture=tokyo` |
| `municipality` | 市区町村ID | `?municipality=shibuya` |
| `tags` | タグID（複数可） | `?tags=high-income,night-shift` |
| `jobCategory` | 職種カテゴリID | `?jobCategory=driver` |
| `page` | ページ番号 | `?page=2` |

### 検索対象フィールド
フリーワード検索では以下のフィールドが対象となります：
- 求人タイトル（title）
- 職種名（jobName）
- 会社名（companyName）
- キャッチコピー（catchCopy）
- 仕事内容（descriptionWork）
- アピールポイント（descriptionAppeal）

## 🎨 UI/UX特徴

- **レスポンシブデザイン**: モバイルファースト対応
- **ダークモード**: システム設定に応じた自動切り替え
- **アクセシビリティ**: ARIA対応・キーボードナビゲーション
- **ローディング状態**: Suspenseによる段階的読み込み
- **エラーハンドリング**: ユーザーフレンドリーなエラー表示

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 型チェック
npx tsc --noEmit

# リンター実行
npm run lint

# プロダクションビルド
npm run build
```

## 📝 開発メモ

### パフォーマンス
- ISR (Incremental Static Regeneration) 対応
- 画像最適化 (Next.js Image)
- 並列データ取得 (Promise.all)
- エラーバウンダリー実装
- フリーワード検索結果のページネーション最適化

### 制約事項
- microCMS API の limit は 100件まで
- 画像アップロードは microCMS 管理画面から
- API キーの適切な管理が必要
- **フリーワード検索**: microCMS の全文検索は完全一致に近い動作
- **検索精度**: 日本語の部分一致検索は限定的

### フリーワード検索機能
- **検索対象**: 求人タイトル、職種名、会社名、キャッチコピー、仕事内容、アピールポイント
- **複合検索**: 地域・タグ・職種との組み合わせ検索に対応
- **URL設計**: `/search?q=キーワード&prefecture=tokyo&tags=tag1,tag2`
- **詳細ドキュメント**: `doc/search-feature.md` を参照

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 📞 サポート

質問やバグ報告は Issue を作成してください。 