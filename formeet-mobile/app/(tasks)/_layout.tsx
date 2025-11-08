import { Stack } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';

export default function TasksLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: FormeetTheme.colors.background.default,
        },
        headerTintColor: FormeetTheme.colors.text.primary,
        headerTitleStyle: {
          ...FormeetTheme.typography.heading.h3,
        },
      }}
    >
      <Stack.Screen
        name="today"
        options={{
          title: '今日のタスク',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="detail"
        options={{
          title: 'タスク詳細',
          headerShown: true,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="first-step"
        options={{
          title: '最初の一歩',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="in-progress"
        options={{
          title: 'タスク実行中',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
