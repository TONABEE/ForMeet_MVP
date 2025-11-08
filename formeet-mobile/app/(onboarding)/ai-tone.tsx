import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, RadioButton, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding';
import { FormeetTheme } from '@/constants/theme';

/**
 * ONB_06_AITone - AI秘書のトーン選択画面
 *
 * Phase 1 オンボーディング (7/8)
 * 目的: AIアシスタントのコミュニケーションスタイルを設定
 */

type ToneType = 'polite' | 'casual' | 'concise';

export default function AITone() {
  const router = useRouter();

  const [selectedTone, setSelectedTone] = useState<ToneType | ''>('');

  const tones = [
    {
      value: 'polite' as ToneType,
      title: '丁寧',
      description: 'です・ます調で優しくサポート',
      example: 'お疲れさまです。次のタスクに取り組む準備はできていますか？',
    },
    {
      value: 'casual' as ToneType,
      title: 'カジュアル',
      description: '親しみやすい口調でサポート',
      example: 'おつかれ！次のタスク、そろそろ始めようか？',
    },
    {
      value: 'concise' as ToneType,
      title: '簡潔',
      description: '必要最小限の情報のみ',
      example: '次のタスク：資料作成（所要時間：30分）',
    },
  ];

  const handleNext = () => {
    router.push('/(onboarding)/complete');
  };

  return (
    <OnboardingLayout
      currentStep={7}
      onNext={handleNext}
      nextDisabled={!selectedTone}
    >
      <Text variant="headlineMedium" style={styles.title}>
        AI秘書の話し方を選択
      </Text>

      <Text variant="bodyLarge" style={styles.description}>
        あなたに合ったコミュニケーションスタイルを選んでください
      </Text>

      <RadioButton.Group
        onValueChange={(value) => setSelectedTone(value as ToneType)}
        value={selectedTone}
      >
        <View style={styles.toneOptions}>
          {tones.map((tone) => (
            <Card
              key={tone.value}
              style={[
                styles.toneCard,
                selectedTone === tone.value && styles.toneCardSelected
              ]}
              onPress={() => setSelectedTone(tone.value)}
            >
              <Card.Content>
                <View style={styles.toneHeader}>
                  <View style={styles.toneHeaderLeft}>
                    <Text variant="titleLarge" style={styles.toneTitle}>
                      {tone.title}
                    </Text>
                    <Text variant="bodyMedium" style={styles.toneDescription}>
                      {tone.description}
                    </Text>
                  </View>
                  <RadioButton.Android
                    value={tone.value}
                    color={FormeetTheme.colors.primary}
                  />
                </View>

                <View style={styles.exampleBox}>
                  <Text variant="labelSmall" style={styles.exampleLabel}>
                    例:
                  </Text>
                  <Text variant="bodyMedium" style={styles.exampleText}>
                    {tone.example}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </RadioButton.Group>

      <View style={styles.infoBox}>
        <Text variant="bodySmall" style={styles.infoText}>
          後からいつでも変更できます
        </Text>
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
  toneOptions: {
    gap: FormeetTheme.spacing.md,
    marginBottom: FormeetTheme.spacing.lg,
  },
  toneCard: {
    backgroundColor: FormeetTheme.colors.background.default,
    borderWidth: 2,
    borderColor: FormeetTheme.colors.border,
  },
  toneCardSelected: {
    borderColor: FormeetTheme.colors.primary,
    backgroundColor: FormeetTheme.colors.primaryBackground,
  },
  toneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: FormeetTheme.spacing.md,
  },
  toneHeaderLeft: {
    flex: 1,
    marginRight: FormeetTheme.spacing.md,
  },
  toneTitle: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  toneDescription: {
    fontSize: 14,
    color: FormeetTheme.colors.text.tertiary,
  },
  exampleBox: {
    backgroundColor: FormeetTheme.colors.background.subtle,
    padding: FormeetTheme.spacing.md,
    borderRadius: FormeetTheme.borderRadius.md,
  },
  exampleLabel: {
    fontSize: 12,
    color: FormeetTheme.colors.text.tertiary,
    marginBottom: FormeetTheme.spacing.xs,
    textTransform: 'uppercase',
  },
  exampleText: {
    fontSize: 14,
    color: FormeetTheme.colors.text.primary,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: FormeetTheme.colors.primaryBackground,
    padding: FormeetTheme.spacing.md,
    borderRadius: FormeetTheme.borderRadius.md,
  },
  infoText: {
    fontSize: 14,
    color: FormeetTheme.colors.text.primary,
    lineHeight: 20,
  },
});
