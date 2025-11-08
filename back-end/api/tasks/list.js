import { getFirestore } from '../../lib/firebase.js';
import { authenticate, sendSuccess, sendError } from '../../lib/middleware.js';

/**
 * GET /api/tasks/list
 * ユーザーのタスク一覧を取得
 * 
 * クエリパラメータ:
 * - status: pending|in_progress|completed|paused
 * - date: YYYY-MM-DD (指定日のタスクのみ)
 * - limit: 取得件数（デフォルト100）
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
    const { status, date, limit = 100 } = req.query;

    // クエリ構築
    let query = db
      .collection('tasks')
      .where('userId', '==', req.userId)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit));

    // ステータスフィルター
    if (status) {
      query = query.where('status', '==', status);
    }

    // 日付フィルター（scheduledStartが指定日）
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .where('scheduledStart', '>=', startOfDay)
        .where('scheduledStart', '<=', endOfDay);
    }

    // データ取得
    const snapshot = await query.get();

    const tasks = [];
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return sendSuccess(res, {
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('List tasks error:', error);
    return sendError(res, 'Failed to fetch tasks', 500);
  }
}
