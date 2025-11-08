import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';

/**
 * VOICE_00 - 音声入力開始画面
 *
 * モーダルで表示される音声入力の開始画面
 * マイクボタンをタップすると音声認識が開始される
 */
export default function VoiceInputScreen() {
  const handleStartListening = () => {
    router.push('/(voice)/listening');
  };

  const handleClose = () => {
    router.back();
  };

  const handleTextInput = () => {
    // テキスト入力モードに切り替え
    // TODO: テキスト入力用の画面またはダイアログを実装
    router.back();
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={styles.container}>
          <View style={styles.header}>
            <IconButton
              icon="close"
              size={24}
              onPress={handleClose}
              iconColor={FormeetTheme.colors.text.tertiary}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <IconButton
                icon="microphone"
                size={80}
                iconColor={FormeetTheme.colors.primary}
                containerColor={FormeetTheme.colors.primaryBackground}
                style={styles.micIcon}
              />
            </View>

            <Text style={styles.title}>音声で予定を追加</Text>
            <Text style={styles.description}>
              例: 「明日14時に会議」{'\n'}
              「今週金曜日10時から資料作成」
            </Text>

            <Button
              mode="contained"
              onPress={handleStartListening}
              style={styles.startButton}
              contentStyle={styles.startButtonContent}
              icon="microphone"
            >
              タップして話す
            </Button>

            <Button
              mode="text"
              onPress={handleTextInput}
              style={styles.textInputButton}
              textColor={FormeetTheme.colors.text.tertiary}
            >
              テキストで入力
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: FormeetTheme.colors.background.default,
    borderRadius: FormeetTheme.borderRadius.lg,
    ...FormeetTheme.elevation.level3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: FormeetTheme.spacing.sm,
    paddingRight: FormeetTheme.spacing.sm,
  },
  content: {
    padding: FormeetTheme.spacing.xl,
    paddingTop: FormeetTheme.spacing.md,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: FormeetTheme.spacing.lg,
  },
  micIcon: {
    width: 120,
    height: 120,
  },
  title: {
    ...FormeetTheme.typography.heading.h2,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.tertiary,
    textAlign: 'center',
    marginBottom: FormeetTheme.spacing.xl,
    lineHeight: 22,
  },
  startButton: {
    width: '100%',
    backgroundColor: FormeetTheme.colors.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  startButtonContent: {
    paddingVertical: FormeetTheme.spacing.sm,
  },
  textInputButton: {
    marginBottom: FormeetTheme.spacing.sm,
  },
});
