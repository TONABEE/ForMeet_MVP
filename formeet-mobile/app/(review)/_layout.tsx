import { Stack } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';

export default function ReviewLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: FormeetTheme.colors.background.default,
        },
        headerTintColor: FormeetTheme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="daily-report"
        options={{
          title: '日報を作成',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
