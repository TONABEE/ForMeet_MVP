import { transcribeAudio, extractTaskFromVoice } from '../../lib/gemini.js';
import { getFirestore } from '../../lib/firebase.js';
import { authenticate, sendSuccess, sendError } from '../../lib/middleware.js';

/**
 * POST /api/voice/transcribe
 * 音声をテキストに変換し、タスク情報を抽出
 * 
 * Body (multipart/form-data):
 * - audio: 音声ファイル（mp3, wav, m4a等）
 * - userTone: ユーザーの口調設定（polite|casual|concise）
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 認証チェック
    await authenticate(req, res, () => {});
    
    if (!req.userId) {
      return sendError(res, 'Authentication required', 401);
    }

    // 音声データの取得（実際の実装ではmultipart/form-dataパーサーが必要）
    const { audioBuffer, userTone = 'polite' } = req.body;

    if (!audioBuffer) {
      return sendError(res, 'Audio file is required', 400);
    }

    // Step 1: 音声をテキストに変換
    const transcribedText = await transcribeAudio(audioBuffer);

    // Step 2: テキストからタスク情報を抽出
    const taskInfo = await extractTaskFromVoice(transcribedText, userTone);

    // Step 3: ユーザー設定を取得（口調など）
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(req.userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // AIメッセージ生成
    const aiMessage = generateConfirmationMessage(taskInfo, userData.settings?.aiTone || userTone);

    return sendSuccess(res, {
      transcribedText,
      taskInfo,
      aiMessage,
    });
  } catch (error) {
    console.error('Voice transcription error:', error);
    return sendError(res, 'Failed to process voice input', 500);
  }
}

/**
 * 確認メッセージを生成
 */
function generateConfirmationMessage(taskInfo, tone) {
  const { date, time, title } = taskInfo;

  if (tone === 'polite') {
    return `${date}${time}に「${title}」を追加しますね`;
  } else if (tone === 'casual') {
    return `${date}${time}に「${title}」追加するね！`;
  } else {
    return `${date}${time}: ${title}`;
  }
}
