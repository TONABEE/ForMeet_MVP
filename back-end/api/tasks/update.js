import { getFirestore } from '../../lib/firebase.js';
import { authenticate, sendSuccess, sendError } from '../../lib/middleware.js';

/**
 * PUT /api/tasks/update
 * タスクを更新
 * 
 * Body:
 * - id: タスクID（必須）
 * - その他のタスクフィールド（任意）
 */
export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 認証チェック
    await authenticate(req, res, () => {});
    
    if (!req.userId) {
      return sendError(res, 'Authentication required', 401);
    }

    const { id, ...updateData } = req.body;

    if (!id) {
      return sendError(res, 'Task ID is required', 400);
    }

    const db = getFirestore();
    const taskRef = db.collection('tasks').doc(id);

    // タスクの存在確認と権限チェック
    const taskDoc = await taskRef.get();
    
    if (!taskDoc.exists) {
      return sendError(res, 'Task not found', 404);
    }

    if (taskDoc.data().userId !== req.userId) {
      return sendError(res, 'Unauthorized to update this task', 403);
    }

    // updatedAtを追加
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date(),
    };

    // 日付文字列をDateオブジェクトに変換
    if (updateData.scheduledStart) {
      dataToUpdate.scheduledStart = new Date(updateData.scheduledStart);
    }
    if (updateData.scheduledEnd) {
      dataToUpdate.scheduledEnd = new Date(updateData.scheduledEnd);
    }

    // 更新実行
    await taskRef.update(dataToUpdate);

    // 更新後のデータを取得
    const updatedDoc = await taskRef.get();

    return sendSuccess(res, {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    }, 'Task updated successfully');
  } catch (error) {
    console.error('Update task error:', error);
    return sendError(res, 'Failed to update task', 500);
  }
}
