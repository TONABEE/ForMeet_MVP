import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, RadioButton, Switch, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { OnboardingLayout } from '@/components/onboarding';

/**
 * ONB_01_VisualSetup - 視覚設定画面
 * 
 * Phase 1 オンボーディング (2/8)
 * 目的: フォントサイズ・カラーモード・色覚サポートの設定
 * 
 * コンポーネントマッピング (08_コンポーネントマッピング表_Atlassian.md 準拠):
 * - Heading (H2): "見やすさの設定"
 * - Radio: フォントサイズ選択（標準/大きめ/特大）
 * - Radio: カラーモード（ライト/ダーク/自動）
 * - Toggle: 色覚サポートON/OFF
 * - Section message: プレビュー表示
 * - Button (Primary): "次へ"
 * - Button (Subtle): "← 戻る"
 * - Progress indicator: 2/8
 */
export default function VisualSetup() {
  const router = useRouter();

  const [fontSize, setFontSize] = useState('medium');
  const [colorMode, setColorMode] = useState('light');
  const [colorBlindSupport, setColorBlindSupport] = useState(false);

  const handleNext = () => {
    // TODO: 設定を保存
    router.push('/(onboarding)/audio-setup');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <OnboardingLayout
      currentStep={2}
      onNext={handleNext}
      onBack={handleBack}
    >
        {/* ヘッダー */}
        <Text variant="headlineMedium" style={styles.title}>
          見やすさの設定
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          あなたに合った表示設定を選んでください
        </Text>

        {/* フォントサイズ設定 */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            フォントサイズ
          </Text>
          <RadioButton.Group onValueChange={setFontSize} value={fontSize}>
            <View style={styles.radioItem}>
              <RadioButton.Android value="small" color={FormeetTheme.colors.primary} />
              <Text variant="bodyLarge" style={styles.radioLabel}>標準</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton.Android value="medium" color={FormeetTheme.colors.primary} />
              <Text variant="bodyLarge" style={styles.radioLabel}>大きめ</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton.Android value="large" color={FormeetTheme.colors.primary} />
              <Text variant="bodyLarge" style={styles.radioLabel}>特大</Text>
            </View>
          </RadioButton.Group>
        </View>

        {/* カラーモード設定 */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            カラーモード
          </Text>
          <RadioButton.Group onValueChange={setColorMode} value={colorMode}>
            <View style={styles.radioItem}>
              <RadioButton.Android value="light" color={FormeetTheme.colors.primary} />
              <Text variant="bodyLarge" style={styles.radioLabel}>ライト</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton.Android value="dark" color={FormeetTheme.colors.primary} />
              <Text variant="bodyLarge" style={styles.radioLabel}>ダーク</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton.Android value="auto" color={FormeetTheme.colors.primary} />
              <Text variant="bodyLarge" style={styles.radioLabel}>自動</Text>
            </View>
          </RadioButton.Group>
        </View>

        {/* 色覚サポート */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                色覚サポート
              </Text>
              <Text variant="bodySmall" style={styles.toggleDescription}>
                色の見分けがつきやすくなります
              </Text>
            </View>
            <Switch
              value={colorBlindSupport}
              onValueChange={setColorBlindSupport}
              color={FormeetTheme.colors.primary}
            />
          </View>
        </View>

        {/* プレビューセクション */}
        <Surface style={styles.previewSection} elevation={1}>
          <Text variant="titleSmall" style={styles.previewTitle}>
            💬 プレビュー
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.previewText,
              fontSize === 'small' && { fontSize: 14 },
              fontSize === 'medium' && { fontSize: 16 },
              fontSize === 'large' && { fontSize: 18 },
            ]}
          >
            このように表示されます
          </Text>
        </Surface>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    ...FormeetTheme.typography.heading.h2,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.sm,
  },
  description: {
    color: FormeetTheme.colors.text.secondary,
    marginBottom: FormeetTheme.spacing.xl,
  },
  section: {
    marginBottom: FormeetTheme.spacing.xl,
  },
  sectionTitle: {
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
    fontWeight: '600',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: FormeetTheme.spacing.sm,
  },
  radioLabel: {
    marginLeft: FormeetTheme.spacing.sm,
    color: FormeetTheme.colors.text.secondary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    flex: 1,
    marginRight: FormeetTheme.spacing.md,
  },
  toggleDescription: {
    color: FormeetTheme.colors.text.tertiary,
    marginTop: 4,
  },
  previewSection: {
    backgroundColor: FormeetTheme.colors.primaryBackground,
    borderRadius: FormeetTheme.borderRadius.md,
    padding: FormeetTheme.spacing.md,
    marginBottom: FormeetTheme.spacing.xl,
  },
  previewTitle: {
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.sm,
    fontWeight: '600',
  },
  previewText: {
    color: FormeetTheme.colors.text.secondary,
  },
});
