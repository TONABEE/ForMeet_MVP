import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { MessageBubble } from '@/components/ai/message-bubble';
import { useTasks } from '@/hooks/use-tasks';

export default function FirstStepScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks } = useTasks();

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>タスクが見つかりません</Text>
      </View>
    );
  }

  const handleStart = () => {
    router.replace(`/(tasks)/in-progress?id=${task.id}`);
  };

  const handleSkip = () => {
    router.replace(`/(tasks)/in-progress?id=${task.id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDuration}>
            予定時間: {task.estimatedDuration}分
          </Text>
        </View>

        <MessageBubble
          message="タスクを始める前に、最初の一歩を確認しましょう。"
        />

        <Card style={styles.firstStepCard}>
          <Card.Content>
            <View style={styles.lightBulbIcon}>
              <Text style={styles.lightBulbEmoji}>💡</Text>
            </View>
            <Text style={styles.firstStepTitle}>推奨の最初の一歩</Text>
            <Text style={styles.firstStepText}>
              {task.firstStep || 'まずは必要な資料を開いて確認しましょう'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text style={styles.tipsTitle}>集中するためのヒント</Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  集中モードをオンにすると通知が来なくなります
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  タイマーは目安です。焦らず進めましょう
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  疲れたら中断して休憩を取ってOKです
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {task.notes && task.notes.length > 0 && (
          <Card style={styles.notesCard}>
            <Card.Content>
              <Text style={styles.notesTitle}>作業メモ</Text>
              {task.notes.map((note, index) => (
                <Text key={index} style={styles.noteItem}>
                  • {note}
                </Text>
              ))}
            </Card.Content>
          </Card>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={handleSkip} style={styles.skipButton}>
          スキップ
        </Button>
        <Button
          mode="contained"
          onPress={handleStart}
          style={styles.startButton}
        >
          タスクを開始
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
  header: {
    backgroundColor: FormeetTheme.colors.background.default,
    padding: FormeetTheme.spacing.md,
    ...FormeetTheme.elevation.level1,
  },
  taskTitle: {
    ...FormeetTheme.typography.heading.h2,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  taskDuration: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
  },
  firstStepCard: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginTop: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.primaryBackground,
    borderWidth: 2,
    borderColor: FormeetTheme.colors.primary,
  },
  lightBulbIcon: {
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.sm,
  },
  lightBulbEmoji: {
    fontSize: 48,
  },
  firstStepTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: FormeetTheme.spacing.md,
  },
  firstStepText: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  tipsCard: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginTop: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  tipsTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  tipsList: {
    gap: FormeetTheme.spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.primary,
    marginRight: FormeetTheme.spacing.sm,
  },
  tipText: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    flex: 1,
  },
  notesCard: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginTop: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  notesTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  noteItem: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  bottomSpacer: {
    height: 100,
  },
  footer: {
    flexDirection: 'row',
    gap: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
    padding: FormeetTheme.spacing.md,
    ...FormeetTheme.elevation.level2,
  },
  skipButton: {
    flex: 1,
  },
  startButton: {
    flex: 2,
    backgroundColor: FormeetTheme.colors.success,
  },
});
