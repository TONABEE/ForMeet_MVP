import { generateDailyReport } from '../../lib/gemini.js';
import { getFirestore } from '../../lib/firebase.js';
import { authenticate, sendSuccess, sendError } from '../../lib/middleware.js';

/**
 * GET /api/analytics/daily-report
 * 日報を自動生成
 * 
 * Query params:
 * - date: YYYY-MM-DD（省略時は今日）
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 認証チェック
    await authenticate(req, res, () => {});
    
    if (!req.userId) {
      return sendError(res, 'Authentication required', 401);
    }

    const db = getFirestore();
    const { date } = req.query;

    // 対象日の設定
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // 対象日のタスクを取得
    const tasksSnapshot = await db
      .collection('tasks')
      .where('userId', '==', req.userId)
      .where('scheduledStart', '>=', targetDate)
      .where('scheduledStart', '<', nextDay)
      .get();

    const completedTasks = [];
    const pendingTasks = [];

    tasksSnapshot.forEach((doc) => {
      const task = { id: doc.id, ...doc.data() };
      if (task.status === 'completed') {
        completedTasks.push(task);
      } else {
        pendingTasks.push(task);
      }
    });

    // ユーザー設定を取得
    const userDoc = await db.collection('users').doc(req.userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const userContext = {
      aiTone: userData.settings?.aiTone || 'polite',
      displayName: userData.displayName || 'ユーザー',
    };

    // AI日報生成
    const reportContent = await generateDailyReport(completedTasks, pendingTasks, userContext);

    // 分析データを保存
    const analyticsData = {
      date: targetDate.toISOString().split('T')[0],
      tasksCompleted: completedTasks.length,
      tasksPending: pendingTasks.length,
      totalWorkTime: completedTasks.reduce((sum, t) => sum + (t.actualDuration || t.estimatedDuration || 0), 0),
      efficiency: completedTasks.length > 0
        ? completedTasks.reduce((sum, t) => {
            if (t.actualDuration && t.estimatedDuration) {
              return sum + Math.min(1, t.estimatedDuration / t.actualDuration);
            }
            return sum;
          }, 0) / completedTasks.length
        : 0,
      reportContent,
      createdAt: new Date(),
    };

    await db
      .collection('analytics')
      .doc(req.userId)
      .collection('daily')
      .doc(targetDate.toISOString().split('T')[0])
      .set(analyticsData);

    return sendSuccess(res, {
      date: targetDate.toISOString().split('T')[0],
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      reportContent,
      analytics: analyticsData,
    });
  } catch (error) {
    console.error('Daily report generation error:', error);
    return sendError(res, 'Failed to generate daily report', 500);
  }
}
