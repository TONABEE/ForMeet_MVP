# Formeet Backend API

Formeet MVPのバックエンドAPI。Vercel Serverless Functions + Firebase Firestoreで構築。

## 技術スタック

- **ホスティング**: Vercel Serverless Functions
- **データベース**: Firebase Firestore
- **認証**: Firebase Authentication
- **外部API**:
  - OpenAI GPT-4 (AI音声認識・タスク提案)
  - Google Maps API (移動時間計算)

## ディレクトリ構造

```
back-end/
├── api/                    # Vercel Serverless Functions
│   ├── index.js           # ヘルスチェック
│   ├── auth/              # 認証関連
│   │   ├── register.js
│   │   └── login.js
│   ├── tasks/             # タスク管理
│   │   ├── create.js
│   │   ├── list.js
│   │   ├── update.js
│   │   └── delete.js
│   ├── planning/          # 計画機能
│   │   ├── morning-prompt.js
│   │   └── auto-schedule.js
│   ├── voice/             # 音声入力
│   │   └── transcribe.js
│   └── analytics/         # データ分析
│       └── daily-report.js
├── lib/                   # 共通ライブラリ
│   ├── firebase.js        # Firebase初期化
│   ├── openai.js          # OpenAI初期化
│   ├── maps.js            # Google Maps初期化
│   └── middleware.js      # 共通ミドルウェア
├── .env.example           # 環境変数テンプレート
├── vercel.json            # Vercel設定
└── package.json
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`を`.env`にコピーして、各APIキーを設定:

```bash
cp .env.example .env
```

### 3. Firebase設定

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成
2. Firestoreを有効化
3. Authentication（メール/パスワード）を有効化
4. サービスアカウントキーをダウンロードし、`serviceAccountKey.json`として保存

### 4. ローカル開発

```bash
npm run dev
```

http://localhost:3000 でAPIサーバーが起動します。

### 5. デプロイ

```bash
vercel login
npm run deploy
```

## API エンドポイント

### 認証

- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン

### タスク管理

- `GET /api/tasks/list` - タスク一覧取得
- `POST /api/tasks/create` - タスク作成
- `PUT /api/tasks/update` - タスク更新
- `DELETE /api/tasks/delete` - タスク削除

### 計画

- `POST /api/planning/morning-prompt` - 朝の計画提案（AI）
- `POST /api/planning/auto-schedule` - 自動スケジューリング

### 音声入力

- `POST /api/voice/transcribe` - 音声→テキスト変換 + AI解析

### 分析

- `GET /api/analytics/daily-report` - 日報生成（AI）

## Firestore データモデル

### Users Collection

```
users/{userId}
  - email: string
  - displayName: string
  - settings: {
      visualSetup: {...}
      audioSetup: {...}
      aiTone: string
    }
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Tasks Collection

```
tasks/{taskId}
  - userId: string (index)
  - title: string
  - description: string
  - type: string (work|meeting|routine|travel)
  - priority: string (high|medium|low)
  - status: string (pending|in_progress|completed|paused)
  - estimatedDuration: number (分)
  - actualDuration: number (分)
  - scheduledStart: timestamp
  - scheduledEnd: timestamp
  - location: string
  - notes: string[]
  - firstStep: string
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Analytics Collection

```
analytics/{userId}/daily/{date}
  - date: string (YYYY-MM-DD)
  - tasksCompleted: number
  - totalWorkTime: number (分)
  - efficiency: number (0-1)
  - patterns: {
      productiveHours: number[]
      taskCompletionRate: number
    }
  - createdAt: timestamp
```

## 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `FIREBASE_API_KEY` | Firebase APIキー | ✅ |
| `FIREBASE_PROJECT_ID` | FirebaseプロジェクトID | ✅ |
| `OPENAI_API_KEY` | OpenAI APIキー | ✅ |
| `GOOGLE_MAPS_API_KEY` | Google Maps APIキー | ✅ |
| `ALLOWED_ORIGINS` | CORS許可オリジン | ✅ |

## セキュリティ

- すべてのエンドポイントでFirebase Authentication必須
- CORS設定で許可されたオリジンのみアクセス可能
- Firestore Security Rulesで読み書き制限
- APIキーは環境変数で管理、GitHubにコミットしない

## ライセンス

ISC
