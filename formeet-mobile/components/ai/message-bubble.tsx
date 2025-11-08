import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { FormeetTheme } from '@/constants/theme';

interface MessageBubbleProps {
  message: string;
  showAvatar?: boolean;
  avatarSize?: number;
}

export function MessageBubble({
  message,
  showAvatar = true,
  avatarSize = 40
}: MessageBubbleProps) {
  return (
    <View style={styles.container}>
      {showAvatar && (
        <Avatar.Icon
          size={avatarSize}
          icon="robot"
          style={styles.avatar}
          color={FormeetTheme.colors.primary}
        />
      )}
      <View style={styles.bubble}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: FormeetTheme.spacing.sm,
    paddingHorizontal: FormeetTheme.spacing.md,
  },
  avatar: {
    backgroundColor: FormeetTheme.colors.primaryBackground,
    marginRight: FormeetTheme.spacing.sm,
  },
  bubble: {
    flex: 1,
    backgroundColor: FormeetTheme.colors.primaryBackground,
    borderRadius: FormeetTheme.borderRadius.md,
    padding: FormeetTheme.spacing.md,
    ...FormeetTheme.elevation.level1,
  },
  messageText: {
    ...FormeetTheme.typography.body.regular,
    color: FormeetTheme.colors.text.secondary,
  },
});
