import { Stack } from "expo-router";
import { useEffect, useState } from 'react';
import './i18n/config';
import { WelcomeModal } from './components/WelcomeModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { TextProvider } from '../app/context/TextContext';
import { SettingsProvider, useSettings } from '../app/context/SettingsContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const { currentTheme } = useSettings();
  
  return (
    <PaperProvider theme={currentTheme}>
      <TextProvider>
        <>
          <WelcomeModal />
          <Stack 
            screenOptions={{ 
              headerShown: false,
              contentStyle: { flex: 1 }
            }} 
          />
        </>
      </TextProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <View />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
