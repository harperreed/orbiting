import { Stack } from "expo-router";
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { TextProvider } from '../app/context/TextContext';
import { SettingsProvider } from '../app/context/SettingsContext';

const theme = {
  ...MD3LightTheme,
  // You can customize the theme here
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750A4',
    secondary: '#625B71',
  },
};

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
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SettingsProvider>
          <TextProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </TextProvider>
        </SettingsProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
