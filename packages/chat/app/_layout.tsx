import { Stack } from "expo-router";
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, useColorScheme } from 'react-native';
import { ThemeManager, Colors, Typography, Spacings } from 'react-native-ui-lib';
import { TextProvider } from '../app/context/TextContext';
import { SettingsProvider } from '../app/context/SettingsContext';

// Initialize theme
ThemeManager.setComponentTheme('Text', {
  body: true
});

// Colors
Colors.loadColors({
  primary: '#6750A4',
  secondary: '#625B71'
});

// Typography
Typography.loadTypographies({
  heading: { fontSize: 36, fontWeight: '600' },
  subheading: { fontSize: 28, fontWeight: '500' },
  body: { fontSize: 18, fontWeight: '400' }
});

// Spacings
Spacings.loadSpacings({
  page: 20,
  card: 12,
  gridGutter: 16
});

export default function RootLayout() {
  // Client-side only rendering
  const [isClient, setIsClient] = useState(false);
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <View />;
  }
  
  // Set color scheme
  useEffect(() => {
    Colors.setScheme(colorScheme === 'dark' ? 'dark' : 'light');
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <SettingsProvider>
          <TextProvider>
            <Stack 
              screenOptions={{ 
                headerShown: false,
                contentStyle: { flex: 1 }
              }} 
            />
          </TextProvider>
        </SettingsProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
