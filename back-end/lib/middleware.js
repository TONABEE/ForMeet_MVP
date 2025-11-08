import cors from 'cors';
import { verifyIdToken } from './firebase.js';

/**
 * CORS設定
 */
export function setupCors() {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:8081', 'http://localhost:19006'];

  return cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}

/**
 * 認証ミドルウェア
 * Authorization: Bearer <token> ヘッダーからトークンを検証
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const userId = await verifyIdToken(token);

    // リクエストオブジェクトにuserIdを追加
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid authentication token',
    });
  }
}

/**
 * エラーハンドリングミドルウェア
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // 既にレスポンスが送信されている場合はスキップ
  if (res.headersSent) {
    return next(err);
  }

  // Zodバリデーションエラー
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors,
    });
  }

  // Firebase関連エラー
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(401).json({
      error: 'Authentication Error',
      message: err.message,
    });
  }

  // その他のエラー
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
}

/**
 * リクエストロギング
 */
export function requestLogger(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
}

/**
 * JSONボディパーサー（エラーハンドリング付き）
 */
export function parseJSON(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
      }
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid JSON',
        message: 'Request body must be valid JSON',
      });
    }
  }
  next();
}

/**
 * レスポンス成功ヘルパー
 */
export function sendSuccess(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * レスポンスエラーヘルパー
 */
export function sendError(res, message, statusCode = 400, error = null) {
  return res.status(statusCode).json({
    success: false,
    error: error || 'Error',
    message,
  });
}
