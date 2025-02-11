import { Stack } from "expo-router";
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, useColorScheme } from 'react-native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { TextProvider } from '../app/context/TextContext';
import { SettingsProvider } from '../app/context/SettingsContext';

const customColors = {
  primary: '#6750A4',
  secondary: '#625B71',
};

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
  
  const theme = colorScheme === 'dark' 
    ? {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,
          ...customColors,
        }
      }
    : {
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,
          ...customColors,
        }
      };

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1, height: '100%' }}>
        <SettingsProvider>
          <TextProvider>
            <Stack 
              screenOptions={{ 
                headerShown: false,
                contentStyle: { flex: 1, height: '100%' } 
              }} 
            />
          </TextProvider>
        </SettingsProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
