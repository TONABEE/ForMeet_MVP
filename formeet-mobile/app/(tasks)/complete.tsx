import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { MessageBubble } from '@/components/ai/message-bubble';
import { useTasks } from '@/hooks/use-tasks';

export default function CompleteScreen() {
  const { id, duration } = useLocalSearchParams<{ id: string; duration: string }>();
  const { tasks } = useTasks();

  const task = tasks.find((t) => t.id === id);
  const actualDuration = parseInt(duration || '0', 10);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>タスクが見つかりません</Text>
      </View>
    );
  }

  const estimatedDuration = task.estimatedDuration;
  const difference = actualDuration - estimatedDuration;
  const isOnTime = difference <= 0;

  const getMessage = () => {
    if (isOnTime) {
      return `お疲れ様でした。予定より${Math.abs(difference)}分早く終わりました！`;
    }
    return `お疲れ様でした。予定より${difference}分かかりましたが、完了できました！`;
  };

  // 次のタスクを探す
  const nextTask = tasks.find(
    (t) => t.status === 'pending' && t.id !== task.id && t.scheduledStart
  );

  const handleHome = () => {
    router.replace('/(tabs)');
  };

  const handleNextTask = () => {
    if (nextTask) {
      router.replace(`/(tasks)/detail?id=${nextTask.id}`);
    } else {
      handleHome();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.checkMark}>✓</Text>
        </View>

        <Text style={styles.title}>完了しました！</Text>

        <Card style={styles.resultCard}>
          <Card.Content>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>実績時間:</Text>
              <Text style={styles.resultValue}>{actualDuration}分</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>予定時間:</Text>
              <Text style={styles.resultValue}>{estimatedDuration}分</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>差分:</Text>
              <Text
                style={[
                  styles.resultValue,
                  isOnTime ? styles.resultValueGood : styles.resultValueOver,
                ]}
              >
                {isOnTime ? '-' : '+'}
                {Math.abs(difference)}分
              </Text>
            </View>
          </Card.Content>
        </Card>

        <MessageBubble message={getMessage()} />

        {nextTask && (
          <Card style={styles.nextTaskCard}>
            <Card.Content>
              <Text style={styles.nextTaskLabel}>次のタスク</Text>
              <Text style={styles.nextTaskTitle}>{nextTask.title}</Text>
              {nextTask.scheduledStart && (
                <Text style={styles.nextTaskTime}>
                  {nextTask.scheduledStart.toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  開始予定
                </Text>
              )}
            </Card.Content>
          </Card>
        )}
      </View>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={handleHome} style={styles.homeButton}>
          ホームに戻る
        </Button>
        {nextTask && (
          <Button
            mode="contained"
            onPress={handleNextTask}
            style={styles.nextButton}
          >
            次のタスクへ
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormeetTheme.colors.background.subtle,
  },
  content: {
    flex: 1,
    padding: FormeetTheme.spacing.md,
    justifyContent: 'center',
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.lg,
  },
  checkMark: {
    fontSize: 80,
    color: FormeetTheme.colors.success,
  },
  title: {
    ...FormeetTheme.typography.heading.h1,
    color: FormeetTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: FormeetTheme.spacing.xl,
  },
  resultCard: {
    backgroundColor: FormeetTheme.colors.background.default,
    marginBottom: FormeetTheme.spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: FormeetTheme.spacing.sm,
  },
  resultLabel: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
  },
  resultValue: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.text.primary,
  },
  resultValueGood: {
    color: FormeetTheme.colors.success,
  },
  resultValueOver: {
    color: FormeetTheme.colors.warning,
  },
  nextTaskCard: {
    backgroundColor: FormeetTheme.colors.primaryBackground,
    marginTop: FormeetTheme.spacing.md,
    borderWidth: 1,
    borderColor: FormeetTheme.colors.primary,
  },
  nextTaskLabel: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  nextTaskTitle: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  nextTaskTime: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
  },
  footer: {
    padding: FormeetTheme.spacing.md,
    gap: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
    ...FormeetTheme.elevation.level2,
  },
  homeButton: {
    borderColor: FormeetTheme.colors.primary,
  },
  nextButton: {
    backgroundColor: FormeetTheme.colors.primary,
  },
});
