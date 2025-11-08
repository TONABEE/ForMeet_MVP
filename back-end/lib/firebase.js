import admin from 'firebase-admin';

let firebaseApp;

/**
 * Firebase Admin SDK の初期化
 * Vercel環境では環境変数から設定を読み込む
 */
export async function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // サービスアカウントキーの読み込み
    let serviceAccount;
    
    if (process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT) {
      // 環境変数からJSON文字列を読み込む（Vercel推奨）
      serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT);
    } else {
      // ローカル開発環境ではファイルから読み込む
      const { readFileSync } = await import('fs');
      serviceAccount = JSON.parse(
        readFileSync('./serviceAccountKey.json', 'utf8')
      );
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });

    console.log('✅ Firebase Admin initialized');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }
}

/**
 * Firestoreインスタンスを取得
 */
export function getFirestore() {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.firestore();
}

/**
 * Firebase Authenticationインスタンスを取得
 */
export function getAuth() {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.auth();
}

/**
 * IDトークンを検証してユーザーIDを取得
 */
export async function verifyIdToken(token) {
  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid authentication token');
  }
}

export default admin;
