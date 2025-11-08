/**
 * タスクのモックデータ
 * テストで使用する固定データ
 */

export const mockTasks = [
  {
    id: 'test-task-1',
    userId: 'test-user-1',
    title: '資料作成',
    description: 'プレゼン用の資料を作成する',
    type: 'work',
    priority: 'high',
    status: 'pending',
    estimatedDuration: 120,
    location: '自宅',
    scheduledStart: '2025-11-08T10:00:00+09:00',
    scheduledEnd: '2025-11-08T12:00:00+09:00',
    firstStep: '資料の構成を考える',
    createdAt: '2025-11-07T20:00:00+09:00',
  },
  {
    id: 'test-task-2',
    userId: 'test-user-1',
    title: '買い物',
    description: '牛乳、卵、パンを購入',
    type: 'personal',
    priority: 'medium',
    status: 'pending',
    estimatedDuration: 30,
    location: 'スーパー',
    createdAt: '2025-11-07T19:00:00+09:00',
  },
  {
    id: 'test-task-3',
    userId: 'test-user-1',
    title: '会議',
    description: 'プロジェクトキックオフミーティング',
    type: 'meeting',
    priority: 'high',
    status: 'in-progress',
    estimatedDuration: 60,
    location: 'オフィス',
    scheduledStart: '2025-11-08T14:00:00+09:00',
    scheduledEnd: '2025-11-08T15:00:00+09:00',
    actualStart: '2025-11-08T14:05:00+09:00',
    createdAt: '2025-11-06T10:00:00+09:00',
  },
  {
    id: 'test-task-4',
    userId: 'test-user-1',
    title: 'ジョギング',
    description: '朝のランニング（5km）',
    type: 'health',
    priority: 'low',
    status: 'completed',
    estimatedDuration: 30,
    location: '公園',
    scheduledStart: '2025-11-08T06:00:00+09:00',
    scheduledEnd: '2025-11-08T06:30:00+09:00',
    actualStart: '2025-11-08T06:02:00+09:00',
    actualEnd: '2025-11-08T06:28:00+09:00',
    actualDuration: 26,
    createdAt: '2025-11-07T22:00:00+09:00',
    completedAt: '2025-11-08T06:28:00+09:00',
  },
];

/**
 * ユーザーのモックデータ
 */
export const mockUsers = [
  {
    uid: 'test-user-1',
    email: 'test@formeet.app',
    displayName: 'テストユーザー',
    settings: {
      fontSize: 'medium',
      themeColor: 'blue',
      voiceGuideEnabled: true,
      aiTone: 'friendly',
    },
    createdAt: '2025-11-01T00:00:00+09:00',
  },
  {
    uid: 'test-user-2',
    email: 'test2@formeet.app',
    displayName: 'テストユーザー2',
    settings: {
      fontSize: 'large',
      themeColor: 'green',
      voiceGuideEnabled: false,
      aiTone: 'formal',
    },
    createdAt: '2025-11-02T00:00:00+09:00',
  },
];

/**
 * AI診断結果のモックデータ
 */
export const mockAssessmentResults = {
  userId: 'test-user-1',
  assessmentDate: '2025-11-01T10:00:00+09:00',
  characteristics: {
    morningRoutineDifficulty: 'high',
    taskInitiationDelay: 'medium',
    sensoryProfile: 'hyposensitive',
    workingMemory: 'low',
    emotionalRegulation: 'medium',
  },
  recommendations: [
    'ルーティンモードを活用して朝の準備を構造化しましょう',
    'タスクの「最初の一歩」を明確にすることで着手しやすくなります',
    'リマインダーを複数回設定することをお勧めします',
  ],
};

/**
 * 日報のモックデータ
 */
export const mockDailyReport = {
  date: '2025-11-08',
  userId: 'test-user-1',
  completedTasks: 3,
  pendingTasks: 5,
  totalCompletedDuration: 180,
  reportContent: `【本日の成果】
✅ ジョギング（26分）
✅ 資料作成（2時間）
✅ 会議（1時間）

【課題・遅延】
⚠️ 買い物を先延ばしにしてしまいました

【明日の予定】
📅 プレゼンテーション準備
📅 スーパーで買い物`,
  analytics: {
    efficiency: 0.85,
    onTimeCompletion: 0.67,
    averageDelay: 15,
  },
};

/**
 * 音声入力のモックレスポンス
 */
export const mockVoiceTranscription = {
  success: true,
  transcribedText: '明日14時に会議',
  taskInfo: {
    title: '会議',
    description: '会議に参加する',
    scheduledStart: '2025-11-09T14:00:00+09:00',
    estimatedDuration: 60,
    type: 'meeting',
  },
  aiMessage: 'タスクを作成しました。内容を確認してください。',
};
