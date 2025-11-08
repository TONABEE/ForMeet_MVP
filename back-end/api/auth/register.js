import { getAuth } from '../../lib/firebase.js';
import { sendSuccess, sendError } from '../../lib/middleware.js';
import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).optional(),
});

/**
 * POST /api/auth/register
 * 新規ユーザー登録
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validatedData = RegisterSchema.parse(req.body);
    const auth = getAuth();

    // Firebase Authenticationでユーザー作成
    const userRecord = await auth.createUser({
      email: validatedData.email,
      password: validatedData.password,
      displayName: validatedData.displayName || validatedData.email.split('@')[0],
    });

    // カスタムトークン生成（クライアント側でサインインに使用）
    const customToken = await auth.createCustomToken(userRecord.uid);

    return sendSuccess(
      res,
      {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        customToken,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    console.error('Register error:', error);

    if (error.name === 'ZodError') {
      return sendError(res, 'Validation error', 400, error.errors);
    }

    if (error.code === 'auth/email-already-exists') {
      return sendError(res, 'Email already in use', 400);
    }

    return sendError(res, 'Failed to register user', 500);
  }
}
