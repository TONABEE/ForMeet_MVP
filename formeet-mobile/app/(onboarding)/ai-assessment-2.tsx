import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding';
import { FormeetTheme } from '@/constants/theme';

/**
 * ONB_05_AIAssessment2 - AI診断画面 (後半)
 *
 * Phase 1 オンボーディング (6/8)
 * 目的: ユーザーの作業環境・集中パターンを把握
 */

type QuestionKey = 'environment' | 'breakTime' | 'energyTime' | 'interruption';

export default function AIAssessment2() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<QuestionKey, string>>({
    environment: '',
    breakTime: '',
    energyTime: '',
    interruption: '',
  });

  const questions = [
    {
      id: 'environment' as QuestionKey,
      question: 'どんな環境で集中できますか？',
      options: [
        { value: 'quiet', label: '静かな場所' },
        { value: 'noise', label: '適度な雑音がある場所' },
        { value: 'flexible', label: 'どこでも大丈夫' },
      ],
    },
    {
      id: 'breakTime' as QuestionKey,
      question: '休憩の取り方について',
      options: [
        { value: 'regular', label: '定期的に休憩を取る' },
        { value: 'whenTired', label: '疲れたら休む' },
        { value: 'minimal', label: 'あまり休憩しない' },
      ],
    },
    {
      id: 'energyTime' as QuestionKey,
      question: '一番集中できる時間帯は？',
      options: [
        { value: 'morning', label: '午前中' },
        { value: 'afternoon', label: '午後' },
        { value: 'evening', label: '夕方以降' },
      ],
    },
    {
      id: 'interruption' as QuestionKey,
      question: '作業中の中断について',
      options: [
        { value: 'sensitive', label: '中断されるとペースが崩れる' },
        { value: 'ok', label: 'すぐに戻れる' },
        { value: 'flexible', label: 'あまり気にならない' },
      ],
    },
  ];

  const handleAnswerChange = (questionId: QuestionKey, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    router.push('/(onboarding)/ai-tone');
  };

  const isAllAnswered = Object.values(answers).every(answer => answer !== '');

  return (
    <OnboardingLayout
      currentStep={6}
      onNext={handleNext}
      nextDisabled={!isAllAnswered}
    >
      <Text variant="headlineMedium" style={styles.title}>
        あと少しです！
      </Text>

      <Text variant="bodyLarge" style={styles.description}>
        あなたの集中パターンを教えてください（2/2）
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
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
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
});
