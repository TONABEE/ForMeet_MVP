import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Text, Button, Card, IconButton, Switch, TextInput, Checkbox } from 'react-native-paper';
import { router } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { useTasks } from '@/hooks/use-tasks';

/**
 * VOICE_02 - 音声入力確認画面
 *
 * AIが音声から抽出した情報を表示し、確認・編集できる
 * 準備時間や場所などの追加情報を入力可能
 */
export default function ConfirmationScreen() {
  const { addTask } = useTasks();

  // 音声から抽出された情報（デモ用）
  const [taskInfo, setTaskInfo] = useState({
    title: '会議',
    date: '11月9日（土）',
    time: '14:00',
    duration: 60, // 分
    includePreparation: true,
    preparationTime: 30, // 分
    location: '',
  });

  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);

  const handleRetry = () => {
    router.replace('/(voice)/listening');
  };

  const handleAdd = () => {
    // タスクを追加
    const newTask = {
      title: taskInfo.title,
      description: taskInfo.location ? `場所: ${taskInfo.location}` : '',
      scheduledStart: new Date(`2024-11-09T14:00:00`), // デモ用の日時
      scheduledEnd: new Date(`2024-11-09T15:00:00`),
      estimatedDuration: taskInfo.duration,
      status: 'pending' as const,
      priority: 'medium' as const,
      type: 'meeting' as const,
      notes: taskInfo.location ? [`場所: ${taskInfo.location}`] : undefined,
    };

    addTask(newTask);

    // 準備時間も追加する場合
    if (taskInfo.includePreparation) {
      const prepTask = {
        title: `${taskInfo.title}の準備`,
        description: '準備時間（自動生成）',
        scheduledStart: new Date(`2024-11-09T13:30:00`),
        scheduledEnd: new Date(`2024-11-09T14:00:00`),
        estimatedDuration: taskInfo.preparationTime,
        status: 'pending' as const,
        priority: 'medium' as const,
        type: 'work' as const,
        notes: ['自動生成'],
      };
      addTask(prepTask);
    }

    // 完了画面へ遷移
    router.replace('/(voice)/success');
  };

  const handleClose = () => {
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
            <Text style={styles.headerTitle}>確認</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={handleClose}
              iconColor={FormeetTheme.colors.text.tertiary}
            />
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
              {/* AI秘書のメッセージ */}
              <View style={styles.messageContainer}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarIcon}>🤖</Text>
                </View>
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>
                    {taskInfo.date}{taskInfo.time}に「{taskInfo.title}」を追加しますね
                  </Text>
                </View>
              </View>

              {/* 抽出情報カード */}
              <Card style={styles.infoCard}>
                <Card.Content>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📅</Text>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>日時</Text>
                      <Text style={styles.infoValue}>
                        {taskInfo.date} {taskInfo.time}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📝</Text>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>タイトル</Text>
                      <Text style={styles.infoValue}>{taskInfo.title}</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>⏱️</Text>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>所要時間</Text>
                      <Text style={styles.infoValue}>
                        {taskInfo.duration}分（推測）
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>

              {/* 追加質問エリア */}
              <Card style={styles.questionsCard}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>追加情報</Text>

                  {/* 準備時間 */}
                  <View style={styles.questionRow}>
                    <View style={styles.questionHeader}>
                      <Checkbox
                        status={taskInfo.includePreparation ? 'checked' : 'unchecked'}
                        onPress={() =>
                          setTaskInfo({
                            ...taskInfo,
                            includePreparation: !taskInfo.includePreparation,
                          })
                        }
                        color={FormeetTheme.colors.primary}
                      />
                      <Text style={styles.questionText}>準備時間も追加しますか？</Text>
                    </View>
                    {taskInfo.includePreparation && (
                      <Text style={styles.questionSubtext}>
                        {taskInfo.preparationTime}分前に準備を開始
                      </Text>
                    )}
                  </View>

                  {/* 場所 */}
                  <View style={styles.questionRow}>
                    <Text style={styles.questionText}>場所はありますか？</Text>
                    <TextInput
                      value={taskInfo.location}
                      onChangeText={(text) =>
                        setTaskInfo({ ...taskInfo, location: text })
                      }
                      placeholder="例: 会議室A"
                      mode="outlined"
                      style={styles.locationInput}
                      dense
                    />
                  </View>
                </Card.Content>
              </Card>

              {/* もう一度言うボタン */}
              <Button
                mode="text"
                onPress={handleRetry}
                style={styles.retryButton}
                icon="microphone"
                textColor={FormeetTheme.colors.text.tertiary}
              >
                もう一度言う
              </Button>
            </View>
          </ScrollView>

          {/* 追加ボタン */}
          <View style={styles.footer}>
            <Button
              mode="contained"
              onPress={handleAdd}
              style={styles.addButton}
              contentStyle={styles.addButtonContent}
              icon="check"
            >
              追加する
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
    maxHeight: '85%',
    backgroundColor: FormeetTheme.colors.background.default,
    borderRadius: FormeetTheme.borderRadius.lg,
    ...FormeetTheme.elevation.level3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: FormeetTheme.spacing.lg,
    paddingRight: FormeetTheme.spacing.sm,
    paddingTop: FormeetTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: FormeetTheme.colors.border,
  },
  headerTitle: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: FormeetTheme.spacing.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: FormeetTheme.spacing.lg,
    alignItems: 'flex-start',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: FormeetTheme.colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: FormeetTheme.spacing.sm,
  },
  avatarIcon: {
    fontSize: 24,
  },
  messageBubble: {
    flex: 1,
    backgroundColor: FormeetTheme.colors.background.subtle,
    padding: FormeetTheme.spacing.md,
    borderRadius: FormeetTheme.borderRadius.md,
  },
  messageText: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.primary,
    lineHeight: 22,
  },
  infoCard: {
    marginBottom: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
    borderWidth: 1,
    borderColor: FormeetTheme.colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.md,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: FormeetTheme.spacing.md,
    width: 30,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
    marginBottom: FormeetTheme.spacing.xs,
  },
  infoValue: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.text.primary,
  },
  questionsCard: {
    marginBottom: FormeetTheme.spacing.md,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  sectionTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  questionRow: {
    marginBottom: FormeetTheme.spacing.lg,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: FormeetTheme.spacing.xs,
  },
  questionText: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
    marginBottom: FormeetTheme.spacing.sm,
  },
  questionSubtext: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
    marginLeft: 40,
  },
  locationInput: {
    backgroundColor: FormeetTheme.colors.background.default,
  },
  retryButton: {
    alignSelf: 'center',
    marginTop: FormeetTheme.spacing.sm,
  },
  footer: {
    padding: FormeetTheme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: FormeetTheme.colors.border,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  addButton: {
    backgroundColor: FormeetTheme.colors.primary,
  },
  addButtonContent: {
    paddingVertical: FormeetTheme.spacing.sm,
  },
});
