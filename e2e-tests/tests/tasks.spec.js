import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth.js';

/**
 * タスク管理機能 E2Eテスト
 * 
 * テストシナリオ:
 * 1. タスク一覧表示
 * 2. 新規タスク作成
 * 3. タスク詳細表示
 * 4. タスク開始（First Step入力）
 * 5. タスク進行中
 * 6. タスク完了
 * 7. タスク編集
 * 8. タスク削除
 */

test.describe('タスク管理機能', () => {
  
  test.beforeEach(async ({ page }) => {
    // ログインしてホーム画面に遷移
    await loginUser(page);
    await page.goto('/(tabs)');
  });

  test('正常系: 新規タスクを作成できる', async ({ page }) => {
    // タスク作成ボタンをクリック
    await page.getByRole('button', { name: /新しいタスク/i }).click();

    // タスク作成フォーム
    await expect(page.getByRole('heading', { name: /タスク作成/i })).toBeVisible();

    // タスク情報を入力
    await page.getByLabel(/タスク名/i).fill('資料作成');
    await page.getByLabel(/説明/i).fill('プレゼン用の資料を作成する');
    
    // タスクタイプを選択（仕事）
    await page.getByTestId('type-work').click();
    
    // 優先度を選択（高）
    await page.getByTestId('priority-high').click();
    
    // 予定時間を設定（2時間）
    await page.getByLabel(/予定時間/i).fill('120');
    
    // 場所を入力
    await page.getByLabel(/場所/i).fill('自宅');
    
    // 保存ボタンをクリック
    await page.getByRole('button', { name: /保存/i }).click();

    // タスク一覧に戻り、新しいタスクが表示されることを確認
    await expect(page.getByText('資料作成')).toBeVisible();
  });

  test('正常系: タスクを開始してFirst Stepを入力できる', async ({ page }) => {
    // 既存タスクをクリック（モックデータ前提）
    await page.getByText('資料作成').click();

    // TASK_01_Detail
    await expect(page.getByRole('heading', { name: /タスク詳細/i })).toBeVisible();
    await expect(page.getByText('資料作成')).toBeVisible();

    // 開始ボタンをクリック
    await page.getByRole('button', { name: /開始/i }).click();

    // TASK_02_FirstStep
    await expect(page.getByRole('heading', { name: /最初の一歩/i })).toBeVisible();

    // First Stepを入力
    await page.getByLabel(/最初に何をしますか/i).fill('資料の構成を考える');
    
    await page.getByRole('button', { name: /始める/i }).click();

    // TASK_03_InProgress
    await expect(page.getByRole('heading', { name: /進行中/i })).toBeVisible();
    await expect(page.getByText('資料作成')).toBeVisible();
    
    // タイマーが動いていることを確認
    await expect(page.getByTestId('timer')).toBeVisible();
  });

  test('正常系: タスクを完了できる', async ({ page }) => {
    // タスクを開始状態にする（ヘルパー関数使用）
    await page.goto('/(tasks)/in-progress?taskId=test-task-1');

    // TASK_03_InProgress
    await expect(page.getByRole('heading', { name: /進行中/i })).toBeVisible();

    // 完了ボタンをクリック
    await page.getByRole('button', { name: /完了/i }).click();

    // TASK_04_Complete
    await expect(page.getByRole('heading', { name: /お疲れ様でした/i })).toBeVisible();
    await expect(page.getByText(/タスクを完了しました/i)).toBeVisible();

    // 実行時間が表示されていることを確認
    await expect(page.getByTestId('actual-duration')).toBeVisible();

    // ホームに戻るボタンをクリック
    await page.getByRole('button', { name: /ホームに戻る/i }).click();

    // ホーム画面に遷移
    await expect(page.getByRole('heading', { name: /今日のタスク/i })).toBeVisible();
  });

  test('正常系: タスクを編集できる', async ({ page }) => {
    // タスク詳細を開く
    await page.getByText('資料作成').click();

    // 編集ボタンをクリック
    await page.getByRole('button', { name: /編集/i }).click();

    // タスク名を変更
    await page.getByLabel(/タスク名/i).clear();
    await page.getByLabel(/タスク名/i).fill('プレゼン資料作成');

    // 保存
    await page.getByRole('button', { name: /保存/i }).click();

    // 更新されたタスク名が表示されることを確認
    await expect(page.getByText('プレゼン資料作成')).toBeVisible();
  });

  test('正常系: タスクを削除できる', async ({ page }) => {
    // タスク詳細を開く
    await page.getByText('資料作成').click();

    // 削除ボタンをクリック
    await page.getByRole('button', { name: /削除/i }).click();

    // 確認ダイアログが表示される
    await expect(page.getByText(/本当に削除しますか/i)).toBeVisible();

    // 削除を確定
    await page.getByRole('button', { name: /削除する/i }).click();

    // タスク一覧に戻り、削除されたタスクが表示されないことを確認
    await expect(page.getByText('資料作成')).not.toBeVisible();
  });

  test('異常系: 必須項目未入力でタスク作成できない', async ({ page }) => {
    // タスク作成ボタンをクリック
    await page.getByRole('button', { name: /新しいタスク/i }).click();

    // タスク名を入力せずに保存しようとする
    await page.getByRole('button', { name: /保存/i }).click();

    // エラーメッセージが表示される
    await expect(page.getByText(/タスク名を入力してください/i)).toBeVisible();

    // タスク作成画面から遷移していないことを確認
    await expect(page.getByRole('heading', { name: /タスク作成/i })).toBeVisible();
  });

  test('タスク一覧のフィルタリングが機能する', async ({ page }) => {
    // ステータスフィルタ: 完了済みのみ表示
    await page.getByRole('button', { name: /フィルタ/i }).click();
    await page.getByRole('checkbox', { name: /完了済み/i }).click();
    await page.getByRole('button', { name: /適用/i }).click();

    // 完了済みタスクのみ表示されることを確認
    await expect(page.getByTestId('task-status-completed')).toBeVisible();
    await expect(page.getByTestId('task-status-pending')).not.toBeVisible();
  });

  test('タスクの並び替えが機能する', async ({ page }) => {
    // 並び替えボタンをクリック
    await page.getByRole('button', { name: /並び替え/i }).click();

    // 優先度順を選択
    await page.getByRole('radio', { name: /優先度順/i }).click();

    // タスクが優先度順に並んでいることを確認
    const tasks = await page.getByTestId('task-item').all();
    expect(tasks.length).toBeGreaterThan(0);

    // 最初のタスクが高優先度であることを確認
    await expect(tasks[0].getByTestId('priority-high')).toBeVisible();
  });
});
