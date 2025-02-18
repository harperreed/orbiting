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
    let ogTitle = 'Orbiting';
    let ogDescription = 'A simple messaging app for your eyeballs. You can use it to type and display messages to those around you. Display a message loud and clear.';
    let ogImage = 'https://orbiting.com/imgs/og.png';

    switch (pathname) {
      case '/history':
        title = `${t('history')} | Orbiting`;
        ogTitle = `${t('history')} | Orbiting`;
        break;
      case '/settings':
        title = `${t('settings')} | Orbiting`;
        ogTitle = `${t('settings')} | Orbiting`;
        break;
      case '/help':
        title = `${t('help')} | Orbiting`;
        ogTitle = `${t('help')} | Orbiting`;
        break;
      case '/about':
        title = `${t('about')} | Orbiting`;
        ogTitle = `${t('about')} | Orbiting`;
        break;
    }

    if (typeof document !== 'undefined') {
      document.title = title;

      const metaTags = [
        { property: 'og:title', content: ogTitle },
        { property: 'og:description', content: ogDescription },
        { property: 'og:image', content: ogImage },
        { property: 'og:url', content: window.location.href },
        { property: 'og:type', content: 'website' }
      ];

      metaTags.forEach(({ property, content }) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', property);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      });
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
