/**
 * Gemini AI統合モジュール（OpenAI代替 - 無料版）
 * 
 * このモジュールはGoogle Gemini APIとの統合を提供します：
 * - Web Speech API: 音声からテキストへの変換（クライアント側で実装）
 * - Gemini Pro: タスク抽出、計画提案、日報生成
 * 
 * 料金: 月間1500リクエストまで完全無料
 * APIキー取得: https://ai.google.dev/
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;
let model;

/**
 * Gemini APIクライアントの初期化
 */
export function initializeGemini() {
  if (genAI) {
    return genAI;
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  console.log('✅ Gemini initialized');
  return genAI;
}

/**
 * 音声ファイルをテキストに変換
 * 
 * 注意: Gemini APIは音声認識機能を提供していません。
 * 代わりに、クライアント側でWeb Speech APIを使用してください。
 * 
 * このファイルは互換性のために残されていますが、
 * 実際の音声認識はモバイルアプリ側で実装されます。
 * 
 * @param {Buffer} audioBuffer - 音声データのバッファ（未使用）
 * @returns {Promise<string>} エラーメッセージ
 */
export async function transcribeAudio(audioBuffer) {
  throw new Error(
    '音声認識はクライアント側で実装してください。' +
    'Web Speech API (webkitSpeechRecognition) を使用することを推奨します。' +
    '詳細: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API'
  );
}

/**
 * 音声入力テキストからタスク情報を抽出（Gemini Pro）
 * @param {string} transcribedText - 音声認識されたテキスト
 * @param {string} userTone - ユーザーの希望する口調（'friendly', 'formal', 'casual'）
 * @returns {Promise<Object>} 抽出されたタスク情報
 */
export async function extractTaskFromVoice(transcribedText, userTone = 'friendly') {
  initializeGemini();

  try {
    const prompt = `
あなたは優秀なタスク管理アシスタントです。
以下の音声入力からタスク情報を抽出してください。

音声入力: "${transcribedText}"

以下のJSON形式で返してください（JSON形式のみ、他のテキストは含めないでください）：
{
  "title": "タスクのタイトル（簡潔に）",
  "description": "タスクの詳細説明",
  "scheduledStart": "開始日時（ISO 8601形式、例: 2024-11-09T14:00:00+09:00）",
  "scheduledEnd": "終了日時（推定、ISO 8601形式）",
  "estimatedDuration": 予定時間（分単位、数値）,
  "location": "場所（あれば）",
  "type": "タスクタイプ（'work', 'personal', 'meeting', 'health', 'other'のいずれか）",
  "priority": "優先度（'high', 'medium', 'low'のいずれか）",
  "needsPreparation": 事前準備が必要か（boolean）
}

注意事項：
- 日時が曖昧な場合は、現在日時を基準に推測してください
- 時間が指定されていない場合は、scheduledStartをnullにしてください
- estimatedDurationは、タスクの内容から推定してください（デフォルト: 60分）
- 口調は${userTone}で応答してください
- 必ず有効なJSON形式で返してください
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSONのみを抽出（Geminiは時々余分なテキストを含むため）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('有効なJSON形式が見つかりませんでした');
    }
    
    const taskInfo = JSON.parse(jsonMatch[0]);
    return taskInfo;
  } catch (error) {
    console.error('Gemini Pro error:', error);
    throw new Error('タスク情報の抽出に失敗しました: ' + error.message);
  }
}

/**
 * 朝の計画提案を生成（Gemini Pro）
 * @param {Array} unscheduledTasks - 未スケジュールのタスク一覧
 * @param {Object} userContext - ユーザーコンテキスト（今日の予定、好み等）
 * @returns {Promise<Object>} 提案内容
 */
export async function generateMorningPrompt(unscheduledTasks, userContext = {}) {
  initializeGemini();

  try {
    const tasksText = unscheduledTasks
      .map((task, index) => `${index + 1}. ${task.title} (予定時間: ${task.estimatedDuration}分)`)
      .join('\n');

    const prompt = `
あなたは優秀なタスク管理アシスタントです。
今日やるべきタスクを3〜5個提案してください。

【未スケジュールのタスク】
${tasksText}

【今日の予定】
${userContext.todaySchedule || '特になし'}

【ユーザーの傾向】
- 集中しやすい時間帯: ${userContext.focusTime || '午前中'}
- 苦手なタスクタイプ: ${userContext.weaknesses || '段取りが必要なタスク'}

以下のJSON形式で返してください（JSON形式のみ、他のテキストは含めないでください）：
{
  "suggestedTasks": [
    {
      "taskId": "タスクID",
      "title": "タスク名",
      "reason": "提案理由（1文で）",
      "suggestedTime": "推奨時間帯"
    }
  ],
  "message": "ユーザーへのメッセージ（motivational）"
}

必ず有効なJSON形式で返してください。
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSONのみを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('有効なJSON形式が見つかりませんでした');
    }
    
    const suggestion = JSON.parse(jsonMatch[0]);
    return suggestion;
  } catch (error) {
    console.error('Gemini Pro error:', error);
    throw new Error('朝の計画提案の生成に失敗しました: ' + error.message);
  }
}

/**
 * 日報を自動生成（Gemini Pro）
 * @param {Array} completedTasks - 完了したタスク一覧
 * @param {Array} pendingTasks - 未完了のタスク一覧
 * @param {Object} userContext - ユーザーコンテキスト
 * @returns {Promise<string>} 生成された日報テキスト
 */
export async function generateDailyReport(completedTasks, pendingTasks, userContext = {}) {
  initializeGemini();

  try {
    const completedText = completedTasks
      .map((task) => `- ${task.title} (実際: ${task.actualDuration}分)`)
      .join('\n');

    const pendingText = pendingTasks
      .map((task) => `- ${task.title}`)
      .join('\n');

    const toneMap = {
      polite: '丁寧（です・ます調）',
      casual: 'カジュアル（だ・である調）',
      friendly: '親しみやすく（です・ます調だが柔らかく）',
    };

    const tone = toneMap[userContext.aiTone] || '親しみやすく';

    const prompt = `
あなたは優秀な日報作成アシスタントです。
今日の振り返りレポートを作成してください。

【完了したタスク】
${completedText || 'なし'}

【未完了のタスク】
${pendingText || 'なし'}

【ユーザーの状態】
- 集中度の平均: ${userContext.avgFocus || 'データなし'}
- メンタルヘルススコア: ${userContext.mentalHealthScore || 'データなし'}

以下の形式でレポートを作成してください：

【本日の成果】
（完了したタスクをポジティブに振り返る）

【課題・遅延】
（未完了タスクについて、原因と対策を提案）

【明日の予定】
（明日やるべきことを簡潔に）

【一言】
（励ましのメッセージ）

口調: ${tone}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const report = response.text();
    
    return report;
  } catch (error) {
    console.error('Gemini Pro error:', error);
    throw new Error('日報の生成に失敗しました: ' + error.message);
  }
}

export default { 
  initializeGemini, 
  transcribeAudio, 
  extractTaskFromVoice, 
  generateMorningPrompt, 
  generateDailyReport 
};
