import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormeetTheme } from '@/constants/theme';

/**
 * ONB_00_Welcome - ウェルカム画面
 * 
 * Phase 1 オンボーディング (1/8)
 * 目的: ユーザーにFormeetの価値を伝え、設定フローへ誘導
 * 
 * コンポーネントマッピング (08_コンポーネントマッピング表_Atlassian.md 準拠):
 * - Heading (H1): "Formeetへようこそ"
 * - Text (Body): 説明文
 * - Image: メインビジュアル
 * - Button (Primary, Large): "はじめる"
 * - Progress indicator: 1/8
 */
export default function Welcome() {
  const router = useRouter();
  const progress = 1 / 8; // ステップ1/8

  const handleStart = () => {
    router.push('/(onboarding)/visual-setup');
  };

  return (
    <View style={styles.container}>
      {/* プログレスインジケーター - 上部固定 */}
      <ProgressBar progress={progress} style={styles.progressBar} />
      
      {/* メインコンテンツ - 画面中央に配置 */}
      <View style={styles.contentWrapper}>
        <View style={styles.mainContent}>
          {/* ロゴ・イラスト */}
          <View style={styles.logoPlaceholder}>
            <Text variant="headlineMedium" style={styles.logoText}>
              Formeet
            </Text>
          </View>

          {/* タイトル - この位置が画面中心 */}
          <Text variant="displayMedium" style={styles.title}>
            Formeetへようこそ
          </Text>

          {/* 説明文 */}
          <Text variant="bodyLarge" style={styles.description}>
            認知特性に合わせたAI秘書が{'\n'}
            あなたの日常をサポートします
          </Text>

          {/* ドット表示（1/8） */}
          <View style={styles.dots}>
            {[...Array(8)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === 0 && styles.dotActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* CTAボタン */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleStart}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            はじめる
          </Button>
        </View>
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
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  mainContent: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 40,
    backgroundColor: FormeetTheme.colors.primary,
    borderRadius: FormeetTheme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.xl,
  },
  logoText: {
    color: FormeetTheme.colors.background.default,
    fontWeight: '700',
  },
  title: {
    ...FormeetTheme.typography.heading.h1,
    textAlign: 'center',
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: FormeetTheme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: FormeetTheme.spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    gap: FormeetTheme.spacing.sm,
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
  buttonContainer: {
    paddingBottom: 0,
  },
  button: {
    borderRadius: FormeetTheme.borderRadius.md,
  },
  buttonContent: {
    height: 56, // Large button
  },
});
