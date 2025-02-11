import { Colors, Typography, Spacings } from 'react-native-ui-lib';

// Colors
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  text: {
    primary: '#000000',
    secondary: '#666666',
    disabled: '#999999',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
  },
  border: '#E1E1E1',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FFCC00',
};

// Typography
export const typography = {
  text: {
    h1: { fontSize: 32, fontWeight: '700', lineHeight: 41 },
    h2: { fontSize: 24, fontWeight: '600', lineHeight: 31 },
    h3: { fontSize: 20, fontWeight: '600', lineHeight: 25 },
    body: { fontSize: 16, lineHeight: 22 },
    bodySmall: { fontSize: 14, lineHeight: 19 },
    caption: { fontSize: 12, lineHeight: 16 },
  },
};

// Spacing
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  round: 999,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Initialize theme
export function initializeTheme() {
  // Load colors
  Colors.loadColors(colors);

  // Load typography
  Typography.loadTypographies({
    ...typography.text,
  });

  // Load spacings
  Spacings.loadSpacings(spacing);
}
