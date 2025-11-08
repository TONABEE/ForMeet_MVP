import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FormeetTheme } from '@/constants/theme';

/**
 * ProgressIndicatorDots - オンボーディング用進捗ドット
 *
 * Phase 1 オンボーディング共通コンポーネント
 *
 * @param currentStep - 現在のステップ（0始まり）
 * @param totalSteps - 総ステップ数（デフォルト: 8）
 *
 * コンポーネントマッピング:
 * - Atlassian Design System: Progress indicator (Dots variant)
 * - React Native Paper: カスタム実装
 */

interface ProgressIndicatorDotsProps {
  currentStep: number;
  totalSteps?: number;
}

export function ProgressIndicatorDots({
  currentStep,
  totalSteps = 8
}: ProgressIndicatorDotsProps) {
  return (
    <View style={styles.container}>
      {[...Array(totalSteps)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentStep && styles.dotActive
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: FormeetTheme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: FormeetTheme.colors.border,
  },
  dotActive: {
    backgroundColor: FormeetTheme.colors.primary,
  },
});
