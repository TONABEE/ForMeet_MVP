import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, FAB } from 'react-native-paper';
import { router } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { MessageBubble } from '@/components/ai/message-bubble';
import { TaskCard } from '@/components/task/task-card';
import { useTasks } from '@/hooks/use-tasks';

export default function HomeScreen() {
  const { todayTasks, unscheduledTasks, completedCount, toggleTaskComplete } = useTasks();

  const greeting = getGreeting();
  const aiMessage = getAIMessage(todayTasks.length);

  const quickActions = [
    {
      id: 'plan',
      title: '今日の計画',
      icon: 'calendar-check',
      color: FormeetTheme.colors.primary,
      onPress: () => router.push('/(planning)/morning-prompt'),
    },
    {
      id: 'task',
      title: 'タスク追加',
      icon: 'plus-circle',
      color: FormeetTheme.colors.success,
      onPress: () => router.push('/(tasks)/detail'),
    },
    {
      id: 'review',
      title: '振り返り',
      icon: 'chart-line',
      color: FormeetTheme.colors.warning,
      onPress: () => {}, // Phase 2
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('ja-JP', {
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </Text>
        </View>

        {/* AI Greeting */}
        <MessageBubble message={`${greeting}\n${aiMessage}`} />

        {/* Today's Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>今日の予定</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{todayTasks.length}</Text>
                <Text style={styles.summaryLabel}>タスク</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{completedCount}</Text>
                <Text style={styles.summaryLabel}>完了</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {Math.floor(
                    todayTasks.reduce((acc, task) => acc + task.estimatedDuration, 0) / 60
                  )}
                  h
                </Text>
                <Text style={styles.summaryLabel}>予定時間</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>クイックアクション</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { borderColor: action.color }]}
                onPress={action.onPress}
              >
                <View
                  style={[styles.quickActionIcon, { backgroundColor: action.color }]}
                >
                  <Text style={styles.quickActionIconText}>
                    {action.icon.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Task Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>今日のタスク</Text>
            <TouchableOpacity onPress={() => router.push('/(tasks)/today')}>
              <Text style={styles.seeAllText}>すべて見る</Text>
            </TouchableOpacity>
          </View>

          {todayTasks.slice(0, 3).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => router.push(`/(tasks)/detail?id=${task.id}`)}
              onToggleComplete={() => toggleTaskComplete(task.id)}
            />
          ))}
        </View>

        {/* Unscheduled Tasks Preview */}
        {unscheduledTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>未配置タスク</Text>
            {unscheduledTasks.slice(0, 2).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                compact
                showCheckbox={false}
                onPress={() => router.push(`/(tasks)/detail?id=${task.id}`)}
              />
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="microphone"
        style={styles.fab}
        onPress={() => {}}
        color={FormeetTheme.colors.background.default}
      />
    </View>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'おはようございます';
  if (hour < 18) return 'こんにちは';
  return 'こんばんは';
}

function getAIMessage(taskCount: number): string {
  if (taskCount > 5) {
    return '今日は予定が多い日ですね。無理せず進めましょう。';
  }
  if (taskCount === 0) {
    return '今日は予定がありません。リラックスできる日ですね。';
  }
  return '今日も一緒に頑張りましょう！';
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
    paddingHorizontal: FormeetTheme.spacing.md,
    paddingTop: FormeetTheme.spacing.xl,
    paddingBottom: FormeetTheme.spacing.sm,
  },
  date: {
    ...FormeetTheme.typography.heading.h2,
    color: FormeetTheme.colors.text.primary,
  },
  summaryCard: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginVertical: FormeetTheme.spacing.sm,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  summaryTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...FormeetTheme.typography.heading.h2,
    color: FormeetTheme.colors.primary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  summaryLabel: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
  },
  section: {
    paddingHorizontal: FormeetTheme.spacing.md,
    marginTop: FormeetTheme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.md,
  },
  sectionTitle: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  seeAllText: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.primary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: FormeetTheme.colors.background.default,
    borderRadius: FormeetTheme.borderRadius.md,
    padding: FormeetTheme.spacing.md,
    marginHorizontal: FormeetTheme.spacing.xs,
    alignItems: 'center',
    borderWidth: 2,
    ...FormeetTheme.elevation.level1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: FormeetTheme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: FormeetTheme.spacing.sm,
  },
  quickActionIconText: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.background.default,
  },
  quickActionTitle: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.secondary,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    right: FormeetTheme.spacing.md,
    bottom: FormeetTheme.spacing.xl,
    backgroundColor: FormeetTheme.colors.primary,
  },
});
