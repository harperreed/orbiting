import { Stack } from "expo-router";
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { TextProvider } from '../app/context/TextContext';
import { ThemeManager } from 'react-native-ui-lib';
import { initializeTheme, typography } from './theme/theme';

// Initialize theme
initializeTheme();

// Configure default component themes
ThemeManager.setComponentTheme('Text', {
  body: true,
  color: 'text.primary'
});

ThemeManager.setComponentTheme('View', {
  backgroundColor: 'background.primary'
});

ThemeManager.setComponentTheme('Button', {
  backgroundColor: 'primary',
  labelStyle: typography.text.body
});

export default function RootLayout() {
  // Client-side only rendering
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <View />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TextProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TextProvider>
    </GestureHandlerRootView>
  );
}
