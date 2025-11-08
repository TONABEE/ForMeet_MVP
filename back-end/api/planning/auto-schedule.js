import { shouldInsertTravelTask } from '../../lib/maps.js';
import { getFirestore } from '../../lib/firebase.js';
import { authenticate, sendSuccess, sendError } from '../../lib/middleware.js';

/**
 * POST /api/planning/auto-schedule
 * 自動スケジューリング
 * 
 * Body:
 * - taskIds: タスクIDの配列
 * - startTime: 開始時刻（ISO 8601）
 * - bufferMinutes: タスク間のバッファ時間（デフォルト15分）
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

    const { taskIds, startTime, bufferMinutes = 15 } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return sendError(res, 'Task IDs array is required', 400);
    }

    const db = getFirestore();
    const scheduledTasks = [];
    const travelTasks = [];

    let currentTime = new Date(startTime || new Date());
    let previousTask = null;

    // タスクを順番にスケジューリング
    for (const taskId of taskIds) {
      const taskDoc = await db.collection('tasks').doc(taskId).get();

      if (!taskDoc.exists || taskDoc.data().userId !== req.userId) {
        continue;
      }

      const task = { id: taskDoc.id, ...taskDoc.data() };

      // 前のタスクと場所が異なる場合、移動タスクを挿入
      if (previousTask && previousTask.location && task.location) {
        const travelTask = await shouldInsertTravelTask(previousTask, task);

        if (travelTask) {
          // 移動タスクを作成
          const travelTaskRef = await db.collection('tasks').add({
            ...travelTask,
            userId: req.userId,
            status: 'pending',
            priority: 'medium',
            scheduledStart: currentTime,
            scheduledEnd: new Date(currentTime.getTime() + travelTask.estimatedDuration * 60000),
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          travelTasks.push({
            id: travelTaskRef.id,
            ...travelTask,
            scheduledStart: currentTime.toISOString(),
          });

          // 現在時刻を移動時間分進める
          currentTime = new Date(currentTime.getTime() + travelTask.estimatedDuration * 60000);

          // バッファ時間を追加
          currentTime = new Date(currentTime.getTime() + bufferMinutes * 60000);
        }
      }

      // タスクの開始・終了時刻を設定
      const scheduledStart = currentTime;
      const scheduledEnd = new Date(currentTime.getTime() + task.estimatedDuration * 60000);

      // タスクを更新
      await db.collection('tasks').doc(taskId).update({
        scheduledStart,
        scheduledEnd,
        updatedAt: new Date(),
      });

      scheduledTasks.push({
        id: taskId,
        title: task.title,
        scheduledStart: scheduledStart.toISOString(),
        scheduledEnd: scheduledEnd.toISOString(),
      });

      // 次のタスクのために時刻を進める
      currentTime = new Date(scheduledEnd.getTime() + bufferMinutes * 60000);
      previousTask = task;
    }

    return sendSuccess(res, {
      scheduledTasks,
      travelTasks,
      totalDuration: Math.floor((currentTime.getTime() - new Date(startTime).getTime()) / 60000),
    }, 'Tasks scheduled successfully');
  } catch (error) {
    console.error('Auto schedule error:', error);
    return sendError(res, 'Failed to schedule tasks', 500);
  }
}
