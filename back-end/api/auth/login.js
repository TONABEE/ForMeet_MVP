import { getAuth } from '../../lib/firebase.js';
import { sendSuccess, sendError } from '../../lib/middleware.js';

/**
 * POST /api/auth/login
 * ユーザーログイン（IDトークン検証）
 * 
 * Note: 実際のログイン処理はクライアント側でFirebase SDKを使用
 * このエンドポイントはトークン検証とユーザー情報取得のみ
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idToken } = req.body;

    if (!idToken) {
      return sendError(res, 'ID token is required', 400);
    }

    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);

    // ユーザー情報を取得
    const userRecord = await auth.getUser(decodedToken.uid);

    return sendSuccess(res, {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      emailVerified: userRecord.emailVerified,
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error.code && error.code.startsWith('auth/')) {
      return sendError(res, 'Invalid authentication token', 401);
    }

    return sendError(res, 'Failed to verify login', 500);
  }
}
