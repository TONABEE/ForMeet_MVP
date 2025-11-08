import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, ProgressBar, RadioButton, Switch } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormeetTheme } from '@/constants/theme';

/**
 * ONB_02_AudioSetup - 音声・通知設定画面
 * 
 * Phase 1 オンボーディング (3/8)
 * 目的: 音声ガイド・通知・バイブレーションの設定
 * 
 * コンポーネントマッピング準拠:
 * - Toggle: 音声ガイドON/OFF
 * - Radio: 音声タイプ（女性/男性/合成音）
 * - Range: 音量調整（0-100%）
 * - Toggle: バイブレーションON/OFF
 * - Radio: 強度（弱/標準/強）
 * - Button: "テスト通知"
 * - Progress indicator: 3/8
 */
export default function AudioSetup() {
  const router = useRouter();
  const progress = 3 / 8;

  const [voiceGuide, setVoiceGuide] = useState(true);
  const [voiceType, setVoiceType] = useState('female');
  const [volume, setVolume] = useState(0.75);
  const [vibration, setVibration] = useState(true);
  const [vibrationIntensity, setVibrationIntensity] = useState('medium');

  const handleNext = () => {
    // TODO: 設定を保存
    router.push('/(onboarding)/calendar-sync');
  };

  const handleBack = () => {
    router.back();
  };

  const handleTestNotification = () => {
    // TODO: テスト通知を表示
    alert('通知のテストです');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <ProgressBar progress={progress} style={styles.progressBar} />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text variant="headlineMedium" style={styles.title}>
            音声・通知の設定
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            AI秘書の声と通知方法を設定します
          </Text>

          {/* 音声ガイド */}
          <View style={styles.section}>
            <View style={styles.toggleRow}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                音声ガイド
              </Text>
              <Switch
                value={voiceGuide}
                onValueChange={setVoiceGuide}
                color={FormeetTheme.colors.primary}
              />
            </View>
          </View>

          {/* 音声タイプ */}
          {voiceGuide && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                音声タイプ
              </Text>
              <RadioButton.Group onValueChange={setVoiceType} value={voiceType}>
                <View style={styles.radioItem}>
                  <RadioButton.Android value="female" color={FormeetTheme.colors.primary} />
                  <Text variant="bodyLarge" style={styles.radioLabel}>女性</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton.Android value="male" color={FormeetTheme.colors.primary} />
                  <Text variant="bodyLarge" style={styles.radioLabel}>男性</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton.Android value="synthetic" color={FormeetTheme.colors.primary} />
                  <Text variant="bodyLarge" style={styles.radioLabel}>合成音</Text>
                </View>
              </RadioButton.Group>
            </View>
          )}

          {/* 音量 */}
          {voiceGuide && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                音量
              </Text>
              <View style={styles.volumeContainer}>
                <Button
                  mode={volume === 0.5 ? 'contained' : 'outlined'}
                  onPress={() => setVolume(0.5)}
                  style={styles.volumeButton}
                  compact
                >
                  小
                </Button>
                <Button
                  mode={volume === 0.75 ? 'contained' : 'outlined'}
                  onPress={() => setVolume(0.75)}
                  style={styles.volumeButton}
                  compact
                >
                  中
                </Button>
                <Button
                  mode={volume === 1.0 ? 'contained' : 'outlined'}
                  onPress={() => setVolume(1.0)}
                  style={styles.volumeButton}
                  compact
                >
                  大
                </Button>
              </View>
            </View>
          )}

          {/* バイブレーション */}
          <View style={styles.section}>
            <View style={styles.toggleRow}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                バイブレーション
              </Text>
              <Switch
                value={vibration}
                onValueChange={setVibration}
                color={FormeetTheme.colors.primary}
              />
            </View>
          </View>

          {/* バイブレーション強度 */}
          {vibration && (
            <View style={styles.section}>
              <RadioButton.Group 
                onValueChange={setVibrationIntensity} 
                value={vibrationIntensity}
              >
                <View style={styles.radioRow}>
                  <View style={styles.radioItem}>
                    <RadioButton.Android value="low" color={FormeetTheme.colors.primary} />
                    <Text variant="bodyMedium" style={styles.radioLabel}>弱</Text>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton.Android value="medium" color={FormeetTheme.colors.primary} />
                    <Text variant="bodyMedium" style={styles.radioLabel}>標準</Text>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton.Android value="high" color={FormeetTheme.colors.primary} />
                    <Text variant="bodyMedium" style={styles.radioLabel}>強</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          )}

          {/* テストボタン */}
          <Button
            mode="outlined"
            onPress={handleTestNotification}
            style={styles.testButton}
            icon="bell-ring"
          >
            テスト通知
          </Button>

          {/* ドット表示 */}
          <View style={styles.dots}>
            {[...Array(8)].map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === 2 && styles.dotActive]}
              />
            ))}
          </View>
        </ScrollView>

        {/* ボタングループ */}
        <View style={styles.buttonContainer}>
          <Button
            mode="text"
            onPress={handleBack}
            style={styles.backButton}
            labelStyle={styles.backButtonLabel}
          >
            ← 戻る
          </Button>
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.nextButton}
            contentStyle={styles.buttonContent}
          >
            次へ
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E6F2FF',
    marginHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: FormeetTheme.colors.text.primary,
    marginBottom: 8,
  },
  description: {
    color: FormeetTheme.colors.text.secondary,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: FormeetTheme.colors.text.primary,
    marginBottom: 12,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioLabel: {
    marginLeft: 8,
    color: FormeetTheme.colors.text.secondary,
  },
  volumeContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-around',
  },
  volumeButton: {
    flex: 1,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  volumeText: {
    minWidth: 50,
    textAlign: 'right',
    color: FormeetTheme.colors.text.secondary,
  },
  testButton: {
    marginVertical: 16,
    borderColor: FormeetTheme.colors.primary,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DFE1E6',
  },
  dotActive: {
    backgroundColor: FormeetTheme.colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
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
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
});
