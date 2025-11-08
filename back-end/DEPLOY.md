# Formeet Backend - デプロイガイド

## 前提条件

- Node.js 18以上
- Firebase プロジェクト
- Vercel アカウント
- 各種APIキー（OpenAI, Google Maps）

---

## 1. Firebaseセットアップ

### 1.1 プロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名: `formeet-mvp`
4. Google Analyticsは任意で有効化

### 1.2 Firestore有効化

1. 左メニュー → **Firestore Database**
2. 「データベースを作成」
3. ロケーション: `asia-northeast1`（東京）
4. セキュリティルール: **テストモード**で開始

### 1.3 Authentication有効化

1. 左メニュー → **Authentication**
2. 「始める」をクリック
3. ログイン方法:
   - **メール/パスワード**: 有効化
   - （将来的にGoogle/Appleログインも追加可能）

### 1.4 サービスアカウントキー取得

1. プロジェクト設定（⚙️アイコン） → **プロジェクトの設定**
2. **サービスアカウント**タブ
3. 「新しい秘密鍵の生成」をクリック
4. JSONファイルをダウンロード → `serviceAccountKey.json`として保存（ローカル開発用）

⚠️ **重要**: このファイルは絶対にGitHubにコミットしない！（`.gitignore`に追加済み）

### 1.5 Firestoreセキュリティルールとインデックスをデプロイ

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# ログイン
firebase login

# プロジェクトを初期化
firebase init firestore

# セキュリティルールとインデックスをデプロイ
firebase deploy --only firestore:rules,firestore:indexes
```

---

## 2. 環境変数の設定

### 2.1 ローカル開発用

`.env.example`を`.env`にコピー:

```bash
cp .env.example .env
```

`.env`を編集:

```env
# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_ADMIN_SERVICE_ACCOUNT=./serviceAccountKey.json

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxx

# Google Maps
GOOGLE_MAPS_API_KEY=AIzaSyxxxxxx

# Environment
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19006
```

### 2.2 Vercel本番環境用

Vercel環境変数は後述のデプロイ手順で設定します。

---

## 3. OpenAI APIキー取得

1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. APIキーを作成
3. `.env`の`OPENAI_API_KEY`に設定

**料金目安**:
- GPT-4o-mini: $0.15/1Mトークン（入力）、$0.60/1Mトークン（出力）
- Whisper: $0.006/分（音声認識）
- 月間予算: 約$50-100（MVP段階）

---

## 4. Google Maps APIキー取得

1. [Google Cloud Console](https://console.cloud.google.com/)
2. 新しいプロジェクトを作成: `formeet-maps`
3. APIとサービス → ライブラリ
4. 以下のAPIを有効化:
   - **Distance Matrix API**
   - **Geocoding API**
5. 認証情報 → APIキーを作成
6. キーの制限を設定（セキュリティ強化）:
   - アプリケーションの制限: **HTTPリファラー**
   - API制限: Distance Matrix API、Geocoding APIのみ

**料金目安**:
- Distance Matrix: $5/1000リクエスト
- Geocoding: $5/1000リクエスト
- 月間無料枠: $200分
- 月間予算: 約$20-50（MVP段階）

---

## 5. ローカル開発

### 5.1 依存関係のインストール

```bash
npm install
```

### 5.2 開発サーバー起動

```bash
npm run dev
```

→ http://localhost:3000 でAPIサーバーが起動

### 5.3 動作確認

```bash
# ヘルスチェック
curl http://localhost:3000/api

# レスポンス例:
{
  "success": true,
  "message": "Formeet API is running",
  "version": "1.0.0",
  "timestamp": "2024-11-08T10:00:00.000Z"
}
```

---

## 6. Vercelデプロイ

### 6.1 Vercel CLIインストール

```bash
npm install -g vercel
```

### 6.2 Vercelにログイン

```bash
vercel login
```

### 6.3 初回デプロイ

```bash
vercel
```

プロンプトに従って設定:
- **Set up and deploy?** → Yes
- **Which scope?** → 自分のアカウント
- **Link to existing project?** → No
- **Project name?** → formeet-backend
- **In which directory?** → ./

### 6.4 環境変数を設定

Vercel Dashboardで環境変数を追加:

```bash
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_ADMIN_SERVICE_ACCOUNT
vercel env add OPENAI_API_KEY
vercel env add GOOGLE_MAPS_API_KEY
vercel env add ALLOWED_ORIGINS
```

⚠️ **重要**: `FIREBASE_ADMIN_SERVICE_ACCOUNT`は**JSON文字列全体**を設定:

```bash
# serviceAccountKey.jsonの内容をコピーして貼り付け
{"type":"service_account","project_id":"..."}
```

### 6.5 本番デプロイ

```bash
npm run deploy
```

→ デプロイ完了後、URLが表示されます（例: `https://formeet-backend.vercel.app`）

---

## 7. デプロイ後の確認

### 7.1 ヘルスチェック

```bash
curl https://formeet-backend.vercel.app/api
```

### 7.2 エンドポイント一覧

```
GET  https://formeet-backend.vercel.app/api
POST https://formeet-backend.vercel.app/api/auth/register
POST https://formeet-backend.vercel.app/api/auth/login
GET  https://formeet-backend.vercel.app/api/tasks/list
POST https://formeet-backend.vercel.app/api/tasks/create
PUT  https://formeet-backend.vercel.app/api/tasks/update
DELETE https://formeet-backend.vercel.app/api/tasks/delete
POST https://formeet-backend.vercel.app/api/planning/morning-prompt
POST https://formeet-backend.vercel.app/api/planning/auto-schedule
POST https://formeet-backend.vercel.app/api/voice/transcribe
GET  https://formeet-backend.vercel.app/api/analytics/daily-report
```

---

## 8. モバイルアプリとの接続

モバイルアプリ（React Native）の環境変数を設定:

```env
# formeet-mobile/.env
EXPO_PUBLIC_API_URL=https://formeet-backend.vercel.app/api
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_web_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

---

## 9. トラブルシューティング

### エラー: "Firebase initialization error"

**原因**: サービスアカウントキーが正しく設定されていない

**解決策**:
1. Vercel環境変数を確認
2. JSON文字列が正しいか確認（改行なし、エスケープ不要）
3. `firebase-admin`のバージョンを確認

### エラー: "OpenAI API key is not set"

**原因**: OpenAI APIキーが環境変数に設定されていない

**解決策**:
```bash
vercel env add OPENAI_API_KEY
# APIキーを入力
vercel --prod
```

### エラー: "CORS policy blocked"

**原因**: モバイルアプリのオリジンが許可されていない

**解決策**:
```bash
vercel env add ALLOWED_ORIGINS
# 例: http://localhost:8081,https://your-app.vercel.app
vercel --prod
```

---

## 10. コスト管理

### Firebase料金（Spark Plan - 無料枠）

| 項目 | 無料枠 | 超過料金 |
|------|--------|----------|
| Firestore読み取り | 50k/日 | $0.06/100k |
| Firestore書き込み | 20k/日 | $0.18/100k |
| Authentication | 無制限 | 無料 |

**MVP段階**: 無料枠内で運用可能

### OpenAI料金（従量課金）

| API | 料金 | 月間予算 |
|-----|------|----------|
| GPT-4o-mini | ~$0.30/1M | $30-50 |
| Whisper | $0.006/分 | $20-30 |

**合計予算**: 約$50-80/月

### Google Maps料金（従量課金）

| API | 料金 | 月間予算 |
|-----|------|----------|
| Distance Matrix | $5/1000 | $20-30 |
| Geocoding | $5/1000 | $10-20 |

**月間無料枠**: $200分あり

**合計予算**: 無料枠内で運用可能

### Vercel料金（Hobby Plan - 無料）

- **Bandwidth**: 100GB/月
- **Functions実行時間**: 100時間/月
- **デプロイ**: 無制限

**MVP段階**: 無料プランで十分

---

## 11. セキュリティチェックリスト

- [ ] `.env`ファイルがGitHubにコミットされていない
- [ ] `serviceAccountKey.json`が`.gitignore`に含まれている
- [ ] Firestore Security Rulesが本番モード
- [ ] CORS設定が適切に制限されている
- [ ] APIキーに適切な制限がかかっている（Google Maps）
- [ ] Vercel環境変数が暗号化されている

---

## 12. 次のステップ

- [ ] モニタリング設定（Vercel Analytics）
- [ ] ログ管理（Vercel Logs）
- [ ] エラートラッキング（Sentry等）
- [ ] バックアップ設定（Firestore自動バックアップ）
- [ ] パフォーマンステスト
- [ ] 負荷テスト

---

## サポート

問題が発生した場合:
1. Vercel Logs を確認
2. Firebase Console のエラーログを確認
3. `npm run dev`でローカルデバッグ
