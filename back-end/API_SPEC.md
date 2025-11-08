# Formeet API 仕様書

Base URL: `https://formeet-backend.vercel.app/api`

すべてのAPIエンドポイントは認証が必要です（`/auth/register`と`/auth/login`を除く）。

認証方法: `Authorization: Bearer <Firebase ID Token>`

---

## 認証 (Authentication)

### POST /auth/register

新規ユーザー登録

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "田中太郎" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "abc123",
    "email": "user@example.com",
    "displayName": "田中太郎",
    "customToken": "eyJhbGciOiJS..."
  }
}
```

**Errors:**
- `400` - Validation error / Email already in use
- `500` - Server error

---

### POST /auth/login

ログイン（IDトークン検証）

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "uid": "abc123",
    "email": "user@example.com",
    "displayName": "田中太郎",
    "emailVerified": true
  }
}
```

**Errors:**
- `400` - Missing ID token
- `401` - Invalid token
- `500` - Server error

---

## タスク管理 (Tasks)

### POST /tasks/create

タスクを作成

**Headers:**
```
Authorization: Bearer <Firebase ID Token>
```

**Request Body:**
```json
{
  "title": "企画書作成",
  "description": "新規プロジェクトの企画書を作成する",
  "type": "work", // work|meeting|routine|travel
  "priority": "high", // high|medium|low
  "estimatedDuration": 120, // 分
  "scheduledStart": "2024-11-09T09:00:00Z", // optional
  "scheduledEnd": "2024-11-09T11:00:00Z", // optional
  "location": "会議室A", // optional
  "notes": ["資料は前回の会議メモを参照"], // optional
  "firstStep": "前回の会議メモを確認する" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "task_123",
    "title": "企画書作成",
    "status": "pending",
    "userId": "abc123",
    "createdAt": "2024-11-08T10:00:00Z",
    "updatedAt": "2024-11-08T10:00:00Z",
    ...
  }
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `500` - Server error

---

### GET /tasks/list

タスク一覧を取得

**Headers:**
```
Authorization: Bearer <Firebase ID Token>
```

**Query Parameters:**
- `status` (optional): `pending|in_progress|completed|paused`
- `date` (optional): `YYYY-MM-DD`（指定日のタスクのみ）
- `limit` (optional): 取得件数（デフォルト100）

**Example:**
```
GET /tasks/list?status=pending&limit=50
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "tasks": [
      {
        "id": "task_123",
        "title": "企画書作成",
        "status": "pending",
        ...
      },
      {
        "id": "task_456",
        "title": "メール返信",
        "status": "completed",
        ...
      }
    ],
    "count": 2
  }
}
```

---

### PUT /tasks/update

タスクを更新

**Headers:**
```
Authorization: Bearer <Firebase ID Token>
```

**Request Body:**
```json
{
  "id": "task_123",
  "status": "in_progress", // optional
  "actualDuration": 90, // optional
  "notes": ["進捗80%"] // optional
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "task_123",
    "status": "in_progress",
    "updatedAt": "2024-11-08T11:00:00Z",
    ...
  }
}
```

**Errors:**
- `400` - Missing task ID
- `401` - Unauthorized
- `403` - Forbidden (not task owner)
- `404` - Task not found
- `500` - Server error

---

### DELETE /tasks/delete

タスクを削除

**Headers:**
```
Authorization: Bearer <Firebase ID Token>
```

**Query Parameters:**
- `id` (required): タスクID

**Example:**
```
DELETE /tasks/delete?id=task_123
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

**Errors:**
- `400` - Missing task ID
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Task not found
- `500` - Server error

---

## 計画 (Planning)

### POST /planning/morning-prompt

朝の計画提案を生成（AI）

**Headers:**
```
Authorization: Bearer <Firebase ID Token>
```

**Request Body:**
なし（ユーザーの未配置タスクを自動取得）

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "unscheduledTasks": [
      { "id": "task_123", "title": "企画書作成", ... },
      { "id": "task_456", "title": "メール返信", ... }
    ],
    "scheduledTaskCount": 3,
    "availableMinutes": 360,
    "suggestion": {
      "suggestedTasks": [
        {
          "taskId": "task_123",
          "reason": "優先度が高く、集中力が必要なため午前中の実施を推奨",
          "suggestedTime": "09:00"
        },
        {
          "taskId": "task_456",
          "reason": "所要時間が短いため、午前の最後に配置",
          "suggestedTime": "11:30"
        }
      ],
      "message": "おはようございます！今日は予定が多い日ですね。無理せず進めましょう。"
    }
  }
}
```

---

### POST /planning/auto-schedule

自動スケジューリング

**Headers:**
```
Authorization: Bearer <Firebase ID Token>
```

**Request Body:**
```json
{
  "taskIds": ["task_123", "task_456", "task_789"],
  "startTime": "2024-11-09T09:00:00Z",
  "bufferMinutes": 15 // optional, デフォルト15分
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tasks scheduled successfully",
  "data": {
    "scheduledTasks": [
      {
        "id": "task_123",
        "title": "企画書作成",
        "scheduledStart": "2024-11-09T09:00:00Z",
        "scheduledEnd": "2024-11-09T11:00:00Z"
      },
      {
        "id": "task_456",
        "title": "メール返信",
        "scheduledStart": "2024-11-09T11:15:00Z",
        "scheduledEnd": "2024-11-09T11:45:00Z"
      }
    ],
    "travelTasks": [
      {
        "id": "task_auto_travel_1",
        "title": "会議室A → 自宅 への移動",
        "type": "travel",
        "estimatedDuration": 20,
        "scheduledStart": "2024-11-09T12:00:00Z"
      }
    ],
    "totalDuration": 180
  }
}
```

---

## 音声入力 (Voice)

### POST /voice/transcribe

音声をテキストに変換してタスク情報を抽出

**Headers:**
```
Authorization: Bearer <Firebase ID Token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `audio`: 音声ファイル（mp3, wav, m4a等）
- `userTone`: `polite|casual|concise`

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "transcribedText": "明日14時に会議",
    "taskInfo": {
      "title": "会議",
      "description": "",
      "date": "2024-11-09",
      "time": "14:00",
      "duration": 60,
      "location": "",
      "type": "meeting",
      "needsPreparation": true,
      "preparationTime": 30
    },
    "aiMessage": "11月9日14:00に「会議」を追加しますね"
  }
}
```

**Errors:**
- `400` - Missing audio file
- `401` - Unauthorized
- `500` - Transcription error

---

## 分析 (Analytics)

### GET /analytics/daily-report

日報を自動生成（AI）

**Headers:**
```
Authorization: Bearer <Firebase ID Token>
```

**Query Parameters:**
- `date` (optional): `YYYY-MM-DD`（省略時は今日）

**Example:**
```
GET /analytics/daily-report?date=2024-11-08
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "date": "2024-11-08",
    "completedTasks": 5,
    "pendingTasks": 2,
    "reportContent": "【本日の成果】\n・企画書作成（予定通り完了）\n・メール返信（完了）\n\n【課題・遅延】\n・週次レポート（未完了）\n→ 明日の予定に再配置済み\n\n【明日の予定】\n・週次レポート完成\n・新規プロジェクト打ち合わせ",
    "analytics": {
      "tasksCompleted": 5,
      "tasksPending": 2,
      "totalWorkTime": 360,
      "efficiency": 0.85
    }
  }
}
```

---

## エラーレスポンス形式

すべてのエラーは以下の形式で返されます:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message"
}
```

**HTTPステータスコード:**
- `200` - Success
- `201` - Created
- `400` - Bad Request（バリデーションエラー等）
- `401` - Unauthorized（認証エラー）
- `403` - Forbidden（権限エラー）
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## レート制限

現在のところレート制限はありませんが、将来的に以下を予定:
- 一般ユーザー: 100リクエスト/分
- 音声認識: 10リクエスト/分

---

## Webhook（将来実装予定）

- タスク完了時の通知
- 日報生成完了通知
- スケジュール変更アラート
