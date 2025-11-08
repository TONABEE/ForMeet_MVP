import { getFirestore } from '../../lib/firebase.js';
import { authenticate, sendSuccess, sendError } from '../../lib/middleware.js';
import { z } from 'zod';

const TaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  type: z.enum(['work', 'meeting', 'routine', 'travel']),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  estimatedDuration: z.number().positive(),
  scheduledStart: z.string().optional(), // ISO 8601
  scheduledEnd: z.string().optional(),
  location: z.string().optional(),
  notes: z.array(z.string()).optional(),
  firstStep: z.string().optional(),
});

/**
 * POST /api/tasks/create
 * タスクを作成
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

    // バリデーション
    const validatedData = TaskSchema.parse(req.body);

    const db = getFirestore();
    const tasksRef = db.collection('tasks');

    // タスクデータ作成
    const taskData = {
      ...validatedData,
      userId: req.userId,
      status: 'pending',
      actualDuration: null,
      scheduledStart: validatedData.scheduledStart
        ? new Date(validatedData.scheduledStart)
        : null,
      scheduledEnd: validatedData.scheduledEnd
        ? new Date(validatedData.scheduledEnd)
        : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Firestoreに保存
    const docRef = await tasksRef.add(taskData);

    return sendSuccess(
      res,
      {
        id: docRef.id,
        ...taskData,
      },
      'Task created successfully',
      201
    );
  } catch (error) {
    console.error('Create task error:', error);

    if (error.name === 'ZodError') {
      return sendError(res, 'Validation error', 400, error.errors);
    }

    return sendError(res, 'Failed to create task', 500);
  }
}
