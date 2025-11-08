import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, ProgressBar, Switch, TextInput } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { useTasks } from '@/hooks/use-tasks';

export default function InProgressScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask } = useTasks();

  const task = tasks.find((t) => t.id === id);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [focusMode, setFocusMode] = useState(true);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (!task) return;

    // タスクを進行中に更新
    updateTask(task.id, { status: 'in_progress' });

    // タイマー開始
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [task?.id]);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>タスクが見つかりません</Text>
      </View>
    );
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const remainingMinutes = Math.max(0, task.estimatedDuration - elapsedMinutes);
  const progress = Math.min(1, elapsedMinutes / task.estimatedDuration);

  const handlePause = () => {
    Alert.alert(
      'タスクを中断',
      '作業を中断しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '中断',
          onPress: () => {
            updateTask(task.id, {
              status: 'paused',
              actualDuration: elapsedMinutes,
            });
            router.back();
          },
        },
      ]
    );
  };

  const handleComplete = () => {
    updateTask(task.id, {
      status: 'completed',
      actualDuration: elapsedMinutes,
    });
    router.replace(`/(tasks)/complete?id=${task.id}&duration=${elapsedMinutes}`);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedNotes = [...(task.notes || []), newNote.trim()];
      updateTask(task.id, { notes: updatedNotes });
      setNewNote('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </View>

        <Card style={styles.timerCard}>
          <Card.Content>
            <Text style={styles.timerLabel}>経過時間</Text>
            <Text style={styles.timerValue}>{formatTime(elapsedSeconds)}</Text>

            <ProgressBar
              progress={progress}
              color={
                progress > 1
                  ? FormeetTheme.colors.warning
                  : FormeetTheme.colors.primary
              }
              style={styles.progressBar}
            />

            <Text style={styles.remainingTime}>
              {remainingMinutes > 0
                ? `あと ${remainingMinutes}分`
                : `${elapsedMinutes - task.estimatedDuration}分超過`}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statusCard}>
          <Card.Content>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Text style={styles.statusBadge}>着手済み</Text>
              </View>
              <View style={styles.focusModeRow}>
                <Text style={styles.focusModeLabel}>集中モード</Text>
                <Switch
                  value={focusMode}
                  onValueChange={setFocusMode}
                  color={FormeetTheme.colors.primary}
                />
              </View>
            </View>
            {focusMode && (
              <Text style={styles.focusModeDescription}>
                通知がミュートされています
              </Text>
            )}
          </Card.Content>
        </Card>

        {task.firstStep && (
          <Card style={styles.firstStepCard}>
            <Card.Content>
              <View style={styles.firstStepHeader}>
                <Text style={styles.firstStepIcon}>💡</Text>
                <Text style={styles.firstStepTitle}>推奨の最初の一歩</Text>
              </View>
              <Text style={styles.firstStepText}>{task.firstStep}</Text>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.notesCard}>
          <Card.Content>
            <Text style={styles.notesTitle}>作業メモ</Text>

            {task.notes && task.notes.length > 0 && (
              <View style={styles.notesList}>
                {task.notes.map((note, index) => (
                  <Text key={index} style={styles.noteItem}>
                    • {note}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.addNoteRow}>
              <TextInput
                value={newNote}
                onChangeText={setNewNote}
                placeholder="メモを追加..."
                mode="outlined"
                style={styles.noteInput}
              />
              <Button
                mode="contained"
                onPress={handleAddNote}
                style={styles.addNoteButton}
                disabled={!newNote.trim()}
              >
                追加
              </Button>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={handlePause}
          style={styles.pauseButton}
          textColor={FormeetTheme.colors.warning}
        >
          中断
        </Button>
        <Button
          mode="contained"
          onPress={handleComplete}
          style={styles.completeButton}
        >
          完了
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
  },
  timerCard: {
    margin: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
    ...FormeetTheme.elevation.level2,
  },
  timerLabel: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
    textAlign: 'center',
    marginBottom: FormeetTheme.spacing.xs,
  },
  timerValue: {
    ...FormeetTheme.typography.heading.h1,
    color: FormeetTheme.colors.primary,
    textAlign: 'center',
    marginBottom: FormeetTheme.spacing.md,
    fontSize: 48,
  },
  progressBar: {
    height: 8,
    borderRadius: FormeetTheme.borderRadius.full,
    marginBottom: FormeetTheme.spacing.md,
  },
  remainingTime: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    textAlign: 'center',
  },
  statusCard: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginBottom: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.success,
    backgroundColor: FormeetTheme.colors.successBackground,
    paddingHorizontal: FormeetTheme.spacing.sm,
    paddingVertical: FormeetTheme.spacing.xs,
    borderRadius: FormeetTheme.borderRadius.sm,
  },
  focusModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FormeetTheme.spacing.sm,
  },
  focusModeLabel: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
  },
  focusModeDescription: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
    marginTop: FormeetTheme.spacing.sm,
  },
  firstStepCard: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginBottom: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.primaryBackground,
    borderWidth: 1,
    borderColor: FormeetTheme.colors.primary,
  },
  firstStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.sm,
  },
  firstStepIcon: {
    fontSize: 24,
    marginRight: FormeetTheme.spacing.sm,
  },
  firstStepTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
  },
  firstStepText: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    lineHeight: 22,
  },
  notesCard: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginBottom: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  notesTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  notesList: {
    marginBottom: FormeetTheme.spacing.md,
  },
  noteItem: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  addNoteRow: {
    flexDirection: 'row',
    gap: FormeetTheme.spacing.sm,
  },
  noteInput: {
    flex: 1,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  addNoteButton: {
    justifyContent: 'center',
    backgroundColor: FormeetTheme.colors.primary,
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
  pauseButton: {
    flex: 1,
    borderColor: FormeetTheme.colors.warning,
  },
  completeButton: {
    flex: 2,
    backgroundColor: FormeetTheme.colors.success,
  },
});
