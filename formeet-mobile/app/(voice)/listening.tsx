import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';

/**
 * VOICE_01 - 音声認識中画面
 *
 * マイクがアクティブで音声を認識している状態
 * 認識されたテキストをリアルタイムで表示
 * 波形アニメーションで音声レベルを視覚化
 */
export default function ListeningScreen() {
  const [recognizedText, setRecognizedText] = useState('聞いています...');
  const [isListening, setIsListening] = useState(true);

  // 波形アニメーション用
  const [waveAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // 波形アニメーションを開始
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    // デモ用: 2秒後に認識テキストを表示
    const textTimer = setTimeout(() => {
      setRecognizedText('明日14時に会議');
    }, 2000);

    // デモ用: 5秒後に自動的に次の画面へ
    const autoTimer = setTimeout(() => {
      handleStop();
    }, 5000);

    return () => {
      animation.stop();
      clearTimeout(textTimer);
      clearTimeout(autoTimer);
    };
  }, []);

  const handleStop = () => {
    setIsListening(false);
    router.replace('/(voice)/confirmation');
  };

  const handleClose = () => {
    router.back();
  };

  const waveScale = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const waveOpacity = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

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
            {/* マイクアイコンと波形 */}
            <View style={styles.micContainer}>
              <Animated.View
                style={[
                  styles.waveRing,
                  styles.waveRing1,
                  {
                    transform: [{ scale: waveScale }],
                    opacity: waveOpacity,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveRing,
                  styles.waveRing2,
                  {
                    transform: [
                      {
                        scale: waveAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1.2, 1.5],
                        }),
                      },
                    ],
                    opacity: waveAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 0.4],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveRing,
                  styles.waveRing3,
                  {
                    transform: [
                      {
                        scale: waveAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1.4, 1.7],
                        }),
                      },
                    ],
                    opacity: waveAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.1, 0.2],
                    }),
                  },
                ]}
              />

              <View style={styles.micIconWrapper}>
                <IconButton
                  icon="microphone"
                  size={60}
                  iconColor={FormeetTheme.colors.background.default}
                  style={styles.micIcon}
                />
              </View>
            </View>

            {/* 認識中テキスト */}
            <View style={styles.textContainer}>
              <Text style={styles.recognizedText}>{recognizedText}</Text>
              {isListening && <Text style={styles.listeningIndicator}>●</Text>}
            </View>

            <Text style={styles.hint}>話し終わったら停止ボタンを押してください</Text>

            {/* 停止ボタン */}
            <Button
              mode="contained"
              onPress={handleStop}
              style={styles.stopButton}
              contentStyle={styles.stopButtonContent}
              buttonColor={FormeetTheme.colors.error}
              icon="stop"
            >
              停止
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
  micContainer: {
    position: 'relative',
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.xl,
  },
  waveRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: FormeetTheme.colors.primary,
  },
  waveRing1: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  waveRing2: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  waveRing3: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  micIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: FormeetTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...FormeetTheme.elevation.level2,
  },
  micIcon: {
    margin: 0,
  },
  textContainer: {
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.lg,
    paddingHorizontal: FormeetTheme.spacing.md,
  },
  recognizedText: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: FormeetTheme.spacing.sm,
  },
  listeningIndicator: {
    ...FormeetTheme.typography.heading.h2,
    color: FormeetTheme.colors.error,
    fontSize: 20,
  },
  hint: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
    textAlign: 'center',
    marginBottom: FormeetTheme.spacing.xl,
  },
  stopButton: {
    width: '100%',
    marginBottom: FormeetTheme.spacing.sm,
  },
  stopButtonContent: {
    paddingVertical: FormeetTheme.spacing.sm,
  },
});
