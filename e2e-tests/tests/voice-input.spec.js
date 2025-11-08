import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth.js';

/**
 * 音声入力機能 E2Eテスト
 * 
 * テストシナリオ:
 * 1. 音声入力画面を開く
 * 2. 音声録音をシミュレート
 * 3. AI解析結果の確認
 * 4. タスク確認画面
 * 5. タスク作成成功
 */

test.describe('音声入力機能', () => {
  
  test.beforeEach(async ({ page, context }) => {
    // マイク権限を付与（モック）
    await context.grantPermissions(['microphone']);
    
    // ログインしてホーム画面に遷移
    await loginUser(page);
    await page.goto('/(tabs)');
  });

  test('正常系: 音声入力でタスクを作成できる', async ({ page }) => {
    // 音声入力ボタンをクリック
    await page.getByRole('button', { name: /音声で追加/i }).click();

    // VOICE_00_Input
    await expect(page.getByRole('heading', { name: /音声入力/i })).toBeVisible();

    // 録音開始ボタンをクリック
    await page.getByRole('button', { name: /録音開始/i }).click();

    // VOICE_01_Listening
    await expect(page.getByRole('heading', { name: /聞いています/i })).toBeVisible();
    await expect(page.getByTestId('recording-indicator')).toBeVisible();

    // 音声入力をモック（バックエンドAPIレスポンスをモック）
    await page.route('**/api/voice/transcribe', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          transcribedText: '明日14時に会議',
          taskInfo: {
            title: '会議',
            description: '会議に参加する',
            scheduledStart: '2025-11-09T14:00:00+09:00',
            estimatedDuration: 60,
            type: 'meeting'
          },
          aiMessage: 'タスクを作成しました。内容を確認してください。'
        })
      });
    });

    // 録音停止ボタンをクリック
    await page.getByRole('button', { name: /停止/i }).click();

    // VOICE_02_Confirmation
    await expect(page.getByRole('heading', { name: /確認/i })).toBeVisible();
    
    // AI解析結果が表示される
    await expect(page.getByText('会議')).toBeVisible();
    await expect(page.getByText('明日14時に会議')).toBeVisible();
    await expect(page.getByText(/2025-11-09.*14:00/)).toBeVisible();

    // 確定ボタンをクリック
    await page.getByRole('button', { name: /確定/i }).click();

    // VOICE_03_Success
    await expect(page.getByRole('heading', { name: /作成完了/i })).toBeVisible();
    await expect(page.getByText(/タスクを作成しました/i)).toBeVisible();

    // ホームに戻る
    await page.getByRole('button', { name: /ホームに戻る/i }).click();

    // 作成されたタスクが一覧に表示される
    await expect(page.getByText('会議')).toBeVisible();
  });

  test('正常系: 音声入力結果を編集してタスク作成', async ({ page }) => {
    // 音声入力開始
    await page.getByRole('button', { name: /音声で追加/i }).click();
    await page.getByRole('button', { name: /録音開始/i }).click();

    // APIモック
    await page.route('**/api/voice/transcribe', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          transcribedText: '買い物に行く',
          taskInfo: {
            title: '買い物',
            description: '買い物に行く',
            type: 'personal'
          }
        })
      });
    });

    await page.getByRole('button', { name: /停止/i }).click();

    // VOICE_02_Confirmation
    await expect(page.getByText('買い物')).toBeVisible();

    // 編集ボタンをクリック
    await page.getByRole('button', { name: /編集/i }).click();

    // タスク名を修正
    await page.getByLabel(/タスク名/i).clear();
    await page.getByLabel(/タスク名/i).fill('スーパーで買い物');

    // 詳細を追加
    await page.getByLabel(/説明/i).fill('牛乳、卵、パンを購入');

    // 保存
    await page.getByRole('button', { name: /保存/i }).click();

    // 確定
    await page.getByRole('button', { name: /確定/i }).click();

    // 成功画面
    await expect(page.getByRole('heading', { name: /作成完了/i })).toBeVisible();
  });

  test('異常系: 音声認識エラー時のハンドリング', async ({ page }) => {
    // 音声入力開始
    await page.getByRole('button', { name: /音声で追加/i }).click();
    await page.getByRole('button', { name: /録音開始/i }).click();

    // APIエラーをモック
    await page.route('**/api/voice/transcribe', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: '音声認識に失敗しました'
        })
      });
    });

    await page.getByRole('button', { name: /停止/i }).click();

    // エラーメッセージが表示される
    await expect(page.getByText(/音声認識に失敗しました/i)).toBeVisible();

    // リトライボタンが表示される
    await expect(page.getByRole('button', { name: /もう一度試す/i })).toBeVisible();
  });

  test('音声入力をキャンセルできる', async ({ page }) => {
    // 音声入力開始
    await page.getByRole('button', { name: /音声で追加/i }).click();
    await page.getByRole('button', { name: /録音開始/i }).click();

    // VOICE_01_Listening
    await expect(page.getByRole('heading', { name: /聞いています/i })).toBeVisible();

    // キャンセルボタンをクリック
    await page.getByRole('button', { name: /キャンセル/i }).click();

    // 確認ダイアログ
    await expect(page.getByText(/録音を中止しますか/i)).toBeVisible();
    await page.getByRole('button', { name: /はい/i }).click();

    // ホーム画面に戻る
    await expect(page.getByRole('heading', { name: /今日のタスク/i })).toBeVisible();
  });

  test('マイク権限がない場合のエラー表示', async ({ page, context }) => {
    // マイク権限を取り消す
    await context.clearPermissions();

    // 音声入力ボタンをクリック
    await page.getByRole('button', { name: /音声で追加/i }).click();

    // 録音開始を試みる
    await page.getByRole('button', { name: /録音開始/i }).click();

    // エラーメッセージが表示される
    await expect(page.getByText(/マイクへのアクセスが許可されていません/i)).toBeVisible();

    // 設定を開くボタンが表示される
    await expect(page.getByRole('button', { name: /設定を開く/i })).toBeVisible();
  });

  test('長時間録音時の自動停止', async ({ page }) => {
    // 音声入力開始
    await page.getByRole('button', { name: /音声で追加/i }).click();
    await page.getByRole('button', { name: /録音開始/i }).click();

    // 録音時間が表示される
    await expect(page.getByTestId('recording-timer')).toBeVisible();

    // 60秒後に自動停止をシミュレート
    await page.evaluate(() => {
      // タイマーをモック
      setTimeout(() => {
        window.dispatchEvent(new Event('recording-auto-stop'));
      }, 100);
    });

    await page.waitForTimeout(200);

    // 自動停止メッセージが表示される
    await expect(page.getByText(/録音時間の上限に達しました/i)).toBeVisible();
  });
});
