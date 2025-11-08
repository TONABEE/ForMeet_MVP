# Formeet Mobile - Phase 1 実装プラン

**最終更新**: 2025年11月8日
**目標**: Phase 1 (21画面) の完全実装

---

## 📊 進捗状況

### 実装済み (14/21画面)

#### オンボーディング (8画面) - 5/8完了
- [x] ONB_00_Welcome ✅
- [x] ONB_01_VisualSetup ✅ (共通レイアウト適用済み)
- [x] ONB_02_AudioSetup ✅
- [x] ONB_03_CalendarSync ✅
- [x] ONB_04_AIAssessment_1 ✅
- [ ] ONB_05_AIAssessment_2 ⏳
- [ ] ONB_06_AITone ⏳
- [ ] ONB_07_Complete ⏳

#### ホーム・音声 (4画面) - 3/4完了
- [x] HOME_00_Dashboard ✅
- [x] VOICE_00_Input ⏳ (modal.tsx として存在)
- [ ] VOICE_01_Listening ⏳
- [ ] VOICE_02_Confirmation ⏳

#### その他 (9画面) - 6/9完了
- [x] PLAN_00_MorningPrompt ⏳
- [ ] PLAN_01_TaskSelection ⏳
- [ ] PLAN_02_BufferInsertion ⏳
- [x] TASK_00_TodayView ⏳
- [ ] TASK_01_Detail ⏳
- [ ] TASK_02_FirstStep ⏳
- [ ] TASK_03_InProgress ⏳
- [x] REVIEW_00_DailyReport ⏳
- [ ] AMBIENT_00_LockScreen ⏳
- [ ] AMBIENT_01_Widget ⏳

---

## 🎯 実装戦略

### フェーズ1: オンボーディング完成 (優先度: 最高)
**理由**: ユーザーの第一印象を決定する

1. **ONB_05_AIAssessment_2** - AI診断後半
   - 3つの質問（大きなタスク、通知、忘れ物）
   - OnboardingLayout使用
   - 所要時間: 30分

2. **ONB_06_AITone** - AI秘書の話し方設定
   - 4つのトーンカード
   - テスト通知機能
   - 所要時間: 30分

3. **ONB_07_Complete** - オンボーディング完了
   - 設定サマリー表示
   - ホームへの遷移
   - 所要時間: 30分

### フェーズ2: コア機能実装 (優先度: 高)
**理由**: アプリの核心的価値を提供

4. **PLAN_01_TaskSelection** - 今日の計画立て
   - タスクリスト表示
   - ドラッグ&ドロップ (React Native DnD)
   - 所要時間: 2時間

5. **TASK_01_Detail** - タスク詳細Drawer
   - ボトムシートUI
   - サブタスク表示
   - 所要時間: 1時間

6. **TASK_02_FirstStep** - 第一歩提案
   - AIメッセージ
   - モーダル表示
   - 所要時間: 45分

7. **TASK_03_InProgress** - タスク進行中
   - タイマー表示
   - 過集中アラート
   - 所要時間: 1時間

### フェーズ3: 音声UI実装 (優先度: 中)
**理由**: 差別化要素だが、MVP

では簡易版でOK

8. **VOICE_01_Listening** - 音声入力中
   - 波形アニメーション
   - リアルタイム文字起こし
   - 所要時間: 1.5時間

9. **VOICE_02_Confirmation** - 音声入力確認
   - AI解析結果表示
   - 編集機能
   - 所要時間: 1時間

### フェーズ4: 補助機能実装 (優先度: 低)
**理由**: あると便利だが、後回し可能

10. **PLAN_02_BufferInsertion** - 移動時間自動挿入
    - Google Maps API連携
    - 所要時間: 2時間

11. **AMBIENT_00_LockScreen** - ロック画面ウィジェット
    - Live Activities (iOS)
    - 常駐通知 (Android)
    - 所要時間: 3時間

12. **AMBIENT_01_Widget** - ホーム画面ウィジェット
    - Widget Extension
    - 所要時間: 3時間

---

## 🛠️ 技術的考慮事項

### 共通コンポーネントの拡張

#### 必要な新規コンポーネント

1. **TaskCard** - タスク表示カード
```tsx
<TaskCard
  title="資料作成"
  status="in_progress"
  timeEstimate="2h"
  priority="high"
  onPress={() => {}}
/>
```

2. **AIMessageBubble** - AI秘書メッセージ
```tsx
<AIMessageBubble
  message="大丈夫、一緒に頑張りましょう😊"
  avatar={<Avatar />}
/>
```

3. **BottomSheet** - ボトムシート
```tsx
<BottomSheet visible={true} onDismiss={() => {}}>
  <TaskDetail />
</BottomSheet>
```

4. **WaveformAnimation** - 音声波形
```tsx
<WaveformAnimation isListening={true} />
```

### データフロー設計

#### Context API構成
```
- OnboardingContext: オンボーディング状態
- TaskContext: タスク管理
- SettingsContext: ユーザー設定
- AIContext: AI秘書の設定・状態
```

#### ローカルストレージ
- AsyncStorage使用
- 設定データの永続化
- タスクデータのキャッシュ

---

## 📅 スケジュール (推定)

| フェーズ | 画面数 | 推定時間 | 期限 |
|---------|--------|---------|------|
| フェーズ1 | 3画面 | 1.5時間 | 即日 |
| フェーズ2 | 4画面 | 5時間 | 2日 |
| フェーズ3 | 2画面 | 2.5時間 | 3日 |
| フェーズ4 | 3画面 | 8時間 | 5日 |
| **合計** | **12画面** | **17時間** | **5日** |

---

## ✅ 品質チェックリスト

### 各画面で確認すべき項目

- [ ] FormeetThemeの一貫した使用
- [ ] OnboardingLayout (該当画面のみ)
- [ ] アクセシビリティラベル
- [ ] エラーハンドリング
- [ ] ローディング状態
- [ ] 空状態の処理
- [ ] 画面遷移の動作確認
- [ ] デザインレビュー通過

---

## 🚀 次のアクション

### 今すぐ実装すべき画面 (優先度順)

1. ✅ ONB_05_AIAssessment_2
2. ✅ ONB_06_AITone
3. ✅ ONB_07_Complete
4. ⏳ PLAN_01_TaskSelection
5. ⏳ TASK_01_Detail

---

**このプランに従って、Phase 1を完成させます。**
