import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="visual-setup" />
      <Stack.Screen name="audio-setup" />
      <Stack.Screen name="calendar-sync" />
      <Stack.Screen name="ai-assessment-1" />
      <Stack.Screen name="ai-assessment-2" />
      <Stack.Screen name="ai-tone" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
