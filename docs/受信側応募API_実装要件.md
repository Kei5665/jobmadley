# 応募連携 受信側API 実装要件（求人ボックス連携）

本書は、求人ボックス応募連携における「postUrl（受信側）」の実装要件をまとめたものです。テスト合格（200/404/410 の再現）と本番運用を安全に行うための仕様・手順を記載します。

---

## 1. 背景 / 前提

- 本プロジェクト（フィード生成側）は、microCMS の求人を求人ボックス仕様の XML に変換し、GCS に配置します。
- 応募時、求人ボックスは `<kbox-apply-data>` の `kbox-apply-postUrl` に対して応募データを POST します。
- 受信側APIは、受信内容に応じて HTTP ステータス（200/404/410 等）を返却します（応募連携.md 5.1/5.3）。
- 連携テストでは 200/404/410 の挙動確認が求められています。

補助リンク（テスト関連）
- 追加質問チェックツール: `https://xn--pckua2a7gp15089zb.com/test/apply/questions-check`
- 応募連携テスト設定フォーム（参考）: `https://xn--pckua2a7gp15089zb.com/test/apply/v1/setting-form`

---

## 2. スコープ

受信側APIの責務:
- 求人ボックスからの応募データ受信（HTTPS）
- リクエスト署名（HMAC-SHA1）検証
- テスト/本番に応じたステータス返却
- （本番）求人の実在確認・期限判定・重複判定
- エラーハンドリング、リトライ考慮、監視・ロギング

非スコープ（このAPIでは行わない）:
- XML フィード生成・配信
- 求人ボックス側の画面/フォーム制御

---

## 3. エンドポイント仕様

- メソッド: `POST`
- パス例: `/api/applications`（任意のパスで可）
- プロトコル: `HTTPS` 必須
- Content-Type:
  - `application/json; charset=utf-8`（推奨）
  - `application/x-www-form-urlencoded`（受領だけ可能にしても良い。原文では UTF-8）
- ヘッダー: `X-KyujinBox-Signature`（HMAC-SHA1 署名、詳細は後述）

応答時間目安: 5 秒以内に応答（タイムアウトで求人ボックス側の再送が発生し、応募者体験を損なうため）。

---

## 4. 署名検証（必須）

- アルゴリズム: `HMAC-SHA1`
- キー: 共有された `secretKey`
- 署名対象: 受信した「生のリクエストボディ（raw body）」
- ヘッダー: `X-KyujinBox-Signature`（16進数小文字のハッシュ想定。大文字小文字は実装側で吸収可）

疑似コード:

```js
const signatureHeader = req.headers['x-kyujinbox-signature'] || req.headers['X-KyujinBox-Signature'];
const rawBody = req.rawBody /* ミドルウェアで生ボディ保持 */; 
const expected = crypto.createHmac('sha1', SECRET_KEY).update(rawBody).digest('hex');
if (signatureHeader !== expected) return res.status(401).send('Unauthorized');
```

実装メモ:
- `express.json()` などでパースすると raw body が失われます。`express.raw({ type: [...] })` もしくは raw body を保持するミドルウェアを併用してください。
- 署名不一致は `401 Unauthorized` を返してください。

---

## 5. ペイロード構造（例）

トップレベル（抜粋）:
- `id`: 応募ID（文字列）
- `appliedOnMillis`: 応募日時（unixtime）
- `job`: 応募された求人情報
- `applicant`: 応募者の基本情報回答
- `analytics`: UA / IP など
- `questionsAndAnswers`: 追加質問と回答（利用時）

例:

```json
{
  "id": "app-20250801-001",
  "appliedOnMillis": 1722500000000,
  "job": {
    "id": "test-200",
    "title": "ドライバー",
    "url": "https://ridejob.jp/job/test-200",
    "companyName": "テスト交通株式会社",
    "location": "東京都渋谷区"
  },
  "applicant": {
    "firstName": "太郎",
    "lastName": "テスト",
    "email": "test@example.com"
  },
  "analytics": {
    "userAgent": "Mozilla/5.0",
    "ipAddress": "203.0.113.10"
  },
  "questionsAndAnswers": []
}
```

---

## 6. レスポンス仕様

最低限（テスト要件）:
- `200 OK`: 受信完了
- `404 Not Found`: 応募対象の求人が存在しない
- `410 Gone`: 応募対象の求人が有効期限切れ

推奨（将来対応）:
- `409 Conflict`: 重複応募（同一応募ID の再送など）
- `413 Payload Too Large`: データ容量超過
- `500 Internal Server Error`: サーバ内部エラー

リトライ挙動（応募連携.md より）:
- 404, 500 は「あり」（再送）。410/409/413 は「なし」。

---

## 7. テストモード（総合テスト用の強制分岐）

目的: 連携テスト時に 200/404/410 を確実に再現する。

方針:
- フィード側で `job.id` を以下 3 件に固定して出力します。
  - `test-200` → 200 を返す
  - `test-404` → 404 を返す
  - `test-410` → 410 を返す
- 受信側は「job.id による擬似分岐」を実装し、環境変数で有効化します。

設定例:
- `APPLY_TEST_MODE=1` のときのみ擬似分岐を有効化

擬似コード:

```js
if (process.env.APPLY_TEST_MODE === '1') {
  const jobId = payload.job?.id;
  if (jobId === 'test-404') return res.status(404).send('Job Not Found');
  if (jobId === 'test-410') return res.status(410).send('Job Expired');
  if (jobId === 'test-200') return res.status(200).send('OK');
}
```

---

## 8. 本番モード（実運用ロジック）

`APPLY_TEST_MODE !== '1'` の場合、以下の実装に切り替えます。

1) 実在チェック（404）
- 自社DB もしくは microCMS を参照し、`job.id` に一致する求人が存在しない場合は `404` を返却。
- 参照先・キャッシュ戦略はパフォーマンスを考慮（例: Redis キャッシュ、短TTL）。

2) 期限判定（410）
- フィールド例（いずれか）: `expiredAt`、`isActive`、`publishedAt` + `status`、`archivedAt` など社内定義で OK。
- 期限切れ・非掲載・非公開など応募不可状態であれば `410` を返却。

3) 重複判定（409）
- 応募ID（`payload.id`）の冪等性キーで受理済みを検知し、二重処理を回避。
- 仕様上は `409`（再送なし）でも良いが、運用上の再送抑止を考慮し `200` を返す方針も検討可（要合意）。

4) 成功（200）
- 正常受領後、非同期で後段処理（保存・通知・キュー投入など）を実行。同期処理を重くしない。

---

## 9. エラーハンドリング / 非機能

- タイムアウト: 5 秒以内に応答（内部処理はキュー化推奨）
- リクエストサイズ制限: 15MB 程度まで許容（求人ボックス仕様の添付上限を考慮）。超過は `413`。
- ロギング: PII をマスキング（メール・電話・住所・誕生日）。署名不一致時は生ボディ保存しない。
- 監視: 5xx の割合、処理時間、受信件数をメトリクス化。アラート設定。
- セキュリティ: HTTPS 必須、署名検証必須、レート制限（任意）、WAF（任意）。

---

## 10. 環境変数（例）

| 変数名 | 用途 | 例 |
|---|---|---|
| `APPLY_TEST_MODE` | テストモードON/OFF | `1` / `0` |
| `KBOX_SECRET_KEY` | 署名検証用シークレット | `xxxxxxxx` |
| `LOG_LEVEL` | ログ出力レベル | `info` |
| `REQUEST_LIMIT_MB` | 受信許容量（MB） | `15` |

---

## 11. テスト計画 / 手順

1) 受信API起動（`APPLY_TEST_MODE=1`）
2) フィード側はテスト用 XML（3 求人: `test-200`/`test-404`/`test-410`）を GCS へ配置
3) 求人ボックスのテスト環境にフィードURLと `postUrl` を登録
4) 各求人で応募 → 受信APIが 200 / 404 / 410 を返すことを確認
5) 署名不一致時に `401` となることを確認
6) 本番切替前に `APPLY_TEST_MODE=0` で実在・期限判定ロジックが有効になることを確認

補助ツール:
- 追加質問 JSON の事前検証: `https://xn--pckua2a7gp15089zb.com/test/apply/questions-check`

---

## 12. ロールアウト戦略

- フェーズ1: テストモードで 200/404/410 の再現に合格
- フェーズ2: 本番モードを影響最小で導入（最初は影で判定＋ログのみ → 有効化）
- フェーズ3: 監視しつつ、重複/容量超過/内部エラー対応を段階実装

---

## 13. サンプル実装（参考）

Node.js/Express（疑似コード）

```js
import express from 'express';
import crypto from 'crypto';

const app = express();

// raw body を保持
app.use(express.raw({ type: 'application/json', limit: '15mb' }));
app.use(express.raw({ type: 'application/x-www-form-urlencoded', limit: '15mb' }));

function verifySignature(rawBody, signature) {
  const expected = crypto.createHmac('sha1', process.env.KBOX_SECRET_KEY).update(rawBody).digest('hex');
  return signature === expected;
}

app.post('/api/applications', (req, res) => {
  const signature = req.headers['x-kyujinbox-signature'];
  const rawBody = req.body?.toString() || '';
  if (!verifySignature(rawBody, signature)) return res.status(401).send('Unauthorized');

  const payload = JSON.parse(rawBody);

  // テストモード分岐
  if (process.env.APPLY_TEST_MODE === '1') {
    const jobId = payload.job?.id;
    if (jobId === 'test-404') return res.status(404).send('Job Not Found');
    if (jobId === 'test-410') return res.status(410).send('Job Expired');
    return res.status(200).send('OK');
  }

  // 本番モード（例）
  const job = findJob(payload.job?.id); // DB/microCMS 参照
  if (!job) return res.status(404).send('Job Not Found');
  if (isExpired(job)) return res.status(410).send('Job Expired');

  // 重複・容量超過等の実装は必要に応じて追加
  return res.status(200).send('OK');
});

app.listen(3000, () => console.log('listening on 3000'));
```

---

## 14. 連絡事項

- 本ドキュメントは「受信側」実装チーム向けです。仕様疑義や環境情報（`postUrl`、`secretKey` など）は Slack/Issues で連携ください。


