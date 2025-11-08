import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';
import { MessageBubble } from '@/components/ai/message-bubble';
import { useTasks } from '@/hooks/use-tasks';

interface TimeSlot {
  time: string;
  task?: {
    id: string;
    title: string;
    duration: number;
    type: 'meeting' | 'work' | 'routine' | 'travel';
  };
  isBuffer?: boolean;
}

export default function BufferInsertionScreen() {
  const { todayTasks } = useTasks();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  // タイムラインを生成
  const timeline: TimeSlot[] = [
    { time: '08:00', task: { id: '1', title: '朝食', duration: 30, type: 'routine' } },
    { time: '08:30' },
    { time: '09:00', task: { id: '2', title: 'メール返信', duration: 30, type: 'work' } },
    { time: '09:30' },
    { time: '10:00', task: { id: '3', title: '企画書作成', duration: 120, type: 'work' } },
    { time: '10:30' },
    { time: '11:00' },
    { time: '11:30' },
    { time: '12:00', task: { id: '4', title: 'ランチ', duration: 60, type: 'routine' } },
    { time: '12:30' },
    { time: '13:00' },
    { time: '13:30', task: { id: '5', title: '移動', duration: 30, type: 'travel' } },
    { time: '14:00', task: { id: '6', title: '会議', duration: 60, type: 'meeting' } },
    { time: '14:30' },
    { time: '15:00' },
    { time: '15:30' },
  ];

  const toggleBuffer = (time: string) => {
    setSelectedSlots(prev =>
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const handleConfirm = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <MessageBubble
          message="予定の間に休憩時間を入れましょう。タップして選んでください。"
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>タイムライン</Text>

          <View style={styles.timeline}>
            {timeline.map((slot, index) => (
              <View key={slot.time}>
                {slot.task ? (
                  <TaskBlock task={slot.task} />
                ) : (
                  <EmptySlot
                    time={slot.time}
                    isSelected={selectedSlots.includes(slot.time)}
                    onToggle={() => toggleBuffer(slot.time)}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>サマリー</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>総作業時間:</Text>
              <Text style={styles.summaryValue}>6時間45分</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>休憩時間:</Text>
              <Text style={styles.summaryValue}>
                {selectedSlots.length * 30}分
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          計画を確定
        </Button>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

interface TaskBlockProps {
  task: {
    title: string;
    duration: number;
    type: 'meeting' | 'work' | 'routine' | 'travel';
  };
}

function TaskBlock({ task }: TaskBlockProps) {
  const typeColors = {
    meeting: FormeetTheme.colors.primary,
    work: FormeetTheme.colors.success,
    routine: '#9C27B0',
    travel: FormeetTheme.colors.warning,
  };

  return (
    <View
      style={[
        styles.taskBlock,
        { backgroundColor: typeColors[task.type], height: task.duration },
      ]}
    >
      <Text style={styles.taskBlockTitle}>{task.title}</Text>
      <Text style={styles.taskBlockDuration}>{task.duration}分</Text>
    </View>
  );
}

interface EmptySlotProps {
  time: string;
  isSelected: boolean;
  onToggle: () => void;
}

function EmptySlot({ time, isSelected, onToggle }: EmptySlotProps) {
  return (
    <TouchableOpacity
      style={[
        styles.emptySlot,
        isSelected && styles.emptySlotSelected,
      ]}
      onPress={onToggle}
    >
      <Text style={styles.emptySlotTime}>{time}</Text>
      {isSelected && (
        <Text style={styles.emptySlotLabel}>休憩</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormeetTheme.colors.background.subtle,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: FormeetTheme.spacing.md,
    marginTop: FormeetTheme.spacing.md,
  },
  sectionTitle: {
    ...FormeetTheme.typography.heading.h3,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  timeline: {
    backgroundColor: FormeetTheme.colors.background.default,
    borderRadius: FormeetTheme.borderRadius.md,
    padding: FormeetTheme.spacing.sm,
    ...FormeetTheme.elevation.level1,
  },
  taskBlock: {
    padding: FormeetTheme.spacing.sm,
    marginVertical: FormeetTheme.spacing.xs,
    borderRadius: FormeetTheme.borderRadius.sm,
  },
  taskBlockTitle: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.background.default,
  },
  taskBlockDuration: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.background.default,
    opacity: 0.9,
  },
  emptySlot: {
    height: 30,
    borderWidth: 1,
    borderColor: FormeetTheme.colors.border,
    borderStyle: 'dashed',
    borderRadius: FormeetTheme.borderRadius.sm,
    marginVertical: FormeetTheme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: FormeetTheme.spacing.sm,
  },
  emptySlotSelected: {
    backgroundColor: FormeetTheme.colors.primaryBackground,
    borderColor: FormeetTheme.colors.primary,
    borderStyle: 'solid',
  },
  emptySlotTime: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.text.tertiary,
  },
  emptySlotLabel: {
    ...FormeetTheme.typography.body.small,
    color: FormeetTheme.colors.primary,
  },
  summaryCard: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginTop: FormeetTheme.spacing.lg,
    backgroundColor: FormeetTheme.colors.background.default,
  },
  summaryTitle: {
    ...FormeetTheme.typography.heading.h4,
    color: FormeetTheme.colors.text.primary,
    marginBottom: FormeetTheme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: FormeetTheme.spacing.sm,
  },
  summaryLabel: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
  },
  summaryValue: {
    ...FormeetTheme.typography.body.bold,
    color: FormeetTheme.colors.text.primary,
  },
  confirmButton: {
    marginHorizontal: FormeetTheme.spacing.md,
    marginTop: FormeetTheme.spacing.lg,
    backgroundColor: FormeetTheme.colors.primary,
  },
  bottomSpacer: {
    height: FormeetTheme.spacing.xl,
  },
});
