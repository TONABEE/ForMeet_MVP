/**
 * Formeet デザイントークン
 * 
 * Atlassian Design Systemをベースにカスタマイズ
 * 参照: 09_Figma設計ガイド_Phase1.md
 */

import { Platform } from 'react-native';

export const FormeetTheme = {
  colors: {
    // Primary (Formeet Blue)
    primary: '#4A90E2',
    primaryHover: '#5FA3F5',
    primaryPressed: '#3A7BC8',
    primaryBackground: '#E6F2FF',

    // Success
    success: '#36B37E',
    successBackground: '#E3FCEF',

    // Warning
    warning: '#FFAB00',
    warningBackground: '#FFF7D6',

    // Error
    error: '#FF5630',
    errorBackground: '#FFEBE6',

    // Neutral
    text: {
      primary: '#172B4D',    // Neutral-1000 (見出し)
      secondary: '#253858',  // Neutral-900 (本文)
      tertiary: '#6B778C',   // Neutral-400 (補足)
    },
    background: {
      default: '#FFFFFF',    // Neutral-0
      subtle: '#F4F5F7',     // Neutral-100
    },
    border: '#DFE1E6',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  typography: {
    heading: {
      h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
      },
      h2: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
      },
      h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
      },
      h4: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
      },
    },
    body: {
      regular: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
      },
      bold: {
        fontSize: 14,
        fontWeight: '600' as const,
        lineHeight: 20,
      },
      small: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
      },
    },
    caption: {
      fontSize: 11,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  },

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 16,
    full: 999,
  },

  elevation: {
    level1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
      elevation: 1,
    },
    level2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 2,
    },
    level3: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 3,
    },
  },
};

// React Native Paper テーマ設定
export const paperTheme = {
  colors: {
    primary: FormeetTheme.colors.primary,
    secondary: FormeetTheme.colors.primaryHover,
    error: FormeetTheme.colors.error,
    background: FormeetTheme.colors.background.default,
    surface: FormeetTheme.colors.background.subtle,
    text: FormeetTheme.colors.text.primary,
    onSurface: FormeetTheme.colors.text.secondary,
    disabled: FormeetTheme.colors.text.tertiary,
    placeholder: FormeetTheme.colors.text.tertiary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  roundness: FormeetTheme.borderRadius.md,
};

// 後方互換性のため既存のColorsも保持
export const Colors = {
  light: {
    text: FormeetTheme.colors.text.primary,
    background: FormeetTheme.colors.background.default,
    tint: FormeetTheme.colors.primary,
    icon: FormeetTheme.colors.text.tertiary,
    tabIconDefault: FormeetTheme.colors.text.tertiary,
    tabIconSelected: FormeetTheme.colors.primary,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
