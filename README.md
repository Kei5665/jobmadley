# ライドジョブ | タクシー運転手の求人・転職サイト

## 🚀 プロジェクト概要

ドライバー・運転職の求人情報サイト

## 📋 主要機能

### 求人関連機能
- **求人検索**: 都道府県・市区町村・タグ・職種カテゴリでの詳細検索
- **求人詳細**: 給与、勤務地、福利厚生などの詳細情報表示
- **応募機能**: 求人への直接応募
- **画像ギャラリー**: 職場の雰囲気を伝える複数画像表示

### メディア機能
- **業界記事**: 企業インタビュー・業界情報の配信
- **カテゴリ別記事**: 企業紹介・インタビュー記事など

### 検索・絞り込み機能
- **地域検索**: 都道府県・市区町村での絞り込み
- **タグ検索**: 「夜勤あり」「高収入」などの特徴による絞り込み
- **職種検索**: タクシー運転手・看護師・介護士など職種別検索

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
- pnpm (推奨)

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd jobmedley

# 依存関係をインストール
pnpm install
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
pnpm dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 🗂️ プロジェクト構成

```
jobmedley/
├── app/                     # App Router ページ
│   ├── api/                 # API Routes
│   ├── apply/[id]/         # 応募ページ
│   ├── job/[id]/           # 求人詳細ページ
│   ├── search/             # 求人検索ページ
│   └── components/         # ページ固有コンポーネント
├── components/             # 共通コンポーネント
│   ├── ui/                 # shadcn/ui コンポーネント
│   └── ...                # その他コンポーネント
├── lib/                    # ユーティリティ・データ取得
│   ├── microcms.ts        # microCMS クライアント
│   ├── types.ts           # TypeScript 型定義
│   └── ...                # その他ライブラリ
├── public/                # 静的ファイル
└── doc/                   # ドキュメント
```

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

### 内部API
- `GET /api/municipalities` - 都道府県に応じた市区町村取得
- `POST /api/submit-application` - 応募フォームデータ送信

### microCMS API
- 求人検索・詳細取得
- メディア記事取得
- マスタデータ取得

## 🚀 デプロイメント

```bash
# プロダクションビルド
pnpm build

# プロダクションサーバー起動
pnpm start
```

## 📱 主要ページ

| ページ | パス | 説明 |
|--------|------|------|
| トップ | `/` | ヒーロー・地域検索・最新求人・メディア記事 |
| 求人検索 | `/search` | 条件絞り込み・一覧表示・ページネーション |
| 求人詳細 | `/job/[id]` | 求人詳細・画像ギャラリー・応募ボタン |
| 応募 | `/apply/[id]` | 応募フォーム |
| プライバシー | `/privacy` | プライバシーポリシー |

## 🎨 UI/UX特徴

- **レスポンシブデザイン**: モバイルファースト対応
- **ダークモード**: システム設定に応じた自動切り替え
- **アクセシビリティ**: ARIA対応・キーボードナビゲーション
- **ローディング状態**: Suspenseによる段階的読み込み
- **エラーハンドリング**: ユーザーフレンドリーなエラー表示

## 🔧 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# 型チェック
pnpm type-check

# リンター実行
pnpm lint

# プロダクションビルド
pnpm build
```

## 📝 開発メモ

### パフォーマンス
- ISR (Incremental Static Regeneration) 対応
- 画像最適化 (Next.js Image)
- 並列データ取得 (Promise.all)
- エラーバウンダリー実装

### 制約事項
- microCMS API の limit は 100件まで
- 画像アップロードは microCMS 管理画面から
- API キーの適切な管理が必要

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