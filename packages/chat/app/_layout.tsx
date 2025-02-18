import { Stack, usePathname } from "expo-router";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {
    let title = 'Orbiting';
    
    switch (pathname) {
      case '/history':
        title = `${t('history')} | Orbiting`;
        break;
      case '/settings':
        title = `${t('settings')} | Orbiting`;
        break;
      case '/help':
        title = `${t('help')} | Orbiting`;
        break;
      case '/about':
        title = `${t('about')} | Orbiting`;
        break;
    }

    if (typeof document !== 'undefined') {
      document.title = title;
    }
  }, [pathname, t]);
  
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
