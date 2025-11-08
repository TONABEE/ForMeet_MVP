import { Stack } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';

export default function PlanningLayout() {
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
        name="morning-prompt"
        options={{
          title: '今日の計画',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="task-selection"
        options={{
          title: 'タスク選択',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="buffer-insertion"
        options={{
          title: 'バッファ追加',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
