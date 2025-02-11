import { Stack } from "expo-router";
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { TextProvider } from '../app/context/TextContext';
import { Typography, ThemeManager, Colors } from 'rnui-lib';

// Initialize RNUIlib
Typography.loadTypographies({
  heading: { fontSize: 24, fontWeight: '600' },
  subheading: { fontSize: 18, fontWeight: '500' },
  body: { fontSize: 16 },
});

ThemeManager.setComponentTheme('Text', {
  body: true
});

Colors.loadColors({
  primaryColor: '#007AFF',
  secondaryColor: '#5856D6',
  textColor: '#000000',
  errorColor: '#FF3B30',
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
