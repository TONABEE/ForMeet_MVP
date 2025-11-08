import { generateMorningPrompt } from '../../lib/gemini.js';
import { getFirestore } from '../../lib/firebase.js';
import { authenticate, sendSuccess, sendError } from '../../lib/middleware.js';

/**
 * POST /api/planning/morning-prompt
 * 朝の計画提案を生成
 * 
 * AIが未配置タスクから今日取り組むべきタスクを提案
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

    const db = getFirestore();

    // 未配置タスクを取得
    const unscheduledSnapshot = await db
      .collection('tasks')
      .where('userId', '==', req.userId)
      .where('status', '==', 'pending')
      .where('scheduledStart', '==', null)
      .orderBy('priority', 'desc')
      .orderBy('createdAt', 'asc')
      .limit(20)
      .get();

    const unscheduledTasks = [];
    unscheduledSnapshot.forEach((doc) => {
      unscheduledTasks.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // 今日の予定済みタスクを取得
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const scheduledSnapshot = await db
      .collection('tasks')
      .where('userId', '==', req.userId)
      .where('scheduledStart', '>=', today)
      .where('scheduledStart', '<', tomorrow)
      .get();

    let scheduledTaskCount = 0;
    let scheduledMinutes = 0;
    scheduledSnapshot.forEach((doc) => {
      scheduledTaskCount++;
      scheduledMinutes += doc.data().estimatedDuration || 0;
    });

    // ユーザー設定を取得
    const userDoc = await db.collection('users').doc(req.userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // ユーザーコンテキスト
    const userContext = {
      cognitiveProfile: userData.cognitiveProfile || '標準',
      scheduledTaskCount,
      availableMinutes: Math.max(0, 480 - scheduledMinutes), // 8時間 - 予定済み時間
    };

    // AI提案を生成
    const aiSuggestion = await generateMorningPrompt(unscheduledTasks, userContext);

    return sendSuccess(res, {
      unscheduledTasks,
      scheduledTaskCount,
      availableMinutes: userContext.availableMinutes,
      suggestion: aiSuggestion,
    });
  } catch (error) {
    console.error('Morning prompt error:', error);
    return sendError(res, 'Failed to generate morning prompt', 500);
  }
}
