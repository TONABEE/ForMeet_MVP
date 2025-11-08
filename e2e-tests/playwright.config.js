import { defineConfig, devices } from '@playwright/test';

/**
 * Formeet MVP E2Eテスト設定
 * 
 * 環境変数:
 * - BASE_URL: テスト対象のベースURL（デフォルト: http://localhost:8081）
 * - API_URL: バックエンドAPIのURL（デフォルト: http://localhost:3000/api）
 * - CI: CI環境フラグ（true の場合はヘッドレスモードで実行）
 */

export default defineConfig({
  // テストディレクトリ
  testDir: './tests',
  
  // テストファイルのパターン
  testMatch: '**/*.spec.js',
  
  // 並列実行の設定
  fullyParallel: true,
  
  // CI環境での設定
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // レポーター設定
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],
  
  // 共通設定
  use: {
    // ベースURL
    baseURL: process.env.BASE_URL || 'http://localhost:8081',
    
    // スクリーンショット設定
    screenshot: 'only-on-failure',
    
    // ビデオ録画設定
    video: 'retain-on-failure',
    
    // トレース設定
    trace: 'on-first-retry',
    
    // タイムアウト設定
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  
  // プロジェクト設定（複数ブラウザ・デバイス対応）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        // モバイル固有の設定
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 13'],
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
  
  // ローカル開発サーバーの自動起動（オプション）
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:8081',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
});
