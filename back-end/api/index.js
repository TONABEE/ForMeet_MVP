/**
 * ヘルスチェックエンドポイント
 */
export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: 'Formeet API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
