import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { MessageBubble } from '@/components/ai/message-bubble';
import { useTasks } from '@/hooks/use-tasks';
import { Task } from '@/types/task';

type TaskChoice = 'do' | 'later' | 'skip';

export default function MorningPromptScreen() {
  const { tasks } = useTasks();
  const [choices, setChoices] = useState<Record<string, TaskChoice>>({});

  // 未配置タスクをAIが推奨
  const suggestedTasks = tasks.filter(task => !task.scheduledStart).slice(0, 5);
  const selectedCount = Object.values(choices).filter(c => c === 'do').length;

  const handleChoice = (taskId: string, choice: TaskChoice) => {
    setChoices(prev => ({ ...prev, [taskId]: choice }));
  };

  const handleConfirm = () => {
    router.push('/(planning)/task-selection');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.timeHeader}>
          <Text style={styles.timeText}>
            {new Date().toLocaleTimeString('ja-JP', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <MessageBubble
          message="おはようございます！今日の計画を立てましょう。AIが提案します。やるものを選んでください。"
        />

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {selectedCount}/{suggestedTasks.length} タスク選択済み
          </Text>
        </View>

        {suggestedTasks.map((task) => (
          <TaskChoiceCard
            key={task.id}
            task={task}
            choice={choices[task.id]}
            onChoice={(choice) => handleChoice(task.id, choice)}
          />
        ))}

        <Button
          mode="contained"
          style={styles.confirmButton}
          onPress={handleConfirm}
          disabled={selectedCount === 0}
        >
          計画を確定
        </Button>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

interface TaskChoiceCardProps {
  task: Task;
  choice?: TaskChoice;
  onChoice: (choice: TaskChoice) => void;
}

function TaskChoiceCard({ task, choice, onChoice }: TaskChoiceCardProps) {
  return (
    <Card style={styles.taskCard}>
      <Card.Content>
        <Text style={styles.taskTitle}>{task.title}</Text>
        {task.description && (
          <Text style={styles.taskDescription}>{task.description}</Text>
        )}
        <Text style={styles.taskDuration}>{task.estimatedDuration}分</Text>

        <View style={styles.choiceButtons}>
          <Chip
            selected={choice === 'do'}
            onPress={() => onChoice('do')}
            style={[
              styles.choiceChip,
              choice === 'do' && styles.choiceChipSelected,
            ]}
            textStyle={choice === 'do' && styles.choiceChipTextSelected}
          >
            やる
          </Chip>
          <Chip
            selected={choice === 'later'}
            onPress={() => onChoice('later')}
            style={[
              styles.choiceChip,
              choice === 'later' && styles.choiceChipLater,
            ]}
          >
            後で
          </Chip>
          <Chip
            selected={choice === 'skip'}
            onPress={() => onChoice('skip')}
            style={[
              styles.choiceChip,
              choice === 'skip' && styles.choiceChipSkip,
            ]}
          >
            不要
          </Chip>
        </View>
      </Card.Content>
    </Card>
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
  timeHeader: {
    alignItems: 'center',
    paddingVertical: FormeetTheme.spacing.md,
  },
  timeText: {
    ...FormeetTheme.typography.heading.h2,
    color: FormeetTheme.colors.text.primary,
  },
  progressContainer: {
    paddingHorizontal: FormeetTheme.spacing.md,
    paddingVertical: FormeetTheme.spacing.sm,
  },
  progressText: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.primary,
    textAlign: 'center',
  },
  taskCard: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginBottom: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  taskTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  taskDescription: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  taskDuration: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
    marginBottom: FormeetTheme.spacing.md,
  },
  choiceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: FormeetTheme.spacing.sm,
  },
  choiceChip: {
    flex: 1,
    borderColor: FormeetTheme.colors.border,
  },
  choiceChipSelected: {
    backgroundColor: FormeetTheme.colors.primary,
  },
  choiceChipTextSelected: {
    color: FormeetTheme.colors.background.default,
  },
  choiceChipLater: {
    backgroundColor: FormeetTheme.colors.warning,
  },
  choiceChipSkip: {
    backgroundColor: FormeetTheme.colors.text.tertiary,
  },
  confirmButton: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginTop: FormeetTheme.spacing.lg,
    backgroundColor: FormeetTheme.colors.primary,
  },
  bottomSpacer: {
    height: FormeetTheme.spacing.xl,
  },
});
