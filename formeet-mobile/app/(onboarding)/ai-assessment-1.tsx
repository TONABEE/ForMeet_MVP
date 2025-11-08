import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ProgressBar, Button, RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';

/**
 * ONB_04_AIAssessment1 - AI診断画面 (前半)
 * 
 * Phase 1 オンボーディング (5/8)
 * 目的: ユーザーの作業パターンを把握
 */

type QuestionKey = 'taskStart' | 'timeManagement' | 'multitask' | 'planning';

export default function AIAssessment1() {
  const router = useRouter();
  const progress = 5 / 8;
  
  const [answers, setAnswers] = useState<Record<QuestionKey, string>>({
    taskStart: '',
    timeManagement: '',
    multitask: '',
    planning: '',
  });

  const questions = [
    {
      id: 'taskStart' as QuestionKey,
      question: 'タスクに取り掛かるとき、どう感じますか？',
      options: [
        { value: 'easy', label: 'すぐに始められる' },
        { value: 'medium', label: '少し考えてから始める' },
        { value: 'hard', label: 'なかなか始められない' },
      ],
    },
    {
      id: 'timeManagement' as QuestionKey,
      question: '時間管理について、どう感じますか？',
      options: [
        { value: 'good', label: '得意で、予定通りに進められる' },
        { value: 'ok', label: 'だいたいできるが、たまに遅れる' },
        { value: 'bad', label: '苦手で、よく遅れてしまう' },
      ],
    },
    {
      id: 'multitask' as QuestionKey,
      question: '複数のタスクを同時に進めるのは？',
      options: [
        { value: 'good', label: '得意で、効率的にできる' },
        { value: 'ok', label: 'できるが、疲れやすい' },
        { value: 'bad', label: '苦手で、一つずつやりたい' },
      ],
    },
    {
      id: 'planning' as QuestionKey,
      question: '計画を立てることについて',
      options: [
        { value: 'detailed', label: '詳細に計画を立てる' },
        { value: 'rough', label: '大まかに計画を立てる' },
        { value: 'flexible', label: 'その場その場で対応する' },
      ],
    },
  ];

  const handleAnswerChange = (questionId: QuestionKey, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    // 次の診断画面へ
    router.push('/(onboarding)/ai-assessment-2');
  };

  const isAllAnswered = Object.values(answers).every(answer => answer !== '');

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} style={styles.progressBar} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          あなたの働き方を教えてください
        </Text>
        
        <Text variant="bodyLarge" style={styles.description}>
          AIがあなたに最適なサポートを提案します（1/2）
        </Text>

        <View style={styles.questions}>
          {questions.map((q, index) => (
            <View key={q.id} style={styles.questionBlock}>
              <Text variant="titleMedium" style={styles.questionText}>
                {index + 1}. {q.question}
              </Text>
              <RadioButton.Group
                onValueChange={(value) => handleAnswerChange(q.id, value)}
                value={answers[q.id]}
              >
                {q.options.map((option) => (
                  <View key={option.value} style={styles.radioOption}>
                    <RadioButton.Android
                      value={option.value}
                      color={FormeetTheme.colors.primary}
                    />
                    <Text
                      variant="bodyMedium"
                      style={styles.radioLabel}
                      onPress={() => handleAnswerChange(q.id, option.value)}
                    >
                      {option.label}
                    </Text>
                  </View>
                ))}
              </RadioButton.Group>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
          contentStyle={styles.buttonContent}
          disabled={!isAllAnswered}
        >
          次へ
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  progressBar: {
    height: 4,
    backgroundColor: FormeetTheme.colors.primaryBackground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: FormeetTheme.spacing.lg,
    paddingTop: 40,
    paddingBottom: 100,
  },
  title: {
    ...FormeetTheme.typography.heading.h1,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  description: {
    fontSize: 16,
    color: FormeetTheme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: FormeetTheme.spacing.xl,
  },
  questions: {
    gap: FormeetTheme.spacing.xl,
  },
  questionBlock: {
    gap: FormeetTheme.spacing.md,
  },
  questionText: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.sm,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: FormeetTheme.spacing.sm,
  },
  radioLabel: {
    fontSize: 16,
    color: FormeetTheme.colors.text.secondary,
    marginLeft: FormeetTheme.spacing.sm,
    flex: 1,
  },
  buttonContainer: {
    padding: FormeetTheme.spacing.lg,
    backgroundColor: FormeetTheme.colors.background.default,
    borderTopWidth: 1,
    borderTopColor: FormeetTheme.colors.border,
  },
  button: {
    borderRadius: FormeetTheme.borderRadius.md,
  },
  buttonContent: {
    height: 56,
  },
});
