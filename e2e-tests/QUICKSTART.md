# Playwright E2Eテスト - クイックスタートガイド

## ✅ セットアップ完了

Playwrightのセットアップが完了しました！

### インストール済み

- ✅ Playwright本体（@playwright/test）
- ✅ Chromiumブラウザ
- ✅ 設定ファイル（playwright.config.js）
- ✅ サンプルテスト（tests/sample.spec.js）

## 🚀 テスト実行方法

### 1. サンプルテストを実行（Playwrightの動作確認）

```bash
cd MVP/vr1/e2e-tests
npm test tests/sample.spec.js
```

**期待される結果**:
```
✓ 3 passed (Playwright動作確認テスト)
- 2 skipped (Formeetアプリテスト - アプリ未起動のためスキップ)
```

### 2. UIモードで実行（推奨）

```bash
npm run test:ui
```

インタラクティブなUIでテストを確認・デバッグできます。

### 3. HTMLレポートを表示

```bash
npm run report
```

ブラウザでテスト結果の詳細レポートが開きます。

## 📁 現在のテストファイル

### tests/sample.spec.js（動作確認用）

✅ **Playwright動作確認**:
- Playwrightが正常に動作するか
- 基本的なインタラクションが動作するか
- スクリーンショットが撮影できるか

🚧 **Formeetアプリ接続テスト**:
- アプリが起動していない場合は自動的にスキップ
- localhost:8081で起動すると実行されます

### tests/onboarding.spec.js（実装済み）

オンボーディングフローのテスト（5ケース）

### tests/tasks.spec.js（実装済み）

タスク管理機能のテスト（8ケース）

### tests/voice-input.spec.js（実装済み）

音声入力機能のテスト（6ケース）

## 🎯 次のステップ

### オプション1: モバイルアプリを起動してテスト

```bash
# ターミナル1: モバイルアプリを起動
cd MVP/vr1/formeet-mobile
npm start

# ターミナル2: E2Eテストを実行
cd MVP/vr1/e2e-tests
npm test
```

### オプション2: バックエンドを起動してAPIテスト

```bash
# ターミナル1: バックエンドを起動
cd MVP/vr1/back-end
npm run dev

# ターミナル2: APIヘルパーを使ったテスト
cd MVP/vr1/e2e-tests
# (APIテストを実装後に実行)
```

### オプション3: GitHub Actionsでテスト

```bash
# プッシュすると自動的にCI/CDでテストが実行されます
git add .
git commit -m "Add E2E tests with Playwright"
git push
```

## 🐛 トラブルシューティング

### エラー: "Executable doesn't exist"

**解決策**:
```bash
npx playwright install chromium
```

### エラー: "Connection refused"

**原因**: アプリが起動していない

**解決策**:
- モバイルアプリを起動してください（`npm start`）
- または、サンプルテストのみ実行してください

### テストがスキップされる

**原因**: 正常動作（アプリが起動していない場合は自動的にスキップ）

**確認方法**:
```bash
npm test tests/sample.spec.js
# → "2 skipped" が表示されればOK
```

## 📊 現在のステータス

| 項目 | ステータス |
|------|----------|
| Playwright本体 | ✅ インストール済み |
| Chromiumブラウザ | ✅ インストール済み |
| 設定ファイル | ✅ 作成済み |
| サンプルテスト | ✅ 実行成功 |
| オンボーディングテスト | ✅ 実装済み（未実行） |
| タスク管理テスト | ✅ 実装済み（未実行） |
| 音声入力テスト | ✅ 実装済み（未実行） |
| GitHub Actions | ✅ 設定済み |

## 🎉 テスト実行結果（サンプル）

```
Running 5 tests using 4 workers

  ✓ Playwright動作確認 › Playwrightが正常に動作する (1.4s)
  ✓ Playwright動作確認 › 基本的なインタラクションが動作する (1.4s)
  ✓ Playwright動作確認 › スクリーンショットが撮影できる (1.4s)
  - Formeetアプリ接続テスト › Formeetアプリにアクセスできる (skipped)
  - Formeetアプリ接続テスト › Welcome画面が表示される (skipped)

  2 skipped
  3 passed (3.2s)
```

---

**準備完了！** 🚀

モバイルアプリを起動したら、すぐにE2Eテストを実行できます。
