import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding';
import { FormeetTheme } from '@/constants/theme';

/**
 * ONB_07_Complete - 設定完了画面
 *
 * Phase 1 オンボーディング (8/8)
 * 目的: 設定完了を祝福し、Formeetの利用を開始
 */

export default function Complete() {
  const router = useRouter();

  const handleStart = () => {
    // メインアプリへ遷移（今後実装）
    router.replace('/');
  };

  return (
    <OnboardingLayout
      currentStep={8}
      onNext={handleStart}
      nextLabel="Formeetを始める"
      showDots={false}
    >
      {/* アイコン/イラスト */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>✨</Text>
        </View>
      </View>

      <Text variant="headlineLarge" style={styles.title}>
        設定完了！
      </Text>

      <Text variant="bodyLarge" style={styles.description}>
        あなた専用のAI秘書が準備できました
      </Text>

      {/* 設定サマリー */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            あなたの設定
          </Text>

          <View style={styles.summaryItem}>
            <Text variant="bodyMedium" style={styles.summaryLabel}>
              視覚設定:
            </Text>
            <Chip compact style={styles.chip}>標準サイズ・ライトモード</Chip>
          </View>

          <View style={styles.summaryItem}>
            <Text variant="bodyMedium" style={styles.summaryLabel}>
              音声ガイド:
            </Text>
            <Chip compact style={styles.chip}>女性・中音量</Chip>
          </View>

          <View style={styles.summaryItem}>
            <Text variant="bodyMedium" style={styles.summaryLabel}>
              カレンダー:
            </Text>
            <Chip compact style={styles.chip}>連携済み</Chip>
          </View>

          <View style={styles.summaryItem}>
            <Text variant="bodyMedium" style={styles.summaryLabel}>
              AI診断:
            </Text>
            <Chip compact style={styles.chip}>完了</Chip>
          </View>

          <View style={styles.summaryItem}>
            <Text variant="bodyMedium" style={styles.summaryLabel}>
              話し方:
            </Text>
            <Chip compact style={styles.chip}>丁寧</Chip>
          </View>
        </Card.Content>
      </Card>

      {/* 次のステップ */}
      <View style={styles.nextSteps}>
        <Text variant="titleMedium" style={styles.nextStepsTitle}>
          これからできること
        </Text>

        <View style={styles.stepItem}>
          <Text style={styles.stepIcon}>📅</Text>
          <View style={styles.stepContent}>
            <Text variant="bodyMedium" style={styles.stepTitle}>
              タスクを追加
            </Text>
            <Text variant="bodySmall" style={styles.stepDesc}>
              AIが最適なタイミングを提案します
            </Text>
          </View>
        </View>

        <View style={styles.stepItem}>
          <Text style={styles.stepIcon}>🎯</Text>
          <View style={styles.stepContent}>
            <Text variant="bodyMedium" style={styles.stepTitle}>
              ルーティン作成
            </Text>
            <Text variant="bodySmall" style={styles.stepDesc}>
              毎日の流れをスムーズにします
            </Text>
          </View>
        </View>

        <View style={styles.stepItem}>
          <Text style={styles.stepIcon}>📊</Text>
          <View style={styles.stepContent}>
            <Text variant="bodyMedium" style={styles.stepTitle}>
              振り返り
            </Text>
            <Text variant="bodySmall" style={styles.stepDesc}>
              あなたの成長を可視化します
            </Text>
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.lg,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: FormeetTheme.colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: FormeetTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: FormeetTheme.spacing.md,
  },
  description: {
    fontSize: 18,
    color: FormeetTheme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: FormeetTheme.spacing.xxl,
  },
  summaryCard: {
    backgroundColor: FormeetTheme.colors.background.subtle,
    marginBottom: FormeetTheme.spacing.xl,
    elevation: 0,
  },
  summaryTitle: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.md,
  },
  summaryLabel: {
    fontSize: 16,
    color: FormeetTheme.colors.text.tertiary,
    width: 120,
  },
  chip: {
    backgroundColor: FormeetTheme.colors.primary,
  },
  nextSteps: {
    gap: FormeetTheme.spacing.md,
  },
  nextStepsTitle: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: FormeetTheme.spacing.md,
  },
  stepIcon: {
    fontSize: 32,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  stepDesc: {
    fontSize: 14,
    color: FormeetTheme.colors.text.tertiary,
    lineHeight: 20,
  },
});
