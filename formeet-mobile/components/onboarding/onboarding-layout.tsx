import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { ProgressBar, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormeetTheme } from '@/constants/theme';
import { ProgressIndicatorDots } from './progress-indicator-dots';

/**
 * OnboardingLayout - オンボーディング画面共通レイアウト
 *
 * Phase 1 オンボーディング共通コンポーネント
 *
 * 機能:
 * - プログレスバー（上部）
 * - スクロール可能なコンテンツエリア
 * - 進捗ドット表示
 * - 戻る/次へボタン（下部固定）
 *
 * レイアウトパターン:
 * - StandardScreen: プログレスバー + コンテンツ + ボタングループ
 */

interface OnboardingLayoutProps {
  /** 現在のステップ（1-8） */
  currentStep: number;
  /** メインコンテンツ */
  children: React.ReactNode;
  /** 次へボタンのコールバック */
  onNext?: () => void;
  /** 戻るボタンのコールバック（未指定の場合、ボタン非表示） */
  onBack?: () => void;
  /** 次へボタンのラベル（デフォルト: "次へ"） */
  nextLabel?: string;
  /** 次へボタンの無効化 */
  nextDisabled?: boolean;
  /** 進捗ドットを表示するか（デフォルト: true） */
  showDots?: boolean;
  /** コンテンツのスタイル */
  contentStyle?: ViewStyle;
}

export function OnboardingLayout({
  currentStep,
  children,
  onNext,
  onBack,
  nextLabel = '次へ',
  nextDisabled = false,
  showDots = true,
  contentStyle,
}: OnboardingLayoutProps) {
  const progress = currentStep / 8;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* プログレスバー */}
        <ProgressBar
          progress={progress}
          style={styles.progressBar}
          color={FormeetTheme.colors.primary}
        />

        {/* スクロール可能コンテンツ */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}

          {/* 進捗ドット */}
          {showDots && (
            <View style={styles.dotsContainer}>
              <ProgressIndicatorDots
                currentStep={currentStep - 1}
                totalSteps={8}
              />
            </View>
          )}
        </ScrollView>

        {/* ボタングループ */}
        {(onNext || onBack) && (
          <View style={styles.buttonContainer}>
            {onBack && (
              <Button
                mode="text"
                onPress={onBack}
                style={styles.backButton}
                labelStyle={styles.backButtonLabel}
              >
                ← 戻る
              </Button>
            )}
            {onNext && (
              <Button
                mode="contained"
                onPress={onNext}
                style={[styles.nextButton, !onBack && styles.nextButtonFull]}
                contentStyle={styles.buttonContent}
                disabled={nextDisabled}
              >
                {nextLabel}
              </Button>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  content: {
    flex: 1,
    paddingTop: FormeetTheme.spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: FormeetTheme.colors.primaryBackground,
    marginHorizontal: FormeetTheme.spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: FormeetTheme.spacing.lg,
    paddingTop: FormeetTheme.spacing.lg,
    paddingBottom: FormeetTheme.spacing.md,
  },
  dotsContainer: {
    marginTop: FormeetTheme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: FormeetTheme.spacing.lg,
    paddingVertical: FormeetTheme.spacing.md,
    gap: FormeetTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: FormeetTheme.colors.border,
  },
  backButton: {
    flex: 1,
  },
  backButtonLabel: {
    color: FormeetTheme.colors.text.tertiary,
  },
  nextButton: {
    flex: 2,
    borderRadius: FormeetTheme.borderRadius.md,
  },
  nextButtonFull: {
    flex: 1,
  },
  buttonContent: {
    height: 48,
  },
});
