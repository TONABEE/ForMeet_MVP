import OpenAI from 'openai';

let openaiClient;

/**
 * OpenAI APIクライアントの初期化
 */
export function initializeOpenAI() {
  if (openaiClient) {
    return openaiClient;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log('✅ OpenAI initialized');
  return openaiClient;
}

/**
 * 音声をテキストに変換（Whisper API）
 */
export async function transcribeAudio(audioBuffer, options = {}) {
  const client = initializeOpenAI();

  try {
    const response = await client.audio.transcriptions.create({
      file: audioBuffer,
      model: 'whisper-1',
      language: 'ja',
      ...options,
    });

    return response.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

/**
 * 音声入力からタスク情報を抽出
 */
export async function extractTaskFromVoice(transcribedText, userTone = 'polite') {
  const client = initializeOpenAI();

  const systemPrompt = `あなたはFormeetのAI秘書です。ユーザーの音声入力からタスク情報を抽出してください。

出力形式（JSON）:
{
  "title": "タスク名",
  "description": "詳細説明",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "duration": 60,
  "location": "場所（あれば）",
  "type": "work|meeting|routine|travel",
  "needsPreparation": true/false,
  "preparationTime": 30
}

口調: ${userTone === 'polite' ? '丁寧（です・ます調）' : userTone === 'casual' ? 'カジュアル' : '簡潔'}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `音声入力: "${transcribedText}"` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const extractedData = JSON.parse(response.choices[0].message.content);
    return extractedData;
  } catch (error) {
    console.error('Task extraction error:', error);
    throw error;
  }
}

/**
 * 朝の計画提案を生成
 */
export async function generateMorningPrompt(unscheduledTasks, userContext) {
  const client = initializeOpenAI();

  const systemPrompt = `あなたはFormeetのAI秘書です。ユーザーの未配置タスクから、今日取り組むべきタスクを提案してください。

ユーザーの特性:
- 認知特性: ${userContext.cognitiveProfile || '標準'}
- 今日の予定済みタスク数: ${userContext.scheduledTaskCount || 0}
- 今日の空き時間: ${userContext.availableMinutes || 480}分

提案のポイント:
1. タスクは3-5個程度に絞る（多すぎると overwhelm される）
2. 優先度と所要時間を考慮
3. 難しいタスクは午前中に配置を推奨
4. 集中力が必要なタスクは連続させない

出力形式（JSON）:
{
  "suggestedTasks": [
    {
      "taskId": "task_123",
      "reason": "推奨理由",
      "suggestedTime": "09:00"
    }
  ],
  "message": "ユーザーへのメッセージ"
}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `未配置タスク:\n${JSON.stringify(unscheduledTasks, null, 2)}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Morning prompt generation error:', error);
    throw error;
  }
}

/**
 * 日報を自動生成
 */
export async function generateDailyReport(completedTasks, pendingTasks, userContext) {
  const client = initializeOpenAI();

  const systemPrompt = `あなたはFormeetのAI秘書です。今日の作業実績から日報を生成してください。

口調: ${userContext.aiTone === 'polite' ? '丁寧（です・ます調）' : userContext.aiTone === 'casual' ? 'カジュアル' : '簡潔'}

出力形式:
- 【本日の成果】セクション
- 【課題・遅延】セクション
- 【明日の予定】セクション
- 短く、要点を押さえた文章で`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `完了タスク:\n${JSON.stringify(completedTasks, null, 2)}\n\n未完了タスク:\n${JSON.stringify(pendingTasks, null, 2)}`,
        },
      ],
      temperature: 0.4,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Daily report generation error:', error);
    throw error;
  }
}

export default { initializeOpenAI, transcribeAudio, extractTaskFromVoice, generateMorningPrompt, generateDailyReport };
