import React from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';

/**
 * 音声入力成功画面
 *
 * タスク追加が完了したことを確認する画面
 * 追加されたタスクのプレビューを表示
 */
export default function SuccessScreen() {
  const handleGoHome = () => {
    // ホーム画面に戻る（モーダルを完全に閉じる）
    router.dismissAll();
    router.replace('/(tabs)');
  };

  const handleContinue = () => {
    // 続けて追加
    router.replace('/(voice)/listening');
  };

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleGoHome} />

        <View style={styles.container}>
          <View style={styles.content}>
            {/* 成功アイコン */}
            <View style={styles.successIconContainer}>
              <View style={styles.successIconCircle}>
                <IconButton
                  icon="check"
                  size={60}
                  iconColor={FormeetTheme.colors.background.default}
                />
              </View>
            </View>

            {/* 確認メッセージ */}
            <Text style={styles.title}>カレンダーに追加しました</Text>

            {/* 追加されたタスクのプレビュー */}
            <Card style={styles.previewCard}>
              <Card.Content>
                <Text style={styles.previewDate}>11月9日（土）</Text>

                <View style={styles.taskBlock}>
                  <View style={styles.timelineDot} />
                  <View style={styles.taskItem}>
                    <Text style={styles.taskTime}>13:30</Text>
                    <Text style={styles.taskTitle}>準備時間</Text>
                    <Text style={styles.taskDuration}>30分・自動</Text>
                  </View>
                </View>

                <View style={styles.taskBlock}>
                  <View style={[styles.timelineDot, styles.timelineDotPrimary]} />
                  <View style={styles.taskItem}>
                    <Text style={styles.taskTime}>14:00</Text>
                    <Text style={styles.taskTitle}>会議</Text>
                    <Text style={styles.taskDuration}>1時間</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* アクションボタン */}
            <Button
              mode="contained"
              onPress={handleGoHome}
              style={styles.homeButton}
              contentStyle={styles.buttonContent}
              icon="home"
            >
              ホームに戻る
            </Button>

            <Button
              mode="outlined"
              onPress={handleContinue}
              style={styles.continueButton}
              contentStyle={styles.buttonContent}
              textColor={FormeetTheme.colors.primary}
              icon="plus"
            >
              続けて追加
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
  content: {
    padding: FormeetTheme.spacing.xl,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: FormeetTheme.spacing.lg,
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: FormeetTheme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    ...FormeetTheme.elevation.level2,
  },
  title: {
    ...FormeetTheme.typography.heading.h2,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.xl,
    textAlign: 'center',
  },
  previewCard: {
    width: '100%',
    marginBottom: FormeetTheme.spacing.xl,
    backgroundColor: FormeetTheme.colors.background.subtle,
  },
  previewDate: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  taskBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: FormeetTheme.spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: FormeetTheme.colors.text.tertiary,
    marginTop: 6,
    marginRight: FormeetTheme.spacing.sm,
  },
  timelineDotPrimary: {
    backgroundColor: FormeetTheme.colors.primary,
  },
  taskItem: {
    flex: 1,
  },
  taskTime: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.text.secondary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  taskTitle: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  taskDuration: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
  },
  homeButton: {
    width: '100%',
    backgroundColor: FormeetTheme.colors.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  continueButton: {
    width: '100%',
    borderColor: FormeetTheme.colors.primary,
  },
  buttonContent: {
    paddingVertical: FormeetTheme.spacing.sm,
  },
});
