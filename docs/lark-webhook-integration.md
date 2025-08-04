# Lark Webhook連携API

## 概要

求人応募データをLark（飛書）のWebhookエンドポイントに転送するAPIエンドポイントです。
フロントエンドから送信された応募フォームデータを受け取り、設定されたLark WebhookURLに転送します。

## エンドポイント

- **URL**: `/api/submit-application`
- **Method**: `POST`
- **Content-Type**: `application/json`

## リクエスト形式

```json
{
  "name": "応募者名",
  "email": "応募者メールアドレス",
  "phone": "電話番号",
  "jobId": "求人ID",
  "message": "応募メッセージ"
}
```

## レスポンス形式

### 成功時
```json
{
  "success": true
}
```

### エラー時
```json
{
  "success": false,
  "message": "エラーメッセージ"
}
```

## ステータスコード

- `200`: 正常に処理完了
- `4xx`: Webhook側のクライアントエラー（Webhook URLからのレスポンスをそのまま返す）
- `500`: サーバー内部エラー

## 実装詳細

### ファイル場所
`app/api/submit-application/route.ts`

### Webhook URL
現在のWebhook URL:
```
https://ipef3glqb1t.jp.larksuite.com/base/automation/webhook/event/ZriRalpF8w99nPhDQ1ijp8m1pRc
```

### エラーハンドリング
- Webhook側のエラーはクライアントにそのまま転送
- サーバー内部エラーは500ステータスで汎用エラーメッセージを返す
- 全ての応募データはサーバーログに出力（デバッグ用）

### セキュリティ考慮事項
- Webhook URLは環境変数化を検討（現在はハードコード）
- 入力データのバリデーションを追加することを推奨

## 使用例

```javascript
// フロントエンドからの呼び出し例
const response = await fetch('/api/submit-application', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '田中太郎',
    email: 'tanaka@example.com',
    phone: '090-1234-5678',
    jobId: 'job-123',
    message: 'ぜひ応募させていただきたいです。'
  })
});

const result = await response.json();
if (result.success) {
  console.log('応募が正常に送信されました');
} else {
  console.error('応募送信エラー:', result.message);
}
```

## 今後の改善案

1. **環境変数化**: `LARK_WEBHOOK_URL`として環境変数で管理
2. **バリデーション**: 入力データの形式チェック
3. **レート制限**: 同一IPからの連続リクエスト制限
4. **ログ改善**: 構造化ログの導入
5. **リトライ機能**: Webhook送信失敗時の自動リトライ