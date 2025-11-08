import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ProgressBar } from 'react-native-paper';
import { router } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { MessageBubble } from '@/components/ai/message-bubble';

interface RoutineStep {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
}

const MORNING_ROUTINE: RoutineStep[] = [
  { id: '1', title: '朝食', description: '朝食をとりましょう', estimatedMinutes: 20 },
  { id: '2', title: '身支度', description: '歯磨き・着替え', estimatedMinutes: 15 },
  { id: '3', title: '持ち物確認', description: '忘れ物チェック', estimatedMinutes: 5 },
  { id: '4', title: '出発準備', description: '最終確認', estimatedMinutes: 5 },
];

export default function TaskSelectionScreen() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const currentStep = MORNING_ROUTINE[currentStepIndex];
  const isLastStep = currentStepIndex === MORNING_ROUTINE.length - 1;
  const progress = (currentStepIndex + 1) / MORNING_ROUTINE.length;

  const departureTime = new Date();
  departureTime.setHours(9, 0, 0); // 9:00 AM
  const now = new Date();
  const minutesUntilDeparture = Math.floor(
    (departureTime.getTime() - now.getTime()) / (1000 * 60)
  );

  const handleComplete = () => {
    setCompletedSteps([...completedSteps, currentStep.id]);

    if (isLastStep) {
      router.push('/(planning)/buffer-insertion');
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleSkip = () => {
    if (isLastStep) {
      router.push('/(planning)/buffer-insertion');
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleEndRoutine = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>朝のルーティン</Text>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownLabel}>出発まで</Text>
          <Text style={styles.countdownTime}>{minutesUntilDeparture}分</Text>
        </View>
      </View>

      <ProgressBar
        progress={progress}
        color={FormeetTheme.colors.primary}
        style={styles.progressBar}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.stepIndicator}>
          {MORNING_ROUTINE.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.stepDot,
                index <= currentStepIndex && styles.stepDotActive,
                completedSteps.includes(step.id) && styles.stepDotCompleted,
              ]}
            />
          ))}
        </View>

        <View style={styles.currentStepContainer}>
          <Text style={styles.currentStepTitle}>{currentStep.title}</Text>
          <Text style={styles.currentStepDescription}>
            {currentStep.description}
          </Text>
          <Text style={styles.recommendedTime}>
            推奨時間: {currentStep.estimatedMinutes}分
          </Text>
        </View>

        {currentStepIndex < MORNING_ROUTINE.length - 1 && (
          <View style={styles.nextStepContainer}>
            <Text style={styles.nextStepLabel}>次:</Text>
            <Text style={styles.nextStepTitle}>
              {MORNING_ROUTINE[currentStepIndex + 1].title}
            </Text>
          </View>
        )}

        <MessageBubble
          message="焦らなくて大丈夫です。一つずつ進めましょう。"
          showAvatar={false}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={handleSkip}
          style={styles.skipButton}
        >
          スキップ
        </Button>
        <Button
          mode="contained"
          onPress={handleComplete}
          style={styles.completeButton}
        >
          完了
        </Button>
      </View>

      <Button
        mode="text"
        onPress={handleEndRoutine}
        style={styles.endRoutineButton}
        labelStyle={styles.endRoutineButtonText}
      >
        ルーティンを終了
      </Button>
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
  headerTitle: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.sm,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: FormeetTheme.spacing.xs,
  },
  countdownLabel: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
  },
  countdownTime: {
    ...FormeetTheme.typography.heading.h2,
    color: FormeetTheme.colors.primary,
  },
  progressBar: {
    height: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: FormeetTheme.spacing.md,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: FormeetTheme.spacing.sm,
    marginVertical: FormeetTheme.spacing.lg,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: FormeetTheme.borderRadius.full,
    backgroundColor: FormeetTheme.colors.border,
  },
  stepDotActive: {
    backgroundColor: FormeetTheme.colors.primary,
  },
  stepDotCompleted: {
    backgroundColor: FormeetTheme.colors.success,
  },
  currentStepContainer: {
    backgroundColor: FormeetTheme.colors.background.default,
    borderRadius: FormeetTheme.borderRadius.md,
    padding: FormeetTheme.spacing.lg,
    marginBottom: FormeetTheme.spacing.md,
    ...FormeetTheme.elevation.level2,
  },
  currentStepTitle: {
    ...FormeetTheme.typography.heading.h2,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.sm,
  },
  currentStepDescription: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    marginBottom: FormeetTheme.spacing.md,
  },
  recommendedTime: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.primary,
  },
  nextStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FormeetTheme.spacing.xs,
    marginBottom: FormeetTheme.spacing.md,
    padding: FormeetTheme.spacing.md,
  },
  nextStepLabel: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
  },
  nextStepTitle: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    gap: FormeetTheme.spacing.md,
    padding: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
    ...FormeetTheme.elevation.level1,
  },
  skipButton: {
    flex: 1,
  },
  completeButton: {
    flex: 2,
    backgroundColor: FormeetTheme.colors.success,
  },
  endRoutineButton: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginBottom: FormeetTheme.spacing.sm,
  },
  endRoutineButtonText: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
  },
});
