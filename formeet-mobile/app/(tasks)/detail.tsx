import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, IconButton, TextInput, Chip } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { useTasks } from '@/hooks/use-tasks';
import { Task, TaskType, TaskPriority } from '@/types/task';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { tasks, updateTask } = useTasks();

  // 既存タスクを取得、なければ新規作成モード
  const existingTask = id ? tasks.find((t) => t.id === id) : null;
  const isNewTask = !existingTask;

  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [duration, setDuration] = useState(
    existingTask?.estimatedDuration?.toString() || '60'
  );
  const [location, setLocation] = useState(existingTask?.location || '');
  const [taskType, setTaskType] = useState<TaskType>(existingTask?.type || 'work');
  const [priority, setPriority] = useState<TaskPriority>(
    existingTask?.priority || 'medium'
  );

  const handleStart = () => {
    if (!existingTask) return;

    if (existingTask.firstStep) {
      router.push(`/(tasks)/first-step?id=${existingTask.id}`);
    } else {
      router.push(`/(tasks)/in-progress?id=${existingTask.id}`);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('エラー', 'タスク名を入力してください');
      return;
    }

    if (isNewTask) {
      // 新規タスク作成のロジック (実装省略)
      Alert.alert('保存しました', 'タスクを作成しました');
    } else if (existingTask) {
      updateTask(existingTask.id, {
        title,
        description,
        estimatedDuration: parseInt(duration, 10),
        location,
        type: taskType,
        priority,
      });
      Alert.alert('保存しました', 'タスクを更新しました');
    }

    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      '削除確認',
      'このタスクを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            // 削除ロジック (実装省略)
            router.back();
          },
        },
      ]
    );
  };

  if (!isNewTask && !existingTask) {
    return (
      <View style={styles.container}>
        <Text>タスクが見つかりません</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {!isNewTask && existingTask && (
          <Card style={styles.statusCard}>
            <Card.Content>
              <View style={styles.statusRow}>
                <View>
                  <Text style={styles.statusLabel}>ステータス</Text>
                  <Text style={styles.statusValue}>
                    {getStatusLabel(existingTask.status)}
                  </Text>
                </View>
                {existingTask.scheduledStart && (
                  <View>
                    <Text style={styles.statusLabel}>予定時刻</Text>
                    <Text style={styles.statusValue}>
                      {formatTime(existingTask.scheduledStart)}
                      {existingTask.scheduledEnd &&
                        ` - ${formatTime(existingTask.scheduledEnd)}`}
                    </Text>
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本情報</Text>

          <TextInput
            label="タスク名 *"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="説明"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <TextInput
            label="所要時間 (分)"
            value={duration}
            onChangeText={setDuration}
            mode="outlined"
            keyboardType="number-pad"
            style={styles.input}
          />

          <TextInput
            label="場所"
            value={location}
            onChangeText={setLocation}
            mode="outlined"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>タイプ</Text>
          <View style={styles.chipGroup}>
            {(['work', 'meeting', 'routine', 'travel'] as TaskType[]).map((type) => (
              <Chip
                key={type}
                selected={taskType === type}
                onPress={() => setTaskType(type)}
                style={styles.chip}
              >
                {getTaskTypeLabel(type)}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>優先度</Text>
          <View style={styles.chipGroup}>
            {(['high', 'medium', 'low'] as TaskPriority[]).map((p) => (
              <Chip
                key={p}
                selected={priority === p}
                onPress={() => setPriority(p)}
                style={styles.chip}
              >
                {getPriorityLabel(p)}
              </Chip>
            ))}
          </View>
        </View>

        {!isNewTask && existingTask?.notes && existingTask.notes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>メモ</Text>
            {existingTask.notes.map((note, index) => (
              <Text key={index} style={styles.noteItem}>
                • {note}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.footer}>
        {!isNewTask && existingTask && existingTask.status === 'pending' && (
          <Button
            mode="contained"
            style={styles.startButton}
            onPress={handleStart}
          >
            開始
          </Button>
        )}

        <View style={styles.footerActions}>
          <Button mode="outlined" onPress={handleSave} style={styles.saveButton}>
            保存
          </Button>

          {!isNewTask && (
            <Button
              mode="text"
              onPress={handleDelete}
              textColor={FormeetTheme.colors.error}
            >
              削除
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: '未着手',
    in_progress: '進行中',
    completed: '完了',
    paused: '中断',
  };
  return labels[status] || status;
}

function getTaskTypeLabel(type: TaskType): string {
  const labels: Record<TaskType, string> = {
    work: '作業',
    meeting: '会議',
    routine: 'ルーティン',
    travel: '移動',
  };
  return labels[type];
}

function getPriorityLabel(priority: TaskPriority): string {
  const labels: Record<TaskPriority, string> = {
    high: '高',
    medium: '中',
    low: '低',
  };
  return labels[priority];
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
    flex: 1,
    backgroundColor: FormeetTheme.colors.background.subtle,
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    margin: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusLabel: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  statusValue: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.text.primary,
  },
  section: {
    paddingHorizontal: FormeetTheme.spacing.md,
    marginTop: FormeetTheme.spacing.lg,
  },
  sectionTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  input: {
    marginBottom: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: FormeetTheme.spacing.sm,
  },
  chip: {
    marginRight: FormeetTheme.spacing.xs,
  },
  noteItem: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  bottomSpacer: {
    height: 150,
  },
  footer: {
    backgroundColor: FormeetTheme.colors.background.default,
    padding: FormeetTheme.spacing.md,
    ...FormeetTheme.elevation.level2,
  },
  startButton: {
    backgroundColor: FormeetTheme.colors.success,
    marginBottom: FormeetTheme.spacing.md,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    marginRight: FormeetTheme.spacing.sm,
  },
});
