import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, SegmentedButtons, FAB } from 'react-native-paper';
import { router } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { TaskCard } from '@/components/task/task-card';
import { useTasks } from '@/hooks/use-tasks';
import { Task, TaskStatus } from '@/types/task';

type FilterType = 'all' | 'pending' | 'completed';

export default function TodayTasksScreen() {
  const { todayTasks, toggleTaskComplete } = useTasks();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTasks = todayTasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  // タスクを時間順にソート
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.scheduledStart || !b.scheduledStart) return 0;
    return a.scheduledStart.getTime() - b.scheduledStart.getTime();
  });

  const pendingCount = todayTasks.filter((t) => t.status !== 'completed').length;
  const completedCount = todayTasks.filter((t) => t.status === 'completed').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>完了</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{pendingCount}</Text>
            <Text style={styles.statLabel}>残り</Text>
          </View>
        </View>
      </View>

      <SegmentedButtons
        value={filter}
        onValueChange={(value) => setFilter(value as FilterType)}
        buttons={[
          {
            value: 'all',
            label: 'すべて',
          },
          {
            value: 'pending',
            label: '未完了',
          },
          {
            value: 'completed',
            label: '完了',
          },
        ]}
        style={styles.segmentedButtons}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.taskList}>
        {sortedTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {filter === 'all'
                ? 'タスクがありません'
                : filter === 'pending'
                ? 'すべて完了しました！'
                : '完了したタスクがありません'}
            </Text>
          </View>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => router.push(`/(tasks)/detail?id=${task.id}`)}
              onToggleComplete={() => toggleTaskComplete(task.id)}
            />
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(tasks)/detail')}
        label="タスク追加"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormeetTheme.colors.background.subtle,
  },
  header: {
    backgroundColor: FormeetTheme.colors.background.default,
    padding: FormeetTheme.spacing.md,
    ...FormeetTheme.elevation.level1,
  },
  dateText: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: FormeetTheme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...FormeetTheme.typography.heading.h2,
    color: FormeetTheme.colors.primary,
  },
  statLabel: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: FormeetTheme.colors.border,
  },
  segmentedButtons: {
    margin: FormeetTheme.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  taskList: {
    paddingHorizontal: FormeetTheme.spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: FormeetTheme.spacing.xxl,
  },
  emptyStateText: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.tertiary,
  },
  bottomSpacer: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    right: FormeetTheme.spacing.md,
    bottom: FormeetTheme.spacing.xl,
    backgroundColor: FormeetTheme.colors.primary,
  },
});
