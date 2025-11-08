import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox, IconButton } from 'react-native-paper';
import { FormeetTheme } from '@/constants/theme';
import { Task, TaskType } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onToggleComplete?: () => void;
  showCheckbox?: boolean;
  compact?: boolean;
}

const taskTypeColors: Record<TaskType, string> = {
  meeting: FormeetTheme.colors.primary,
  work: FormeetTheme.colors.success,
  routine: '#9C27B0',
  travel: FormeetTheme.colors.warning,
};

export function TaskCard({
  task,
  onPress,
  onToggleComplete,
  showCheckbox = true,
  compact = false,
}: TaskCardProps) {
  const typeColor = taskTypeColors[task.type];
  const isCompleted = task.status === 'completed';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        compact && styles.compactContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.colorBar, { backgroundColor: typeColor }]} />

      <View style={styles.content}>
        {showCheckbox && (
          <Checkbox
            status={isCompleted ? 'checked' : 'unchecked'}
            onPress={onToggleComplete}
            color={FormeetTheme.colors.primary}
          />
        )}

        <View style={styles.info}>
          <Text
            style={[
              styles.title,
              isCompleted && styles.completedText,
              compact && styles.compactTitle,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>

          {!compact && task.scheduledStart && (
            <View style={styles.timeContainer}>
              <IconButton
                icon="clock-outline"
                size={16}
                style={styles.timeIcon}
              />
              <Text style={styles.timeText}>
                {formatTime(task.scheduledStart)}
                {task.scheduledEnd && ` - ${formatTime(task.scheduledEnd)}`}
              </Text>
              <Text style={styles.durationText}>
                ({task.estimatedDuration}分)
              </Text>
            </View>
          )}

          {compact && (
            <Text style={styles.compactDuration}>
              {task.estimatedDuration}分
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: FormeetTheme.colors.background.default,
    borderRadius: FormeetTheme.borderRadius.md,
    marginBottom: FormeetTheme.spacing.sm,
    ...FormeetTheme.elevation.level1,
    overflow: 'hidden',
  },
  compactContainer: {
    marginBottom: FormeetTheme.spacing.xs,
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: FormeetTheme.spacing.sm,
  },
  info: {
    flex: 1,
  },
  title: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  compactTitle: {
    ...FormeetTheme.typography.body.regular,
    marginBottom: 0,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: FormeetTheme.colors.text.tertiary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    margin: 0,
    marginRight: -4,
  },
  timeText: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.secondary,
  },
  durationText: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
    marginLeft: FormeetTheme.spacing.xs,
  },
  compactDuration: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
  },
});
