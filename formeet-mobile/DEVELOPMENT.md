# Formeet Mobile App Development

## 現在の進捗

### ✅ 完了
1. **プロジェクト初期化**
   - React Native + Expo環境セットアップ
   - React Native Paper UIライブラリ導入
   - Formeetデザイントークン実装 (`constants/theme.ts`)

2. **Phase 1 実装開始**
   - オンボーディングフロー構造作成
   - ONB_00_Welcome (ウェルカム画面) 実装

### 🔄 進行中
- Phase 1 残り20画面の実装

### 📋 次のステップ
1. ロゴ画像の配置
2. ONB_01_VisualSetup (視覚設定) 実装
3. 残りのオンボーディング画面 (ONB_02〜ONB_07)
4. ホーム画面・音声入力画面
5. プランニング・タスク・レビュー画面

## 画面一覧 (Phase 1: 21画面)

### オンボーディング (8画面)
- [x] ONB_00_Welcome
- [ ] ONB_01_VisualSetup
- [ ] ONB_02_AudioSetup
- [ ] ONB_03_CalendarSync
- [ ] ONB_04_AIAssessment_1
- [ ] ONB_05_AIAssessment_2
- [ ] ONB_06_AITone
- [ ] ONB_07_Complete

### アンビエント UI (2画面)
- [ ] AMBIENT_00_LockScreen
- [ ] AMBIENT_01_Widget

### ホーム (1画面)
- [ ] HOME_00_Dashboard

### 音声入力 (3画面)
- [ ] VOICE_00_Input
- [ ] VOICE_01_Listening
- [ ] VOICE_02_Confirmation

### プランニング (3画面)
- [ ] PLAN_00_MorningPrompt
- [ ] PLAN_01_TaskSelection
- [ ] PLAN_02_BufferInsertion

### タスク実行 (4画面)
- [ ] TASK_00_TodayView
- [ ] TASK_01_Detail
- [ ] TASK_02_FirstStep
- [ ] TASK_03_InProgress

### 振り返り (1画面)
- [ ] REVIEW_00_DailyReport

## 技術スタック

- **フレームワーク**: React Native + Expo Router
- **UI ライブラリ**: React Native Paper (Material Design)
- **デザインシステム**: Formeet Design Tokens (Atlassian準拠)
- **状態管理**: (未定 - Context API or Zustand)
- **型安全性**: TypeScript

## 開発コマンド

```bash
# 開発サーバー起動
npm start

# iOS実行
npm run ios

# Android実行
npm run android

# Web実行
npm run web
```
