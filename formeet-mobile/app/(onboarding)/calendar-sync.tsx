import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ProgressBar, Button, Card, Switch } from 'react-native-paper';
import { useRouter } from 'expo-router';

/**
 * ONB_03_CalendarSync - カレンダー連携画面
 * 
 * Phase 1 オンボーディング (4/8)
 * 目的: カレンダー連携でスケジュール管理を最適化
 */
export default function CalendarSync() {
  const router = useRouter();
  const progress = 4 / 8;
  
  const [googleCalendar, setGoogleCalendar] = useState(false);
  const [appleCalendar, setAppleCalendar] = useState(false);

  const handleNext = () => {
    router.push('/(onboarding)/ai-assessment-1');
  };

  const handleSkip = () => {
    router.push('/(onboarding)/ai-assessment-1');
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} style={styles.progressBar} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          カレンダーを連携
        </Text>
        
        <Text variant="bodyLarge" style={styles.description}>
          予定に合わせてタスクを自動調整します
        </Text>

        <View style={styles.calendarOptions}>
          <Card style={styles.calendarCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text variant="titleMedium" style={styles.calendarName}>
                  Googleカレンダー
                </Text>
                <Text variant="bodySmall" style={styles.calendarDesc}>
                  予定を自動で取り込みます
                </Text>
              </View>
              <Switch
                value={googleCalendar}
                onValueChange={setGoogleCalendar}
                color="#4A90E2"
              />
            </Card.Content>
          </Card>

          <Card style={styles.calendarCard}>
            
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text variant="titleMedium" style={styles.calendarName}>
                  Appleカレンダー
                </Text>
                <Text variant="bodySmall" style={styles.calendarDesc}>
                  iPhoneの予定と同期します
                </Text>
              </View>
              <Switch
                value={appleCalendar}
                onValueChange={setAppleCalendar}
                color="#4A90E2"
              />
            </Card.Content>
          </Card>
        </View>

        <View style={styles.infoBox}>
          <Text variant="bodySmall" style={styles.infoText}>
            💡 カレンダー連携で、会議前後の時間を自動調整し、集中タスクを最適な時間に配置します
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          mode="text"
          onPress={handleSkip}
          style={styles.skipButton}
        >
          スキップ
        </Button>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
          contentStyle={styles.buttonContent}
          disabled={!googleCalendar && !appleCalendar}
        >
          次へ
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E6F2FF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#172B4D',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#253858',
    lineHeight: 24,
    marginBottom: 32,
  },
  calendarOptions: {
    gap: 16,
    marginBottom: 24,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
  },
  calendarName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 4,
  },
  calendarDesc: {
    fontSize: 14,
    color: '#5E6C84',
  },
  infoBox: {
    backgroundColor: '#E6F2FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#172B4D',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DFE1E6',
  },
  skipButton: {
    flex: 1,
  },
  button: {
    flex: 2,
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
});
