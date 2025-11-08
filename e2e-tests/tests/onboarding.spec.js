import { test, expect } from '@playwright/test';

/**
 * オンボーディングフロー E2Eテスト
 * 
 * テストシナリオ:
 * 1. Welcome画面からスタート
 * 2. 視覚設定（フォントサイズ、色選択）
 * 3. 音声設定（音声ガイド有効化）
 * 4. カレンダー同期（スキップ可能）
 * 5. AI診断（2ステップ）
 * 6. AI口調選択
 * 7. 完了画面
 */

test.describe('オンボーディングフロー', () => {
  
  test.beforeEach(async ({ page }) => {
    // アプリのトップページに移動
    await page.goto('/');
  });

  test('正常系: 全オンボーディングステップを完了できる', async ({ page }) => {
    // ONB_00_Welcome
    await expect(page.getByRole('heading', { name: /Formeetへようこそ/i })).toBeVisible();
    await page.getByRole('button', { name: /はじめる/i }).click();

    // ONB_01_VisualSetup
    await expect(page.getByRole('heading', { name: /視覚設定/i })).toBeVisible();
    
    // フォントサイズ選択（中を選択）
    await page.getByRole('radio', { name: /中/i }).click();
    
    // テーマカラー選択（青を選択）
    await page.getByTestId('color-blue').click();
    
    await page.getByRole('button', { name: /次へ/i }).click();

    // ONB_02_AudioSetup
    await expect(page.getByRole('heading', { name: /音声設定/i })).toBeVisible();
    
    // 音声ガイドを有効化
    await page.getByRole('switch', { name: /音声ガイド/i }).click();
    
    await page.getByRole('button', { name: /次へ/i }).click();

    // ONB_03_CalendarSync
    await expect(page.getByRole('heading', { name: /カレンダー連携/i })).toBeVisible();
    
    // スキップを選択
    await page.getByRole('button', { name: /スキップ/i }).click();

    // ONB_04_AIAssessment1
    await expect(page.getByRole('heading', { name: /AI診断/i })).toBeVisible();
    
    // 質問に回答（例: 朝の準備に時間がかかる → はい）
    await page.getByRole('radio', { name: /はい/i }).first().click();
    await page.getByRole('radio', { name: /時々/i }).nth(1).click();
    
    await page.getByRole('button', { name: /次へ/i }).click();

    // ONB_05_AIAssessment2
    await expect(page.getByRole('heading', { name: /AI診断/i })).toBeVisible();
    
    // 追加質問に回答
    await page.getByRole('radio', { name: /はい/i }).first().click();
    
    await page.getByRole('button', { name: /次へ/i }).click();

    // ONB_06_AITone
    await expect(page.getByRole('heading', { name: /AI口調選択/i })).toBeVisible();
    
    // 口調を選択（フレンドリー）
    await page.getByTestId('tone-friendly').click();
    
    await page.getByRole('button', { name: /決定/i }).click();

    // ONB_07_Complete
    await expect(page.getByRole('heading', { name: /設定完了/i })).toBeVisible();
    await expect(page.getByText(/準備が整いました/i)).toBeVisible();
    
    await page.getByRole('button', { name: /始める/i }).click();

    // ホーム画面に遷移したことを確認
    await expect(page.getByRole('heading', { name: /今日のタスク/i })).toBeVisible();
  });

  test('異常系: 必須項目未選択時は次へ進めない', async ({ page }) => {
    // Welcome画面をスキップ
    await page.goto('/');
    await page.getByRole('button', { name: /はじめる/i }).click();

    // ONB_01_VisualSetup - 何も選択せずに次へ
    await expect(page.getByRole('heading', { name: /視覚設定/i })).toBeVisible();
    
    const nextButton = page.getByRole('button', { name: /次へ/i });
    
    // フォントサイズ未選択の場合、ボタンが無効化されているか確認
    await expect(nextButton).toBeDisabled();
    
    // フォントサイズを選択
    await page.getByRole('radio', { name: /中/i }).click();
    
    // テーマカラー未選択でもまだ無効
    await expect(nextButton).toBeDisabled();
    
    // テーマカラーも選択
    await page.getByTestId('color-blue').click();
    
    // 両方選択したので有効化される
    await expect(nextButton).toBeEnabled();
  });

  test('戻るボタンで前の画面に戻れる', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /はじめる/i }).click();

    // ONB_01_VisualSetup
    await page.getByRole('radio', { name: /中/i }).click();
    await page.getByTestId('color-blue').click();
    await page.getByRole('button', { name: /次へ/i }).click();

    // ONB_02_AudioSetup
    await expect(page.getByRole('heading', { name: /音声設定/i })).toBeVisible();
    
    // 戻るボタンをクリック
    await page.getByRole('button', { name: /戻る/i }).click();

    // ONB_01_VisualSetupに戻ったことを確認
    await expect(page.getByRole('heading', { name: /視覚設定/i })).toBeVisible();
    
    // 前回選択した値が保持されているか確認
    await expect(page.getByRole('radio', { name: /中/i })).toBeChecked();
  });

  test('スキップ可能な画面では進行できる', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /はじめる/i }).click();

    // VisualSetup, AudioSetupをスキップ
    await page.goto('/(onboarding)/calendar-sync');

    // ONB_03_CalendarSync
    await expect(page.getByRole('heading', { name: /カレンダー連携/i })).toBeVisible();
    
    // スキップボタンをクリック
    await page.getByRole('button', { name: /スキップ/i }).click();

    // 次の画面（AI診断）に進めることを確認
    await expect(page.getByRole('heading', { name: /AI診断/i })).toBeVisible();
  });

  test('モバイル表示でも正常に動作する', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'このテストはモバイルデバイスでのみ実行');

    await page.goto('/');
    
    // モバイルでのタッチ操作をシミュレート
    await page.getByRole('button', { name: /はじめる/i }).tap();

    // ビューポートサイズを確認
    const viewportSize = page.viewportSize();
    expect(viewportSize.width).toBeLessThan(768);

    // モバイル用レイアウトが表示されていることを確認
    await expect(page.getByRole('heading', { name: /視覚設定/i })).toBeVisible();
  });
});
