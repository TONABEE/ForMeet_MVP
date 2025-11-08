import { Stack } from 'expo-router';
import { FormeetTheme } from '@/constants/theme';

export default function VoiceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        contentStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    />
  );
}
