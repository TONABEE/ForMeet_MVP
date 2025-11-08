import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Button,
  Card,
  TextInput,
  RadioButton,
  Menu,
  Divider,
  IconButton,
} from 'react-native-paper';
import { router } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { useTasks } from '@/hooks/use-tasks';

/**
 * REVIEW_00 - 日報生成画面
 *
 * 今日のタスク完了状況からAIが日報を自動生成
 * 宛先と送信方法を選択して送信可能
 */
export default function DailyReportScreen() {
  const { todayTasks } = useTasks();

  // 送信設定
  const [recipient, setRecipient] = useState('上司A');
  const [sendMethod, setSendMethod] = useState<'email' | 'slack'>('email');
  const [showRecipientMenu, setShowRecipientMenu] = useState(false);

  // 編集モード
  const [isEditing, setIsEditing] = useState(false);

  // 日報内容（AI生成されたもの）
  const [reportContent, setReportContent] = useState(generateReport());

  function generateReport() {
    const completed = todayTasks.filter((t) => t.status === 'completed');
    const pending = todayTasks.filter((t) => t.status === 'pending');
    const delayed = todayTasks.filter((t) => t.status === 'paused');

    const today = new Date();
    const dateStr = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    const userName = '田中'; // TODO: ユーザー情報から取得

    let report = `【本日の成果】\n`;

    if (completed.length > 0) {
      completed.forEach((task) => {
        const status = task.actualDuration
          ? task.actualDuration <= task.estimatedDuration
            ? '予定通り完了'
            : `完了（予定より${task.actualDuration - task.estimatedDuration}分超過）`
          : '完了';
        report += `・${task.title}（${status}）\n`;
        if (task.description) {
          report += `  ${task.description}\n`;
        }
      });
    } else {
      report += `・本日の完了タスクはありません\n`;
    }

    report += `\n【課題・遅延】\n`;
    if (delayed.length > 0) {
      delayed.forEach((task) => {
        report += `・${task.title}（未完了）\n`;
        report += `  → 明日の予定に再配置済み\n`;
      });
    } else {
      report += `・特になし\n`;
    }

    report += `\n【明日の予定】\n`;
    // TODO: 明日のタスクを取得
    report += `・週次レポート完成\n`;
    report += `・新規プロジェクト打ち合わせ\n`;

    return report;
  }

  const handleRegenerate = () => {
    Alert.alert('日報を再生成', 'AIが日報を作り直します', [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '再生成',
        onPress: () => {
          setReportContent(generateReport());
          setIsEditing(false);
        },
      },
    ]);
  };

  const handleSaveDraft = () => {
    Alert.alert('下書き保存', '下書きを保存しました');
    router.back();
  };

  const handleSend = () => {
    const methodText = sendMethod === 'email' ? 'メール' : 'Slack';
    Alert.alert(
      '送信確認',
      `${recipient}に${methodText}で送信しますか？`,
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '送信',
          onPress: () => {
            // TODO: 実際の送信処理
            Alert.alert('送信完了', '日報を送信しました', [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]);
          },
        },
      ]
    );
  };

  const today = new Date();
  const dateStr = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  const userName = '田中';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* 設定エリア */}
          <Card style={styles.settingsCard}>
            <Card.Content>
              <Text style={styles.settingLabel}>宛先</Text>
              <Menu
                visible={showRecipientMenu}
                onDismiss={() => setShowRecipientMenu(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setShowRecipientMenu(true)}
                    style={styles.recipientButton}
                    contentStyle={styles.recipientButtonContent}
                    icon="chevron-down"
                  >
                    {recipient}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setRecipient('上司A');
                    setShowRecipientMenu(false);
                  }}
                  title="上司A"
                />
                <Menu.Item
                  onPress={() => {
                    setRecipient('チーム全体');
                    setShowRecipientMenu(false);
                  }}
                  title="チーム全体"
                />
                <Menu.Item
                  onPress={() => {
                    setRecipient('プロジェクトメンバー');
                    setShowRecipientMenu(false);
                  }}
                  title="プロジェクトメンバー"
                />
              </Menu>

              <Text style={[styles.settingLabel, styles.settingLabelSpaced]}>
                送信方法
              </Text>
              <RadioButton.Group
                onValueChange={(value) => setSendMethod(value as 'email' | 'slack')}
                value={sendMethod}
              >
                <View style={styles.radioRow}>
                  <View style={styles.radioItem}>
                    <RadioButton value="email" color={FormeetTheme.colors.primary} />
                    <Text style={styles.radioLabel}>メール</Text>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton value="slack" color={FormeetTheme.colors.primary} />
                    <Text style={styles.radioLabel}>Slack</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </Card.Content>
          </Card>

          {/* 件名 */}
          <Card style={styles.subjectCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>件名</Text>
              <TextInput
                value={`${dateStr} 作業報告（${userName}）`}
                mode="outlined"
                style={styles.subjectInput}
                dense
              />
            </Card.Content>
          </Card>

          {/* 本文エリア */}
          <Card style={styles.contentCard}>
            <Card.Content>
              <View style={styles.contentHeader}>
                <Text style={styles.sectionTitle}>本文</Text>
                <View style={styles.contentActions}>
                  <IconButton
                    icon={isEditing ? 'eye' : 'pencil'}
                    size={20}
                    onPress={() => setIsEditing(!isEditing)}
                    iconColor={FormeetTheme.colors.primary}
                  />
                  <IconButton
                    icon="refresh"
                    size={20}
                    onPress={handleRegenerate}
                    iconColor={FormeetTheme.colors.primary}
                  />
                </View>
              </View>

              {isEditing ? (
                <TextInput
                  value={reportContent}
                  onChangeText={setReportContent}
                  multiline
                  numberOfLines={20}
                  mode="outlined"
                  style={styles.contentInput}
                />
              ) : (
                <View style={styles.contentPreview}>
                  <Text style={styles.contentText}>{reportContent}</Text>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* AI秘書からのアドバイス */}
          <Card style={styles.adviceCard}>
            <Card.Content>
              <View style={styles.adviceHeader}>
                <Text style={styles.adviceIcon}>💡</Text>
                <Text style={styles.adviceTitle}>AI秘書からのアドバイス</Text>
              </View>
              <Text style={styles.adviceText}>
                今日は予定していたタスクの80%を完了しました。お疲れ様でした！
                {'\n'}
                明日は重要な打ち合わせがあるので、準備時間を確保することをお勧めします。
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* フッター */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={handleSaveDraft}
          style={styles.draftButton}
          textColor={FormeetTheme.colors.text.secondary}
        >
          下書き保存
        </Button>
        <Button
          mode="contained"
          onPress={handleSend}
          style={styles.sendButton}
          icon="send"
        >
          送信する
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormeetTheme.colors.background.subtle,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: FormeetTheme.spacing.md,
  },
  settingsCard: {
    marginBottom: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  settingLabel: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.sm,
  },
  settingLabelSpaced: {
    marginTop: FormeetTheme.spacing.md,
  },
  recipientButton: {
    marginBottom: FormeetTheme.spacing.sm,
    borderColor: FormeetTheme.colors.border,
  },
  recipientButtonContent: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
  },
  radioRow: {
    flexDirection: 'row',
    gap: FormeetTheme.spacing.lg,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    marginLeft: -FormeetTheme.spacing.xs,
  },
  subjectCard: {
    marginBottom: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  sectionTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.sm,
  },
  subjectInput: {
    backgroundColor: FormeetTheme.colors.background.default,
  },
  contentCard: {
    marginBottom: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.sm,
  },
  contentActions: {
    flexDirection: 'row',
    gap: FormeetTheme.spacing.xs,
  },
  contentInput: {
    backgroundColor: FormeetTheme.colors.background.default,
    minHeight: 300,
    textAlignVertical: 'top',
    fontFamily: 'monospace',
  },
  contentPreview: {
    minHeight: 300,
    padding: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.subtle,
    borderRadius: FormeetTheme.borderRadius.sm,
  },
  contentText: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    lineHeight: 24,
    fontFamily: 'monospace',
  },
  adviceCard: {
    marginBottom: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.primaryBackground,
    borderWidth: 1,
    borderColor: FormeetTheme.colors.primary,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.sm,
  },
  adviceIcon: {
    fontSize: 24,
    marginRight: FormeetTheme.spacing.sm,
  },
  adviceTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
  },
  adviceText: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    gap: FormeetTheme.spacing.md,
    padding: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
    ...FormeetTheme.elevation.level2,
  },
  draftButton: {
    flex: 1,
    borderColor: FormeetTheme.colors.border,
  },
  sendButton: {
    flex: 2,
    backgroundColor: FormeetTheme.colors.primary,
  },
});
