# Formeet E2E テスト

Playwrightを使用したFormeet MVPのエンドツーエンド（E2E）テスト。

## 📋 概要

このディレクトリには、Formeetアプリの主要なユーザーフローをテストするE2Eテストが含まれています。

### テスト対象

- ✅ **オンボーディングフロー** (8画面)
- ✅ **タスク管理** (作成、編集、削除、完了)
- ✅ **音声入力** (音声認識、AI解析、タスク作成)
- 🚧 **計画機能** (朝の提案、自動スケジューリング) - 今後追加
- 🚧 **振り返り機能** (日報生成) - 今後追加

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
cd MVP/vr1/e2e-tests
npm install
```

### 2. Playwrightブラウザのインストール

```bash
npx playwright install
```

すべてのブラウザ（Chromium、Firefox、WebKit）がインストールされます。

### 3. 環境変数の設定

`.env.example`を`.env`にコピー:

```bash
cp .env.example .env
```

`.env`を編集して実際の値を設定:

```env
BASE_URL=http://localhost:8081
API_URL=http://localhost:3000/api
TEST_USER_EMAIL=test@formeet.app
TEST_USER_PASSWORD=TestPassword123!
```

## 🧪 テストの実行

### 基本的な実行

```bash
# すべてのテストを実行（ヘッドレスモード）
npm test

# ブラウザを表示して実行
npm run test:headed

# インタラクティブUIモードで実行
npm run test:ui

# デバッグモード
npm run test:debug
```

### ブラウザ別実行

```bash
# Chromiumのみ
npm run test:chromium

# Firefoxのみ
npm run test:firefox

# WebKitのみ
npm run test:webkit

# モバイルChrome
npm run test:mobile
```

### 特定のテストファイルを実行

```bash
# オンボーディングテストのみ
npx playwright test tests/onboarding.spec.js

# タスク管理テストのみ
npx playwright test tests/tasks.spec.js

# 音声入力テストのみ
npx playwright test tests/voice-input.spec.js
```

### テストレポートの表示

```bash
npm run report
```

HTMLレポートがブラウザで開きます。

## 📁 ディレクトリ構造

```
e2e-tests/
├── tests/                    # テストファイル
│   ├── onboarding.spec.js    # オンボーディングフローテスト
│   ├── tasks.spec.js         # タスク管理テスト
│   └── voice-input.spec.js   # 音声入力テスト
├── helpers/                  # ヘルパー関数
│   ├── auth.js               # 認証関連ヘルパー
│   └── api.js                # APIリクエストヘルパー
├── fixtures/                 # テストデータ
│   └── mock-data.js          # モックデータ
├── playwright.config.js      # Playwright設定
├── package.json
├── .env.example              # 環境変数テンプレート
└── README.md                 # このファイル
```

## 🔧 設定

### playwright.config.js

主要な設定項目:

```javascript
{
  // テストディレクトリ
  testDir: './tests',
  
  // 並列実行
  fullyParallel: true,
  
  // リトライ回数（CI環境では2回）
  retries: process.env.CI ? 2 : 0,
  
  // レポーター
  reporter: ['html', 'json', 'junit', 'list'],
  
  // プロジェクト（複数ブラウザ対応）
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
    { name: 'mobile-chrome' },
    { name: 'mobile-safari' },
  ],
}
```

## 📝 テストの書き方

### 基本パターン

```javascript
import { test, expect } from '@playwright/test';

test.describe('機能名', () => {
  
  test.beforeEach(async ({ page }) => {
    // テスト前の共通処理
    await page.goto('/');
  });

  test('正常系: ○○ができる', async ({ page }) => {
    // Arrange（準備）
    await page.getByRole('button', { name: /ボタン名/i }).click();

    // Act（実行）
    await page.getByLabel(/入力欄/i).fill('テスト');

    // Assert（検証）
    await expect(page.getByText('成功')).toBeVisible();
  });

  test('異常系: エラーハンドリング', async ({ page }) => {
    // エラーケースのテスト
  });
});
```

### ヘルパー関数の使用

```javascript
import { loginUser } from '../helpers/auth.js';
import { createTask } from '../helpers/api.js';
import { mockTasks } from '../fixtures/mock-data.js';

test('タスクを作成できる', async ({ page }) => {
  // ログイン
  await loginUser(page);

  // APIでタスク作成（テストデータ準備）
  const token = await getIdToken(page);
  await createTask(token, mockTasks[0]);

  // UIで確認
  await expect(page.getByText(mockTasks[0].title)).toBeVisible();
});
```

## 🎯 ベストプラクティス

### 1. ロケーター選択の優先順位

```javascript
// ✅ Good: ロールとアクセシブル名
await page.getByRole('button', { name: /送信/i });

// ✅ Good: ラベル
await page.getByLabel(/メールアドレス/i);

// ⚠️ OK: テキスト
await page.getByText('ログイン');

// ❌ Bad: CSSセレクタ（変更に弱い）
await page.locator('.submit-btn');
```

### 2. 待機処理

```javascript
// ✅ Good: 自動待機（推奨）
await expect(page.getByText('成功')).toBeVisible();

// ⚠️ OK: 明示的な待機（必要な場合のみ）
await page.waitForURL('/success');

// ❌ Bad: 固定時間待機（避ける）
await page.waitForTimeout(1000);
```

### 3. テストの独立性

```javascript
// ✅ Good: 各テストが独立
test('テスト1', async ({ page }) => {
  await page.goto('/');
  // テストロジック
});

test('テスト2', async ({ page }) => {
  await page.goto('/');
  // 別のテストロジック（テスト1に依存しない）
});
```

## 🐛 デバッグ

### 1. UIモードで実行

```bash
npm run test:ui
```

タイムトラベルデバッグ、ステップ実行、ロケーターのハイライトが可能。

### 2. デバッグモードで実行

```bash
npm run test:debug
```

ブラウザが開き、Playwrightインスペクターで1ステップずつ実行できます。

### 3. スクリーンショット・ビデオ

設定で自動的に保存されます:

- **スクリーンショット**: テスト失敗時のみ
- **ビデオ**: テスト失敗時のみ
- **トレース**: 最初のリトライ時

保存先: `test-results/`

### 4. コンソールログの確認

```javascript
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

## 🚦 CI/CD統合

GitHub Actionsで自動実行されます（`.github/workflows/e2e-tests.yml`）:

```yaml
# プッシュ・プルリクエスト時に自動実行
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

### 実行内容

- ✅ 3つのブラウザ（Chromium、Firefox、WebKit）でテスト
- ✅ モバイルデバイス（Chrome、Safari）でテスト
- ✅ テスト結果をアーティファクトとして保存（30日間）

### 必要なシークレット

GitHub リポジトリの Settings → Secrets に設定:

- `BASE_URL`: テスト対象URL
- `API_URL`: バックエンドAPI URL
- `TEST_USER_EMAIL`: テストユーザーのメール
- `TEST_USER_PASSWORD`: テストユーザーのパスワード
- `TEST_FIREBASE_API_KEY`: Firebase APIキー（テスト用）
- `TEST_FIREBASE_PROJECT_ID`: FirebaseプロジェクトID

## 📊 レポート

### HTMLレポート

テスト実行後、以下のコマンドで確認:

```bash
npm run report
```

- テスト結果の一覧
- スクリーンショット
- ビデオ録画
- トレース（タイムライン）

### JUnit XML

CI/CDツールとの統合用:

```
test-results/junit.xml
```

### JSON

カスタム分析用:

```
test-results/results.json
```

## 🔗 関連リンク

- [Playwright公式ドキュメント](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)

## 🤝 貢献

新しいテストを追加する場合:

1. `tests/`に新しい`.spec.js`ファイルを作成
2. 必要に応じて`helpers/`にヘルパー関数を追加
3. `fixtures/mock-data.js`にモックデータを追加
4. テストを実行して動作確認
5. プルリクエストを作成

## 📞 サポート

テストに関する質問・問題は以下へ:

- GitHub Issues
- チームSlackチャンネル

---

**Last Updated**: 2025年11月8日
