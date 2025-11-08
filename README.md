# Formeet MVP - vr1

FormeetのMVP実装ディレクトリ（バージョン1）

## 📁 プロジェクト構成

- **formeet-mobile/** - React Nativeモバイルアプリ（30画面実装済み）
- **back-end/** - Vercel + Firebase バックエンド（11 APIエンドポイント）
- **e2e-tests/** - Playwright E2Eテスト
- **dash-board/** - Webダッシュボード（開発中）

## 🚀 クイックスタート

### モバイルアプリ

```bash
cd formeet-mobile
npm install
npm start
```

### バックエンド

```bash
cd back-end
npm install
cp .env.example .env
# .envを編集してAPIキーを設定
npm run dev
```

### E2Eテスト

```bash
cd e2e-tests
npm install
npx playwright install chromium
npm test
```

## 📚 ドキュメント

- [モバイルアプリ README](./formeet-mobile/README.md)
- [バックエンド README](./back-end/README.md)
- [バックエンド デプロイガイド](./back-end/DEPLOY.md)
- [API仕様書](./back-end/API_SPEC.md)
- [E2Eテスト README](./e2e-tests/README.md)

## 🔒 セキュリティ

**重要**: 以下のファイルは`.gitignore`で除外されています
- `.env`（環境変数）
- `serviceAccountKey.json`（Firebase秘密鍵）
- `node_modules/`

詳細は親ディレクトリの[SECURITY.md](../SECURITY.md)を参照してください。

## 📊 実装状況

| コンポーネント | ステータス | 詳細 |
|--------------|----------|------|
| モバイルアプリ | ✅ 完成 | 30画面実装済み |
| バックエンドAPI | ✅ 完成 | 11エンドポイント |
| E2Eテスト | ✅ 完成 | 3テストスイート |
| Webダッシュボード | 🚧 開発中 | - |

---

**最終更新**: 2025年11月8日
