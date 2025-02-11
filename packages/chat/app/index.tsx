import { useEffect } from 'react';
import HomeScreen from "./components/HomeScreen";

export default function Index() {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        try {
          // Dynamic import of service worker
          await import('./service-worker');
          const registration = await navigator.serviceWorker.register('/service-worker.js');
          console.log('SW registered:', registration);
        } catch (error) {
          console.log('SW registration failed:', error);
        }
      }
    };

    window.addEventListener('load', registerServiceWorker);
    return () => window.removeEventListener('load', registerServiceWorker);
  }, []);

  return <HomeScreen />;
}
