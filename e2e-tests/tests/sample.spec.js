import { test, expect } from '@playwright/test';

/**
 * サンプルテスト - Playwrightの動作確認用
 * 
 * このテストはPlaywrightが正しくインストールされているか確認するための
 * シンプルなテストです。実際のFormeetアプリが動いていなくても実行できます。
 */

test.describe('Playwright動作確認', () => {
  
  test('Playwrightが正常に動作する', async ({ page }) => {
    // Playwright公式サイトにアクセス
    await page.goto('https://playwright.dev/');

    // タイトルに"Playwright"が含まれることを確認
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('基本的なインタラクションが動作する', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // "Get started"リンクをクリック
    await page.getByRole('link', { name: 'Get started' }).first().click();

    // URLが変わったことを確認
    await expect(page).toHaveURL(/.*intro/);
  });

  test('スクリーンショットが撮影できる', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // スクリーンショットを撮影
    await page.screenshot({ path: 'test-results/sample-screenshot.png' });
    
    // テスト成功
    expect(true).toBe(true);
  });
});

/**
 * Formeetアプリのテスト（実際のアプリが起動している場合のみ）
 * 
 * これらのテストはFormeetアプリがlocalhost:8081で起動している必要があります。
 * アプリが起動していない場合はスキップされます。
 */
test.describe('Formeetアプリ接続テスト', () => {
  
  test.beforeEach(async ({ page }) => {
    // アプリが起動していない場合はスキップ
    const baseUrl = process.env.BASE_URL || 'http://localhost:8081';
    
    try {
      await page.goto(baseUrl, { timeout: 5000 });
    } catch (error) {
      test.skip(true, `アプリが起動していません: ${baseUrl}`);
    }
  });

  test('Formeetアプリにアクセスできる', async ({ page }) => {
    // ページが読み込まれたことを確認
    await expect(page).toHaveURL(/localhost:8081/);
  });

  test('Welcome画面が表示される', async ({ page }) => {
    // Welcome画面の要素が表示されるか確認
    // （実際のアプリの実装に合わせて調整してください）
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});
