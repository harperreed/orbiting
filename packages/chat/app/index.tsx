import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import HomeScreen from "./components/HomeScreen";

export default function Index() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const initServiceWorker = () => {
        import('./utils/registerServiceWorker')
          .then(({ registerServiceWorker }) => registerServiceWorker())
          .catch(error => console.error('Failed to load SW registration:', error));
      };

      window.addEventListener('load', initServiceWorker);
      return () => window.removeEventListener('load', initServiceWorker);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const metaTags = [
        { property: 'og:title', content: 'Orbiting' },
        { property: 'og:description', content: 'A text display app' },
        { property: 'og:image', content: 'https://orbiting.com/imgs/og.png' }
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
  }, []);

  return <HomeScreen />;
}
