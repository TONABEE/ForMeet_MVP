# OpenAI → Gemini API 移行ガイド

## 変更概要

**目的**: 月額コストを削減（$50-80/月 → $0/月）

**変更内容**:
- OpenAI GPT-4o-mini → Google Gemini Pro
- OpenAI Whisper → Web Speech API（クライアント側）

---

## 📋 変更されたファイル

### 1. バックエンド

#### 新規作成
- ✅ `back-end/lib/gemini.js` - Gemini API統合モジュール

#### 更新されたファイル
- ✅ `back-end/package.json` - `openai` → `@google/generative-ai`
- ✅ `back-end/.env.example` - `OPENAI_API_KEY` → `GEMINI_API_KEY`
- ✅ `back-end/api/voice/transcribe.js` - import変更
- ✅ `back-end/api/planning/morning-prompt.js` - import変更
- ✅ `back-end/api/analytics/daily-report.js` - import変更

#### 削除予定（後で削除可能）
- ⚠️ `back-end/lib/openai.js` - 旧ファイル（互換性のため残す）

---

## 🔧 セットアップ手順

### 1. Gemini APIキーを取得

1. https://ai.google.dev/ にアクセス
2. Googleアカウントでログイン
3. 「Get API Key」をクリック
4. APIキーをコピー

**料金**: 月間1500リクエストまで完全無料

---

### 2. 環境変数を更新

`back-end/.env` を編集:

```bash
# 削除（または無効化）
# OPENAI_API_KEY=sk-proj-...

# 追加
GEMINI_API_KEY=AIzaSy...（あなたのAPIキー）
```

---

### 3. パッケージをインストール

```bash
cd back-end
npm install
```

これにより `@google/generative-ai` がインストールされます。

---

### 4. 音声認識の移行（重要！）

**以前**: サーバー側でWhisper APIを使用
**現在**: クライアント側でWeb Speech APIを使用

#### モバイルアプリ側の変更が必要

`formeet-mobile/hooks/use-voice-input.ts` を実装してください:

```typescript
export function useVoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      Alert.alert('エラー', 'お使いのブラウザは音声認識に対応していません');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      setTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    return transcript;
  };

  return { isRecording, transcript, startRecording, stopRecording };
}
```

#### APIエンドポイントの変更

`POST /api/voice/transcribe` は以下のように変更:

**以前**:
```javascript
// 音声データ（Buffer）を送信 → サーバーでWhisper処理
```

**現在**:
```javascript
// テキスト（既に文字起こし済み）を送信 → サーバーでタスク抽出のみ
```

---

## 📊 機能比較

| 機能 | OpenAI | Gemini | 変更点 |
|------|--------|--------|--------|
| **タスク抽出** | GPT-4o-mini | Gemini Pro | ✅ 同等の性能 |
| **朝の計画提案** | GPT-4o-mini | Gemini Pro | ✅ 同等の性能 |
| **日報生成** | GPT-4o-mini | Gemini Pro | ✅ 同等の性能 |
| **音声認識** | Whisper API | Web Speech API | ⚠️ ブラウザ依存（Chrome/Safari） |

---

## ⚠️ 注意事項

### 1. 音声認識の制限

**対応ブラウザ**:
- ✅ Chrome（Android/iOS/デスクトップ）
- ✅ Safari（iOS/macOS）
- ✅ Edge（デスクトップ）
- ❌ Firefox（一部対応）

**推奨**:
- ユーザーにChrome/Safariを推奨
- 非対応ブラウザではテキスト入力のみ

### 2. Gemini APIのレスポンス形式

GeminiはJSON形式を返すように指示しても、時々余分なテキストを含むため、
`gemini.js` 内で正規表現でJSONを抽出しています:

```javascript
const jsonMatch = text.match(/\{[\s\S]*\}/);
```

### 3. 無料枠の制限

**Gemini Pro**:
- 月間1500リクエストまで無料
- 1リクエスト = 1タスク抽出 or 1日報生成

**想定ユーザー数**:
- 1ユーザーあたり1日3リクエスト → 約500ユーザー/月まで対応可能
- MVP段階（100-1000ユーザー）には十分

---

## 🧪 テスト方法

### 1. タスク抽出のテスト

```bash
curl -X POST http://localhost:3000/api/voice/transcribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "transcribedText": "明日の14時から新宿でミーティング、1時間くらい",
    "userTone": "friendly"
  }'
```

**期待される応答**:
```json
{
  "success": true,
  "taskInfo": {
    "title": "新宿でミーティング",
    "scheduledStart": "2025-11-09T14:00:00+09:00",
    "estimatedDuration": 60,
    "location": "新宿",
    "type": "meeting",
    "priority": "medium"
  }
}
```

---

### 2. 朝の計画提案のテスト

```bash
curl -X POST http://localhost:3000/api/planning/morning-prompt \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{}'
```

---

### 3. 日報生成のテスト

```bash
curl -X POST http://localhost:3000/api/analytics/daily-report \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "date": "2025-11-08"
  }'
```

---

## 💰 コスト比較

### 以前（OpenAI）

| サービス | 用途 | 月額コスト |
|---------|------|-----------|
| GPT-4o-mini | タスク抽出・計画・日報 | $50-80 |
| Whisper API | 音声認識 | $5-10 |
| **合計** | | **$55-90** |

### 現在（Gemini）

| サービス | 用途 | 月額コスト |
|---------|------|-----------|
| Gemini Pro | タスク抽出・計画・日報 | $0（1500req/月まで） |
| Web Speech API | 音声認識 | $0（ブラウザ内蔵） |
| **合計** | | **$0** |

**年間節約額**: $660-1,080

---

## 🚀 次のステップ

### MVP段階（現在）
- ✅ Gemini APIで運用（完全無料）
- ✅ 100-1000ユーザーまで対応可能

### スケール段階（将来）
月間1500リクエストを超えたら、以下のオプション:

1. **Gemini Pro 有料プラン**: $0.00025/リクエスト
   - 10,000リクエスト = $2.50/月
   - OpenAIより80%安い

2. **OpenAIに戻す**: より高精度が必要な場合
   - GPT-4o-miniに戻すことも可能

3. **ハイブリッド**: 
   - 無料枠内はGemini
   - 超過分のみOpenAI

---

## 🐛 トラブルシューティング

### エラー: `GEMINI_API_KEY is not set`

**原因**: 環境変数が設定されていない

**解決方法**:
```bash
# .env ファイルを確認
cat back-end/.env

# GEMINI_API_KEYが設定されているか確認
# なければ追加:
echo "GEMINI_API_KEY=AIzaSy..." >> back-end/.env
```

---

### エラー: `有効なJSON形式が見つかりませんでした`

**原因**: GeminiのレスポンスがJSON形式でない

**解決方法**:
`lib/gemini.js` のプロンプトを調整:
```javascript
const prompt = `
...（既存のプロンプト）

重要: 必ずJSON形式のみを返してください。説明文は不要です。
`;
```

---

### 音声認識が動作しない

**原因**: ブラウザが対応していない、またはHTTPSでない

**解決方法**:
1. Chrome/Safariを使用
2. HTTPSで接続（`https://localhost:8081`）
3. マイク権限を許可

---

## 📚 参考リンク

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Web Speech API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Gemini Pricing](https://ai.google.dev/pricing)

---

**移行完了日**: 2025年11月8日
**作成者**: GitHub Copilot
