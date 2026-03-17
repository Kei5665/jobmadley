# Search Console 運用手順（5xx対策）

## 1. 監視対象
- `/`
- `/search`
- `/job/*`
- `GET /sitemap.xml`
- `GET /robots.txt`

## 2. 監視メトリクス
- 5xx 率
- レスポンスタイム（p95）
- microCMS リクエスト失敗率
- 外部Webhook失敗率（応募API/問い合わせAPI）

## 3. 障害発生時の一次切り分け
1. Vercel の Function Logs を確認し、失敗URLを特定
2. ログ内の `[microCMS:*]` で失敗箇所を特定
3. 環境変数不足の場合は `[microCMS:config]` ログを確認
4. 外部Webhook失敗（502）は対象Webhookの疎通を確認

## 4. Search Console 再検証順
1. サーバーエラー (5xx)
2. 重複（canonical関連）
3. noindex 除外
4. 404 / ソフト404

## 5. デプロイ後の確認
- `https://ridejob.jp/robots.txt`
- `https://ridejob.jp/sitemap.xml`
- URL検査: `/job/{id}` がユーザー指定 canonical として認識されること
- URL検査: `/search?...` が noindex で除外されること
