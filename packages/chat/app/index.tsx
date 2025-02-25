import { useEffect } from 'react';
import { Platform } from 'react-native';
import HomeScreen from "./components/HomeScreen";

export default function Index() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const metaTags = [
        { property: 'og:title', content: 'Orbiting' },
        { property: 'og:description', content: 'A simple messaging app for your eyeballs. You can use it to type and display messages to those around you. Display a message loud and clear.' },
        { property: 'og:image', content: 'https://orbiting.com/imgs/og.png' },
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
  }, []);

  return <HomeScreen />;
}
