import { getFirestore } from '../../lib/firebase.js';
import { authenticate, sendSuccess, sendError } from '../../lib/middleware.js';

/**
 * DELETE /api/tasks/delete
 * タスクを削除
 * 
 * Query params:
 * - id: タスクID（必須）
 */
export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 認証チェック
    await authenticate(req, res, () => {});
    
    if (!req.userId) {
      return sendError(res, 'Authentication required', 401);
    }

    const { id } = req.query;

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
      return sendError(res, 'Unauthorized to delete this task', 403);
    }

    // 削除実行
    await taskRef.delete();

    return sendSuccess(res, null, 'Task deleted successfully');
  } catch (error) {
    console.error('Delete task error:', error);
    return sendError(res, 'Failed to delete task', 500);
  }
}
