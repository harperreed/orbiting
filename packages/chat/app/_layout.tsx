import { Stack } from "expo-router";
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { TextProvider } from '../app/context/TextContext';
import { SettingsProvider } from '../app/context/SettingsContext';

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
      <SettingsProvider>
        <TextProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </TextProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
