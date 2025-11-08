/**
 * 認証ヘルパー関数
 * テストで共通的に使用する認証関連の処理
 */

/**
 * テストユーザーでログインする
 * @param {import('@playwright/test').Page} page - Playwrightのページオブジェクト
 * @param {Object} credentials - 認証情報
 * @param {string} credentials.email - メールアドレス
 * @param {string} credentials.password - パスワード
 */
export async function loginUser(page, credentials = null) {
  const email = credentials?.email || process.env.TEST_USER_EMAIL || 'test@formeet.app';
  const password = credentials?.password || process.env.TEST_USER_PASSWORD || 'TestPassword123!';

  // ログインページに移動
  await page.goto('/login');

  // メールアドレスとパスワードを入力
  await page.getByLabel(/メールアドレス/i).fill(email);
  await page.getByLabel(/パスワード/i).fill(password);

  // ログインボタンをクリック
  await page.getByRole('button', { name: /ログイン/i }).click();

  // ホーム画面への遷移を待機
  await page.waitForURL('/(tabs)', { timeout: 5000 });
}

/**
 * テストユーザーを登録する（初回のみ）
 * @param {import('@playwright/test').Page} page - Playwrightのページオブジェクト
 * @param {Object} userData - ユーザー情報
 */
export async function registerUser(page, userData = null) {
  const email = userData?.email || `test-${Date.now()}@formeet.app`;
  const password = userData?.password || 'TestPassword123!';
  const displayName = userData?.displayName || 'テストユーザー';

  // 登録ページに移動
  await page.goto('/register');

  // ユーザー情報を入力
  await page.getByLabel(/メールアドレス/i).fill(email);
  await page.getByLabel(/パスワード/i).fill(password);
  await page.getByLabel(/パスワード.*確認/i).fill(password);
  await page.getByLabel(/表示名/i).fill(displayName);

  // 利用規約に同意
  await page.getByRole('checkbox', { name: /利用規約に同意/i }).check();

  // 登録ボタンをクリック
  await page.getByRole('button', { name: /登録/i }).click();

  // オンボーディング画面への遷移を待機
  await page.waitForURL('/(onboarding)', { timeout: 5000 });

  return { email, password, displayName };
}

/**
 * ログアウトする
 * @param {import('@playwright/test').Page} page - Playwrightのページオブジェクト
 */
export async function logoutUser(page) {
  // メニューを開く
  await page.getByRole('button', { name: /メニュー/i }).click();

  // ログアウトボタンをクリック
  await page.getByRole('button', { name: /ログアウト/i }).click();

  // 確認ダイアログで確定
  await page.getByRole('button', { name: /はい/i }).click();

  // ログインページへの遷移を待機
  await page.waitForURL('/login', { timeout: 5000 });
}

/**
 * Firebase ID トークンを取得する（APIテスト用）
 * @param {import('@playwright/test').Page} page - Playwrightのページオブジェクト
 * @returns {Promise<string>} Firebase ID トークン
 */
export async function getIdToken(page) {
  // ページコンテキストでFirebase ID トークンを取得
  const idToken = await page.evaluate(async () => {
    // Firebase Auth のインスタンスを取得（グローバル変数前提）
    const auth = window.firebaseAuth;
    if (!auth || !auth.currentUser) {
      throw new Error('ユーザーがログインしていません');
    }
    return await auth.currentUser.getIdToken();
  });

  return idToken;
}
